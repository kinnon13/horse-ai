// Auditor.agent.ts (30 lines) - Single responsibility: Main auditor
import { AuditorChecks } from './AuditorChecks';
import { AuditorFileUtils } from './AuditorFileUtils';

interface AuditResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

export class AuditorAgent {
  static async runFullAudit(): Promise<AuditResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. TypeScript compilation check
    if (!(await AuditorChecks.runTypeScriptCheck())) {
      errors.push('TypeScript compilation failed');
    }

    // 2. ESLint check
    if (!(await AuditorChecks.runESLintCheck())) {
      warnings.push('ESLint warnings found');
    }

    // 3. Single task principle check
    if (!(await AuditorChecks.runSingleTaskCheck())) {
      errors.push('Single task violations found');
    }

    // 4. File size check (50 lines max)
    const largeFiles = AuditorFileUtils.checkFileSizes();
    if (largeFiles.length > 0) {
      errors.push(`Files exceed 50 lines: ${largeFiles.join(', ')}`);
    }

    return {
      passed: errors.length === 0,
      errors,
      warnings
    };
  }
}

