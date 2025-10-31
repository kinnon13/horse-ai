// AuditorChecks.ts (30 lines) - Single responsibility: Audit checks
import { execSync } from 'child_process';

export class AuditorChecks {
  static async runTypeScriptCheck(): Promise<boolean> {
    try {
      console.log('🔍 Running TypeScript check...');
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
      return true;
    } catch (error) {
      return false;
    }
  }

  static async runESLintCheck(): Promise<boolean> {
    try {
      console.log('🔍 Running ESLint...');
      execSync('npx eslint src/ --ext .ts,.tsx', { stdio: 'pipe' });
      return true;
    } catch (error) {
      return false;
    }
  }

  static async runSingleTaskCheck(): Promise<boolean> {
    try {
      console.log('🔍 Running single task audit...');
      const result = execSync('node scripts/audit-single-task.mjs src', { encoding: 'utf8' });
      const audit = JSON.parse(result);
      return audit.offenders.length === 0;
    } catch (error) {
      return false;
    }
  }
}
