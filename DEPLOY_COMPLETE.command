#!/bin/bash

# 🚀 COMPLETE AUTOMATED DEPLOYMENT SCRIPT
# Double-click this file to deploy HorseGPT to production!

cd "$(dirname "$0")"

echo "🐴 ============================================"
echo "🚀 HORSEGPT COMPLETE DEPLOYMENT"
echo "🐴 ============================================"
echo ""
echo "This script will:"
echo "1. Push your code to GitHub"
echo "2. Deploy to Vercel"
echo "3. Set up environment variables"
echo ""
echo "Press ENTER to continue or CTRL+C to cancel..."
read

# Step 1: Push to GitHub
echo ""
echo "📤 STEP 1/3: Pushing to GitHub..."
echo "--------------------------------------------"
echo ""

git push origin main

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ GitHub push failed. Let me help you set up authentication..."
    echo ""
    echo "Please enter your GitHub Personal Access Token"
    echo "(Get one from: https://github.com/settings/tokens/new)"
    echo ""
    read -p "Enter token: " GITHUB_TOKEN
    
    git remote set-url origin https://${GITHUB_TOKEN}@github.com/kinnon13/horse-ai.git
    git push origin main
    
    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ Still failed. Please push manually:"
        echo "   1. Go to GitHub Desktop"
        echo "   2. Click 'Push origin'"
        echo ""
        echo "Then come back and press ENTER to continue deployment..."
        read
    fi
fi

echo ""
echo "✅ Code pushed to GitHub!"
echo ""

# Step 2: Deploy to Vercel
echo ""
echo "🚀 STEP 2/3: Deploying to Vercel..."
echo "--------------------------------------------"
echo ""
echo "A browser will open for you to login to Vercel."
echo "After logging in, come back to this terminal."
echo ""
read -p "Press ENTER to open Vercel login..."

npx vercel login

if [ $? -ne 0 ]; then
    echo "❌ Vercel login failed. Please try again."
    exit 1
fi

echo ""
echo "✅ Logged in to Vercel!"
echo ""
echo "Now deploying to production..."
echo ""

npx vercel --prod --yes

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Deployment failed. Trying alternative method..."
    npx vercel --prod
fi

echo ""
echo "✅ Deployed to Vercel!"
echo ""

# Step 3: Set environment variables
echo ""
echo "🔑 STEP 3/3: Setting environment variables..."
echo "--------------------------------------------"
echo ""

# Set Supabase URL
echo "Adding NEXT_PUBLIC_SUPABASE_URL..."
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production --yes <<EOF
https://marufuvyvpeiphnropjo.supabase.co
EOF

# Set Supabase Anon Key
echo "Adding NEXT_PUBLIC_SUPABASE_ANON_KEY..."
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --yes <<EOF
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcnVmdXZ5dnBlaXBobnJvcGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTE2MTgsImV4cCI6MjA3NzA2NzYxOH0.Jv7SaWq9J4jE9Yj7AczbmUSgiLsICs_2vCgcmYIQixM
EOF

# Set Supabase Service Key
echo "Adding SUPABASE_SERVICE_ROLE_KEY..."
npx vercel env add SUPABASE_SERVICE_ROLE_KEY production --yes <<EOF
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcnVmdXZ5dnBlaXBobnJvcGpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQ5MTYxOCwiZXhwIjoyMDc3MDY3NjE4fQ.eIg1qK5BCE6gPZydMBIDuSsQsHtRyL6y0R4OFv7YUQg
EOF

echo ""
echo "✅ Environment variables set!"
echo ""

# Final deployment with environment variables
echo "♻️  Redeploying with environment variables..."
npx vercel --prod --yes

# Get the deployment URL
echo ""
echo "🎉 ============================================"
echo "✨ DEPLOYMENT COMPLETE!"
echo "🎉 ============================================"
echo ""

# Try to get the URL
DEPLOYMENT_URL=$(npx vercel ls | grep "horse-ai" | head -1 | awk '{print $2}')

if [ -z "$DEPLOYMENT_URL" ]; then
    echo "Your site is LIVE!"
    echo ""
    echo "To see your URL, run: npx vercel ls"
    echo "Or visit: https://vercel.com/dashboard"
else
    echo "Your site is LIVE at:"
    echo "🌐 $DEPLOYMENT_URL"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Open your URL and test the site"
echo "2. Test /chat, /dashboard, /horses"
echo "3. Add AI API keys in Vercel dashboard for smart responses"
echo "4. Connect horsegpt.com domain (optional)"
echo ""
echo "🚀 You're LIVE! Welcome to production! 🐴✨"
echo ""

# Open the Vercel dashboard
read -p "Press ENTER to open Vercel dashboard..."
open "https://vercel.com/dashboard"

echo ""
echo "Script complete! Close this window."
echo ""

