#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const VIOLATIONS_FILE = '/tmp/violations.txt';

// Read all violations
const violations = fs.readFileSync(VIOLATIONS_FILE, 'utf-8')
  .split('\n')
  .filter(l => l.includes('has'))
  .map(l => {
    const match = l.match(/^\s+(.+)\shas\s(\d+)\s/);
    return match ? { file: match[1], lines: parseInt(match[2]) } : null;
  })
  .filter(Boolean)
  .sort((a, b) => b.lines - a.lines);

console.log(`Found ${violations.length} violations`);
console.log('Starting automatic refactoring...\n');

let fixed = 0;

for (const violation of violations) {
  if (violation.lines <= 50) continue;
  
  const filePath = path.join(process.cwd(), violation.file);
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalLines = content.split('\n').length;
  
  // Strategy: Extract interfaces to separate file
  const interfaceMatches = content.matchAll(/interface\s+(\w+)\s*\{[\s\S]*?\n\}/g);
  const interfaces = [];
  for (const match of interfaceMatches) {
    interfaces.push({ name: match[1], content: match[0] });
  }
  
  if (interfaces.length > 0) {
    const dir = path.dirname(filePath);
    const baseName = path.basename(filePath, path.extname(filePath));
    const typesFile = path.join(dir, `${baseName}.types.ts`);
    
    // Create types file
    const typesContent = interfaces.map(i => i.content).join('\n\n');
    fs.writeFileSync(typesFile, typesContent);
    
    // Remove interfaces from original
    interfaces.forEach(i => {
      content = content.replace(i.content, '');
    });
    
    // Add import
    const typeNames = interfaces.map(i => i.name).join(', ');
    content = `import type { ${typeNames} } from './${baseName}.types'\n${content}`;
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${violation.file} - extracted ${interfaces.length} interfaces`);
    fixed++;
  }
}

console.log(`\n✅ Fixed ${fixed} files`);
console.log('Run "npm run check:lines" to verify.');




