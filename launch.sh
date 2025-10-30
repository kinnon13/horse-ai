#!/bin/bash

# HorseGPT Production Launch Script
# This script sets up everything needed for production launch

echo "🚀 HorseGPT Production Launch Script"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the horse-ai directory"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found"
    echo "📋 Please copy ENVIRONMENT_SETUP.md to .env.local and fill in your credentials"
    echo ""
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "🔧 Step 1: Installing dependencies..."
npm install

echo "🔧 Step 2: Running build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Fix errors before continuing."
    exit 1
fi

echo "✅ Build successful!"

echo "🔧 Step 3: Checking environment variables..."
if [ -f ".env.local" ]; then
    echo "✅ .env.local found"
    
    # Check for required variables
    required_vars=(
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        "SUPABASE_SERVICE_ROLE_KEY"
        "STRIPE_SECRET_KEY"
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    )
    
    missing_vars=()
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" .env.local; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        echo "⚠️  Missing required environment variables:"
        printf '%s\n' "${missing_vars[@]}"
        echo "📋 Please add them to .env.local"
    else
        echo "✅ All required environment variables present"
    fi
else
    echo "⚠️  .env.local not found - please create it"
fi

echo ""
echo "🔧 Step 4: Database setup instructions..."
echo "📋 Run the following SQL in your Supabase SQL editor:"
echo "   supabase/run_all_migrations.sql"
echo ""

echo "🔧 Step 5: Stripe setup instructions..."
echo "📋 Follow STRIPE_SETUP.md to create products and configure webhooks"
echo ""

echo "🔧 Step 6: Testing checklist..."
echo "📋 Follow TESTING_CHECKLIST.md to verify everything works"
echo ""

echo "🎯 Ready for launch!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Run database migrations in Supabase"
echo "2. Configure Stripe products and webhooks"
echo "3. Test all functionality"
echo "4. Deploy to production"
echo "5. Generate NFR referral codes"
echo "6. Go live! 🚀"
echo ""
echo "Admin dashboard: /admin-secret-xyz123"
echo "Quick actions available for testing"
echo ""
echo "Good luck! 🐎"



