#!/bin/bash
# build.sh - Optimized build for low-memory environments / shared-hosting/cpanel

echo "Cleaning previous builds..."
rm -rf dist node_modules/.vite

echo "Setting memory limits..."
export NODE_OPTIONS="--max-old-space-size=4096"

echo "Installing dependencies with optimization..."
npm ci --omit=dev --ignore-scripts

echo "Building TypeScript..."
tsc -b --incremental

echo "Building Vite with optimization..."
vite build --mode production --emptyOutDir

echo "Build complete! Size of dist folder:"
du -sh dist/