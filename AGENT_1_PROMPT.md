# AGENT 1 COPY-PASTE PROMPT

```
AGENT 1 TASK: Complete Pillars 1-3 (Horses, Users, Providers)

TARGET FILE: supabase/migrations/20250128000001_pillars_1_11.sql

TASKS:

1. VERIFY TABLE COUNTS
   - PILLAR 1: Count CREATE TABLE statements, must equal 15 (Tables 1-15)
   - PILLAR 2: Count CREATE TABLE statements, must equal 12 (Tables 16-27)
   - PILLAR 3: Count CREATE TABLE statements, must equal 10 (Tables 28-37)
   - Report: "Found X/Y tables in each pillar"

2. ADD MISSING TABLES (if any)
   If count is less than expected, add missing tables using this template:
   ```sql
   CREATE TABLE IF NOT EXISTS [table_name] (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     -- Add columns based on pillar requirements
     metadata JSONB DEFAULT '{}',
     extended_data JSONB DEFAULT '{}',
     schema_version INTEGER DEFAULT 1,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

3. ADD INDEXES ON FOREIGN KEYS
   Add these indexes after each CREATE TABLE with foreign keys:
   ```sql
   CREATE INDEX IF NOT EXISTS idx_horses_owner_id ON horses(owner_id);
   CREATE INDEX IF NOT EXISTS idx_horses_breeder_id ON horses(breeder_id);
   CREATE INDEX IF NOT EXISTS idx_horses_sire_id ON horses(sire_id);
   CREATE INDEX IF NOT EXISTS idx_horses_dam_id ON horses(dam_id);
   -- Add indexes for ALL foreign key columns in pillars 1-3
   ```

4. ADD METADATA COLUMNS
   Add to ALL tables in pillars 1-3 that don't have them:
   ```sql
   ALTER TABLE horses ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
   ALTER TABLE horses ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
   ALTER TABLE horses ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
   -- Repeat for ALL tables in pillars 1-3
   ```

5. ADD STATUS INDEXES
   For any table with a `status` column, add:
   ```sql
   CREATE INDEX IF NOT EXISTS idx_[table_name]_status ON [table_name](status);
   ```

6. ADD CREATED_AT INDEXES
   For tables frequently queried by date, add:
   ```sql
   CREATE INDEX IF NOT EXISTS idx_[table_name]_created_at ON [table_name](created_at);
   ```

OUTPUT:
- Report final table counts for each pillar
- List all indexes added
- Confirm all metadata columns added

COMPLETE WHEN:
✅ PILLAR 1 has 15 tables
✅ PILLAR 2 has 12 tables
✅ PILLAR 3 has 10 tables
✅ All foreign keys have indexes
✅ All tables have metadata/extended_data/schema_version columns

BEGIN TASK NOW.
```

