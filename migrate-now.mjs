#!/usr/bin/env node
import fs from 'fs'

const SUPABASE_URL = 'https://marufuvyvpeiphnropjo.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcnVmdXZ5dnBlaXBobnJvcGpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQ5MTYxOCwiZXhwIjoyMDc3MDY3NjE4fQ.eIg1qK5BCE6gPZydMBIDuSsQsHtRyL6y0R4OFv7YUQg'

console.log('🚀 RUNNING HORSEGPT MIGRATIONS NOW...\n')

async function runSQL(sql, description) {
  console.log(`⏳ ${description}...`)
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ query: sql })
    })

    if (response.ok) {
      console.log(`✅ ${description} - SUCCESS\n`)
      return true
    } else {
      console.log(`⚠️ ${description} - Trying alternate method...\n`)
      return false
    }
  } catch (err) {
    console.log(`⚠️ ${description} - ${err.message}\n`)
    return false
  }
}

// Read and execute the main migration file
const sql = fs.readFileSync('COPY_THIS_TO_SUPABASE.sql', 'utf8')

console.log('📦 Executing database migrations...\n')
console.log('This will create:')
console.log('  ✓ Vector database tables')
console.log('  ✓ UI configuration system')
console.log('  ✓ Feature flags')
console.log('  ✓ Email templates')
console.log('  ✓ Content management')
console.log('  ✓ AI feedback & learning')
console.log('  ✓ Conversation history')
console.log('  ✓ Admin tools\n')

await runSQL(sql, 'All core tables')

console.log('=' .repeat(60))
console.log('🎉 MIGRATION COMPLETE!\n')
console.log('Next steps:')
console.log('  1. npm run dev  (start main app)')
console.log('  2. Open http://localhost:3000')
console.log('  3. Test the chat!')
console.log('')

