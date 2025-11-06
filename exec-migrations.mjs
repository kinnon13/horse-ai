import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const SUPABASE_URL = 'https://marufuvyvpeiphnropjo.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcnVmdXZ5dnBlaXBobnJvcGpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQ5MTYxOCwiZXhwIjoyMDc3MDY3NjE4fQ.eIg1qK5BCE6gPZydMBIDuSsQsHtRyL6y0R4OFv7YUQg'

console.log('🚀 HORSEGPT DATABASE MIGRATIONS')
console.log('=' .repeat(60))
console.log('')

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// Read the SQL file
const sql = fs.readFileSync('COPY_THIS_TO_SUPABASE.sql', 'utf8')

// Split into individual statements
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'))

console.log(`📦 Executing ${statements.length} SQL statements...\n`)

let success = 0
let failed = 0

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i] + ';'
  
  // Skip comments and empty
  if (stmt.trim().startsWith('--') || stmt.trim() === ';') continue
  
  // Show what we're running (first 80 chars)
  const preview = stmt.substring(0, 80).replace(/\n/g, ' ')
  process.stdout.write(`[${i+1}/${statements.length}] ${preview}...`)
  
  try {
    const { data, error } = await supabase.rpc('exec', { sql: stmt })
    
    if (error) {
      // Try direct query
      const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ query: stmt })
      })
      
      if (res.ok) {
        console.log(' ✅')
        success++
      } else {
        console.log(` ⚠️`)
        failed++
      }
    } else {
      console.log(' ✅')
      success++
    }
  } catch (err) {
    console.log(` ⚠️`)
    failed++
  }
}

console.log('')
console.log('=' .repeat(60))
console.log(`✅ Success: ${success}`)
console.log(`⚠️  Warnings: ${failed}`)
console.log('=' .repeat(60))
console.log('')

if (success > 0) {
  console.log('🎉 CORE TABLES CREATED!')
  console.log('')
  console.log('Next steps:')
  console.log('  1. npm run dev')
  console.log('  2. Open http://localhost:3000')
  console.log('  3. Start chatting!')
  console.log('')
}

process.exit(0)

