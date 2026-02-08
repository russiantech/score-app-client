#!/bin/bash
# build.sh - Robust build script that creates/overwrites dist folder
set -e  # Exit on error

echo "========================================="
echo "🚀 Starting Production Build"
echo "========================================="

# ============ CONFIGURATION ============
BUILD_DIR="dist"
NODE_MEMORY="4096"  # 4GB memory limit
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR=".backup_${TIMESTAMP}"

# ============ CLEANUP ============
echo "📁 Target directory: $BUILD_DIR"

# Create backup if dist exists and has content
if [ -d "$BUILD_DIR" ] && [ -n "$(ls -A $BUILD_DIR 2>/dev/null)" ]; then
    echo "💾 Backing up existing build..."
    mkdir -p "$BACKUP_DIR"
    cp -r "$BUILD_DIR"/* "$BACKUP_DIR/" 2>/dev/null || true
    echo "   Backup created: $BACKUP_DIR"
fi

# Remove dist completely - force clean build
echo "🧹 Cleaning $BUILD_DIR..."
rm -rf "$BUILD_DIR"
echo "   ✓ Removed $BUILD_DIR"

# ============ SETUP ============
echo "⚙️  Setting up environment..."
export NODE_OPTIONS="--max-old-space-size=$NODE_MEMORY"
export NODE_ENV="production"

# Check Node/npm versions
echo "📦 Node.js: $(node --version)"
echo "📦 npm: $(npm --version)"

# ============ DEPENDENCIES ============
echo "📥 Installing dependencies..."

# Force clean install - remove node_modules if needed
if [ -d "node_modules" ]; then
    echo "   Cleaning node_modules..."
    rm -rf node_modules package-lock.json
fi

# Install production dependencies only
# npm ci --omit=dev --ignore-scripts --silent
npm install
echo "   ✓ Dependencies installed"

# ============ BUILD ============
echo "🔨 Building application..."

# Check if build script exists in package.json
if npm run | grep -q "build"; then
    echo "   Using npm run build..."
    npm run build 2>&1 | tee build.log || {
        echo "❌ npm run build failed, check build.log"
        exit 1
    }
else
    echo "   No build script found, using direct Vite build..."
    npx vite build --mode production --emptyOutDir 2>&1 | tee build.log || {
        echo "❌ Vite build failed, check build.log"
        exit 1
    }
fi

# ============ VERIFICATION ============
echo "✅ Build completed!"
echo ""
echo "========================================="
echo "📊 BUILD VERIFICATION"
echo "========================================="

# Check if dist was created
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ ERROR: $BUILD_DIR directory was not created!"
    echo "   Check build.log for errors"
    exit 1
fi

# Check if dist has content
if [ -z "$(ls -A $BUILD_DIR 2>/dev/null)" ]; then
    echo "❌ ERROR: $BUILD_DIR directory is empty!"
    echo "   Check build.log for errors"
    exit 1
fi

# Show build stats
echo "📁 Build directory: $(pwd)/$BUILD_DIR"
echo "📦 Total size: $(du -sh $BUILD_DIR | cut -f1)"
echo "📄 Files created: $(find $BUILD_DIR -type f | wc -l)"

# List key files
echo ""
echo "🔑 Key build files:"
find "$BUILD_DIR" -name "*.html" -o -name "*.js" -o -name "*.css" | head -10

# Check for index.html (required for web apps)
if [ ! -f "$BUILD_DIR/index.html" ]; then
    echo "⚠️  WARNING: index.html not found in build!"
    echo "   This might be a Single Page App with different entry point"
else
    echo "✓ index.html found"
fi

# ============ OPTIONAL: CLEANUP BACKUP ============
if [ -d "$BACKUP_DIR" ] && [ -n "$(ls -A $BACKUP_DIR 2>/dev/null)" ]; then
    read -p "🧹 Delete backup ($BACKUP_DIR)? [y/N]: " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$BACKUP_DIR"
        echo "   ✓ Backup deleted"
    else
        echo "   ⏳ Backup kept: $BACKUP_DIR"
        echo "   Run 'rm -rf $BACKUP_DIR' to delete later"
    fi
fi

echo ""
echo "========================================="
echo "🎉 BUILD SUCCESSFUL!"
echo "========================================="
echo "Next steps:"
echo "1. Deploy the '$BUILD_DIR' folder to your web server"
echo "2. Configure your web server to serve from '$BUILD_DIR'"
echo "3. Test the application"
echo ""
echo "Run 'cat build.log' to see detailed build output"
echo "========================================="