# AGENT 10 COPY-PASTE PROMPT

```
AGENT 10 TASK: Complete Pillars 20-21 (User Feedback & Reviews, Partnerships & Associations)

TARGET FILES:
- supabase/migrations/20250128000002_pillars_12_22_agent10.sql
- supabase/migrations/20250128000002_pillars_12_22.sql (verify consolidation)

TASKS:

1. VERIFY TABLE COUNTS
   - PILLAR 20: Count CREATE TABLE statements, must equal 10 (Tables 213-222)
   - PILLAR 21: Count CREATE TABLE statements, must equal 10 (Tables 223-232)
   - Report: "Found X/Y tables in each pillar"

2. ADD MISSING TABLES (if any)
   File 2 is missing 13 tables total - verify which are in pillars 20-21
   If counts are less than expected, add missing feedback/partnership tables

3. ADD INDEXES ON FOREIGN KEYS
   ```sql
   CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON user_feedback(user_id);
   CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
   CREATE INDEX IF NOT EXISTS idx_reviews_provider_id ON reviews(provider_id);
   CREATE INDEX IF NOT EXISTS idx_partnerships_user_id ON partnerships(user_id);
   CREATE INDEX IF NOT EXISTS idx_association_memberships_user_id ON association_memberships(user_id);
   CREATE INDEX IF NOT EXISTS idx_association_memberships_association_id ON association_memberships(association_id);
   -- Add indexes for ALL foreign key columns in pillars 20-21
   ```

4. ADD METADATA COLUMNS
   Add to ALL tables in pillars 20-21:
   ```sql
   ALTER TABLE [table_name] ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
   ALTER TABLE [table_name] ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
   ALTER TABLE [table_name] ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
   -- Repeat for ALL tables in pillars 20-21
   ```

5. ADD STATUS INDEXES
   For tables with status columns

OUTPUT:
- Report table counts
- List missing tables if any
- List indexes added
- Confirm metadata columns added

COMPLETE WHEN:
✅ PILLAR 20 has 10 tables
✅ PILLAR 21 has 10 tables
✅ All foreign keys indexed
✅ All tables have metadata columns

BEGIN TASK NOW.
```

