#!/bin/bash

echo "🚀 Building Melodia Backoffice for production..."

# Clean previous build
rm -rf dist/

# Type check
echo "🔍 Running type check..."
npm run type-check

if [ $? -ne 0 ]; then
    echo "❌ Type check failed"
    exit 1
fi

# Lint check
echo "🔧 Running linter..."
npm run lint

if [ $? -ne 0 ]; then
    echo "❌ Lint check failed"
    exit 1
fi

# Build
echo "📦 Building application..."
npm run build:prod

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Output directory: dist/"
echo "🌐 You can preview with: npm run preview"