-- Pillar 1: Core Entities – Elon/SpaceX Precision: Modular, Partitioned, AI-Ready
-- Partitioning example: For scalability, partition large tables like horses by breed or region (Supabase/Postgres supports declarative partitioning).
-- Triggers: Auto-update timestamps for precision auditing.
-- Extensions: Enable pgvector for embeddings (vector search on photos for AI health analysis).

-- Enable extensions (run once in Supabase)
CREATE EXTENSION IF NOT EXISTS vector;  -- For AI embeddings on photos/markings

-- Timestamp trigger function (precision auditing)
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('rider', 'owner', 'trainer', 'buyer', 'other')),  -- Enum-like for precision
    preferences JSONB,  -- Extensible for AI personalization (e.g., {'adjacents': ['agribusiness']})
    subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'enterprise')),  -- Monetization hook
    net_worth_estimate DECIMAL(15,2)  -- For targeting high-value adjacents (e.g., ag investments)
);
CREATE TRIGGER trig_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

CREATE TABLE IF NOT EXISTS user_contacts (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    extra_phone TEXT,
    emergency_number TEXT,
    backup_email TEXT UNIQUE
);
CREATE TRIGGER trig_user_contacts_updated_at BEFORE UPDATE ON user_contacts FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_user_contacts_user_id ON user_contacts(user_id);

CREATE TABLE IF NOT EXISTS businesses (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('hauler', 'clinic', 'stallion_station', 'training_barn', 'other')),
    address TEXT NOT NULL,
    website TEXT,
    revenue_tier TEXT CHECK (revenue_tier IN ('small', 'medium', 'large')),  -- For adjacency analysis (e.g., ag suppliers)
    adjacency_links JSONB  -- E.g., {'agribusiness': ['feed_supplier_id'], 'tourism': ['event_partner_id']}
);
CREATE TRIGGER trig_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_businesses_type ON businesses(type);
CREATE INDEX idx_businesses_adjacency_links ON businesses USING GIN (adjacency_links);

CREATE TABLE IF NOT EXISTS business_relationships (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('manager', 'decision_maker', 'contact', 'other'))
);
CREATE TRIGGER trig_business_relationships_updated_at BEFORE UPDATE ON business_relationships FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_business_relationships_user_id ON business_relationships(user_id);
CREATE INDEX idx_business_relationships_business_id ON business_relationships(business_id);

CREATE TABLE IF NOT EXISTS facility_registry (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name TEXT NOT NULL,
    location TEXT NOT NULL,  -- Human-readable address
    geo_coordinates JSONB NOT NULL,  -- {'lat': 37.7749, 'long': -122.4194} for spatial queries (adjacency mapping)
    type TEXT NOT NULL CHECK (type IN ('barn', 'clinic', 'layup', 'quarantine', 'other')),
    business_id INTEGER REFERENCES businesses(id) ON DELETE SET NULL
);
CREATE TRIGGER trig_facility_registry_updated_at BEFORE UPDATE ON facility_registry FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_facility_registry_type ON facility_registry(type);
CREATE INDEX idx_facility_registry_geo ON facility_registry USING GIN (geo_coordinates);

CREATE TABLE IF NOT EXISTS facility_capacity (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    facility_id INTEGER REFERENCES facility_registry(id) ON DELETE CASCADE NOT NULL,
    stalls_available INTEGER DEFAULT 0 NOT NULL CHECK (stalls_available >= 0),
    foaling_stalls INTEGER DEFAULT 0 NOT NULL CHECK (foaling_stalls >= 0),
    quarantine_slots INTEGER DEFAULT 0 NOT NULL CHECK (quarantine_slots >= 0),
    layup_slots INTEGER DEFAULT 0 NOT NULL CHECK (layup_slots >= 0)
);
CREATE TRIGGER trig_facility_capacity_updated_at BEFORE UPDATE ON facility_capacity FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_facility_capacity_facility_id ON facility_capacity(facility_id);

CREATE TABLE IF NOT EXISTS horses (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name TEXT NOT NULL,
    breed TEXT NOT NULL,
    age INTEGER CHECK (age >= 0),
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    registration_number TEXT UNIQUE,  -- For compliance/tracking in racing/breeding
    microchip_id TEXT UNIQUE NOT NULL,  -- Precision ID for takeover (e.g., global traceability)
    color TEXT,
    markings TEXT,  -- E.g., 'star on forehead'
    photo_url TEXT,  -- For visual AI (embeddings below)
    photo_embedding VECTOR(384)  -- pgvector for ML similarity search (e.g., conformation analysis)
) PARTITION BY LIST (breed);  -- SpaceX-style scalability: Partition by breed for large datasets
CREATE TRIGGER trig_horses_updated_at BEFORE UPDATE ON horses FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_horses_owner_id ON horses(owner_id);
CREATE INDEX idx_horses_breed ON horses(breed);
CREATE INDEX idx_horses_photo_embedding ON horses USING hnsw (photo_embedding vector_cosine_ops);  -- For AI precision

CREATE TABLE IF NOT EXISTS horse_biometric_profile (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    sex TEXT NOT NULL CHECK (sex IN ('male', 'female', 'gelding', 'other')),
    height DECIMAL(5,2) CHECK (height > 0),  -- In hands, precision decimal
    build TEXT,  -- e.g., 'stocky', 'athletic'
    conformation_notes TEXT
);
CREATE TRIGGER trig_horse_biometric_profile_updated_at BEFORE UPDATE ON horse_biometric_profile FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_horse_biometric_profile_horse_id ON horse_biometric_profile(horse_id);

CREATE TABLE IF NOT EXISTS horse_pedigree (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    sire_id INTEGER REFERENCES horses(id),  -- Recursive for tree structure
    dam_id INTEGER REFERENCES horses(id),
    grandsire_id INTEGER REFERENCES horses(id),
    granddam_id INTEGER REFERENCES horses(id),
    full_lineage JSONB  -- Multi-gen tree (e.g., {'generations': [{'sire': {...}}]}) for graph efficiency
);
CREATE TRIGGER trig_horse_pedigree_updated_at BEFORE UPDATE ON horse_pedigree FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_horse_pedigree_horse_id ON horse_pedigree(horse_id);
CREATE INDEX idx_horse_pedigree_full_lineage ON horse_pedigree USING GIN (full_lineage);

CREATE TABLE IF NOT EXISTS horse_ownership_history (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    owner_id INTEGER REFERENCES users(id) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    transfer_reason TEXT  -- e.g., 'sale', 'gift' for audit trails
);
CREATE TRIGGER trig_horse_ownership_history_updated_at BEFORE UPDATE ON horse_ownership_history FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_horse_ownership_history_horse_id ON horse_ownership_history(horse_id);

CREATE TABLE IF NOT EXISTS horse_location_history (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    facility_id INTEGER REFERENCES facility_registry(id) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    move_reason TEXT  -- e.g., 'haul', 'event' for adjacency tracking
);
CREATE TRIGGER trig_horse_location_history_updated_at BEFORE UPDATE ON horse_location_history FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_horse_location_history_horse_id ON horse_location_history(horse_id);

CREATE TABLE IF NOT EXISTS providers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name TEXT NOT NULL,
    service_type TEXT NOT NULL,
    contact TEXT NOT NULL,
    business_id INTEGER REFERENCES businesses(id) ON DELETE SET NULL,
    rating DECIMAL(3,2)  -- For reputation in adjacents
);
CREATE TRIGGER trig_providers_updated_at BEFORE UPDATE ON providers FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_providers_service_type ON providers(service_type);

CREATE TABLE IF NOT EXISTS international_entities (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    type TEXT NOT NULL,
    currency TEXT DEFAULT 'USD',
    trade_compliance_status TEXT  -- For global takeover (e.g., 'approved')
) PARTITION BY LIST (country);  -- Scalability for adjacents like international ag/tourism
CREATE TRIGGER trig_international_entities_updated_at BEFORE UPDATE ON international_entities FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_international_entities_country ON international_entities(country);

CREATE TABLE IF NOT EXISTS supplier_networks (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    supplier_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    product_type TEXT NOT NULL,  -- e.g., 'feed' for ag adjacent
    region TEXT NOT NULL,
    tier INTEGER NOT NULL CHECK (tier IN (1, 2)),  -- 1: direct, 2: secondary for chains
    adjacency_type TEXT CHECK (adjacency_type IN ('agribusiness', 'tourism', 'other'))  -- Explicit for overview
);
CREATE TRIGGER trig_supplier_networks_updated_at BEFORE UPDATE ON supplier_networks FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_supplier_networks_supplier_id ON supplier_networks(supplier_id);
CREATE INDEX idx_supplier_networks_adjacency_type ON supplier_networks(adjacency_type);

CREATE TABLE IF NOT EXISTS affiliate_entities (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    affiliate_id INTEGER,  -- REFERENCES users(id) or businesses(id) – use CHECK or trigger for flexibility
    type TEXT NOT NULL,
    contact TEXT NOT NULL,
    influence_score DECIMAL(3,2),
    adjacency_links JSONB  -- For 2-degree tourism/ag ties
);
CREATE TRIGGER trig_affiliate_entities_updated_at BEFORE UPDATE ON affiliate_entities FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_affiliate_entities_type ON affiliate_entities(type);

CREATE TABLE IF NOT EXISTS wild_horse_populations (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    location TEXT NOT NULL,
    count INTEGER NOT NULL CHECK (count >= 0),
    genetics JSONB,  -- For biotech adjacents
    agency_id TEXT,
    ai_generated BOOLEAN DEFAULT FALSE  -- For synthetic data in ML training
);
CREATE TRIGGER trig_wild_horse_populations_updated_at BEFORE UPDATE ON wild_horse_populations FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_wild_horse_populations_location ON wild_horse_populations USING GIN (location);

CREATE TABLE IF NOT EXISTS equine_tourism_entities (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    service TEXT NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity >= 0),
    booking_capacity INTEGER DEFAULT 0  -- For tourism adjacent revenue tracking
);
CREATE TRIGGER trig_equine_tourism_entities_updated_at BEFORE UPDATE ON equine_tourism_entities FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_equine_tourism_entities_location ON equine_tourism_entities(location);

CREATE TABLE IF NOT EXISTS real_estate_assets (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    property_id TEXT UNIQUE NOT NULL,
    location TEXT NOT NULL,
    value DECIMAL(12,2) NOT NULL,
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    equine_suitability TEXT,  -- For adjacents (e.g., 'ag-farm compatible')
    value_history JSONB  -- Time-series for economic predictions
);
CREATE TRIGGER trig_real_estate_assets_updated_at BEFORE UPDATE ON real_estate_assets FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_real_estate_assets_location ON real_estate_assets(location);
CREATE INDEX idx_real_estate_assets_value_history ON real_estate_assets USING GIN (value_history);



