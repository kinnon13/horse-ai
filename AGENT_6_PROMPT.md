# AGENT 6 COPY-PASTE PROMPT

```
AGENT 6 TASK: Complete Pillars 12-13 (Security & Compliance, Multi-AI Agents)

TARGET FILE: supabase/migrations/20250128000002_pillars_12_22.sql

TASKS:

1. VERIFY TABLE COUNTS
   - PILLAR 12: Count CREATE TABLE statements, must equal 10 (Tables 128-137)
   - PILLAR 13: Count CREATE TABLE statements, must equal 10 (Tables 138-147)
   - Report: "Found X/Y tables in each pillar"

2. ADD MISSING TABLES (if any)
   If counts are less than expected, add missing security/AI agent tables

3. ADD INDEXES ON FOREIGN KEYS
   ```sql
   CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON security_audit_log(user_id);
   CREATE INDEX IF NOT EXISTS idx_compliance_checks_entity ON compliance_checks(entity_type, entity_id);
   CREATE INDEX IF NOT EXISTS idx_gdpr_requests_user_id ON gdpr_requests(user_id);
   CREATE INDEX IF NOT EXISTS idx_ai_agent_tasks_agent_id ON ai_agent_tasks(agent_id);
   CREATE INDEX IF NOT EXISTS idx_ai_agent_performance_agent_id ON ai_agent_performance(agent_id);
   CREATE INDEX IF NOT EXISTS idx_ai_agent_conversations_user_id ON ai_agent_conversations(user_id);
   -- Add indexes for ALL foreign key columns in pillars 12-13
   ```

4. ADD METADATA COLUMNS
   Add to ALL tables in pillars 12-13:
   ```sql
   ALTER TABLE security_audit_log ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
   ALTER TABLE security_audit_log ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
   ALTER TABLE security_audit_log ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
   -- Repeat for ALL tables in pillars 12-13
   ```

5. ADD STATUS INDEXES
   For tables with status columns

OUTPUT:
- Report table counts for both pillars
- List all indexes added
- Confirm metadata columns added

COMPLETE WHEN:
✅ PILLAR 12 has 10 tables
✅ PILLAR 13 has 10 tables
✅ All foreign keys indexed
✅ All tables have metadata columns

BEGIN TASK NOW.
```

