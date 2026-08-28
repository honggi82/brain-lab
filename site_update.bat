@echo off
chcp 65001 >nul
setlocal
title BRAIN Lab 홈페이지 자동 업데이트

cd /d "%~dp0"

echo.
echo ========================================
echo   BRAIN Lab 홈페이지 자동 업데이트
echo ========================================
echo.

where git >nul 2>&1
if errorlevel 1 goto no_git

if not exist ".git\" goto not_repo

set "BRANCH="
for /f "delims=" %%B in ('git branch --show-current 2^>nul') do set "BRANCH=%%B"
if not defined BRANCH goto git_error
if /I not "%BRANCH%"=="main" goto wrong_branch

echo [1/5] GitHub의 최신 상태를 확인합니다...
git fetch origin main
if errorlevel 1 goto fetch_error

set "BEHIND="
for /f "delims=" %%N in ('git rev-list --count HEAD..origin/main 2^>nul') do set "BEHIND=%%N"
if not defined BEHIND goto git_error
if not "%BEHIND%"=="0" goto remote_ahead

echo [2/5] 홈페이지 변경 파일을 추가합니다...
git add -A -- ":(top,glob)*.html" "%~nx0"
if errorlevel 1 goto git_error
if exist "assets\" (
  git add -A -- "assets"
  if errorlevel 1 goto git_error
)

echo [3/5] 커밋할 변경 사항을 확인합니다...
git diff --cached --quiet
if errorlevel 2 goto git_error
if errorlevel 1 goto make_commit
goto push_check

:make_commit
set "STAMP="
for /f "delims=" %%T in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH-mm-ss"') do set "STAMP=%%T"
if not defined STAMP set "STAMP=%DATE%_%TIME%"

git commit -m "Website auto update %STAMP%"
if errorlevel 1 goto commit_error

:push_check
set "AHEAD="
for /f "delims=" %%N in ('git rev-list --count origin/main..HEAD 2^>nul') do set "AHEAD=%%N"
if not defined AHEAD goto git_error
if "%AHEAD%"=="0" goto no_changes

echo [4/5] GitHub main 브랜치에 게시합니다...
git push origin main
if errorlevel 1 goto push_error

echo [5/5] 게시 결과를 확인합니다...
git fetch origin main >nul 2>&1
if errorlevel 1 goto verify_error

set "LOCAL_HEAD="
set "REMOTE_HEAD="
for /f "delims=" %%H in ('git rev-parse HEAD 2^>nul') do set "LOCAL_HEAD=%%H"
for /f "delims=" %%H in ('git rev-parse origin/main 2^>nul') do set "REMOTE_HEAD=%%H"
if not defined LOCAL_HEAD goto verify_error
if not defined REMOTE_HEAD goto verify_error
if not "%LOCAL_HEAD%"=="%REMOTE_HEAD%" goto verify_error

echo.
echo [완료] 홈페이지 파일을 GitHub에 게시했습니다.
echo GitHub Pages 반영에는 몇 분이 걸릴 수 있습니다.
echo https://honggi82.github.io/brain-lab/
goto finish

:no_changes
echo.
echo [완료] 새로 게시할 홈페이지 변경 사항이 없습니다.
goto finish

:no_git
echo [오류] Git이 설치되어 있지 않거나 명령을 찾을 수 없습니다.
echo Git for Windows를 설치한 뒤 다시 실행하세요.
goto failed

:not_repo
echo [오류] 이 파일은 brain-lab-site 폴더 안에서 실행해야 합니다.
goto failed

:wrong_branch
echo [오류] 현재 브랜치가 main이 아닙니다. 현재 브랜치: %BRANCH%
echo Codex에 확인을 요청하세요.
goto failed

:fetch_error
echo [오류] GitHub의 최신 상태를 확인하지 못했습니다.
echo 인터넷 연결 또는 GitHub 로그인을 확인하세요.
goto failed

:remote_ahead
echo [중단] GitHub에 이 컴퓨터에 없는 새 변경 사항이 있습니다.
echo 안전을 위해 자동 게시하지 않았습니다. Codex에 동기화를 요청하세요.
goto failed

:commit_error
echo [오류] 변경 사항을 커밋하지 못했습니다.
echo 위의 Git 오류 내용을 확인한 뒤 Codex에 문의하세요.
goto failed

:push_error
echo [오류] GitHub에 게시하지 못했습니다.
echo 커밋은 컴퓨터에 보관되어 있으므로 오류를 해결한 뒤 다시 실행할 수 있습니다.
goto failed

:verify_error
echo [오류] 게시 후 GitHub와 같은 상태인지 확인하지 못했습니다.
echo 위의 오류 내용을 확인한 뒤 Codex에 문의하세요.
goto failed

:git_error
echo [오류] Git 작업 중 문제가 발생했습니다.
echo 위의 오류 내용을 확인한 뒤 Codex에 문의하세요.
goto failed

:failed
echo.
echo 업데이트를 완료하지 못했습니다.

:finish
echo.
echo 아무 키나 누르면 창이 닫힙니다.
pause >nul
endlocal
exit /b
