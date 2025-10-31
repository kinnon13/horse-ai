# Agent 13 Fix Tasks

## Priority: CRITICAL

### Task 1: Identify and Create Missing 30 Tables
**File:** All 3 migration files
**Issue:** Only 350/380 tables created
**Required Fix:**
1. **File 1 (Pillars 1-11):** Missing 1 table
   - PILLAR 8 shows "Tables ?" - should be "Tables 90-104" (15 tables expected)
   - Currently only 5 tables found in PILLAR 8
   - **Action:** Add 10 missing tables to PILLAR 8 (admin/monitoring tables)

2. **File 2 (Pillars 12-22):** Missing 13 tables
   - Expected: Tables 128-254 (127 tables)
   - Found: 114 tables
   - **Action:** Review each pillar to identify missing tables

3. **File 3 (Pillars 23-32):** Missing 16 tables
   - Expected: Tables 255-380 (126 tables)
   - Found: 110 tables
   - **Action:** Review each pillar to identify missing tables

**Lines to Check:**
- `supabase/migrations/20250128000001_pillars_1_11.sql:1083` - PILLAR 8 comment
- Compare expected table counts per pillar vs actual CREATE TABLE statements

**Priority:** CRITICAL
**Estimated Time:** 2-3 hours

---

## Priority: HIGH

### Task 2: Add Indexes on Foreign Key Columns
**File:** All 3 migration files
**Issue:** Only 20 indexes for 350 tables with 315 foreign keys
**Required Fix:**
- Add `CREATE INDEX IF NOT EXISTS idx_{table_name}_{fk_column} ON {table_name}({fk_column});` for each foreign key
- Target columns: `user_id`, `horse_id`, `owner_id`, `breeder_id`, `sire_id`, `dam_id`, etc.
- Estimated need: ~100-150 additional indexes

**Example:**
```sql
CREATE INDEX IF NOT EXISTS idx_horses_owner_id ON horses(owner_id);
CREATE INDEX IF NOT EXISTS idx_horses_breeder_id ON horses(breeder_id);
```

**Priority:** HIGH
**Estimated Time:** 2 hours
**Impact:** Query performance will be poor without these indexes

---

### Task 3: Add Indexes on Common Query Columns
**File:** All 3 migration files
**Issue:** Missing indexes on frequently queried columns
**Required Fix:**
- Add indexes on `status` columns (79 tables have status)
- Add indexes on `created_at` columns for time-based queries
- Add indexes on `user_id` and `horse_id` where used

**Priority:** HIGH
**Estimated Time:** 1 hour

---

### Task 4: Add Metadata JSONB Columns for AI Expansion
**File:** All 3 migration files
**Issue:** Only 5 tables have explicit `metadata JSONB` columns
**Required Fix:**
- Add `metadata JSONB DEFAULT '{}'` to all 350 tables
- Allows AI to add fields without ALTER TABLE
- Create migration file: `supabase/migrations/20250131000001_add_metadata_columns.sql`

**Example:**
```sql
ALTER TABLE horses ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
-- Repeat for all 350 tables
```

**Priority:** HIGH
**Estimated Time:** 1 hour

---

## Priority: MEDIUM

### Task 5: Create Schema Version Tracking Table
**File:** New migration file
**Issue:** No schema_version tracking for dynamic changes
**Required Fix:**
- Create `schema_versions` table to track AI-driven schema changes
- Add `schema_version INTEGER DEFAULT 1` to all tables

**New File:** `supabase/migrations/20250131000002_schema_version_tracking.sql`

```sql
CREATE TABLE IF NOT EXISTS schema_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  column_name TEXT NOT NULL,
  column_type TEXT NOT NULL,
  added_by TEXT DEFAULT 'ai_expansion',
  added_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_schema_versions_table ON schema_versions(table_name);
```

**Priority:** MEDIUM
**Estimated Time:** 30 minutes

---

### Task 6: Add Extended Data Columns
**File:** All 3 migration files or new migration
**Issue:** No `extended_data` columns for schema expansion
**Required Fix:**
- Add `extended_data JSONB DEFAULT '{}'` to all tables
- Alternative: Create migration file to add columns

**Priority:** MEDIUM
**Estimated Time:** 30 minutes

---

## Priority: LOW

### Task 7: Verify Table Naming Consistency
**File:** All 3 migration files
**Issue:** Verify all tables use snake_case
**Required Fix:**
- Review all 350 table names
- Ensure consistent naming (already appears correct)

**Priority:** LOW
**Estimated Time:** 15 minutes

---

## Summary

### Critical Path to Production:
1. **Task 1** - Missing Tables (CRITICAL, 2-3 hours)
2. **Task 2** - Foreign Key Indexes (HIGH, 2 hours)
3. **Task 3** - Common Column Indexes (HIGH, 1 hour)
4. **Task 4** - Metadata Columns (HIGH, 1 hour)

**Total Critical Path Time:** 6-7 hours

### Post-Launch Tasks:
5. **Task 5** - Schema Version Tracking (MEDIUM, 30 min)
6. **Task 6** - Extended Data Columns (MEDIUM, 30 min)
7. **Task 7** - Naming Verification (LOW, 15 min)

---

**Created:** 2025-01-30
**By:** Agent 13
**Status:** PENDING - Awaiting fixes

