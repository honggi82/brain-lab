/* ==========================================================================
   BRAIN Lab. — 3D particle-brain hero
   Points are sampled on the real anatomical surfaces (cortex gyri & sulci,
   cerebellum, brainstem) of the Brain Atlas model — see
   assets/data/build-brain-points.py and about_brain/ATTRIBUTION.md (CC BY-SA 4.0).
   Scroll drives rotation and a lobe-by-lobe "dissection" (explode + reassemble);
   per-point surface normals give the cloud real 3D shading and visible folds.
   Falls back to a static image under reduced-motion / no-WebGL / load failure.
   Loads three.js from CDN as an ES module.
   ========================================================================== */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

(function () {
  var root = document.getElementById('brainhero');
  if (!root) return;
  var canvas = root.querySelector('.bhero__canvas');
  var beats = Array.prototype.slice.call(root.querySelectorAll('[data-beat]'));
  var hint = root.querySelector('.bhero__hint');
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var POINTS_URL = 'assets/data/brain-points.bin?v=20260924';

  // ---- helpers ----
  var clamp = function (x, a, b) { return Math.min(b, Math.max(a, x)); };
  var smooth = function (x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };

  function setBeats(progress) {
    // crossfade evenly through the beats: beat0 holds at the top, beatN at the end
    var n = beats.length; if (!n) return;
    var f = clamp(progress, 0, 1) * (n - 1);
    var idx = Math.min(n - 1, Math.floor(f));
    var frac = f - idx;
    var FADE = n <= 2 ? 0.55 : 0.85;   // fewer beats → give each a longer, more even hold
    var xf = frac < FADE ? 0 : smooth((frac - FADE) / (1 - FADE));
    for (var i = 0; i < n; i++) {
      var op = 0, ty = 0;
      if (i === idx) { op = 1 - xf; ty = -xf * 55; }          // slides up + out
      else if (i === idx + 1) { op = xf; ty = (1 - xf) * 55; } // rises in from below
      var b = beats[i];
      b.style.opacity = op;
      b.style.transform = 'translateY(' + ty.toFixed(1) + 'px)';
      b.style.pointerEvents = op > 0.6 ? 'auto' : 'none';
    }
  }

  // ---- static fallback ----
  function fallback() {
    root.classList.add('bhero--static');
    var img = document.createElement('img');
    img.src = 'assets/img/brain-silhouette.png'; img.alt = ''; img.className = 'bhero__fallback';
    canvas.parentNode.insertBefore(img, canvas); canvas.style.display = 'none';
    if (beats[0]) beats[0].style.opacity = 1;
  }

  // detect WebGL on a THROWAWAY canvas — never touch the real one, or Three
  // can't create its own context on it.
  var supported = (function () {
    try { var t = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (t.getContext('webgl') || t.getContext('experimental-webgl'))); }
    catch (e) { return false; }
  })();
  if (reduce || !supported) { fallback(); return; }

  fetch(POINTS_URL)
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
    .then(build)
    .catch(fallback);

  // ======================================================================
  // Decode the sampled anatomy and build the 3D cloud.
  // ======================================================================
  // region codes (build-brain-points.py): 0 frontal 1 parietal 2 temporal
  // 3 occipital 4 limbic 5 insula 6 other cortex 7 cerebellum 8 brainstem
  var PALETTE = [
    [0.21, 0.87, 1.00],   // frontal   — cyan
    [0.62, 0.55, 1.00],   // parietal  — violet
    [0.19, 0.90, 0.77],   // temporal  — teal
    [0.93, 0.52, 0.86],   // occipital — orchid
    [0.70, 0.62, 1.00],   // limbic    — lavender
    [1.00, 0.72, 0.42],   // insula    — amber (small, deep)
    [0.42, 0.72, 1.00],   // other     — blue
    [0.55, 0.78, 1.00],   // cerebellum — pale blue
    [0.47, 0.60, 0.95]    // brainstem — slate
  ];

  function build(buf) {
    var head = new DataView(buf, 0, 16);
    var magic = String.fromCharCode(head.getUint8(0), head.getUint8(1), head.getUint8(2), head.getUint8(3));
    if (magic !== 'BRP1') return fallback();
    var count = head.getUint32(4, true);
    var q = new Int16Array(buf, 16, count * 3);
    var qn = new Int8Array(buf, 16 + count * 6, count * 3);
    var region = new Uint8Array(buf, 16 + count * 9, count);
    var flags = new Uint8Array(buf, 16 + count * 10, count);

    // Data axes: x = right, y = up, z = anterior. Bake in a lateral view
    // (frontal lobe to the left of screen, left hemisphere facing the camera).
    var FIT = 1.02 / 32767;
    var positions = new Float32Array(count * 3);
    var normals = new Float32Array(count * 3);
    var i, x, y, z;
    for (i = 0; i < count; i++) {
      x = q[i * 3] * FIT; y = q[i * 3 + 1] * FIT; z = q[i * 3 + 2] * FIT;
      positions[i * 3] = -z; positions[i * 3 + 1] = y; positions[i * 3 + 2] = -x;
      x = qn[i * 3] / 127; y = qn[i * 3 + 1] / 127; z = qn[i * 3 + 2] / 127;
      normals[i * 3] = -z; normals[i * 3 + 1] = y; normals[i * 3 + 2] = -x;
    }

    // per-region, per-hemisphere centroids → dissection moves whole lobes apart
    var sums = {}, key;
    for (i = 0; i < count; i++) {
      key = region[i] * 2 + (positions[i * 3 + 2] > 0 ? 1 : 0);
      var s = sums[key] || (sums[key] = [0, 0, 0, 0]);
      s[0] += positions[i * 3]; s[1] += positions[i * 3 + 1]; s[2] += positions[i * 3 + 2]; s[3]++;
    }
    var yMin = Infinity, yMax = -Infinity;
    for (i = 0; i < count; i++) { y = positions[i * 3 + 1]; if (y < yMin) yMin = y; if (y > yMax) yMax = y; }

    var dirs = new Float32Array(count * 3);
    var colors = new Float32Array(count * 3);
    var CY = [0.21, 0.87, 1.0], VI = [0.62, 0.55, 1.0];
    for (i = 0; i < count; i++) {
      var px = positions[i * 3], py = positions[i * 3 + 1], pz = positions[i * 3 + 2];
      var c = sums[region[i] * 2 + (pz > 0 ? 1 : 0)];
      var cx = c[0] / c[3], cy = c[1] / c[3], cz = c[2] / c[3];
      // hemispheres part along the fissure, lobes drift out from the centre
      var hemi = region[i] <= 6 ? (pz > 0 ? 1 : -1) * 0.3 : 0;
      var dx = cx * 0.75 + normals[i * 3] * 0.22 + (Math.random() - 0.5) * 0.12;
      var dy = cy * 0.75 + normals[i * 3 + 1] * 0.22 + (Math.random() - 0.5) * 0.12 - (region[i] >= 7 ? 0.35 : 0);
      var dz = cz * 0.75 + hemi + normals[i * 3 + 2] * 0.22 + (Math.random() - 0.5) * 0.12;
      dirs[i * 3] = dx; dirs[i * 3 + 1] = dy; dirs[i * 3 + 2] = dz;

      // colour: brand gradient (cyan low → violet high) tinted by lobe
      var t = clamp((py - yMin) / (yMax - yMin || 1), 0, 1);
      var lobe = PALETTE[region[i]] || PALETTE[6];
      var fold = (flags[i] & 1) ? 0.42 : 1.0;          // sulcal walls sit deeper → dimmer
      var bright = (0.82 + Math.random() * 0.18) * fold;
      for (var k = 0; k < 3; k++) {
        var g = CY[k] + (VI[k] - CY[k]) * t;
        colors[i * 3 + k] = (g * 0.45 + lobe[k] * 0.55) * bright;
      }
    }

    // soft round sprite
    var tc = document.createElement('canvas'); tc.width = tc.height = 64;
    var tx = tc.getContext('2d');
    var grd = tx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.3, 'rgba(255,255,255,0.6)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    tx.fillStyle = grd; tx.fillRect(0, 0, 64, 64);
    var tex = new THREE.CanvasTexture(tc);

    // ---- three scene ----
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    var DPR = Math.min(2, window.devicePixelRatio || 1);
    renderer.setPixelRatio(DPR);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 3.25;

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geo.setAttribute('aDir', new THREE.BufferAttribute(dirs, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

    var mat = new THREE.ShaderMaterial({
      uniforms: {
        uExplode: { value: 0 }, uSize: { value: 9.0 * DPR }, uTex: { value: tex }, uDim: { value: 0 },
        uLight: { value: new THREE.Vector3(-0.45, 0.6, 0.66).normalize() }
      },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader:
        'attribute vec3 aDir; attribute vec3 aColor; uniform float uExplode; uniform float uSize; uniform vec3 uLight;' +
        'varying vec3 vColor; varying float vA;' +
        'void main(){' +
        '  vec3 p = position + aDir * uExplode;' +
        '  vec3 n = normalize(normalMatrix * normal);' +
        '  float diff = max(dot(n, uLight), 0.0);' +
        '  float facing = n.z;' +                                    // >0 toward camera
        '  float rim = pow(1.0 - abs(facing), 3.0);' +
        '  float shade = 0.16 + 0.84 * diff + 0.35 * rim;' +
        '  float front = smoothstep(-0.2, 0.3, facing);' +
        '  vColor = aColor * shade;' +
        '  vA = mix(0.06, 0.8, front) * (1.0 - clamp(uExplode * 0.3, 0.0, 0.35));' + // far side nearly hidden
        '  vA = max(vA, 0.18 * clamp(uExplode, 0.0, 1.0));' +
        '  vec4 mv = modelViewMatrix * vec4(p, 1.0);' +
        '  gl_PointSize = uSize * (1.0 / -mv.z);' +
        '  gl_Position = projectionMatrix * mv; }',
      fragmentShader:
        'uniform sampler2D uTex; uniform float uDim; varying vec3 vColor; varying float vA;' +
        'void main(){ vec4 t = texture2D(uTex, gl_PointCoord); if(t.a < 0.02) discard;' +
        'gl_FragColor = vec4(vColor * (1.0 - uDim*0.6), t.a * vA); }'
    });

    var points = new THREE.Points(geo, mat);
    points.position.x = 0.35;                 // sit centre-right, copy on the left
    scene.add(points);

    function resize() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      // on narrow screens pull the brain to centre and back a touch
      var mobile = w < 760;
      points.position.x = mobile ? 0 : 0.35;
      points.scale.setScalar(mobile ? 0.7 : 1);
      camera.position.z = mobile ? 3.9 : 3.25;
    }

    // ---- scroll state ----
    var progress = 0, curExplode = 0, curRotV = 0, tgtRotV = 0, clock = 0;
    function readScroll() {
      var r = root.getBoundingClientRect();
      var top = r.top + window.scrollY;
      var h = root.offsetHeight - window.innerHeight;
      progress = clamp((window.scrollY - top) / (h || 1), 0, 1);
      tgtRotV = progress * Math.PI * 2.2;                     // >1 full turn across the hero
      setBeats(progress);
      if (hint) hint.style.opacity = clamp(1 - progress * 6, 0, 1);
    }

    var raf;
    function tick() {
      clock += 0.016;
      curRotV += (tgtRotV - curRotV) * 0.06;
      // Stay assembled long enough to read the lateral anatomy, then dissect
      // lobe by lobe and reassemble through the remaining scroll range.
      var tgtExplode = Math.sin(clamp((progress - 0.28) / 0.72, 0, 1) * Math.PI) * 0.5;
      curExplode += (tgtExplode - curExplode) * 0.07;
      var sway = Math.sin(clock * 0.5) * 0.11;     // gentle idle sway — stays near lateral at rest
      points.rotation.y = curRotV + sway;
      points.rotation.x = 0.12 + Math.sin(progress * Math.PI) * 0.14;
      mat.uniforms.uExplode.value = curExplode;
      mat.uniforms.uDim.value = smooth(clamp((progress - 0.82) / 0.18, 0, 1)) * 0.5;  // fade out → hand off to DTI fibres
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener('scroll', readScroll, { passive: true });
    window.addEventListener('resize', resize);
    resize(); readScroll(); tick();

    // pause rendering when the hero is well out of view (perf)
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { if (!raf) tick(); }
        else { if (raf) { cancelAnimationFrame(raf); raf = null; } }
      });
    }, { rootMargin: '100px' });
    io.observe(root);
  }
})();
