#!/bin/bash
# ============================================================
#  Cloudflare Pages Deployment Script (Git Bash/Linux/Mac)
#  Path: deploy.sh
# ============================================================

# Exit immediately if any command fails
set -e

echo "🚀 Starting deployment to Cloudflare Pages..."

# 1. Navigate into frontend folder
echo "📂 Navigating to avati-website..."
cd avati-website

# 2. Run clean production build
echo "📦 Running clean production build..."
npm run build

# 3. Detect the built output folder dynamically
DEPLOY_DIR="dist"
if [ -d "dist" ]; then
  DEPLOY_DIR="dist"
elif [ -d "out" ]; then
  DEPLOY_DIR="out"
elif [ -d ".next" ]; then
  DEPLOY_DIR=".next"
else
  echo "❌ Error: Could not find any built assets folder (dist, out, or .next)!"
  exit 1
fi

echo "⛅ Deploying directory '$DEPLOY_DIR' to Cloudflare Pages project 'avati-safe-storage'..."
npx wrangler pages deploy "$DEPLOY_DIR" --project-name="avati-safe-storage"

echo "🎉 Deployment successfully completed!"
