/* Shared footer injected into <footer data-footer></footer> on subpages. */
(function () {
  var f = document.querySelector('footer[data-footer]');
  if (!f) return;
  f.className = 'site-footer';
  f.innerHTML =
    '<div class="wrap"><div class="foot-grid">' +
      '<div>' +
        '<a class="brand" href="index.html" style="margin-bottom:16px">' +
          '<span class="brand__logo" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="8" r="1.5" fill="#fff" stroke="none"/><circle cx="16.5" cy="6" r="1.5" fill="#fff" stroke="none"/><circle cx="18" cy="15.5" r="1.5" fill="#fff" stroke="none"/><circle cx="8.5" cy="17.5" r="1.5" fill="#fff" stroke="none"/><circle cx="12" cy="11" r="1.8" fill="#fff" stroke="none"/><path d="M7 8l5 3 4.5-5M12 11l6 4.5M12 11l-3.5 6.5M18 15.5l-9.5 2"/></svg></span>' +
          '<span class="brand__name"><b>BRAIN Lab.</b><span>뇌 · 인공지능 연구실</span></span>' +
        '</a>' +
        '<p class="muted" style="max-width:34ch;font-size:.9rem">BRain And IntelligeNce Lab. · 조선대학교 IT융합대학<br>사람에게 도움이 되는 선한 기술을 연구합니다.</p>' +
      '</div>' +
      '<div><div class="foot-head">Explore</div><div class="foot-links">' +
        '<a href="about.html">연구실 소개</a><a href="professor.html">교수 소개</a><a href="members.html">구성원</a>' +
        '<a href="projects.html">연구 프로젝트</a><a href="publications.html">논문</a><a href="photos.html">갤러리</a><a href="gospel.html">Gospel</a>' +
      '</div></div>' +
      '<div><div class="foot-head">Contact</div><div class="foot-links">' +
        '<a href="mailto:honggi@chosun.ac.kr">honggi@chosun.ac.kr</a>' +
        '<a href="https://scholar.google.co.kr/citations?user=8m64YzIAAAAJ&hl" target="_blank" rel="noopener">Google Scholar</a>' +
        '<span class="muted" style="font-size:.86rem">광주광역시 동구 필문대로 309<br>조선대학교 IT융합대학 9120호</span>' +
      '</div></div>' +
    '</div>' +
    '<div class="foot-base">' +
      '<span>© <span data-year></span> BRAIN Lab. · Hong Gi Yeom, Chosun University.</span>' +
      '<span class="muted">Immersive scroll experience inspired by <a href="https://github.com/oso95/scroll-world" target="_blank" rel="noopener" style="color:var(--accent)">scroll-world</a> &amp; <a href="https://github.com/heygen-com/hyperframes" target="_blank" rel="noopener" style="color:var(--accent)">HyperFrames</a>.</span>' +
    '</div></div>';
  var y = f.querySelector('[data-year]'); if (y) y.textContent = new Date().getFullYear();
})();
