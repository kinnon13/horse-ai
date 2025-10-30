#!/bin/bash

# DEPLOY TO SUPABASE - Automated Script
# Run this from your local machine

echo "🚀 DEPLOYING TO SUPABASE"
echo "=========================="

# Get Supabase connection details
read -p "Enter your Supabase project URL (e.g., db.xxxxx.supabase.co): " SUPABASE_HOST
read -p "Enter your Supabase database password: " -s SUPABASE_PASSWORD
echo ""

SUPABASE_DB_URL="postgresql://postgres:${SUPABASE_PASSWORD}@${SUPABASE_HOST}:5432/postgres"

echo "📦 Creating backup..."
pg_dump "$SUPABASE_DB_URL" > backup_$(date +%Y%m%d_%H%M%S).sql

echo ""
echo "🏗️  Deploying all pillars..."
echo ""

# Deploy in order
psql "$SUPABASE_DB_URL" -f supabase/pillar_1_enhanced_core.sql
psql "$SUPABASE_DB_URL" -f supabase/pillar_2_enhanced_health.sql
psql "$SUPABASE_DB_URL" -f supabase/pillar_3_enhanced_operational.sql
psql "$SUPABASE_DB_URL" -f supabase/pillar_4_enhanced_business_ai.sql
psql "$SUPABASE_DB_URL" -f supabase/pillar_5_enhanced_sustainability_ethics.sql
psql "$SUPABASE_DB_URL" -f supabase/pillar_6_enhanced_ai_omniscience.sql
psql "$SUPABASE_DB_URL" -f supabase/pillar_7_enhanced_hightech_backbone.sql
psql "$SUPABASE_DB_URL" -f supabase/pillar_8_enhanced_future_proof.sql
psql "$SUPABASE_DB_URL" -f supabase/pillar_30_subscription_transaction.sql
psql "$SUPABASE_DB_URL" -f supabase/pillar_32_self_healing_intelligence.sql

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Verifying..."
psql "$SUPABASE_DB_URL" -c "SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'public';"

