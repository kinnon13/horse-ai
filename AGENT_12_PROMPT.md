# AGENT 12 COPY-PASTE PROMPT - CRITICAL

```
AGENT 12 TASK: Complete Pillars 22, 25-32 (CRITICAL - Likely Missing 16 Tables)

TARGET FILE: supabase/migrations/20250128000003_pillars_23_32.sql

CURRENT STATUS:
- File 3 expected: 126 tables (Tables 255-380)
- File 3 found: 110 tables
- Missing: 16 tables
- PILLAR 32 shows "Tables 345-380" = 36 tables expected (likely missing most)

TASKS:

1. VERIFY ALL PILLAR TABLE COUNTS
   - PILLAR 22: 10 tables (Tables 233-242) - Check in file 2
   - PILLAR 25: 10 tables (Tables 275-284)
   - PILLAR 26: 10 tables (Tables 285-294)
   - PILLAR 27: 10 tables (Tables 295-304)
   - PILLAR 28: 10 tables (Tables 305-314)
   - PILLAR 29: 10 tables (Tables 315-324)
   - PILLAR 30: 10 tables (Tables 325-334)
   - PILLAR 31: 10 tables (Tables 335-344)
   - PILLAR 32: 36 tables (Tables 345-380) - CRITICAL: Verify all 36 exist

2. ADD MISSING TABLES IN PILLAR 32 (Most Critical)
   PILLAR 32 expects 36 tables - if less than 36, add missing emotional response analysis tables:
   - emotion_logs, emotional_triggers, user_emotion_profiles, emotion_analytics, emotional_insights, sentiment_analysis, emotional_trends, etc.
   
   Use this template for each missing table:
   ```sql
   CREATE TABLE IF NOT EXISTS [table_name] (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     -- Add appropriate columns for emotional response analysis
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     -- Add other columns
     metadata JSONB DEFAULT '{}',
     extended_data JSONB DEFAULT '{}',
     schema_version INTEGER DEFAULT 1,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   CREATE INDEX IF NOT EXISTS idx_[table_name]_user_id ON [table_name](user_id);
   ```

3. ADD MISSING TABLES IN PILLARS 25-31 (if any)
   Check each pillar count and add missing tables

4. ADD INDEXES ON ALL FOREIGN KEYS
   For pillars 22, 25-32, add indexes on ALL foreign key columns:
   ```sql
   CREATE INDEX IF NOT EXISTS idx_[table_name]_[fk_column] ON [table_name]([fk_column]);
   -- Repeat for ALL foreign keys
   ```

5. ADD METADATA COLUMNS TO ALL TABLES
   For ALL tables in pillars 22, 25-32:
   ```sql
   ALTER TABLE [table_name] ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
   ALTER TABLE [table_name] ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
   ALTER TABLE [table_name] ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
   -- Repeat for ALL tables
   ```

6. ADD STATUS INDEXES
   For all tables with status columns

OUTPUT:
- Report table count for each pillar (22, 25-32)
- List ALL missing tables found
- List all indexes added
- Confirm metadata columns added to all tables

COMPLETE WHEN:
✅ PILLAR 22 has 10 tables
✅ PILLAR 25 has 10 tables
✅ PILLAR 26 has 10 tables
✅ PILLAR 27 has 10 tables
✅ PILLAR 28 has 10 tables
✅ PILLAR 29 has 10 tables
✅ PILLAR 30 has 10 tables
✅ PILLAR 31 has 10 tables
✅ PILLAR 32 has 36 tables (CRITICAL - this is likely where most are missing)
✅ All foreign keys indexed
✅ All tables have metadata columns

BEGIN TASK NOW - THIS IS CRITICAL!
```

