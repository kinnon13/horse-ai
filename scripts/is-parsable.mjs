import fs from 'fs';
import { parse } from '@babel/parser';

const file = process.argv[2];
if (!file) { console.error('usage: node scripts/is-parsable.mjs <file>'); process.exit(2); }

try {
  const code = fs.readFileSync(file, 'utf8');
  parse(code, { sourceType: 'module', errorRecovery: true, plugins: ['typescript', 'jsx', 'classProperties', 'decorators-legacy', 'importAssertions', 'topLevelAwait', 'doExpressions', 'optionalChaining', 'nullishCoalescingOperator', 'objectRestSpread'] });
  process.exit(0);
} catch (e) {
  console.error(`[UNPARSABLE] ${file}: ${e.message}`);
  process.exit(1);
}


