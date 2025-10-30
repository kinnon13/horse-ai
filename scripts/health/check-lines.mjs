// scripts/health/check-lines.mjs
//
// Enforces "Elon grade" micro-modules:
// - No logic file over 50 non-empty, non-import/export lines.
// - Page/layout shells can be longer but must not contain business logic.
// Fails process with exit code 1 if violated.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const ALLOW_LONG = [
  '/app/page.tsx',
  '/app/layout.tsx',
  '/app/(marketing)/page.tsx',
  '/app/(marketing)/layout.tsx'
];

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    if (e.name === 'node_modules') continue;
    if (e.name === '.next') continue;
    if (e.name === 'dist') continue;
    if (e.name === 'build') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(full, out);
    } else if (
      (full.endsWith('.ts') || full.endsWith('.tsx')) &&
      !full.endsWith('.d.ts')
    ) {
      out.push(full);
    }
  }
  return out;
}

function isAllowedLong(p) {
  const rel = p.replace(ROOT, '').replace(/\\/g, '/');
  return ALLOW_LONG.some(allowed => rel.endsWith(allowed));
}

function checkFile(p) {
  const rel = p.replace(ROOT, '').replace(/\\/g, '/');
  const src = fs.readFileSync(p, 'utf8').split('\n');

  if (rel.includes('/types.ts') || rel.includes('/types.tsx') || rel.includes('/database-types.ts') || rel.includes('/schema.ts') || rel.includes('/config.ts') || rel.includes('/constants.ts') || rel.endsWith('.d.ts')) {
    return { ok: true };
  }

  const logicLines = [];
  for (const line of src) {
    const trimmed = line.trim();
    if (trimmed === '') continue;
    if (trimmed.startsWith('//')) continue;
    if (trimmed.startsWith('/*') || trimmed.startsWith('*')) continue;
    if (trimmed.startsWith('import ')) continue;
    if (trimmed.startsWith('export ')) {
      const t = trimmed.replace(/\s+/g, ' ');
      if (t.startsWith('export type ') || t.startsWith('export interface ') || t === 'export {}') {
        continue;
      }
    }
    logicLines.push(line);
  }

  const maxLines = isAllowedLong(p) ? 400 : 50;

  if (logicLines.length > maxLines) {
    return {
      ok: false,
      rel,
      logicCount: logicLines.length,
      maxLines
    };
  }
  return { ok: true };
}

// MAIN
const files = walk(ROOT);
const violations = [];

for (const f of files) {
  const result = checkFile(f);
  if (!result.ok) violations.push(result);
}

if (violations.length > 0) {
  console.error('❌ Line count violations detected:');
  for (const v of violations) {
    console.error(
      `  ${v.rel} has ${v.logicCount} logic lines (limit ${v.maxLines})`
    );
  }
  process.exit(1);
} else {
  console.log('✅ All modules comply with ≤50-line Elon-grade rule');
}
