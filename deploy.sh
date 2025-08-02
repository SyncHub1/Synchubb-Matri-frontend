#!/bin/bash

# 🚀 SyncHubb Matri-Verse Vercel Deployment Script

echo "🚀 Starting SyncHubb Matri-Verse deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel..."
    vercel login
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Vercel
    echo "🚀 Deploying to Vercel..."
    vercel --prod
    
    echo "🎉 Deployment completed!"
    echo "📋 Next steps:"
    echo "1. Copy the deployment URL"
    echo "2. Update main frontend environment variables"
    echo "3. Test the integration"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi 