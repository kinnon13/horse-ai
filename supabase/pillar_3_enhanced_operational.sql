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



