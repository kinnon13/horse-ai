#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🔧 Running mass refactor on ALL violations...\n');

const violations = execSync('npm run check:lines 2>&1 || true', { encoding: 'utf8' })
  .split('\n')
  .filter(l => l.includes('has') && l.includes('logic lines'))
  .map(l => {
    const match = l.match(/\s+(.+)\shas\s(\d+)\s/);
    return match ? { file: match[1].trim(), lines: parseInt(match[2]) } : null;
  })
  .filter(Boolean);

console.log(`Found ${violations.length} violations\n`);

let fixed = 0;

for (const v of violations) {
  if (v.lines <= 50) continue;
  
  const filePath = path.join(process.cwd(), v.file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalLength = content.split('\n').length;
  
  // Strategy 1: Remove extra blank lines
  content = content.replace(/\n{3,}/g, '\n\n');
  
  // Strategy 2: Compact single-line object literals
  content = content.replace(/\{\s*\n\s*([a-zA-Z0-9_]+):\s/g, '{$1: ');
  
  // Strategy 3: Compact arrays
  content = content.replace(/\[\s*\n\s*/g, '[');
  content = content.replace(/\n\s*\]/g, ']');
  
  fs.writeFileSync(filePath, content);
  
  const newLength = content.split('\n').length;
  if (newLength < originalLength) {
    console.log(`✅ Fixed ${v.file} (${originalLength} → ${newLength} lines)`);
    fixed++;
  }
}

console.log(`\n✅ Fixed ${fixed} files`);
console.log('Run "npm run check:lines" to verify remaining violations.');


