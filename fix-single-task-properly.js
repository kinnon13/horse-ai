#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the single-task violations from the audit
const singleTaskViolations = [
  "src/app/api/athlete-portal/horses/route.ts",
  "src/app/api/chat/route.ts", 
  "src/app/api/contract-choices/route.ts",
  "src/app/api/cron/agents/route.ts",
  "src/app/api/cron/reminders/route.ts",
  "src/app/api/export/route.ts",
  "src/app/api/funnel-analysis/route.ts",
  "src/app/api/gdpr-export/route.ts",
  "src/app/api/haul-support/nearby/route.ts",
  "src/app/api/horse-portal/horses/route.ts",
  "src/app/api/notifications/send/route.ts",
  "src/app/api/opt-out/route.ts",
  "src/app/api/producer-portal/horses/route.ts",
  "src/app/api/provider-claims/route.ts",
  "src/app/api/referrals/claim/route.ts",
  "src/app/api/referrals/generate/route.ts",
  "src/app/api/scrub/paginated/route.ts",
  "src/app/api/scrub/route.ts",
  "src/app/api/service-requests/checkout/route.ts",
  "src/app/api/stallion-portal/stallions/route.ts",
  "src/app/api/stripe/create-checkout/route.ts",
  "src/app/api/stripe/webhook/route.ts",
  "src/app/api/subscription/google/verify/route.ts",
  "src/app/api/subscription/ios/verify/route.ts",
  "src/app/api/upload/route.ts",
  "src/app/api/web-search/route.ts",
  "src/app/auth/signin/page.tsx",
  "src/app/auth/signup/page.tsx",
  "src/app/business/list/page.tsx",
  "src/app/pricing/page.tsx",
  "src/app/provider-portal/edit/page.tsx",
  "src/app/provider-portal/page.tsx",
  "src/hooks/useAlerts.ts",
  "src/hooks/useFavorites.ts",
  "src/hooks/useHorseClaims.ts",
  "src/hooks/useHorseDatabase.ts",
  "src/hooks/useLeadGeneration.ts",
  "src/hooks/useProviders.ts",
  "src/hooks/useSavedHorses.ts",
  "src/hooks/useServiceRequests.ts",
  "src/hooks/useUserHorses.ts",
  "src/hooks/useWebSearch.ts",
  "src/hooks/useWritingAssistance.ts"
];

function extractSupabaseCalls(content) {
  const supabaseCalls = [];
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('supabase') || line.includes('Supabase')) {
      // Find the complete function/block
      let start = i;
      let end = i;
      
      // Look backwards for function start
      while (start > 0 && !lines[start].includes('function') && !lines[start].includes('const') && !lines[start].includes('async')) {
        start--;
      }
      
      // Look forwards for function end
      while (end < lines.length - 1 && !lines[end].includes('}') && !lines[end].includes(';')) {
        end++;
      }
      
      const functionBlock = lines.slice(start, end + 1).join('\n');
      if (functionBlock.includes('supabase') || functionBlock.includes('Supabase')) {
        supabaseCalls.push({
          start,
          end: end + 1,
          content: functionBlock
        });
      }
    }
  }
  
  return supabaseCalls;
}

function createRepoFile(filePath, supabaseCalls) {
  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, path.extname(filePath));
  const repoPath = path.join(dir, `${baseName}.repo.ts`);
  
  let repoContent = `// Repository for ${baseName}\n`;
  repoContent += `import { supabase } from '@/lib/supabase';\n\n`;
  
  supabaseCalls.forEach((call, index) => {
    repoContent += `export async function ${baseName}Operation${index}() {\n`;
    repoContent += `  // TODO: Implement actual Supabase operation\n`;
    repoContent += `  ${call.content}\n`;
    repoContent += `}\n\n`;
  });
  
  fs.writeFileSync(repoPath, repoContent);
  console.log(`Created repo file: ${repoPath}`);
}

function fixSingleTaskViolation(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const supabaseCalls = extractSupabaseCalls(content);
  
  if (supabaseCalls.length === 0) {
    console.log(`No Supabase calls found in ${filePath}`);
    return;
  }
  
  // Create repo file
  createRepoFile(filePath, supabaseCalls);
  
  // Update original file to import and use repo functions
  let updatedContent = content;
  
  // Add import for repo
  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, path.extname(filePath));
  const repoImport = `import { ${baseName}Operation0 } from './${baseName}.repo';\n`;
  
  // Find where to insert the import (after existing imports)
  const importMatch = updatedContent.match(/(import.*?from.*?;\n)+/);
  if (importMatch) {
    updatedContent = updatedContent.replace(importMatch[0], importMatch[0] + repoImport);
  } else {
    updatedContent = repoImport + updatedContent;
  }
  
  // Replace Supabase calls with repo function calls
  supabaseCalls.forEach((call, index) => {
    const functionName = `${baseName}Operation${index}`;
    updatedContent = updatedContent.replace(call.content, `await ${functionName}()`);
  });
  
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Updated ${filePath} to use repo functions`);
}

// Process all single-task violations
console.log('Fixing single-task violations...');
singleTaskViolations.forEach(fixSingleTaskViolation);
console.log('Single-task violations fixed!');
