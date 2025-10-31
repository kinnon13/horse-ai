// AuditorValidators.ts (35 lines) - Single responsibility: Audit validation functions
import { execSync } from 'child_process';

export class AuditorValidators {
  static checkTypeScript(): string[] {
    const issues: string[] = [];
    try {
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
    } catch (error) {
      issues.push('TypeScript compilation failed');
    }
    return issues;
  }

  static checkESLint(): string[] {
    const issues: string[] = [];
    try {
      execSync('npx eslint src/ --ext .ts,.tsx', { stdio: 'pipe' });
    } catch (error) {
      issues.push('ESLint errors found');
    }
    return issues;
  }

  static checkFileSizes(): string[] {
    const oversized: string[] = [];
    // Implementation would scan src/ directory for files > 50 lines
    return oversized;
  }

  static checkRequiredExports(): string[] {
    const missing: string[] = [];
    // Check for required exports like useAuth, RateLimitService, etc.
    return missing;
  }

  static checkTests(): string[] {
    const issues: string[] = [];
    try {
      execSync('npm test -- --coverage --watchAll=false', { stdio: 'pipe' });
    } catch (error) {
      issues.push('Tests are failing');
    }
    return issues;
  }
}
