/* ==========================================================================
   BRAIN Lab. — real 3D neuron morphology
   Loads an actual reconstructed neuron (SWC: a human cortical pyramidal cell
   from the MICrONS/Allen reconstruction, via the open swc_editor dataset) and
   renders its 3D skeleton — soma, axon, basal & apical dendrites. It rotates as
   you scroll and electrical "signals" pulse outward from the soma along the
   dendritic tree. Falls back to a static image (reduced-motion / no-WebGL).
   ========================================================================== */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

(function () {
  var root = document.getElementById('neuron3d');
  if (!root) return;
  var canvas = root.querySelector('.neuron3d__canvas');
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var clamp = function (x, a, b) { return Math.min(b, Math.max(a, x)); };

  function fallback() {
    var img = document.createElement('img');
    img.src = 'assets/img/hero-2-neurons.jpg'; img.alt = '뉴런 개념 이미지';
    img.className = 'neuron3d__fallback';
    canvas.parentNode.insertBefore(img, canvas); canvas.style.display = 'none';
  }

  var supported = (function () {
    try { var t = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (t.getContext('webgl') || t.getContext('experimental-webgl'))); }
    catch (e) { return false; }
  })();
  if (reduce || !supported) { fallback(); return; }

  fetch('assets/data/neuron.swc').then(function (r) { return r.ok ? r.text() : Promise.reject(); })
    .then(build).catch(fallback);

  function build(text) {
    // ---- parse SWC ----
    var lines = text.split('\n'), nodes = {}, order = [];
    for (var i = 0; i < lines.length; i++) {
      var ln = lines[i]; if (!ln || ln.charCodeAt(0) === 35) continue;
      var p = ln.split(/\s+/); if (p.length < 7) continue;
      var id = +p[0];
      nodes[id] = { t: +p[1], x: +p[2], y: +p[3], z: +p[4], par: +p[6], d: 0 };
      order.push(id);
    }
    if (order.length < 50) return fallback();

    // ---- centre + scale ----
    var minv = [1e9, 1e9, 1e9], maxv = [-1e9, -1e9, -1e9];
    order.forEach(function (id) { var n = nodes[id];
      minv[0] = Math.min(minv[0], n.x); maxv[0] = Math.max(maxv[0], n.x);
      minv[1] = Math.min(minv[1], n.y); maxv[1] = Math.max(maxv[1], n.y);
      minv[2] = Math.min(minv[2], n.z); maxv[2] = Math.max(maxv[2], n.z); });
    var ctr = [(minv[0] + maxv[0]) / 2, (minv[1] + maxv[1]) / 2, (minv[2] + maxv[2]) / 2];
    var span = Math.max(maxv[0] - minv[0], maxv[1] - minv[1], maxv[2] - minv[2]) || 1;
    var SC = 2.4 / span;
    order.forEach(function (id) { var n = nodes[id];
      n.x = (n.x - ctr[0]) * SC; n.y = (n.y - ctr[1]) * SC; n.z = (n.z - ctr[2]) * SC; });

    // ---- path length from soma (for the travelling signal) ----
    var maxD = 0;
    order.forEach(function (id) {
      var n = nodes[id], pa = nodes[n.par];
      if (pa) { var dx = n.x - pa.x, dy = n.y - pa.y, dz = n.z - pa.z;
        n.d = pa.d + Math.sqrt(dx * dx + dy * dy + dz * dz); }
      if (n.d > maxD) maxD = n.d;
    });

    // ---- geometry: one segment per node→parent ----
    var TCOL = { 1: [1, 1, 1], 2: [1, 0.72, 0.34], 3: [0.21, 0.87, 1.0], 4: [0.63, 0.55, 1.0] };
    var pos = [], col = [], dist = [], soma = null;
    order.forEach(function (id) {
      var n = nodes[id]; if (n.t === 1 && !soma) soma = n;
      var pa = nodes[n.par]; if (!pa) return;
      var c = TCOL[n.t] || TCOL[3];
      pos.push(pa.x, pa.y, pa.z, n.x, n.y, n.z);
      col.push(c[0], c[1], c[2], c[0], c[1], c[2]);
      var dd = n.d / maxD; dist.push(pa.d / maxD, dd);
    });

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('aColor', new THREE.Float32BufferAttribute(col, 3));
    geo.setAttribute('aDist', new THREE.Float32BufferAttribute(dist, 1));

    var mat = new THREE.ShaderMaterial({
      uniforms: { uWave: { value: 0 }, uWave2: { value: 0.5 } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader:
        'attribute vec3 aColor; attribute float aDist; varying vec3 vColor; varying float vDist;' +
        'void main(){ vColor=aColor; vDist=aDist; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader:
        'uniform float uWave; uniform float uWave2; varying vec3 vColor; varying float vDist;' +
        'void main(){ float p1 = smoothstep(0.05,0.0,abs(vDist-uWave));' +
        'float p2 = smoothstep(0.04,0.0,abs(vDist-uWave2));' +
        'float pulse = max(p1, p2*0.8);' +
        'vec3 c = vColor * (0.46 + pulse*2.3);' +
        'gl_FragColor = vec4(c, 0.62 + pulse*0.38); }'
    });
    var neuron = new THREE.LineSegments(geo, mat);

    // soma glow (a bright sprite)
    var somaObj = null;
    if (soma) {
      var sc = document.createElement('canvas'); sc.width = sc.height = 64;
      var sx = sc.getContext('2d'); var g = sx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.4, 'rgba(180,230,255,0.6)'); g.addColorStop(1, 'rgba(120,180,255,0)');
      sx.fillStyle = g; sx.fillRect(0, 0, 64, 64);
      somaObj = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      somaObj.position.set(soma.x, soma.y, soma.z); somaObj.scale.set(0.42, 0.42, 0.42);
      neuron.add(somaObj);
    }

    var group = new THREE.Group(); group.add(neuron); group.rotation.z = 0.15;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    var scene = new THREE.Scene(); scene.add(group);
    var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100); camera.position.z = 3.1;

    function resize() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      camera.position.z = w < 760 ? 3.1 : 2.5;
    }

    var progress = 0;
    function readScroll() {
      var r = root.getBoundingClientRect(), vh = window.innerHeight;
      var c = r.top + r.height / 2;
      progress = clamp((vh / 2 - c) / (vh / 2 + r.height / 2) + 0.5, 0, 1); // 0 entering .. 1 leaving
    }

    var t = 0, curRot = 0, raf = null;
    function tick() {
      t += 0.016;
      var tgtRot = 0.5 + progress * Math.PI * 1.4;   // scroll rotates the cell ~250°
      curRot += (tgtRot - curRot) * 0.06;
      group.rotation.y = curRot + t * 0.12;           // + gentle auto-spin
      group.rotation.x = (progress - 0.5) * 0.5;
      if (somaObj) { var s = 0.4 + Math.sin(t * 3) * 0.06; somaObj.scale.set(s, s, s); }
      mat.uniforms.uWave.value = (t * 0.28) % 1.15;    // signals travel soma → tips
      mat.uniforms.uWave2.value = (t * 0.28 + 0.55) % 1.15;
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
