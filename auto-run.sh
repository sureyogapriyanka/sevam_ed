#!/bin/bash
echo "🚀 Checking environment..."

# install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# run vite dev server
echo "⚡ Starting development server..."
npm run dev
