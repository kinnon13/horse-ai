-- Track AI accuracy over time
CREATE TABLE IF NOT EXISTS ai_accuracy_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  question TEXT NOT NULL,
  topic TEXT,
  was_correct BOOLEAN NOT NULL,
  confidence FLOAT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_accuracy_provider ON ai_accuracy_log(provider, was_correct);
CREATE INDEX IF NOT EXISTS idx_ai_accuracy_topic ON ai_accuracy_log(topic, provider);

