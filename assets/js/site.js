/* ==========================================================================
   BRAIN Lab. — shared site behaviour
   Theme, nav, scroll-reveal, counters, publication filter, gallery lightbox,
   and a scroll-reactive neural-network canvas (a nod to the lab's connectivity
   research, and to scroll-world's scroll-driven atmosphere).
   Vanilla JS, no dependencies.
   ========================================================================== */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- theme ---------- */
  var THEME_KEY = 'brainlab-theme';
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
  }
  (function initTheme() {
    var saved;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  })();
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-theme-toggle]');
    if (!t) return;
    var cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    applyTheme(cur === 'light' ? 'dark' : 'light');
  });

  /* ---------- mobile nav ---------- */
  var navToggle = $('[data-nav-toggle]'), nav = $('#nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', nav.classList.contains('is-open'));
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) nav.classList.remove('is-open'); });
  }

  /* ---------- sticky header ---------- */
  var header = $('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-stuck', window.scrollY > 20); };
    onScroll(); addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- active nav link by section ---------- */
  var navLinks = $$('#nav a[href^="#"]');
  if (navLinks.length) {
    var secs = navLinks.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
    var spy = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- reveal on scroll ---------- */
  var reveals = $$('.reveal');
  if (reduce) reveals.forEach(function (r) { r.classList.add('in'); });
  else {
    var ro = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (r) { ro.observe(r); });
  }

  /* ---------- animated counters ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var dec = (target % 1 !== 0) ? 1 : 0;
    if (reduce) { el.textContent = target.toFixed(dec) + suffix; return; }
    var start = performance.now(), dur = 1600;
    (function tick(now) {
      var p = Math.min(1, (now - start) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * e).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(tick); else el.textContent = target.toFixed(dec) + suffix;
    })(start);
  }
  var counters = $$('[data-count]');
  if (counters.length) {
    var co = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { animateCount(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { co.observe(c); });
  }

  /* ---------- publication filter ---------- */
  $$('.filterbar').forEach(function (bar) {
    var list = document.getElementById(bar.getAttribute('data-target'));
    if (!list) return;
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('.filterbtn'); if (!b) return;
      $$('.filterbtn', bar).forEach(function (x) { x.classList.remove('is-active'); });
      b.classList.add('is-active');
      var f = b.getAttribute('data-filter');
      $$('.pub', list).forEach(function (p) {
        p.classList.toggle('hide', f !== 'all' && p.getAttribute('data-cat') !== f);
      });
    });
  });

  /* ---------- gallery lightbox ---------- */
  var gallery = $('[data-gallery]');
  if (gallery) {
    var imgs = $$('img', gallery), idx = 0;
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML = '<button class="lightbox__close" aria-label="닫기">&times;</button>' +
      '<button class="lightbox__nav lightbox__nav--prev" aria-label="이전">&#8249;</button>' +
      '<img alt="">' +
      '<button class="lightbox__nav lightbox__nav--next" aria-label="다음">&#8250;</button>';
    document.body.appendChild(box);
    var big = $('img', box);
    function show(i) { idx = (i + imgs.length) % imgs.length; big.src = imgs[idx].getAttribute('data-full') || imgs[idx].src; }
    function open(i) { show(i); box.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function close() { box.classList.remove('open'); document.body.style.overflow = ''; }
    gallery.addEventListener('click', function (e) {
      // the .gitem hover overlay makes clicks resolve to the wrapper, not the <img>,
      // so look up from either the image or its .gitem container.
      var im = e.target.closest('img');
      if (!im) { var it = e.target.closest('.gitem'); if (it) im = it.querySelector('img'); }
      if (!im) return;
      var i = imgs.indexOf(im); if (i < 0) return;
      open(i);
    });
    box.addEventListener('click', function (e) {
      if (e.target.closest('.lightbox__close') || e.target === box) return close();
      if (e.target.closest('.lightbox__nav--prev')) return show(idx - 1);
      if (e.target.closest('.lightbox__nav--next')) return show(idx + 1);
    });
    addEventListener('keydown', function (e) {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ======================================================================
     Cinematic scroll motion (site-wide). Two effects, one rAF loop:
       • pan frames  — images pan + subtly zoom within their frame as they
         cross the viewport (gallery tiles `.gitem`, home images `.panframe`).
       • parallax    — `[data-parallax]` elements drift vertically at their
         own depth factor, so text/cards flow at different speeds.
     rAF-eased so everything glides like video.
     ====================================================================== */
  (function () {
    if (reduce) return;
    var PAN = 9;   // max image pan, % of frame
    // pan frames: gallery tiles get a big scroll-linked zoom; content images a moderate one
    var pans = $$('[data-gallery] .gitem, .panframe').map(function (el) {
      var gallery = el.classList.contains('gitem');
      return { el: el, img: el.querySelector('img'), curP: 0, tgtP: 0,
               speed: parseFloat(el.getAttribute('data-speed')) || 1,
               base: gallery ? 1.12 : 1.14,
               range: gallery ? 0.46 : 0.18 };   // gallery zooms 1.12→1.58 (dynamic)
    }).filter(function (s) { return s.img; });
    // explicit parallax elements + auto-parallax for card-like elements everywhere
    var explicit = $$('[data-parallax]');
    var autoSel = $$('.card, .person, .post, .pstep, .stat').filter(function (el) {
      return !el.hasAttribute('data-parallax') && !el.closest('[data-parallax]');
    });
    var moves = [];
    explicit.forEach(function (el, i) { moves.push(mk(el, parseFloat(el.getAttribute('data-parallax')) || 0.06)); });
    autoSel.forEach(function (el, i) { moves.push(mk(el, 0.03 + (i % 4) * 0.018)); });  // staggered depth
    function mk(el, factor) { el.style.transitionProperty = 'opacity'; el.style.willChange = 'transform';
      return { el: el, cur: 0, tgt: 0, factor: factor }; }
    if (!pans.length && !moves.length) return;
    var vh = window.innerHeight;
    function measure() {
      vh = window.innerHeight;
      var i, s, r, c;
      for (i = 0; i < pans.length; i++) {
        s = pans[i]; r = s.el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) continue;
        c = r.top + r.height / 2;
        s.tgtP = Math.max(-1, Math.min(1, (c - vh / 2) / (vh / 2 + r.height / 2)));
      }
      for (i = 0; i < moves.length; i++) {
        s = moves[i]; r = s.el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) continue;
        c = r.top + r.height / 2;
        var t = (c - vh / 2) * s.factor;
        s.tgt = t > 48 ? 48 : (t < -48 ? -48 : t);   // clamp so layers can't overlap
      }
    }
    function tick() {
      var i, s;
      for (i = 0; i < pans.length; i++) {
        s = pans[i]; s.curP += (s.tgtP - s.curP) * 0.09;
        var trans = s.curP * PAN * s.speed;                    // % pan within frame
        var scale = s.base + ((1 - s.curP) / 2) * s.range;     // zoom in as it scrolls up
        s.img.style.transform = 'translate3d(0,' + trans.toFixed(2) + '%,0) scale(' + scale.toFixed(3) + ')';
      }
      for (i = 0; i < moves.length; i++) {
        s = moves[i]; s.cur += (s.tgt - s.cur) * 0.08;
        s.el.style.transform = 'translate3d(0,' + s.cur.toFixed(1) + 'px,0)';
      }
      requestAnimationFrame(tick);
    }
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    measure();
    requestAnimationFrame(tick);
  })();

  /* ---------- current year ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ======================================================================
     Neural-network canvas backdrop — nodes drift, edges light up by
     proximity, and the whole field parallaxes gently with scroll.
     ====================================================================== */
  var canvas = document.getElementById('neural');
  if (canvas && !reduce) {
    var ctx = canvas.getContext('2d'), W, H, DPR = Math.min(2, devicePixelRatio || 1);
    var nodes = [], scrollY = 0, targetScroll = 0;
    function accent() {
      var c = getComputedStyle(document.documentElement).getPropertyValue('--cyan').trim();
      return c || '#35e0ff';
    }
    function accent2() {
      var c = getComputedStyle(document.documentElement).getPropertyValue('--violet').trim();
      return c || '#9b8cff';
    }
    var COL = accent(), COL2 = accent2(), lightMode = false;
    function refreshColors() {
      COL = accent(); COL2 = accent2();
      lightMode = document.documentElement.getAttribute('data-theme') === 'light';
    }
    function resize() {
      W = canvas.width = innerWidth * DPR; H = canvas.height = innerHeight * DPR;
      canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px';
      var count = Math.min(64, Math.round(innerWidth * innerHeight / 26000));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - .5) * .12 * DPR, vy: (Math.random() - .5) * .12 * DPR,
          r: (Math.random() * 1.6 + .8) * DPR, p: Math.random()
        });
      }
    }
    function hex(c, a) {
      // c is hex like #35e0ff
      var n = c.replace('#', '');
      if (n.length === 3) n = n[0] + n[0] + n[1] + n[1] + n[2] + n[2];
      var r = parseInt(n.substr(0, 2), 16), g = parseInt(n.substr(2, 2), 16), b = parseInt(n.substr(4, 2), 16);
      return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    }
    var MAX = 150 * DPR;
    function frame() {
      scrollY += (targetScroll - scrollY) * .08;
      ctx.clearRect(0, 0, W, H);
      var oy = -scrollY * .06 * DPR;
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0) a.x = W; if (a.x > W) a.x = 0;
        if (a.y < 0) a.y = H; if (a.y > H) a.y = 0;
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j], dx = a.x - b.x, dy = (a.y - b.y), d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX) {
            var al = (1 - d / MAX) * (lightMode ? .32 : .5);
            ctx.strokeStyle = hex((i + j) % 2 ? COL : COL2, al);
            ctx.lineWidth = DPR * .6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y + oy); ctx.lineTo(b.x, b.y + oy); ctx.stroke();
          }
        }
      }
      for (var k = 0; k < nodes.length; k++) {
        var p = nodes[k];
        var pulse = .6 + .4 * Math.sin(performance.now() * .001 + p.p * 6.28);
        ctx.fillStyle = hex(k % 2 ? COL : COL2, (lightMode ? .5 : .8) * pulse);
        ctx.beginPath(); ctx.arc(p.x, p.y + oy, p.r, 0, 6.283); ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    addEventListener('resize', resize, { passive: true });
    addEventListener('scroll', function () { targetScroll = window.scrollY; }, { passive: true });
    var mo = new MutationObserver(refreshColors);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    refreshColors(); resize(); requestAnimationFrame(frame);
  }
})();

(function loadLanguageModule() {
  var script = document.createElement('script');
  script.src = 'assets/js/i18n.js?v=20260831';
  script.defer = true;
  document.head.appendChild(script);
})();
