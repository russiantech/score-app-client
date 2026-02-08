#!/usr/bin/env bash
# build.sh — CloudLinux alt-nodejs SAFE build with auto-permissions
set -Eeuo pipefail

# ============ SELF-FIX PERMISSIONS ============
# Make this script executable if it isn't already
if [ ! -x "$0" ]; then
    echo "🔧 Fixing script permissions..."
    chmod +x "$0"
    echo "   ✓ Script is now executable"
fi

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
  echo "   Backup created: $BACKUP_DIR"
fi

echo "🧹 Cleaning $BUILD_DIR..."
rm -rf "$BUILD_DIR"
echo "   ✓ Removed $BUILD_DIR"

# ============ ENV ============
echo "⚙️  Setting up environment..."

# ✅ CloudLinux-safe memory limit (reduced from 4096 to 768)
export NODE_OPTIONS="--max-old-space-size=768"

# ✅ Force dev dependencies installation
unset NODE_ENV
export NPM_CONFIG_PRODUCTION="false"

echo "📦 Node.js: $(node --version)"
echo "📦 npm: $(npm --version)"

# ============ INSTALL ============
echo "📥 Installing dependencies (dev included)..."

# Use --legacy-peer-deps if you have peer dependency issues
npm install --include=dev --no-audit --no-fund --loglevel=error

echo "   ✓ Dependencies installed"

# ============ VERIFY ============
echo "🔍 Verifying build tooling..."

# Check critical build tools
MISSING_TOOLS=()

if ! npm list vite >/dev/null 2>&1; then
    MISSING_TOOLS+=("vite")
fi

if ! npm list typescript >/dev/null 2>&1; then
    MISSING_TOOLS+=("typescript")
fi

if ! npm list @types/node >/dev/null 2>&1; then
    MISSING_TOOLS+=("@types/node")
fi

if [ ${#MISSING_TOOLS[@]} -gt 0 ]; then
    echo "   ⚠️  Missing tools: ${MISSING_TOOLS[*]}"
    echo "   Installing missing devDependencies..."
    npm install --save-dev "${MISSING_TOOLS[@]}" --no-audit
fi

echo "   ✓ Tooling verified"

# ============ BUILD ============
echo "🔨 Building application..."

# TypeScript compilation
echo "   Running TypeScript..."
if ! ./node_modules/.bin/tsc -b --incremental false 2>&1 | tee build.log; then
    echo "❌ TypeScript compilation failed"
    cat build.log
    exit 1
fi

# Vite build with minimal memory footprint
echo "   Running Vite (low-memory mode)..."
if ! ./node_modules/.bin/vite build \
  --mode production \
  --emptyOutDir \
  --minify esbuild \
  --sourcemap false \
  --logLevel warn \
  2>&1 | tee -a build.log; then
    echo "❌ Vite build failed"
    cat build.log
    exit 1
fi

# ============ VERIFY ============
echo ""
echo "========================================="
echo "📊 BUILD VERIFICATION"
echo "========================================="

if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ ERROR: dist directory not created"
    echo "   Build log:"
    cat build.log
    exit 1
fi

if [ -z "$(ls -A "$BUILD_DIR" 2>/dev/null)" ]; then
    echo "❌ ERROR: dist directory is empty"
    echo "   Build log:"
    cat build.log
    exit 1
fi

echo "📁 Build directory: $(pwd)/$BUILD_DIR"
echo "📦 Total size: $(du -sh "$BUILD_DIR" | cut -f1)"
echo "📄 Files created: $(find "$BUILD_DIR" -type f | wc -l)"

# Check for index.html
if [ ! -f "$BUILD_DIR/index.html" ]; then
    echo "⚠️  WARNING: index.html not found"
else
    echo "✓ index.html found"
fi

# List key files
echo ""
echo "🔑 Key build files:"
find "$BUILD_DIR" -name "*.html" -o -name "*.js" -o -name "*.css" | head -5

echo ""
echo "========================================="
echo "🎉 BUILD SUCCESSFUL (CloudLinux-safe)"
echo "========================================="
echo "Next steps:"
echo "1. Deploy the 'dist' folder to your web server"
echo "2. Point your web server to serve from 'dist'"
echo ""
echo "Build log saved to: build.log"
echo "========================================="

# Optional: cleanup old backups (keep last 3)
if ls .backup_* 1> /dev/null 2>&1; then
    BACKUP_COUNT=$(ls -d .backup_* 2>/dev/null | wc -l)
    if [ "$BACKUP_COUNT" -gt 3 ]; then
        echo ""
        echo "🧹 Cleaning old backups (keeping last 3)..."
        ls -dt .backup_* | tail -n +4 | xargs rm -rf
        echo "   ✓ Old backups removed"
    fi
fi
