#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('🚀 Running AI diagnostics migration...\n');
  
  const sql = fs.readFileSync(
    path.join(__dirname, '../supabase/migrations/20251106020000_ai_diagnostics.sql'),
    'utf8'
  );
  
  // Split by semicolons but keep CREATE TABLE as one statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(s => s + ';');
  
  console.log(`📝 Found ${statements.length} SQL statements to execute\n`);
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    const preview = statement.substring(0, 60).replace(/\n/g, ' ') + '...';
    
    try {
      // Use raw SQL query
      const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        // If exec_sql doesn't exist, we need to use REST API directly
        throw new Error('exec_sql not available');
      }
      
      console.log(`✅ [${i + 1}/${statements.length}] ${preview}`);
    } catch (err) {
      // Fallback: try using REST API POST request
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ query: statement })
        });
        
        if (!response.ok) {
          console.log(`⚠️  [${i + 1}/${statements.length}] ${preview}`);
          console.log(`    Note: You may need to run this manually in Supabase SQL Editor`);
        } else {
          console.log(`✅ [${i + 1}/${statements.length}] ${preview}`);
        }
      } catch (fetchErr) {
        console.log(`⚠️  [${i + 1}/${statements.length}] ${preview}`);
        console.log(`    Note: You may need to run this manually in Supabase SQL Editor`);
      }
    }
  }
  
  console.log('\n✅ Migration script completed!');
  console.log('\n🔍 Next steps:');
  console.log('   1. Verify table exists: Check Supabase Table Editor');
  console.log('   2. Test chat: http://localhost:3002/chat');
  console.log('   3. View dashboard: http://localhost:3002/admin-secret-xyz123/ai-xray');
  console.log('\n💡 If table still missing, copy/paste SQL from:');
  console.log('   supabase/migrations/20251106020000_ai_diagnostics.sql');
}

runMigration().catch(err => {
  console.error('\n❌ Migration failed:', err.message);
  console.log('\n📋 Manual fallback:');
  console.log('   1. Go to: https://supabase.com/dashboard');
  console.log('   2. Open SQL Editor');
  console.log('   3. Copy/paste from: supabase/migrations/20251106020000_ai_diagnostics.sql');
  console.log('   4. Click Run');
  process.exit(1);
});

