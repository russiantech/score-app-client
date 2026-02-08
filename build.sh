# First, let's fix the package-lock.json issue
npm install --package-lock-only

# Now update your build.sh:
cat > build.sh << 'EOF'
#!/bin/bash
# Optimized build for shared hosting

echo "=== Starting Build Process ==="

# Clean previous builds
echo "1. Cleaning previous builds..."
rm -rf dist node_modules/.vite

# Set memory limits for Node.js
echo "2. Setting memory limits..."
export NODE_OPTIONS="--max-old-space-size=4096"

# Ensure package-lock.json exists
if [ ! -f "package-lock.json" ]; then
    echo "3. Generating package-lock.json..."
    npm install --package-lock-only --ignore-scripts
fi

# Install dependencies (dev dependencies included for build)
echo "4. Installing dependencies..."
npm ci --include=dev --ignore-scripts

# Check if tsc is available
echo "5. Building TypeScript..."
if command -v tsc &> /dev/null; then
    tsc -b
else
    npx tsc -b
fi

# Build with Vite
echo "6. Building Vite application..."
if command -v vite &> /dev/null; then
    vite build --mode production --emptyOutDir
else
    npx vite build --mode production --emptyOutDir
fi

echo "=== Build Complete ==="
echo "Size of dist folder:"
du -sh dist/
EOF

# Make it executable
# chmod +x build.sh