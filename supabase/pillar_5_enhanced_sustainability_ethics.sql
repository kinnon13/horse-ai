-- Phase 5: Pillars 13-16 – Assumes Phases 1-4 tables exist (e.g., horses, businesses).
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
