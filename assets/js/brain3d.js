/* ==========================================================================
   BRAIN Lab. — 3D particle-brain hero
   A brain silhouette is sampled into a volumetric point cloud that rotates as
   you scroll and "dissects" (explodes outward, then reassembles) mid-scroll,
   revealing its structure. Scroll drives rotation + explosion; copy beats fade
   through. Falls back to a static image under reduced-motion / no-WebGL.
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

  // ---- helpers ----
  var clamp = function (x, a, b) { return Math.min(b, Math.max(a, x)); };
  var smooth = function (x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };

  function setBeats(progress) {
    // crossfade evenly through the beats: beat0 holds at the top, beatN at the end
    var n = beats.length; if (!n) return;
    var f = clamp(progress, 0, 1) * (n - 1);
    var idx = Math.min(n - 1, Math.floor(f));
    var frac = f - idx;
    var FADE = 0.85;   // each beat holds, then crossfades quickly in its last 15%
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

  // ======================================================================
  // Sample the brain silhouette into points, then build the 3D cloud.
  // ======================================================================
  var src = new Image();
  src.crossOrigin = 'anonymous';
  src.onload = build;
  src.onerror = fallback;
  src.src = 'assets/img/brain-silhouette.png';

  function build() {
    var S = 200;                       // sampling resolution
    var c = document.createElement('canvas'); c.width = S; c.height = S;
    var cx = c.getContext('2d');
    cx.drawImage(src, 0, 0, S, S);
    var data;
    try { data = cx.getImageData(0, 0, S, S).data; } catch (e) { return fallback(); }

    // collect bright pixels
    var pts = [], sx = 0, sy = 0;
    for (var y = 0; y < S; y++) {
      for (var x = 0; x < S; x++) {
        var idx = (y * S + x) * 4;
        var lum = (data[idx] + data[idx + 1] + data[idx + 2]) / 765;
        if (lum > 0.5 && Math.random() < 0.55) {
          var nx = (x / S - 0.5) * 2.0;
          var ny = -(y / S - 0.5) * 2.0;
          pts.push(nx, ny); sx += nx; sy += ny;
        }
      }
    }
    var count = pts.length / 2;
    if (count < 500) return fallback();
    var cxm = sx / count, cym = sy / count;

    // brain radius for ellipsoidal depth
    var maxR = 0;
    for (var i = 0; i < count; i++) {
      var dx = pts[i * 2] - cxm, dy = pts[i * 2 + 1] - cym;
      var r = Math.sqrt(dx * dx + dy * dy); if (r > maxR) maxR = r;
    }

    var SCALE = 1.35;
    var positions = new Float32Array(count * 3);
    var dirs = new Float32Array(count * 3);
    var colors = new Float32Array(count * 3);
    var CY = [0.21, 0.87, 1.0], VI = [0.62, 0.55, 1.0], TE = [0.19, 0.9, 0.77];
    for (i = 0; i < count; i++) {
      var px = (pts[i * 2] - cxm) * SCALE;
      var py = (pts[i * 2 + 1] - cym) * SCALE;
      var rr = Math.sqrt(px * px + py * py) / (maxR * SCALE);
      var thick = 0.62 * Math.sqrt(Math.max(0, 1 - rr * rr));   // ellipsoidal bulge
      var pz = (Math.random() - 0.5) * 2 * thick;
      positions[i * 3] = px; positions[i * 3 + 1] = py; positions[i * 3 + 2] = pz;
      // explosion direction — outward from centre + a little turbulence
      var dl = Math.sqrt(px * px + py * py + pz * pz) || 1;
      dirs[i * 3] = px / dl + (Math.random() - 0.5) * 0.35;
      dirs[i * 3 + 1] = py / dl + (Math.random() - 0.5) * 0.35;
      dirs[i * 3 + 2] = pz / dl + (Math.random() - 0.5) * 0.6;
      // colour: violet up top, cyan lower, occasional teal spark
      var t = clamp((py / (maxR * SCALE) + 1) / 2, 0, 1);
      var base = Math.random() < 0.12 ? TE : null;
      var col = base || [CY[0] + (VI[0] - CY[0]) * t, CY[1] + (VI[1] - CY[1]) * t, CY[2] + (VI[2] - CY[2]) * t];
      var bright = 0.75 + Math.random() * 0.25;
      colors[i * 3] = col[0] * bright; colors[i * 3 + 1] = col[1] * bright; colors[i * 3 + 2] = col[2] * bright;
    }

    // soft round sprite
    var tc = document.createElement('canvas'); tc.width = tc.height = 64;
    var tx = tc.getContext('2d');
    var grd = tx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.35, 'rgba(255,255,255,0.55)');
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
    geo.setAttribute('aDir', new THREE.BufferAttribute(dirs, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

    var mat = new THREE.ShaderMaterial({
      uniforms: { uExplode: { value: 0 }, uSize: { value: 12.0 * DPR }, uTex: { value: tex }, uDim: { value: 0 } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader:
        'attribute vec3 aDir; attribute vec3 aColor; uniform float uExplode; uniform float uSize;' +
        'varying vec3 vColor; varying float vA;' +
        'void main(){ vColor = aColor; vec3 p = position + aDir * uExplode;' +
        'vA = 1.0 - clamp(uExplode*0.5, 0.0, 0.55);' +
        'vec4 mv = modelViewMatrix * vec4(p,1.0);' +
        'gl_PointSize = uSize * (1.0 / -mv.z);' +
        'gl_Position = projectionMatrix * mv; }',
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
      camera.position.z = mobile ? 3.9 : 3.25;
    }

    // ---- scroll state ----
    var progress = 0, curExplode = 0, curRotV = 0, tgtRotV = 0, autoRot = 0;
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
      autoRot += 0.0016;
      curRotV += (tgtRotV - curRotV) * 0.06;
      // dissection: 0 → max → 0 across the scroll (assemble → anatomise → reassemble)
      var tgtExplode = Math.sin(progress * Math.PI) * 1.05;
      curExplode += (tgtExplode - curExplode) * 0.07;
      points.rotation.y = curRotV + autoRot;
      points.rotation.x = Math.sin(progress * Math.PI * 2) * 0.12;
      mat.uniforms.uExplode.value = curExplode;
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
