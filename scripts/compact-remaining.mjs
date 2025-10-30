const fs = require('fs')
const path = require('path')

const files = [
  'src/lib/horse-context-extractor.ts',
  'src/lib/location-detector-concierge.ts',
  'src/lib/haul-support-route.ts',
  'src/lib/tier-gating-contracts.ts',
  'src/lib/usage-tracker-data.ts',
  'src/services/availability/ProviderAvailabilityStore.ts',
  'src/lib/export-generator-excel.ts',
  'src/lib/export-generator-pdf.ts',
  'src/lib/feedback-scores.ts',
  'src/lib/haul-support-validation.ts',
  'src/lib/location-detector-patterns.ts',
  'src/lib/provider-capture.ts',
  'src/lib/queueNotification.ts',
  'src/lib/rate-limiter-operations.ts',
  'src/lib/rate-limiter.ts',
  'src/lib/scraping-agents-orchestrator.ts',
  'src/lib/search-trends-ai.ts'
]

files.forEach(file => {
  const filePath = path.join(process.cwd(), file)
  if (!fs.existsSync(filePath)) return
  
  let content = fs.readFileSync(filePath, 'utf8')
  
  // Compact method calls
  content = content.replace(/\.\s*\n\s+/g, '. ')
  
  // Remove extra blank lines
  content = content.replace(/\n{3,}/g, '\n\n')
  
  // Compact simple if statements
  content = content.replace(/if \(([^)]+)\)\s*{\s*return\s+([^;]+);\s*}/g, 'if ($1) return $2')
  
  fs.writeFileSync(filePath, content)
  console.log(`Compacted ${file}`)
})

console.log('Done!')




