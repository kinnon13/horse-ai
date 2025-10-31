# AGENT 4 COPY-PASTE PROMPT - CRITICAL

```
AGENT 4 TASK: FIX PILLAR 8 - Missing 10 Tables (CRITICAL BLOCKER)

TARGET FILE: supabase/migrations/20250128000001_pillars_1_11.sql
LINE 1083: Fix comment "Tables ?" → "Tables 90-104"

CURRENT STATUS:
- PILLAR 8 comment shows "Tables ?"
- Only 5 tables found (should be 15 total)
- Missing: 10 tables

TASKS:

1. FIX PILLAR 8 COMMENT
   Line 1083: Change `-- PILLAR 8: ADMIN & MONITORING (Tables ?)`
   To: `-- PILLAR 8: ADMIN & MONITORING (Tables 90-104)`

2. ADD 10 MISSING TABLES
   Insert these tables AFTER line 1206 (after system_alerts table):
   
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
     extended_data JSONB DEFAULT '{}',
     schema_version INTEGER DEFAULT 1,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   CREATE INDEX IF NOT EXISTS idx_admin_logins_admin_id ON admin_logins(admin_id);

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
     extended_data JSONB DEFAULT '{}',
     schema_version INTEGER DEFAULT 1,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   CREATE INDEX IF NOT EXISTS idx_admin_permissions_admin_id ON admin_permissions(admin_id);

   -- Table 93: monitoring_dashboards
   CREATE TABLE IF NOT EXISTS monitoring_dashboards (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     dashboard_name TEXT NOT NULL,
     dashboard_type TEXT NOT NULL,
     config JSONB DEFAULT '{}',
     created_by UUID REFERENCES users(id),
     is_public BOOLEAN DEFAULT FALSE,
     metadata JSONB DEFAULT '{}',
     extended_data JSONB DEFAULT '{}',
     schema_version INTEGER DEFAULT 1,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   CREATE INDEX IF NOT EXISTS idx_monitoring_dashboards_created_by ON monitoring_dashboards(created_by);

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
     extended_data JSONB DEFAULT '{}',
     schema_version INTEGER DEFAULT 1,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   CREATE INDEX IF NOT EXISTS idx_monitoring_widgets_dashboard_id ON monitoring_widgets(dashboard_id);

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
     extended_data JSONB DEFAULT '{}',
     schema_version INTEGER DEFAULT 1,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   CREATE INDEX IF NOT EXISTS idx_system_notifications_user_id ON system_notifications(target_user_id);

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
     extended_data JSONB DEFAULT '{}',
     schema_version INTEGER DEFAULT 1,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   CREATE INDEX IF NOT EXISTS idx_system_backups_log_backup_id ON system_backups_log(backup_id);

   -- Table 97: config_history
   CREATE TABLE IF NOT EXISTS config_history (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     config_id UUID REFERENCES system_config(id) ON DELETE CASCADE,
     old_value JSONB,
     new_value JSONB,
     changed_by UUID REFERENCES users(id),
     change_reason TEXT,
     metadata JSONB DEFAULT '{}',
     extended_data JSONB DEFAULT '{}',
     schema_version INTEGER DEFAULT 1,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   CREATE INDEX IF NOT EXISTS idx_config_history_config_id ON config_history(config_id);

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
     extended_data JSONB DEFAULT '{}',
     schema_version INTEGER DEFAULT 1,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   CREATE INDEX IF NOT EXISTS idx_alert_rules_created_by ON alert_rules(created_by);

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
     extended_data JSONB DEFAULT '{}',
     schema_version INTEGER DEFAULT 1,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   CREATE INDEX IF NOT EXISTS idx_alert_notifications_rule_id ON alert_notifications(rule_id);
   CREATE INDEX IF NOT EXISTS idx_alert_notifications_triggered_at ON alert_notifications(triggered_at);

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
     extended_data JSONB DEFAULT '{}',
     schema_version INTEGER DEFAULT 1,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   CREATE INDEX IF NOT EXISTS idx_system_maintenance_created_by ON system_maintenance(created_by);
   CREATE INDEX IF NOT EXISTS idx_system_maintenance_status ON system_maintenance(status);
   ```

3. ADD METADATA TO EXISTING PILLAR 8 TABLES
   Add to the 5 existing tables (admin_users, admin_actions, etc.):
   ```sql
   ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
   ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
   ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
   -- Repeat for admin_actions, system_health_metrics, api_usage_stats, error_logs, performance_monitoring, database_backups, system_config, feature_flags, audit_trail, system_alerts
   ```

4. VERIFY PILLAR 9 TABLES (10 tables expected - Tables 105-114)
   Count CREATE TABLE statements in PILLAR 9 section

5. ADD INDEXES FOR PILLAR 9
   Add indexes on all FK columns in PILLAR 9

6. ADD METADATA TO PILLAR 9 TABLES

OUTPUT:
- Confirm PILLAR 8 now has 15 tables (was 5, added 10)
- Confirm comment fixed on line 1083
- Confirm PILLAR 9 has 10 tables
- List all indexes added

COMPLETE WHEN:
✅ PILLAR 8 comment fixed
✅ PILLAR 8 has exactly 15 tables (90-104)
✅ PILLAR 9 has exactly 10 tables (105-114)
✅ All foreign keys indexed
✅ All tables have metadata columns

BEGIN TASK NOW - THIS IS CRITICAL!
```

