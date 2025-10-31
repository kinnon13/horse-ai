-- User Acquisition & Conversion Tracking Tables
-- Tracks user paths, conversion funnels, and optimization metrics

CREATE TABLE IF NOT EXISTS user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB,
  page_url TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversion_funnels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  funnel_stage TEXT CHECK (funnel_stage IN ('visit', 'signup', 'first_query', 'upgrade_view', 'upgraded')),
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_events_user ON user_events(user_id);
CREATE INDEX idx_events_type ON user_events(event_type);
CREATE INDEX idx_events_created ON user_events(created_at);
CREATE INDEX idx_funnel_user ON conversion_funnels(user_id);
CREATE INDEX idx_funnel_stage ON conversion_funnels(funnel_stage);
