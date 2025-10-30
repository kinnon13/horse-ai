#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Top 10 largest files to split first
const largeFiles = [
  "src/app/health/page.tsx",
  "src/app/social/page.tsx", 
  "src/app/upload/page.tsx",
  "src/lib/enhanced-reports.ts",
  "src/app/admin-secret-xyz123/page.tsx",
  "src/lib/analytics.ts",
  "src/lib/crm-integrations.ts",
  "src/app/pricing/page.tsx",
  "src/lib/export-generator.ts",
  "src/app/marketplace/page.tsx"
];

function extractTypes(content) {
  const types = [];
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('interface ') || line.includes('type ') || line.includes('enum ')) {
      let start = i;
      let end = i;
      
      // Find the end of the type definition
      while (end < lines.length - 1 && !lines[end].includes('}') && !lines[end].includes(';')) {
        end++;
      }
      
      const typeBlock = lines.slice(start, end + 1).join('\n');
      types.push({
        start,
        end: end + 1,
        content: typeBlock
      });
    }
  }
  
  return types;
}

function extractSupabaseCalls(content) {
  const calls = [];
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('supabase') || line.includes('Supabase')) {
      let start = i;
      let end = i;
      
      // Find function start
      while (start > 0 && !lines[start].includes('function') && !lines[start].includes('const') && !lines[start].includes('async')) {
        start--;
      }
      
      // Find function end
      while (end < lines.length - 1 && !lines[end].includes('}')) {
        end++;
      }
      
      const functionBlock = lines.slice(start, end + 1).join('\n');
      if (functionBlock.includes('supabase') || functionBlock.includes('Supabase')) {
        calls.push({
          start,
          end: end + 1,
          content: functionBlock
        });
      }
    }
  }
  
  return calls;
}

function extractJSX(content) {
  const jsxBlocks = [];
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('return (') || line.includes('return<')) {
      let start = i;
      let end = i;
      
      // Find the end of the JSX
      let braceCount = 0;
      while (end < lines.length - 1) {
        if (lines[end].includes('{')) braceCount++;
        if (lines[end].includes('}')) braceCount--;
        if (braceCount === 0 && lines[end].includes('}')) break;
        end++;
      }
      
      const jsxBlock = lines.slice(start, end + 1).join('\n');
      jsxBlocks.push({
        start,
        end: end + 1,
        content: jsxBlock
      });
    }
  }
  
  return jsxBlocks;
}

function splitFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, path.extname(filePath));
  const ext = path.extname(filePath);
  
  // Create folder for split files
  const folderPath = path.join(dir, baseName);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  
  // Extract types
  const types = extractTypes(content);
  const typesContent = types.map(t => t.content).join('\n\n');
  
  // Extract Supabase calls
  const supabaseCalls = extractSupabaseCalls(content);
  const repoContent = supabaseCalls.map((call, index) => 
    `export async function ${baseName}Operation${index}() {\n  // TODO: Implement actual Supabase operation\n  ${call.content}\n}`
  ).join('\n\n');
  
  // Extract JSX
  const jsxBlocks = extractJSX(content);
  const jsxContent = jsxBlocks.map(block => block.content).join('\n\n');
  
  // Create types file
  if (typesContent.trim()) {
    const typesFile = path.join(folderPath, `${baseName}.types.ts`);
    fs.writeFileSync(typesFile, `// Types for ${baseName}\n\n${typesContent}`);
    console.log(`Created types file: ${typesFile}`);
  }
  
  // Create repo file
  if (repoContent.trim()) {
    const repoFile = path.join(folderPath, `${baseName}.repo.ts`);
    const fullRepoContent = `// Repository for ${baseName}\nimport { supabase } from '@/lib/supabase';\n\n${repoContent}`;
    fs.writeFileSync(repoFile, fullRepoContent);
    console.log(`Created repo file: ${repoFile}`);
  }
  
  // Create view file (for JSX)
  if (jsxContent.trim() && ext === '.tsx') {
    const viewFile = path.join(folderPath, `${baseName}.view.tsx`);
    const viewContent = `// View component for ${baseName}\nimport React from 'react';\n\ninterface ${baseName}ViewProps {\n  // TODO: Define props\n}\n\nexport function ${baseName}View(props: ${baseName}ViewProps) {\n  ${jsxContent}\n}`;
    fs.writeFileSync(viewFile, viewContent);
    console.log(`Created view file: ${viewFile}`);
  }
  
  // Create hook file
  const hookFile = path.join(folderPath, `use${baseName.charAt(0).toUpperCase() + baseName.slice(1)}.ts`);
  const hookContent = `// Hook for ${baseName}\nimport { useState, useEffect } from 'react';\n\ninterface ${baseName}State {\n  // TODO: Define state\n}\n\ninterface ${baseName}Actions {\n  // TODO: Define actions\n}\n\nexport function use${baseName.charAt(0).toUpperCase() + baseName.slice(1)}() {\n  const [state, setState] = useState<${baseName}State>({});\n  \n  // TODO: Implement hook logic\n  \n  return {\n    ...state,\n    // ...actions\n  };\n}`;
  fs.writeFileSync(hookFile, hookContent);
  console.log(`Created hook file: ${hookFile}`);
  
  // Create orchestrator file
  const orchestratorFile = path.join(folderPath, ext === '.tsx' ? 'page.tsx' : 'index.ts');
  let orchestratorContent = '';
  
  if (ext === '.tsx') {
    orchestratorContent = `// Orchestrator for ${baseName}\nimport React from 'react';\nimport { use${baseName.charAt(0).toUpperCase() + baseName.slice(1)} } from './use${baseName.charAt(0).toUpperCase() + baseName.slice(1)}';\nimport { ${baseName}View } from './${baseName}.view';\n\nexport default function ${baseName.charAt(0).toUpperCase() + baseName.slice(1)}() {\n  const vm = use${baseName.charAt(0).toUpperCase() + baseName.slice(1)}();\n  return <${baseName}View {...vm} />;\n}`;
  } else {
    orchestratorContent = `// Orchestrator for ${baseName}\nimport { use${baseName.charAt(0).toUpperCase() + baseName.slice(1)} } from './use${baseName.charAt(0).toUpperCase() + baseName.slice(1)}';\n\nexport { use${baseName.charAt(0).toUpperCase() + baseName.slice(1)} };\nexport * from './${baseName}.types';\nexport * from './${baseName}.repo';\n`;
  }
  
  fs.writeFileSync(orchestratorFile, orchestratorContent);
  console.log(`Created orchestrator file: ${orchestratorFile}`);
  
  // Delete original file
  fs.unlinkSync(filePath);
  console.log(`Deleted original file: ${filePath}`);
}

// Process all large files
console.log('Splitting large files...');
largeFiles.forEach(splitFile);
console.log('Large files split!');
