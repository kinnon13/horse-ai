#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🚀 Creating ai_interaction_logs table...\n')

// Just create a test record to ensure table exists
// Supabase will auto-create the table structure based on the first insert
async function createTable() {
  try {
    // First, try to query the table to see if it exists
    const { data: existing, error: queryError } = await supabase
      .from('ai_interaction_logs')
      .select('id')
      .limit(1)
    
    if (!queryError) {
      console.log('✅ Table already exists!')
      console.log('🔍 Visit: http://localhost:3002/admin-secret-xyz123/ai-xray')
      return
    }
    
    console.log('⚠️  Table does not exist yet')
    console.log('📋 Creating table with first record...\n')
    
    // Insert a test record - this will create the table
    const { data, error } = await supabase
      .from('ai_interaction_logs')
      .insert({
        user_id: 'system',
        query: 'System initialization',
        context_built: {},
        tools_used: ['setup'],
        emotion_detected: null,
        strategy_used: 'system',
        response_provider: 'system',
        response_source: 'setup',
        final_response: 'AI X-Ray diagnostics system initialized',
        error_occurred: false,
        error_message: null,
        personalized_score: 0,
        missed_opportunities: [],
        execution_time_ms: 0
      })
      .select()
    
    if (error) {
      throw error
    }
    
    console.log('✅ Table created successfully!')
    console.log('✅ Initialized with setup record\n')
    console.log('🔍 Next steps:')
    console.log('   1. Visit: http://localhost:3002/chat')
    console.log('   2. Send a test message')
    console.log('   3. Check: http://localhost:3002/admin-secret-xyz123/ai-xray')
    
  } catch (err) {
    console.error('\n❌ Failed to create table:', err.message)
    console.log('\n📋 Manual fallback required:')
    console.log('   Go to Supabase Dashboard → SQL Editor')
    console.log('   Run: cat supabase/migrations/20251106020000_ai_diagnostics.sql')
  }
}

createTable()

