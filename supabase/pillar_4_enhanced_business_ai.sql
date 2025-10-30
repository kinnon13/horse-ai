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
CREATE INDEX idx_sustainable_funding_sources_source_id ON sustainable_funding_sources(source_id);