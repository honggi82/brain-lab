/* ==========================================================================
   BRAIN Lab. — home BCI story hero
   Configures the scroll-scrubbed cinematic hero (mountHero, assets/js/hero.js,
   a bounded adaptation of github.com/oso95/scroll-world). Scroll advances the
   BCI narrative scene by scene: neurons → brain structure → EEG → AI → robot
   arm → wheelchair. Scenes 5–6 gain a scroll-scrubbed <video> clip when the
   files exist (see `video:` keys). Falls back to a static first scene under
   prefers-reduced-motion (handled inside mountHero).
   ========================================================================== */
(function () {
  var el = document.getElementById('storyhero');
  if (!el || typeof window.mountHero !== 'function') return;

  mountHero(el, {
    hint: 'SCROLL',
    scenes: [
      {
        image: 'assets/img/scene-neurons.jpg',
        accent: '#9b8cff', accent2: '#35e0ff', label: '뉴런',
        eyebrow: 'The Brain',
        title: '모든 것은 <span class="grad">뉴런</span>에서<br>시작됩니다',
        body: '무언가를 의도하는 순간, 뇌 속 수많은 뉴런이 미세한 전기 신호를 일으킵니다. 모든 BCI의 출발점입니다.'
      },
      {
        image: 'assets/img/scene-brain.jpg',
        accent: '#35e0ff', accent2: '#9b8cff', label: '뇌 구조',
        eyebrow: 'Structure',
        title: '신호는 <span class="grad">뇌의 구조</span>를<br>따라 흐릅니다',
        body: '수많은 뉴런이 모여 뇌를 이룹니다. 그 구조와 연결을 이해하는 것이 생각을 읽어내는 첫걸음입니다.'
      },
      {
        image: 'assets/img/scene-eeg.jpg',
        accent: '#2fe6c3', accent2: '#8ff2e0', label: '뇌파 측정',
        eyebrow: 'Measure',
        title: '<span class="grad">뇌파</span>로<br>그 신호를 측정합니다',
        body: '머리에 쓴 전극이 두피 위로 퍼진 미세한 전기 신호(EEG)를 실시간으로 기록합니다.'
      },
      {
        image: 'assets/img/scene-ai.jpg',
        accent: '#9b8cff', accent2: '#c9beff', label: 'AI 예측',
        eyebrow: 'Decode',
        title: '<span class="grad">AI</span>가<br>의도를 읽어냅니다',
        body: '인공지능이 복잡한 뇌파 패턴을 학습해, 사용자가 무엇을 하려는지 실시간으로 예측합니다.'
      },
      {
        image: 'assets/img/scene-robotarm.jpg',
        // video: 'assets/video/scene-robotarm.mp4',
        accent: '#35e0ff', accent2: '#8fe9ff', label: '로봇팔',
        eyebrow: 'Control',
        title: '생각이 <span class="grad">로봇팔</span>을<br>움직이고',
        body: '예측된 의도가 곧 명령이 됩니다. 손을 쓰지 않고, 오직 생각만으로 로봇팔을 제어합니다.'
      },
      {
        image: 'assets/img/scene-wheelchair.jpg',
        // video: 'assets/video/scene-wheelchair.mp4',
        accent: '#2fe6c3', accent2: '#8ff2e0', label: '전동휠체어',
        eyebrow: 'Freedom',
        title: '다시 <span class="grad">세상</span>과<br>연결됩니다',
        body: '전동휠체어를 생각으로 움직여, 움직임이 어려운 사람도 스스로 원하는 곳으로 향합니다.',
        cta: {
          primary: { href: '#contact', label: '연구실 문의' },
          secondary: { href: 'professor.html', label: '교수 소개' }
        }
      }
    ]
  });
})();
