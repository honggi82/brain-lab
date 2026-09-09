# BRAIN Lab. — 뇌 및 인공지능 연구실 웹사이트

조선대학교 **뇌 및 인공지능 연구실(BRAIN Lab., 염홍기 교수)** 의 정적(static) 웹사이트입니다.
기존 Wix 사이트(`honggiyeom.wixsite.com/brainlab`)의 **모든 내용**을 담아 새로 제작했습니다.

- 🌐 **라이브 사이트:** https://honggi82.github.io/brain-lab/
- 🧠 **뇌 해부도:** https://honggi82.github.io/brain-lab/about_brain/
- 📦 **저장소:** https://github.com/honggi82/brain-lab
- **몰입형 스크롤 히어로** — [scroll-world](https://github.com/oso95/scroll-world) 의 스크롤 스크럽 기법 적용
- **디자인 시스템 / 모션** — [HyperFrames](https://github.com/heygen-com/hyperframes) 의 토큰 우선(frame.md) 철학 + 스크롤 트리거 모션
- 다크/라이트 테마, 완전 반응형, 외부 빌드 불필요(순수 HTML/CSS/JS)

---

## ✏️ 홈페이지 업데이트 방법 (가장 자주 쓰는 방법)

이 폴더의 HTML·사진·CSS·JavaScript 등을 수정한 뒤 **`site_update.bat`를 더블클릭**하세요. 실행한 위치와 관계없이 배치 파일이 있는 홈페이지 폴더를 사용합니다.

- 루트 HTML, `assets/`, `about_brain/` 전체와 README·사이트 설정 파일을 함께 반영합니다. 뇌 해부도의 메뉴 포함 화면과 독립 실행 화면도 이 폴더에서 함께 관리합니다.
- 백업, 참조 저장소, 원본 압축 묶음은 게시 대상에서 제외합니다. 배포용 섬유 자료인 `.bin.gz`는 포함합니다.
- GitHub에 새 커밋이 있고 로컬에 수정 내용이 없으면 먼저 최신 내용으로 동기화합니다. 양쪽에 변경이 있거나 자동 병합이 불가능하면 파일을 보존하고 중단하므로, 충돌을 정리한 뒤 다시 실행하세요.
- 변경 사항을 커밋·업로드하고 **GitHub Pages 배포 완료까지 확인**합니다. 실패하면 오류가 출력되며, 업로드하지 못한 로컬 커밋은 다음 실행에서 다시 전송할 수 있습니다.
- 보통 **1~2분 뒤** https://honggi82.github.io/brain-lab/ 에 반영됩니다. 자동 검사에서는 `site_update.bat --no-pause`로 종료 대기를 생략할 수 있습니다.
- 화면이 안 바뀌면 브라우저 **새로고침(Ctrl+F5)** 하세요. (브라우저 캐시)

> ⚠️ **주의:** 저장소를 **비공개(private)로 바꾸면 무료 GitHub Pages가 중단되어 사이트가 내려갑니다.**
> 반드시 **공개(public)** 로 유지하세요. (소스를 비공개로 두고 싶다면 Netlify/Vercel로 옮기면 됩니다.)

---

## 페이지 구성

| 파일 | 내용 |
|------|------|
| `index.html` | 홈 — 몰입형 히어로(뉴런→EEG→AI→기기제어) + 비전 + 연구 분야 + 방법론 + 성과 지표 + 수상 + 연락처 |
| `gospel.html` | 복음 이야기 — 교수님 메시지 + 유튜브 영상 |
| `about_brain/index.html` | 뇌 해부도 — 한국어·영어 3D 해부학, 기능 탐색과 백질 연결 |
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
- **히어로 문구(3D 뇌 히어로):** `index.html` 의 `#brainhero` 안 `[data-beat]` 블록(문구), 3D 동작은 `assets/js/brain3d.js`
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

## 뇌 해부도 앱 배포

`about_brain/index.html`은 공통 메뉴 아래에 뇌 해부도를 표시합니다. 메뉴 순서는 `연구 분야 → 뇌 해부도 → 교수`이며, 공통 KR/EN 선택이 앱의 언어에도 적용됩니다. `viewer.html`은 별도 비공개 개발 저장소에서 빌드한 앱입니다. 개발 저장소에서 `npm run build:pages` 실행 후 `python scripts/integrate-lab.py <이 저장소 경로>`로 통합합니다. `lab-shell.js`·`lab-shell.css`, 모델·섬유 자료 및 출처·라이선스 문서를 함께 유지해야 합니다. 기존 GitHub Pages 설정은 유지합니다.
