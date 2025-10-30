#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const files = [
  'src/lib/search-trends-ai.ts',
  'src/lib/scraping-agents-orchestrator.ts',
  'src/lib/rate-limiter.ts',
  'src/lib/rate-limiter-operations.ts',
  'src/lib/queueNotification.ts',
  'src/lib/provider-capture.ts',
  'src/lib/location-detector-patterns.ts',
  'src/lib/horse-context-extractor.ts',
  'src/lib/haul-support-validation.ts',
  'src/lib/haul-support-route.ts',
  'src/lib/feedback-scores.ts',
  'src/lib/export-generator-pdf.ts',
  'src/lib/export-generator-excel.ts',
  'src/lib/export-generator-data.ts',
  'src/lib/export-generator-csv.ts',
];

console.log(`Processing ${files.length} files...`);

for (const file of files) {
  try {
    let content = readFileSync(file, 'utf8');
    
    // Remove extra blank lines
    content = content.replace(/\n{3,}/g, '\n\n');
    
    // Compact simple if statements
    content = content.replace(/if \(([^)]+)\)\s*{\s*return\s+([^;]+);\s*}/g, 'if ($1) return $2');
    
    // Compact method chains
    content = content.replace(/\.\s*\n\s+/g, '. ');
    
    writeFileSync(file, content);
    console.log(`✓ ${file}`);
  } catch (e) {
    console.log(`✗ ${file} - ${e.message}`);
  }
}

console.log('Done!');


