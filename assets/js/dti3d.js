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
  var nextHero = root.nextElementSibling;
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var clamp = function (x, a, b) { return Math.min(b, Math.max(a, x)); };

  function fallback() {
    var img = document.createElement('img');
    img.src = 'assets/img/hero-4-ai.jpg'; img.alt = '뇌 백질 신경섬유 개념 이미지';
    img.className = 'neuron3d__fallback';
    canvas.parentNode.insertBefore(img, canvas); canvas.style.display = 'none';
    var b0 = root.querySelector('.dti-copy[data-dbeat="0"]');   // reveal first copy without scroll driver
    if (b0) b0.style.opacity = 1;
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
    var pos = [], col = [], arc = [], grp = [];
    for (var s = 0; s < streams.length; s++) {
      var pts = streams[s], jj;
      // classify each fibre by its predominant orientation (sum of |Δ| per axis)
      var sx = 0, sy = 0, sz = 0;
      for (jj = 0; jj < pts.length - 1; jj++) {
        sx += Math.abs(pts[jj + 1][0] - pts[jj][0]);
        sy += Math.abs(pts[jj + 1][1] - pts[jj][1]);
        sz += Math.abs(pts[jj + 1][2] - pts[jj][2]);
      }
      // reveal order: 0 = 상하 S–I, 1 = 앞뒤 A–P, 2 = 좌우 L–R  (x=L-R, y=A-P, z=S-I)
      var g = (sz >= sy && sz >= sx) ? 0 : ((sy >= sx) ? 1 : 2);
      var L = 0;
      for (var j = 0; j < pts.length - 1; j++) {
        var a = pts[j], b = pts[j + 1];
        var dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
        var len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-5;
        var cr = Math.abs(dx / len), cg = Math.abs(dy / len), cb = Math.abs(dz / len);
        pos.push(a[0], a[1], a[2], b[0], b[1], b[2]);
        col.push(cr, cg, cb, cr, cg, cb);
        arc.push(L, L + len); L += len;
        grp.push(g, g);
      }
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('aColor', new THREE.Float32BufferAttribute(col, 3));
    geo.setAttribute('aArc', new THREE.Float32BufferAttribute(arc, 1));
    geo.setAttribute('aGroup', new THREE.Float32BufferAttribute(grp, 1));

    var mat = new THREE.ShaderMaterial({
      uniforms: { uWave: { value: 0 }, uReveal: { value: 0.16 } },
      transparent: true, depthWrite: false, blending: THREE.NormalBlending,
      vertexShader:
        'attribute vec3 aColor; attribute float aArc; attribute float aGroup;' +
        'varying vec3 vColor; varying float vArc; varying float vGroup;' +
        'void main(){ vColor=aColor; vArc=aArc; vGroup=aGroup; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader:
        'uniform float uWave; uniform float uReveal; varying vec3 vColor; varying float vArc; varying float vGroup;' +
        'void main(){' +
        'float revealAt = vGroup * 0.33;' +                                  // 상하→앞뒤→좌우 revealed in turn
        'float vis = smoothstep(revealAt, revealAt + 0.16, uReveal);' +      // this direction group fades in
        'if (vis < 0.02) discard;' +
        'float front = (1.0 - smoothstep(0.0, 0.18, uReveal - revealAt)) * vis;' +   // glow as the group connects
        'float ph = fract(vArc*0.3 - uWave); float pulse = smoothstep(0.82,1.0,ph);' +
        'vec3 c = vColor * (0.8 + pulse*0.5 + front*1.4);' +
        'gl_FragColor = vec4(c, (0.5 + pulse*0.2 + front*0.4) * vis); }'
    });

    var lines = new THREE.LineSegments(geo, mat);
    var group = new THREE.Group();
    group.add(lines);

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    var scene = new THREE.Scene(); scene.add(group);
    var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100); camera.position.z = 3.0;

    function resize() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      camera.position.z = w < 760 ? 3.4 : 2.7;
    }

    var nowEl = root.querySelector('.dti-now');
    var PHASES = [
      '① 상하 연결 · superior ↔ inferior',
      '② 앞뒤 연결 · anterior ↔ posterior',
      '③ 좌우 연결 · left ↔ right'
    ];
    var lastPhase = -1;
    var beats = Array.prototype.slice.call(root.querySelectorAll('.dti-copy[data-dbeat]'));
    var sm = function (x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
    function setBeats(p) {
      if (beats.length < 2) return;
      // "해부하다" holds through the reveal; "생각으로 잇다" rises once the fibres are connected
      var xf = sm((p - 0.74) / 0.2);
      beats[0].style.opacity = 1 - xf;
      beats[0].style.transform = 'translateY(' + (-xf * 42).toFixed(1) + 'px)';
      beats[0].style.pointerEvents = xf < 0.4 ? 'auto' : 'none';
      beats[1].style.opacity = xf;
      beats[1].style.transform = 'translateY(' + ((1 - xf) * 42).toFixed(1) + 'px)';
      beats[1].style.pointerEvents = xf > 0.6 ? 'auto' : 'none';
    }
    var progress = 0;
    function readScroll() {
      // pinned section: progress runs 0→1 across the whole tall section's scroll
      var r = root.getBoundingClientRect();
      var top = r.top + window.scrollY;
      var h = root.offsetHeight - window.innerHeight;
      progress = clamp((window.scrollY - top) / (h || 1), 0, 1);
      var outro = smooth((progress - 0.82) / 0.18);
      root.style.setProperty('--dti-outro-y', ((1 - outro) * 100).toFixed(3) + '%');
      if (nextHero && nextHero.classList.contains('page-hero')) {
        var contentIn = smooth((progress - 0.84) / 0.16);
        nextHero.style.setProperty('--dti-content-opacity', contentIn.toFixed(3));
        nextHero.style.setProperty('--dti-content-y', ((1 - contentIn) * 32).toFixed(2) + 'px');
      }
      setBeats(progress);
      if (nowEl) {
        var ph = progress < 0.30 ? 0 : (progress < 0.63 ? 1 : 2);
        if (ph !== lastPhase) { nowEl.textContent = PHASES[ph]; lastPhase = ph; }
      }
    }

    var smooth = function (x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
    var YAXIS = new THREE.Vector3(0, 1, 0);
    var qAxial = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));                       // horizontal (axial) view
    var qSag = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, -Math.PI / 2, 0));   // sagittal (side) view
    var qCur = new THREE.Quaternion(), qIdle = new THREE.Quaternion();
    var t = 0, curReveal = 0.16, raf = null;
    function tick() {
      t += 0.016;
      var er = smooth(progress);
      // scroll down → connect the connectomes in turn (상하→앞뒤→좌우); scroll up → they retract in reverse
      var tgtReveal = 0.16 + er * 0.86;
      curReveal += (tgtReveal - curReveal) * 0.08;
      mat.uniforms.uReveal.value = curReveal;
      // scroll rotates the brain from axial (horizontal) to sagittal (side) view
      qCur.slerpQuaternions(qAxial, qSag, er);
      qIdle.setFromAxisAngle(YAXIS, Math.sin(t * 0.4) * 0.05);
      group.quaternion.copy(qCur).multiply(qIdle);
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
