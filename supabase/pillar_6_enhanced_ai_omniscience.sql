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
