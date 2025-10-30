-- PILLAR 1: CORE FOUNDATION
-- User identity, authentication, basic horse profiles, relationships

-- Core users table with enhanced fields
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  full_name VARCHAR(255),
  location_city VARCHAR(100),
  location_state VARCHAR(50),
  location_country VARCHAR(50),
  subscription_tier VARCHAR(20) DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT false,
  adjacency_impact INTEGER DEFAULT 0,
  embedding VECTOR(384)
);

-- Enhanced horse profiles
CREATE TABLE IF NOT EXISTS horses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  breed VARCHAR(100),
  color VARCHAR(50),
  birth_date DATE,
  gender VARCHAR(20),
  height_hands DECIMAL(3,1),
  weight_lbs INTEGER,
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT false,
  adjacency_impact INTEGER DEFAULT 0,
  embedding VECTOR(384)
);

-- Human-horse relationships
CREATE TABLE IF NOT EXISTS human_horse_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  human_id UUID REFERENCES users(id),
  horse_id UUID REFERENCES horses(id),
  relationship_type VARCHAR(50), -- owner, rider, trainer, breeder
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT false
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location_city, location_state);
CREATE INDEX IF NOT EXISTS idx_horses_owner ON horses(owner_id);
CREATE INDEX IF NOT EXISTS idx_horses_breed ON horses(breed);
CREATE INDEX IF NOT EXISTS idx_relationships_human ON human_horse_relationships(human_id);
CREATE INDEX IF NOT EXISTS idx_relationships_horse ON human_horse_relationships(horse_id);

-- Update timestamp triggers
CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_horses_timestamp BEFORE UPDATE ON horses FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_relationships_timestamp BEFORE UPDATE ON human_horse_relationships FOR EACH ROW EXECUTE FUNCTION update_timestamp();

