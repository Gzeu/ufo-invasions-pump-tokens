#!/bin/bash
# UFO Invasions Deployment Fix Script
# Run this locally first, then push to GitHub

echo "🛸 Starting UFO Invasions deployment fixes..."

# 1. Generate package-lock.json
echo "📦 Generating package-lock.json..."
npm install

# 2. Clean and rebuild
echo "🧹 Cleaning project..."
rm -rf .next/ node_modules/ coverage/
npm install

# 3. Run type checking
echo "🔍 Running TypeScript checks..."
npm run type-check

# 4. Run build test
echo "🏗️ Testing build..."
npm run build

# 5. Test database connection
echo "🗄️ Testing database connection..."
if [ -f "scripts/test-db-connection.js" ]; then
    npm run db:test
else
    echo "⚠️ Database test script not found"
fi

echo "✅ Local fixes complete. Now commit and push to GitHub."
echo "📝 Don't forget to set up Vercel environment variables:"
echo "   - MONGODB_URI"
echo "   - NEXT_PUBLIC_BSC_RPC"
echo "   - NEXT_PUBLIC_CONTRACT_ADDRESS"
