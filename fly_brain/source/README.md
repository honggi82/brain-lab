# FlyConnectomeSim 프런트엔드

`fly_brain/app`을 만드는 React·TypeScript 개발 원본입니다. `C:\Users\user\Documents\FlyConnectomeSim\web`의 원본을 복사하여 수정했습니다. 원래 개발 폴더는 보존되어 있습니다.

## 빌드와 검사

Node.js 22.18 이상이 필요합니다. 이 폴더에서 다음 명령을 실행합니다. PowerShell에서는 실행 정책 충돌을 피하기 위해 `npm.cmd`를 사용합니다.

```powershell
npm.cmd ci
npm.cmd test
npm.cmd run check:assets
npm.cmd run build:pages
node scripts/sync-app.mjs
node scripts/sync-app.mjs --apply
```

`npm ci`는 잠금 파일에 기록된 공개 패키지를 설치합니다. 나머지 검사는 로컬에서 수행하며 API·GPU·외부 계산 서비스를 호출하지 않습니다. `sync-app.mjs`는 먼저 변경 목록만 보여주고, `--apply`에서 변경 파일 옆에 날짜·시간이 포함된 백업을 만든 뒤 `../app`에 반영합니다. Git 커밋·업로드·게시 기능은 없습니다.

배포 자료의 단일 원본은 형제 폴더 `../app`입니다. Vite의 `publicDir`가 이를 사용하므로 데이터 144MB를 개발 폴더에 중복 보관하지 않습니다. 빌드 과정에서 복사된 이전 해시 자산은 남겨 두며 기존 페이지 캐시와의 호환성을 유지합니다. `dist`, `node_modules`, `*.bak-*`는 Git에 포함하지 않습니다.

`npm.cmd run dev:pages`는 정적 배포본을 개발 서버에서 보여줍니다. `.env.static`이 `VITE_STATIC=1`을 지정합니다. 일반 `npm.cmd run dev`는 별도의 원본 Python 서버(`http://127.0.0.1:8000`)를 사용하는 개발 모드입니다. Python 백엔드와 원자료 생성 환경은 이 폴더에 포함하지 않았고 이번 수정에서 계산 엔진은 변경하지 않았습니다.

## 검증 범위

- `simulator.test.mjs`: 좌우 출력의 중앙 관절 변환, 관절 범위, 순구동량, 요청 취소·경쟁, 중복 조회·실패 후 재시도. 모든 사전 계산 프레임을 읽어 17개 중앙 관절이 입력을 받는지 검사합니다.
- `replay.test.mjs`: 템플릿의 기존 4개 검사를 그대로 유지합니다. 현재 앱에서 사용하지 않는 템플릿 재생 모듈·소형 자산은 `tests/fixtures`로 격리했습니다.
- `check:assets`: SHA-256, 491개 기록의 모드·방향·시간/홉 구조, 세포체/라벨 ID 일치, 회로 집단 수, 모델 바이너리 범위를 검사합니다.
- 수동 회귀: 상류 프리셋→회로 집단, 연속시간→회로 집단, 다시 실행, 지우기→홉 변경, 언어 전환, 모바일 모델 선택 로딩, 한·영 설명서.

## 데이터와 표시 규칙

계산 결과 JSON과 모델 바이너리는 수정하지 않았습니다. 중앙 목·배의 굽힘은 좌우 평균, 벌림·비틀림은 좌우 차이의 절반을 사용하는 **시각화 규칙**입니다. 신체 색상과 표 정렬은 `흥분 + 음수 억제`의 순값에 따릅니다. 색상·운동 출력 표는 마지막 프레임의 요약값이고 관절 자세는 현재 재생 프레임입니다. 생물학적 정확성을 검증한 모델이라는 의미가 아닙니다.

경로 결과는 홉 1~10을 지원합니다. 온라인의 다른 파라미터는 사전 계산값으로 고정됩니다. `top_k=2500`은 프레임 표시값 제한이며, 최대 4,000개의 자극 마커는 화면 표시 제한입니다. 전체 집단의 계산 수는 `seedCount`입니다.

출처와 라이선스는 `../app/THIRD_PARTY_NOTICES.md`, `../app/static-data/NOTICE.md`, `../app/data/flybody-full/NOTICE.md`를 참고하세요.
