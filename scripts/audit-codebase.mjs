#!/usr/bin/env node
// audit-codebase.mjs - BRUTAL PRODUCTION-READY AUDIT
// Run: node audit-codebase.mjs

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSection(title) {
  console.log('\n' + '='.repeat(80))
  log(title, 'bright')
  console.log('='.repeat(80))
}

const CRITICAL_ISSUES = []
const ERRORS = []
const WARNINGS = []

function addIssue(severity, category, message, file = '') {
  const issue = { severity, category, message, file }
  if (severity === 'CRITICAL') CRITICAL_ISSUES.push(issue)
  else if (severity === 'ERROR') ERRORS.push(issue)
  else WARNINGS.push(issue)
}

// ============================================
// FILE SCANNING
// ============================================

function scanDirectory(dir, extensions = []) {
  const results = []
  try {
    const items = fs.readdirSync(dir)
    for (const item of items) {
      const fullPath = path.join(dir, item)
      if (item === 'node_modules' || item === '.next' || item === '.git' || item === 'dist') continue
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        results.push(...scanDirectory(fullPath, extensions))
      } else if (stat.isFile()) {
        if (extensions.length === 0 || extensions.some(ext => item.endsWith(ext))) {
          results.push(fullPath)
        }
      }
    }
  } catch (err) {}
  return results
}

function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch {
    return ''
  }
}

// ============================================
// SECURITY AUDIT
// ============================================

function auditSecurity() {
  logSection('🔐 SECURITY AUDIT (CRITICAL)')
  
  const srcFiles = scanDirectory(path.join(process.cwd(), 'src'), ['.ts', '.tsx', '.js', '.jsx'])
  
  let issues = 0
  
  srcFiles.forEach(file => {
    const content = readFileContent(file)
    const relativePath = path.relative(process.cwd(), file)
    
    // Hardcoded secrets
    if (/api[_-]?key.*=.*['"][a-zA-Z0-9]{20,}['"]/i.test(content)) {
      addIssue('CRITICAL', 'Security', 'Hardcoded API key detected', relativePath)
      issues++
    }
    
    // SQL injection risks
    if (/\$\{.*\}.*WHERE|WHERE.*\$\{.*\}/i.test(content) && !/prepared|parameterized/i.test(content)) {
      addIssue('CRITICAL', 'Security', 'Potential SQL injection vulnerability', relativePath)
      issues++
    }
    
    // Unsafe eval
    if (/eval\(|new Function\(/i.test(content)) {
      addIssue('CRITICAL', 'Security', 'Unsafe eval() or new Function() usage', relativePath)
      issues++
    }
    
    // XSS risks
    if (/dangerouslySetInnerHTML|innerHTML\s*=/i.test(content) && !/sanitize|escape/i.test(content)) {
      addIssue('ERROR', 'Security', 'Potential XSS vulnerability (unsanitized HTML)', relativePath)
      issues++
    }
    
    // Missing auth checks in API routes
    if (relativePath.includes('/api/') && content.includes('export async function')) {
      if (!/getSession|auth|jwt|verify|check.*auth/i.test(content)) {
        addIssue('ERROR', 'Security', 'API route missing authentication check', relativePath)
        issues++
      }
    }
    
    // CORS issues
    if (/res\.setHeader.*Access-Control-Allow-Origin.*\*/i.test(content)) {
      addIssue('WARNING', 'Security', 'Overly permissive CORS policy (allows *)', relativePath)
      issues++
    }
    
    // Unvalidated user input
    if (/req\.body|req\.query|params\./i.test(content) && !/validate|schema|zod|yup/i.test(content)) {
      addIssue('WARNING', 'Security', 'User input not validated', relativePath)
      issues++
    }
  })
  
  log(issues === 0 ? '✅ No security issues found' : `❌ Found ${issues} security issues`, issues === 0 ? 'green' : 'red')
  
  return { issues }
}

// ============================================
// PERFORMANCE AUDIT
// ============================================

function auditPerformance() {
  logSection('⚡ PERFORMANCE AUDIT (1M USERS)')
  
  const srcFiles = scanDirectory(path.join(process.cwd(), 'src'), ['.ts', '.tsx', '.js', '.jsx'])
  
  let issues = 0
  
  srcFiles.forEach(file => {
    const content = readFileContent(file)
    const relativePath = path.relative(process.cwd(), file)
    
    // N+1 queries
    if (/for.*await|\.forEach.*await|\.map.*await/i.test(content) && /supabase|prisma|fetch/i.test(content)) {
      addIssue('CRITICAL', 'Performance', 'Potential N+1 query problem (loops with DB calls)', relativePath)
      issues++
    }
    
    // Missing pagination
    if (/\.select\(\)|\.findMany\(\)|\.from\(/i.test(content) && !/limit|take|paginate/i.test(content)) {
      addIssue('ERROR', 'Performance', 'Database query without pagination (will crash with 1M users)', relativePath)
      issues++
    }
    
    // No caching
    if (/\/api\//i.test(relativePath) && /supabase|prisma|database/i.test(content) && !/cache|redis|memo/i.test(content)) {
      addIssue('WARNING', 'Performance', 'API route with no caching strategy', relativePath)
      issues++
    }
    
    // Synchronous blocking operations
    if (/readFileSync|writeFileSync|execSync/i.test(content)) {
      addIssue('ERROR', 'Performance', 'Synchronous blocking operation (will block event loop)', relativePath)
      issues++
    }
    
    // Memory leaks
    if (/setInterval|setTimeout/i.test(content) && !/clearInterval|clearTimeout/i.test(content)) {
      addIssue('WARNING', 'Performance', 'Timer without cleanup (potential memory leak)', relativePath)
      issues++
    }
    
    // Large bundle imports
    if (/import.*from ['"]lodash['"]|import.*from ['"]moment['"]/i.test(content)) {
      addIssue('WARNING', 'Performance', 'Importing entire heavy library (use tree-shakeable imports)', relativePath)
      issues++
    }
  })
  
  log(issues === 0 ? '✅ No performance issues found' : `❌ Found ${issues} performance issues`, issues === 0 ? 'green' : 'red')
  
  return { issues }
}

// ============================================
// DATABASE AUDIT
// ============================================

function auditDatabase() {
  logSection('📊 DATABASE AUDIT (INDEXES, FOREIGN KEYS, CONSTRAINTS)')
  
  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations')
  
  if (!fs.existsSync(migrationsDir)) {
    addIssue('CRITICAL', 'Database', 'No migrations directory found', '')
    return { tables: 0, indexes: 0, foreignKeys: 0 }
  }
  
  const migrationFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'))
  
  let totalTables = 0
  let totalIndexes = 0
  let totalForeignKeys = 0
  let tablesWithoutIndexes = []
  let tablesWithoutPrimaryKey = []
  
  migrationFiles.forEach(file => {
    const content = readFileContent(path.join(migrationsDir, file))
    
    // Count tables
    const tableMatches = content.match(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?([a-z_]+)/gi) || []
    const tables = tableMatches.map(m => m.match(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?([a-z_]+)/i)[1])
    totalTables += tables.length
    
    // Count indexes
    const indexes = (content.match(/CREATE INDEX/gi) || []).length
    totalIndexes += indexes
    
    // Count foreign keys
    const foreignKeys = (content.match(/REFERENCES|FOREIGN KEY/gi) || []).length
    totalForeignKeys += foreignKeys
    
    // Check each table
    tables.forEach(tableName => {
      // Check for primary key
      const tableDefMatch = content.match(new RegExp(`CREATE TABLE[^;]+${tableName}[^;]+;`, 'is'))
      if (tableDefMatch) {
        const tableDef = tableDefMatch[0]
        if (!/PRIMARY KEY|id UUID.*DEFAULT gen_random_uuid\(\)/i.test(tableDef)) {
          tablesWithoutPrimaryKey.push(tableName)
          addIssue('ERROR', 'Database', `Table ${tableName} has no primary key`, file)
        }
      }
      
      // Check for indexes on foreign keys
      const tableContent = content.substring(content.indexOf(tableName))
      const hasForeignKey = /REFERENCES/i.test(tableContent)
      const hasIndex = new RegExp(`CREATE INDEX.*${tableName}`, 'i').test(content)
      
      if (hasForeignKey && !hasIndex) {
        tablesWithoutIndexes.push(tableName)
        addIssue('WARNING', 'Database', `Table ${tableName} has foreign keys but no indexes (slow joins)`, file)
      }
    })
  })
  
  log(`Tables: ${totalTables}`, 'cyan')
  log(`Indexes: ${totalIndexes}`, 'cyan')
  log(`Foreign Keys: ${totalForeignKeys}`, 'cyan')
  
  // Calculate expected indexes (at least 1 per foreign key + common query fields)
  const expectedIndexes = Math.max(totalForeignKeys, totalTables * 2)
  if (totalIndexes < expectedIndexes) {
    addIssue('CRITICAL', 'Database', `Insufficient indexes: ${totalIndexes} found, need ~${expectedIndexes} for 1M users`, '')
    log(`❌ CRITICAL: Need ~${expectedIndexes - totalIndexes} more indexes for scale`, 'red')
  } else {
    log(`✅ Adequate indexes for scale`, 'green')
  }
  
  if (tablesWithoutPrimaryKey.length > 0) {
    log(`❌ ${tablesWithoutPrimaryKey.length} tables without primary keys`, 'red')
  }
  
  return { tables: totalTables, indexes: totalIndexes, foreignKeys: totalForeignKeys }
}

// ============================================
// ERROR HANDLING AUDIT
// ============================================

function auditErrorHandling() {
  logSection('🚨 ERROR HANDLING AUDIT')
  
  const srcFiles = scanDirectory(path.join(process.cwd(), 'src'), ['.ts', '.tsx', '.js', '.jsx'])
  
  let issues = 0
  
  srcFiles.forEach(file => {
    const content = readFileContent(file)
    const relativePath = path.relative(process.cwd(), file)
    
    // Async functions without try-catch
    const asyncFunctions = content.match(/async function|async \(/g) || []
    const tryCatches = content.match(/try\s*\{/g) || []
    
    if (asyncFunctions.length > 0 && tryCatches.length === 0) {
      addIssue('ERROR', 'Error Handling', 'Async functions with no error handling', relativePath)
      issues++
    }
    
    // Empty catch blocks
    if (/catch\s*\([^)]*\)\s*\{\s*\}/g.test(content)) {
      addIssue('ERROR', 'Error Handling', 'Empty catch block (swallows errors silently)', relativePath)
      issues++
    }
    
    // API routes without error responses
    if (relativePath.includes('/api/') && /export async function/i.test(content)) {
      if (!/res\.status\(500\)|NextResponse\.json.*error/i.test(content)) {
        addIssue('WARNING', 'Error Handling', 'API route missing error responses', relativePath)
        issues++
      }
    }
    
    // Promise without catch
    if (/\.then\(/g.test(content) && !/\.catch\(/g.test(content)) {
      addIssue('WARNING', 'Error Handling', 'Promise without .catch() handler', relativePath)
      issues++
    }
  })
  
  log(issues === 0 ? '✅ Error handling looks good' : `❌ Found ${issues} error handling issues`, issues === 0 ? 'green' : 'red')
  
  return { issues }
}

// ============================================
// TYPE SAFETY AUDIT
// ============================================

function auditTypeSafety() {
  logSection('🔷 TYPE SAFETY AUDIT')
  
  const tsFiles = scanDirectory(path.join(process.cwd(), 'src'), ['.ts', '.tsx'])
  
  let issues = 0
  
  tsFiles.forEach(file => {
    const content = readFileContent(file)
    const relativePath = path.relative(process.cwd(), file)
    
    // 'any' types
    const anyCount = (content.match(/:\s*any\b/g) || []).length
    if (anyCount > 2) {
      addIssue('WARNING', 'Type Safety', `${anyCount} uses of 'any' type (weak type safety)`, relativePath)
      issues++
    }
    
    // @ts-ignore or @ts-nocheck
    if (/@ts-ignore|@ts-nocheck/g.test(content)) {
      addIssue('WARNING', 'Type Safety', 'Using @ts-ignore (suppressing type errors)', relativePath)
      issues++
    }
    
    // Non-null assertions
    const nonNullCount = (content.match(/!\./g) || []).length
    if (nonNullCount > 5) {
      addIssue('WARNING', 'Type Safety', `${nonNullCount} non-null assertions (potential runtime errors)`, relativePath)
      issues++
    }
  })
  
  log(issues === 0 ? '✅ Type safety looks good' : `⚠️  Found ${issues} type safety issues`, issues === 0 ? 'green' : 'yellow')
  
  return { issues }
}

// ============================================
// ENVIRONMENT & CONFIG AUDIT
// ============================================

function auditEnvironment() {
  logSection('🔧 ENVIRONMENT & CONFIG AUDIT')
  
  let issues = 0
  
  // Check for .env files
  const envLocal = fs.existsSync(path.join(process.cwd(), '.env.local'))
  const envExample = fs.existsSync(path.join(process.cwd(), '.env.local.example'))
  
  if (!envLocal) {
    addIssue('CRITICAL', 'Config', 'Missing .env.local file', '')
    log('❌ Missing .env.local', 'red')
    issues++
  } else {
    log('✅ .env.local exists', 'green')
    
    // Check required vars
    const envContent = readFileContent(path.join(process.cwd(), '.env.local'))
    
    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY'
    ]
    
    requiredVars.forEach(varName => {
      if (!new RegExp(varName).test(envContent)) {
        addIssue('CRITICAL', 'Config', `Missing required env var: ${varName}`, '.env.local')
        log(`❌ Missing: ${varName}`, 'red')
        issues++
      }
    })
    
    // Check for placeholder values
    if (/your-|placeholder|example|xxx/i.test(envContent)) {
      addIssue('CRITICAL', 'Config', 'Environment variables have placeholder values', '.env.local')
      log('❌ Env vars have placeholder values', 'red')
      issues++
    }
  }
  
  if (!envExample) {
    addIssue('WARNING', 'Config', 'Missing .env.local.example file', '')
    log('⚠️  Missing .env.local.example', 'yellow')
    issues++
  }
  
  // Check .gitignore
  const gitignore = readFileContent(path.join(process.cwd(), '.gitignore'))
  if (!/\.env\.local/i.test(gitignore)) {
    addIssue('CRITICAL', 'Config', '.env.local not in .gitignore (will leak secrets!)', '.gitignore')
    log('❌ CRITICAL: .env.local not in .gitignore', 'red')
    issues++
  }
  
  return { issues }
}

// ============================================
// PSYCHOLOGY ENGINE INTEGRATION AUDIT
// ============================================

function auditPsychologyIntegration() {
  logSection('🧠 PSYCHOLOGY ENGINE INTEGRATION AUDIT')
  
  let issues = 0
  
  const psychologyDirs = [
    'src/lib/psychology',
    'src/lib/user-context',
    'src/lib/verification-psychology'
  ]
  
  let modulesExist = false
  let moduleCount = 0
  
  psychologyDirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir)
    if (fs.existsSync(fullPath)) {
      const files = scanDirectory(fullPath, ['.ts', '.js'])
      moduleCount += files.length
      modulesExist = true
    }
  })
  
  if (!modulesExist) {
    addIssue('CRITICAL', 'Integration', 'Psychology engine modules not found', '')
    log('❌ Psychology engine missing', 'red')
    return { connected: false, issues: 1 }
  }
  
  log(`✅ Found ${moduleCount} psychology modules`, 'green')
  
  // Check if connected to chat (through smartRouter)
  const chatApiFile = path.join(process.cwd(), 'src', 'app', 'api', 'chat', 'route.ts')
  const smartRouterFile = path.join(process.cwd(), 'src', 'lib', 'smart-router', 'smartRoute.ts')
  
  if (!fs.existsSync(chatApiFile)) {
    addIssue('CRITICAL', 'Integration', 'Chat API route not found', 'src/app/api/chat/route.ts')
    log('❌ Chat API missing', 'red')
    return { connected: false, issues: 1 }
  }
  
  const chatApiContent = readFileContent(chatApiFile)
  const smartRouterContent = readFileContent(smartRouterFile)
  
  // Check if chat API calls smartRouter AND smartRouter imports psychology modules
  const callsSmartRouter = /smartRoute/i.test(chatApiContent)
  const importsPsychology = /user-context|verification-psychology|buildUserContext|detectEmotion/i.test(smartRouterContent)
  const isConnected = callsSmartRouter && importsPsychology
  
  if (!isConnected) {
    addIssue('CRITICAL', 'Integration', '387-table psychology engine NOT CONNECTED to chat', chatApiFile)
    log('❌ CRITICAL: Psychology engine not wired into chat!', 'red')
    log('   Your 387 tables are useless if the AI can\'t access them', 'yellow')
    issues++
  } else {
    log('✅ Psychology engine connected to chat (via smartRouter)', 'green')
    log('   Chat API → smartRouter → buildUserContext() → 387 tables', 'cyan')
  }
  
  return { connected: isConnected, moduleCount, issues }
}

// ============================================
// API ROUTES COMPLETENESS AUDIT
// ============================================

function auditAPICompleteness() {
  logSection('🔌 API ROUTES COMPLETENESS AUDIT')
  
  const requiredAPIs = {
    '/api/chat': 'Chat interface',
    '/api/verify': 'User verification',
    '/api/business/upload': 'CRM upload',
    '/api/business/rankings': 'Business rankings',
    '/api/user/context': 'User psychology context'
  }
  
  let issues = 0
  
  Object.entries(requiredAPIs).forEach(([apiPath, description]) => {
    const fullPath = path.join(process.cwd(), 'src', 'app', apiPath, 'route.ts')
    const altPath = path.join(process.cwd(), 'src', 'app', apiPath, 'route.js')
    
    if (!fs.existsSync(fullPath) && !fs.existsSync(altPath)) {
      addIssue('ERROR', 'Missing API', `Required API missing: ${description}`, apiPath)
      log(`❌ Missing: ${apiPath}`, 'red')
      issues++
    } else {
      log(`✅ Exists: ${apiPath}`, 'green')
    }
  })
  
  return { issues }
}

// ============================================
// RACE CONDITION & CONCURRENCY AUDIT
// ============================================

function auditConcurrency() {
  logSection('⚠️  RACE CONDITION & CONCURRENCY AUDIT')
  
  const srcFiles = scanDirectory(path.join(process.cwd(), 'src'), ['.ts', '.tsx', '.js', '.jsx'])
  
  let issues = 0
  
  srcFiles.forEach(file => {
    const content = readFileContent(file)
    const relativePath = path.relative(process.cwd(), file)
    
    // Race conditions in state updates
    if (/useState|useReducer/i.test(content)) {
      // Check for multiple setState calls without dependency
      const setStateMatches = content.match(/set[A-Z]\w+\(/g) || []
      // React components normally have 3-10 setState calls - only flag excessive ones
      if (setStateMatches.length > 15) {
        addIssue('WARNING', 'Concurrency', 'Excessive state updates (potential race condition)', relativePath)
        issues++
      }
    }
    
    // Database race conditions
    if (/UPDATE.*SET|INSERT INTO/i.test(content) && !/transaction|lock|atomic/i.test(content)) {
      addIssue('WARNING', 'Concurrency', 'Database update without transaction (race condition risk)', relativePath)
      issues++
    }
    
    // Shared mutable state
    if (/let \w+ = \[|\{/g.test(content) && /export/g.test(content)) {
      addIssue('WARNING', 'Concurrency', 'Exported mutable state (unsafe for concurrent access)', relativePath)
      issues++
    }
  })
  
  log(issues === 0 ? '✅ No concurrency issues found' : `⚠️  Found ${issues} potential concurrency issues`, issues === 0 ? 'green' : 'yellow')
  
  return { issues }
}

// ============================================
// MAIN AUDIT
// ============================================

async function runAudit() {
  log('\n🔥 BRUTAL PRODUCTION-READY AUDIT FOR 1M USERS 🔥', 'bright')
  log('Checking EVERYTHING that could break at scale...\n', 'red')
  
  const results = {
    security: auditSecurity(),
    performance: auditPerformance(),
    database: auditDatabase(),
    errorHandling: auditErrorHandling(),
    typeSafety: auditTypeSafety(),
    environment: auditEnvironment(),
    psychology: auditPsychologyIntegration(),
    apiCompleteness: auditAPICompleteness(),
    concurrency: auditConcurrency()
  }
  
  // FINAL VERDICT
  logSection('⚖️  FINAL VERDICT')
  
  const criticalCount = CRITICAL_ISSUES.length
  const errorCount = ERRORS.length
  const warningCount = WARNINGS.length
  
  log(`\n🔴 CRITICAL ISSUES: ${criticalCount}`, criticalCount === 0 ? 'green' : 'red')
  log(`🟠 ERRORS: ${errorCount}`, errorCount === 0 ? 'green' : 'yellow')
  log(`🟡 WARNINGS: ${warningCount}`, warningCount === 0 ? 'green' : 'yellow')
  
  // Show critical issues
  if (criticalCount > 0) {
    logSection('🚨 CRITICAL ISSUES (FIX IMMEDIATELY)')
    CRITICAL_ISSUES.forEach(issue => {
      log(`❌ [${issue.category}] ${issue.message}`, 'red')
      if (issue.file) log(`   File: ${issue.file}`, 'reset')
    })
  }
  
  // Show errors
  if (errorCount > 0) {
    logSection('⚠️  ERRORS (FIX BEFORE LAUNCH)')
    ERRORS.slice(0, 20).forEach(issue => {
      log(`⚠️  [${issue.category}] ${issue.message}`, 'yellow')
      if (issue.file) log(`   File: ${issue.file}`, 'reset')
    })
    if (errorCount > 20) {
      log(`\n... and ${errorCount - 20} more errors`, 'yellow')
    }
  }
  
  // Production readiness score
  logSection('📊 PRODUCTION READINESS SCORE')
  
  const totalIssues = criticalCount * 10 + errorCount * 3 + warningCount
  const maxScore = 100
  const score = Math.max(0, maxScore - totalIssues)
  
  let rating = ''
  let color = 'red'
  if (score >= 90) { rating = '🟢 PRODUCTION READY'; color = 'green' }
  else if (score >= 70) { rating = '🟡 NEEDS WORK'; color = 'yellow' }
  else if (score >= 50) { rating = '🟠 NOT READY'; color = 'yellow' }
  else { rating = '🔴 CRITICAL ISSUES'; color = 'red' }
  
  log(`\nScore: ${score}/100`, color)
  log(rating, color)
  
  if (criticalCount > 0) {
    log('\n❌ CANNOT LAUNCH: Fix all critical issues first', 'red')
  } else if (errorCount > 10) {
    log('\n⚠️  HIGH RISK: Many errors need fixing', 'yellow')
  } else if (score >= 90) {
    log('\n✅ READY TO HANDLE 1M USERS!', 'green')
  }
  
  // Database-specific verdict
  const indexRatio = results.database.indexes / results.database.tables
  if (indexRatio < 1.5) {
    log('\n🐌 DATABASE WILL BE SLOW: Need more indexes', 'red')
  }
  
  // Psychology integration verdict
  if (!results.psychology.connected) {
    log('\n💀 YOUR 387 TABLES ARE USELESS WITHOUT INTEGRATION', 'red')
  }
  
  log('\n✅ Audit complete!\n', 'green')
}

runAudit().catch(console.error)

