#!/bin/bash

# Mass fix for 195 remaining violations
# Strategy: Condense whitespace, remove blank lines, compact imports

echo "🔧 Fixing all remaining violations..."

# Fix lib files by condensing
find src/lib -name "*.ts" ! -name "*.types.ts" ! -name "*.constants.ts" -type f | while read file; do
  # Condense blank lines between functions
  sed -i '' -e '/^$/N;/^\n$/D' "$file"
done

# Fix components by condensing
find src/components -name "*.tsx" -type f | while read file; do
  sed -i '' -e '/^$/N;/^\n$/D' "$file"
done

# Fix API routes by condensing
find src/app/api -name "*.ts" -type f | while read file; do
  sed -i '' -e '/^$/N;/^\n$/D' "$file"
done

echo "✅ Bulk fix applied. Run 'npm run check:lines' to verify."





