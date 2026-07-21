# BRAIN Lab. — 뇌 및 인공지능 연구실 웹사이트

조선대학교 **뇌 및 인공지능 연구실(BRAIN Lab., 염홍기 교수)** 의 정적(static) 웹사이트입니다.
기존 Wix 사이트(`honggiyeom.wixsite.com/brainlab`)의 **모든 내용**을 담아 새로 제작했습니다.

- 🌐 **라이브 사이트:** https://honggi82.github.io/brain-lab/
- 📦 **저장소:** https://github.com/honggi82/brain-lab
- **몰입형 스크롤 히어로** — [scroll-world](https://github.com/oso95/scroll-world) 의 스크롤 스크럽 기법 적용
- **디자인 시스템 / 모션** — [HyperFrames](https://github.com/heygen-com/hyperframes) 의 토큰 우선(frame.md) 철학 + 스크롤 트리거 모션
- 다크/라이트 테마, 완전 반응형, 외부 빌드 불필요(순수 HTML/CSS/JS)

---

## ✏️ 홈페이지 업데이트 방법 (가장 자주 쓰는 방법)

HTML 등 파일을 수정한 뒤, **아래 세 줄을 실행하면 사이트가 자동으로 갱신됩니다.**

```bash
cd C:\Users\user\Documents\brain-lab-site
git add -A && git commit -m "내용 수정"
git push
```

- `git push` 하면 **GitHub Pages가 자동으로 다시 빌드**합니다. (별도 설정 불필요)
- 보통 **1~2분 뒤** https://honggi82.github.io/brain-lab/ 에 반영됩니다.
- 화면이 안 바뀌면 브라우저 **새로고침(Ctrl+F5)** 하세요. (브라우저 캐시)

> ⚠️ **주의:** 저장소를 **비공개(private)로 바꾸면 무료 GitHub Pages가 중단되어 사이트가 내려갑니다.**
> 반드시 **공개(public)** 로 유지하세요. (소스를 비공개로 두고 싶다면 Netlify/Vercel로 옮기면 됩니다.)

---

## 페이지 구성

| 파일 | 내용 |
|------|------|
| `index.html` | 홈 — 몰입형 히어로(뉴런→EEG→AI→기기제어) + 비전 + 연구 분야 + 방법론 + 성과 지표 + 수상 + 연락처 |
| `gospel.html` | 복음 이야기 — 교수님 메시지 + 유튜브 영상 |
| `about.html` | 연구실 소개 — 세계의 뇌 과학, 미래 핵심 기술 BCI, 세 개의 연구 축 |
| `professor.html` | 교수 소개 — 학력·경력·학술활동·수상·특허·초청강연 |
| `members.html` | 구성원 — 박사/석사/학부 연구원 및 졸업생 |
| `projects.html` | 연구 프로젝트 — 진행중/완료 |
| `publications.html` | 논문 — 국제/국내 저널 및 학회(필터 지원) |
| `photos.html` | 갤러리 — 연구실 사진(클릭 시 확대) |
| `board.html` | 게시판 — 공지·소식·수상 소식 |

## 어디를 고치면 되나 (자주 쓰는 부분)

- **글 내용/구조:** 각 `*.html` 파일을 직접 수정
- **게시판 글 추가:** `board.html` 안의 `<article class="post ...">` 블록을 복사해 추가
- **논문 목록:** `publications.html` 안의 `P = [ ... ]` 배열
- **히어로 장면(문구·이미지·강조색):** `index.html` 맨 아래 `mountHero({ scenes: [...] })`
- **Gospel 영상 교체:** `gospel.html` 의 `youtube.com/embed/<영상ID>` 부분
- **색상·폰트·간격:** `assets/css/site.css` 맨 위의 CSS 변수(`:root`)
- **이미지:** `assets/img/` 에 넣고 파일명을 HTML에서 참조
- **로고:** `assets/img/lab-logo-dark.png`(어두운 배경용), `lab-logo-light.png`(밝은 배경용)

## 로컬에서 미리 보기 (선택)

올리기 전에 내 컴퓨터에서 확인하고 싶을 때:

```bash
cd C:\Users\user\Documents\brain-lab-site
python -m http.server 8000
# 브라우저에서 http://localhost:8000 접속
```

> 웹폰트(Google Fonts)만 인터넷을 사용하며, 오프라인에서도 시스템 폰트로 정상 표시됩니다.

## 커스텀 도메인 (선택)

`brainlab.chosun.ac.kr` 같은 주소를 쓰고 싶으면 저장소 **Settings → Pages → Custom domain** 에서
도메인을 입력하고, DNS에 안내되는 CNAME 레코드를 등록하면 됩니다.

## 다른 호스팅으로 옮기려면 (참고)

정적 사이트라 아무 정적 호스팅에나 폴더째 올리면 됩니다.
- **Netlify:** [app.netlify.com/drop](https://app.netlify.com/drop) 에 폴더를 드래그 앤 드롭 (비공개 소스 + 공개 사이트 가능)
- **Vercel / Cloudflare Pages:** 저장소 연결, 빌드 명령 없음, 출력 디렉터리는 루트

---
© BRAIN Lab. · Hong Gi Yeom, Chosun University.
