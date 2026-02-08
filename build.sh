#!/usr/bin/env bash
# build.sh — CloudLinux-safe, Vite + TypeScript production build
set -Eeuo pipefail

echo "========================================="
echo "🚀 Starting Production Build"
echo "========================================="

# ============ CONFIGURATION ============
BUILD_DIR="dist"
NODE_MEMORY="4096"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR=".backup_${TIMESTAMP}"

# ============ CLEANUP ============
echo "📁 Target directory: $BUILD_DIR"

if [ -d "$BUILD_DIR" ] && [ -n "$(ls -A "$BUILD_DIR" 2>/dev/null)" ]; then
  echo "💾 Backing up existing build..."
  mkdir -p "$BACKUP_DIR"
  cp -r "$BUILD_DIR"/* "$BACKUP_DIR/" 2>/dev/null || true
  echo "   Backup created: $BACKUP_DIR"
fi

echo "🧹 Cleaning $BUILD_DIR..."
rm -rf "$BUILD_DIR"
echo "   ✓ Removed $BUILD_DIR"

# ============ ENVIRONMENT ============
echo "⚙️  Setting up environment..."
export NODE_OPTIONS="--max-old-space-size=${NODE_MEMORY}"

# 🔴 CRITICAL: force devDependencies install even on production hosts
export NODE_ENV="development"
export NPM_CONFIG_PRODUCTION="false"

echo "📦 Node.js: $(node --version)"
echo "📦 npm: $(npm --version)"

# ============ DEPENDENCIES ============
echo "📥 Installing dependencies (including devDependencies)..."

# CloudLinux-safe install (never use npm ci here)
npm install --include=dev

# ============ VERIFICATION ============
echo "🔍 Verifying required build tooling..."

REQUIRED_PKGS=(
  "vite"
  "typescript"
  "@types/node"
)

for pkg in "${REQUIRED_PKGS[@]}"; do
  if ! npm list "$pkg" >/dev/null 2>&1; then
    echo "   ⚠️  Missing $pkg — installing..."
    npm install --save-dev "$pkg"
  fi
done

echo "   ✓ Tooling verified"

# ============ BUILD ============
echo "🔨 Building application..."

echo "   Running: tsc -b"
./node_modules/.bin/tsc -b 2>&1 | tee build.log

echo "   Running: vite build"
./node_modules/.bin/vite build --mode production --emptyOutDir 2>&1 | tee -a build.log

# ============ POST-BUILD VERIFICATION ============
echo ""
echo "========================================="
echo "📊 BUILD VERIFICATION"
echo "========================================="

if [ ! -d "$BUILD_DIR" ]; then
  echo "❌ ERROR: $BUILD_DIR was not created"
  exit 1
fi

if [ -z "$(ls -A "$BUILD_DIR" 2>/dev/null)" ]; then
  echo "❌ ERROR: $BUILD_DIR is empty"
  exit 1
fi

echo "📁 Build directory: $(pwd)/$BUILD_DIR"
echo "📦 Total size: $(du -sh "$BUILD_DIR" | cut -f1)"
echo "📄 Files created: $(find "$BUILD_DIR" -type f | wc -l)"

echo ""
echo "🔑 Key build files:"
find "$BUILD_DIR" -type f \( -name "*.html" -o -name "*.js" -o -name "*.css" \) | head -10

if [ -f "$BUILD_DIR/index.html" ]; then
  echo "✓ index.html found"
else
  echo "⚠️  WARNING: index.html not found"
fi

# ============ BACKUP NOTICE ============
if [ -d "$BACKUP_DIR" ] && [ -n "$(ls -A "$BACKUP_DIR" 2>/dev/null)" ]; then
  echo ""
  echo "🧹 Backup saved at: $BACKUP_DIR"
  echo "   Remove later with: rm -rf $BACKUP_DIR"
fi

echo ""
echo "========================================="
echo "🎉 BUILD SUCCESSFUL!"
echo "========================================="
echo "Next steps:"
echo "1. Serve '$BUILD_DIR' via Apache/Nginx"
echo "2. Node.js is NOT required at runtime"
echo "3. Add SPA routing (.htaccess) if needed"
echo ""
echo "Build log: build.log"
echo "========================================="
