-- PILLAR 5: LOGISTICS & TRANSPORTATION
-- Hauling services, transportation records, logistics

-- Hauling services
CREATE TABLE IF NOT EXISTS hauling_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hauler_id UUID REFERENCES users(id),
  service_type VARCHAR(100), -- local, long distance, emergency
  pickup_location_city VARCHAR(100),
  pickup_location_state VARCHAR(50),
  delivery_location_city VARCHAR(100),
  delivery_location_state VARCHAR(50),
  max_distance_miles INTEGER,
  rate_per_mile_cents INTEGER,
  base_rate_cents INTEGER,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT false,
  adjacency_impact INTEGER DEFAULT 0
);

-- Transportation records
CREATE TABLE IF NOT EXISTS transportation_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id),
  hauler_id UUID REFERENCES users(id),
  pickup_date TIMESTAMPTZ NOT NULL,
  delivery_date TIMESTAMPTZ,
  pickup_location TEXT,
  delivery_location TEXT,
  distance_miles INTEGER,
  cost_cents INTEGER,
  status VARCHAR(50), -- scheduled, in_transit, delivered, cancelled
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT false,
  adjacency_impact INTEGER DEFAULT 0
);

-- Hauling equipment
CREATE TABLE IF NOT EXISTS hauling_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hauler_id UUID REFERENCES users(id),
  equipment_type VARCHAR(100), -- trailer, truck, etc.
  capacity_horses INTEGER,
  equipment_description TEXT,
  insurance_expiry DATE,
  inspection_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT false
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_hauling_services_hauler ON hauling_services(hauler_id);
CREATE INDEX IF NOT EXISTS idx_hauling_services_location ON hauling_services(pickup_location_city, pickup_location_state);
CREATE INDEX IF NOT EXISTS idx_transportation_records_horse ON transportation_records(horse_id);
CREATE INDEX IF NOT EXISTS idx_transportation_records_hauler ON transportation_records(hauler_id);
CREATE INDEX IF NOT EXISTS idx_transportation_records_date ON transportation_records(pickup_date);
CREATE INDEX IF NOT EXISTS idx_hauling_equipment_hauler ON hauling_equipment(hauler_id);

-- Triggers
CREATE TRIGGER update_hauling_services_timestamp BEFORE UPDATE ON hauling_services FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_transportation_records_timestamp BEFORE UPDATE ON transportation_records FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_hauling_equipment_timestamp BEFORE UPDATE ON hauling_equipment FOR EACH ROW EXECUTE FUNCTION update_timestamp();



