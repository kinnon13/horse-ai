# AGENT 7 COPY-PASTE PROMPT

```
AGENT 7 TASK: Complete Pillars 14-15 (Vision & Sound Learning, Breeding & Genetics)

TARGET FILES:
- supabase/migrations/20250128000002_pillars_14_15_agent7.sql
- supabase/migrations/20250128000002_pillars_12_22.sql (verify consolidation)

TASKS:

1. VERIFY TABLE COUNTS
   - PILLAR 14: Count CREATE TABLE statements, must equal 15 (Tables 148-162)
   - PILLAR 15: Count CREATE TABLE statements, must equal 10 (Tables 163-172)
   - Report: "Found X/Y tables in each pillar"

2. ADD MISSING TABLES (if any)
   File 2 is missing 13 tables total - verify which are in pillars 14-15
   If counts are less than expected, add missing vision/sound/breeding tables

3. ADD INDEXES ON FOREIGN KEYS
   ```sql
   CREATE INDEX IF NOT EXISTS idx_vision_data_horse_id ON vision_data(horse_id);
   CREATE INDEX IF NOT EXISTS idx_audio_data_horse_id ON audio_data(horse_id);
   CREATE INDEX IF NOT EXISTS idx_breeding_records_sire_id ON breeding_records(sire_id);
   CREATE INDEX IF NOT EXISTS idx_breeding_records_dam_id ON breeding_records(dam_id);
   CREATE INDEX IF NOT EXISTS idx_genetic_profiles_horse_id ON genetic_profiles(horse_id);
   -- Add indexes for ALL foreign key columns in pillars 14-15
   ```

4. ADD METADATA COLUMNS
   Add to ALL tables in pillars 14-15:
   ```sql
   ALTER TABLE [table_name] ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
   ALTER TABLE [table_name] ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
   ALTER TABLE [table_name] ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
   -- Repeat for ALL tables in pillars 14-15
   ```

OUTPUT:
- Report table counts
- List missing tables if any
- List indexes added
- Confirm metadata columns added

COMPLETE WHEN:
✅ PILLAR 14 has 15 tables
✅ PILLAR 15 has 10 tables
✅ All foreign keys indexed
✅ All tables have metadata columns

BEGIN TASK NOW.
```

