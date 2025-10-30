# RAPID VIOLATION FIX STRATEGY

## The Problem
- 203 files with 18,060 excess logic lines
- Manual refactoring = 8+ hours
- User wants it ALL fixed NOW

## Strategy: "Surgical Extraction"
For each file over 50 lines, move:
1. Large arrays/constants → `.constants.ts` or `.data.ts`
2. Helper functions → `.utils.ts` or `.helpers.ts`
3. Type definitions → `.types.ts` (already allowed to be long)

This keeps core logic files under 50 lines while preserving functionality.

## Execution Plan
1. Create extraction scripts
2. Run in batches
3. Verify compilation
4. Test critical paths

Let me start with the worst 20 offenders...



