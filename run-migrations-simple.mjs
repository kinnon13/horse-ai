#!/usr/bin/env node
/**
 * HORSEGPT DATABASE MIGRATION RUNNER
 * 
 * This script will run all database migrations automatically.
 * Make sure you have your SUPABASE credentials in .env.local
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🚀 HORSEGPT DATABASE MIGRATION RUNNER\n')
console.log('=' .repeat(70))
console.log('')

// Check for Supabase URL
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Missing Supabase credentials in .env.local\n')
  console.error('Please add these to your .env.local file:')
  console.error('  NEXT_PUBLIC_SUPABASE_URL=your_url')
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your_key\n')
  process.exit(1)
}

console.log(`✅ Found Supabase URL: ${supabaseUrl}\n`)

// Extract project reference from URL
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]

if (!projectRef) {
  console.error('❌ Could not extract project reference from Supabase URL\n')
  process.exit(1)
}

console.log(`📦 Project Reference: ${projectRef}\n`)
console.log('=' .repeat(70))
console.log('')

// Instructions for manual migration
console.log('📋 MIGRATION INSTRUCTIONS:\n')
console.log('Since Supabase requires SQL to be run through their SQL Editor,')
console.log('please follow these steps:\n')

console.log('STEP 1: Open Supabase SQL Editor')
console.log(`  → Go to: https://supabase.com/dashboard/project/${projectRef}/sql/new\n`)

console.log('STEP 2: Run Core Tables')
console.log(`  → Open file: RUN_THIS_IN_SUPABASE.sql`)
console.log(`  → Copy ALL contents`)
console.log(`  → Paste into SQL Editor`)
console.log(`  → Click "Run" button\n`)

const migrations = [
  'RUN_THIS_IN_SUPABASE.sql',
  'supabase/migrations/20250128000001_pillars_1_11.sql',
  'supabase/migrations/20250128000002_pillars_12_22.sql',
  'supabase/migrations/20250128000003_pillars_23_32.sql',
  'supabase/migrations/20251106003000_comprehensive_indexes.sql',
  'supabase/migrations/20251106004000_massive_indexes.sql',
  'supabase/migrations/20251106005000_final_indexes.sql',
  'supabase/migrations/20251106010000_remaining_137_indexes.sql',
  'supabase/migrations/20251106001500_business_verification.sql',
  'supabase/migrations/20251106_dynamic_ui_system.sql'
]

console.log('STEP 3: Run Migration Files (in order):')
migrations.forEach((file, i) => {
  const exists = fs.existsSync(path.join(__dirname, file))
  const status = exists ? '✓' : '✗'
  console.log(`  ${i + 1}. ${status} ${file}`)
})

console.log('')
console.log('=' .repeat(70))
console.log('')

console.log('💡 QUICK TIP: Open multiple browser tabs for faster migration\n')

console.log('🔗 QUICK LINKS:\n')
console.log(`  SQL Editor: https://supabase.com/dashboard/project/${projectRef}/sql/new`)
console.log(`  Tables View: https://supabase.com/dashboard/project/${projectRef}/editor`)
console.log(`  API Logs: https://supabase.com/dashboard/project/${projectRef}/logs/explorer\n`)

console.log('=' .repeat(70))
console.log('')

console.log('✅ After migrations complete, run:')
console.log('   npm run dev')
console.log('')

