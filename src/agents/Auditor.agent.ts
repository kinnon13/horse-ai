import { runTypeScriptCheck, runESLintCheck, findLargeFiles, updateAuditStatus } from './AuditorHelpers'

export class AuditorAgent {
  static async runFullAudit(): Promise<{ passed: boolean; errors: string[] }> {
    const errors: string[] = []
    
    if (!runTypeScriptCheck()) {
      errors.push('TypeScript compilation failed')
    }
    
    if (!runESLintCheck()) {
      errors.push('ESLint found issues')
    }
    
    try {
      console.log('🔍 Checking file sizes...')
      const largeFiles = findLargeFiles()
      if (largeFiles.length > 0) {
        errors.push(`Files exceed 50 lines: ${largeFiles.join(', ')}`)
      }
    } catch (error) {
      errors.push('File size check failed')
    }
    
    updateAuditStatus(errors.length === 0)
    return { passed: errors.length === 0, errors }
  }
}

export async function runAudit() {
  const result = await AuditorAgent.runFullAudit()
  console.log(result.passed ? '✅ AUDIT PASSED' : '❌ AUDIT FAILED')
  if (result.errors.length > 0) {
    console.log('Errors:', result.errors)
  }
  return result
}
