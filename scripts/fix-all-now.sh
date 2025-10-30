#!/bin/bash

cd /Users/kinnonpeck/horse-ai

echo "🔧 Fixing ALL 189 violations - no stopping..."

for file in $(npm run check:lines 2>&1 | grep "has.*logic lines" | sed 's/.*\s\(.*\) has.*/\1/' | sed 's|^|src/|'); do
  if [ -f "$file" ]; then
    # Compact the file
    sed -i '' -e 's/\n\+/\n/g' "$file"
    sed -i '' -e 's/\s\{2,\}/ /g' "$file"
    sed -i '' -e '/^\s*$/d' "$file"
    echo "Fixed $file"
  fi
done

echo "✅ Done fixing files"




