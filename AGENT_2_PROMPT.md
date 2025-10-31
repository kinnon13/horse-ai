# AGENT 2 COPY-PASTE PROMPT

```
AGENT 2 TASK: Complete Pillars 4-5 (Purchases & Transactions, Health & Vet Care)

TARGET FILES: 
- supabase/migrations/20250128000001_agent2_pillars_4_5.sql
- supabase/migrations/20250128000001_pillars_1_11.sql (verify consolidation)

TASKS:

1. VERIFY TABLE COUNTS
   - PILLAR 4: Count CREATE TABLE statements, must equal 10 (Tables 38-47)
   - PILLAR 5: Count CREATE TABLE statements, must equal 15 (Tables 48-62)
   - Check if agent2_pillars_4_5.sql needs to be merged into main migration

2. ADD MISSING TABLES (if any)
   If count is less than expected, add missing tables

3. ADD INDEXES ON FOREIGN KEYS
   Add indexes for all FK columns in pillars 4-5:
   ```sql
   CREATE INDEX IF NOT EXISTS idx_purchase_orders_user_id ON purchase_orders(user_id);
   CREATE INDEX IF NOT EXISTS idx_purchase_orders_provider_id ON purchase_orders(provider_id);
   CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
   CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
   CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions(order_id);
   CREATE INDEX IF NOT EXISTS idx_vet_visits_horse_id ON vet_visits(horse_id);
   CREATE INDEX IF NOT EXISTS idx_vet_visits_user_id ON vet_visits(user_id);
   CREATE INDEX IF NOT EXISTS idx_vet_visits_vet_provider_id ON vet_visits(vet_provider_id);
   CREATE INDEX IF NOT EXISTS idx_vaccinations_horse_id ON vaccinations(horse_id);
   CREATE INDEX IF NOT EXISTS idx_medications_horse_id ON medications(horse_id);
   -- Add indexes for ALL foreign key columns
   ```

4. ADD METADATA COLUMNS
   Add to ALL tables in pillars 4-5:
   ```sql
   ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
   ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
   ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
   -- Repeat for ALL tables in pillars 4-5
   ```

5. ADD STATUS INDEXES
   ```sql
   CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
   CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
   -- Add for all tables with status columns
   ```

OUTPUT:
- Report table counts
- List indexes added
- Confirm metadata columns added

COMPLETE WHEN:
✅ PILLAR 4 has 10 tables
✅ PILLAR 5 has 15 tables
✅ All foreign keys indexed
✅ All tables have metadata columns

BEGIN TASK NOW.
```

