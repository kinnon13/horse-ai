#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Get Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ ERROR: Missing Supabase credentials in .env.local')
  console.error('Required:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

console.log('🚀 Starting database migrations...\n')
console.log(`📍 Supabase URL: ${supabaseUrl}\n`)

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Helper to execute SQL
async function executeSql(sql, description) {
  console.log(`⏳ Running: ${description}...`)
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql })
    
    if (error) {
      // Try direct execution via REST API
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({ sql_string: sql })
      })

      if (!response.ok) {
        console.error(`❌ Failed: ${description}`)
        console.error(`Error: ${error?.message || 'Unknown error'}`)
        return false
      }
    }
    
    console.log(`✅ Success: ${description}\n`)
    return true
  } catch (err) {
    console.error(`❌ Failed: ${description}`)
    console.error(`Error: ${err.message}\n`)
    return false
  }
}

// Main migration runner
async function runMigrations() {
  console.log('=' .repeat(60))
  console.log('  HORSEGPT DATABASE MIGRATIONS')
  console.log('=' .repeat(60))
  console.log('')

  let successCount = 0
  let failCount = 0

  // Step 1: Core tables
  console.log('📦 STEP 1: Core Tables\n')
  const coreTablesPath = path.join(__dirname, 'RUN_THIS_IN_SUPABASE.sql')
  if (fs.existsSync(coreTablesPath)) {
    const sql = fs.readFileSync(coreTablesPath, 'utf8')
    if (await executeSql(sql, 'Core tables (vector, UI config, feature flags, etc.)')) {
      successCount++
    } else {
      failCount++
    }
  }

  // Step 2: Migration files
  console.log('\n📦 STEP 2: Production Tables (387 tables)\n')
  
  const migrationFiles = [
    'supabase/migrations/20250128000001_pillars_1_11.sql',
    'supabase/migrations/20250128000002_pillars_12_22.sql',
    'supabase/migrations/20250128000003_pillars_23_32.sql'
  ]

  for (const file of migrationFiles) {
    const filePath = path.join(__dirname, file)
    if (fs.existsSync(filePath)) {
      const sql = fs.readFileSync(filePath, 'utf8')
      const fileName = path.basename(file)
      if (await executeSql(sql, fileName)) {
        successCount++
      } else {
        failCount++
      }
    } else {
      console.log(`⚠️  File not found: ${file}\n`)
    }
  }

  // Step 3: Indexes
  console.log('\n📦 STEP 3: Performance Indexes\n')
  
  const indexFiles = [
    'supabase/migrations/20251106003000_comprehensive_indexes.sql',
    'supabase/migrations/20251106004000_massive_indexes.sql',
    'supabase/migrations/20251106005000_final_indexes.sql',
    'supabase/migrations/20251106010000_remaining_137_indexes.sql'
  ]

  for (const file of indexFiles) {
    const filePath = path.join(__dirname, file)
    if (fs.existsSync(filePath)) {
      const sql = fs.readFileSync(filePath, 'utf8')
      const fileName = path.basename(file)
      if (await executeSql(sql, fileName)) {
        successCount++
      } else {
        failCount++
      }
    } else {
      console.log(`⚠️  File not found: ${file}\n`)
    }
  }

  // Step 4: Business verification
  console.log('\n📦 STEP 4: Business Verification\n')
  
  const bizPath = 'supabase/migrations/20251106001500_business_verification.sql'
  const bizFilePath = path.join(__dirname, bizPath)
  if (fs.existsSync(bizFilePath)) {
    const sql = fs.readFileSync(bizFilePath, 'utf8')
    if (await executeSql(sql, 'Business verification tables')) {
      successCount++
    } else {
      failCount++
    }
  }

  // Step 5: Dynamic UI system
  console.log('\n📦 STEP 5: Dynamic UI System\n')
  
  const uiPath = 'supabase/migrations/20251106_dynamic_ui_system.sql'
  const uiFilePath = path.join(__dirname, uiPath)
  if (fs.existsSync(uiFilePath)) {
    const sql = fs.readFileSync(uiFilePath, 'utf8')
    if (await executeSql(sql, 'Dynamic UI system (CMS)')) {
      successCount++
    } else {
      failCount++
    }
  }

  // Summary
  console.log('\n' + '=' .repeat(60))
  console.log('  MIGRATION SUMMARY')
  console.log('=' .repeat(60))
  console.log(`✅ Successful: ${successCount}`)
  console.log(`❌ Failed: ${failCount}`)
  console.log(`📊 Total: ${successCount + failCount}`)
  console.log('')

  if (failCount === 0) {
    console.log('🎉 ALL MIGRATIONS COMPLETED SUCCESSFULLY!')
    console.log('')
    console.log('Next steps:')
    console.log('  1. Start main app: cd horse-ai && npm run dev')
    console.log('  2. Start admin app: cd admin-app && npm run dev')
    console.log('  3. Open http://localhost:3000')
    console.log('')
  } else {
    console.log('⚠️  Some migrations failed. Check errors above.')
    console.log('You may need to run them manually in Supabase SQL Editor.')
    console.log('')
  }

  process.exit(failCount === 0 ? 0 : 1)
}

// Run migrations
runMigrations().catch(err => {
  console.error('💥 Fatal error:', err)
  process.exit(1)
})

