-- Engagement metrics tracking table
CREATE TABLE IF NOT EXISTS engagement_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  daily_questions INTEGER DEFAULT 0,
  decision_support_usage DECIMAL DEFAULT 0,
  emotional_engagement DECIMAL DEFAULT 0,
  response_speed_seconds INTEGER,
  share_count INTEGER DEFAULT 0,
  engagement_score INTEGER DEFAULT 0,
  measured_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_engagement_user ON engagement_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_engagement_score ON engagement_metrics(engagement_score DESC);

