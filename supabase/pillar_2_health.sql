-- PILLAR 2: HEALTH & MEDICAL
-- Veterinary records, health monitoring, medical history

-- Veterinary records
CREATE TABLE IF NOT EXISTS veterinary_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id),
  vet_id UUID REFERENCES users(id),
  visit_date DATE NOT NULL,
  visit_type VARCHAR(100), -- routine, emergency, surgery, etc.
  diagnosis TEXT,
  treatment TEXT,
  medications TEXT,
  follow_up_date DATE,
  cost_cents INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT false,
  adjacency_impact INTEGER DEFAULT 0
);

-- Health monitoring
CREATE TABLE IF NOT EXISTS health_monitoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id),
  recorded_by UUID REFERENCES users(id),
  measurement_date TIMESTAMPTZ DEFAULT NOW(),
  temperature_f DECIMAL(4,1),
  heart_rate INTEGER,
  respiratory_rate INTEGER,
  weight_lbs INTEGER,
  lameness_score INTEGER CHECK (lameness_score >= 0 AND lameness_score <= 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT false
);

-- Vaccination records
CREATE TABLE IF NOT EXISTS vaccinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id),
  vaccine_name VARCHAR(255) NOT NULL,
  vaccine_date DATE NOT NULL,
  next_due_date DATE,
  administered_by UUID REFERENCES users(id),
  lot_number VARCHAR(100),
  manufacturer VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT false
);

-- Injury tracking
CREATE TABLE IF NOT EXISTS injuries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id),
  injury_date DATE NOT NULL,
  injury_type VARCHAR(100),
  body_location VARCHAR(100),
  severity VARCHAR(20), -- minor, moderate, severe
  description TEXT,
  treatment TEXT,
  recovery_time_days INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT false,
  adjacency_impact INTEGER DEFAULT 0
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vet_records_horse ON veterinary_records(horse_id);
CREATE INDEX IF NOT EXISTS idx_vet_records_date ON veterinary_records(visit_date);
CREATE INDEX IF NOT EXISTS idx_health_monitoring_horse ON health_monitoring(horse_id);
CREATE INDEX IF NOT EXISTS idx_health_monitoring_date ON health_monitoring(measurement_date);
CREATE INDEX IF NOT EXISTS idx_vaccinations_horse ON vaccinations(horse_id);
CREATE INDEX IF NOT EXISTS idx_vaccinations_date ON vaccinations(vaccine_date);
CREATE INDEX IF NOT EXISTS idx_injuries_horse ON injuries(horse_id);
CREATE INDEX IF NOT EXISTS idx_injuries_date ON injuries(injury_date);

-- Triggers
CREATE TRIGGER update_vet_records_timestamp BEFORE UPDATE ON veterinary_records FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_health_monitoring_timestamp BEFORE UPDATE ON health_monitoring FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_vaccinations_timestamp BEFORE UPDATE ON vaccinations FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_injuries_timestamp BEFORE UPDATE ON injuries FOR EACH ROW EXECUTE FUNCTION update_timestamp();



