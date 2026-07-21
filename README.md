# BRAIN Lab. — 뇌 및 인공지능 연구실 웹사이트

조선대학교 **뇌 및 인공지능 연구실(BRAIN Lab., 염홍기 교수)** 의 정적(static) 웹사이트입니다.
기존 Wix 사이트(`honggiyeom.wixsite.com/brainlab`)의 **모든 내용**을 담아 새로 제작했습니다.

- **몰입형 스크롤 히어로** — [scroll-world](https://github.com/oso95/scroll-world) 의 스크롤 스크럽 기법을 적용
- **디자인 시스템 / 모션** — [HyperFrames](https://github.com/heygen-com/hyperframes) 의 토큰 우선(frame.md) 철학과 스크롤 트리거 모션을 적용
- 다크/라이트 테마, 완전 반응형, 외부 빌드 불필요(순수 HTML/CSS/JS)

## 페이지 구성

| 파일 | 내용 |
|------|------|
| `index.html` | 홈 — 몰입형 히어로 + 비전 + 연구 분야 + 방법론 + 성과 지표 + 수상 + 연락처 |
| `about.html` | 연구실 소개 — 세계의 뇌 과학, 미래 핵심 기술 BCI, 세 개의 연구 축 |
| `professor.html` | 교수 소개 — 학력·경력·학술활동·수상·특허·초청강연 |
| `members.html` | 구성원 — 박사/석사/학부 연구원 및 졸업생 |
| `projects.html` | 연구 프로젝트 — 진행중/완료 |
| `publications.html` | 논문 — 국제/국내 저널 및 학회(필터 지원) |
| `photos.html` | 갤러리 — 연구실 사진(라이트박스) |
| `gospel.html` | 복음 이야기 — 교수님 개인 메시지 |

## 로컬에서 미리 보기

```bash
cd brain-lab-site
python -m http.server 8000
# 브라우저에서 http://localhost:8000 접속
```

> 폰트(Google Fonts)만 인터넷을 사용하며, 오프라인에서도 시스템 폰트로 정상 표시됩니다.

## 게시(배포) 방법

정적 사이트이므로 **아무 정적 호스팅에나 폴더째 올리면 끝**입니다. 대표적인 무료 방법:

### 1) GitHub Pages (추천)
1. GitHub에 새 저장소 생성 후 이 폴더 내용을 push
2. 저장소 **Settings → Pages → Branch: `main` / root** 선택 후 저장
3. 몇 분 뒤 `https://<사용자명>.github.io/<저장소명>/` 에서 공개

### 2) Netlify (드래그 앤 드롭, 가장 간단)
1. [netlify.com](https://app.netlify.com/drop) 접속
2. `brain-lab-site` 폴더를 페이지에 **드래그 앤 드롭**
3. 즉시 `https://랜덤이름.netlify.app` 주소 발급 (원하면 커스텀 도메인 연결)

### 3) Vercel / Cloudflare Pages
- [vercel.com](https://vercel.com) 또는 [pages.cloudflare.com](https://pages.cloudflare.com) 에서 저장소 연결
- 빌드 명령 없음, 출력 디렉터리는 폴더 루트로 지정

### 커스텀 도메인 연결
어느 호스팅이든 대시보드에서 도메인(예: `brainlab.chosun.ac.kr`)을 연결할 수 있습니다.
DNS의 CNAME/A 레코드를 호스팅이 안내하는 값으로 설정하면 됩니다.

## 콘텐츠 수정 안내

- 텍스트/구조: 각 `*.html` 직접 수정
- 색상·폰트·간격: `assets/css/site.css` 상단의 CSS 변수(`:root`)
- 히어로 장면(문구·이미지·강조색): `index.html` 하단의 `mountHero({ scenes: [...] })`
- 논문 목록: `publications.html` 안의 `P = [ ... ]` 배열
- 이미지: `assets/img/`, 영상: `assets/video/`

---
© BRAIN Lab. · Hong Gi Yeom, Chosun University.
