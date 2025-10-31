# Agents 1-12 Completion Tasks

## Audit Summary
- **Total Tables Found:** 350/380 (92% complete)
- **Missing:** 30 tables
- **Missing Indexes:** ~100-150 indexes on foreign keys
- **Missing Metadata Columns:** 345 tables need metadata JSONB

---

## AGENT 1 TASKS - Pillars 1-3 (Horses, Users, Providers)

### Task 1.1: Verify PILLAR 1 Tables (15 tables expected)
**File:** `supabase/migrations/20250128000001_pillars_1_11.sql`
**Check:** Verify all 15 tables exist for PILLAR 1
**Action:** If any missing, add following PostgreSQL syntax:
```sql
CREATE TABLE IF NOT EXISTS [table_name] (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- columns here
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Task 1.2: Verify PILLAR 2 Tables (12 tables expected)
**Expected:** Tables 16-27
**Check:** Count CREATE TABLE statements in PILLAR 2 section

### Task 1.3: Verify PILLAR 3 Tables (10 tables expected)
**Expected:** Tables 28-37
**Check:** Count CREATE TABLE statements in PILLAR 3 section

### Task 1.4: Add Indexes for Pillars 1-3
Add indexes on all foreign key columns:
```sql
CREATE INDEX IF NOT EXISTS idx_horses_owner_id ON horses(owner_id);
CREATE INDEX IF NOT EXISTS idx_horses_breeder_id ON horses(breeder_id);
CREATE INDEX IF NOT EXISTS idx_horses_sire_id ON horses(sire_id);
CREATE INDEX IF NOT EXISTS idx_horses_dam_id ON horses(dam_id);
-- Repeat for all FK columns in pillars 1-3
```

### Task 1.5: Add Metadata Columns to Pillars 1-3
Add to all tables missing metadata:
```sql
ALTER TABLE horses ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE horses ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE horses ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
-- Repeat for all tables in pillars 1-3
```

**Priority:** CRITICAL
**Time Estimate:** 2 hours

---

## AGENT 2 TASKS - Pillars 4-5 (Transactions, Health)

### Task 2.1: Verify PILLAR 4 Tables (10 tables expected)
**File:** `supabase/migrations/20250128000001_agent2_pillars_4_5.sql`
**Expected:** Tables 38-47
**Status:** Likely complete (Agent 2 already worked on this)

### Task 2.2: Verify PILLAR 5 Tables (15 tables expected)
**Expected:** Tables 48-62
**Status:** Likely complete

### Task 2.3: Add Indexes for Pillars 4-5
Add indexes on all FK columns:
```sql
CREATE INDEX IF NOT EXISTS idx_purchase_orders_user_id ON purchase_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_provider_id ON purchase_orders(provider_id);
CREATE INDEX IF NOT EXISTS idx_vet_visits_horse_id ON vet_visits(horse_id);
CREATE INDEX IF NOT EXISTS idx_vet_visits_user_id ON vet_visits(user_id);
-- Repeat for all FK columns
```

### Task 2.4: Add Metadata Columns to Pillars 4-5
Add to all tables missing metadata (check existing first)

**Priority:** HIGH
**Time Estimate:** 1.5 hours

---

## AGENT 3 TASKS - Pillar 6 (Social & Community)

### Task 3.1: Verify PILLAR 6 Tables (12 tables expected)
**File:** `supabase/migrations/20250128000001_pillars_1_11.sql`
**Expected:** Tables 63-74
**Action:** Count and verify all 12 tables exist

### Task 3.2: Add Missing Tables if Any
If count is less than 12, add missing tables

### Task 3.3: Add Indexes for Pillar 6
```sql
CREATE INDEX IF NOT EXISTS idx_social_connections_user_id ON social_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_social_connections_connected_user_id ON social_connections(connected_user_id);
-- Add indexes for all FK columns
```

### Task 3.4: Add Metadata Columns to Pillar 6

**Priority:** HIGH
**Time Estimate:** 1 hour

---

## AGENT 4 TASKS - Pillars 8-9 (Admin & Monitoring, Retention)

### Task 4.1: FIX PILLAR 8 - CRITICAL ISSUE
**File:** `supabase/migrations/20250128000001_pillars_1_11.sql`
**Line 1083:** Comment shows "Tables ?" - MUST FIX
**Expected:** Tables 90-104 (15 tables total)
**Current:** Only 5 tables found in PILLAR 8 section

**MISSING TABLES TO ADD:**
```sql
-- Table 91: admin_logins
CREATE TABLE IF NOT EXISTS admin_logins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  ip_address INET,
  login_method TEXT,
  success BOOLEAN DEFAULT TRUE,
  failure_reason TEXT,
  logged_in_at TIMESTAMPTZ DEFAULT NOW(),
  logged_out_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 92: admin_permissions
CREATE TABLE IF NOT EXISTS admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  permission_type TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  granted BOOLEAN DEFAULT TRUE,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  granted_by UUID REFERENCES users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 93: monitoring_dashboards
CREATE TABLE IF NOT EXISTS monitoring_dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_name TEXT NOT NULL,
  dashboard_type TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  is_public BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 94: monitoring_widgets
CREATE TABLE IF NOT EXISTS monitoring_widgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_id UUID REFERENCES monitoring_dashboards(id) ON DELETE CASCADE,
  widget_type TEXT NOT NULL,
  widget_config JSONB DEFAULT '{}',
  position_x INTEGER,
  position_y INTEGER,
  width INTEGER,
  height INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 95: system_notifications
CREATE TABLE IF NOT EXISTS system_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_type TEXT NOT NULL,
  notification_level TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  target_user_id UUID REFERENCES users(id),
  target_role TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  action_url TEXT,
  action_label TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 96: system_backups_log
CREATE TABLE IF NOT EXISTS system_backups_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_id UUID REFERENCES database_backups(id),
  backup_step TEXT NOT NULL,
  step_status TEXT NOT NULL,
  step_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 97: config_history
CREATE TABLE IF NOT EXISTS config_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID REFERENCES system_config(id) ON DELETE CASCADE,
  old_value JSONB,
  new_value JSONB,
  changed_by UUID REFERENCES users(id),
  change_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 98: alert_rules
CREATE TABLE IF NOT EXISTS alert_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL,
  condition_expression TEXT NOT NULL,
  threshold_value DECIMAL,
  alert_action TEXT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 99: alert_notifications
CREATE TABLE IF NOT EXISTS alert_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID REFERENCES alert_rules(id) ON DELETE CASCADE,
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  alert_value DECIMAL,
  notification_sent BOOLEAN DEFAULT FALSE,
  notification_channel TEXT,
  notification_sent_at TIMESTAMPTZ,
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_by UUID REFERENCES users(id),
  acknowledged_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 100: system_maintenance
CREATE TABLE IF NOT EXISTS system_maintenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  maintenance_type TEXT NOT NULL,
  maintenance_description TEXT,
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  status TEXT DEFAULT 'scheduled',
  affected_services TEXT[],
  created_by UUID REFERENCES users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_logins_admin_id ON admin_logins(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_admin_id ON admin_permissions(admin_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_widgets_dashboard_id ON monitoring_widgets(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_system_notifications_user_id ON system_notifications(target_user_id);
CREATE INDEX IF NOT EXISTS idx_system_backups_log_backup_id ON system_backups_log(backup_id);
CREATE INDEX IF NOT EXISTS idx_config_history_config_id ON config_history(config_id);
CREATE INDEX IF NOT EXISTS idx_alert_notifications_rule_id ON alert_notifications(rule_id);
CREATE INDEX IF NOT EXISTS idx_alert_notifications_triggered_at ON alert_notifications(triggered_at);
```

**Update line 1083:** Change `-- PILLAR 8: ADMIN & MONITORING (Tables ?)` to `-- PILLAR 8: ADMIN & MONITORING (Tables 90-104)`

### Task 4.2: Verify PILLAR 9 Tables (10 tables expected)
**Expected:** Tables 105-114

### Task 4.3: Add Indexes for Pillars 8-9
Add indexes on all FK columns in both pillars

### Task 4.4: Add Metadata Columns to Pillars 8-9

**Priority:** CRITICAL (PILLAR 8 missing 10 tables)
**Time Estimate:** 3 hours

---

## AGENT 5 TASKS - Pillars 10-11 (Viral Marketing, Scaling)

### Task 5.1: Verify PILLAR 10 Tables (10 tables expected)
**Expected:** Tables 115-124
**File:** Check `supabase/migrations/20250128000001_pillars_10_11.sql`

### Task 5.2: Verify PILLAR 11 Tables (3 tables expected)
**Expected:** Tables 125-127

### Task 5.3: Add Indexes for Pillars 10-11

### Task 5.4: Add Metadata Columns to Pillars 10-11

**Priority:** HIGH
**Time Estimate:** 1 hour

---

## AGENT 6 TASKS - Pillars 12-13 (Security, Multi-AI)

### Task 6.1: Verify PILLAR 12 Tables (10 tables expected)
**File:** `supabase/migrations/20250128000002_pillars_12_22.sql`
**Expected:** Tables 128-137
**Status:** Likely complete (Agent 6 already worked on this)

### Task 6.2: Verify PILLAR 13 Tables (10 tables expected)
**Expected:** Tables 138-147

### Task 6.3: Add Missing Tables if Any
Check if both pillars have all expected tables

### Task 6.4: Add Indexes for Pillars 12-13

### Task 6.5: Add Metadata Columns to Pillars 12-13

**Priority:** HIGH
**Time Estimate:** 1.5 hours

---

## AGENT 7 TASKS - Pillars 14-15 (Vision/Sound, Breeding)

### Task 7.1: Verify PILLAR 14 Tables (15 tables expected)
**File:** `supabase/migrations/20250128000002_pillars_14_15_agent7.sql`
**Expected:** Tables 148-162

### Task 7.2: Verify PILLAR 15 Tables (10 tables expected)
**Expected:** Tables 163-172

### Task 7.3: Add Missing Tables if Any
**File 2 Missing:** 13 tables total - verify which are in pillars 14-15

### Task 7.4: Add Indexes for Pillars 14-15

### Task 7.5: Add Metadata Columns to Pillars 14-15

**Priority:** HIGH
**Time Estimate:** 2 hours

---

## AGENT 8 TASKS - Pillars 16-17 (Training, Feed)

### Task 8.1: Verify PILLAR 16 Tables (10 tables expected)
**File:** `supabase/migrations/20250128000002_pillars_16_17_agent8.sql`
**Expected:** Tables 173-182
**Status:** Likely complete

### Task 8.2: Verify PILLAR 17 Tables (10 tables expected)
**Expected:** Tables 183-192

### Task 8.3: Add Indexes for Pillars 16-17

### Task 8.4: Add Metadata Columns to Pillars 16-17

**Priority:** HIGH
**Time Estimate:** 1 hour

---

## AGENT 9 TASKS - Pillars 18-19 (Competitions, Financial)

### Task 9.1: Verify PILLAR 18 Tables (10 tables expected)
**File:** `supabase/migrations/20250128000002_pillars_18_19_agent9.sql` or `20250128000002_pillars_12_22.sql`
**Expected:** Tables 193-202

### Task 9.2: Verify PILLAR 19 Tables (10 tables expected)
**Expected:** Tables 203-212

### Task 9.3: Add Missing Tables if Any
Check if all 20 tables exist

### Task 9.4: Add Indexes for Pillars 18-19

### Task 9.5: Add Metadata Columns to Pillars 18-19

**Priority:** HIGH
**Time Estimate:** 1.5 hours

---

## AGENT 10 TASKS - Pillars 20-21 (Feedback, Partnerships)

### Task 10.1: Verify PILLAR 20 Tables (10 tables expected)
**File:** `supabase/migrations/20250128000002_pillars_12_22_agent10.sql` or `20250128000002_pillars_12_22.sql`
**Expected:** Tables 213-222

### Task 10.2: Verify PILLAR 21 Tables (10 tables expected)
**Expected:** Tables 223-232

### Task 10.3: Add Missing Tables if Any
**File 2 Missing:** 13 tables - verify which are in pillars 20-21

### Task 10.4: Add Indexes for Pillars 20-21

### Task 10.5: Add Metadata Columns to Pillars 20-21

**Priority:** HIGH
**Time Estimate:** 1.5 hours

---

## AGENT 11 TASKS - Pillars 23-24 (Token Management, Synthetic Testing)

### Task 11.1: Verify PILLAR 23 Tables (10 tables expected)
**File:** `supabase/migrations/20250128000003_pillars_23_32.sql`
**Expected:** Tables 255-264

### Task 11.2: Verify PILLAR 24 Tables (10 tables expected)
**Expected:** Tables 265-274

### Task 11.3: Add Missing Tables if Any
**File 3 Missing:** 16 tables total - verify which are in pillars 23-24

### Task 11.4: Add Indexes for Pillars 23-24

### Task 11.5: Add Metadata Columns to Pillars 23-24

**Priority:** HIGH
**Time Estimate:** 2 hours

---

## AGENT 12 TASKS - Pillars 22, 25-32 (Self-Healing, Circuit Breaker, DLQ, Retention, Diplomacy, Payments, Security, Scaling, Emotional)

### Task 12.1: Verify PILLAR 22 Tables (10 tables expected)
**File:** `supabase/migrations/20250128000002_pillars_12_22.sql`
**Expected:** Tables 233-242

### Task 12.2: Verify PILLAR 25 Tables (10 tables expected)
**Expected:** Tables 275-284

### Task 12.3: Verify PILLAR 26 Tables (10 tables expected)
**Expected:** Tables 285-294

### Task 12.4: Verify PILLAR 27 Tables (10 tables expected)
**Expected:** Tables 295-304

### Task 12.5: Verify PILLAR 28 Tables (10 tables expected)
**Expected:** Tables 305-314

### Task 12.6: Verify PILLAR 29 Tables (10 tables expected)
**Expected:** Tables 315-324

### Task 12.7: Verify PILLAR 30 Tables (10 tables expected)
**Expected:** Tables 325-334

### Task 12.8: Verify PILLAR 31 Tables (10 tables expected)
**Expected:** Tables 335-344

### Task 12.9: Verify PILLAR 32 Tables (36 tables expected - Tables 345-380)
**CRITICAL:** PILLAR 32 shows "Tables 345-380" = 36 tables expected
**Check:** Verify all 36 tables exist in PILLAR 32 section

### Task 12.10: Add Missing Tables
**File 3 Missing:** 16 tables - Most likely missing from PILLAR 32 (36 expected)

### Task 12.11: Add Indexes for Pillars 22, 25-32
Add indexes on all FK columns

### Task 12.12: Add Metadata Columns to Pillars 22, 25-32

**Priority:** CRITICAL (PILLAR 32 likely missing many tables)
**Time Estimate:** 4 hours

---

## SHARED TASKS - All Agents

### Task ALL.1: Create Schema Version Tracking Table
**File:** Create new migration `supabase/migrations/20250131000001_schema_version_tracking.sql`

```sql
CREATE TABLE IF NOT EXISTS schema_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  column_name TEXT NOT NULL,
  column_type TEXT NOT NULL,
  added_by TEXT DEFAULT 'ai_expansion',
  added_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_schema_versions_table ON schema_versions(table_name);
CREATE INDEX IF NOT EXISTS idx_schema_versions_added_at ON schema_versions(added_at);
```

**Assigned to:** Agent 1 (create migration file)

---

## COMPLETION CHECKLIST

After completing all tasks, verify:

- [ ] Exactly 380 CREATE TABLE statements across 3 files
- [ ] All 32 pillars have correct table counts
- [ ] All foreign keys have indexes
- [ ] All tables have metadata JSONB columns
- [ ] All tables have extended_data JSONB columns
- [ ] All tables have schema_version INTEGER columns
- [ ] schema_versions table created
- [ ] No duplicate table names
- [ ] All indexes created with IF NOT EXISTS
- [ ] All syntax is PostgreSQL compliant

---

## PRIORITY ORDER

1. **CRITICAL:** Agent 4 - Fix PILLAR 8 (missing 10 tables)
2. **CRITICAL:** Agent 12 - Verify PILLAR 32 (36 tables expected, likely missing 16)
3. **HIGH:** All agents - Add indexes on foreign keys
4. **HIGH:** All agents - Add metadata columns
5. **MEDIUM:** Create schema_versions table

---

**Total Estimated Time:** 18-20 hours across all agents
**Target:** Complete all tasks before Agent 13 re-audit

