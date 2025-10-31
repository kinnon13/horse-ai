-- User feedback table for AI learning from upvotes/downvotes
CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  provider TEXT NOT NULL,
  feedback TEXT CHECK (feedback IN ('upvote', 'downvote')),
  topic TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_provider ON user_feedback(provider);
CREATE INDEX IF NOT EXISTS idx_feedback_topic ON user_feedback(topic);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON user_feedback(created_at DESC);

