(function () {
  'use strict';
  var journey = document.querySelector('[data-spatial-journey]');
  if (!journey) return;
  var stage = journey.querySelector('.spatial-sticky');
  var photos = Array.from(journey.querySelectorAll('.spatial-photo'));
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');
  var header = document.querySelector('.site-header');
  var prev = journey.querySelector('[data-spatial-prev]');
  var next = journey.querySelector('[data-spatial-next]');
  var count = journey.querySelector('[data-spatial-count]');
  var bar = journey.querySelector('.spatial-progress span');
  var current = 0, pending = 0, top = 0, distance = 1, width = 0, height = 0;
  var lightbox = document.querySelector('.lightbox');
  var returnFocus = null;

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function smooth(n) { n = clamp(n, 0, 1); return n * n * (3 - 2 * n); }
  function render() {
    pending = 0;
    if (reduce.matches) return;
    var progress = clamp((window.scrollY - top) / distance, 0, 1);
    var position = progress * (photos.length - 1);
    current = Math.round(position);
    photos.forEach(function (photo, i) {
      var d = i - position, near = 1 - clamp(Math.abs(d), 0, 1);
      var side = i % 2 ? 1 : -1;
      var scale = clamp(.86 - d * .32, .15, 1.35);
      var x = d * width * .34 + side * width * .15 * Math.min(1, Math.abs(d));
      var y = side * height * .21 * Math.min(1, Math.abs(d));
      var opacity = d < -.45 ? 1 - smooth((-d - .45) / .5) : clamp(1 - Math.max(0, d - 1.6) * .4, 0, 1);
      photo.style.transform = 'translate(-50%,-50%) translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0) rotate(' + (side * 8 * (1 - near)).toFixed(2) + 'deg) scale(' + scale.toFixed(3) + ')';
      photo.style.opacity = opacity;
      photo.style.visibility = opacity < .005 || d > 3 ? 'hidden' : 'visible';
      photo.style.pointerEvents = opacity < .15 ? 'none' : '';
      photo.style.zIndex = photos.length - i;
      photo.tabIndex = i === current ? 0 : -1;
    });
    var label = String(current + 1).padStart(2, '0') + ' / ' + String(photos.length).padStart(2, '0');
    if (count.textContent !== label) count.textContent = label;
    prev.disabled = progress <= .0001;
    next.disabled = progress >= .9999;
    bar.style.transform = 'scaleX(' + progress.toFixed(4) + ')';
  }
  function schedule() { if (!pending) pending = requestAnimationFrame(render); }
  function measure() {
    journey.style.setProperty('--gallery-top', Math.ceil(header.getBoundingClientRect().height) + 'px');
    var inset = parseFloat(getComputedStyle(stage).top) || 0;
    top = journey.getBoundingClientRect().top + window.scrollY - inset;
    distance = Math.max(1, journey.offsetHeight - stage.offsetHeight);
    width = stage.clientWidth;
    height = stage.clientHeight;
    schedule();
  }
  function configure() {
    journey.classList.toggle('is-spatial', !reduce.matches);
    journey.style.setProperty('--gallery-count', photos.length);
    photos.forEach(function (photo) { photo.removeAttribute('style'); photo.tabIndex = 0; });
    measure();
  }
  function go(delta) {
    var target = clamp(current + delta, 0, photos.length - 1);
    window.scrollTo({ top: top + target / (photos.length - 1) * distance, behavior: 'smooth' });
  }
  prev.addEventListener('click', function () { go(-1); });
  next.addEventListener('click', function () { go(1); });
  photos.forEach(function (photo) {
    photo.addEventListener('click', function (event) {
      returnFocus = photo;
      // Keep the shared lightbox's image-click delegation, including keyboard activation.
      if (event.target !== photo.querySelector('img')) photo.querySelector('img').click();
    });
  });

  if (lightbox) {
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Gallery');
    var big = lightbox.querySelector('img');
    function syncAlt() {
      var source = photos.find(function (photo) { return photo.querySelector('img').src === big.src; });
      if (source) big.alt = source.querySelector('img').alt;
    }
    new MutationObserver(syncAlt).observe(big, { attributes: true, attributeFilter: ['src'] });
    new MutationObserver(function () {
      if (lightbox.classList.contains('open')) lightbox.querySelector('.lightbox__close').focus({ preventScroll: true });
      else if (returnFocus) returnFocus.focus({ preventScroll: true });
    }).observe(lightbox, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('keydown', function (event) {
      if (!lightbox.classList.contains('open')) return;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].indexOf(event.key) !== -1) event.preventDefault();
      if (event.key !== 'Tab') return;
      var buttons = Array.from(lightbox.querySelectorAll('button'));
      var i = buttons.indexOf(document.activeElement);
      event.preventDefault();
      buttons[(i + (event.shiftKey ? buttons.length - 1 : 1)) % buttons.length].focus();
    }, true);
    window.addEventListener('brainlab:languagechange', syncAlt);
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  reduce.addEventListener('change', configure);
  if (window.ResizeObserver) new ResizeObserver(measure).observe(header);
  configure();
})();
