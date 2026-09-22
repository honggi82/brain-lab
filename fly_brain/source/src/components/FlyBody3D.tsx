import { bodyDrives, jointAngle, netDrive } from '../lib/bodyPose';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { asset } from '../lib/atlas';
import type { Posture, Summary } from '../lib/api';
import { useT } from '../lib/i18n';

type BodyNode = { name: string; parent: number; pos: number[]; quat: number[] };
type JointNode = {
  name: string; body: number; axis: number[]; pos: number[]; range: number[];
  limb: string | null; key: string | null; weight: number;
};
type PartNode = {
  body: number; material: string;
  positionOffset: number; positionCount: number;
  indexOffset: number; indexCount: number;
};
type Model = {
  binary: string; materials: Record<string, number[]>;
  bodies: BodyNode[]; joints: JointNode[]; parts: PartNode[];
  sourceTriangles: number; outputTriangles: number;
};

/** Which limb each body belongs to, so a leg can be tinted as a whole. */
const LIMB_OF_BODY = (name: string): string | null => {
  const leg = name.match(/(T[123])_(left|right)/);
  if (leg) {
    const part = { T1: 'front leg', T2: 'middle leg', T3: 'hind leg' }[leg[1]];
    return `${leg[2] === 'left' ? 'L' : 'R'} ${part}`;
  }
  if (name.startsWith('wing_')) return name.endsWith('left') ? 'L wing' : 'R wing';
  if (name.startsWith('haltere_')) return name.endsWith('left') ? 'L haltere' : 'R haltere';
  if (name === 'head' || name.startsWith('antenna') || name === 'rostrum'
      || name.startsWith('haustellum') || name.startsWith('labrum')) return 'M neck';
  if (name.startsWith('abdomen')) return 'M abdomen';
  return null;
};

/** MuJoCo quaternions are (w, x, y, z); three.js wants (x, y, z, w). */
const toThreeQuat = (q: number[]) => new THREE.Quaternion(q[1], q[2], q[3], q[0]);

type Props = { summary: Summary | null; posture: Posture | null; direction: string };

/**
 * The full Flybody model, posed by the simulation.
 *
 * Every segment MuJoCo defines is here -- six legs down to the tarsal claws,
 * wings, halteres, antennae, eight abdominal segments -- with the kinematic
 * tree intact. A joint's angle comes from the balance between the motor pools
 * that pull it each way, so "Ti extensor fires harder than Ti flexor" shows up
 * as the knee straightening rather than as a number in a table.
 */
export function FlyBody3D({ summary, posture, direction }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const postureRef = useRef(posture);
  const summaryRef = useRef(summary);
  const apply = useRef<(() => void) | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [detail, setDetail] = useState<{ segments: number; joints: number; tris: number } | null>(null);
  const [failure, setFailure] = useState('');
  const { t, limb: tLimb, part: tPart } = useT();

  useEffect(() => { postureRef.current = posture; apply.current?.(); }, [posture]);
  useEffect(() => { summaryRef.current = summary; apply.current?.(); }, [summary]);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const controller = new AbortController();
    let disposed = false;

    const scene = new THREE.Scene();
    // MuJoCo is z-up; tip the whole model so the browser's y-up camera reads it.
    const root = new THREE.Group();
    root.rotation.x = -Math.PI / 2;
    scene.add(root);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.001, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    element.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffedda, 0x18202a, 2.4));
    const key = new THREE.DirectionalLight(0xffdfb2, 3.2);
    key.position.set(2, 3, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x9ad7ef, 1.4);
    rim.position.set(-3, 1, -2);
    scene.add(rim);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.minDistance = 0.4;
    controls.maxDistance = 6;

    const resize = () => {
      const { width, height } = element.getBoundingClientRect();
      renderer.setSize(Math.max(1, width), Math.max(1, height), false);
      camera.aspect = Math.max(1, width) / Math.max(1, height);
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    controls.addEventListener('change', () => renderer.render(scene, camera));

    void (async () => {
      const get = async (path: string) => {
        const response = await fetch(asset(`data/flybody-full/${path}`),
          { signal: controller.signal });
        if (!response.ok) throw Error(`Flybody asset unavailable: ${path}`);
        return response;
      };
      const model = await (await get('model.json')).json() as Model;
      const buffer = await (await get(model.binary)).arrayBuffer();
      if (disposed) return;

      const materials: Record<string, THREE.MeshStandardMaterial> = {};
      for (const [name, rgba] of Object.entries(model.materials)) {
        materials[name] = new THREE.MeshStandardMaterial({
          color: new THREE.Color(rgba[0], rgba[1], rgba[2]),
          roughness: 0.62,
          metalness: 0.02,
          transparent: rgba[3] < 1,
          opacity: rgba[3],
          side: rgba[3] < 1 ? THREE.DoubleSide : THREE.FrontSide,
        });
      }
      const fallback = new THREE.MeshStandardMaterial({ color: 0x9e6834, roughness: 0.65 });

      // Build the kinematic tree. Each joint becomes a pivot pair so the
      // rotation happens about the axis position MuJoCo specifies, not about
      // the segment origin.
      const containers: THREE.Object3D[] = [];
      const pivots = new Map<string, THREE.Object3D>();

      model.bodies.forEach((body, index) => {
        const frame = new THREE.Object3D();
        frame.position.fromArray(body.pos);
        frame.quaternion.copy(toThreeQuat(body.quat));
        (body.parent < 0 ? root : containers[body.parent]).add(frame);

        let container: THREE.Object3D = frame;
        for (const joint of model.joints.filter(j => j.body === index)) {
          const pivot = new THREE.Object3D();
          pivot.position.fromArray(joint.pos);
          const inner = new THREE.Object3D();
          inner.position.fromArray(joint.pos).negate();
          container.add(pivot);
          pivot.add(inner);
          container = inner;
          pivots.set(joint.name, pivot);
        }
        containers[index] = container;
      });

      // One mesh per part, so each segment stays separately tintable and a
      // single leg can light up on its own.
      const limbMeshes = new Map<string, THREE.Mesh[]>();
      for (const part of model.parts) {
        const positions = new Float32Array(
          buffer.slice(part.positionOffset, part.positionOffset + part.positionCount * 12));
        const indices = new Uint32Array(
          buffer.slice(part.indexOffset, part.indexOffset + part.indexCount * 4));
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));
        geometry.computeVertexNormals();
        const base = materials[part.material] ?? fallback;
        const mesh = new THREE.Mesh(geometry, base.clone());
        containers[part.body].add(mesh);

        const limb = LIMB_OF_BODY(model.bodies[part.body].name);
        if (limb) {
          if (!limbMeshes.has(limb)) limbMeshes.set(limb, []);
          limbMeshes.get(limb)!.push(mesh);
        }
      }

      const driven = model.joints
        .filter(j => j.key && j.limb && pivots.has(j.name))
        .map(j => ({
          name: j.name,
          pivot: pivots.get(j.name)!,
          axis: new THREE.Vector3().fromArray(j.axis).normalize(),
          lower: Math.min(j.range[0], j.range[1]),
          upper: Math.max(j.range[0], j.range[1]),
          limb: j.limb!,
          key: j.key!,
          weight: j.weight,
        }));

      const baseColors = new Map<THREE.Mesh, THREE.Color>();
      const excited = new THREE.Color(0.12, 0.80, 1.0);
      const inhibited = new THREE.Color(1.0, 0.42, 0.18);

      const pose = () => {
        if (disposed) return;
        const current = postureRef.current;
        for (const joint of driven) {
          joint.pivot.quaternion.setFromAxisAngle(joint.axis, jointAngle(current, joint));
        }

        const motor = bodyDrives(summaryRef.current?.motorOutput ?? {});
        let peak = 1e-6;
        for (const value of Object.values(motor)) {
          peak = Math.max(peak, Math.abs(netDrive(value)));
        }
        for (const [limb, meshes] of limbMeshes) {
          const value = motor[limb];
          const net = netDrive(value) / peak;
          const strength = Math.min(1, Math.pow(Math.abs(net), 0.55));
          for (const mesh of meshes) {
            const material = mesh.material as THREE.MeshStandardMaterial;
            if (!baseColors.has(mesh)) baseColors.set(mesh, material.color.clone());
            material.color.copy(baseColors.get(mesh)!);
            if (strength > 0.01) {
              material.color.lerp(net >= 0 ? excited : inhibited, strength * 0.85);
              material.emissive.copy(net >= 0 ? excited : inhibited)
                .multiplyScalar(strength * 0.22);
            } else {
              material.emissive.setRGB(0, 0, 0);
            }
          }
        }
        renderer.render(scene, camera);
      };
      for (const material of Object.values(materials)) material.dispose();
      fallback.dispose();
      apply.current = pose;

      root.updateMatrixWorld(true);
      const bounds = new THREE.Box3().setFromObject(root);
      root.position.sub(bounds.getCenter(new THREE.Vector3()));
      const radius = bounds.getBoundingSphere(new THREE.Sphere()).radius;
      camera.position.set(0.85, 0.55, 1.25).normalize()
        .multiplyScalar((radius / Math.sin((camera.fov * Math.PI) / 360)) * 0.85);
      controls.target.set(0, 0, 0);
      controls.update();

      setDetail({ segments: model.bodies.length, joints: driven.length,
                  tris: model.outputTriangles });
      setState('ready');
      resize();
      pose();
    })().catch(error => { if (!disposed) { setState('error'); setFailure(String(error)); } });

    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();

    return () => {
      disposed = true;
      apply.current = null;
      controller.abort();
      observer.disconnect();
      controls.dispose();
      root.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          (object.material as THREE.Material).dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  const rows = Object.entries(summary?.motorOutput ?? {})
    .map(([limb, v]) => ({ limb, ...v }))
    .sort((a, b) => Math.abs(netDrive(b)) - Math.abs(netDrive(a)))
    .slice(0, 6);

  const jointRows = Object.entries(posture ?? {})
    .flatMap(([limb, joints]) =>
      Object.entries(joints).map(([key, value]) => ({ limb, key, ...value })))
    .sort((a, b) => Math.abs(b.angle) - Math.abs(a.angle))
    .slice(0, 8);

  return <div className="flybody">
    <div ref={host} className="flybody-view" aria-label={t('body.aria')}>
      {state !== 'ready' &&
        <span className="neural-load" role="status">
          {state === 'error' ? failure : t('body.loading')}
        </span>}
    </div>
    <div className="flybody-side">
      <p className="bodymap-caption">
        {t(direction === 'upstream' ? 'body.captionUp' : 'body.captionDown')}
      </p>
      {rows.length === 0
        ? <p className="muted">{t('body.noMotor')}</p>
        : <table className="bodymap-table">
            <thead><tr>
              <th>{t('body.limb')}</th><th>{t('body.drive')}</th>
              <th>{t('body.brake')}</th><th>{t('body.active')}</th>
            </tr></thead>
            <tbody>
              {rows.map(row => <tr key={row.limb}>
                <td>{tLimb(row.limb)}</td>
                <td className="pos">{row.excite.toFixed(3)}</td>
                <td className="neg">{row.inhibit.toFixed(3)}</td>
                <td>{row.active}/{row.neurons}</td>
              </tr>)}
            </tbody>
          </table>}
      {jointRows.length > 0 && <>
        <h4 className="flybody-heading">{t('body.jointBalance')}</h4>
        <ul className="joint-list">
          {jointRows.map(j => <li key={`${j.limb}-${j.key}`}>
            <span className="joint-name">{tLimb(j.limb)} {j.key}</span>
            <span className="joint-track">
              <span className="joint-fill" style={{
                width: `${Math.abs(j.angle) * 50}%`,
                [j.angle >= 0 ? 'left' : 'right']: '50%',
                background: j.angle >= 0 ? '#26d8ff' : '#ff7e3e',
              }} />
            </span>
            <span className="joint-value">{j.angle >= 0 ? '+' : ''}{j.angle.toFixed(2)}</span>
          </li>)}
        </ul>
      </>}
      {summary && Object.keys(summary.sensoryInvolved).length > 0 &&
        <p className="bodymap-sense">
          {t('body.sensoryReached')}: {Object.entries(summary.sensoryInvolved)
            .sort((a, b) => b[1].amount - a[1].amount).slice(0, 5)
            .map(([part, v]) => `${tPart(part)} ${v.active}`).join(' · ')}
        </p>}
      <p className="flybody-note">{t('body.netNote')}</p>
      <p className="flybody-note">{t('body.midlineNote')}</p>
      {detail && <p className="flybody-note">
        {detail.segments}{t('body.segments')} · {detail.joints}{t('body.drivenJoints')} · {' '}
        {detail.tris.toLocaleString()}{t('body.triangles')}
      </p>}
    </div>
  </div>;
}
