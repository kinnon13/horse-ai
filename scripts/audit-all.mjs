import { execSync } from 'node:child_process';

console.log('🔍 Running line count audit...\n');
try {
  execSync('node scripts/count-logic-lines.mjs src', { stdio: 'inherit' });
  console.log('\n✅ Line count audit passed\n');
} catch (e) {
  console.log('\n❌ Line count audit failed\n');
}

console.log('🔍 Running single-task audit...\n');
try {
  execSync('node scripts/audit-single-task.mjs src', { stdio: 'inherit' });
  console.log('\n✅ Single-task audit passed\n');
} catch (e) {
  console.log('\n❌ Single-task audit failed\n');
  process.exit(1);
}

console.log('✅ All audits passed!');





