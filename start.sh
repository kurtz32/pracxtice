#!/bin/bash

echo "🚀 Starting Portfolio Admin Server..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the server
echo "🌐 Starting server on http://localhost:3000"
echo "📝 Admin Panel: http://localhost:3000/admin.html"
echo "🎨 Portfolio: http://localhost:3000/index.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start