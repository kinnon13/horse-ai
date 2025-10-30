-- PILLAR 4: BREEDING & GENETICS
-- Breeding records, pedigree, genetic testing, stud services

-- Breeding records
CREATE TABLE IF NOT EXISTS breeding_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mare_id UUID REFERENCES horses(id),
  stallion_id UUID REFERENCES horses(id),
  breeding_date DATE NOT NULL,
  breeding_type VARCHAR(50), -- natural, AI, embryo transfer
  success BOOLEAN,
  foal_id UUID REFERENCES horses(id),
  stud_fee_cents INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT false,
  adjacency_impact INTEGER DEFAULT 0
);

-- Pedigree information
CREATE TABLE IF NOT EXISTS pedigree (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id),
  sire_id UUID REFERENCES horses(id),
  dam_id UUID REFERENCES horses(id),
  generation INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT false
);

-- Genetic testing
CREATE TABLE IF NOT EXISTS genetic_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id),
  test_date DATE NOT NULL,
  test_type VARCHAR(100), -- DNA, parentage, genetic disorders
  lab_name VARCHAR(255),
  results TEXT,
  certificate_number VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT false
);

-- Stud services
CREATE TABLE IF NOT EXISTS stud_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stallion_id UUID REFERENCES horses(id),
  owner_id UUID REFERENCES users(id),
  service_type VARCHAR(100), -- live cover, AI, frozen semen
  fee_cents INTEGER,
  availability_start DATE,
  availability_end DATE,
  location_city VARCHAR(100),
  location_state VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT false,
  adjacency_impact INTEGER DEFAULT 0
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_breeding_records_mare ON breeding_records(mare_id);
CREATE INDEX IF NOT EXISTS idx_breeding_records_stallion ON breeding_records(stallion_id);
CREATE INDEX IF NOT EXISTS idx_breeding_records_date ON breeding_records(breeding_date);
CREATE INDEX IF NOT EXISTS idx_pedigree_horse ON pedigree(horse_id);
CREATE INDEX IF NOT EXISTS idx_genetic_tests_horse ON genetic_tests(horse_id);
CREATE INDEX IF NOT EXISTS idx_genetic_tests_date ON genetic_tests(test_date);
CREATE INDEX IF NOT EXISTS idx_stud_services_stallion ON stud_services(stallion_id);
CREATE INDEX IF NOT EXISTS idx_stud_services_location ON stud_services(location_city, location_state);

-- Triggers
CREATE TRIGGER update_breeding_records_timestamp BEFORE UPDATE ON breeding_records FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_pedigree_timestamp BEFORE UPDATE ON pedigree FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_genetic_tests_timestamp BEFORE UPDATE ON genetic_tests FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_stud_services_timestamp BEFORE UPDATE ON stud_services FOR EACH ROW EXECUTE FUNCTION update_timestamp();

