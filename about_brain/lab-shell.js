(function () {
  'use strict';
  var frame = document.getElementById('atlas-frame');
  var header = document.querySelector('.site-header');
  var resize = new ResizeObserver(function () {
    document.documentElement.style.setProperty('--lab-header-height', Math.ceil(header.getBoundingClientRect().height) + 'px');
  });
  resize.observe(header);
  window.addEventListener('pagehide', function () { resize.disconnect(); }, { once: true });
  function sendLanguage() {
    frame.contentWindow.postMessage({ type: 'brainlab-language', language: document.documentElement.lang === 'ko' ? 'ko' : 'en' }, location.origin);
  }
  window.addEventListener('brainlab:languagechange', sendLanguage);
  frame.addEventListener('load', sendLanguage);
  window.addEventListener('message', function (event) {
    if (event.source !== frame.contentWindow || event.origin !== location.origin) return;
    if (event.data && event.data.type === 'brain-atlas-ready') sendLanguage();
    if (event.data && event.data.type === 'brain-atlas-size' && matchMedia('(max-width:900px)').matches) {
      var height = Number(event.data.height);
      if (Number.isFinite(height) && height >= 300 && height <= 20000) frame.style.height = Math.ceil(height) + 'px';
    }
  });
  sendLanguage();
})();
