@echo off
setlocal
title BRAIN Lab Website Update

cd /d "%~dp0"

echo.
echo ========================================
echo   BRAIN Lab Website Update
echo ========================================
echo.

where git >nul 2>&1
if errorlevel 1 goto no_git

if not exist ".git\" goto not_repo

set "BRANCH="
for /f "delims=" %%B in ('git branch --show-current 2^>nul') do set "BRANCH=%%B"
if not defined BRANCH goto git_error
if /I not "%BRANCH%"=="main" goto wrong_branch

echo [1/6] Checking the latest GitHub state...
git fetch origin main
if errorlevel 1 goto fetch_error

set "BEHIND="
for /f "delims=" %%N in ('git rev-list --count HEAD..origin/main 2^>nul') do set "BEHIND=%%N"
if not defined BEHIND goto git_error
if not "%BEHIND%"=="0" goto remote_ahead

echo [2/6] Staging website files...
git add -A -- ":(top,glob)*.html" "%~nx0"
if errorlevel 1 goto git_error
if exist "assets\" (
  git add -A -- "assets" ":(top,exclude,glob)assets/**/*.zip" ":(top,exclude,glob)assets/**/*.7z" ":(top,exclude,glob)assets/**/*.rar" ":(top,exclude,glob)assets/**/*.bak-*"
  if errorlevel 1 goto git_error
)

echo [3/6] Checking staged changes...
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

echo [4/6] Publishing the main branch to GitHub...
git push origin main
if errorlevel 1 goto push_error

set "LOCAL_HEAD="
set "REMOTE_HEAD="
for /f "delims=" %%H in ('git rev-parse HEAD 2^>nul') do set "LOCAL_HEAD=%%H"
if not defined LOCAL_HEAD goto verify_error

git fetch origin main >nul 2>&1
if errorlevel 1 goto verify_error
for /f "delims=" %%H in ('git rev-parse origin/main 2^>nul') do set "REMOTE_HEAD=%%H"
if not defined REMOTE_HEAD goto verify_error
if not "%LOCAL_HEAD%"=="%REMOTE_HEAD%" goto verify_error

echo [5/6] Waiting for GitHub Pages deployment...
powershell -NoProfile -Command "$ErrorActionPreference='Stop'; [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $sha='%LOCAL_HEAD%'; $uri='https://api.github.com/repos/honggi82/brain-lab/actions/runs?branch=main' + [char]38 + 'per_page=20'; $deadline=(Get-Date).AddMinutes(5); while ((Get-Date) -lt $deadline) { $runs=(Invoke-RestMethod -Headers @{'User-Agent'='brain-lab-site-update'} -Uri $uri -TimeoutSec 20).workflow_runs; $run=$runs | Where-Object { $_.name -eq 'pages build and deployment' -and $_.head_sha -eq $sha } | Select-Object -First 1; if ($run -and $run.status -eq 'completed') { if ($run.conclusion -eq 'success') { exit 0 } else { exit 2 } }; Start-Sleep -Seconds 5 }; exit 3"
set "PAGES_RESULT=%ERRORLEVEL%"
if "%PAGES_RESULT%"=="0" goto pages_ok
if "%PAGES_RESULT%"=="2" goto pages_failed
if "%PAGES_RESULT%"=="3" goto pages_timeout
goto verify_error

:pages_ok
echo [6/6] GitHub Pages deployment succeeded.
echo.
echo [DONE] The website is published.
echo https://honggi82.github.io/brain-lab/
goto success

:no_changes
echo.
echo [DONE] There are no new website changes to publish.
goto success

:no_git
echo [ERROR] Git is not installed or is not available in PATH.
goto failure

:not_repo
echo [ERROR] Run this file inside the brain-lab-site repository.
goto failure

:wrong_branch
echo [ERROR] The current branch is not main: %BRANCH%
goto failure

:fetch_error
echo [ERROR] Could not fetch the latest state from GitHub.
echo Check the Internet connection and GitHub login.
goto failure

:remote_ahead
echo [STOPPED] GitHub has changes that are missing on this computer.
echo Synchronize the repository before publishing.
goto failure

:commit_error
echo [ERROR] Could not commit the website changes.
goto failure

:push_error
echo [ERROR] Could not publish to GitHub.
echo The local commit is preserved and can be retried.
goto failure

:pages_failed
echo [ERROR] GitHub received the commit, but the Pages deployment failed.
echo Check https://github.com/honggi82/brain-lab/actions
goto failure

:pages_timeout
echo [ERROR] GitHub received the commit, but Pages did not finish within 5 minutes.
echo Check https://github.com/honggi82/brain-lab/actions
goto failure

:verify_error
echo [ERROR] Could not verify the GitHub or GitHub Pages result.
goto failure

:git_error
echo [ERROR] A Git operation failed. Review the message above.
goto failure

:failure
echo.
echo The update did not complete.
echo.
echo Press any key to close this window.
pause >nul
endlocal
exit /b 1

:success
echo.
echo Press any key to close this window.
pause >nul
endlocal
exit /b 0
