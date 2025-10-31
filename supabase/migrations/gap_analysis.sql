-- Gap Analysis Migration
CREATE TABLE IF NOT EXISTS feature_gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gap_type TEXT CHECK (gap_type IN ('missing_feature', 'user_request', 'competitor_has', 'search_query')),
  description TEXT NOT NULL,
  source TEXT,
  priority INTEGER DEFAULT 0,
  user_count INTEGER DEFAULT 1,
  status TEXT DEFAULT 'identified' CHECK (status IN ('identified', 'planned', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gaps_priority ON feature_gaps(priority DESC);
CREATE INDEX IF NOT EXISTS idx_gaps_status ON feature_gaps(status);
