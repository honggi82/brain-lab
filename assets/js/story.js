/* ==========================================================================
   BRAIN Lab. — home BCI story hero
   Scroll-scrubbed cinematic hero (mountHero, assets/js/hero.js — a bounded
   adaptation of github.com/oso95/scroll-world). Scroll advances the BCI arc.
   Three scenes are Higgsfield "morph" clips (start→end image) that the engine
   scrubs frame-by-frame: scroll down = play, scroll up = reverse.
     1 (video) 뉴런이 연결되어 뇌가 된다   scene-neurons → scene-brain
     2 (video) 뇌에서 뇌파를 측정한다       scene-brain   → scene-eeg
     3 (image) AI가 의도를 읽어낸다         scene-ai (bridge)
     4 (video) 로봇팔·전동휠체어를 제어한다 scene-robotarm → scene-wheelchair
   Each video scene carries its start frame as `image:` (poster + reduced-motion
   / no-video fallback). Falls back to a static first scene inside mountHero.
   ========================================================================== */
(function () {
  var el = document.getElementById('storyhero');
  if (!el || typeof window.mountHero !== 'function') return;

  mountHero(el, {
    hint: 'SCROLL',
    scenes: [
      {
        image: 'assets/img/scene-neurons.jpg',
        video: 'assets/video/scene-neurons-brain.mp4',
        accent: '#9b8cff', accent2: '#35e0ff', label: '뉴런 → 뇌',
        eyebrow: 'The Brain',
        title: '뉴런이 모여<br><span class="grad">뇌</span>가 됩니다',
        body: '무수한 뉴런이 미세한 전기 신호로 서로 연결되어 뇌를 이룹니다. 모든 생각이 시작되는 곳입니다.'
      },
      {
        image: 'assets/img/scene-brain.jpg',
        video: 'assets/video/scene-brain-eeg.mp4',
        accent: '#35e0ff', accent2: '#8fe9ff', label: '뇌파 측정',
        eyebrow: 'Measure',
        title: '<span class="grad">뇌파</span>로<br>그 신호를 읽습니다',
        body: '머리에 쓴 전극이 뇌가 만들어내는 미세한 전기 신호(EEG)를 실시간으로 측정합니다.'
      },
      {
        image: 'assets/img/scene-ai.jpg',
        accent: '#2fe6c3', accent2: '#8ff2e0', label: 'AI 예측',
        eyebrow: 'Decode',
        title: '<span class="grad">AI</span>가<br>의도를 읽어냅니다',
        body: '인공지능이 복잡한 뇌파 패턴을 학습해, 사용자가 무엇을 하려는지 실시간으로 예측합니다.'
      },
      {
        image: 'assets/img/scene-robotarm.jpg',
        video: 'assets/video/scene-control.mp4',
        accent: '#35e0ff', accent2: '#8fe9ff', label: '제어',
        eyebrow: 'Control',
        title: '생각으로<br><span class="grad">세상</span>을 움직입니다',
        body: '예측된 의도가 곧 명령이 됩니다. 로봇팔과 전동휠체어를 — 움직임 없이, 오직 생각만으로 제어합니다.',
        cta: {
          primary: { href: '#contact', label: '연구실 문의' },
          secondary: { href: 'professor.html', label: '교수 소개' }
        }
      }
    ]
  });
})();
