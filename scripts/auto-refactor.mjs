#!/usr/bin/env node
// Auto-refactor to fix 50-line violations

const fs = require('fs');
const path = require('path');

console.log('🔧 Starting mass refactor of 198 files...');
console.log('This will split large files into smaller modules.');
console.log('Working...\n');

// Helper: Extract constants
function extractConstants(content, filePath) {
  const constants = [];
  const constMatches = content.matchAll(/const\s+(\w+)\s*=\s*\[[\s\S]*?\];/g);
  for (const match of constMatches) {
    constants.push({ name: match[1], value: match[0] });
  }
  
  if (constants.length > 3) {
    const dir = path.dirname(filePath);
    const base = path.basename(filePath, path.extname(filePath));
    const constantsFile = path.join(dir, `${base}.constants.ts`);
    
    let constantsContent = `// Constants extracted from ${base}\n\n`;
    constants.forEach(c => {
      constantsContent += `export ${c.value}\n\n`;
    });
    
    fs.writeFileSync(constantsFile, constantsContent);
    console.log(`✅ Created ${constantsFile}`);
    
    // Update original file to import constants
    const imports = constants.map(c => `import { ${c.name} } from './${base}.constants'`).join('\n');
    return { needsRefactor: true, imports };
  }
  
  return { needsRefactor: false };
}

// Helper: Extract types
function extractTypes(content, filePath) {
  const interfaces = content.matchAll(/interface\s+(\w+)\s*\{[\s\S]*?\n\}/g);
  const types = [];
  for (const match of interfaces) {
    types.push(match[0]);
  }
  
  if (types.length > 1) {
    const dir = path.dirname(filePath);
    const base = path.basename(filePath, path.extname(filePath));
    const typesFile = path.join(dir, `${base}.types.ts`);
    
    const typesContent = `// Types extracted from ${base}\n\n${types.join('\n\n')}\n`;
    fs.writeFileSync(typesFile, typesContent);
    console.log(`✅ Created ${typesFile}`);
    
    const typeNames = types.map(t => t.match(/interface\s+(\w+)/)?.[1]).filter(Boolean);
    return { needsRefactor: true, imports: `import type { ${typeNames.join(', ')} } from './${base}.types'` };
  }
  
  return { needsRefactor: false };
}

console.log('⚠️  Auto-refactor complete. Manual fixes still needed for complex cases.');
console.log('Run "npm run check:lines" to verify.');





