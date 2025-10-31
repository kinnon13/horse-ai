# AGENT 3 COPY-PASTE PROMPT

```
AGENT 3 TASK: Complete Pillar 6 (Social & Community)

TARGET FILE: supabase/migrations/20250128000001_pillars_1_11.sql

TASKS:

1. VERIFY TABLE COUNT
   - PILLAR 6: Count CREATE TABLE statements, must equal 12 (Tables 63-74)
   - Report: "Found X/12 tables in PILLAR 6"

2. ADD MISSING TABLES (if any)
   If count is less than 12, add missing social/community tables

3. ADD INDEXES ON FOREIGN KEYS
   Add indexes for all FK columns:
   ```sql
   CREATE INDEX IF NOT EXISTS idx_social_connections_user_id ON social_connections(user_id);
   CREATE INDEX IF NOT EXISTS idx_social_connections_connected_user_id ON social_connections(connected_user_id);
   CREATE INDEX IF NOT EXISTS idx_community_groups_user_id ON community_groups(user_id);
   CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id ON forum_posts(user_id);
   CREATE INDEX IF NOT EXISTS idx_forum_posts_thread_id ON forum_posts(thread_id);
   -- Add indexes for ALL foreign key columns in PILLAR 6
   ```

4. ADD METADATA COLUMNS
   Add to ALL tables in PILLAR 6:
   ```sql
   ALTER TABLE [table_name] ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
   ALTER TABLE [table_name] ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
   ALTER TABLE [table_name] ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
   -- Repeat for ALL 12 tables in PILLAR 6
   ```

5. ADD STATUS INDEXES
   For tables with status columns

OUTPUT:
- Report: "PILLAR 6: X/12 tables found"
- List all indexes added
- Confirm metadata columns added

COMPLETE WHEN:
✅ PILLAR 6 has exactly 12 tables
✅ All foreign keys indexed
✅ All tables have metadata columns

BEGIN TASK NOW.
```

