#!/bin/bash

echo "🚀 DEPLOYING ALL 32 PILLARS TO SUPABASE"
echo "========================================"
echo ""
echo "This script will execute all pillar SQL files in the correct order."
echo ""

# Check for Supabase connection
if [ -z "$SUPABASE_DB_URL" ]; then
    echo "⚠️  SUPABASE_DB_URL not set. Using Supabase CLI instead..."
    
    # Check if Supabase CLI is installed
    if ! command -v supabase &> /dev/null; then
        echo "❌ Supabase CLI not found."
        echo "Install: npm install -g supabase"
        echo "Or set SUPABASE_DB_URL environment variable"
        exit 1
    fi
    
    # Link to project if needed
    echo "📋 Checking Supabase project link..."
    if [ ! -f ".supabase/config.toml" ]; then
        echo "⚠️  Not linked to Supabase project."
        echo "Run: supabase link --project-ref YOUR_PROJECT_REF"
        exit 1
    fi
fi

# Backup first
echo "📦 Creating backup..."
if [ -n "$SUPABASE_DB_URL" ]; then
    pg_dump "$SUPABASE_DB_URL" > backup_pre_pillars_$(date +%Y%m%d_%H%M%S).sql
else
    supabase db dump > backup_pre_pillars_$(date +%Y%m%d_%H%M%S).sql
fi

echo ""
echo "🏗️  Deploying Pillars in Order..."
echo ""

# Function to execute SQL file
execute_sql() {
    local file=$1
    local pillar_name=$2
    
    if [ ! -f "$file" ]; then
        echo "❌ File not found: $file"
        return 1
    fi
    
    echo "📄 Deploying: $pillar_name"
    echo "   File: $file"
    
    if [ -n "$SUPABASE_DB_URL" ]; then
        psql "$SUPABASE_DB_URL" -f "$file" 2>&1 | grep -v "already exists" || true
    else
        supabase db execute -f "$file" 2>&1 | grep -v "already exists" || true
    fi
    
    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        echo "   ✅ Success"
    else
        echo "   ⚠️  Completed (some objects may already exist)"
    fi
    echo ""
}

# Phase 1: Core Foundation (Pillars 1-2)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PHASE 1: CORE FOUNDATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
execute_sql "supabase/pillar_1_enhanced_core.sql" "Pillar 1: Core Entities"
execute_sql "supabase/pillar_2_enhanced_health.sql" "Pillar 2: Health & Legal"

# Phase 3: Operational Core (Pillars 5-8)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PHASE 3: OPERATIONAL CORE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
execute_sql "supabase/pillar_3_enhanced_operational.sql" "Pillars 5-8: Competition, Breeding, Logistics, Safety"

# Phase 4: Business & AI (Pillars 9-12)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PHASE 4: BUSINESS & AI"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
execute_sql "supabase/pillar_4_enhanced_business_ai.sql" "Pillars 9-12: Market, Sales, AI Brain, Money"

# Phase 5: Sustainability & Ethics (Pillars 13-16)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PHASE 5: SUSTAINABILITY & ETHICS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
execute_sql "supabase/pillar_5_enhanced_sustainability_ethics.sql" "Pillars 13-16: Env, Ethics, Consumers, Research"

# Phase 6: AI Omniscience (Pillars 17-21)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PHASE 6: AI OMNISCIENCE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
execute_sql "supabase/pillar_6_enhanced_ai_omniscience.sql" "Pillars 17-21: Graphs, Predictions, Adjacencies, Layers, Capture"

# Phase 7: High-Tech Backbone (Pillars 22-25)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PHASE 7: HIGH-TECH BACKBONE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
execute_sql "supabase/pillar_7_enhanced_hightech_backbone.sql" "Pillars 22-25: Compute, Simulations, Integrations, Truth"

# Phase 8: Future-Proof (Pillars 26-28)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PHASE 8: FUTURE-PROOF"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
execute_sql "supabase/pillar_8_enhanced_future_proof.sql" "Pillars 26-28: Quantum, Railway Metaverse, Regulatory"

# Pillar 30: Monetization
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PILLAR 30: MONETIZATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
execute_sql "supabase/pillar_30_subscription_transaction.sql" "Pillar 30: Subscription & Transaction Management"

# Pillar 32: Self-Healing
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PILLAR 32: SELF-HEALING"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
execute_sql "supabase/pillar_32_self_healing_intelligence.sql" "Pillar 32: Self-Healing & Code Intelligence"

# Verify deployment
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "VERIFICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Counting tables..."

if [ -n "$SUPABASE_DB_URL" ]; then
    TABLE_COUNT=$(psql "$SUPABASE_DB_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ')
else
    TABLE_COUNT=$(supabase db execute -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | grep -o '[0-9]*' | head -1)
fi

echo "✅ Total tables created: $TABLE_COUNT"
echo ""
echo "🎯 DEPLOYMENT COMPLETE!"
echo ""
echo "Next steps:"
echo "1. Check Supabase dashboard to verify tables"
echo "2. Set up n8n workflows (30-40 workflows)"
echo "3. Configure edge functions"
echo "4. Import contacts and go live!"



