@echo off
rem ============================================================
rem  Cloudflare Pages Deployment Script (Windows CMD/PowerShell)
rem  Path: deploy.bat
rem ============================================================

echo 🚀 Starting deployment to Cloudflare Pages...

rem 1. Navigate into frontend folder
echo 📂 Navigating to avati-website...
cd avati-website
if %errorlevel% neq 0 (
    echo ❌ Failed to navigate to avati-website directory.
    exit /b %errorlevel%
)

rem 2. Run clean production build
echo 📦 Running clean production build...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Production build failed!
    exit /b %errorlevel%
)

rem 3. Detect the built output folder dynamically
set DEPLOY_DIR=dist
if exist dist (
    set DEPLOY_DIR=dist
) else if exist out (
    set DEPLOY_DIR=out
) else if exist .next (
    set DEPLOY_DIR=.next
) else (
    echo ❌ Error: Could not find any built assets folder ^(dist, out, or .next^)!
    exit /b 1
)

echo ⛅ Deploying directory '%DEPLOY_DIR%' to Cloudflare Pages project 'avati-safe-storage'...
call npx wrangler pages deploy "%DEPLOY_DIR%" --project-name="avati-safe-storage"
if %errorlevel% neq 0 (
    echo ❌ Cloudflare Pages deployment failed!
    exit /b %errorlevel%
)

echo 🎉 Deployment successfully completed!
cd ..
