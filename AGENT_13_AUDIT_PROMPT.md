# AGENT 13 COMPREHENSIVE DATABASE AUDIT PROMPT

## DIRECT COPY-PASTE INSTRUCTIONS FOR AGENT 13

```
AUDIT TASK: Verify Agents 1-12 completed all 32 pillars with 380 tables across 3 migration files.

TARGET FILES TO AUDIT:
1. supabase/migrations/20250128000001_pillars_1_11.sql (Pillars 1-11)
2. supabase/migrations/20250128000002_pillars_12_22.sql (Pillars 12-22)
3. supabase/migrations/20250128000003_pillars_23_32.sql (Pillars 23-32)

AUDIT REQUIREMENTS:

1. COUNT ALL TABLES
   - Use grep: grep -c "CREATE TABLE" on each file
   - Total must equal 380 across all 3 files
   - Report: "Found X tables (expected 380)"

2. CHECK FOR DUPLICATES
   - Extract all table names from CREATE TABLE statements
   - Find any table names that appear multiple times
   - Report duplicates with file paths

3. VERIFY ALL 32 PILLARS EXIST
   - Check for pillar comment blocks (-- PILLAR X:)
   - Count unique pillars found
   - Report missing pillars if any

4. VALIDATE POSTGRESQL SYNTAX
   - Search for SQLite syntax: AUTOINCREMENT, INTEGER PRIMARY KEY
   - Verify all use: UUID PRIMARY KEY DEFAULT gen_random_uuid()
   - Verify all timestamps: TIMESTAMPTZ not TIMESTAMP
   - Verify all JSON: JSONB not JSON
   - Report syntax errors with file:line numbers

5. CHECK FOREIGN KEYS
   - Extract all REFERENCES statements
   - Verify referenced tables exist
   - Report broken references

6. VERIFY INDEXES
   - Count CREATE INDEX statements
   - Verify indexes on FK columns
   - Verify indexes on user_id, horse_id, status, created_at columns
   - Report missing critical indexes

7. CHECK N8N COMPATIBILITY
   - Verify all tables have created_at column
   - Check for status columns with consistent values
   - Verify JSONB columns exist for flexible data
   - Report: "N8N Compatible: YES/NO"

8. VALIDATE MIGRATION READINESS
   - Check for CREATE TABLE IF NOT EXISTS usage
   - Verify no conflicts with existing migrations
   - Report: "Migration Ready: YES/NO"

OUTPUT REQUIREMENTS:
Create file: AGENT_13_AUDIT_REPORT.md

Report format:
# Agent 13 Audit Report

## Executive Summary
- Total Tables Found: [X]/380
- Migration Status: [PASS/FAIL]
- Ready for Production: [YES/NO]

## Detailed Findings

### Table Count
- File 1: [X] tables
- File 2: [X] tables
- File 3: [X] tables
- Total: [X]/380

### Duplicates Found
[List any duplicate table names with file paths]

### Missing Pillars
[List any missing pillars 1-32]

### Syntax Errors
[List all syntax errors with file:line:error]

### Foreign Key Issues
[List broken FK references]

### Missing Indexes
[List missing critical indexes]

### N8N Compatibility
Status: [PASS/FAIL]
Details: [Issues found]

### Migration Readiness
Status: [READY/NOT READY]
Blockers: [List blockers]

## Recommendations
[List specific fixes needed with file paths and line numbers]

---

IF ISSUES FOUND:
Create file: AGENT_13_FIX_TASKS.md
List each issue with:
- File path
- Line number
- Issue description
- Required fix
- Priority (CRITICAL/HIGH/MEDIUM/LOW)

BEGIN AUDIT NOW.
```

