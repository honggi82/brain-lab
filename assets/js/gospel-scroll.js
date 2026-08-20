(function () {
  var root = document.getElementById('gospel-intro');
  if (!root || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var image = root.querySelector('.gospel-intro__image');
  var shade = root.querySelector('.gospel-intro__shade');
  var blackout = root.querySelector('.gospel-intro__blackout');
  var hint = root.querySelector('.gospel-intro__hint');
  var nextHero = root.nextElementSibling;
  var top = 0, span = 1, ticking = false;
  var clamp = function (n) { return Math.min(1, Math.max(0, n)); };
  var smooth = function (n) { n = clamp(n); return n * n * (3 - 2 * n); };

  function layout() {
    var rect = root.getBoundingClientRect();
    top = rect.top + window.scrollY;
    span = Math.max(1, root.offsetHeight - window.innerHeight);
    render();
  }
  function render() {
    var progress = clamp((window.scrollY - top) / span);
    var eased = smooth(progress * 0.5);
    var fade = smooth((progress - 0.62) / 0.38);
    var scale = 1 + eased * 1.35;
    var shiftX = eased * -10;
    var shiftY = eased * 22;
    image.style.transform = 'translate3d(' + shiftX.toFixed(3) + 'vw,' + shiftY.toFixed(3) + 'vh,0) scale(' + scale.toFixed(4) + ')';
    image.style.filter = 'saturate(' + (1 + eased * 0.08).toFixed(3) + ') brightness(' + (1 - eased * 0.08).toFixed(3) + ')';
    blackout.style.transform = 'translateY(' + ((1 - fade) * 100).toFixed(3) + '%)';
    if (nextHero && nextHero.classList.contains('page-hero')) {
      var contentIn = smooth((progress - 0.72) / 0.28);
      nextHero.style.setProperty('--gospel-content-opacity', contentIn.toFixed(3));
      nextHero.style.setProperty('--gospel-content-y', ((1 - contentIn) * 32).toFixed(2) + 'px');
    }
    shade.style.opacity = (0.92 + eased * 0.08).toFixed(3);
    hint.style.opacity = clamp(1 - progress * 4).toFixed(3);
    ticking = false;
  }
  function requestRender() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(render);
  }

  addEventListener('scroll', requestRender, { passive: true });
  addEventListener('resize', layout);
  addEventListener('load', layout);
  layout();
})();
