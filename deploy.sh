#!/bin/bash

# 🚀 HorseGPT Automated Deployment Script
# This script deploys HorseGPT to Vercel in one command

echo "🐴 ============================================"
echo "🚀 HORSEGPT DEPLOYMENT SCRIPT"
echo "🐴 ============================================"
echo ""
echo "This will deploy your site to Vercel in 5 minutes!"
echo ""

# Step 1: Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the horse-ai directory"
    echo "Run: cd /Users/kinnonpeck/Desktop/horse-ai"
    exit 1
fi

echo "✅ Found project files"
echo ""

# Step 2: Login to Vercel
echo "📝 Step 1/3: Login to Vercel..."
echo "A browser will open. Log in with your account (GitHub, GitLab, or Email)"
echo ""
npx vercel login

if [ $? -ne 0 ]; then
    echo "❌ Login failed. Please try again."
    exit 1
fi

echo ""
echo "✅ Logged in successfully!"
echo ""

# Step 3: Deploy to production
echo "🚀 Step 2/3: Deploying to production..."
echo "This will take 2-3 minutes..."
echo ""

npx vercel --prod --yes \
    --name horsegpt \
    --build-env NEXT_PUBLIC_SUPABASE_URL=https://marufuvyvpeiphnropjo.supabase.co \
    --build-env NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcnVmdXZ5dnBlaXBobnJvcGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTE2MTgsImV4cCI6MjA3NzA2NzYxOH0.Jv7SaWq9J4jE9Yj7AczbmUSgiLsICs_2vCgcmYIQixM

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed. Check the error above."
    exit 1
fi

echo ""
echo "✅ Deployment successful!"
echo ""

# Step 4: Set environment variables
echo "🔑 Step 3/3: Setting environment variables..."
echo ""

# Set Supabase variables
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production <<EOF
https://marufuvyvpeiphnropjo.supabase.co
EOF

npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<EOF
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcnVmdXZ5dnBlaXBobnJvcGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTE2MTgsImV4cCI6MjA3NzA2NzYxOH0.Jv7SaWq9J4jE9Yj7AczbmUSgiLsICs_2vCgcmYIQixM
EOF

npx vercel env add SUPABASE_SERVICE_ROLE_KEY production <<EOF
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcnVmdXZ5dnBlaXBobnJvcGpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQ5MTYxOCwiZXhwIjoyMDc3MDY3NjE4fQ.eIg1qK5BCE6gPZydMBIDuSsQsHtRyL6y0R4OFv7YUQg
EOF

echo ""
echo "✅ Environment variables set!"
echo ""

# Get the deployment URL
DEPLOY_URL=$(npx vercel ls --json | head -1 | grep -o 'https://[^"]*')

echo "🎉 ============================================"
echo "✨ DEPLOYMENT COMPLETE!"
echo "🎉 ============================================"
echo ""
echo "Your site is LIVE at:"
echo "🌐 Production: https://horsegpt.vercel.app"
echo ""
echo "📋 Next Steps:"
echo "1. Open the URL above to see your live site"
echo "2. Test the chat interface at /chat"
echo "3. Go to https://vercel.com/dashboard to:"
echo "   - Add custom domain horsegpt.com"
echo "   - Add AI API keys (OPENAI_API_KEY, etc.)"
echo "   - View logs and analytics"
echo ""
echo "🚀 You're LIVE! Ready to conquer the equine industry!"
echo ""

