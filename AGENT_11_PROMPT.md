# AGENT 11 COPY-PASTE PROMPT

```
AGENT 11 TASK: Complete Pillars 23-24 (Token & Cost Management, Synthetic Testing)

TARGET FILE: supabase/migrations/20250128000003_pillars_23_32.sql

TASKS:

1. VERIFY TABLE COUNTS
   - PILLAR 23: Count CREATE TABLE statements, must equal 10 (Tables 255-264)
   - PILLAR 24: Count CREATE TABLE statements, must equal 10 (Tables 265-274)
   - Report: "Found X/Y tables in each pillar"

2. ADD MISSING TABLES (if any)
   File 3 is missing 16 tables total - verify which are in pillars 23-24
   If counts are less than expected, add missing token/testing tables

3. ADD INDEXES ON FOREIGN KEYS
   ```sql
   CREATE INDEX IF NOT EXISTS idx_ai_token_usage_user_id ON ai_token_usage(user_id);
   CREATE INDEX IF NOT EXISTS idx_token_quota_limits_user_id ON token_quota_limits(user_id);
   CREATE INDEX IF NOT EXISTS idx_cost_tracking_user_id ON cost_tracking(user_id);
   CREATE INDEX IF NOT EXISTS idx_token_budgets_user_id ON token_budgets(user_id);
   CREATE INDEX IF NOT EXISTS idx_synthetic_tests_user_id ON synthetic_tests(user_id);
   CREATE INDEX IF NOT EXISTS idx_test_results_test_id ON test_results(test_id);
   -- Add indexes for ALL foreign key columns in pillars 23-24
   ```

4. ADD METADATA COLUMNS
   Add to ALL tables in pillars 23-24:
   ```sql
   ALTER TABLE ai_token_usage ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
   ALTER TABLE ai_token_usage ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
   ALTER TABLE ai_token_usage ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
   -- Repeat for ALL tables in pillars 23-24
   ```

5. ADD STATUS INDEXES
   For tables with status columns

OUTPUT:
- Report table counts
- List missing tables if any
- List indexes added
- Confirm metadata columns added

COMPLETE WHEN:
✅ PILLAR 23 has 10 tables
✅ PILLAR 24 has 10 tables
✅ All foreign keys indexed
✅ All tables have metadata columns

BEGIN TASK NOW.
```

