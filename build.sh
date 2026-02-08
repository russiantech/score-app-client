#!/usr/bin/env bash
# build.sh — CloudLinux alt-nodejs SAFE build
set -Eeuo pipefail

echo "========================================="
echo "🚀 Starting Production Build"
echo "========================================="

# ============ CONFIG ============
BUILD_DIR="dist"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR=".backup_${TIMESTAMP}"

# ============ CLEAN ============
echo "📁 Target directory: $BUILD_DIR"

if [ -d "$BUILD_DIR" ] && [ -n "$(ls -A "$BUILD_DIR" 2>/dev/null)" ]; then
  echo "💾 Backing up existing build..."
  mkdir -p "$BACKUP_DIR"
  cp -r "$BUILD_DIR"/* "$BACKUP_DIR/" 2>/dev/null || true
fi

echo "🧹 Cleaning $BUILD_DIR..."
rm -rf "$BUILD_DIR"

# ============ ENV ============
echo "⚙️  Setting up environment..."

# 🔴 DO NOT use forbidden flags on CloudLinux
export NODE_OPTIONS="--max-old-space-size=768"

# Force devDependencies install even if host sets production
export NODE_ENV="development"
export NPM_CONFIG_PRODUCTION="false"

echo "📦 Node.js: $(node --version)"
echo "📦 npm: $(npm --version)"

# ============ INSTALL ============
echo "📥 Installing dependencies (dev included)..."
npm install --include=dev --no-audit --no-fund

# ============ VERIFY ============
echo "🔍 Verifying build tooling..."
npm list vite >/dev/null
npm list typescript >/dev/null
npm list @types/node >/dev/null
echo "   ✓ Tooling verified"

# ============ BUILD ============
echo "🔨 Building application..."

echo "   Running TypeScript..."
./node_modules/.bin/tsc -b --incremental false 2>&1 | tee build.log

echo "   Running Vite (low-memory)..."
./node_modules/.bin/vite build \
  --mode production \
  --emptyOutDir \
  --minify esbuild \
  --sourcemap false \
  --logLevel warn \
  2>&1 | tee -a build.log

# ============ VERIFY ============
echo ""
echo "========================================="
echo "📊 BUILD VERIFICATION"
echo "========================================="

if [ ! -d "$BUILD_DIR" ] || [ -z "$(ls -A "$BUILD_DIR")" ]; then
  echo "❌ Build failed — dist missing or empty"
  exit 1
fi

echo "📁 dist size: $(du -sh "$BUILD_DIR" | cut -f1)"
echo "📄 files: $(find "$BUILD_DIR" -type f | wc -l)"
[ -f "$BUILD_DIR/index.html" ] && echo "✓ index.html found"

echo ""
echo "🎉 BUILD SUCCESSFUL (CloudLinux-safe)"
