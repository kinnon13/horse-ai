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



