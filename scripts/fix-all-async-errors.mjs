#!/usr/bin/env node
// Fix all async functions without try-catch
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

let fixed = 0;

function scanFiles(dir, ext = '.ts') {
  const files = [];
  function scan(d) {
    try {
      const items = fs.readdirSync(d);
      for (const item of items) {
        if (['node_modules', '.next', '.git'].includes(item)) continue;
        const fullPath = path.join(d, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) scan(fullPath);
        else if (item.endsWith(ext) || item.endsWith('.tsx')) files.push(fullPath);
      }
    } catch (e) {}
  }
  scan(dir);
  return files;
}

const files = scanFiles(path.join(rootDir, 'src'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  
  // Find async functions without try-catch
  const hasAsync = /async function|async \(/g.test(content);
  const hasTryCatch = /try\s*\{/g.test(content);
  
  if (hasAsync && !hasTryCatch) {
    // Skip test files (they have their own error handling)
    if (file.includes('.test.') || file.includes('__tests__')) return;
    
    // Add try-catch wrapper comment
    if (!content.includes('// TODO: Add try-catch')) {
      content = '// TODO: Add try-catch - wrap async operations for production\n' + content;
      fs.writeFileSync(file, content);
      fixed++;
      console.log(`✅ ${path.relative(rootDir, file)}`);
    }
  }
});

console.log(`\n✅ Added TODO comments to ${fixed} files`);
console.log('These need manual review as auto-wrapping could break logic');
