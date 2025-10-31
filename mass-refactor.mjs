#!/usr/bin/env node
// Auto-fix violations by extracting types, constants, and helpers

const fs = require('fs');
const path = require('path');

// Find all .ts and .tsx files
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory() && !file.includes('node_modules')) {
      findFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

console.log('Running mass refactor...');

// This will be a long process - let me tackle files manually in batches
const files = findFiles('./src');
console.log(`Found ${files.length} files to potentially refactor`);

// Manual batch approach - let me fix files directly




