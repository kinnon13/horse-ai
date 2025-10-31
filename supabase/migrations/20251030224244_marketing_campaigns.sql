-- Marketing Campaigns Table
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  content TEXT NOT NULL,
  target_audience TEXT,
  channel TEXT CHECK (channel IN ('email', 'social', 'blog', 'ad')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  performance JSONB DEFAULT '{"views": 0, "clicks": 0, "conversions": 0}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for query performance
CREATE INDEX idx_campaigns_status ON marketing_campaigns(status);
CREATE INDEX idx_campaigns_channel ON marketing_campaigns(channel);
