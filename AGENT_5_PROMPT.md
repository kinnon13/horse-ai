# AGENT 5 COPY-PASTE PROMPT

```
AGENT 5 TASK: Complete Pillars 10-11 (Viral & Marketing, Scaling & Reliability)

TARGET FILES:
- supabase/migrations/20250128000001_pillars_10_11.sql
- supabase/migrations/20250128000001_pillars_1_11.sql (verify consolidation)

TASKS:

1. VERIFY TABLE COUNTS
   - PILLAR 10: Count CREATE TABLE statements, must equal 10 (Tables 115-124)
   - PILLAR 11: Count CREATE TABLE statements, must equal 3 (Tables 125-127)
   - Check if pillars_10_11.sql needs to be merged into main migration

2. ADD MISSING TABLES (if any)
   If PILLAR 11 has less than 3 tables, add missing scaling/reliability tables

3. ADD INDEXES ON FOREIGN KEYS
   ```sql
   CREATE INDEX IF NOT EXISTS idx_referral_tracking_referrer_id ON referral_tracking(referrer_id);
   CREATE INDEX IF NOT EXISTS idx_referral_tracking_referred_id ON referral_tracking(referred_id);
   CREATE INDEX IF NOT EXISTS idx_social_sharing_events_user_id ON social_sharing_events(user_id);
   CREATE INDEX IF NOT EXISTS idx_viral_loop_participants_user_id ON viral_loop_participants(user_id);
   -- Add indexes for ALL foreign key columns in pillars 10-11
   ```

4. ADD METADATA COLUMNS
   Add to ALL tables in pillars 10-11:
   ```sql
   ALTER TABLE referral_tracking ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
   ALTER TABLE referral_tracking ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
   ALTER TABLE referral_tracking ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
   -- Repeat for ALL tables in pillars 10-11
   ```

5. ADD STATUS INDEXES
   For tables with status columns

OUTPUT:
- Report: "PILLAR 10: X/10 tables, PILLAR 11: X/3 tables"
- List indexes added
- Confirm metadata columns added

COMPLETE WHEN:
✅ PILLAR 10 has 10 tables
✅ PILLAR 11 has 3 tables
✅ All foreign keys indexed
✅ All tables have metadata columns

BEGIN TASK NOW.
```

