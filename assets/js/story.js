/* Home BCI story: one continuous film scrubbed by scroll position. */
(function () {
  var el = document.getElementById('storyhero');
  if (!el || typeof window.mountHero !== 'function') return;

  window.mountHero(el, {
    hint: 'SCROLL TO EXPLORE',
    video: 'assets/video/homepage-video.mp4',
    poster: 'assets/img/scene-neurons.jpg',
    scenes: [
      {
        accent: '#9b8cff', accent2: '#35e0ff', label: '뉴런과 뇌',
        eyebrow: 'The Brain',
        title: '뉴런이 연결되어<br><span class="grad">뇌</span>가 됩니다',
        body: '수많은 뉴런의 미세한 전기 신호가 서로 연결되어 생각과 움직임을 만드는 뇌의 네트워크를 이룹니다.'
      },
      {
        accent: '#35e0ff', accent2: '#8fe9ff', label: '뇌파 측정',
        eyebrow: 'Measure',
        title: '<span class="grad">뇌파</span>로<br>신호를 읽습니다',
        body: '두피에 부착한 EEG 전극으로 뇌가 만들어내는 미세한 전기 신호를 실시간으로 측정합니다.'
      },
      {
        accent: '#2fe6c3', accent2: '#8ff2e0', label: 'AI 의도 예측',
        eyebrow: 'Decode',
        title: '<span class="grad">AI</span>가<br>의도를 예측합니다',
        body: '인공지능이 복잡한 뇌파 패턴을 학습해 사용자가 무엇을 하려는지 실시간으로 해석합니다.'
      },
      {
        accent: '#35e0ff', accent2: '#9b8cff', label: '기기 제어',
        eyebrow: 'Control',
        title: '생각으로<br><span class="grad">세상</span>을 움직입니다',
        body: '예측된 의도가 제어 명령이 되어 6축 로봇팔과 전동휠체어 같은 보조기기를 움직입니다.',
        cta: {
          primary: { href: '#contact', label: '연구실 문의' },
          secondary: { href: 'projects.html', label: '연구 살펴보기' }
        }
      }
    ]
  });
})();
