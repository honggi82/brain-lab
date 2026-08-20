/* ==========================================================================
   BRAIN Lab. — immersive scroll hero
   A bounded adaptation of scroll-world's scroll-scrubbed camera-flight
   technique (github.com/oso95/scroll-world): a fixed "stage" pinned inside a
   sticky container, scenes cross-dissolving and scaling as scroll drives time,
   copy that greets then hands off, per-scene accent + route dots.
   Works with images, an optional scrubbable <video> clip, or pure gradient
   scenes. Degrades to a static stack under prefers-reduced-motion.
   ========================================================================== */
function mountHero(root, config) {
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var scenes = config.scenes || [];
  var N = scenes.length;
  var nextSection = root.nextElementSibling;
  if (!N) return;
  var PER = config.perScene || 88;          // vh of scroll per scene

  var clamp = function (x, a, b) { a = a == null ? 0 : a; b = b == null ? 1 : b; return Math.min(b, Math.max(a, x)); };
  var smooth = function (x) { x = clamp(x); return x * x * (3 - 2 * x); };

  // ---- build DOM ----
  root.classList.add('hero');
  if (config.video) root.classList.add('hero--timeline');
  root.style.setProperty('--hero-scenes', N);
  var pin = ce('div', 'hero__pin');
  var stage = ce('div', 'hero__stage');
  var copylayer = ce('div', 'hero__copylayer');
  var dotsWrap = ce('div', 'hero__dots');
  var hint = ce('div', 'hero__hint');
  hint.innerHTML = '<span>' + (config.hint || 'SCROLL') + '</span><i></i>';

  var sceneEls = [], videoEls = [], timelineVideo = null;
  if (config.video && !reduce) {
    var timeline = ce('div', 'hero__timeline');
    timelineVideo = document.createElement('video');
    timelineVideo.className = 'hero__timeline-video';
    timelineVideo.muted = true;
    timelineVideo.playsInline = true;
    timelineVideo.preload = 'auto';
    timelineVideo.setAttribute('muted', '');
    timelineVideo.setAttribute('playsinline', '');
    if (config.poster) timelineVideo.poster = config.poster;
    timelineVideo.src = config.video;
    timeline.appendChild(timelineVideo);
    timeline.appendChild(ce('div', 'hero__timeline-scrim'));
    stage.appendChild(timeline);
  } else if (config.poster) {
    var staticTimeline = ce('div', 'hero__timeline');
    var staticPoster = ce('img', 'hero__timeline-video');
    staticPoster.src = config.poster;
    staticPoster.alt = '';
    staticTimeline.appendChild(staticPoster);
    staticTimeline.appendChild(ce('div', 'hero__timeline-scrim'));
    stage.appendChild(staticTimeline);
  }
  scenes.forEach(function (s, i) {
    var sc = ce('div', 'hero__scene');
    sc.style.setProperty('--accent', s.accent || 'var(--cyan)');
    if (s.accent2) sc.style.setProperty('--accent-2', s.accent2);
    if (!config.video) {
      var glow = ce('div', 'hero__glow'); sc.appendChild(glow);
    }
    if (s.image && !timelineVideo) {
      var img = ce('img', 'hero__img'); img.src = s.image; img.alt = ''; img.decoding = 'async';
      img.loading = i === 0 ? 'eager' : 'lazy';
      sc.appendChild(img); sc.classList.add('has-img');
      var scrim = ce('div', 'hero__scrim'); sc.appendChild(scrim);
    }
    if (s.video && !reduce && !timelineVideo) {
      var v = document.createElement('video');
      v.className = 'hero__video'; v.muted = true; v.playsInline = true; v.preload = 'auto';
      v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
      v.src = s.video; sc.appendChild(v); sc.classList.add('has-img');
      var scrim2 = ce('div', 'hero__scrim'); sc.appendChild(scrim2);
      videoEls[i] = v;
    }
    stage.appendChild(sc); sceneEls.push(sc);

    // copy
    var cp = ce('article', 'hero__copy');
    cp.style.setProperty('--accent', s.accent || 'var(--cyan)');
    var html = '<span class="hero__num">' + pad(i + 1) + ' / ' + pad(N) + '</span>';
    if (s.eyebrow) html += '<span class="hero__eyebrow">' + esc(s.eyebrow) + '</span>';
    if (s.title) html += '<h1 class="hero__title">' + s.title + '</h1>';
    if (s.body) html += '<p class="hero__body">' + esc(s.body) + '</p>';
    if (s.tags && s.tags.length) html += '<ul class="hero__tags">' + s.tags.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
    if (s.cta) {
      html += '<div class="hero__cta">';
      if (s.cta.primary) html += '<a class="btn btn--primary" href="' + esc(s.cta.primary.href) + '">' + esc(s.cta.primary.label) + arrow() + '</a>';
      if (s.cta.secondary) html += '<a class="btn btn--ghost" href="' + esc(s.cta.secondary.href) + '">' + esc(s.cta.secondary.label) + '</a>';
      html += '</div>';
    }
    cp.innerHTML = html;
    copylayer.appendChild(cp); s._cp = cp;

    var dot = ce('button', 'hero__dot');
    dot.style.setProperty('--accent', s.accent || 'var(--cyan)');
    dot.innerHTML = '<span>' + esc(s.label || '') + '</span><i></i>';
    dot.addEventListener('click', function () { jumpTo(i); });
    dotsWrap.appendChild(dot); s._dot = dot;
  });

  pin.appendChild(stage);
  pin.appendChild(copylayer);
  pin.appendChild(dotsWrap);
  pin.appendChild(hint);
  root.appendChild(pin);

  // reduced motion: show a simple readable stack of the first scene
  if (reduce) {
    root.classList.add('hero--static');
    sceneEls.forEach(function (el, i) { el.style.opacity = i === 0 ? 1 : 0; });
    scenes[0]._cp.style.opacity = 1;
    return;
  }

  // ---- scroll math ----
  var top = 0, height = 0, vh = 0, active = -1, ticking = false, primed = false;
  function layout() {
    vh = innerHeight;
    var r = root.getBoundingClientRect();
    top = r.top + window.scrollY;
    height = root.offsetHeight;
    read();
  }
  function jumpTo(i) {
    var t = (i + 0.5) / N;
    scrollTo({ top: top + t * (height - vh), behavior: 'smooth' });
  }

  function read() {
    var t = clamp((window.scrollY - top) / (height - vh), 0, 1);
    var sc = t * N;                       // 0 .. N
    var idx = Math.min(N - 1, Math.floor(sc));
    var fract = clamp(sc - idx, 0, 1);
    var FADE = 0.78;                       // scene holds, then crossfades in last 22%

    var last = (idx + 1 >= N);                  // final scene: hold, no hand-off
    var xf = last ? 0 : smooth((fract - FADE) / (1 - FADE));  // crossfade progress 0..1
    var Z0 = 0.5, Z1 = 1.0;                     // scroll zoom: half-size -> full-bleed (2x growth)
    for (var i = 0; i < N; i++) {
      var op = 0, scale = Z0, cop = 0, cty = 0;
      if (i === idx) {
        op = (fract < FADE || last) ? 1 : (1 - xf);
        scale = Z0 + (Z1 - Z0) * clamp(fract / FADE, 0, 1);  // grows 0.5->1.0 by FADE, then holds full
        cop = op; cty = -fract * 2;             // copy tracks its own scene's image exactly
      } else if (i === idx + 1) {
        op = (fract < FADE) ? 0 : xf;
        scale = Z0;                             // incoming waits at half-size, then grows once active
        cop = op; cty = (1 - fract) * 2;
      }
      var el = sceneEls[i];
      el.style.opacity = op;
      el.style.zIndex = i === idx ? 2 : (i === idx + 1 ? 3 : 1);
      // pure zoom (no translate) so a 1x scene still fills full-bleed with no edge gap
      el.style.transform = timelineVideo ? 'none' : 'scale(' + scale.toFixed(3) + ')';
      el.style.visibility = op < 0.003 ? 'hidden' : 'visible';

      var cp = scenes[i]._cp;
      cp.style.opacity = cop;
      cp.style.transform = 'translateY(' + cty.toFixed(2) + 'vh)';
      cp.style.pointerEvents = cop > 0.6 ? 'auto' : 'none';
    }

    // scrub video clip of the active scene
    if (videoEls[idx]) {
      var v = videoEls[idx];
      if (v.readyState >= 1 && !v.seeking) {
        var dur = v.duration || 1;
        var target = clamp(fract, 0, 0.999) * dur;
        if (Math.abs(v.currentTime - target) > 0.04) { try { v.currentTime = target; } catch (e) {} }
      }
    }

    var na = (fract > 0.5 && idx + 1 < N) ? idx + 1 : idx;
    if (na !== active) {
      active = na;
      scenes.forEach(function (s, k) { s._dot.classList.toggle('is-active', k === na); });
      root.style.setProperty('--accent', scenes[na].accent || 'var(--cyan)');
      root.style.setProperty('--accent-2', scenes[na].accent2 || 'var(--violet)');
    }
    hint.style.opacity = clamp(1 - t * N * 1.4);
    if (config.video) {
      var handoff = smooth((t - 0.82) / 0.18);
      root.style.setProperty('--hero-outro-y', ((1 - handoff) * 100).toFixed(3) + '%');
      if (nextSection && nextSection.classList.contains('section')) {
        var contentIn = smooth((t - 0.86) / 0.14);
        nextSection.style.setProperty('--hero-content-opacity', contentIn.toFixed(3));
        nextSection.style.setProperty('--hero-content-y', ((1 - contentIn) * 32).toFixed(2) + 'px');
      }
    }
    if (timelineVideo && timelineVideo.readyState >= 1) {
      var timelineDuration = timelineVideo.duration || 1;
      var timelineTarget = clamp(t, 0, 0.999) * timelineDuration;
      if (Math.abs(timelineVideo.currentTime - timelineTarget) > 0.035) {
        try { timelineVideo.currentTime = timelineTarget; } catch (e) {}
      }
      timelineVideo.style.transform = 'scale(' + (1.015 + t * 0.035).toFixed(3) + ')';
    }
    ticking = false;
  }

  // prime videos on first interaction (mobile decoders)
  function prime() {
    if (primed) return; primed = true;
    if (timelineVideo) {
      try {
        var timelinePlay = timelineVideo.play();
        if (timelinePlay && timelinePlay.then) timelinePlay.then(function () { timelineVideo.pause(); }).catch(function () {});
      } catch (e) {}
    }
    videoEls.forEach(function (v) { if (v) { try { var p = v.play(); if (p && p.then) p.then(function () { v.pause(); }).catch(function () {}); } catch (e) {} } });
  }
  addEventListener('pointerdown', prime, { once: true, passive: true });
  addEventListener('touchstart', prime, { once: true, passive: true });

  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(read); } }, { passive: true });
  addEventListener('resize', layout);
  addEventListener('load', layout);
  layout();

  // helpers
  function ce(t, c) { var n = document.createElement(t); if (c) n.className = c; return n; }
  function pad(n) { return String(n).padStart(2, '0'); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function arrow() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'; }
}
if (typeof window !== 'undefined') window.mountHero = mountHero;
