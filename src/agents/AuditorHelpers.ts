// AuditorHelpers.ts - Helper functions for auditor agent
import { execSync } from 'child_process'
import { writeFileSync } from 'fs'

export function runTypeScriptCheck(): boolean {
  try {
    console.log('🔍 Running TypeScript check...')
    execSync('npx tsc --noEmit --skipLibCheck', { stdio: 'pipe' })
    return true
  } catch (error) {
    return false
  }
}

export function runESLintCheck(): boolean {
  try {
    console.log('🔍 Running ESLint...')
    execSync('npx eslint src --ext .ts,.tsx', { stdio: 'pipe' })
    return true
  } catch (error) {
    return false
  }
}

export function findLargeFiles(): string[] {
  const { execSync } = require('child_process')
  const output = execSync('find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | awk "$1 > 50 {print $2}"', { encoding: 'utf8' })
  return output.trim().split('\n').filter(Boolean)
}

export function updateAuditStatus(passed: boolean) {
  const status = { 
    timestamp: new Date().toISOString(), 
    status: passed ? 'GREEN' : 'RED', 
    checks: ['typescript', 'eslint', 'file-size'], 
    message: passed ? 'All checks passed - ready to merge' : 'Issues found - block merge' 
  }
  writeFileSync('audit-status.json', JSON.stringify(status, null, 2))
}