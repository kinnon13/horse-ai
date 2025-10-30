-- PILLAR 3: PERFORMANCE & COMPETITION
-- Competition results, training records, performance metrics

-- Competition events
CREATE TABLE IF NOT EXISTS competition_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name VARCHAR(255) NOT NULL,
  event_type VARCHAR(100), -- barrel racing, roping, jumping, etc.
  location_city VARCHAR(100),
  location_state VARCHAR(50),
  event_date DATE NOT NULL,
  prize_money_cents INTEGER,
  entry_fee_cents INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT false,
  adjacency_impact INTEGER DEFAULT 0
);

-- Competition results
CREATE TABLE IF NOT EXISTS competition_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES competition_events(id),
  horse_id UUID REFERENCES horses(id),
  rider_id UUID REFERENCES users(id),
  placement INTEGER,
  time_seconds DECIMAL(8,3),
  score DECIMAL(8,2),
  earnings_cents INTEGER,
  penalties INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT false,
  adjacency_impact INTEGER DEFAULT 0
);

-- Training sessions
CREATE TABLE IF NOT EXISTS training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id),
  trainer_id UUID REFERENCES users(id),
  session_date DATE NOT NULL,
  duration_minutes INTEGER,
  training_type VARCHAR(100), -- groundwork, riding, jumping, etc.
  focus_area VARCHAR(255),
  notes TEXT,
  progress_rating INTEGER CHECK (progress_rating >= 1 AND progress_rating <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT false
);

-- Performance metrics
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id),
  metric_date DATE NOT NULL,
  metric_type VARCHAR(100), -- speed, agility, endurance, etc.
  value DECIMAL(10,3),
  unit VARCHAR(20),
  context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT false
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_competition_events_date ON competition_events(event_date);
CREATE INDEX IF NOT EXISTS idx_competition_events_type ON competition_events(event_type);
CREATE INDEX IF NOT EXISTS idx_competition_results_event ON competition_results(event_id);
CREATE INDEX IF NOT EXISTS idx_competition_results_horse ON competition_results(horse_id);
CREATE INDEX IF NOT EXISTS idx_competition_results_rider ON competition_results(rider_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_horse ON training_sessions(horse_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_date ON training_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_horse ON performance_metrics(horse_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_date ON performance_metrics(metric_date);

-- Triggers
CREATE TRIGGER update_competition_events_timestamp BEFORE UPDATE ON competition_events FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_competition_results_timestamp BEFORE UPDATE ON competition_results FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_training_sessions_timestamp BEFORE UPDATE ON training_sessions FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_performance_metrics_timestamp BEFORE UPDATE ON performance_metrics FOR EACH ROW EXECUTE FUNCTION update_timestamp();



