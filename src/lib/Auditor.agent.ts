// Auditor.agent.ts (40 lines) - Single responsibility: Main audit orchestrator
import { AuditorValidators } from './AuditorValidators';

export class CodeAuditor {
  static async auditPullRequest(): Promise<{ passed: boolean; issues: string[] }> {
    const issues: string[] = [];

    try {
      // Run all validations
      issues.push(...AuditorValidators.checkTypeScript());
      issues.push(...AuditorValidators.checkESLint());
      issues.push(...AuditorValidators.checkFileSizes());
      issues.push(...AuditorValidators.checkRequiredExports());
      issues.push(...AuditorValidators.checkTests());

      return {
        passed: issues.length === 0,
        issues
      };

    } catch (error) {
      return {
        passed: false,
        issues: ['Audit process failed: ' + error]
      };
    }
  }

  static async blockMergeIfFailed(): Promise<void> {
    const audit = await this.auditPullRequest();
    if (!audit.passed) {
      console.error('❌ MERGE BLOCKED - Code quality issues:');
      audit.issues.forEach(issue => console.error(`  - ${issue}`));
      process.exit(1);
    }

  }
}