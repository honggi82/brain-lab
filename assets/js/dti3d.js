/* ==========================================================================
   BRAIN Lab. — DTI white-matter tractography
   Loads a real diffusion-MRI tractogram (streamlines exported from an open
   .trx tractography demo) and renders the white-matter fibre tracts in 3D,
   colour-coded by fibre direction (red = left–right, green = anterior–posterior,
   blue = superior–inferior — the standard DTI colour map). The bundle rotates
   as you scroll, with a soft signal shimmer travelling along the fibres.
   Falls back to a static image (reduced-motion / no-WebGL / fetch fail).
   ========================================================================== */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

(function () {
  var root = document.getElementById('dti3d');
  if (!root) return;
  var canvas = root.querySelector('.neuron3d__canvas');
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var clamp = function (x, a, b) { return Math.min(b, Math.max(a, x)); };

  function fallback() {
    var img = document.createElement('img');
    img.src = 'assets/img/hero-4-ai.jpg'; img.alt = '뇌 백질 신경섬유 개념 이미지';
    img.className = 'neuron3d__fallback';
    canvas.parentNode.insertBefore(img, canvas); canvas.style.display = 'none';
  }
  var supported = (function () {
    try { var t = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (t.getContext('webgl') || t.getContext('experimental-webgl'))); }
    catch (e) { return false; }
  })();
  if (reduce || !supported) { fallback(); return; }

  fetch('assets/data/tracts.f32').then(function (r) { return r.ok ? r.arrayBuffer() : Promise.reject(); })
    .then(build).catch(fallback);

  function build(buf) {
    var raw = new Float32Array(buf);
    // split into streamlines on NaN separators
    var streams = [], cur = [];
    for (var i = 0; i < raw.length; i += 3) {
      if (raw[i] !== raw[i]) { if (cur.length >= 2) streams.push(cur); cur = []; }
      else cur.push([raw[i], raw[i + 1], raw[i + 2]]);
    }
    if (cur.length >= 2) streams.push(cur);
    if (!streams.length) return fallback();

    // build LineSegments coloured by local fibre direction, with an arc-length
    // attribute so a shimmer can travel along each fibre.
    var pos = [], col = [], arc = [];
    for (var s = 0; s < streams.length; s++) {
      var pts = streams[s], L = 0;
      for (var j = 0; j < pts.length - 1; j++) {
        var a = pts[j], b = pts[j + 1];
        var dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
        var len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-5;
        var cr = Math.abs(dx / len), cg = Math.abs(dy / len), cb = Math.abs(dz / len);
        pos.push(a[0], a[1], a[2], b[0], b[1], b[2]);
        col.push(cr, cg, cb, cr, cg, cb);
        arc.push(L, L + len); L += len;
      }
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('aColor', new THREE.Float32BufferAttribute(col, 3));
    geo.setAttribute('aArc', new THREE.Float32BufferAttribute(arc, 1));

    var mat = new THREE.ShaderMaterial({
      uniforms: { uWave: { value: 0 } },
      transparent: true, depthWrite: false, blending: THREE.NormalBlending,
      vertexShader:
        'attribute vec3 aColor; attribute float aArc; varying vec3 vColor; varying float vArc;' +
        'void main(){ vColor=aColor; vArc=aArc; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader:
        'uniform float uWave; varying vec3 vColor; varying float vArc;' +
        'void main(){ float ph = fract(vArc*0.3 - uWave);' +
        'float pulse = smoothstep(0.82,1.0,ph);' +          // a soft band travels along fibres
        'vec3 c = vColor * (0.85 + pulse*0.8);' +
        'gl_FragColor = vec4(c, 0.5 + pulse*0.35); }'         // dense whole-brain: moderate alpha
    });

    var lines = new THREE.LineSegments(geo, mat);
    var group = new THREE.Group();
    group.add(lines);
    group.rotation.x = -Math.PI / 2;   // RAS superior-axis → screen up

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    var scene = new THREE.Scene(); scene.add(group);
    var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100); camera.position.z = 3.0;

    function resize() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      camera.position.z = w < 760 ? 3.7 : 3.0;
    }

    var progress = 0;
    function readScroll() {
      var r = root.getBoundingClientRect(), vh = window.innerHeight;
      var c = r.top + r.height / 2;
      progress = clamp((vh / 2 - c) / (vh / 2 + r.height / 2) + 0.5, 0, 1);
    }

    var t = 0, curSpin = 0, raf = null;
    function tick() {
      t += 0.016;
      var tgtSpin = 0.4 + progress * Math.PI * 1.5;   // scroll turns the bundle
      curSpin += (tgtSpin - curSpin) * 0.06;
      lines.rotation.y = curSpin + t * 0.1;           // spin about the vertical axis
      group.rotation.z = Math.sin(t * 0.3) * 0.05;
      mat.uniforms.uWave.value = (t * 0.25) % 1.0;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    }
    window.addEventListener('scroll', readScroll, { passive: true });
    window.addEventListener('resize', resize);
    resize(); readScroll();

    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { if (!raf) tick(); }
        else if (raf) { cancelAnimationFrame(raf); raf = null; }
      });
    }, { rootMargin: '150px' });
    io.observe(root);
  }
})();
