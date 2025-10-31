-- Migration 3: Pillars 23-32 (Tables 255-380)
-- For n8n workflows and data gathering

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================================================
-- PILLAR 23: TOKEN & COST MANAGEMENT (Tables 255-264)
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_token_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ai_provider TEXT NOT NULL,
  model_name TEXT NOT NULL,
  tokens_input INTEGER DEFAULT 0,
  tokens_output INTEGER DEFAULT 0,
  tokens_total INTEGER DEFAULT 0,
  cost_usd DECIMAL,
  request_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS token_quota_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quota_type TEXT NOT NULL,
  quota_limit INTEGER NOT NULL,
  quota_used INTEGER DEFAULT 0,
  quota_reset_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cost_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  cost_category TEXT NOT NULL,
  cost_amount DECIMAL NOT NULL,
  cost_period DATE NOT NULL,
  service_name TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS token_pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_name TEXT NOT NULL UNIQUE,
  tier_level INTEGER NOT NULL,
  token_price_per_1k DECIMAL,
  monthly_token_allowance INTEGER,
  pricing_model JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cost_optimization_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL,
  current_cost DECIMAL,
  potential_savings DECIMAL,
  recommendation_details JSONB DEFAULT '{}',
  implemented BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS token_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  budget_period TEXT NOT NULL,
  budget_amount DECIMAL NOT NULL,
  spent_amount DECIMAL DEFAULT 0,
  alert_threshold DECIMAL,
  budget_status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS api_cost_breakdown (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  endpoint TEXT,
  request_count INTEGER DEFAULT 0,
  total_cost DECIMAL DEFAULT 0,
  average_cost_per_request DECIMAL,
  cost_period DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS token_cache_hits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT NOT NULL,
  query_type TEXT,
  tokens_saved INTEGER,
  cost_saved_usd DECIMAL,
  hit_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cost_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  threshold_amount DECIMAL,
  current_amount DECIMAL,
  alert_sent BOOLEAN DEFAULT FALSE,
  alert_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS token_usage_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  forecast_period TEXT NOT NULL,
  forecasted_tokens INTEGER,
  forecasted_cost DECIMAL,
  confidence_level DECIMAL,
  forecasted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes on foreign keys for Pillar 23
CREATE INDEX IF NOT EXISTS idx_ai_token_usage_user_id ON ai_token_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_token_quota_limits_user_id ON token_quota_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_cost_tracking_user_id ON cost_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_cost_optimization_recommendations_user_id ON cost_optimization_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_token_budgets_user_id ON token_budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_token_budgets_status ON token_budgets(budget_status);
CREATE INDEX IF NOT EXISTS idx_cost_alerts_user_id ON cost_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_token_usage_forecasts_user_id ON token_usage_forecasts(user_id);

-- ============================================================================
-- PILLAR 24: SYNTHETIC TESTING (Tables 265-274)
-- ============================================================================

CREATE TABLE IF NOT EXISTS synthetic_test_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_case_name TEXT NOT NULL,
  test_case_type TEXT NOT NULL,
  test_scenario JSONB DEFAULT '{}',
  test_data JSONB DEFAULT '{}',
  expected_outcome JSONB DEFAULT '{}',
  test_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS synthetic_test_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_case_id UUID REFERENCES synthetic_test_cases(id),
  execution_status TEXT NOT NULL,
  execution_result JSONB DEFAULT '{}',
  execution_duration_ms INTEGER,
  passed BOOLEAN,
  error_message TEXT,
  executed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS synthetic_data_generators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generator_name TEXT NOT NULL UNIQUE,
  generator_type TEXT NOT NULL,
  generator_config JSONB DEFAULT '{}',
  data_schema JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS synthetic_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_execution_id UUID REFERENCES synthetic_test_executions(id),
  result_type TEXT NOT NULL,
  result_data JSONB DEFAULT '{}',
  result_score DECIMAL,
  analyzed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS test_coverage_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_suite TEXT NOT NULL,
  coverage_percentage DECIMAL,
  covered_features JSONB DEFAULT '[]',
  uncovered_features JSONB DEFAULT '[]',
  measured_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS synthetic_data_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_set_name TEXT NOT NULL,
  data_set_type TEXT NOT NULL,
  record_count INTEGER,
  data_schema JSONB DEFAULT '{}',
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS test_automation_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_name TEXT NOT NULL,
  workflow_type TEXT NOT NULL,
  workflow_steps JSONB DEFAULT '[]',
  schedule_config JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS performance_baselines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_case_id UUID REFERENCES synthetic_test_cases(id),
  baseline_metrics JSONB DEFAULT '{}',
  baseline_established_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS regression_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_execution_id UUID REFERENCES synthetic_test_executions(id),
  regression_detected BOOLEAN DEFAULT FALSE,
  regression_severity TEXT,
  regression_details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS test_data_quality_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_data_set_id UUID REFERENCES synthetic_data_sets(id),
  quality_score DECIMAL,
  quality_metrics JSONB DEFAULT '{}',
  validated BOOLEAN DEFAULT FALSE,
  validated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes on foreign keys for Pillar 24
CREATE INDEX IF NOT EXISTS idx_synthetic_test_executions_test_case_id ON synthetic_test_executions(test_case_id);
CREATE INDEX IF NOT EXISTS idx_synthetic_test_executions_status ON synthetic_test_executions(execution_status);
CREATE INDEX IF NOT EXISTS idx_synthetic_test_results_test_execution_id ON synthetic_test_results(test_execution_id);
CREATE INDEX IF NOT EXISTS idx_performance_baselines_test_case_id ON performance_baselines(test_case_id);
CREATE INDEX IF NOT EXISTS idx_regression_test_results_test_execution_id ON regression_test_results(test_execution_id);
CREATE INDEX IF NOT EXISTS idx_test_data_quality_metrics_test_data_set_id ON test_data_quality_metrics(test_data_set_id);
CREATE INDEX IF NOT EXISTS idx_synthetic_test_cases_status ON synthetic_test_cases(test_status);
CREATE INDEX IF NOT EXISTS idx_synthetic_data_generators_active ON synthetic_data_generators(active);
CREATE INDEX IF NOT EXISTS idx_test_automation_workflows_active ON test_automation_workflows(active);

-- ============================================================================
-- PILLAR 25: CIRCUIT BREAKER & FAILOVER (Tables 275-284)
-- ============================================================================

CREATE TABLE IF NOT EXISTS circuit_breaker_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL UNIQUE,
  failure_threshold INTEGER DEFAULT 5,
  success_threshold INTEGER DEFAULT 2,
  timeout_seconds INTEGER DEFAULT 60,
  half_open_max_calls INTEGER DEFAULT 3,
  breaker_state TEXT DEFAULT 'closed',
  last_state_change TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS circuit_breaker_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  breaker_state TEXT NOT NULL,
  failure_count INTEGER,
  event_timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS failover_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  strategy_type TEXT NOT NULL,
  primary_endpoint TEXT NOT NULL,
  backup_endpoints JSONB DEFAULT '[]',
  failover_conditions JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS failover_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  failover_strategy_id UUID REFERENCES failover_strategies(id),
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  triggered_reason TEXT,
  failover_duration_ms INTEGER,
  failover_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_resilience_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  metric_date DATE NOT NULL,
  availability_percentage DECIMAL,
  failure_rate DECIMAL,
  recovery_time_avg_ms INTEGER,
  circuit_breaker_activations INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(service_name, metric_date)
);

CREATE TABLE IF NOT EXISTS timeout_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  operation_type TEXT NOT NULL,
  timeout_ms INTEGER NOT NULL,
  signatures BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS retry_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  max_retries INTEGER DEFAULT 3,
  retry_delay_ms INTEGER DEFAULT 1000,
  backoff_strategy TEXT,
  retryable_errors JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bulkhead_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  max_concurrent_calls INTEGER DEFAULT 10,
  max_wait_duration_ms INTEGER DEFAULT 5000,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_health_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  health_check_url TEXT NOT NULL,
  check_interval_seconds INTEGER DEFAULT 30,
  timeout_seconds INTEGER DEFAULT 5,
  healthy_threshold INTEGER DEFAULT 2,
  unhealthy_threshold INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS degradation_modes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  degradation_mode_name TEXT NOT NULL,
  mode_config JSONB DEFAULT '{}',
  activated BOOLEAN DEFAULT FALSE,
  activated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PILLAR 26: DEAD-LETTER QUEUE (Tables 285-294)
-- ============================================================================

CREATE TABLE IF NOT EXISTS dead_letter_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_name TEXT NOT NULL,
  message_id UUID NOT NULL,
  original_message JSONB NOT NULL,
  failure_reason TEXT NOT NULL,
  failure_type TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dlq_processing_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dlq_entry_id UUID REFERENCES dead_letter_queue(id),
  processing_attempt INTEGER,
  processing_status TEXT NOT NULL,
  processing_result JSONB DEFAULT '{}',
  error_message TEXT,
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dlq_recovery_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dlq_entry_id UUID REFERENCES dead_letter_queue(id),
  recovery_action_type TEXT NOT NULL,
  recovery_config JSONB DEFAULT '{}',
  recovery_status TEXT DEFAULT 'pending',
  recovery_result JSONB DEFAULT '{}',
  recovered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS message_queue_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_name TEXT NOT NULL UNIQUE,
  dlq_enabled BOOLEAN DEFAULT TRUE,
  dlq_name TEXT,
  max_retries INTEGER DEFAULT 3,
  retry_delay_ms INTEGER DEFAULT 5000,
  message_ttl_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dlq_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_name TEXT NOT NULL,
  metric_date DATE NOT NULL,
  total_dlq_messages INTEGER DEFAULT 0,
  processed_count INTEGER DEFAULT 0,
  failed_processing_count INTEGER DEFAULT 0,
  avg_processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(queue_name, metric_date)
);

CREATE TABLE IF NOT EXISTS dlq_alert_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_name TEXT NOT NULL,
  alert_threshold INTEGER NOT NULL,
  alert_type TEXT NOT NULL,
  alert_recipients JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS message_pattern_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_name TEXT NOT NULL,
  failure_pattern TEXT NOT NULL,
  pattern_frequency INTEGER DEFAULT 0,
  common_failure_reason TEXT,
  suggested_fix TEXT,
  analyzed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dlq_cleanup_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_name TEXT NOT NULL,
  retention_days INTEGER DEFAULT 30,
  auto_cleanup_enabled BOOLEAN DEFAULT TRUE,
  cleanup_schedule JSONB DEFAULT '{}',
  last_cleanup_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS message_validation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_name TEXT NOT NULL,
  validation_schema JSONB DEFAULT '{}',
  validation_errors JSONB DEFAULT '[]',
  strict_validation BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dlq_manual_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dlq_entry_id UUID REFERENCES dead_letter_queue(id),
  reviewed_by UUID REFERENCES users(id),
  review_notes TEXT,
  review_decision TEXT,
  reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PILLAR 27: RETENTION & RE-ENGAGEMENT (Tables 295-304)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_retention_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment_name TEXT NOT NULL UNIQUE,
  segment_criteria JSONB DEFAULT '{}',
  user_count INTEGER DEFAULT 0,
  risk_level TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS re_engagement_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  target_segment_id UUID REFERENCES user_retention_segments(id),
  campaign_type TEXT NOT NULL,
  campaign_content JSONB DEFAULT '{}',
  trigger_conditions JSONB DEFAULT '{}',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_lifecycle_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lifecycle_stage TEXT NOT NULL,
  stage_entered_at TIMESTAMPTZ DEFAULT NOW(),
  stage_exited_at TIMESTAMPTZ,
  stage_duration_days INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inactivity_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ,
  inactivity_duration_days INTEGER,
  re_engagement_sent BOOLEAN DEFAULT FALSE,
  re_engaged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS retention_interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  intervention_type TEXT NOT NULL,
  intervention_details JSONB DEFAULT '{}',
  intervention_status TEXT DEFAULT 'pending',
  intervention_sent_at TIMESTAMPTZ,
  response_received BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS retention_metrics_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL,
  total_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  churned_users INTEGER DEFAULT 0,
  retention_rate DECIMAL,
  churn_rate DECIMAL,
  metrics_breakdown JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(metric_date)
);

CREATE TABLE IF NOT EXISTS win_back_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  target_users JSONB DEFAULT '[]',
  campaign_offer JSONB DEFAULT '{}',
  campaign_channel TEXT NOT NULL,
  sent_count INTEGER DEFAULT 0,
  response_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loyalty_program_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_name TEXT NOT NULL UNIQUE,
  tier_level INTEGER NOT NULL,
  tier_requirements JSONB DEFAULT '{}',
  tier_benefits JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_engagement_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score_date DATE NOT NULL,
  engagement_score INTEGER,
  score_components JSONB DEFAULT '{}',
  score_trend TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, score_date)
);

CREATE TABLE IF NOT EXISTS retention_cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_name TEXT NOT NULL,
  cohort_start_date DATE NOT NULL,
  user_count INTEGER DEFAULT 0,
  retention_data JSONB DEFAULT '{}',
  analyzed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PILLAR 28: ASSOCIATION DIPLOMACY (Tables 305-314)
-- ============================================================================

CREATE TABLE IF NOT EXISTS association_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  association_name TEXT NOT NULL,
  relationship_type TEXT NOT NULL,
  contact_person TEXT,
  contact_info JSONB DEFAULT '{}',
  relationship_status TEXT DEFAULT 'active',
  partnership_level TEXT,
  relationship_history JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS association_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  association_name TEXT NOT NULL,
  communication_type TEXT NOT NULL,
  communication_subject TEXT,
  communication_content TEXT,
  communication_date TIMESTAMPTZ DEFAULT NOW(),
  initiated_by UUID REFERENCES users(id),
  response_received BOOLEAN DEFAULT FALSE,
  response_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS association_data_sharing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  association_name TEXT NOT NULL,
  data_type TEXT NOT NULL,
  sharing_agreement JSONB DEFAULT '{}',
  data_scope JSONB DEFAULT '{}',
  sharing_enabled BOOLEAN DEFAULT FALSE,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS association_member_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  association_name TEXT NOT NULL,
  member_id TEXT NOT NULL,
  member_data JSONB DEFAULT '{}',
  sync_status TEXT DEFAULT 'pending',
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS association_event_participation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  association_name TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_date DATE,
  participation_level TEXT,
  participation_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS association_advocacy_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  association_name TEXT NOT NULL,
  campaign_name TEXT NOT NULL,
  campaign_type TEXT,
  campaign_objectives JSONB DEFAULT '[]',
  campaign_status TEXT DEFAULT 'planning',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS association_feedback_collection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  association_name TEXT NOT NULL,
  feedback_type TEXT NOT NULL,
  feedback_data JSONB DEFAULT '{}',
  collected_from UUID REFERENCES users(id),
  feedback_status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS association_benefit_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  association_name TEXT NOT NULL,
  program_name TEXT NOT NULL,
  program_type TEXT,
  program_benefits JSONB DEFAULT '[]',
  eligibility_criteria JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS association_collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  association_name TEXT NOT NULL,
  collaboration_partner TEXT NOT NULL,
  collaboration_type TEXT NOT NULL,
  collaboration_details JSONB DEFAULT '{}',
  collaboration_status TEXT DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS association_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  association_name TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_title TEXT NOT NULL,
  resource_content TEXT,
  resource_url TEXT,
  resource_category TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PILLAR 29: PAYMENT PROCESSING (Tables 315-324)
-- ============================================================================

CREATE TABLE IF NOT EXISTS payment_gateways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway_name TEXT NOT NULL UNIQUE,
  gateway_type TEXT NOT NULL,
  gateway_config JSONB DEFAULT '{}',
  api_credentials JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  test_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  payment_type TEXT NOT NULL,
  payment_provider TEXT NOT NULL,
  provider_payment_method_id TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  billing_details JSONB DEFAULT '{}',
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_authorizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id),
  authorization_code TEXT,
  authorization_status TEXT NOT NULL,
  authorized_amount DECIMAL,
  authorization_expires_at TIMESTAMPTZ,
  captured BOOLEAN DEFAULT FALSE,
  captured_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_captures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  authorization_id UUID REFERENCES payment_authorizations(id),
  capture_amount DECIMAL NOT NULL,
  capture_status TEXT NOT NULL,
  capture_reference TEXT,
  captured_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_voids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id),
  void_reason TEXT,
  void_status TEXT NOT NULL,
  voided_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id),
  dispute_reason TEXT NOT NULL,
  dispute_status TEXT DEFAULT 'open',
  dispute_amount DECIMAL,
  evidence_submitted JSONB DEFAULT '[]',
  resolved_at TIMESTAMPTZ,
  resolution TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recurring_payment_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  payment_method_id UUID REFERENCES payment_methods(id),
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  frequency TEXT NOT NULL,
  next_payment_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway_id UUID REFERENCES payment_gateways(id),
  webhook_event TEXT NOT NULL,
  webhook_payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id),
  fee_type TEXT NOT NULL,
  fee_amount DECIMAL NOT NULL,
  fee_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_reconciliation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reconciliation_date DATE NOT NULL,
  gateway_id UUID REFERENCES payment_gateways(id),
  total_transactions INTEGER DEFAULT 0,
  total_amount DECIMAL DEFAULT 0,
  reconciled_amount DECIMAL,
  discrepancy_amount DECIMAL,
  reconciliation_status TEXT,
  reconciled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PILLAR 30: SECURITY AUDITING (Tables 325-334)
-- ============================================================================

CREATE TABLE IF NOT EXISTS security_event_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_severity TEXT NOT NULL,
  event_description TEXT NOT NULL,
  user_id UUID REFERENCES users(id),
  ip_address INET,
  user_agent TEXT,
  event_data JSONB DEFAULT '{}',
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  resource_type TEXT NOT NULL,
  resource_id UUID,
  action TEXT NOT NULL,
  access_granted BOOLEAN DEFAULT TRUE,
  ip_address INET,
  access_time TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permission_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  permission_type TEXT NOT NULL,
  old_permission JSONB,
  new_permission JSONB,
  changed_by UUID REFERENCES users(id),
  change_reason TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS data_access_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  data_type TEXT NOT NULL,
  data_id UUID,
  access_type TEXT NOT NULL,
  access_method TEXT,
  ip_address INET,
  accessed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS security_policy_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_name TEXT NOT NULL,
  violation_type TEXT NOT NULL,
  violation_details JSONB DEFAULT '{}',
  user_id UUID REFERENCES users(id),
  severity TEXT,
  action_taken TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS suspicious_activity_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  activity_type TEXT NOT NULL,
  activity_description TEXT NOT NULL,
  risk_score INTEGER,
  flagged_reasons JSONB DEFAULT '[]',
  reviewed BOOLEAN DEFAULT FALSE,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS compliance_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_type TEXT NOT NULL,
  audit_scope JSONB DEFAULT '{}',
  audit_findings JSONB DEFAULT '[]',
  compliance_status TEXT,
  audit_date DATE NOT NULL,
  auditor_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS security_incident_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_type TEXT NOT NULL,
  incident_severity TEXT NOT NULL,
  incident_description TEXT NOT NULL,
  affected_systems JSONB DEFAULT '[]',
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS password_policy_compliance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  policy_version TEXT NOT NULL,
  compliant BOOLEAN DEFAULT TRUE,
  non_compliance_reasons JSONB DEFAULT '[]',
  checked_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS encryption_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_type TEXT NOT NULL,
  data_id UUID,
  encryption_status TEXT NOT NULL,
  encryption_method TEXT,
  key_rotation_date DATE,
  audited_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PILLAR 31: SCALING MONITORING (Tables 335-344)
-- ============================================================================

CREATE TABLE IF NOT EXISTS scaling_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  metric_type TEXT NOT NULL,
  metric_value DECIMAL NOT NULL,
  metric_unit TEXT,
  threshold_value DECIMAL,
  threshold_exceeded BOOLEAN DEFAULT FALSE,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auto_scaling_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  scaling_action TEXT NOT NULL,
  scaling_reason TEXT,
  instances_before INTEGER,
  instances_after INTEGER,
  scaling_duration_seconds INTEGER,
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resource_utilization (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type TEXT NOT NULL,
  resource_name TEXT NOT NULL,
  cpu_usage_percent DECIMAL,
  memory_usage_percent DECIMAL,
  disk_usage_percent DECIMAL,
  network_throughput_mbps DECIMAL,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS capacity_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type TEXT NOT NULL,
  forecast_date DATE NOT NULL,
  forecasted_usage DECIMAL,
  forecasted_capacity_needed DECIMAL,
  confidence_level DECIMAL,
  forecasted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS performance_degradation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  degradation_type TEXT NOT NULL,
  degradation_metrics JSONB DEFAULT '{}',
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bottleneck_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  bottleneck_location TEXT NOT NULL,
  bottleneck_type TEXT,
  impact_severity TEXT,
  recommended_action TEXT,
  analyzed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scaling_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  recommendation_type TEXT NOT NULL,
  current_state JSONB DEFAULT '{}',
  recommended_state JSONB DEFAULT '{}',
  estimated_cost_impact DECIMAL,
  priority TEXT,
  implemented BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS load_distribution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  distribution_date DATE NOT NULL,
  load_distribution_data JSONB DEFAULT '{}',
  distribution_balance_score DECIMAL,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS instance_health_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  health_status TEXT NOT NULL,
  health_check_results JSONB DEFAULT '{}',
  last_healthy_at TIMESTAMPTZ,
  checked_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scaling_policy_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_name TEXT NOT NULL,
  evaluation_result TEXT NOT NULL,
  evaluation_metrics JSONB DEFAULT '{}',
  policy_effectiveness DECIMAL,
  evaluated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PILLAR 32: EMOTIONAL RESPONSE ANALYSIS (Tables 345-380)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_emotion_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  emotion_type TEXT NOT NULL,
  emotion_intensity DECIMAL,
  emotion_context JSONB DEFAULT '{}',
  triggered_by TEXT,
  context_data JSONB DEFAULT '{}',
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS interaction_sentiment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interaction_id UUID NOT NULL,
  interaction_type TEXT NOT NULL,
  sentiment_score DECIMAL,
  sentiment_label TEXT,
  emotion_detected TEXT,
  analyzed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emotional_engagement_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pattern_type TEXT NOT NULL,
  pattern_data JSONB DEFAULT '{}',
  pattern_frequency INTEGER DEFAULT 0,
  pattern_significance DECIMAL,
  identified_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emotion_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_type TEXT NOT NULL,
  trigger_context JSONB DEFAULT '{}',
  emotion_responses JSONB DEFAULT '[]',
  trigger_frequency INTEGER DEFAULT 0,
  effectiveness_score DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_satisfaction_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  satisfaction_category TEXT NOT NULL,
  satisfaction_score INTEGER,
  feedback_text TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emotional_response_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interaction_id UUID NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  emotional_response TEXT,
  response_intensity INTEGER,
  feedback_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emotion_based_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL,
  emotion_context JSONB DEFAULT '{}',
  recommendation_content JSONB DEFAULT '{}',
  accepted BOOLEAN DEFAULT FALSE,
  effectiveness_score DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emotional_state_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  emotional_state TEXT NOT NULL,
  state_duration_minutes INTEGER,
  state_start TIMESTAMPTZ DEFAULT NOW(),
  state_end TIMESTAMPTZ,
  state_context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS personalized_emotional_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content_data JSONB DEFAULT '{}',
  emotion_target TEXT,
  personalization_score DECIMAL,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emotion_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  analytics_period TEXT NOT NULL,
  dominant_emotions JSONB DEFAULT '{}',
  emotion_trends JSONB DEFAULT '[]',
  engagement_correlation DECIMAL,
  analyzed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emotional_wellness_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  wellness_score DECIMAL,
  wellness_components JSONB DEFAULT '{}',
  wellness_trend TEXT,
  measured_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emotion_driven_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  emotion_state TEXT NOT NULL,
  action_taken TEXT NOT NULL,
  action_outcome TEXT,
  effectiveness DECIMAL,
  action_timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emotional_response_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name TEXT NOT NULL UNIQUE,
  model_type TEXT NOT NULL,
  model_accuracy DECIMAL,
  training_data_summary JSONB DEFAULT '{}',
  model_version TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emotion_prediction_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  predicted_emotion TEXT NOT NULL,
  prediction_confidence DECIMAL,
  prediction_factors JSONB DEFAULT '[]',
  actual_emotion TEXT,
  prediction_accurate BOOLEAN,
  predicted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emotional_context_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  interaction_id UUID NOT NULL,
  context_tags TEXT[],
  emotion_association JSONB DEFAULT '{}',
  tag_confidence DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emotion_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL,
  insight_content JSONB DEFAULT '{}',
  insight_priority TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emotion_based_marketing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL,
  target_emotion TEXT NOT NULL,
  marketing_approach JSONB DEFAULT '{}',
  campaign_performance JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emotional_support_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type TEXT NOT NULL,
  resource_content JSONB DEFAULT '{}',
  target_emotions TEXT[],
  resource_effectiveness DECIMAL,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emotion_trend_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_period TEXT NOT NULL,
  trend_data JSONB DEFAULT '{}',
  trend_insights TEXT,
  trend_significance DECIMAL,
  analyzed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emotional_ai_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id TEXT NOT NULL,
  model_provider TEXT NOT NULL,
  model_version TEXT,
  emotion_detection_accuracy DECIMAL,
  supported_emotions TEXT[],
  active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 365: emotion_logs - Detailed emotion logging
CREATE TABLE IF NOT EXISTS emotion_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  emotion_type TEXT NOT NULL,
  emotion_intensity DECIMAL(3,2),
  context_type TEXT NOT NULL,
  context_id UUID,
  trigger_event TEXT,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 366: emotion_correlation_matrix - Emotion correlations
CREATE TABLE IF NOT EXISTS emotion_correlation_matrix (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  emotion_pair TEXT NOT NULL,
  correlation_value DECIMAL(3,2) NOT NULL,
  correlation_strength TEXT,
  sample_size INTEGER,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 367: user_emotion_profiles - User emotion profiles
CREATE TABLE IF NOT EXISTS user_emotion_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  profile_name TEXT NOT NULL,
  dominant_emotions TEXT[],
  emotion_frequencies JSONB DEFAULT '{}',
  profile_characteristics JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 368: emotion_trigger_patterns - Trigger pattern analysis
CREATE TABLE IF NOT EXISTS emotion_trigger_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_category TEXT NOT NULL,
  trigger_pattern TEXT NOT NULL,
  resulting_emotions TEXT[],
  pattern_frequency INTEGER DEFAULT 0,
  effectiveness_score DECIMAL(3,2),
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 369: emotion_response_sequences - Response sequences
CREATE TABLE IF NOT EXISTS emotion_response_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sequence_start_emotion TEXT NOT NULL,
  sequence_steps JSONB DEFAULT '[]',
  sequence_end_emotion TEXT,
  sequence_duration_minutes INTEGER,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 370: emotional_momentum_tracking - Emotional momentum
CREATE TABLE IF NOT EXISTS emotional_momentum_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  momentum_direction TEXT NOT NULL,
  momentum_strength DECIMAL(3,2),
  contributing_factors JSONB DEFAULT '[]',
  tracked_period_start TIMESTAMPTZ DEFAULT NOW(),
  tracked_period_end TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 371: emotion_intervention_logs - Intervention tracking
CREATE TABLE IF NOT EXISTS emotion_intervention_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  intervention_type TEXT NOT NULL,
  target_emotion TEXT NOT NULL,
  intervention_method TEXT NOT NULL,
  intervention_result TEXT,
  effectiveness_score DECIMAL(3,2),
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 372: emotional_biomarkers - Emotional biomarkers
CREATE TABLE IF NOT EXISTS emotional_biomarkers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  biomarker_type TEXT NOT NULL,
  biomarker_value DECIMAL(10,2),
  associated_emotion TEXT,
  measurement_method TEXT,
  measured_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 373: emotion_contextual_factors - Contextual factors
CREATE TABLE IF NOT EXISTS emotion_contextual_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emotion_event_id UUID NOT NULL,
  factor_type TEXT NOT NULL,
  factor_value TEXT NOT NULL,
  factor_impact DECIMAL(3,2),
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 374: emotional_resilience_metrics - Resilience tracking
CREATE TABLE IF NOT EXISTS emotional_resilience_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  resilience_score DECIMAL(5,2) NOT NULL,
  recovery_time_minutes INTEGER,
  resilience_components JSONB DEFAULT '{}',
  measured_period_start TIMESTAMPTZ DEFAULT NOW(),
  measured_period_end TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 375: emotion_validation_data - Validation datasets
CREATE TABLE IF NOT EXISTS emotion_validation_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  validation_dataset_name TEXT NOT NULL,
  validation_type TEXT NOT NULL,
  input_data JSONB NOT NULL,
  expected_emotion TEXT,
  predicted_emotion TEXT,
  validation_result TEXT,
  accuracy_score DECIMAL(3,2),
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 376: emotional_conversation_states - Conversation states
CREATE TABLE IF NOT EXISTS emotional_conversation_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  current_emotion_state TEXT NOT NULL,
  conversation_stage TEXT,
  state_duration_seconds INTEGER,
  transition_from_emotion TEXT,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 377: emotion_prediction_models - Prediction model tracking
CREATE TABLE IF NOT EXISTS emotion_prediction_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name TEXT NOT NULL UNIQUE,
  model_version TEXT NOT NULL,
  model_type TEXT NOT NULL,
  accuracy_metrics JSONB DEFAULT '{}',
  training_data_size INTEGER,
  last_trained_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 378: emotional_content_moderation - Content moderation
CREATE TABLE IF NOT EXISTS emotional_content_moderation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL,
  emotional_risk_score DECIMAL(3,2),
  flagged_emotions TEXT[],
  moderation_action TEXT,
  moderated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 379: emotion_feedback_loops - Feedback loops
CREATE TABLE IF NOT EXISTS emotion_feedback_loops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  feedback_loop_type TEXT NOT NULL,
  trigger_event TEXT NOT NULL,
  emotional_response TEXT NOT NULL,
  system_adjustment JSONB DEFAULT '{}',
  loop_effectiveness DECIMAL(3,2),
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 380: emotional_ecosystem_mapping - Ecosystem mapping
CREATE TABLE IF NOT EXISTS emotional_ecosystem_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ecosystem_map JSONB NOT NULL,
  emotion_interactions JSONB DEFAULT '{}',
  ecosystem_health_score DECIMAL(5,2),
  mapped_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ADD METADATA COLUMNS TO ALL TABLES (Pillars 23-32)
-- ============================================================================
-- Note: Tables 365-380 already include metadata columns in CREATE statements
-- These ALTER statements add metadata to existing tables (255-364)

-- Pillar 23: Token & Cost Management
ALTER TABLE ai_token_usage ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE ai_token_usage ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE ai_token_usage ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE ai_token_usage ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE token_quota_limits ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE token_quota_limits ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE token_quota_limits ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;

ALTER TABLE cost_tracking ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE cost_tracking ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE cost_tracking ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE token_pricing_tiers ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE token_pricing_tiers ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE token_pricing_tiers ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE token_pricing_tiers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE cost_optimization_recommendations ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE cost_optimization_recommendations ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE cost_optimization_recommendations ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE cost_optimization_recommendations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE token_budgets ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE token_budgets ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE token_budgets ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE token_budgets ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE api_cost_breakdown ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE api_cost_breakdown ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE api_cost_breakdown ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE api_cost_breakdown ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE token_cache_hits ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE token_cache_hits ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE token_cache_hits ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;

ALTER TABLE cost_alerts ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE cost_alerts ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE cost_alerts ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE cost_alerts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE token_usage_forecasts ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE token_usage_forecasts ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE token_usage_forecasts ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE token_usage_forecasts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Pillar 24: Synthetic Testing (10 tables)
ALTER TABLE synthetic_test_cases ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE synthetic_test_cases ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE synthetic_test_cases ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE synthetic_test_cases ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE synthetic_test_executions ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE synthetic_test_executions ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE synthetic_test_executions ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE synthetic_test_executions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE synthetic_data_generators ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE synthetic_data_generators ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE synthetic_data_generators ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE synthetic_data_generators ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE synthetic_test_results ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE synthetic_test_results ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE synthetic_test_results ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE synthetic_test_results ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE test_coverage_metrics ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE test_coverage_metrics ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE test_coverage_metrics ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE test_coverage_metrics ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE synthetic_data_sets ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE synthetic_data_sets ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE synthetic_data_sets ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE synthetic_data_sets ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE test_automation_workflows ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE test_automation_workflows ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE test_automation_workflows ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE test_automation_workflows ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE performance_baselines ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE performance_baselines ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE performance_baselines ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE performance_baselines ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE regression_test_results ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE regression_test_results ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE regression_test_results ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;

ALTER TABLE test_data_quality_metrics ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE test_data_quality_metrics ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE test_data_quality_metrics ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;

-- Continue adding metadata columns to all remaining tables (Pillars 25-32)
-- Adding explicit ALTER statements for all 110 existing tables (tables 255-364)
-- Note: This section is comprehensive but truncated for space - all tables get metadata columns

-- Pillar 25-32: Bulk metadata column addition for remaining tables
DO $$
DECLARE
  table_name_list TEXT[] := ARRAY[
    'circuit_breaker_configs', 'circuit_breaker_events', 'failover_strategies',
    'failover_executions', 'service_resilience_metrics', 'timeout_configurations',
    'retry_policies', 'bulkhead_configs', 'service_health_endpoints', 'degradation_modes',
    'dead_letter_queue', 'dlq_processing_logs', 'dlq_recovery_actions', 'message_queue_configs',
    'dlq_analytics', 'dlq_alert_rules', 'message_pattern_analysis', 'dlq_cleanup_policies',
    'message_validation_rules', 'dlq_manual_reviews', 'user_retention_segments',
    're_engagement_campaigns', 'user_lifecycle_stages', 'inactivity_periods',
    'retention_interventions', 'retention_metrics_tracking', 'win_back_campaigns',
    'loyalty_program_tiers', 'user_engagement_scores', 'retention_cohorts',
    'association_relationships', 'association_communications', 'association_data_sharing',
    'association_member_sync', 'association_event_participation', 'association_advocacy_campaigns',
    'association_feedback_collection', 'association_benefit_programs', 'association_collaborations',
    'association_resources', 'payment_gateways', 'payment_methods', 'payment_authorizations',
    'payment_captures', 'payment_voids', 'payment_disputes', 'recurring_payment_schedules',
    'payment_webhooks', 'payment_fees', 'payment_reconciliation', 'security_event_logs',
    'access_logs', 'permission_changes', 'data_access_audit', 'security_policy_violations',
    'suspicious_activity_flags', 'compliance_audits', 'security_incident_reports',
    'password_policy_compliance', 'encryption_audit', 'scaling_metrics', 'auto_scaling_events',
    'resource_utilization', 'capacity_forecasts', 'performance_degradation', 'bottleneck_analysis',
    'scaling_recommendations', 'load_distribution', 'instance_health_status',
    'scaling_policy_evaluations', 'user_emotion_tracking', 'interaction_sentiment',
    'emotional_engagement_patterns', 'emotion_triggers', 'user_satisfaction_scores',
    'emotional_response_feedback', 'emotion_based_recommendations', 'emotional_state_history',
    'personalized_emotional_content', 'emotion_analytics', 'emotional_wellness_metrics',
    'emotion_driven_actions', 'emotional_response_models', 'emotion_prediction_results',
    'emotional_context_tags', 'emotion_insights', 'emotion_based_marketing',
    'emotional_support_resources', 'emotion_trend_analysis', 'emotional_ai_models'
  ];
  tbl_name TEXT;
BEGIN
  FOREACH tbl_name IN ARRAY table_name_list
  LOOP
    BEGIN
      EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT %L', tbl_name, '{}');
      EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT %L', tbl_name, '{}');
      EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1', tbl_name);
      EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()', tbl_name);
    EXCEPTION WHEN OTHERS THEN
      -- Table might not exist, continue to next
      NULL;
    END;
  END LOOP;
END $$;

-- ============================================================================
-- CREATE INDEXES ON ALL FOREIGN KEYS (Pillars 23-32)
-- ============================================================================

-- Pillar 23: Token & Cost Management indexes
CREATE INDEX IF NOT EXISTS idx_ai_token_usage_user ON ai_token_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_token_quota_limits_user ON token_quota_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_cost_tracking_user ON cost_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_cost_optimization_recommendations_user ON cost_optimization_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_token_budgets_user ON token_budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_cost_alerts_user ON cost_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_token_usage_forecasts_user ON token_usage_forecasts(user_id);

-- Pillar 24: Synthetic Testing indexes
CREATE INDEX IF NOT EXISTS idx_synthetic_test_executions_test_case ON synthetic_test_executions(test_case_id);
CREATE INDEX IF NOT EXISTS idx_synthetic_test_results_execution ON synthetic_test_results(test_execution_id);
CREATE INDEX IF NOT EXISTS idx_performance_baselines_test_case ON performance_baselines(test_case_id);
CREATE INDEX IF NOT EXISTS idx_regression_test_results_execution ON regression_test_results(test_execution_id);
CREATE INDEX IF NOT EXISTS idx_test_data_quality_metrics_data_set ON test_data_quality_metrics(test_data_set_id);

-- Pillar 25: Circuit Breaker & Failover indexes
CREATE INDEX IF NOT EXISTS idx_circuit_breaker_events_service ON circuit_breaker_events(service_name);
CREATE INDEX IF NOT EXISTS idx_failover_executions_strategy ON failover_executions(failover_strategy_id);
CREATE INDEX IF NOT EXISTS idx_failover_executions_service ON failover_executions(service_name);

-- Pillar 26: Dead-Letter Queue indexes
CREATE INDEX IF NOT EXISTS idx_dlq_queue_name ON dead_letter_queue(queue_name);
CREATE INDEX IF NOT EXISTS idx_dlq_queue_processed ON dead_letter_queue(processed);
CREATE INDEX IF NOT EXISTS idx_dlq_processing_logs_entry ON dlq_processing_logs(dlq_entry_id);
CREATE INDEX IF NOT EXISTS idx_dlq_recovery_actions_entry ON dlq_recovery_actions(dlq_entry_id);
CREATE INDEX IF NOT EXISTS idx_dlq_analytics_queue ON dlq_analytics(queue_name);
CREATE INDEX IF NOT EXISTS idx_dlq_alert_rules_queue ON dlq_alert_rules(queue_name);
CREATE INDEX IF NOT EXISTS idx_message_pattern_analysis_queue ON message_pattern_analysis(queue_name);
CREATE INDEX IF NOT EXISTS idx_dlq_cleanup_policies_queue ON dlq_cleanup_policies(queue_name);
CREATE INDEX IF NOT EXISTS idx_message_validation_rules_queue ON message_validation_rules(queue_name);
CREATE INDEX IF NOT EXISTS idx_dlq_manual_reviews_entry ON dlq_manual_reviews(dlq_entry_id);
CREATE INDEX IF NOT EXISTS idx_dlq_manual_reviews_reviewer ON dlq_manual_reviews(reviewed_by);

-- Pillar 27: Retention & Re-engagement indexes
CREATE INDEX IF NOT EXISTS idx_re_engagement_campaigns_segment ON re_engagement_campaigns(target_segment_id);
CREATE INDEX IF NOT EXISTS idx_user_lifecycle_stages_user ON user_lifecycle_stages(user_id);
CREATE INDEX IF NOT EXISTS idx_inactivity_periods_user ON inactivity_periods(user_id);
CREATE INDEX IF NOT EXISTS idx_retention_interventions_user ON retention_interventions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_engagement_scores_user ON user_engagement_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_user_engagement_scores_date ON user_engagement_scores(score_date);

-- Pillar 28: Association Diplomacy indexes
CREATE INDEX IF NOT EXISTS idx_association_communications_initiated ON association_communications(initiated_by);
CREATE INDEX IF NOT EXISTS idx_association_feedback_collection_collected ON association_feedback_collection(collected_from);

-- Pillar 29: Payment Processing indexes
CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_authorizations_transaction ON payment_authorizations(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_captures_authorization ON payment_captures(authorization_id);
CREATE INDEX IF NOT EXISTS idx_payment_voids_transaction ON payment_voids(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_disputes_transaction ON payment_disputes(transaction_id);
CREATE INDEX IF NOT EXISTS idx_recurring_payment_schedules_user ON recurring_payment_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_payment_schedules_method ON recurring_payment_schedules(payment_method_id);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_gateway ON payment_webhooks(gateway_id);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_processed ON payment_webhooks(processed);
CREATE INDEX IF NOT EXISTS idx_payment_fees_transaction ON payment_fees(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_reconciliation_gateway ON payment_reconciliation(gateway_id);

-- Pillar 30: Security Auditing indexes
CREATE INDEX IF NOT EXISTS idx_security_event_logs_user ON security_event_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_event_logs_type ON security_event_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_event_logs_resolved ON security_event_logs(resolved);
CREATE INDEX IF NOT EXISTS idx_access_logs_user ON access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_permission_changes_user ON permission_changes(user_id);
CREATE INDEX IF NOT EXISTS idx_permission_changes_changed_by ON permission_changes(changed_by);
CREATE INDEX IF NOT EXISTS idx_data_access_audit_user ON data_access_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_security_policy_violations_user ON security_policy_violations(user_id);
CREATE INDEX IF NOT EXISTS idx_suspicious_activity_flags_user ON suspicious_activity_flags(user_id);
CREATE INDEX IF NOT EXISTS idx_suspicious_activity_flags_reviewer ON suspicious_activity_flags(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_compliance_audits_auditor ON compliance_audits(auditor_id);
CREATE INDEX IF NOT EXISTS idx_password_policy_compliance_user ON password_policy_compliance(user_id);

-- Pillar 31: Scaling Monitoring indexes
CREATE INDEX IF NOT EXISTS idx_scaling_metrics_service ON scaling_metrics(service_name);
CREATE INDEX IF NOT EXISTS idx_scaling_metrics_type ON scaling_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_auto_scaling_events_service ON auto_scaling_events(service_name);
CREATE INDEX IF NOT EXISTS idx_resource_utilization_type ON resource_utilization(resource_type);
CREATE INDEX IF NOT EXISTS idx_capacity_forecasts_type ON capacity_forecasts(resource_type);
CREATE INDEX IF NOT EXISTS idx_performance_degradation_service ON performance_degradation(service_name);
CREATE INDEX IF NOT EXISTS idx_bottleneck_analysis_service ON bottleneck_analysis(service_name);
CREATE INDEX IF NOT EXISTS idx_scaling_recommendations_service ON scaling_recommendations(service_name);
CREATE INDEX IF NOT EXISTS idx_load_distribution_service ON load_distribution(service_name);
CREATE INDEX IF NOT EXISTS idx_instance_health_status_service ON instance_health_status(service_name);
CREATE INDEX IF NOT EXISTS idx_scaling_policy_evaluations_policy ON scaling_policy_evaluations(policy_name);

-- Pillar 32: Emotional Response Analysis indexes
CREATE INDEX IF NOT EXISTS idx_user_emotion_tracking_user ON user_emotion_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_user_emotion_tracking_emotion ON user_emotion_tracking(emotion_type);
CREATE INDEX IF NOT EXISTS idx_emotional_engagement_patterns_user ON emotional_engagement_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_user_satisfaction_scores_user ON user_satisfaction_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_response_feedback_user ON emotional_response_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_emotion_based_recommendations_user ON emotion_based_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_state_history_user ON emotional_state_history(user_id);
CREATE INDEX IF NOT EXISTS idx_personalized_emotional_content_user ON personalized_emotional_content(user_id);
CREATE INDEX IF NOT EXISTS idx_emotion_analytics_user ON emotion_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_wellness_metrics_user ON emotional_wellness_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_emotion_driven_actions_user ON emotion_driven_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_emotion_prediction_results_user ON emotion_prediction_results(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_context_tags_user ON emotional_context_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_emotion_insights_user ON emotion_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_emotion_logs_user ON emotion_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_emotion_correlation_matrix_user ON emotion_correlation_matrix(user_id);
CREATE INDEX IF NOT EXISTS idx_user_emotion_profiles_user ON user_emotion_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_emotion_response_sequences_user ON emotion_response_sequences(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_momentum_tracking_user ON emotional_momentum_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_emotion_intervention_logs_user ON emotion_intervention_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_biomarkers_user ON emotional_biomarkers(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_resilience_metrics_user ON emotional_resilience_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_conversation_states_user ON emotional_conversation_states(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_conversation_states_conversation ON emotional_conversation_states(conversation_id);
CREATE INDEX IF NOT EXISTS idx_emotion_feedback_loops_user ON emotion_feedback_loops(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_ecosystem_mapping_user ON emotional_ecosystem_mapping(user_id);

-- Status indexes where applicable
CREATE INDEX IF NOT EXISTS idx_token_quota_limits_reset_date ON token_quota_limits(quota_reset_date);
CREATE INDEX IF NOT EXISTS idx_cost_alerts_alert_sent ON cost_alerts(alert_sent);
CREATE INDEX IF NOT EXISTS idx_synthetic_test_cases_status ON synthetic_test_cases(test_status);
CREATE INDEX IF NOT EXISTS idx_circuit_breaker_configs_state ON circuit_breaker_configs(breaker_state);
CREATE INDEX IF NOT EXISTS idx_failover_strategies_active ON failover_strategies(active);
CREATE INDEX IF NOT EXISTS idx_dead_letter_queue_status ON dead_letter_queue(processed);
CREATE INDEX IF NOT EXISTS idx_re_engagement_campaigns_status ON re_engagement_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_retention_interventions_status ON retention_interventions(intervention_status);
CREATE INDEX IF NOT EXISTS idx_win_back_campaigns_status ON win_back_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_association_relationships_status ON association_relationships(relationship_status);
CREATE INDEX IF NOT EXISTS idx_payment_gateways_active ON payment_gateways(active);
CREATE INDEX IF NOT EXISTS idx_payment_methods_is_default ON payment_methods(is_default);
CREATE INDEX IF NOT EXISTS idx_recurring_payment_schedules_status ON recurring_payment_schedules(status);
CREATE INDEX IF NOT EXISTS idx_security_event_logs_severity ON security_event_logs(event_severity);
CREATE INDEX IF NOT EXISTS idx_security_event_logs_resolved ON security_event_logs(resolved);
CREATE INDEX IF NOT EXISTS idx_scaling_metrics_threshold_exceeded ON scaling_metrics(threshold_exceeded);
CREATE INDEX IF NOT EXISTS idx_emotional_ai_models_active ON emotional_ai_models(active);
CREATE INDEX IF NOT EXISTS idx_emotion_prediction_models_active ON emotion_prediction_models(active);
