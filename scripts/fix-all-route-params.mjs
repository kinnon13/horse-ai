#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

console.log('🔧 Fixing all dynamic route parameters...\n')

let fixed = 0

function fixRouteParams(dir) {
  const items = fs.readdirSync(dir)
  
  for (const item of items) {
    if (item === 'node_modules' || item === '.next' || item === '.git') continue
    
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory()) {
      fixRouteParams(fullPath)
    } else if (item === 'route.ts' || item === 'route.tsx') {
      let content = fs.readFileSync(fullPath, 'utf8')
      const original = content
      
      // Pattern 1: { params }: { params: { xxx: string } }
      content = content.replace(
        /export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH)\s*\(\s*([^,]+),\s*\{\s*params\s*\}:\s*\{\s*params:\s*\{\s*([^}]+)\}\s*\}\s*\)/g,
        (match, method, req, paramDef) => {
          const paramName = paramDef.trim().split(':')[0].trim()
          return `export async function ${method}(${req}, context: { params: Promise<{ ${paramDef}} })\n) {\n  const params = await context.params`
        }
      )
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content)
        console.log(`✅ Fixed: ${path.relative(rootDir, fullPath)}`)
        fixed++
      }
    }
  }
}

fixRouteParams(path.join(rootDir, 'src/app/api'))

console.log(`\n✅ Fixed ${fixed} route files`)
