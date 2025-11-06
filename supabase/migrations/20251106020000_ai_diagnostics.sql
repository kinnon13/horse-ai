-- AI Diagnostics Table
CREATE TABLE IF NOT EXISTS ai_interaction_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  query TEXT NOT NULL,
  context_built JSONB,
  tools_used TEXT[],
  emotion_detected TEXT,
  strategy_used TEXT,
  response_provider TEXT,
  response_source TEXT,
  final_response TEXT,
  error_occurred BOOLEAN DEFAULT false,
  error_message TEXT,
  personalized_score INTEGER,
  missed_opportunities TEXT[],
  execution_time_ms INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_logs_user ON ai_interaction_logs(user_id);
CREATE INDEX idx_ai_logs_timestamp ON ai_interaction_logs(timestamp DESC);
CREATE INDEX idx_ai_logs_personalized_score ON ai_interaction_logs(personalized_score DESC);
CREATE INDEX idx_ai_logs_error ON ai_interaction_logs(error_occurred);

GRANT ALL ON ai_interaction_logs TO authenticated, anon;
