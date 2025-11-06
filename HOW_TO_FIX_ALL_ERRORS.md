# How to Fix All 392 Errors

## The Problem:
The audit found 392 errors across the codebase. Most are in existing files, not new code.

## The Solution:
Use automated scripts to mass-fix common patterns.

## 1. Add Auth to All API Routes (106 files)

**Find all API routes without auth:**
```bash
grep -r "export async function POST\|export async function GET" src/app/api --include="*.ts" | grep -v "auth\|getSession\|checkAuth" > unprotected-apis.txt
```

**Add withAuth wrapper:**
```typescript
// Before:
export async function POST(req: NextRequest) {
  const { userId } = await req.json()
  // ...
}

// After:
import { withAuth } from '@/middleware/withAuth'

export const POST = withAuth(async (req: NextRequest, userId: string) => {
  // userId is now authenticated and passed in
  // ...
})
```

## 2. Add Try-Catch to Async Functions (240 files)

**Pattern to find:**
```bash
grep -r "async function\|async (" src --include="*.ts" -A 5 | grep -v "try {" > missing-trycatch.txt
```

**Fix pattern:**
```typescript
// Before:
export async function getData() {
  const data = await fetch(...)
  return data
}

// After:
export async function getData() {
  try {
    const data = await fetch(...)
    return data
  } catch (error) {
    console.error('getData error:', error)
    throw error // or return null/default
  }
}
```

## 3. Add Pagination to All Queries (179 files)

**Find queries without limits:**
```bash
grep -r "\.from(\|\.select(" src/app/api --include="*.ts" | grep -v "limit\|range" > unpaginated-queries.txt
```

**Fix pattern:**
```typescript
// Before:
const { data } = await supabase.from('users').select('*')

// After:
import { paginateQuery } from '@/lib/paginationHelper'

const { data } = await paginateQuery(
  supabase.from('users').select('*'),
  { page: 1, limit: 50 }
)
```

## 4. Use Automated Script

I can create a script that does ALL of this automatically:

```bash
node scripts/mass-fix-errors.mjs
```

This will:
- Add withAuth to all unprotected API routes
- Wrap all async functions in try-catch
- Add .limit(100) to all unpaginated queries
- Generate backup before each change

**Want me to build this script?**
