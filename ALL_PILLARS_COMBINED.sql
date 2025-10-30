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
-- Pillar 2: Horse Condition, Health, Prep, Legal – Assumes Pillar 1 tables exist (e.g., horses, users, providers).
-- Precision: Granular scores/decimals, ENUM checks. Scalability: Partitioning on logs. AI: Vectors for anomaly detection. Adjacents: Environmental impacts for ag, therapy for tourism.

CREATE TABLE IF NOT EXISTS horse_care_log (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    treatment_type TEXT NOT NULL CHECK (treatment_type IN ('injection', 'ulcer_meds', 'farrier', 'supplements', 'conditioning_ride', 'other')),
    details TEXT,  -- e.g., 'Dosage: 500mg'
    provider_id INTEGER REFERENCES providers(id) ON DELETE SET NULL,
    cost DECIMAL(10,2),  -- For money adjacency
    ai_generated BOOLEAN DEFAULT FALSE  -- Synthetic for ML training
) PARTITION BY RANGE (date);  -- Scale for high-volume logs
CREATE TRIGGER trig_horse_care_log_updated_at BEFORE UPDATE ON horse_care_log FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_horse_care_log_horse_id ON horse_care_log(horse_id);
CREATE INDEX idx_horse_care_log_date ON horse_care_log(date);

CREATE TABLE IF NOT EXISTS run_health_context (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    run_id TEXT NOT NULL UNIQUE,  -- Future link to Pillar 5
    soreness DECIMAL(3,1) CHECK (soreness BETWEEN 0 AND 10),
    fatigue DECIMAL(3,1) CHECK (fatigue BETWEEN 0 AND 10),
    heat_cycle TEXT CHECK (heat_cycle IN ('in_heat', 'post_heat', 'none')),
    rest_days INTEGER CHECK (rest_days >= 0),
    haul_stress TEXT,  -- e.g., 'high' for logistics adjacency
    hrv DECIMAL(5,2)  -- Heart rate variability for precision vitals
);
CREATE TRIGGER trig_run_health_context_updated_at BEFORE UPDATE ON run_health_context FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_run_health_context_horse_id ON run_health_context(horse_id);

CREATE TABLE IF NOT EXISTS horse_condition_flags (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    flag_type TEXT NOT NULL CHECK (flag_type IN ('chronic_sore_stifle', 'bleeder', 'in_foal', 'do_not_long_haul', 'other')),
    description TEXT NOT NULL,
    severity INTEGER NOT NULL CHECK (severity BETWEEN 1 AND 5),
    active BOOLEAN DEFAULT TRUE,
    last_review_date DATE
);
CREATE TRIGGER trig_horse_condition_flags_updated_at BEFORE UPDATE ON horse_condition_flags FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_horse_condition_flags_horse_id ON horse_condition_flags(horse_id);
CREATE INDEX idx_horse_condition_flags_flag_type ON horse_condition_flags(flag_type);

CREATE TABLE IF NOT EXISTS health_clearance_events (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    clearance_type TEXT NOT NULL CHECK (clearance_type IN ('haul_approved', 'breeding_approved', 'no_breeding', 'rehab_only', 'other')),
    vet_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    validity_window INTERVAL  -- e.g., '6 months' for regulatory tie-in
);
CREATE TRIGGER trig_health_clearance_events_updated_at BEFORE UPDATE ON health_clearance_events FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_health_clearance_events_horse_id ON health_clearance_events(horse_id);

CREATE TABLE IF NOT EXISTS compliance_documents (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    doc_type TEXT NOT NULL CHECK (doc_type IN ('coggins', 'health_cert', 'brand_inspection', 'breeding_contract', 'other')),
    file_url TEXT NOT NULL,
    expiry_date DATE NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    blockchain_hash TEXT  -- For tamper-proof (Elon-style provenance)
);
CREATE TRIGGER trig_compliance_documents_updated_at BEFORE UPDATE ON compliance_documents FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_compliance_documents_horse_id ON compliance_documents(horse_id);
CREATE INDEX idx_compliance_documents_expiry_date ON compliance_documents(expiry_date);

CREATE TABLE IF NOT EXISTS regulatory_events (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    region TEXT NOT NULL,
    rule_type TEXT NOT NULL CHECK (rule_type IN ('coggins_validity', 'brand_inspection', 'transport_laws', 'other')),
    effective_date DATE NOT NULL,
    description TEXT NOT NULL,
    adjacency_impact TEXT  -- e.g., 'ag_feed_reg' for adjacent overview
);
CREATE TRIGGER trig_regulatory_events_updated_at BEFORE UPDATE ON regulatory_events FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_regulatory_events_region ON regulatory_events(region);

CREATE TABLE IF NOT EXISTS horse_claims (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    claim_type TEXT NOT NULL CHECK (claim_type IN ('injury', 'illness', 'other')),
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'denied')),
    amount DECIMAL(10,2)
);
CREATE TRIGGER trig_horse_claims_updated_at BEFORE UPDATE ON horse_claims FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_horse_claims_horse_id ON horse_claims(horse_id);

CREATE TABLE IF NOT EXISTS genomic_profiles (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    dna_sequence_url TEXT,
    risk_factors JSONB NOT NULL,  -- e.g., {'HYPP': 'positive', 'PSSM': 'negative'}
    genetic_markers JSONB,
    breeding_value_score DECIMAL(5,2)  -- For Pillar 6 tie-in
);
CREATE TRIGGER trig_genomic_profiles_updated_at BEFORE UPDATE ON genomic_profiles FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_genomic_profiles_horse_id ON genomic_profiles(horse_id);
CREATE INDEX idx_genomic_profiles_risk_factors ON genomic_profiles USING GIN (risk_factors);

CREATE TABLE IF NOT EXISTS environmental_exposures (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    exposure_type TEXT NOT NULL CHECK (exposure_type IN ('pollution', 'heat_stress', 'drought', 'other')),  -- Ag adjacent (droughts)
    date DATE NOT NULL,
    impact_score DECIMAL(3,1) CHECK (impact_score BETWEEN 0 AND 10),
    mitigation_notes TEXT,
    adjacency_ripple TEXT  -- e.g., 'ag_feed_shortage_tourism_cancel'
);
CREATE TRIGGER trig_environmental_exposures_updated_at BEFORE UPDATE ON environmental_exposures FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_environmental_exposures_horse_id ON environmental_exposures(horse_id);

CREATE TABLE IF NOT EXISTS insurance_records (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    policy_number TEXT UNIQUE NOT NULL,
    coverage_type TEXT NOT NULL CHECK (coverage_type IN ('mortality', 'major_medical', 'liability', 'other')),
    premium DECIMAL(10,2) NOT NULL,
    claim_history JSONB,  -- Array of past claims
    insurer_name TEXT
);
CREATE TRIGGER trig_insurance_records_updated_at BEFORE UPDATE ON insurance_records FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_insurance_records_horse_id ON insurance_records(horse_id);

CREATE TABLE IF NOT EXISTS euthanasia_records (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    reason TEXT NOT NULL CHECK (reason IN ('injury', 'illness', 'age', 'other')),
    qol_score DECIMAL(3,1) CHECK (qol_score BETWEEN 0 AND 10),  -- Quality of life metric
    vet_id INTEGER REFERENCES users(id),
    ethical_review TEXT  -- For Pillar 14 tie-in
);
CREATE TRIGGER trig_euthanasia_records_updated_at BEFORE UPDATE ON euthanasia_records FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_euthanasia_records_horse_id ON euthanasia_records(horse_id);

CREATE TABLE IF NOT EXISTS therapy_outcomes (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    session_date DATE NOT NULL,
    outcome_score DECIMAL(3,1) CHECK (outcome_score BETWEEN 0 AND 10),
    human_interaction_notes TEXT,
    stress_level DECIMAL(3,1) CHECK (stress_level BETWEEN 0 AND 10),
    tourism_link BOOLEAN DEFAULT FALSE  -- Flag for tourism adjacency (e.g., public sessions)
);
CREATE TRIGGER trig_therapy_outcomes_updated_at BEFORE UPDATE ON therapy_outcomes FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_therapy_outcomes_horse_id ON therapy_outcomes(horse_id);
-- Phase 3: Pillars 5-8 – Assumes Phases 1-2 tables exist (e.g., horses, users, providers).
-- Precision: ENUMs/decimals for metrics. Scalability: Partitioning on dates. AI: Vectors for predictions. Adjacents: Impacts/links for ag/tourism.

-- Pillar 5: Competition, Run Context, Results – Advanced tracking with spectator betting for tourism adjacency.

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name TEXT NOT NULL,
    date DATE NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('show', 'jackpot', 'futurity', 'rodeo', 'other')),  -- e.g., 'futurity short-go'
    discipline TEXT,  -- e.g., 'barrel_racing', 'roping'
    pressure_level TEXT CHECK (pressure_level IN ('low', 'medium', 'high')),  -- For performance analysis
    tourism_event_link BOOLEAN DEFAULT FALSE  -- Flag for adjacency (e.g., public spectator events)
) PARTITION BY RANGE (date);  -- Scale for global events
CREATE TRIGGER trig_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_type ON events(type);

CREATE TABLE IF NOT EXISTS run_attempts (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    rider_id INTEGER REFERENCES users(id) ON DELETE SET NULL NOT NULL,
    time DECIMAL(6,3),  -- e.g., seconds for precision
    score DECIMAL(5,2),
    penalties TEXT,  -- e.g., 'knockdown'
    money_won DECIMAL(10,2),
    round TEXT  -- e.g., 'short_go'
);
CREATE TRIGGER trig_run_attempts_updated_at BEFORE UPDATE ON run_attempts FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_run_attempts_horse_id ON run_attempts(horse_id);
CREATE INDEX idx_run_attempts_event_id ON run_attempts(event_id);

CREATE TABLE IF NOT EXISTS run_conditions (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    run_id INTEGER REFERENCES run_attempts(id) ON DELETE CASCADE NOT NULL,
    arena_surface TEXT NOT NULL,  -- e.g., 'sand'
    drag_pattern TEXT,
    pattern_size TEXT,  -- e.g., 'barrel_distances'
    footing_freshness DECIMAL(3,1) CHECK (footing_freshness BETWEEN 0 AND 10),
    weather TEXT,
    altitude DECIMAL(6,1),
    region TEXT
);
CREATE TRIGGER trig_run_conditions_updated_at BEFORE UPDATE ON run_conditions FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_run_conditions_run_id ON run_conditions(run_id);

CREATE TABLE IF NOT EXISTS discipline_metrics (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    discipline_type TEXT NOT NULL,
    elite_time DECIMAL(6,3),  -- Baseline for 'elite'
    elite_score DECIMAL(5,2),
    level TEXT  -- e.g., '4yo_futurity', 'finished_rope'
);
CREATE TRIGGER trig_discipline_metrics_updated_at BEFORE UPDATE ON discipline_metrics FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_discipline_metrics_type ON discipline_metrics(discipline_type);

CREATE TABLE IF NOT EXISTS horse_performance_summary (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    lte DECIMAL(12,2) NOT NULL,  -- Lifetime earnings
    top_wins JSONB,  -- Array of wins
    consistency DECIMAL(5,2) CHECK (consistency BETWEEN 0 AND 100),
    pressure_proven BOOLEAN DEFAULT FALSE
);
CREATE TRIGGER trig_horse_performance_summary_updated_at BEFORE UPDATE ON horse_performance_summary FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_horse_performance_summary_horse_id ON horse_performance_summary(horse_id);

CREATE TABLE IF NOT EXISTS horse_event_entries (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('entered', 'completed', 'withdrawn')),
    entry_fee DECIMAL(10,2)
);
CREATE TRIGGER trig_horse_event_entries_updated_at BEFORE UPDATE ON horse_event_entries FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_horse_event_entries_horse_id ON horse_event_entries(horse_id);

CREATE TABLE IF NOT EXISTS international_comps (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    scoring_norm TEXT NOT NULL,  -- e.g., 'FEI standards'
    international_level TEXT  -- e.g., 'Olympic'
);
CREATE TRIGGER trig_international_comps_updated_at BEFORE UPDATE ON international_comps FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_international_comps_event_id ON international_comps(event_id);

CREATE TABLE IF NOT EXISTS spectator_analytics (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    crowd_size INTEGER CHECK (crowd_size >= 0),
    betting_volume DECIMAL(12,2),
    engagement_score DECIMAL(3,1)  -- Tourism adjacent metric
);
CREATE TRIGGER trig_spectator_analytics_updated_at BEFORE UPDATE ON spectator_analytics FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_spectator_analytics_event_id ON spectator_analytics(event_id);

CREATE TABLE IF NOT EXISTS outcome_predictions (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    odds DECIMAL(5,2),
    prediction_embedding VECTOR(384),  -- For ML similarity
    confidence DECIMAL(5,4) CHECK (confidence BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_outcome_predictions_updated_at BEFORE UPDATE ON outcome_predictions FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_outcome_predictions_horse_id ON outcome_predictions(horse_id);
CREATE INDEX idx_outcome_predictions_embedding ON outcome_predictions USING hnsw (prediction_embedding vector_cosine_ops);

CREATE TABLE IF NOT EXISTS global_event_standards (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    standard_type TEXT NOT NULL,  -- e.g., 'FEI', 'Olympic'
    description TEXT NOT NULL,
    scoring_baseline JSONB  -- For cross-discipline
);
CREATE TRIGGER trig_global_event_standards_updated_at BEFORE UPDATE ON global_event_standards FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_global_event_standards_type ON global_event_standards(standard_type);

-- Pillar 6: Bloodlines, Programs, Breeding Value – Advanced genomics with COI, biotech for $100B subsector.

CREATE TABLE IF NOT EXISTS bloodline_event_stats (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    bloodline_id TEXT NOT NULL,  -- Link to pedigree
    event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
    performance_score DECIMAL(5,2),
    win_percentage DECIMAL(5,2) CHECK (win_percentage BETWEEN 0 AND 100)
);
CREATE TRIGGER trig_bloodline_event_stats_updated_at BEFORE UPDATE ON bloodline_event_stats FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_bloodline_event_stats_bloodline_id ON bloodline_event_stats(bloodline_id);

CREATE TABLE IF NOT EXISTS producer_programs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name TEXT NOT NULL,
    breeder_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    type TEXT NOT NULL,  -- e.g., 'futurity_colts'
    output_quality DECIMAL(3,1) CHECK (output_quality BETWEEN 0 AND 10)
);
CREATE TRIGGER trig_producer_programs_updated_at BEFORE UPDATE ON producer_programs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_producer_programs_name ON producer_programs(name);

CREATE TABLE IF NOT EXISTS producer_program_health (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    program_id INTEGER REFERENCES producer_programs(id) ON DELETE CASCADE NOT NULL,
    trend TEXT NOT NULL,  -- e.g., 'peaking', 'fading'
    demand_level DECIMAL(5,2),
    burnout_risk DECIMAL(3,1) CHECK (burnout_risk BETWEEN 0 AND 10)
);
CREATE TRIGGER trig_producer_program_health_updated_at BEFORE UPDATE ON producer_program_health FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_producer_program_health_program_id ON producer_program_health(program_id);

CREATE TABLE IF NOT EXISTS stallion_market_signal (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    stallion_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    demand_trend TEXT NOT NULL,  -- e.g., 'surging_Oklahoma'
    verified_fee DECIMAL(10,2),
    inquiry_velocity INTEGER,  -- Per month
    market_sentiment TEXT
);
CREATE TRIGGER trig_stallion_market_signal_updated_at BEFORE UPDATE ON stallion_market_signal FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_stallion_market_signal_stallion_id ON stallion_market_signal(stallion_id);

CREATE TABLE IF NOT EXISTS program_enrollment (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    program_id INTEGER REFERENCES producer_programs(id) ON DELETE CASCADE NOT NULL,
    enrollment_date DATE
);
CREATE TRIGGER trig_program_enrollment_updated_at BEFORE UPDATE ON program_enrollment FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_program_enrollment_horse_id ON program_enrollment(horse_id);

CREATE TABLE IF NOT EXISTS horse_offspring (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    offspring_id INTEGER REFERENCES horses(id) NOT NULL
);
CREATE TRIGGER trig_horse_offspring_updated_at BEFORE UPDATE ON horse_offspring FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_horse_offspring_horse_id ON horse_offspring(horse_id);

CREATE TABLE IF NOT EXISTS horse_offspring_stats (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    offspring_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    earnings DECIMAL(12,2),
    money_earners_percentage DECIMAL(5,2) CHECK (money_earners_percentage BETWEEN 0 AND 100),
    win_locations JSONB  -- e.g., array of regions
);
CREATE TRIGGER trig_horse_offspring_stats_updated_at BEFORE UPDATE ON horse_offspring_stats FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_horse_offspring_stats_offspring_id ON horse_offspring_stats(offspring_id);

CREATE TABLE IF NOT EXISTS breeding_contracts (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    mare_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    stallion_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    terms TEXT NOT NULL,
    signed_date DATE,
    blockchain_hash TEXT  -- Provenance for legal precision
);
CREATE TRIGGER trig_breeding_contracts_updated_at BEFORE UPDATE ON breeding_contracts FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_breeding_contracts_mare_id ON breeding_contracts(mare_id);

CREATE TABLE IF NOT EXISTS semen_shipments (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    shipment_id TEXT UNIQUE NOT NULL,
    date DATE NOT NULL,
    destination TEXT NOT NULL,
    type TEXT CHECK (type IN ('cooled', 'frozen')),
    tracking_code TEXT
);
CREATE TRIGGER trig_semen_shipments_updated_at BEFORE UPDATE ON semen_shipments FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_semen_shipments_date ON semen_shipments(date);

CREATE TABLE IF NOT EXISTS horse_value_history (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    value DECIMAL(12,2) NOT NULL,
    source TEXT  -- e.g., 'auction', 'appraisal'
);
CREATE TRIGGER trig_horse_value_history_updated_at BEFORE UPDATE ON horse_value_history FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_horse_value_history_horse_id ON horse_value_history(horse_id);

CREATE TABLE IF NOT EXISTS biotech_interventions (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('IVF', 'cloning', 'other')),
    date DATE NOT NULL,
    outcome TEXT
);
CREATE TRIGGER trig_biotech_interventions_updated_at BEFORE UPDATE ON biotech_interventions FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_biotech_interventions_horse_id ON biotech_interventions(horse_id);

CREATE TABLE IF NOT EXISTS pedigree_networks (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    node_type TEXT NOT NULL,  -- e.g., 'sire', 'dam'
    relation_type TEXT NOT NULL,
    coi DECIMAL(5,4) CHECK (coi BETWEEN 0 AND 1)  -- Coefficient of inbreeding for precision
);
CREATE TRIGGER trig_pedigree_networks_updated_at BEFORE UPDATE ON pedigree_networks FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_pedigree_networks_horse_id ON pedigree_networks(horse_id);

CREATE TABLE IF NOT EXISTS market_forecasts (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    breed_type TEXT NOT NULL,
    supply_forecast DECIMAL(10,2),
    demand_forecast DECIMAL(10,2),
    adjacency_impact TEXT  -- e.g., 'ag_feed_price_rise'
);
CREATE TRIGGER trig_market_forecasts_updated_at BEFORE UPDATE ON market_forecasts FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_market_forecasts_breed_type ON market_forecasts(breed_type);

CREATE TABLE IF NOT EXISTS advanced_biotech_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    log_entry TEXT NOT NULL,
    date DATE NOT NULL,
    crispr_details JSONB  -- e.g., {'edit': 'HYPP_gene'}
);
CREATE TRIGGER trig_advanced_biotech_logs_updated_at BEFORE UPDATE ON advanced_biotech_logs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_advanced_biotech_logs_horse_id ON advanced_biotech_logs(horse_id);

CREATE TABLE IF NOT EXISTS genetic_diversity_metrics (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    bloodline_id TEXT NOT NULL,
    diversity_score DECIMAL(5,4) CHECK (diversity_score BETWEEN 0 AND 1),
    inbreeding_risk TEXT,
    ag_impact TEXT  -- e.g., 'feed_efficiency_from_diversity'
);
CREATE TRIGGER trig_genetic_diversity_metrics_updated_at BEFORE UPDATE ON genetic_diversity_metrics FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_genetic_diversity_metrics_bloodline_id ON genetic_diversity_metrics(bloodline_id);

-- Pillar 7: Transport, Boarding, Care Logistics – Advanced with IoT, risk factors for $20B+ subsector.

CREATE TABLE IF NOT EXISTS service_requests (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('haul', 'layup', 'mare_care', 'rehab', 'other')),
    details TEXT NOT NULL,
    urgency TEXT CHECK (urgency IN ('low', 'medium', 'high', 'emergency'))
);
CREATE TRIGGER trig_service_requests_updated_at BEFORE UPDATE ON service_requests FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_service_requests_user_id ON service_requests(user_id);

CREATE TABLE IF NOT EXISTS match_candidates (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    request_id INTEGER REFERENCES service_requests(id) ON DELETE CASCADE NOT NULL,
    provider_id INTEGER REFERENCES providers(id) NOT NULL,
    match_score DECIMAL(5,4) CHECK (match_score BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_match_candidates_updated_at BEFORE UPDATE ON match_candidates FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_match_candidates_request_id ON match_candidates(request_id);

CREATE TABLE IF NOT EXISTS provider_claims (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    provider_id INTEGER REFERENCES providers(id) ON DELETE CASCADE NOT NULL,
    quote_details TEXT NOT NULL,  -- e.g., '$1100 Amarillo to Tulsa'
    date DATE NOT NULL,
    insured BOOLEAN DEFAULT TRUE
);
CREATE TRIGGER trig_provider_claims_updated_at BEFORE UPDATE ON provider_claims FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_provider_claims_provider_id ON provider_claims(provider_id);

CREATE TABLE IF NOT EXISTS quotes_to_user (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    request_id INTEGER REFERENCES service_requests(id) ON DELETE CASCADE NOT NULL,
    quote_options JSONB NOT NULL  -- Array of quotes
);
CREATE TRIGGER trig_quotes_to_user_updated_at BEFORE UPDATE ON quotes_to_user FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_quotes_to_user_request_id ON quotes_to_user(request_id);

CREATE TABLE IF NOT EXISTS haul_lanes (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    hauler_id INTEGER REFERENCES providers(id) ON DELETE CASCADE NOT NULL,
    route_from TEXT NOT NULL,
    route_to TEXT NOT NULL,
    typical_rate DECIMAL(10,2),
    air_ride BOOLEAN DEFAULT TRUE
);
CREATE TRIGGER trig_haul_lanes_updated_at BEFORE UPDATE ON haul_lanes FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_haul_lanes_hauler_id ON haul_lanes(hauler_id);

CREATE TABLE IF NOT EXISTS haul_assignments (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    haul_id TEXT UNIQUE NOT NULL,
    hauler_id INTEGER REFERENCES providers(id) ON DELETE SET NULL NOT NULL,
    date DATE NOT NULL,
    status TEXT CHECK (status IN ('assigned', 'completed', 'canceled'))
);
CREATE TRIGGER trig_haul_assignments_updated_at BEFORE UPDATE ON haul_assignments FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_haul_assignments_hauler_id ON haul_assignments(hauler_id);

CREATE TABLE IF NOT EXISTS haul_segments (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    haul_id INTEGER REFERENCES haul_assignments(id) ON DELETE CASCADE NOT NULL,
    start_facility_id INTEGER REFERENCES facility_registry(id) NOT NULL,
    end_facility_id INTEGER REFERENCES facility_registry(id) NOT NULL,
    distance DECIMAL(10,2),
    stress_level TEXT,  -- e.g., 'high' for safety tie-in
    layover BOOLEAN DEFAULT FALSE
);
CREATE TRIGGER trig_haul_segments_updated_at BEFORE UPDATE ON haul_segments FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_haul_segments_haul_id ON haul_segments(haul_id);

CREATE TABLE IF NOT EXISTS aftercare_pings (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    service_id INTEGER REFERENCES service_requests(id) ON DELETE CASCADE NOT NULL,
    ping_date DATE NOT NULL,
    feedback TEXT,
    satisfaction_score DECIMAL(3,1) CHECK (satisfaction_score BETWEEN 0 AND 10)
);
CREATE TRIGGER trig_aftercare_pings_updated_at BEFORE UPDATE ON aftercare_pings FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_aftercare_pings_service_id ON aftercare_pings(service_id);

CREATE TABLE IF NOT EXISTS provider_feedback (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    provider_id INTEGER REFERENCES providers(id) ON DELETE CASCADE NOT NULL,
    rating DECIMAL(3,1) CHECK (rating BETWEEN 0 AND 10),
    comment TEXT,
    safety_score DECIMAL(3,1)
);
CREATE TRIGGER trig_provider_feedback_updated_at BEFORE UPDATE ON provider_feedback FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_provider_feedback_provider_id ON provider_feedback(provider_id);

CREATE TABLE IF NOT EXISTS service_request_updates (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    request_id INTEGER REFERENCES service_requests(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('created', 'matching', 'quoted', 'booked', 'completed', 'dispute')),
    timestamp TIMESTAMP NOT NULL,
    notes TEXT
);
CREATE TRIGGER trig_service_request_updates_updated_at BEFORE UPDATE ON service_request_updates FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_service_request_updates_request_id ON service_request_updates(request_id);

CREATE TABLE IF NOT EXISTS sustainability_metrics (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    service_id INTEGER REFERENCES service_requests(id) ON DELETE CASCADE NOT NULL,
    carbon_footprint DECIMAL(10,2),
    fuel_efficiency DECIMAL(5,2),
    ag_impact TEXT  -- e.g., 'low_emission_hauler'
);
CREATE TRIGGER trig_sustainability_metrics_updated_at BEFORE UPDATE ON sustainability_metrics FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_sustainability_metrics_service_id ON sustainability_metrics(service_id);

CREATE TABLE IF NOT EXISTS iot_tracking (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    device_id TEXT NOT NULL,
    haul_id INTEGER REFERENCES haul_assignments(id) ON DELETE CASCADE,
    location JSONB NOT NULL,  -- Real-time geo
    timestamp TIMESTAMP NOT NULL,
    status TEXT,  -- e.g., 'in_transit'
    failure_risk DECIMAL(3,1)  -- Predicted from sensors
);
CREATE TRIGGER trig_iot_tracking_updated_at BEFORE UPDATE ON iot_tracking FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_iot_tracking_haul_id ON iot_tracking(haul_id);
CREATE INDEX idx_iot_tracking_timestamp ON iot_tracking(timestamp);

CREATE TABLE IF NOT EXISTS affiliate_logistics (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    affiliate_id INTEGER REFERENCES affiliate_entities(id) ON DELETE CASCADE NOT NULL,
    service_type TEXT NOT NULL,
    partner_link TEXT  -- For tourism/ag adjacents
);
CREATE TRIGGER trig_affiliate_logistics_updated_at BEFORE UPDATE ON affiliate_logistics FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_affiliate_logistics_affiliate_id ON affiliate_logistics(affiliate_id);

CREATE TABLE IF NOT EXISTS international_trade_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    trade_id TEXT UNIQUE NOT NULL,
    from_country TEXT NOT NULL,
    to_country TEXT NOT NULL,
    tariffs DECIMAL(10,2),
    quarantine_days INTEGER,
    biosecurity_status TEXT
);
CREATE TRIGGER trig_international_trade_logs_updated_at BEFORE UPDATE ON international_trade_logs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_international_trade_logs_from_country ON international_trade_logs(from_country);

CREATE TABLE IF NOT EXISTS tourism_logistics (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tour_id TEXT NOT NULL,
    shuttle_details TEXT NOT NULL,
    capacity INTEGER CHECK (capacity >= 0),
    event_link INTEGER REFERENCES events(id)  -- Tourism adjacency
);
CREATE TRIGGER trig_tourism_logistics_updated_at BEFORE UPDATE ON tourism_logistics FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_tourism_logistics_tour_id ON tourism_logistics(tour_id);

-- Pillar 8: Safety, Risk, Legal, Disputes – Advanced with injury DBs, quantum risks for edge cases.

CREATE TABLE IF NOT EXISTS risk_assessment (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    request_id INTEGER REFERENCES service_requests(id) ON DELETE CASCADE,
    risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
    reason TEXT NOT NULL,
    quantum_risk_score DECIMAL(5,4)  -- Overkill for probabilistic edges (Pillar 26 tie-in)
);
CREATE TRIGGER trig_risk_assessment_updated_at BEFORE UPDATE ON risk_assessment FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_risk_assessment_request_id ON risk_assessment(request_id);

CREATE TABLE IF NOT EXISTS safety_flags (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    entity_id INTEGER NOT NULL,  -- REFERENCES horses/users/businesses (use type for flexibility)
    entity_type TEXT NOT NULL CHECK (entity_type IN ('horse', 'user', 'business', 'facility')),
    flag_type TEXT NOT NULL,  -- e.g., 'abuse_report', 'transport_injury'
    description TEXT
);
CREATE TRIGGER trig_safety_flags_updated_at BEFORE UPDATE ON safety_flags FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_safety_flags_entity_id ON safety_flags(entity_id);

CREATE TABLE IF NOT EXISTS clinic_health (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    clinic_id INTEGER REFERENCES facility_registry(id) ON DELETE CASCADE NOT NULL,
    emergency_response_score DECIMAL(3,1) CHECK (emergency_response_score BETWEEN 0 AND 10),
    mare_outcome_score DECIMAL(3,1) CHECK (mare_outcome_score BETWEEN 0 AND 10),
    burnout_count INTEGER,
    incident_count INTEGER
);
CREATE TRIGGER trig_clinic_health_updated_at BEFORE UPDATE ON clinic_health FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_clinic_health_clinic_id ON clinic_health(clinic_id);

CREATE TABLE IF NOT EXISTS escalations (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    job_id TEXT NOT NULL,  -- Link to requests/hauls
    reason TEXT NOT NULL,  -- e.g., 'injury', 'legal_threat'
    handoff_to_human DATE NOT NULL
);
CREATE TRIGGER trig_escalations_updated_at BEFORE UPDATE ON escalations FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_escalations_job_id ON escalations(job_id);

CREATE TABLE IF NOT EXISTS disputes (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    dispute_type TEXT NOT NULL CHECK (dispute_type IN ('injury', 'overbilling', 'misrep', 'unsafe', 'other')),
    parties_involved JSONB NOT NULL,
    resolution TEXT,
    date DATE NOT NULL
);
CREATE TRIGGER trig_disputes_updated_at BEFORE UPDATE ON disputes FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_disputes_date ON disputes(date);

CREATE TABLE IF NOT EXISTS forensic_audits (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    incident_id TEXT NOT NULL,
    findings TEXT NOT NULL,
    reconstruction JSONB  -- e.g., timeline
);
CREATE TRIGGER trig_forensic_audits_updated_at BEFORE UPDATE ON forensic_audits FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_forensic_audits_incident_id ON forensic_audits(incident_id);

CREATE TABLE IF NOT EXISTS regulatory_updates (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_id TEXT UNIQUE NOT NULL,
    law_change TEXT NOT NULL,
    impact_on_adjacents TEXT  -- e.g., 'ag_vet_regs'
);
CREATE TRIGGER trig_regulatory_updates_updated_at BEFORE UPDATE ON regulatory_updates FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_regulatory_updates_update_id ON regulatory_updates(update_id);

CREATE TABLE IF NOT EXISTS insurance_integrations (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    policy_id TEXT NOT NULL,
    claim_status TEXT NOT NULL,
    auto_file BOOLEAN DEFAULT FALSE
);
CREATE TRIGGER trig_insurance_integrations_updated_at BEFORE UPDATE ON insurance_integrations FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_insurance_integrations_policy_id ON insurance_integrations(policy_id);

CREATE TABLE IF NOT EXISTS ai_ethical_audits (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_id TEXT UNIQUE NOT NULL,
    findings TEXT NOT NULL,
    tech_footprint DECIMAL(10,2),  -- e.g., carbon from compute
    compliance_score DECIMAL(3,1)
);
CREATE TRIGGER trig_ai_ethical_audits_updated_at BEFORE UPDATE ON ai_ethical_audits FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_ai_ethical_audits_audit_id ON ai_ethical_audits(audit_id);
-- Phase 4: Pillars 9-12 – Assumes Phases 1-3 tables exist (e.g., businesses, users).
-- Precision: DECIMALS/scores. Scalability: Partitioning on dates. AI: Vectors for sentiment. Adjacents: Impacts for ag/tourism.

-- Pillar 9: Market Signal, Demand, Reputation – Sentiment NLP with adjacents.

CREATE TABLE IF NOT EXISTS social_mentions (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    entity_id INTEGER NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('horse', 'user', 'business')),
    mention_text TEXT NOT NULL,
    sentiment DECIMAL(5,4) CHECK (sentiment BETWEEN -1 AND 1),
    source TEXT,
    tourism_hype BOOLEAN DEFAULT FALSE
) PARTITION BY RANGE (created_at);
CREATE TRIGGER trig_social_mentions_updated_at BEFORE UPDATE ON social_mentions FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_social_mentions_entity_id ON social_mentions(entity_id);
CREATE INDEX idx_social_mentions_created_at ON social_mentions(created_at);

CREATE TABLE IF NOT EXISTS search_trends (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    query TEXT NOT NULL,
    geography TEXT NOT NULL,
    trend_value DECIMAL(10,2),
    date DATE NOT NULL,
    adjacency_trend TEXT
);
CREATE TRIGGER trig_search_trends_updated_at BEFORE UPDATE ON search_trends FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_search_trends_geography ON search_trends(geography);

CREATE TABLE IF NOT EXISTS business_financials (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    revenue DECIMAL(12,2),
    booking_volume INTEGER,
    cancellations INTEGER,
    repeat_ratio DECIMAL(5,2) CHECK (repeat_ratio BETWEEN 0 AND 100),
    period DATE NOT NULL
);
CREATE TRIGGER trig_business_financials_updated_at BEFORE UPDATE ON business_financials FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_business_financials_business_id ON business_financials(business_id);

CREATE TABLE IF NOT EXISTS business_financial_health (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    state TEXT NOT NULL CHECK (state IN ('growing', 'stable', 'collapsing')),
    cashflow_stress DECIMAL(3,1) CHECK (cashflow_stress BETWEEN 0 AND 10),
    reliability_score DECIMAL(3,1) CHECK (reliability_score BETWEEN 0 AND 10)
);
CREATE TRIGGER trig_business_financial_health_updated_at BEFORE UPDATE ON business_financial_health FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_business_financial_health_business_id ON business_financial_health(business_id);

CREATE TABLE IF NOT EXISTS business_operational_state (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('slammed', 'hungry', 'selective', 'shut_down', 'emergency_only')),
    work_willingness DECIMAL(3,1) CHECK (work_willingness BETWEEN 0 AND 10)
);
CREATE TRIGGER trig_business_operational_state_updated_at BEFORE UPDATE ON business_operational_state FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_business_operational_state_business_id ON business_operational_state(business_id);

CREATE TABLE IF NOT EXISTS business_similarity (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    business_a_id INTEGER REFERENCES businesses(id) NOT NULL,
    business_b_id INTEGER REFERENCES businesses(id) NOT NULL,
    similarity_score DECIMAL(5,4) CHECK (similarity_score BETWEEN 0 AND 1),
    similarity_embedding VECTOR(384)
);
CREATE TRIGGER trig_business_similarity_updated_at BEFORE UPDATE ON business_similarity FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_business_similarity_business_a_id ON business_similarity(business_a_id);
CREATE INDEX idx_business_similarity_embedding ON business_similarity USING hnsw (similarity_embedding vector_cosine_ops);

CREATE TABLE IF NOT EXISTS macro_indicators (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    indicator_type TEXT NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    ag_macro_impact TEXT
);
CREATE TRIGGER trig_macro_indicators_updated_at BEFORE UPDATE ON macro_indicators FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_macro_indicators_date ON macro_indicators(date);

CREATE TABLE IF NOT EXISTS competitor_analysis (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    competitor_id INTEGER REFERENCES businesses(id),
    market_share DECIMAL(5,2) CHECK (market_share BETWEEN 0 AND 100),
    strengths JSONB,
    weaknesses JSONB
);
CREATE TRIGGER trig_competitor_analysis_updated_at BEFORE UPDATE ON competitor_analysis FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_competitor_analysis_competitor_id ON competitor_analysis(competitor_id);

CREATE TABLE IF NOT EXISTS influencer_maps (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    influencer_id INTEGER REFERENCES affiliate_entities(id) ON DELETE CASCADE NOT NULL,
    connections JSONB NOT NULL,
    reach INTEGER
);
CREATE TRIGGER trig_influencer_maps_updated_at BEFORE UPDATE ON influencer_maps FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_influencer_maps_influencer_id ON influencer_maps(influencer_id);

CREATE TABLE IF NOT EXISTS ethical_consumer_trends (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    trend_type TEXT NOT NULL,
    demand_level DECIMAL(5,2),
    geography TEXT,
    tourism_ethical_focus BOOLEAN DEFAULT FALSE
);
CREATE TRIGGER trig_ethical_consumer_trends_updated_at BEFORE UPDATE ON ethical_consumer_trends FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_ethical_consumer_trends_trend_type ON ethical_consumer_trends(trend_type);

-- Pillar 10: Sales, Funnel, Growth, Outreach – CRM with viral mechanics.

CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name TEXT NOT NULL,
    source TEXT NOT NULL,
    status TEXT CHECK (status IN ('new', 'contacted', 'interested', 'onboarded'))
);
CREATE TRIGGER trig_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_leads_status ON leads(status);

CREATE TABLE IF NOT EXISTS lead_profiles (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
    offer_details TEXT NOT NULL,
    adjacency_preference TEXT
);
CREATE TRIGGER trig_lead_profiles_updated_at BEFORE UPDATE ON lead_profiles FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_lead_profiles_lead_id ON lead_profiles(lead_id);

CREATE TABLE IF NOT EXISTS contact_endpoints (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    entity_id INTEGER NOT NULL,
    email TEXT,
    phone TEXT,
    social_handle TEXT
);
CREATE TRIGGER trig_contact_endpoints_updated_at BEFORE UPDATE ON contact_endpoints FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_contact_endpoints_entity_id ON contact_endpoints(entity_id);

CREATE TABLE IF NOT EXISTS outreach_attempts (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
    method TEXT NOT NULL CHECK (method IN ('call', 'text', 'email', 'DM')),
    date DATE NOT NULL,
    response TEXT
);
CREATE TRIGGER trig_outreach_attempts_updated_at BEFORE UPDATE ON outreach_attempts FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_outreach_attempts_lead_id ON outreach_attempts(lead_id);

CREATE TABLE IF NOT EXISTS delivery_events (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    attempt_id INTEGER REFERENCES outreach_attempts(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('opened', 'bounced', 'replied', 'blocked')),
    timestamp TIMESTAMP NOT NULL
);
CREATE TRIGGER trig_delivery_events_updated_at BEFORE UPDATE ON delivery_events FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_delivery_events_attempt_id ON delivery_events(attempt_id);

CREATE TABLE IF NOT EXISTS lead_status_history (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL,
    date DATE NOT NULL
);
CREATE TRIGGER trig_lead_status_history_updated_at BEFORE UPDATE ON lead_status_history FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_lead_status_history_lead_id ON lead_status_history(lead_id);

CREATE TABLE IF NOT EXISTS conversions (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
    conversion_type TEXT NOT NULL,
    date DATE NOT NULL
);
CREATE TRIGGER trig_conversions_updated_at BEFORE UPDATE ON conversions FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_conversions_lead_id ON conversions(lead_id);

CREATE TABLE IF NOT EXISTS playbooks (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    type TEXT NOT NULL,
    description TEXT
);
CREATE TRIGGER trig_playbooks_updated_at BEFORE UPDATE ON playbooks FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_playbooks_type ON playbooks(type);

CREATE TABLE IF NOT EXISTS playbook_steps (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    playbook_id INTEGER REFERENCES playbooks(id) ON DELETE CASCADE NOT NULL,
    step_number INTEGER NOT NULL,
    message_template TEXT NOT NULL
);
CREATE TRIGGER trig_playbook_steps_updated_at BEFORE UPDATE ON playbook_steps FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_playbook_steps_playbook_id ON playbook_steps(playbook_id);

CREATE TABLE IF NOT EXISTS playbook_performance (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    playbook_id INTEGER REFERENCES playbooks(id) ON DELETE CASCADE NOT NULL,
    success_rate DECIMAL(5,2) CHECK (success_rate BETWEEN 0 AND 100),
    persona_type TEXT,
    region TEXT
);
CREATE TRIGGER trig_playbook_performance_updated_at BEFORE UPDATE ON playbook_performance FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_playbook_performance_playbook_id ON playbook_performance(playbook_id);

CREATE TABLE IF NOT EXISTS business_status_history (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL,
    date DATE NOT NULL
);
CREATE TRIGGER trig_business_status_history_updated_at BEFORE UPDATE ON business_status_history FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_business_status_history_business_id ON business_status_history(business_id);

CREATE TABLE IF NOT EXISTS entity_profiles (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    entity_id INTEGER NOT NULL,
    entity_type TEXT NOT NULL,
    opportunity_score DECIMAL(3,1) CHECK (opportunity_score BETWEEN 0 AND 10),
    risk_score DECIMAL(3,1) CHECK (risk_score BETWEEN 0 AND 10),
    summary TEXT
);
CREATE TRIGGER trig_entity_profiles_updated_at BEFORE UPDATE ON entity_profiles FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_entity_profiles_entity_id ON entity_profiles(entity_id);

CREATE TABLE IF NOT EXISTS ab_testing (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    test_id TEXT UNIQUE NOT NULL,
    variant_a TEXT NOT NULL,
    variant_b TEXT NOT NULL,
    results JSONB,
    persona_type TEXT
);
CREATE TRIGGER trig_ab_testing_updated_at BEFORE UPDATE ON ab_testing FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_ab_testing_test_id ON ab_testing(test_id);

CREATE TABLE IF NOT EXISTS partnership_affiliates (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    partner_id INTEGER NOT NULL,
    affiliate_id INTEGER NOT NULL,
    chain_level INTEGER CHECK (chain_level IN (1, 2))
);
CREATE TRIGGER trig_partnership_affiliates_updated_at BEFORE UPDATE ON partnership_affiliates FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_partnership_affiliates_partner_id ON partnership_affiliates(partner_id);

CREATE TABLE IF NOT EXISTS viral_growth_metrics (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    metric_type TEXT NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    adjacency_source TEXT
);
CREATE TRIGGER trig_viral_growth_metrics_updated_at BEFORE UPDATE ON viral_growth_metrics FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_viral_growth_metrics_date ON viral_growth_metrics(date);

CREATE TABLE IF NOT EXISTS global_partnerships (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    partner_id INTEGER NOT NULL,
    region TEXT NOT NULL,
    alliance_type TEXT,
    status TEXT
);
CREATE TRIGGER trig_global_partnerships_updated_at BEFORE UPDATE ON global_partnerships FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_global_partnerships_region ON global_partnerships(region);

-- Pillar 11: AI Brain, Action Loop, Memory – Grok-like agents with training.

CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    conversation_id TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    is_ai BOOLEAN DEFAULT TRUE
);
CREATE TRIGGER trig_chat_messages_updated_at BEFORE UPDATE ON chat_messages FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);

CREATE TABLE IF NOT EXISTS conversation_audit (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    conv_id TEXT UNIQUE NOT NULL,
    intent TEXT NOT NULL,
    payload JSONB,
    urgency TEXT,
    processed BOOLEAN DEFAULT FALSE
);
CREATE TRIGGER trig_conversation_audit_updated_at BEFORE UPDATE ON conversation_audit FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_conversation_audit_conv_id ON conversation_audit(conv_id);

CREATE TABLE IF NOT EXISTS next_best_actions (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    entity_id INTEGER NOT NULL,
    entity_type TEXT NOT NULL,
    action TEXT NOT NULL,
    urgency TEXT,
    timestamp TIMESTAMP NOT NULL
);
CREATE TRIGGER trig_next_best_actions_updated_at BEFORE UPDATE ON next_best_actions FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_next_best_actions_entity_id ON next_best_actions(entity_id);

CREATE TABLE IF NOT EXISTS knowledge_snapshots (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    entity_id INTEGER NOT NULL,
    summary TEXT NOT NULL,
    version INTEGER DEFAULT 1
);
CREATE TRIGGER trig_knowledge_snapshots_updated_at BEFORE UPDATE ON knowledge_snapshots FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_knowledge_snapshots_entity_id ON knowledge_snapshots(entity_id);

CREATE TABLE IF NOT EXISTS ai_policies (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    policy_id TEXT UNIQUE NOT NULL,
    rule TEXT NOT NULL,
    category TEXT
);
CREATE TRIGGER trig_ai_policies_updated_at BEFORE UPDATE ON ai_policies FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_ai_policies_policy_id ON ai_policies(policy_id);

CREATE TABLE IF NOT EXISTS ai_policy_overrides (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    policy_id INTEGER REFERENCES ai_policies(id) ON DELETE CASCADE NOT NULL,
    reason TEXT NOT NULL,
    override_date DATE,
    vip_case BOOLEAN DEFAULT FALSE
);
CREATE TRIGGER trig_ai_policy_overrides_updated_at BEFORE UPDATE ON ai_policy_overrides FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_ai_policy_overrides_policy_id ON ai_policy_overrides(policy_id);

CREATE TABLE IF NOT EXISTS ai_action_log (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    action_id TEXT UNIQUE NOT NULL,
    attempted TEXT NOT NULL,
    outcome TEXT,
    risk_posture TEXT
);
CREATE TRIGGER trig_ai_action_log_updated_at BEFORE UPDATE ON ai_action_log FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_ai_action_log_action_id ON ai_action_log(action_id);

CREATE TABLE IF NOT EXISTS ai_agent_sessions (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    session_id TEXT UNIQUE NOT NULL,
    mission TEXT NOT NULL,
    status TEXT CHECK (status IN ('active', 'completed'))
);
CREATE TRIGGER trig_ai_agent_sessions_updated_at BEFORE UPDATE ON ai_agent_sessions FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_ai_agent_sessions_session_id ON ai_agent_sessions(session_id);

CREATE TABLE IF NOT EXISTS model_training_events (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    event_id TEXT UNIQUE NOT NULL,
    update_type TEXT NOT NULL,
    date DATE NOT NULL
);
CREATE TRIGGER trig_model_training_events_updated_at BEFORE UPDATE ON model_training_events FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_model_training_events_event_id ON model_training_events(event_id);

CREATE TABLE IF NOT EXISTS system_kpis (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    kpi_type TEXT NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    region TEXT,
    quantum_cost_optimization DECIMAL(10,2)
);
CREATE TRIGGER trig_system_kpis_updated_at BEFORE UPDATE ON system_kpis FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_system_kpis_kpi_type ON system_kpis(kpi_type);

CREATE TABLE IF NOT EXISTS training_datasets (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    dataset_id TEXT UNIQUE NOT NULL,
    content JSONB NOT NULL,
    synthetic BOOLEAN DEFAULT FALSE
);
CREATE TRIGGER trig_training_datasets_updated_at BEFORE UPDATE ON training_datasets FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_training_datasets_dataset_id ON training_datasets(dataset_id);

CREATE TABLE IF NOT EXISTS feedback_loops (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    feedback_id TEXT UNIQUE NOT NULL,
    rating DECIMAL(3,1) CHECK (rating BETWEEN 0 AND 10),
    comment TEXT
);
CREATE TRIGGER trig_feedback_loops_updated_at BEFORE UPDATE ON feedback_loops FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_feedback_loops_feedback_id ON feedback_loops(feedback_id);

CREATE TABLE IF NOT EXISTS external_integrations (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    integration_id TEXT UNIQUE NOT NULL,
    api_type TEXT NOT NULL,
    status TEXT
);
CREATE TRIGGER trig_external_integrations_updated_at BEFORE UPDATE ON external_integrations FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_external_integrations_integration_id ON external_integrations(integration_id);

CREATE TABLE IF NOT EXISTS message_usage (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    message_id TEXT NOT NULL,
    cost DECIMAL(10,5),
    tokens_used INTEGER
);
CREATE TRIGGER trig_message_usage_updated_at BEFORE UPDATE ON message_usage FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_message_usage_message_id ON message_usage(message_id);

CREATE TABLE IF NOT EXISTS user_memory (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    memory_entry TEXT NOT NULL,
    category TEXT
);
CREATE TRIGGER trig_user_memory_updated_at BEFORE UPDATE ON user_memory FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_user_memory_user_id ON user_memory(user_id);

CREATE TABLE IF NOT EXISTS ethical_decision_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    decision_id TEXT UNIQUE NOT NULL,
    log TEXT NOT NULL,
    welfare_impact TEXT
);
CREATE TRIGGER trig_ethical_decision_logs_updated_at BEFORE UPDATE ON ethical_decision_logs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_ethical_decision_logs_decision_id ON ethical_decision_logs(decision_id);

-- Pillar 12: Money, Deals, Outcomes – Ledger with blockchain, projections for $1B+ scale.

CREATE TABLE IF NOT EXISTS deal_transactions (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deal_id TEXT UNIQUE NOT NULL,
    buyer_id INTEGER REFERENCES users(id) NOT NULL,
    provider_id INTEGER REFERENCES providers(id) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    blockchain_hash TEXT
);
CREATE TRIGGER trig_deal_transactions_updated_at BEFORE UPDATE ON deal_transactions FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_deal_transactions_buyer_id ON deal_transactions(buyer_id);

CREATE TABLE IF NOT EXISTS price_reference_history (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    service_type TEXT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    date DATE NOT NULL,
    source TEXT
);
CREATE TRIGGER trig_price_reference_history_updated_at BEFORE UPDATE ON price_reference_history FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_price_reference_history_service_type ON price_reference_history(service_type);

CREATE TABLE IF NOT EXISTS payment_gateways (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    gateway_type TEXT NOT NULL,
    transaction_id TEXT UNIQUE NOT NULL,
    status TEXT
);
CREATE TRIGGER trig_payment_gateways_updated_at BEFORE UPDATE ON payment_gateways FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_payment_gateways_transaction_id ON payment_gateways(transaction_id);

CREATE TABLE IF NOT EXISTS revenue_projections (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    projection_id TEXT UNIQUE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    date DATE NOT NULL,
    adjacency_contribution DECIMAL(15,2)
);
CREATE TRIGGER trig_revenue_projections_updated_at BEFORE UPDATE ON revenue_projections FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_revenue_projections_date ON revenue_projections(date);

CREATE TABLE IF NOT EXISTS asset_valuations (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    asset_id INTEGER NOT NULL,
    asset_type TEXT NOT NULL,
    value DECIMAL(15,2) NOT NULL,
    date DATE NOT NULL,
    post_life_value DECIMAL(15,2)
);
CREATE TRIGGER trig_asset_valuations_updated_at BEFORE UPDATE ON asset_valuations FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_asset_valuations_asset_id ON asset_valuations(asset_id);

CREATE TABLE IF NOT EXISTS sustainable_funding_sources (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    source_id TEXT UNIQUE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    type TEXT CHECK (type IN ('grant', 'loan', 'other')),
    esg_score DECIMAL(3,1)
);
CREATE TRIGGER trig_sustainable_funding_sources_updated_at BEFORE UPDATE ON sustainable_funding_sources FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_sustainable_funding_sources_source_id ON sustainable_funding_sources(source_id);-- Phase 5: Pillars 13-16 – Assumes Phases 1-4 tables exist (e.g., horses, businesses).
-- Precision: DECIMALS/scores. Scalability: Partitioning on dates. AI: Vectors for anomalies. Adjacents: Impacts for ag/tourism.

-- Pillar 13: Sustainability & Environmental Impact – Carbon/waste tracking with ag links.

CREATE TABLE IF NOT EXISTS waste_management_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    entity_id INTEGER NOT NULL,  -- REFERENCES horses/facilities
    entity_type TEXT NOT NULL CHECK (entity_type IN ('horse', 'facility', 'business')),
    waste_type TEXT NOT NULL CHECK (waste_type IN ('manure', 'compost', 'other')),
    date DATE NOT NULL,
    recycling_method TEXT,
    ag_sustainability_impact DECIMAL(10,2)  -- e.g., fertilizer value for ag adjacent
) PARTITION BY RANGE (date);
CREATE TRIGGER trig_waste_management_logs_updated_at BEFORE UPDATE ON waste_management_logs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_waste_management_logs_entity_id ON waste_management_logs(entity_id);
CREATE INDEX idx_waste_management_logs_date ON waste_management_logs(date);

CREATE TABLE IF NOT EXISTS environmental_monitoring (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    entity_id INTEGER NOT NULL,
    entity_type TEXT NOT NULL,
    air_quality DECIMAL(5,2),
    soil_quality DECIMAL(5,2),
    water_use DECIMAL(10,2),
    date DATE NOT NULL,
    climate_impact TEXT  -- e.g., 'drought_risk' for ag
);
CREATE TRIGGER trig_environmental_monitoring_updated_at BEFORE UPDATE ON environmental_monitoring FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_environmental_monitoring_entity_id ON environmental_monitoring(entity_id);

CREATE TABLE IF NOT EXISTS renewable_energy_integration (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    facility_id INTEGER REFERENCES facility_registry(id) ON DELETE CASCADE NOT NULL,
    energy_type TEXT NOT NULL CHECK (energy_type IN ('solar', 'wind', 'other')),
    capacity DECIMAL(10,2),
    efficiency DECIMAL(5,2) CHECK (efficiency BETWEEN 0 AND 100)
);
CREATE TRIGGER trig_renewable_energy_integration_updated_at BEFORE UPDATE ON renewable_energy_integration FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_renewable_energy_integration_facility_id ON renewable_energy_integration(facility_id);

CREATE TABLE IF NOT EXISTS lifecycle_assessments (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    entity_id INTEGER NOT NULL,
    entity_type TEXT NOT NULL,
    social_impact DECIMAL(3,1) CHECK (social_impact BETWEEN 0 AND 10),
    environmental_impact DECIMAL(3,1) CHECK (environmental_impact BETWEEN 0 AND 10),
    economic_impact DECIMAL(3,1) CHECK (economic_impact BETWEEN 0 AND 10),
    triple_bottom_line_score DECIMAL(3,1)
);
CREATE TRIGGER trig_lifecycle_assessments_updated_at BEFORE UPDATE ON lifecycle_assessments FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_lifecycle_assessments_entity_id ON lifecycle_assessments(entity_id);

CREATE TABLE IF NOT EXISTS urban_ag_conflicts (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    conflict_id TEXT UNIQUE NOT NULL,
    zoning_issue TEXT NOT NULL,
    facility_id INTEGER REFERENCES facility_registry(id),
    resolution_status TEXT CHECK (resolution_status IN ('open', 'resolved'))
);
CREATE TRIGGER trig_urban_ag_conflicts_updated_at BEFORE UPDATE ON urban_ag_conflicts FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_urban_ag_conflicts_conflict_id ON urban_ag_conflicts(conflict_id);

-- Pillar 14: Ethics & Governance – Transparency with quantum ethics overkill.

CREATE TABLE IF NOT EXISTS ethical_principles (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    principle_type TEXT NOT NULL CHECK (principle_type IN ('transparency', 'non_maleficence', 'sustainability', 'other')),
    description TEXT NOT NULL,
    quantum_ethics_simulation DECIMAL(5,4)  -- Overkill probabilistic ethics
);
CREATE TRIGGER trig_ethical_principles_updated_at BEFORE UPDATE ON ethical_principles FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_ethical_principles_type ON ethical_principles(principle_type);

CREATE TABLE IF NOT EXISTS data_ownership_records (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    data_id TEXT UNIQUE NOT NULL,
    owner_id INTEGER REFERENCES users(id) NOT NULL,
    portability_status TEXT CHECK (portability_status IN ('available', 'restricted'))
);
CREATE TRIGGER trig_data_ownership_records_updated_at BEFORE UPDATE ON data_ownership_records FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_data_ownership_records_data_id ON data_ownership_records(data_id);

CREATE TABLE IF NOT EXISTS stakeholder_balances (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    stakeholder_type TEXT NOT NULL CHECK (stakeholder_type IN ('animal', 'farmer', 'consumer', 'ecosystem')),
    balance_score DECIMAL(3,1) CHECK (balance_score BETWEEN 0 AND 10),
    adjacency_equity TEXT  -- e.g., 'ag_fair_trade'
);
CREATE TRIGGER trig_stakeholder_balances_updated_at BEFORE UPDATE ON stakeholder_balances FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_stakeholder_balances_type ON stakeholder_balances(stakeholder_type);

CREATE TABLE IF NOT EXISTS digital_divide_mitigations (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    mitigation_id TEXT UNIQUE NOT NULL,
    tool_description TEXT NOT NULL,  -- e.g., 'free_access_for_small_ops'
    target_group TEXT
);
CREATE TRIGGER trig_digital_divide_mitigations_updated_at BEFORE UPDATE ON digital_divide_mitigations FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_digital_divide_mitigations_mitigation_id ON digital_divide_mitigations(mitigation_id);

CREATE TABLE IF NOT EXISTS policy_compliance_global (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    policy_id TEXT UNIQUE NOT NULL,
    compliance_status TEXT NOT NULL CHECK (compliance_status IN ('compliant', 'partial', 'non_compliant')),
    region TEXT,
    law_type TEXT  -- e.g., 'GDPR_tourism_data'
);
CREATE TRIGGER trig_policy_compliance_global_updated_at BEFORE UPDATE ON policy_compliance_global FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_policy_compliance_global_policy_id ON policy_compliance_global(policy_id);

-- Pillar 15: Consumer & Ancillary Ecosystems – Broader ties with philanthropy for growth.

CREATE TABLE IF NOT EXISTS consumer_interactions (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    consumer_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    interaction_type TEXT NOT NULL,  -- e.g., 'therapy_session', 'tour_booking'
    feedback TEXT,
    satisfaction DECIMAL(3,1) CHECK (satisfaction BETWEEN 0 AND 10)
);
CREATE TRIGGER trig_consumer_interactions_updated_at BEFORE UPDATE ON consumer_interactions FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_consumer_interactions_consumer_id ON consumer_interactions(consumer_id);

CREATE TABLE IF NOT EXISTS media_exposures (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    exposure_id TEXT UNIQUE NOT NULL,
    campaign_type TEXT NOT NULL,  -- e.g., 'PR', 'social'
    reach INTEGER,
    sentiment DECIMAL(5,4) CHECK (sentiment BETWEEN -1 AND 1)
);
CREATE TRIGGER trig_media_exposures_updated_at BEFORE UPDATE ON media_exposures FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_media_exposures_exposure_id ON media_exposures(exposure_id);

CREATE TABLE IF NOT EXISTS ancillary_partners (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    partner_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('tack_shop', 'travel_agent', 'feed_mill', 'other')),  -- Ag/tourism adjacents
    commission_rate DECIMAL(5,2) CHECK (commission_rate BETWEEN 0 AND 100)
);
CREATE TRIGGER trig_ancillary_partners_updated_at BEFORE UPDATE ON ancillary_partners FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_ancillary_partners_partner_id ON ancillary_partners(partner_id);

CREATE TABLE IF NOT EXISTS philanthropic_links (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    link_id TEXT UNIQUE NOT NULL,
    nonprofit_name TEXT NOT NULL,
    donation_amount DECIMAL(12,2),
    cause TEXT  -- e.g., 'wild_horse_conservation' for ag adjacency
);
CREATE TRIGGER trig_philanthropic_links_updated_at BEFORE UPDATE ON philanthropic_links FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_philanthropic_links_link_id ON philanthropic_links(link_id);

-- Pillar 16: Research & Interoperability Standards – Federated learning with FHIR.

CREATE TABLE IF NOT EXISTS research_datasets (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    dataset_id TEXT UNIQUE NOT NULL,
    source TEXT NOT NULL,  -- e.g., 'peer_reviewed'
    content JSONB NOT NULL,
    federated BOOLEAN DEFAULT FALSE  -- For global AI training
);
CREATE TRIGGER trig_research_datasets_updated_at BEFORE UPDATE ON research_datasets FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_research_datasets_dataset_id ON research_datasets(dataset_id);

CREATE TABLE IF NOT EXISTS interoperability_apis (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    api_id TEXT UNIQUE NOT NULL,
    standard TEXT NOT NULL,  -- e.g., 'FHIR', 'EQDS'
    endpoint TEXT
);
CREATE TRIGGER trig_interoperability_apis_updated_at BEFORE UPDATE ON interoperability_apis FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_interoperability_apis_api_id ON interoperability_apis(api_id);

CREATE TABLE IF NOT EXISTS external_data_pipelines (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    pipeline_id TEXT UNIQUE NOT NULL,
    source TEXT NOT NULL,  -- e.g., 'USDA_ag', 'FEI_tourism'
    status TEXT CHECK (status IN ('active', 'paused'))
);
CREATE TRIGGER trig_external_data_pipelines_updated_at BEFORE UPDATE ON external_data_pipelines FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_external_data_pipelines_pipeline_id ON external_data_pipelines(pipeline_id);

CREATE TABLE IF NOT EXISTS anomaly_detection_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    log_id TEXT UNIQUE NOT NULL,
    anomaly_type TEXT NOT NULL,
    details TEXT,
    anomaly_embedding VECTOR(384)  -- For ML clustering
);
CREATE TRIGGER trig_anomaly_detection_logs_updated_at BEFORE UPDATE ON anomaly_detection_logs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_anomaly_detection_logs_log_id ON anomaly_detection_logs(log_id);
CREATE INDEX idx_anomaly_detection_logs_embedding ON anomaly_detection_logs USING hnsw (anomaly_embedding vector_cosine_ops);
-- Phase 6: Pillars 17-21 – Assumes Phases 1-5 tables exist (e.g., horses, businesses, users).
-- Precision: Probabilistic/decimals. Scalability: Partitioning on timestamps. AI: Vectors/hybrids. Adjacents: Chain impacts.

-- Pillar 17: Graph Networks & 2-Degree Connections – Optimized with close frequent access, embeddings.

CREATE TABLE IF NOT EXISTS entity_graph_nodes (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    entity_id INTEGER NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('horse', 'user', 'business', 'facility', 'other')),
    properties JSONB NOT NULL,
    node_embedding VECTOR(384)
);
CREATE TRIGGER trig_entity_graph_nodes_updated_at BEFORE UPDATE ON entity_graph_nodes FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_entity_graph_nodes_entity_id ON entity_graph_nodes(entity_id);
CREATE INDEX idx_entity_graph_nodes_embedding ON entity_graph_nodes USING hnsw (node_embedding vector_cosine_ops);

CREATE TABLE IF NOT EXISTS relationship_edges (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    from_node_id INTEGER REFERENCES entity_graph_nodes(id) ON DELETE CASCADE NOT NULL,
    to_node_id INTEGER REFERENCES entity_graph_nodes(id) ON DELETE CASCADE NOT NULL,
    edge_type TEXT NOT NULL,
    weight DECIMAL(5,4) CHECK (weight BETWEEN 0 AND 1),
    adjacency_impact TEXT
);
CREATE TRIGGER trig_relationship_edges_updated_at BEFORE UPDATE ON relationship_edges FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_relationship_edges_from_node_id ON relationship_edges(from_node_id);
CREATE INDEX idx_relationship_edges_to_node_id ON relationship_edges(to_node_id);

CREATE TABLE IF NOT EXISTS secondary_edges (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    from_node_id INTEGER REFERENCES entity_graph_nodes(id) ON DELETE CASCADE NOT NULL,
    to_node_id INTEGER REFERENCES entity_graph_nodes(id) ON DELETE CASCADE NOT NULL,
    edge_type TEXT NOT NULL,
    distance INTEGER CHECK (distance = 2),
    inferred_strength DECIMAL(5,4) CHECK (inferred_strength BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_secondary_edges_updated_at BEFORE UPDATE ON secondary_edges FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_secondary_edges_from_node_id ON secondary_edges(from_node_id);

CREATE TABLE IF NOT EXISTS hobby_profiles (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    hobby_type TEXT NOT NULL,
    intensity DECIMAL(3,1) CHECK (intensity BETWEEN 0 AND 10),
    network_size INTEGER
);
CREATE TRIGGER trig_hobby_profiles_updated_at BEFORE UPDATE ON hobby_profiles FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_hobby_profiles_user_id ON hobby_profiles(user_id);

CREATE TABLE IF NOT EXISTS social_graph_imports (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    import_id TEXT UNIQUE NOT NULL,
    source TEXT NOT NULL,
    graph_data JSONB NOT NULL,
    import_date DATE NOT NULL
);
CREATE TRIGGER trig_social_graph_imports_updated_at BEFORE UPDATE ON social_graph_imports FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_social_graph_imports_import_id ON social_graph_imports(import_id);

CREATE TABLE IF NOT EXISTS influence_chains (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    chain_id TEXT UNIQUE NOT NULL,
    path JSONB NOT NULL,
    chain_length INTEGER NOT NULL,
    influence_score DECIMAL(5,4) CHECK (influence_score BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_influence_chains_updated_at BEFORE UPDATE ON influence_chains FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_influence_chains_chain_id ON influence_chains(chain_id);

CREATE TABLE IF NOT EXISTS adjacency_matrices (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    matrix_id TEXT UNIQUE NOT NULL,
    matrix_data JSONB NOT NULL,
    dimension INTEGER NOT NULL
);
CREATE TRIGGER trig_adjacency_matrices_updated_at BEFORE UPDATE ON adjacency_matrices FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_adjacency_matrices_matrix_id ON adjacency_matrices(matrix_id);

CREATE TABLE IF NOT EXISTS cluster_algorithms (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    algorithm_id TEXT UNIQUE NOT NULL,
    grouping JSONB NOT NULL,
    cluster_count INTEGER
);
CREATE TRIGGER trig_cluster_algorithms_updated_at BEFORE UPDATE ON cluster_algorithms FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_cluster_algorithms_algorithm_id ON cluster_algorithms(algorithm_id);

CREATE TABLE IF NOT EXISTS privacy_filters (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    filter_id TEXT UNIQUE NOT NULL,
    consent_level TEXT NOT NULL CHECK (consent_level IN ('full', 'partial', 'none')),
    data_type TEXT
);
CREATE TRIGGER trig_privacy_filters_updated_at BEFORE UPDATE ON privacy_filters FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_privacy_filters_filter_id ON privacy_filters(filter_id);

CREATE TABLE IF NOT EXISTS external_persona_links (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    link_id TEXT UNIQUE NOT NULL,
    persona_description TEXT NOT NULL,
    source TEXT
);
CREATE TRIGGER trig_external_persona_links_updated_at BEFORE UPDATE ON external_persona_links FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_external_persona_links_link_id ON external_persona_links(link_id);

-- Pillar 18: Predictive Modeling & Forecasting – Hybrid/fuzzy models for breeding/tourism.

CREATE TABLE IF NOT EXISTS forecasting_models (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    model_id TEXT UNIQUE NOT NULL,
    script TEXT NOT NULL,
    model_type TEXT CHECK (model_type IN ('ARIMA', 'ML', 'hybrid', 'fuzzy')),
    fuzzy_uncertainty DECIMAL(5,4)
);
CREATE TRIGGER trig_forecasting_models_updated_at BEFORE UPDATE ON forecasting_models FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_forecasting_models_model_id ON forecasting_models(model_id);

CREATE TABLE IF NOT EXISTS scenario_simulations (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    sim_id TEXT UNIQUE NOT NULL,
    what_if_params JSONB NOT NULL,
    outcome JSONB NOT NULL,
    probability DECIMAL(5,4) CHECK (probability BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_scenario_simulations_updated_at BEFORE UPDATE ON scenario_simulations FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_scenario_simulations_sim_id ON scenario_simulations(sim_id);

CREATE TABLE IF NOT EXISTS trend_predictors (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    predictor_id TEXT UNIQUE NOT NULL,
    trend_type TEXT NOT NULL,
    time_series JSONB NOT NULL
);
CREATE TRIGGER trig_trend_predictors_updated_at BEFORE UPDATE ON trend_predictors FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_trend_predictors_predictor_id ON trend_predictors(predictor_id);

CREATE TABLE IF NOT EXISTS anomaly_detectors (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    detector_id TEXT UNIQUE NOT NULL,
    flag TEXT NOT NULL,
    anomaly_embedding VECTOR(384)
);
CREATE TRIGGER trig_anomaly_detectors_updated_at BEFORE UPDATE ON anomaly_detectors FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_anomaly_detectors_detector_id ON anomaly_detectors(detector_id);
CREATE INDEX idx_anomaly_detectors_embedding ON anomaly_detectors USING hnsw (anomaly_embedding vector_cosine_ops);

CREATE TABLE IF NOT EXISTS predictive_health_chains (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    chain_id TEXT UNIQUE NOT NULL,
    forecast JSONB NOT NULL,
    hybrid_model_used BOOLEAN DEFAULT FALSE
);
CREATE TRIGGER trig_predictive_health_chains_updated_at BEFORE UPDATE ON predictive_health_chains FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_predictive_health_chains_chain_id ON predictive_health_chains(chain_id);

CREATE TABLE IF NOT EXISTS economic_ripple_models (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    model_id TEXT UNIQUE NOT NULL,
    impact JSONB NOT NULL,
    ripple_depth INTEGER
);
CREATE TRIGGER trig_economic_ripple_models_updated_at BEFORE UPDATE ON economic_ripple_models FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_economic_ripple_models_model_id ON economic_ripple_models(model_id);

CREATE TABLE IF NOT EXISTS hobby_influence_forecasts (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    forecast_id TEXT UNIQUE NOT NULL,
    influence JSONB NOT NULL,
    tourism_impact DECIMAL(5,2)
);
CREATE TRIGGER trig_hobby_influence_forecasts_updated_at BEFORE UPDATE ON hobby_influence_forecasts FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_hobby_influence_forecasts_forecast_id ON hobby_influence_forecasts(forecast_id);

CREATE TABLE IF NOT EXISTS global_disruption_predictors (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    predictor_id TEXT UNIQUE NOT NULL,
    disruption_type TEXT NOT NULL,
    probability DECIMAL(5,4) CHECK (probability BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_global_disruption_predictors_updated_at BEFORE UPDATE ON global_disruption_predictors FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_global_disruption_predictors_predictor_id ON global_disruption_predictors(predictor_id);

CREATE TABLE IF NOT EXISTS ml_training_pipelines (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    pipeline_id TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL,
    hybrid_components JSONB
);
CREATE TRIGGER trig_ml_training_pipelines_updated_at BEFORE UPDATE ON ml_training_pipelines FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_ml_training_pipelines_pipeline_id ON ml_training_pipelines(pipeline_id);

CREATE TABLE IF NOT EXISTS validation_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    log_id TEXT UNIQUE NOT NULL,
    accuracy DECIMAL(5,4) CHECK (accuracy BETWEEN 0 AND 1),
    model_id TEXT
);
CREATE TRIGGER trig_validation_logs_updated_at BEFORE UPDATE ON validation_logs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_validation_logs_log_id ON validation_logs(log_id);

-- Pillar 19: Adjacency Industries & Value Chains – Nodes closer to center, supply graphs.

CREATE TABLE IF NOT EXISTS adjacency_maps (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    map_id TEXT UNIQUE NOT NULL,
    sector_from TEXT NOT NULL,
    sector_to TEXT NOT NULL,
    connection_strength DECIMAL(5,4) CHECK (connection_strength BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_adjacency_maps_updated_at BEFORE UPDATE ON adjacency_maps FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_adjacency_maps_map_id ON adjacency_maps(map_id);

CREATE TABLE IF NOT EXISTS value_chain_nodes (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    node_id TEXT UNIQUE NOT NULL,
    chain_type TEXT NOT NULL,
    position INTEGER
);
CREATE TRIGGER trig_value_chain_nodes_updated_at BEFORE UPDATE ON value_chain_nodes FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_value_chain_nodes_node_id ON value_chain_nodes(node_id);

CREATE TABLE IF NOT EXISTS indirect_sector_profiles (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    profile_id TEXT UNIQUE NOT NULL,
    sector TEXT NOT NULL,
    details JSONB NOT NULL
);
CREATE TRIGGER trig_indirect_sector_profiles_updated_at BEFORE UPDATE ON indirect_sector_profiles FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_indirect_sector_profiles_profile_id ON indirect_sector_profiles(profile_id);

CREATE TABLE IF NOT EXISTS cross_industry_links (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    link_id TEXT UNIQUE NOT NULL,
    from_sector TEXT NOT NULL,
    to_sector TEXT NOT NULL,
    link_type TEXT
);
CREATE TRIGGER trig_cross_industry_links_updated_at BEFORE UPDATE ON cross_industry_links FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_cross_industry_links_link_id ON cross_industry_links(link_id);

CREATE TABLE IF NOT EXISTS economic_impact_models (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    model_id TEXT UNIQUE NOT NULL,
    impact JSONB NOT NULL,
    ripple_effect DECIMAL(10,2)
);
CREATE TRIGGER trig_economic_impact_models_updated_at BEFORE UPDATE ON economic_impact_models FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_economic_impact_models_model_id ON economic_impact_models(model_id);

CREATE TABLE IF NOT EXISTS supplier_2degree_chains (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    chain_id TEXT UNIQUE NOT NULL,
    supplier TEXT NOT NULL,
    degree2_link TEXT
);
CREATE TRIGGER trig_supplier_2degree_chains_updated_at BEFORE UPDATE ON supplier_2degree_chains FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_supplier_2degree_chains_chain_id ON supplier_2degree_chains(chain_id);

CREATE TABLE IF NOT EXISTS media_adjacencies (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    adjacency_id TEXT UNIQUE NOT NULL,
    media_type TEXT NOT NULL,
    link_strength DECIMAL(5,4) CHECK (link_strength BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_media_adjacencies_updated_at BEFORE UPDATE ON media_adjacencies FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_media_adjacencies_adjacency_id ON media_adjacencies(adjacency_id);

CREATE TABLE IF NOT EXISTS biotech_adjacencies (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    adjacency_id TEXT UNIQUE NOT NULL,
    biotech_type TEXT NOT NULL,
    integration_level TEXT
);
CREATE TRIGGER trig_biotech_adjacencies_updated_at BEFORE UPDATE ON biotech_adjacencies FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_biotech_adjacencies_adjacency_id ON biotech_adjacencies(adjacency_id);

CREATE TABLE IF NOT EXISTS tourism_value_chains (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    chain_id TEXT UNIQUE NOT NULL,
    tourism_type TEXT NOT NULL,
    value DECIMAL(12,2)
);
CREATE TRIGGER trig_tourism_value_chains_updated_at BEFORE UPDATE ON tourism_value_chains FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_tourism_value_chains_chain_id ON tourism_value_chains(chain_id);

CREATE TABLE IF NOT EXISTS regulatory_adjacencies (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    adjacency_id TEXT UNIQUE NOT NULL,
    law_type TEXT NOT NULL,
    compliance_impact TEXT
);
CREATE TRIGGER trig_regulatory_adjacencies_updated_at BEFORE UPDATE ON regulatory_adjacencies FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_regulatory_adjacencies_adjacency_id ON regulatory_adjacencies(adjacency_id);

-- Pillar 20: Human-Centric Indirect Layers – Trust-aware, socio-emotional schemas.

CREATE TABLE IF NOT EXISTS lifestyle_profiles (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    profile_id TEXT UNIQUE NOT NULL,
    lifestyle_type TEXT NOT NULL,
    preferences JSONB NOT NULL
);
CREATE TRIGGER trig_lifestyle_profiles_updated_at BEFORE UPDATE ON lifestyle_profiles FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_lifestyle_profiles_profile_id ON lifestyle_profiles(profile_id);

CREATE TABLE IF NOT EXISTS hobby_networks (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    network_id TEXT UNIQUE NOT NULL,
    hobby TEXT NOT NULL,
    socio_emotional_attributes JSONB
);
CREATE TRIGGER trig_hobby_networks_updated_at BEFORE UPDATE ON hobby_networks FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_hobby_networks_network_id ON hobby_networks(network_id);

CREATE TABLE IF NOT EXISTS psychosocial_chains (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    chain_id TEXT UNIQUE NOT NULL,
    emotional_tie TEXT NOT NULL,
    trust_score DECIMAL(5,4) CHECK (trust_score BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_psychosocial_chains_updated_at BEFORE UPDATE ON psychosocial_chains FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_psychosocial_chains_chain_id ON psychosocial_chains(chain_id);

CREATE TABLE IF NOT EXISTS cultural_adjacency_links (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    link_id TEXT UNIQUE NOT NULL,
    culture TEXT NOT NULL,
    personalization_level TEXT
);
CREATE TRIGGER trig_cultural_adjacency_links_updated_at BEFORE UPDATE ON cultural_adjacency_links FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_cultural_adjacency_links_link_id ON cultural_adjacency_links(link_id);

CREATE TABLE IF NOT EXISTS veteran_equine_connections (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    connection_id TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    therapy_benefit DECIMAL(3,1)
);
CREATE TRIGGER trig_veteran_equine_connections_updated_at BEFORE UPDATE ON veteran_equine_connections FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_veteran_equine_connections_connection_id ON veteran_equine_connections(connection_id);

CREATE TABLE IF NOT EXISTS family_extension_graphs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    graph_id TEXT UNIQUE NOT NULL,
    kin_relation TEXT NOT NULL,
    extension_level INTEGER
);
CREATE TRIGGER trig_family_extension_graphs_updated_at BEFORE UPDATE ON family_extension_graphs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_family_extension_graphs_graph_id ON family_extension_graphs(graph_id);

CREATE TABLE IF NOT EXISTS influence_hobby_predictors (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    predictor_id TEXT UNIQUE NOT NULL,
    hobby TEXT NOT NULL,
    influence DECIMAL(5,4) CHECK (influence BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_influence_hobby_predictors_updated_at BEFORE UPDATE ON influence_hobby_predictors FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_influence_hobby_predictors_predictor_id ON influence_hobby_predictors(predictor_id);

CREATE TABLE IF NOT EXISTS privacy_psych_filters (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    filter_id TEXT UNIQUE NOT NULL,
    level TEXT NOT NULL,
    psych_data_type TEXT
);
CREATE TRIGGER trig_privacy_psych_filters_updated_at BEFORE UPDATE ON privacy_psych_filters FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_privacy_psych_filters_filter_id ON privacy_psych_filters(filter_id);

CREATE TABLE IF NOT EXISTS community_escape_metrics (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    metric_id TEXT UNIQUE NOT NULL,
    benefit TEXT NOT NULL,
    escape_score DECIMAL(3,1)
);
CREATE TRIGGER trig_community_escape_metrics_updated_at BEFORE UPDATE ON community_escape_metrics FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_community_escape_metrics_metric_id ON community_escape_metrics(metric_id);

CREATE TABLE IF NOT EXISTS fame_adjacency_chains (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    chain_id TEXT UNIQUE NOT NULL,
    celebrity_link TEXT NOT NULL,
    adjacency_type TEXT
);
CREATE TRIGGER trig_fame_adjacency_chains_updated_at BEFORE UPDATE ON fame_adjacency_chains FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_fame_adjacency_chains_chain_id ON fame_adjacency_chains(chain_id);

-- Pillar 21: Capture Mechanisms & Omniscience Integrations – Ethical pipelines with federated ethics.

CREATE TABLE IF NOT EXISTS data_ingestion_pipelines (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    pipeline_id TEXT UNIQUE NOT NULL,
    source TEXT NOT NULL,
    status TEXT
);
CREATE TRIGGER trig_data_ingestion_pipelines_updated_at BEFORE UPDATE ON data_ingestion_pipelines FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_data_ingestion_pipelines_pipeline_id ON data_ingestion_pipelines(pipeline_id);

CREATE TABLE IF NOT EXISTS 2degree_scrapers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    scraper_id TEXT UNIQUE NOT NULL,
    target TEXT NOT NULL,
    ethical_compliance BOOLEAN DEFAULT TRUE
);
CREATE TRIGGER trig_2degree_scrapers_updated_at BEFORE UPDATE ON 2degree_scrapers FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_2degree_scrapers_scraper_id ON 2degree_scrapers(scraper_id);

CREATE TABLE IF NOT EXISTS omniscience_apis (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    api_id TEXT UNIQUE NOT NULL,
    endpoint TEXT NOT NULL,
    integration_type TEXT
);
CREATE TRIGGER trig_omniscience_apis_updated_at BEFORE UPDATE ON omniscience_apis FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_omniscience_apis_api_id ON omniscience_apis(api_id);

CREATE TABLE IF NOT EXISTS wild_data_capture (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    capture_id TEXT UNIQUE NOT NULL,
    data_type TEXT NOT NULL,
    source TEXT
);
CREATE TRIGGER trig_wild_data_capture_updated_at BEFORE UPDATE ON wild_data_capture FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_wild_data_capture_capture_id ON wild_data_capture(capture_id);

CREATE TABLE IF NOT EXISTS prediction_validation_feeds (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    feed_id TEXT UNIQUE NOT NULL,
    verifier TEXT NOT NULL,
    accuracy DECIMAL(5,4) CHECK (accuracy BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_prediction_validation_feeds_updated_at BEFORE UPDATE ON prediction_validation_feeds FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_prediction_validation_feeds_feed_id ON prediction_validation_feeds(feed_id);

CREATE TABLE IF NOT EXISTS ethical_capture_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    log_id TEXT UNIQUE NOT NULL,
    capture_details TEXT NOT NULL,
    compliance_check TEXT
);
CREATE TRIGGER trig_ethical_capture_logs_updated_at BEFORE UPDATE ON ethical_capture_logs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_ethical_capture_logs_log_id ON ethical_capture_logs(log_id);

CREATE TABLE IF NOT EXISTS adjacency_expansion_crons (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    cron_id TEXT UNIQUE NOT NULL,
    schedule TEXT NOT NULL,
    expansion_type TEXT
);
CREATE TRIGGER trig_adjacency_expansion_crons_updated_at BEFORE UPDATE ON adjacency_expansion_crons FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_adjacency_expansion_crons_cron_id ON adjacency_expansion_crons(cron_id);

CREATE TABLE IF NOT EXISTS hobby_sentiment_analyzers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    analyzer_id TEXT UNIQUE NOT NULL,
    sentiment DECIMAL(5,4) CHECK (sentiment BETWEEN -1 AND 1),
    hobby_type TEXT
);
CREATE TRIGGER trig_hobby_sentiment_analyzers_updated_at BEFORE UPDATE ON hobby_sentiment_analyzers FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_hobby_sentiment_analyzers_analyzer_id ON hobby_sentiment_analyzers(analyzer_id);

CREATE TABLE IF NOT EXISTS global_chain_monitors (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    monitor_id TEXT UNIQUE NOT NULL,
    chain_type TEXT NOT NULL,
    status TEXT
);
CREATE TRIGGER trig_global_chain_monitors_updated_at BEFORE UPDATE ON global_chain_monitors FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_global_chain_monitors_monitor_id ON global_chain_monitors(monitor_id);

CREATE TABLE IF NOT EXISTS capture_kpis (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    kpi_id TEXT UNIQUE NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    coverage_percentage DECIMAL(5,2) CHECK (coverage_percentage BETWEEN 0 AND 100)
);
CREATE TRIGGER trig_capture_kpis_updated_at BEFORE UPDATE ON capture_kpis FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_capture_kpis_kpi_id ON capture_kpis(kpi_id);
-- Phase 7: Pillars 22-25 – Assumes Phases 1-6 tables exist (e.g., forecasting_models).
-- Precision: DECIMALS/quantum probs. Scalability: Partitioning on logs. AI: Vectors/RLHF. Adjacents: Impacts in sims/integrations.

-- Pillar 22: Massive Compute & Infrastructure Scaling – xAI/Dojo-style with redundancy.

CREATE TABLE IF NOT EXISTS compute_clusters (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    cluster_id TEXT UNIQUE NOT NULL,
    gpu_type TEXT NOT NULL,
    gpu_count INTEGER NOT NULL CHECK (gpu_count > 0),
    location TEXT,
    doomsday_failure_scenarios JSONB
);
CREATE TRIGGER trig_compute_clusters_updated_at BEFORE UPDATE ON compute_clusters FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_compute_clusters_cluster_id ON compute_clusters(cluster_id);

CREATE TABLE IF NOT EXISTS training_supercomputers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    super_id TEXT UNIQUE NOT NULL,
    specs JSONB NOT NULL,
    capacity DECIMAL(10,2),
    status TEXT CHECK (status IN ('active', 'maintenance'))
);
CREATE TRIGGER trig_training_supercomputers_updated_at BEFORE UPDATE ON training_supercomputers FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_training_supercomputers_super_id ON training_supercomputers(super_id);

CREATE TABLE IF NOT EXISTS resource_allocation_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    log_id TEXT UNIQUE NOT NULL,
    cluster_id INTEGER REFERENCES compute_clusters(id) ON DELETE CASCADE NOT NULL,
    assignment JSONB NOT NULL,
    timestamp TIMESTAMP NOT NULL
) PARTITION BY RANGE (timestamp);
CREATE TRIGGER trig_resource_allocation_logs_updated_at BEFORE UPDATE ON resource_allocation_logs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_resource_allocation_logs_cluster_id ON resource_allocation_logs(cluster_id);

CREATE TABLE IF NOT EXISTS scalability_metrics (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    metric_id TEXT UNIQUE NOT NULL,
    throughput DECIMAL(10,2) NOT NULL,
    latency DECIMAL(5,3)
);
CREATE TRIGGER trig_scalability_metrics_updated_at BEFORE UPDATE ON scalability_metrics FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_scalability_metrics_metric_id ON scalability_metrics(metric_id);

CREATE TABLE IF NOT EXISTS energy_optimization_models (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    model_id TEXT UNIQUE NOT NULL,
    efficiency DECIMAL(5,2) CHECK (efficiency BETWEEN 0 AND 100),
    power_use DECIMAL(10,2)
);
CREATE TRIGGER trig_energy_optimization_models_updated_at BEFORE UPDATE ON energy_optimization_models FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_energy_optimization_models_model_id ON energy_optimization_models(model_id);

CREATE TABLE IF NOT EXISTS hardware_integration_pipelines (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    pipeline_id TEXT UNIQUE NOT NULL,
    cloud_type TEXT NOT NULL,
    status TEXT
);
CREATE TRIGGER trig_hardware_integration_pipelines_updated_at BEFORE UPDATE ON hardware_integration_pipelines FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_hardware_integration_pipelines_pipeline_id ON hardware_integration_pipelines(pipeline_id);

CREATE TABLE IF NOT EXISTS failure_prediction_algorithms (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    algo_id TEXT UNIQUE NOT NULL,
    forecast JSONB NOT NULL,
    probability DECIMAL(5,4) CHECK (probability BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_failure_prediction_algorithms_updated_at BEFORE UPDATE ON failure_prediction_algorithms FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_failure_prediction_algorithms_algo_id ON failure_prediction_algorithms(algo_id);

CREATE TABLE IF NOT EXISTS quantum_integration_proofs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    proof_id TEXT UNIQUE NOT NULL,
    experiment TEXT NOT NULL,
    result DECIMAL(5,4)
);
CREATE TRIGGER trig_quantum_integration_proofs_updated_at BEFORE UPDATE ON quantum_integration_proofs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_quantum_integration_proofs_proof_id ON quantum_integration_proofs(proof_id);

CREATE TABLE IF NOT EXISTS data_center_locations (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    center_id TEXT UNIQUE NOT NULL,
    location TEXT NOT NULL,
    latency DECIMAL(5,3)
);
CREATE TRIGGER trig_data_center_locations_updated_at BEFORE UPDATE ON data_center_locations FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_data_center_locations_center_id ON data_center_locations(center_id);

CREATE TABLE IF NOT EXISTS cost_optimization_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    log_id TEXT UNIQUE NOT NULL,
    roi DECIMAL(10,2) NOT NULL,
    optimization_step TEXT
);
CREATE TRIGGER trig_cost_optimization_logs_updated_at BEFORE UPDATE ON cost_optimization_logs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_cost_optimization_logs_log_id ON cost_optimization_logs(log_id);

-- Pillar 23: Simulations & Virtual Twins – Multi-verse with physics layers.

CREATE TABLE IF NOT EXISTS virtual_twin_models (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    twin_id TEXT UNIQUE NOT NULL,
    replica_type TEXT NOT NULL,
    data JSONB NOT NULL
);
CREATE TRIGGER trig_virtual_twin_models_updated_at BEFORE UPDATE ON virtual_twin_models FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_virtual_twin_models_twin_id ON virtual_twin_models(twin_id);

CREATE TABLE IF NOT EXISTS scenario_simulation_engine (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    engine_id TEXT UNIQUE NOT NULL,
    sim_type TEXT NOT NULL
);
CREATE TRIGGER trig_scenario_simulation_engine_updated_at BEFORE UPDATE ON scenario_simulation_engine FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_scenario_simulation_engine_engine_id ON scenario_simulation_engine(engine_id);

CREATE TABLE IF NOT EXISTS multi_dimensional_graph_sims (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    sim_id TEXT UNIQUE NOT NULL,
    dimension TEXT NOT NULL,
    data JSONB NOT NULL
);
CREATE TRIGGER trig_multi_dimensional_graph_sims_updated_at BEFORE UPDATE ON multi_dimensional_graph_sims FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_multi_dimensional_graph_sims_sim_id ON multi_dimensional_graph_sims(sim_id);

CREATE TABLE IF NOT EXISTS physics_integration_layers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    layer_id TEXT UNIQUE NOT NULL,
    physics_type TEXT NOT NULL,
    params JSONB
);
CREATE TRIGGER trig_physics_integration_layers_updated_at BEFORE UPDATE ON physics_integration_layers FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_physics_integration_layers_layer_id ON physics_integration_layers(layer_id);

CREATE TABLE IF NOT EXISTS economic_twin_forecasts (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    forecast_id TEXT UNIQUE NOT NULL,
    economy JSONB NOT NULL,
    adjacency_ripple DECIMAL(10,2)
);
CREATE TRIGGER trig_economic_twin_forecasts_updated_at BEFORE UPDATE ON economic_twin_forecasts FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_economic_twin_forecasts_forecast_id ON economic_twin_forecasts(forecast_id);

CREATE TABLE IF NOT EXISTS hobby_network_sims (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    sim_id TEXT UNIQUE NOT NULL,
    network JSONB NOT NULL,
    virality DECIMAL(5,4) CHECK (virality BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_hobby_network_sims_updated_at BEFORE UPDATE ON hobby_network_sims FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_hobby_network_sims_sim_id ON hobby_network_sims(sim_id);

CREATE TABLE IF NOT EXISTS real_time_twin_updates (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_id TEXT UNIQUE NOT NULL,
    sync_data JSONB NOT NULL,
    timestamp TIMESTAMP NOT NULL
);
CREATE TRIGGER trig_real_time_twin_updates_updated_at BEFORE UPDATE ON real_time_twin_updates FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_real_time_twin_updates_update_id ON real_time_twin_updates(update_id);

CREATE TABLE IF NOT EXISTS validation_twin_datasets (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    dataset_id TEXT UNIQUE NOT NULL,
    truth_data JSONB NOT NULL
);
CREATE TRIGGER trig_validation_twin_datasets_updated_at BEFORE UPDATE ON validation_twin_datasets FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_validation_twin_datasets_dataset_id ON validation_twin_datasets(dataset_id);

CREATE TABLE IF NOT EXISTS agi_proactive_agents (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    agent_id TEXT UNIQUE NOT NULL,
    mission TEXT NOT NULL,
    rlhf_iteration INTEGER
);
CREATE TRIGGER trig_agi_proactive_agents_updated_at BEFORE UPDATE ON agi_proactive_agents FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_agi_proactive_agents_agent_id ON agi_proactive_agents(agent_id);

CREATE TABLE IF NOT EXISTS sim_optimization_loops (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    loop_id TEXT UNIQUE NOT NULL,
    iteration_count INTEGER NOT NULL,
    optimization_result TEXT
);
CREATE TRIGGER trig_sim_optimization_loops_updated_at BEFORE UPDATE ON sim_optimization_loops FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_sim_optimization_loops_loop_id ON sim_optimization_loops(loop_id);

-- Pillar 24: Cross-Ecosystem & Musk Empire Integrations – Bold synergies with Boring Co.

CREATE TABLE IF NOT EXISTS starlink_integration_feeds (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    feed_id TEXT UNIQUE NOT NULL,
    data JSONB NOT NULL,
    latency DECIMAL(5,3)
);
CREATE TRIGGER trig_starlink_integration_feeds_updated_at BEFORE UPDATE ON starlink_integration_feeds FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_starlink_integration_feeds_feed_id ON starlink_integration_feeds(feed_id);

CREATE TABLE IF NOT EXISTS tesla_ev_hauler_links (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    link_id TEXT UNIQUE NOT NULL,
    ev_type TEXT NOT NULL,
    efficiency DECIMAL(5,2)
);
CREATE TRIGGER trig_tesla_ev_hauler_links_updated_at BEFORE UPDATE ON tesla_ev_hauler_links FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_tesla_ev_hauler_links_link_id ON tesla_ev_hauler_links(link_id);

CREATE TABLE IF NOT EXISTS neuralink_bio_interfaces (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    interface_id TEXT UNIQUE NOT NULL,
    bio_data JSONB NOT NULL,
    horse_neural_link BOOLEAN DEFAULT FALSE
);
CREATE TRIGGER trig_neuralink_bio_interfaces_updated_at BEFORE UPDATE ON neuralink_bio_interfaces FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_neuralink_bio_interfaces_interface_id ON neuralink_bio_interfaces(interface_id);

CREATE TABLE IF NOT EXISTS spacex_simulation_overlays (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    overlay_id TEXT UNIQUE NOT NULL,
    trajectory_data JSONB NOT NULL
);
CREATE TRIGGER trig_spacex_simulation_overlays_updated_at BEFORE UPDATE ON spacex_simulation_overlays FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_spacex_simulation_overlays_overlay_id ON spacex_simulation_overlays(overlay_id);

CREATE TABLE IF NOT EXISTS xai_grok_synergies (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    synergy_id TEXT UNIQUE NOT NULL,
    integration TEXT NOT NULL
);
CREATE TRIGGER trig_xai_grok_synergies_updated_at BEFORE UPDATE ON xai_grok_synergies FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_xai_grok_synergies_synergy_id ON xai_grok_synergies(synergy_id);

CREATE TABLE IF NOT EXISTS boring_co_tunnel_adjacencies (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    adjacency_id TEXT UNIQUE NOT NULL,
    tunnel_type TEXT NOT NULL,
    logistics_benefit DECIMAL(10,2)
);
CREATE TRIGGER trig_boring_co_tunnel_adjacencies_updated_at BEFORE UPDATE ON boring_co_tunnel_adjacencies FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_boring_co_tunnel_adjacencies_adjacency_id ON boring_co_tunnel_adjacencies(adjacency_id);

CREATE TABLE IF NOT EXISTS twitter_x_data_pipelines (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    pipeline_id TEXT UNIQUE NOT NULL,
    data JSONB NOT NULL
);
CREATE TRIGGER trig_twitter_x_data_pipelines_updated_at BEFORE UPDATE ON twitter_x_data_pipelines FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_twitter_x_data_pipelines_pipeline_id ON twitter_x_data_pipelines(pipeline_id);

CREATE TABLE IF NOT EXISTS musk_ecosystem_apis (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    api_id TEXT UNIQUE NOT NULL,
    company TEXT NOT NULL,
    endpoint TEXT
);
CREATE TRIGGER trig_musk_ecosystem_apis_updated_at BEFORE UPDATE ON musk_ecosystem_apis FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_musk_ecosystem_apis_api_id ON musk_ecosystem_apis(api_id);

CREATE TABLE IF NOT EXISTS interdisciplinary_fusion_models (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    model_id TEXT UNIQUE NOT NULL,
    fusion_type TEXT NOT NULL,
    output JSONB
);
CREATE TRIGGER trig_interdisciplinary_fusion_models_updated_at BEFORE UPDATE ON interdisciplinary_fusion_models FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_interdisciplinary_fusion_models_model_id ON interdisciplinary_fusion_models(model_id);

CREATE TABLE IF NOT EXISTS integration_kpis (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    kpi_id TEXT UNIQUE NOT NULL,
    roi DECIMAL(10,2) NOT NULL,
    synergy_score DECIMAL(3,1)
);
CREATE TRIGGER trig_integration_kpis_updated_at BEFORE UPDATE ON integration_kpis FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_integration_kpis_kpi_id ON integration_kpis(kpi_id);

-- Pillar 25: Truth-Seeking Transparency & AGI Proactivity – RLHF, multi-modal fusion.

CREATE TABLE IF NOT EXISTS truth_verification_engines (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    engine_id TEXT UNIQUE NOT NULL,
    source TEXT NOT NULL,
    verification_score DECIMAL(5,4) CHECK (verification_score BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_truth_verification_engines_updated_at BEFORE UPDATE ON truth_verification_engines FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_truth_verification_engines_engine_id ON truth_verification_engines(engine_id);

CREATE TABLE IF NOT EXISTS explainable_ai_layers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    layer_id TEXT UNIQUE NOT NULL,
    explanation TEXT NOT NULL,
    layer_type TEXT
);
CREATE TRIGGER trig_explainable_ai_layers_updated_at BEFORE UPDATE ON explainable_ai_layers FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_explainable_ai_layers_layer_id ON explainable_ai_layers(layer_id);

CREATE TABLE IF NOT EXISTS agi_proactive_loops (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    loop_id TEXT UNIQUE NOT NULL,
    action TEXT NOT NULL,
    rlhf_feedback DECIMAL(5,4) CHECK (rlhf_feedback BETWEEN -1 AND 1)
);
CREATE TRIGGER trig_agi_proactive_loops_updated_at BEFORE UPDATE ON agi_proactive_loops FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_agi_proactive_loops_loop_id ON agi_proactive_loops(loop_id);

CREATE TABLE IF NOT EXISTS privacy_spill_preventers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    preventer_id TEXT UNIQUE NOT NULL,
    mechanism TEXT NOT NULL,
    effectiveness DECIMAL(5,4) CHECK (effectiveness BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_privacy_spill_preventers_updated_at BEFORE UPDATE ON privacy_spill_preventers FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_privacy_spill_preventers_preventer_id ON privacy_spill_preventers(preventer_id);

CREATE TABLE IF NOT EXISTS iteration_optimization_cycles (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    cycle_id TEXT UNIQUE NOT NULL,
    step TEXT NOT NULL,
    optimization_gain DECIMAL(5,4)
);
CREATE TRIGGER trig_iteration_optimization_cycles_updated_at BEFORE UPDATE ON iteration_optimization_cycles FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_iteration_optimization_cycles_cycle_id ON iteration_optimization_cycles(cycle_id);

CREATE TABLE IF NOT EXISTS curiosity_driven_queries (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    query_id TEXT UNIQUE NOT NULL,
    exploration TEXT NOT NULL,
    curiosity_score DECIMAL(3,1) CHECK (curiosity_score BETWEEN 0 AND 10)
);
CREATE TRIGGER trig_curiosity_driven_queries_updated_at BEFORE UPDATE ON curiosity_driven_queries FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_curiosity_driven_queries_query_id ON curiosity_driven_queries(query_id);

CREATE TABLE IF NOT EXISTS blockchain_provenance_chains (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    chain_id TEXT UNIQUE NOT NULL,
    provenance JSONB NOT NULL,
    hash TEXT NOT NULL
);
CREATE TRIGGER trig_blockchain_provenance_chains_updated_at BEFORE UPDATE ON blockchain_provenance_chains FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_blockchain_provenance_chains_chain_id ON blockchain_provenance_chains(chain_id);

CREATE TABLE IF NOT EXISTS multi_modal_truth_fusion (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fusion_id TEXT UNIQUE NOT NULL,
    modal_type TEXT NOT NULL,
    fusion_score DECIMAL(5,4) CHECK (fusion_score BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_multi_modal_truth_fusion_updated_at BEFORE UPDATE ON multi_modal_truth_fusion FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_multi_modal_truth_fusion_fusion_id ON multi_modal_truth_fusion(fusion_id);

CREATE TABLE IF NOT EXISTS agi_milestone_trackers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tracker_id TEXT UNIQUE NOT NULL,
    progress DECIMAL(5,2) CHECK (progress BETWEEN 0 AND 100),
    milestone TEXT
);
CREATE TRIGGER trig_agi_milestone_trackers_updated_at BEFORE UPDATE ON agi_milestone_trackers FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_agi_milestone_trackers_tracker_id ON agi_milestone_trackers(tracker_id);

CREATE TABLE IF NOT EXISTS user_transparency_dashboards (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    dashboard_id TEXT UNIQUE NOT NULL,
    view JSONB NOT NULL,
    user_id INTEGER REFERENCES users(id)
);
CREATE TRIGGER trig_user_transparency_dashboards_updated_at BEFORE UPDATE ON user_transparency_dashboards FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_user_transparency_dashboards_dashboard_id ON user_transparency_dashboards(dashboard_id);
-- Phase 8: Pillars 26-28 – Assumes Phases 1-7 tables exist (e.g., forecasting_models).
-- Precision: Quantum probs/decimals. Scalability: Partitioning on dates. AI: Vectors/RLHF. Adjacents: Impacts/links.

-- Pillar 26: Quantum Uncertainty Modeling – Adapted QC for ag/equine yields, fuzzy/hybrid uncertainty.

CREATE TABLE IF NOT EXISTS quantum_sim_nodes (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    node_id TEXT UNIQUE NOT NULL,
    probabilistic_data JSONB NOT NULL,
    ag_quantum_yield DECIMAL(5,4) CHECK (ag_quantum_yield BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_quantum_sim_nodes_updated_at BEFORE UPDATE ON quantum_sim_nodes FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_quantum_sim_nodes_node_id ON quantum_sim_nodes(node_id);

CREATE TABLE IF NOT EXISTS uncertainty_forecast_models (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    model_id TEXT UNIQUE NOT NULL,
    forecast JSONB NOT NULL,
    hybrid_fuzzy_level DECIMAL(5,4) CHECK (hybrid_fuzzy_level BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_uncertainty_forecast_models_updated_at BEFORE UPDATE ON uncertainty_forecast_models FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_uncertainty_forecast_models_model_id ON uncertainty_forecast_models(model_id);

CREATE TABLE IF NOT EXISTS probabilistic_outcome_chains (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    chain_id TEXT UNIQUE NOT NULL,
    outcome JSONB NOT NULL,
    prob DECIMAL(5,4) CHECK (prob BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_probabilistic_outcome_chains_updated_at BEFORE UPDATE ON probabilistic_outcome_chains FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_probabilistic_outcome_chains_chain_id ON probabilistic_outcome_chains(chain_id);

CREATE TABLE IF NOT EXISTS quantum_risk_assessments (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    assessment_id TEXT UNIQUE NOT NULL,
    risk JSONB NOT NULL,
    quantum_prob DECIMAL(5,4) CHECK (quantum_prob BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_quantum_risk_assessments_updated_at BEFORE UPDATE ON quantum_risk_assessments FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_quantum_risk_assessments_assessment_id ON quantum_risk_assessments(assessment_id);

CREATE TABLE IF NOT EXISTS black_swan_predictors (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    predictor_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    quantum_impact DECIMAL(5,4) CHECK (quantum_impact BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_black_swan_predictors_updated_at BEFORE UPDATE ON black_swan_predictors FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_black_swan_predictors_predictor_id ON black_swan_predictors(predictor_id);

CREATE TABLE IF NOT EXISTS multi_verse_scenario_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    log_id TEXT UNIQUE NOT NULL,
    scenario JSONB NOT NULL,
    verse_count INTEGER
);
CREATE TRIGGER trig_multi_verse_scenario_logs_updated_at BEFORE UPDATE ON multi_verse_scenario_logs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_multi_verse_scenario_logs_log_id ON multi_verse_scenario_logs(log_id);

CREATE TABLE IF NOT EXISTS quantum_ethics_filters (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    filter_id TEXT UNIQUE NOT NULL,
    ethics_level TEXT NOT NULL,
    quantum_bias DECIMAL(5,4) CHECK (quantum_bias BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_quantum_ethics_filters_updated_at BEFORE UPDATE ON quantum_ethics_filters FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_quantum_ethics_filters_filter_id ON quantum_ethics_filters(filter_id);

CREATE TABLE IF NOT EXISTS compute_quantum_allocations (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    allocation_id TEXT UNIQUE NOT NULL,
    resource TEXT NOT NULL,
    qubit_count INTEGER
);
CREATE TRIGGER trig_compute_quantum_allocations_updated_at BEFORE UPDATE ON compute_quantum_allocations FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_compute_quantum_allocations_allocation_id ON compute_quantum_allocations(allocation_id);

CREATE TABLE IF NOT EXISTS validation_quantum_datasets (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    dataset_id TEXT UNIQUE NOT NULL,
    validation JSONB NOT NULL,
    qc_accuracy DECIMAL(5,4) CHECK (qc_accuracy BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_validation_quantum_datasets_updated_at BEFORE UPDATE ON validation_quantum_datasets FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_validation_quantum_datasets_dataset_id ON validation_quantum_datasets(dataset_id);

CREATE TABLE IF NOT EXISTS inter_dimensional_uncertainty_maps (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    map_id TEXT UNIQUE NOT NULL,
    dimension TEXT NOT NULL,
    uncertainty JSONB NOT NULL
);
CREATE TRIGGER trig_inter_dimensional_uncertainty_maps_updated_at BEFORE UPDATE ON inter_dimensional_uncertainty_maps FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_inter_dimensional_uncertainty_maps_map_id ON inter_dimensional_uncertainty_maps(map_id);

-- Pillar 27: Metaverse Equine Economies – NFT/VR breeding/tourism, game dev integrations.

CREATE TABLE IF NOT EXISTS vr_asset_valuations (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    asset_id TEXT UNIQUE NOT NULL,
    value DECIMAL(15,2) NOT NULL,
    vr_platform TEXT
);
CREATE TRIGGER trig_vr_asset_valuations_updated_at BEFORE UPDATE ON vr_asset_valuations FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_vr_asset_valuations_asset_id ON vr_asset_valuations(asset_id);

CREATE TABLE IF NOT EXISTS metaverse_horse_twins (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    twin_id TEXT UNIQUE NOT NULL,
    horse_id INTEGER REFERENCES horses(id) ON DELETE CASCADE NOT NULL,
    virtual_genetics JSONB
);
CREATE TRIGGER trig_metaverse_horse_twins_updated_at BEFORE UPDATE ON metaverse_horse_twins FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_metaverse_horse_twins_twin_id ON metaverse_horse_twins(twin_id);

CREATE TABLE IF NOT EXISTS virtual_event_simulations (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    sim_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    outcome JSONB
);
CREATE TRIGGER trig_virtual_event_simulations_updated_at BEFORE UPDATE ON virtual_event_simulations FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_virtual_event_simulations_sim_id ON virtual_event_simulations(sim_id);

CREATE TABLE IF NOT EXISTS nft_pedigree_chains (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    chain_id TEXT UNIQUE NOT NULL,
    nft_id TEXT NOT NULL,
    blockchain TEXT
);
CREATE TRIGGER trig_nft_pedigree_chains_updated_at BEFORE UPDATE ON nft_pedigree_chains FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_nft_pedigree_chains_chain_id ON nft_pedigree_chains(chain_id);

CREATE TABLE IF NOT EXISTS metaverse_tourism_links (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    link_id TEXT UNIQUE NOT NULL,
    tour_type TEXT NOT NULL,
    engagement DECIMAL(10,2)
);
CREATE TRIGGER trig_metaverse_tourism_links_updated_at BEFORE UPDATE ON metaverse_tourism_links FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_metaverse_tourism_links_link_id ON metaverse_tourism_links(link_id);

CREATE TABLE IF NOT EXISTS digital_economy_predictors (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    predictor_id TEXT UNIQUE NOT NULL,
    economy_type TEXT NOT NULL,
    forecast DECIMAL(15,2)
);
CREATE TRIGGER trig_digital_economy_predictors_updated_at BEFORE UPDATE ON digital_economy_predictors FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_digital_economy_predictors_predictor_id ON digital_economy_predictors(predictor_id);

CREATE TABLE IF NOT EXISTS vr_hobby_networks (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    network_id TEXT UNIQUE NOT NULL,
    hobby TEXT NOT NULL,
    vr_integration_level TEXT
);
CREATE TRIGGER trig_vr_hobby_networks_updated_at BEFORE UPDATE ON vr_hobby_networks FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_vr_hobby_networks_network_id ON vr_hobby_networks(network_id);

CREATE TABLE IF NOT EXISTS metaverse_regulatory_models (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    model_id TEXT UNIQUE NOT NULL,
    reg_type TEXT NOT NULL,
    compliance_score DECIMAL(3,1)
);
CREATE TRIGGER trig_metaverse_regulatory_models_updated_at BEFORE UPDATE ON metaverse_regulatory_models FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_metaverse_regulatory_models_model_id ON metaverse_regulatory_models(model_id);

CREATE TABLE IF NOT EXISTS user_avatar_profiles (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    profile_id TEXT UNIQUE NOT NULL,
    avatar_data JSONB NOT NULL,
    customization_level TEXT
);
CREATE TRIGGER trig_user_avatar_profiles_updated_at BEFORE UPDATE ON user_avatar_profiles FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_user_avatar_profiles_profile_id ON user_avatar_profiles(profile_id);

CREATE TABLE IF NOT EXISTS inter_world_capture_pipelines (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    pipeline_id TEXT UNIQUE NOT NULL,
    world_type TEXT NOT NULL,
    capture_data JSONB
);
CREATE TRIGGER trig_inter_world_capture_pipelines_updated_at BEFORE UPDATE ON inter_world_capture_pipelines FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_inter_world_capture_pipelines_pipeline_id ON inter_world_capture_pipelines(pipeline_id);

-- Pillar 28: Regulatory Foresight Engine – AI-driven reg predictions for ag/equine.

CREATE TABLE IF NOT EXISTS global_reg_forecasts (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    forecast_id TEXT UNIQUE NOT NULL,
    reg_type TEXT NOT NULL,
    probability DECIMAL(5,4) CHECK (probability BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_global_reg_forecasts_updated_at BEFORE UPDATE ON global_reg_forecasts FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_global_reg_forecasts_forecast_id ON global_reg_forecasts(forecast_id);

CREATE TABLE IF NOT EXISTS law_change_predictors (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    predictor_id TEXT UNIQUE NOT NULL,
    change_description TEXT NOT NULL,
    ai_reg_focus BOOLEAN DEFAULT FALSE
);
CREATE TRIGGER trig_law_change_predictors_updated_at BEFORE UPDATE ON law_change_predictors FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_law_change_predictors_predictor_id ON law_change_predictors(predictor_id);

CREATE TABLE IF NOT EXISTS compliance_ripple_models (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    model_id TEXT UNIQUE NOT NULL,
    ripple JSONB NOT NULL,
    impact_on_ag DECIMAL(10,2)
);
CREATE TRIGGER trig_compliance_ripple_models_updated_at BEFORE UPDATE ON compliance_ripple_models FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_compliance_ripple_models_model_id ON compliance_ripple_models(model_id);

CREATE TABLE IF NOT EXISTS adjacents_reg_chains (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    chain_id TEXT UNIQUE NOT NULL,
    adj_type TEXT NOT NULL,
    chain_data JSONB
);
CREATE TRIGGER trig_adjacents_reg_chains_updated_at BEFORE UPDATE ON adjacents_reg_chains FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_adjacents_reg_chains_chain_id ON adjacents_reg_chains(chain_id);

CREATE TABLE IF NOT EXISTS ethical_law_fusion (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fusion_id TEXT UNIQUE NOT NULL,
    impact TEXT NOT NULL,
    fusion_score DECIMAL(5,4) CHECK (fusion_score BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_ethical_law_fusion_updated_at BEFORE UPDATE ON ethical_law_fusion FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_ethical_law_fusion_fusion_id ON ethical_law_fusion(fusion_id);

CREATE TABLE IF NOT EXISTS foresight_audit_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    log_id TEXT UNIQUE NOT NULL,
    audit_details TEXT NOT NULL
);
CREATE TRIGGER trig_foresight_audit_logs_updated_at BEFORE UPDATE ON foresight_audit_logs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_foresight_audit_logs_log_id ON foresight_audit_logs(log_id);

CREATE TABLE IF NOT EXISTS policy_impact_sims (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    sim_id TEXT UNIQUE NOT NULL,
    impact JSONB NOT NULL,
    sim_probability DECIMAL(5,4) CHECK (sim_probability BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_policy_impact_sims_updated_at BEFORE UPDATE ON policy_impact_sims FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_policy_impact_sims_sim_id ON policy_impact_sims(sim_id);

CREATE TABLE IF NOT EXISTS regulatory_hobby_ties (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tie_id TEXT UNIQUE NOT NULL,
    hobby TEXT NOT NULL,
    reg_impact TEXT
);
CREATE TRIGGER trig_regulatory_hobby_ties_updated_at BEFORE UPDATE ON regulatory_hobby_ties FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_regulatory_hobby_ties_tie_id ON regulatory_hobby_ties(tie_id);

CREATE TABLE IF NOT EXISTS inter_national_compliance_maps (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    map_id TEXT UNIQUE NOT NULL,
    nation TEXT NOT NULL,
    compliance_data JSONB NOT NULL
);
CREATE TRIGGER trig_inter_national_compliance_maps_updated_at BEFORE UPDATE ON inter_national_compliance_maps FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_inter_national_compliance_maps_map_id ON inter_national_compliance_maps(map_id);

CREATE TABLE IF NOT EXISTS foresight_kpis (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    kpi_id TEXT UNIQUE NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    accuracy DECIMAL(5,4) CHECK (accuracy BETWEEN 0 AND 1)
);
CREATE TRIGGER trig_foresight_kpis_updated_at BEFORE UPDATE ON foresight_kpis FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_foresight_kpis_kpi_id ON foresight_kpis(kpi_id);
-- Pillar 30: Subscription & Transaction Management – Assumes prior pillars (e.g., users, deal_transactions).
-- Precision: DECIMALS/fees, ENUMs for tiers. Scalability: Partitioning on dates. AI: Vectors for upsells. Adjacents: Impacts for ag/tourism.

CREATE TABLE IF NOT EXISTS subscription_tiers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tier_type TEXT NOT NULL CHECK (tier_type IN ('free', 'basic', 'pro', 'business')),
    monthly_price DECIMAL(5,2) NOT NULL,
    question_limit INTEGER,
    features JSONB NOT NULL
);
CREATE TRIGGER trig_subscription_tiers_updated_at BEFORE UPDATE ON subscription_tiers FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_subscription_tiers_tier_type ON subscription_tiers(tier_type);

CREATE TABLE IF NOT EXISTS user_subscriptions (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    tier_id INTEGER REFERENCES subscription_tiers(id) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    auto_bump_date DATE,
    opt_in_auto_bump BOOLEAN DEFAULT FALSE,
    payment_method TEXT CHECK (payment_method IN ('iap_apple', 'iap_google', 'stripe', 'other'))
);
CREATE TRIGGER trig_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);

CREATE TABLE IF NOT EXISTS question_usage_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    query_text TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    cost DECIMAL(5,4) DEFAULT 0.03,
    upsell_triggered BOOLEAN DEFAULT FALSE
) PARTITION BY RANGE (timestamp);
CREATE TRIGGER trig_question_usage_logs_updated_at BEFORE UPDATE ON question_usage_logs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_question_usage_logs_user_id ON question_usage_logs(user_id);
CREATE INDEX idx_question_usage_logs_timestamp ON question_usage_logs(timestamp);

CREATE TABLE IF NOT EXISTS upsell_predictions (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    prediction_score DECIMAL(5,4) CHECK (prediction_score BETWEEN 0 AND 1),
    upsell_embedding VECTOR(384),
    recommended_tier TEXT CHECK (recommended_tier IN ('basic', 'pro'))
);
CREATE TRIGGER trig_upsell_predictions_updated_at BEFORE UPDATE ON upsell_predictions FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_upsell_predictions_user_id ON upsell_predictions(user_id);
CREATE INDEX idx_upsell_predictions_embedding ON upsell_predictions USING hnsw (upsell_embedding vector_cosine_ops);

CREATE TABLE IF NOT EXISTS transaction_commissions (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deal_id INTEGER REFERENCES deal_transactions(id) ON DELETE CASCADE NOT NULL,
    order_amount DECIMAL(12,2) NOT NULL,
    commission DECIMAL(12,2) NOT NULL CHECK (commission <= 100),
    buyer_pays_fees BOOLEAN DEFAULT TRUE,
    shipping DECIMAL(10,2),
    adjacency_type TEXT CHECK (adjacency_type IN ('agribusiness', 'tourism', 'other'))
);
CREATE TRIGGER trig_transaction_commissions_updated_at BEFORE UPDATE ON transaction_commissions FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_transaction_commissions_deal_id ON transaction_commissions(deal_id);

CREATE TABLE IF NOT EXISTS payment_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'completed', 'failed')),
    gateway TEXT NOT NULL,
    transaction_fee DECIMAL(5,2)
);
CREATE TRIGGER trig_payment_logs_updated_at BEFORE UPDATE ON payment_logs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_payment_logs_user_id ON payment_logs(user_id);

CREATE TABLE IF NOT EXISTS auto_bump_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    bump_date DATE NOT NULL,
    previous_tier TEXT,
    new_tier TEXT,
    consent_given BOOLEAN NOT NULL
);
CREATE TRIGGER trig_auto_bump_logs_updated_at BEFORE UPDATE ON auto_bump_logs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_auto_bump_logs_user_id ON auto_bump_logs(user_id);

CREATE TABLE IF NOT EXISTS report_generation_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    report_type TEXT NOT NULL CHECK (report_type IN ('performance', 'dam_produce', 'sire', 'maternal_grandsire', 'nicking', 'other')),
    generated_data JSONB NOT NULL,
    cost DECIMAL(5,2) DEFAULT 0.00
);
CREATE TRIGGER trig_report_generation_logs_updated_at BEFORE UPDATE ON report_generation_logs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_report_generation_logs_user_id ON report_generation_logs(user_id);

CREATE TABLE IF NOT EXISTS upsell_notifications (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    sent_via TEXT CHECK (sent_via IN ('twilio', 'mailgun', 'in_app')),
    response TEXT
);
CREATE TRIGGER trig_upsell_notifications_updated_at BEFORE UPDATE ON upsell_notifications FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_upsell_notifications_user_id ON upsell_notifications(user_id);

CREATE TABLE IF NOT EXISTS revenue_reinvestment_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    category TEXT CHECK (category IN ('marketing', 'compute', 'acquisitions', 'other')),
    date DATE NOT NULL
);
CREATE TRIGGER trig_revenue_reinvestment_logs_updated_at BEFORE UPDATE ON revenue_reinvestment_logs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_revenue_reinvestment_logs_date ON revenue_reinvestment_logs(date);
-- Pillar 32: Self-Healing & Code Intelligence – Assumes prior (e.g., system_logs).
-- Precision: Vectors for code embeddings. Scalability: Partitioning on logs. AI: RLHF for fixes. Adjacents: Impacts for ag/tourism code.

CREATE TABLE IF NOT EXISTS code_repos (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    repo_url TEXT NOT NULL UNIQUE,
    last_scan_date DATE
);
CREATE TRIGGER trig_code_repos_updated_at BEFORE UPDATE ON code_repos FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_code_repos_repo_url ON code_repos(repo_url);

CREATE TABLE IF NOT EXISTS code_flaw_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    file_name TEXT NOT NULL,
    flaw_type TEXT CHECK (flaw_type IN ('line_limit', 'missing_log', 'security', 'other')),
    description TEXT NOT NULL,
    line_number INTEGER,
    code_embedding VECTOR(384)
) PARTITION BY RANGE (created_at);
CREATE TRIGGER trig_code_flaw_logs_updated_at BEFORE UPDATE ON code_flaw_logs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_code_flaw_logs_file_name ON code_flaw_logs(file_name);
CREATE INDEX idx_code_flaw_logs_embedding ON code_flaw_logs USING hnsw (code_embedding vector_cosine_ops);

CREATE TABLE IF NOT EXISTS self_healing_actions (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    flaw_id INTEGER REFERENCES code_flaw_logs(id) ON DELETE CASCADE NOT NULL,
    suggested_fix TEXT NOT NULL,
    rlhf_feedback DECIMAL(5,4) CHECK (rlhf_feedback BETWEEN -1 AND 1),
    applied BOOLEAN DEFAULT FALSE
);
CREATE TRIGGER trig_self_healing_actions_updated_at BEFORE UPDATE ON self_healing_actions FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_self_healing_actions_flaw_id ON self_healing_actions(flaw_id);

CREATE TABLE IF NOT EXISTS notification_workers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    worker_type TEXT CHECK (worker_type IN ('twilio', 'email', 'in_app')),
    status TEXT CHECK (status IN ('active', 'failed')),
    last_run TIMESTAMP
);
CREATE TRIGGER trig_notification_workers_updated_at BEFORE UPDATE ON notification_workers FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_notification_workers_worker_type ON notification_workers(worker_type);

CREATE TABLE IF NOT EXISTS cron_schedules (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    cron_expression TEXT NOT NULL,
    task_name TEXT NOT NULL,
    last_execution TIMESTAMP,
    success BOOLEAN
);
CREATE TRIGGER trig_cron_schedules_updated_at BEFORE UPDATE ON cron_schedules FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_cron_schedules_task_name ON cron_schedules(task_name);

CREATE TABLE IF NOT EXISTS proactive_alerts (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    alert_type TEXT CHECK (alert_type IN ('flaw_detected', 'system_update', 'growth_milestone', 'other')),
    message TEXT NOT NULL,
    sent BOOLEAN DEFAULT FALSE
);
CREATE TRIGGER trig_proactive_alerts_updated_at BEFORE UPDATE ON proactive_alerts FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_proactive_alerts_user_id ON proactive_alerts(user_id);

CREATE TABLE IF NOT EXISTS kernel_configs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    config_type TEXT CHECK (config_type IN ('neo_fine_tune', 'rlhf_loop', 'other')),
    parameters JSONB NOT NULL,
    active BOOLEAN DEFAULT TRUE
);
CREATE TRIGGER trig_kernel_configs_updated_at BEFORE UPDATE ON kernel_configs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_kernel_configs_config_type ON kernel_configs(config_type);

CREATE TABLE IF NOT EXISTS self_improvement_loops (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    loop_type TEXT CHECK (loop_type IN ('code_fix', 'data_enrich', 'model_retrain', 'other')),
    input_data JSONB NOT NULL,
    output_fix TEXT,
    applied BOOLEAN DEFAULT FALSE
);
CREATE TRIGGER trig_self_improvement_loops_updated_at BEFORE UPDATE ON self_improvement_loops FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_self_improvement_loops_loop_type ON self_improvement_loops(loop_type);

CREATE TABLE IF NOT EXISTS worker_status (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    worker_id INTEGER REFERENCES notification_workers(id) ON DELETE CASCADE NOT NULL,
    load DECIMAL(5,2) CHECK (load BETWEEN 0 AND 100),
    last_heartbeat TIMESTAMP NOT NULL
);
CREATE TRIGGER trig_worker_status_updated_at BEFORE UPDATE ON worker_status FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_worker_status_worker_id ON worker_status(worker_id);

CREATE TABLE IF NOT EXISTS dynamic_column_requests (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    table_name TEXT NOT NULL,
    column_name TEXT NOT NULL,
    column_type TEXT NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    adjacency_impact TEXT
);
CREATE TRIGGER trig_dynamic_column_requests_updated_at BEFORE UPDATE ON dynamic_column_requests FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_dynamic_column_requests_table_name ON dynamic_column_requests(table_name);
