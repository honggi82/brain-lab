(function () {
  'use strict';
  var frame = document.getElementById('atlas-frame');
  var header = document.querySelector('.site-header');
  var resize = new ResizeObserver(function () {
    document.documentElement.style.setProperty(
      '--lab-header-height', Math.ceil(header.getBoundingClientRect().height) + 'px');
  });
  resize.observe(header);
  window.addEventListener('pagehide', function () { resize.disconnect(); }, { once: true });

  // The simulator has no language switch of its own here: the site header owns
  // it, and the choice is posted in, exactly as the brain atlas receives it.
  function sendLanguage() {
    if (!frame.contentWindow) return;
    frame.contentWindow.postMessage({
      type: 'brainlab-language',
      language: document.documentElement.lang === 'ko' ? 'ko' : 'en'
    }, location.origin);
  }
  window.addEventListener('brainlab:languagechange', sendLanguage);
  frame.addEventListener('load', sendLanguage);
  window.addEventListener('message', function (event) {
    if (event.source !== frame.contentWindow || event.origin !== location.origin) return;
    if (event.data && event.data.type === 'fly-brain-ready') sendLanguage();
  });
  sendLanguage();
})();
