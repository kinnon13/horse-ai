CREATE TABLE IF NOT EXISTS system_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

CREATE TABLE IF NOT EXISTS blocked_actions_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  reason TEXT,
  metadata JSONB
);

CREATE TABLE IF NOT EXISTS ai_action_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL,
  action_details JSONB,
  executed_at TIMESTAMPTZ DEFAULT NOW(),
  result TEXT,
  approved_by TEXT
);

INSERT INTO system_config (key, value) VALUES 
  ('kill_switch_active', 'false'),
  ('ai_mode', '"safe"'),
  ('auto_deploy_enabled', 'false'),
  ('auto_code_gen_enabled', 'false'),
  ('auto_sales_enabled', 'false'),
  ('auto_data_acquisition_enabled', 'false');

