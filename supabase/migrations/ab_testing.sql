-- A/B Testing Migration
CREATE TABLE IF NOT EXISTS conversation_experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  conversation_id TEXT NOT NULL,
  experiment_type TEXT NOT NULL,
  variant TEXT NOT NULL,
  message_count INTEGER DEFAULT 0,
  converted BOOLEAN DEFAULT FALSE,
  revenue_generated DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  converted_at TIMESTAMPTZ
);

CREATE INDEX idx_experiments_type ON conversation_experiments(experiment_type);
CREATE INDEX idx_experiments_converted ON conversation_experiments(converted);

