import { IS_STATIC } from '../lib/api';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Frame, NodeCloud } from '../lib/api';
import { useT } from '../lib/i18n';

/** Base tint per anatomical group, matching the template's atlas palette. */
const GROUP_COLOR: Record<string, [number, number, number]> = {
  optic: [0.30, 0.44, 0.50],
  central: [0.46, 0.44, 0.40],
  descending: [0.66, 0.54, 0.33],
  vnc: [0.50, 0.44, 0.60],
  other: [0.28, 0.31, 0.31],
};

type Props = {
  cloud: NodeCloud;
  frame: Frame | null;
  seeds: number[];
  selected: number | null;
  onPick: (bodyId: number, additive: boolean) => void;
};

/**
 * The whole central nervous system as one point cloud: brain, optic lobes and
 * nerve cord in one frame, so a signal crossing from one to the other is visible
 * as movement down the screen rather than as a number.
 *
 * Activation is signed. Positive drive reads cyan through white; net inhibition
 * reads orange through red. Neurons the model never reaches keep their
 * anatomical base colour.
 */
export function CnsScene({ cloud, frame, seeds, selected, onPick }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const frameRef = useRef(frame);
  const seedRef = useRef(seeds);
  const selectedRef = useRef(selected);
  const repaint = useRef<(() => void) | null>(null);
  const resetView = useRef<((axis: 'front' | 'side') => void) | null>(null);
  const [orbiting, setOrbiting] = useState(false);
  const orbit = useRef(false);
  const { t } = useT();
  // Held in a ref, not a dependency: App rebuilds onPick whenever the seed set
  // changes, and tearing the scene down for that would throw away the camera
  // angle the moment you click a neuron.
  const pickRef = useRef(onPick);
  useEffect(() => { pickRef.current = onPick; }, [onPick]);

  useEffect(() => { frameRef.current = frame; repaint.current?.(); }, [frame]);
  useEffect(() => { seedRef.current = seeds; repaint.current?.(); }, [seeds]);
  useEffect(() => { selectedRef.current = selected; repaint.current?.(); }, [selected]);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;

    const count = cloud.count;
    const positions = new Float32Array(cloud.xyz);
    const ids = new Int32Array(cloud.ids);
    const indexOf = new Map<number, number>();
    for (let i = 0; i < count; i++) indexOf.set(ids[i], i);

    // Base colour is fixed anatomy; the shader mixes activity in on top.
    const base = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const rgb = GROUP_COLOR[cloud.groupNames[cloud.group[i]]] ?? GROUP_COLOR.other;
      base[i * 3] = rgb[0]; base[i * 3 + 1] = rgb[1]; base[i * 3 + 2] = rgb[2];
    }
    const activity = new Float32Array(count);
    const marker = new Float32Array(count);   // 1 = seed, 2 = selected

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-3, 3, 2, -2, 0.01, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    element.appendChild(renderer.domElement);

    const anatomy = new THREE.Group();
    scene.add(anatomy);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('base', new THREE.BufferAttribute(base, 3));
    geometry.setAttribute('activity', new THREE.BufferAttribute(activity, 1));
    geometry.setAttribute('marker', new THREE.BufferAttribute(marker, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        // Set while a simulation is loaded, to fade the inactive anatomy back.
        hasSignal: { value: 0 },
      },
      vertexShader: `
        attribute vec3 base; attribute float activity; attribute float marker;
        varying vec3 vBase; varying float vAct; varying float vMark;
        uniform float pixelRatio;
        void main() {
          vBase = base; vAct = activity; vMark = marker;
          // A handful of neurons out of 140,000 carry the signal, and after a few
          // hops their share of the peak is tiny. Gamma-boosting the displayed
          // strength keeps a weak-but-real arrival visible instead of invisible.
          float strength = pow(abs(activity), 0.45);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = (0.85 + strength * 6.0 + marker * 4.0) * pixelRatio;
        }`,
      fragmentShader: `
        varying vec3 vBase; varying float vAct; varying float vMark;
        uniform float hasSignal;
        void main() {
          float r = length(gl_PointCoord - vec2(0.5));
          if (r > 0.5) discard;
          float strength = pow(abs(vAct), 0.45);
          vec3 hot = vAct >= 0.0 ? vec3(0.15, 0.85, 1.0) : vec3(1.0, 0.45, 0.22);
          vec3 color = mix(vBase, hot, smoothstep(0.0, 0.25, strength));
          color = mix(color, vec3(1.0), smoothstep(0.6, 1.0, strength) * 0.85);
          if (vMark > 1.5) color = vec3(1.0, 0.95, 0.4);
          else if (vMark > 0.5) color = mix(color, vec3(0.5, 1.0, 0.55), 0.8);
          float quiet = mix(0.26, 0.07, hasSignal);
          float alpha = (quiet + 0.85 * strength + vMark * 0.5)
                      * (1.0 - smoothstep(0.18, 0.5, r));
          gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
        }`,
    });
    anatomy.add(new THREE.Points(geometry, material));

    const bounds = new THREE.Box3().setFromBufferAttribute(
      geometry.getAttribute('position') as THREE.BufferAttribute);
    const size = bounds.getSize(new THREE.Vector3());

    const fit = () => {
      const { width, height } = element.getBoundingClientRect();
      renderer.setSize(Math.max(1, width), Math.max(1, height), false);
      const aspect = Math.max(1, width) / Math.max(1, height);
      const half = (Math.max(size.x, size.y, size.z) / 2) * 1.1;
      camera.top = half; camera.bottom = -half;
      camera.left = -half * aspect; camera.right = half * aspect;
      camera.position.set(0, 0, 10);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };

    const paint = () => {
      if (disposed) return;
      activity.fill(0);
      marker.fill(0);
      for (const [bodyId, value] of frameRef.current?.values ?? []) {
        const i = indexOf.get(bodyId);
        if (i !== undefined) activity[i] = value;
      }
      for (const bodyId of seedRef.current) {
        const i = indexOf.get(bodyId);
        if (i !== undefined) marker[i] = 1;
      }
      const chosen = selectedRef.current;
      if (chosen !== null) {
        const i = indexOf.get(chosen);
        if (i !== undefined) marker[i] = 2;
      }
      geometry.getAttribute('activity').needsUpdate = true;
      geometry.getAttribute('marker').needsUpdate = true;
      material.uniforms.hasSignal.value = frameRef.current ? 1 : 0;
      renderer.render(scene, camera);
    };
    repaint.current = paint;

    resetView.current = (axis) => {
      anatomy.rotation.set(0, axis === 'side' ? Math.PI / 2 : 0, 0);
      fit();
    };

    // Picking: project every soma once per click and take the nearest on screen.
    // At this point count that beats a raycaster and is far more forgiving.
    const pick = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      anatomy.updateMatrixWorld();
      const matrix = new THREE.Matrix4()
        .multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
        .multiply(anatomy.matrixWorld);
      const point = new THREE.Vector3();
      let best = -1;
      let bestScore = Infinity;
      for (let i = 0; i < count; i++) {
        point.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
          .applyMatrix4(matrix);
        const dx = point.x - nx, dy = point.y - ny;
        const distance = dx * dx + dy * dy;
        if (distance > 0.0009) continue;               // roughly 15 px
        // Prefer an active neuron when several overlap under the cursor.
        const score = distance * (1 - Math.min(0.85, Math.abs(activity[i])));
        if (score < bestScore) { bestScore = score; best = i; }
      }
      if (best >= 0) pickRef.current(ids[best], event.shiftKey);
    };

    let held = false, moved = false, lastX = 0, lastY = 0;
    const down = (event: PointerEvent) => {
      held = true; moved = false; lastX = event.clientX; lastY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (!held) return;
      const dx = event.clientX - lastX, dy = event.clientY - lastY;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      anatomy.rotation.y += dx * 0.006;
      anatomy.rotation.x += dy * 0.006;
      lastX = event.clientX; lastY = event.clientY;
      fit();
    };
    const up = (event: PointerEvent) => {
      if (held && !moved) pick(event);
      held = false;
    };
    const canvas = renderer.domElement;
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', () => { held = false; });

    const observer = new ResizeObserver(fit);
    observer.observe(element);
    fit();
    paint();

    let raf = 0, previous = performance.now();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animate = (now: number) => {
      const dt = Math.min(0.05, (now - previous) / 1000);
      previous = now;
      if (orbit.current && !held && !reduced.matches && !document.hidden) {
        anatomy.rotation.y += dt * 0.12;
        renderer.render(scene, camera);
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      repaint.current = null;
      resetView.current = null;
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, [cloud]);

  return <>
    <div className="brain-view-controls">
      <button onClick={() => { orbit.current = false; setOrbiting(false); resetView.current?.('front'); }}>{t('cns.front')}</button>
      <button onClick={() => { orbit.current = false; setOrbiting(false); resetView.current?.('side'); }}>{t('cns.side')}</button>
      <button aria-pressed={orbiting} onClick={() => { orbit.current = !orbit.current; setOrbiting(orbit.current); }}>
        {orbiting ? t('cns.orbitOn') : t('cns.orbitOff')}
      </button>
    </div>
    <div className="brain-legend">{t(IS_STATIC ? 'static.legend' : 'cns.legend')}</div>
    <div ref={host} className="three-viewport brain-viewport" aria-label={t(IS_STATIC ? 'static.cnsAria' : 'cns.aria')} />
  </>;
}
