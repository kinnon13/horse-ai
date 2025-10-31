# AGENT 8 COPY-PASTE PROMPT

```
AGENT 8 TASK: Complete Pillars 16-17 (Training & Performance, Feed & Nutrition)

TARGET FILE: supabase/migrations/20250128000002_pillars_16_17_agent8.sql

TASKS:

1. VERIFY TABLE COUNTS
   - PILLAR 16: Count CREATE TABLE statements, must equal 10 (Tables 173-182)
   - PILLAR 17: Count CREATE TABLE statements, must equal 10 (Tables 183-192)
   - Report: "Found X/Y tables in each pillar"

2. ADD MISSING TABLES (if any)
   If counts are less than expected, add missing training/feed tables

3. ADD INDEXES ON FOREIGN KEYS
   ```sql
   CREATE INDEX IF NOT EXISTS idx_training_sessions_horse_id ON training_sessions(horse_id);
   CREATE INDEX IF NOT EXISTS idx_training_sessions_trainer_id ON training_sessions(trainer_id);
   CREATE INDEX IF NOT EXISTS idx_training_programs_horse_id ON training_programs(horse_id);
   CREATE INDEX IF NOT EXISTS idx_performance_metrics_horse_id ON performance_metrics(horse_id);
   CREATE INDEX IF NOT EXISTS idx_feed_schedules_horse_id ON feed_schedules(horse_id);
   CREATE INDEX IF NOT EXISTS idx_feed_intake_log_horse_id ON feed_intake_log(horse_id);
   CREATE INDEX IF NOT EXISTS idx_supplement_schedules_horse_id ON supplement_schedules(horse_id);
   CREATE INDEX IF NOT EXISTS idx_nutritional_analyses_horse_id ON nutritional_analyses(horse_id);
   -- Add indexes for ALL foreign key columns in pillars 16-17
   ```

4. ADD METADATA COLUMNS
   Add to ALL tables in pillars 16-17:
   ```sql
   ALTER TABLE training_sessions ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
   ALTER TABLE training_sessions ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
   ALTER TABLE training_sessions ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
   -- Repeat for ALL tables in pillars 16-17
   ```

5. ADD STATUS INDEXES
   For tables with status columns

OUTPUT:
- Report table counts
- List indexes added
- Confirm metadata columns added

COMPLETE WHEN:
✅ PILLAR 16 has 10 tables
✅ PILLAR 17 has 10 tables
✅ All foreign keys indexed
✅ All tables have metadata columns

BEGIN TASK NOW.
```

