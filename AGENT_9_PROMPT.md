# AGENT 9 COPY-PASTE PROMPT

```
AGENT 9 TASK: Complete Pillars 18-19 (Competitions & Events, Financial & Billing)

TARGET FILES:
- supabase/migrations/20250128000002_pillars_18_19_agent9.sql
- supabase/migrations/20250128000002_pillars_12_22.sql (verify consolidation)

TASKS:

1. VERIFY TABLE COUNTS
   - PILLAR 18: Count CREATE TABLE statements, must equal 10 (Tables 193-202)
   - PILLAR 19: Count CREATE TABLE statements, must equal 10 (Tables 203-212)
   - Report: "Found X/Y tables in each pillar"

2. ADD MISSING TABLES (if any)
   File 2 is missing 13 tables total - verify which are in pillars 18-19
   If counts are less than expected, add missing competition/financial tables

3. ADD INDEXES ON FOREIGN KEYS
   ```sql
   CREATE INDEX IF NOT EXISTS idx_competitions_user_id ON competitions(user_id);
   CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON event_registrations(user_id);
   CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
   CREATE INDEX IF NOT EXISTS idx_financial_transactions_user_id ON financial_transactions(user_id);
   CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
   CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
   -- Add indexes for ALL foreign key columns in pillars 18-19
   ```

4. ADD METADATA COLUMNS
   Add to ALL tables in pillars 18-19:
   ```sql
   ALTER TABLE [table_name] ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
   ALTER TABLE [table_name] ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
   ALTER TABLE [table_name] ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
   -- Repeat for ALL tables in pillars 18-19
   ```

5. ADD STATUS INDEXES
   For tables with status columns

OUTPUT:
- Report table counts
- List missing tables if any
- List indexes added
- Confirm metadata columns added

COMPLETE WHEN:
✅ PILLAR 18 has 10 tables
✅ PILLAR 19 has 10 tables
✅ All foreign keys indexed
✅ All tables have metadata columns

BEGIN TASK NOW.
```

