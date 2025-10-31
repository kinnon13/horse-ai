-- Migration 2: Pillars 12-22 (Tables 128-254)
-- For n8n workflows and data gathering

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================================================
-- PILLAR 12: SECURITY & COMPLIANCE (Tables 128-137)
-- ============================================================================

CREATE TABLE IF NOT EXISTS security_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  security_event TEXT NOT NULL,
  severity TEXT,
  ip_address INET,
  user_agent TEXT,
  audit_data JSONB DEFAULT '{}',
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS access_control_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  permission_level TEXT NOT NULL,
  granted_by UUID REFERENCES users(id),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS data_privacy_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL,
  request_data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS encryption_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name TEXT NOT NULL UNIQUE,
  key_type TEXT NOT NULL,
  encrypted_key TEXT NOT NULL,
  key_rotation_date TIMESTAMPTZ,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS compliance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  compliance_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  compliance_status TEXT,
  requirements_met JSONB DEFAULT '[]',
  last_verified_at TIMESTAMPTZ,
  next_verification_date DATE,
  verified_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS security_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_name TEXT NOT NULL UNIQUE,
  policy_type TEXT NOT NULL,
  policy_rules JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS authentication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  auth_method TEXT NOT NULL,
  success BOOLEAN DEFAULT TRUE,
  ip_address INET,
  user_agent TEXT,
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS session_security (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ip_address INET,
  device_fingerprint TEXT,
  suspicious_activity BOOLEAN DEFAULT FALSE,
  blocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS data_retention_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_type TEXT NOT NULL,
  retention_period_days INTEGER NOT NULL,
  deletion_strategy TEXT,
  last_cleanup_at TIMESTAMPTZ,
  next_cleanup_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gdpr_compliance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL,
  consent_given BOOLEAN DEFAULT FALSE,
  consent_date TIMESTAMPTZ,
  consent_withdrawn_at TIMESTAMPTZ,
  consent_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PILLAR 13: MULTI-AI AGENTS (Tables 138-147)
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_agent_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL UNIQUE,
  agent_type TEXT NOT NULL,
  model_provider TEXT,
  model_name TEXT,
  config_parameters JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_agent_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES ai_agent_configs(id),
  session_context JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_agent_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES ai_agent_sessions(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES ai_agent_configs(id),
  input_data JSONB DEFAULT '{}',
  output_data JSONB DEFAULT '{}',
  processing_time_ms INTEGER,
  tokens_used INTEGER,
  cost DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_agent_consensus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID NOT NULL,
  query_text TEXT NOT NULL,
  agent_responses JSONB DEFAULT '[]',
  consensus_result JSONB DEFAULT '{}',
  confidence_score DECIMAL,
  agreed_agents INTEGER,
  total_agents INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_agent_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES ai_agent_configs(id),
  metric_name TEXT NOT NULL,
  metric_value DECIMAL,
  metric_unit TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_agent_failures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES ai_agent_configs(id),
  failure_type TEXT NOT NULL,
  error_message TEXT,
  input_data JSONB DEFAULT '{}',
  retry_attempt INTEGER DEFAULT 0,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_agent_routing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_type TEXT NOT NULL,
  agent_id UUID REFERENCES ai_agent_configs(id),
  priority INTEGER DEFAULT 0,
  routing_conditions JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_agent_learning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES ai_agent_configs(id),
  learning_type TEXT NOT NULL,
  learning_data JSONB DEFAULT '{}',
  improvement_metric DECIMAL,
  applied BOOLEAN DEFAULT FALSE,
  applied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_agent_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_name TEXT NOT NULL,
  workflow_steps JSONB DEFAULT '[]',
  agent_sequence JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_agent_coordination (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coordination_id UUID NOT NULL,
  participating_agents JSONB DEFAULT '[]',
  coordination_strategy TEXT,
  result JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PILLAR 14: VISION & SOUND LEARNING (Tables 148-162)
-- ============================================================================

CREATE TABLE IF NOT EXISTS image_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  horse_id UUID REFERENCES horses(id),
  image_url TEXT NOT NULL,
  image_type TEXT,
  image_metadata JSONB DEFAULT '{}',
  embedding VECTOR(384),
  analyzed BOOLEAN DEFAULT FALSE,
  analyzed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS image_analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_id UUID REFERENCES image_uploads(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,
  analysis_results JSONB DEFAULT '{}',
  confidence_score DECIMAL,
  ai_model TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS video_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  horse_id UUID REFERENCES horses(id),
  video_url TEXT NOT NULL,
  video_type TEXT,
  duration_seconds INTEGER,
  video_metadata JSONB DEFAULT '{}',
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS video_frames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES video_uploads(id) ON DELETE CASCADE,
  frame_number INTEGER,
  frame_timestamp DECIMAL,
  frame_url TEXT,
  frame_analysis JSONB DEFAULT '{}',
  embedding VECTOR(384),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS video_analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES video_uploads(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,
  analysis_results JSONB DEFAULT '{}',
  confidence_score DECIMAL,
  ai_model TEXT,
  processing_time_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audio_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  horse_id UUID REFERENCES horses(id),
  audio_url TEXT NOT NULL,
  audio_type TEXT,
  duration_seconds INTEGER,
  audio_metadata JSONB DEFAULT '{}',
  transcribed BOOLEAN DEFAULT FALSE,
  transcribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audio_transcriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audio_id UUID REFERENCES audio_uploads(id) ON DELETE CASCADE,
  transcription_text TEXT,
  confidence_score DECIMAL,
  language TEXT,
  speaker_diarization JSONB DEFAULT '[]',
  ai_model TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audio_analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audio_id UUID REFERENCES audio_uploads(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,
  analysis_results JSONB DEFAULT '{}',
  confidence_score DECIMAL,
  ai_model TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID NOT NULL,
  media_type TEXT NOT NULL,
  embedding VECTOR(384),
  embedding_model TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_similarity_search (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_media_id UUID NOT NULL,
  query_media_type TEXT NOT NULL,
  similar_media_id UUID NOT NULL,
  similar_media_type TEXT NOT NULL,
  similarity_score DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS visual_pattern_recognition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_id UUID REFERENCES image_uploads(id),
  pattern_type TEXT NOT NULL,
  pattern_data JSONB DEFAULT '{}',
  detected_objects JSONB DEFAULT '[]',
  bounding_boxes JSONB DEFAULT '[]',
  confidence_score DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sound_pattern_recognition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audio_id UUID REFERENCES audio_uploads(id),
  pattern_type TEXT NOT NULL,
  pattern_data JSONB DEFAULT '{}',
  detected_sounds JSONB DEFAULT '[]',
  confidence_score DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_processing_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID NOT NULL,
  media_type TEXT NOT NULL,
  processing_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  priority INTEGER DEFAULT 0,
  processing_started_at TIMESTAMPTZ,
  processing_completed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_learning_dataset (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID NOT NULL,
  media_type TEXT NOT NULL,
  label TEXT,
  labeled_by UUID REFERENCES users(id),
  training_data JSONB DEFAULT '{}',
  used_for_training BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PILLAR 15: BREEDING & GENETICS (Tables 163-172)
-- ============================================================================

CREATE TABLE IF NOT EXISTS breeding_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sire_id UUID REFERENCES horses(id),
  dam_id UUID REFERENCES horses(id),
  breeding_date DATE,
  breeding_type TEXT,
  breeding_method TEXT,
  location TEXT,
  veterinarian_id UUID REFERENCES veterinarians(id),
  success BOOLEAN,
  resulting_foal_id UUID REFERENCES horses(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS genetic_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  test_type TEXT NOT NULL,
  test_date DATE NOT NULL,
  lab_name TEXT,
  test_results JSONB DEFAULT '{}',
  genetic_markers JSONB DEFAULT '[]',
  inherited_traits JSONB DEFAULT '[]',
  disease_carriers JSONB DEFAULT '[]',
  report_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pedigree_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  generation INTEGER NOT NULL,
  ancestor_position TEXT NOT NULL,
  ancestor_id UUID REFERENCES horses(id),
  ancestor_name TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS breeding_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sire_id UUID REFERENCES horses(id),
  dam_id UUID REFERENCES horses(id),
  recommendation_score DECIMAL,
  recommendation_factors JSONB DEFAULT '[]',
  expected_traits JSONB DEFAULT '[]',
  genetic_compatibility DECIMAL,
  accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stud_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stallion_id UUID REFERENCES horses(id),
  stud_fee DECIMAL,
  booking_status TEXT DEFAULT 'available',
  booking_terms JSONB DEFAULT '{}',
  live_foal_guarantee BOOLEAN DEFAULT FALSE,
  breeding_season_start DATE,
  breeding_season_end DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS breeding_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stallion_owner_id UUID REFERENCES users(id),
  mare_owner_id UUID REFERENCES users(id),
  stallion_id UUID REFERENCES horses(id),
  mare_id UUID REFERENCES horses(id),
  contract_terms JSONB DEFAULT '{}',
  stud_fee DECIMAL,
  payment_status TEXT,
  breeding_date DATE,
  contract_status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS embryo_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  breeding_record_id UUID REFERENCES breeding_records(id),
  donor_mare_id UUID REFERENCES horses(id),
  recipient_mare_id UUID REFERENCES horses(id),
  transfer_date DATE,
  veterinarian_id UUID REFERENCES veterinarians(id),
  success BOOLEAN,
  resulting_foal_id UUID REFERENCES horses(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS genetic_lineage_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,
  lineage_data JSONB DEFAULT '{}',
  coefficient_of_inbreeding DECIMAL,
  genetic_diversity_score DECIMAL,
  notable_ancestors JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS breeding_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_name TEXT NOT NULL,
  program_owner_id UUID REFERENCES users(id),
  program_goals JSONB DEFAULT '[]',
  target_traits JSONB DEFAULT '[]',
  participating_horses JSONB DEFAULT '[]',
  program_status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS offspring_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  breeding_record_id UUID REFERENCES breeding_records(id),
  foal_id UUID REFERENCES horses(id),
  birth_date DATE,
  birth_weight DECIMAL,
  birth_location TEXT,
  health_status TEXT,
  registration_applied BOOLEAN DEFAULT FALSE,
  registration_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PILLAR 16: TRAINING & PERFORMANCE (Tables 173-182)
-- ============================================================================

CREATE TABLE IF NOT EXISTS training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  trainer_id UUID REFERENCES users(id),
  session_date DATE NOT NULL,
  session_type TEXT,
  session_duration_minutes INTEGER,
  activities JSONB DEFAULT '[]',
  notes TEXT,
  performance_rating INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS training_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_name TEXT NOT NULL,
  horse_id UUID REFERENCES horses(id),
  trainer_id UUID REFERENCES users(id),
  program_type TEXT,
  program_goals JSONB DEFAULT '[]',
  program_schedule JSONB DEFAULT '{}',
  start_date DATE,
  end_date DATE,
  program_status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  metric_type TEXT NOT NULL,
  metric_value DECIMAL,
  metric_unit TEXT,
  measurement_method TEXT,
  recorded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS competition_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  competition_id UUID,
  competition_name TEXT,
  competition_date DATE,
  discipline TEXT,
  placement INTEGER,
  score DECIMAL,
  prize_money DECIMAL,
  performance_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS training_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL,
  milestone_description TEXT,
  milestone_date DATE,
  achieved BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skill_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  assessor_id UUID REFERENCES users(id),
  assessment_date DATE NOT NULL,
  skills_evaluated JSONB DEFAULT '[]',
  skill_ratings JSONB DEFAULT '{}',
  overall_rating INTEGER,
  recommendations TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exercise_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  plan_type TEXT,
  exercises JSONB DEFAULT '[]',
  schedule JSONB DEFAULT '{}',
  start_date DATE,
  end_date DATE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS training_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_session_id UUID REFERENCES training_sessions(id),
  video_url TEXT NOT NULL,
  video_type TEXT,
  analysis_results JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS training_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_session_id UUID REFERENCES training_sessions(id),
  note_type TEXT,
  note_content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS performance_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  trend_period TEXT NOT NULL,
  trend_data JSONB DEFAULT '{}',
  improvement_rate DECIMAL,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PILLAR 17: FEED & NUTRITION (Tables 183-192)
-- ============================================================================

CREATE TABLE IF NOT EXISTS feeding_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  schedule_name TEXT,
  feeding_times JSONB DEFAULT '[]',
  daily_rations JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT TRUE,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feed_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_name TEXT NOT NULL UNIQUE,
  feed_category TEXT,
  nutritional_info JSONB DEFAULT '{}',
  ingredients JSONB DEFAULT '[]',
  manufacturer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feed_consumption (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  feed_type_id UUID REFERENCES feed_types(id),
  feeding_date DATE NOT NULL,
  amount_kg DECIMAL,
  feeding_time TIMESTAMPTZ,
  consumed BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nutritional_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  requirement_period TEXT,
  daily_requirements JSONB DEFAULT '{}',
  calculated_date DATE,
  calculated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS supplement_regimens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  supplement_name TEXT NOT NULL,
  supplement_type TEXT,
  dosage TEXT,
  frequency TEXT,
  start_date DATE,
  end_date DATE,
  prescribed_by UUID REFERENCES users(id),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feed_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  feed_type_id UUID REFERENCES feed_types(id),
  quantity_kg DECIMAL,
  purchase_date DATE,
  expiry_date DATE,
  storage_location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feeding_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  feeding_date DATE NOT NULL,
  meals JSONB DEFAULT '[]',
  total_intake_kg DECIMAL,
  water_intake_liters DECIMAL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nutritional_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  analysis_date DATE NOT NULL,
  current_diet JSONB DEFAULT '[]',
  nutritional_balance JSONB DEFAULT '{}',
  deficiencies JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  analyzed_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS weight_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  weight_kg DECIMAL NOT NULL,
  measured_date DATE NOT NULL,
  measurement_method TEXT,
  body_condition_score INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feed_suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_name TEXT NOT NULL,
  contact_info JSONB DEFAULT '{}',
  feed_products JSONB DEFAULT '[]',
  pricing JSONB DEFAULT '{}',
  reliability_rating DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PILLAR 18: COMPETITIONS & EVENTS (Tables 193-202)
-- ============================================================================

CREATE TABLE IF NOT EXISTS competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_name TEXT NOT NULL,
  competition_type TEXT,
  discipline TEXT,
  start_date DATE,
  end_date DATE,
  location_city TEXT,
  location_state TEXT,
  location_venue TEXT,
  organizer_id UUID REFERENCES users(id),
  registration_deadline DATE,
  entry_fee DECIMAL,
  prize_money DECIMAL,
  competition_status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS competition_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  horse_id UUID REFERENCES horses(id),
  rider_id UUID REFERENCES users(id),
  registration_date DATE,
  division TEXT,
  class_name TEXT,
  registration_status TEXT DEFAULT 'pending',
  payment_status TEXT,
  withdrawal_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID,
  event_type TEXT,
  schedule_date DATE NOT NULL,
  schedule_time TIMESTAMPTZ,
  event_name TEXT,
  location TEXT,
  participants JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS competition_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  class_name TEXT NOT NULL,
  class_level TEXT,
  entry_requirements JSONB DEFAULT '{}',
  prize_structure JSONB DEFAULT '[]',
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL,
  participant_id UUID NOT NULL,
  participant_type TEXT,
  result_position INTEGER,
  result_score DECIMAL,
  result_data JSONB DEFAULT '{}',
  prize_awarded DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_judges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL,
  judge_id UUID REFERENCES users(id),
  judge_role TEXT,
  judge_credentials JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS competition_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  competition_record JSONB DEFAULT '{}',
  total_wins INTEGER DEFAULT 0,
  total_placements INTEGER DEFAULT 0,
  total_earnings DECIMAL DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL,
  media_type TEXT NOT NULL,
  media_url TEXT NOT NULL,
  media_title TEXT,
  captured_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS competition_seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_name TEXT NOT NULL,
  season_year INTEGER NOT NULL,
  season_start_date DATE,
  season_end_date DATE,
  disciplines JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL,
  attendee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  attendee_role TEXT,
  registration_date DATE,
  checked_in BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PILLAR 19: FINANCIAL & BILLING (Tables 203-212)
-- ============================================================================

CREATE TABLE IF NOT EXISTS billing_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  cycle_start_date DATE NOT NULL,
  cycle_end_date DATE NOT NULL,
  total_charges DECIMAL DEFAULT 0,
  total_payments DECIMAL DEFAULT 0,
  balance DECIMAL DEFAULT 0,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  plan_type TEXT,
  total_amount DECIMAL NOT NULL,
  installment_amount DECIMAL,
  installment_count INTEGER,
  payment_frequency TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS financial_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  statement_type TEXT NOT NULL,
  statement_period_start DATE,
  statement_period_end DATE,
  income DECIMAL DEFAULT 0,
  expenses DECIMAL DEFAULT 0,
  net_amount DECIMAL,
  statement_data JSONB DEFAULT '{}',
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name TEXT NOT NULL UNIQUE,
  category_type TEXT,
  parent_category_id UUID REFERENCES expense_categories(id),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expense_date DATE NOT NULL,
  expense_category_id UUID REFERENCES expense_categories(id),
  amount DECIMAL NOT NULL,
  description TEXT,
  vendor TEXT,
  receipt_url TEXT,
  horse_id UUID REFERENCES horses(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS income_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  income_date DATE NOT NULL,
  income_type TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  description TEXT,
  source TEXT,
  horse_id UUID REFERENCES horses(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tax_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tax_year INTEGER NOT NULL,
  tax_type TEXT,
  total_income DECIMAL,
  total_expenses DECIMAL,
  deductible_expenses DECIMAL,
  tax_documents JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS financial_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  goal_name TEXT NOT NULL,
  goal_type TEXT,
  target_amount DECIMAL,
  current_amount DECIMAL DEFAULT 0,
  target_date DATE,
  goal_status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS budget_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  budget_period TEXT NOT NULL,
  category_allocations JSONB DEFAULT '{}',
  total_budget DECIMAL,
  spent_amount DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS financial_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL,
  report_period_start DATE,
  report_period_end DATE,
  report_data JSONB DEFAULT '{}',
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PILLAR 20: USER FEEDBACK & REVIEWS (Tables 213-222)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reviewed_entity_type TEXT NOT NULL,
  reviewed_entity_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  helpful_count INTEGER DEFAULT 0,
  verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS review_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES user_reviews(id) ON DELETE CASCADE,
  responder_id UUID REFERENCES users(id),
  response_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feedback_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  feedback_type TEXT NOT NULL,
  feedback_category TEXT,
  feedback_text TEXT NOT NULL,
  feedback_data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'new',
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rating_distributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  rating_1_count INTEGER DEFAULT 0,
  rating_2_count INTEGER DEFAULT 0,
  rating_3_count INTEGER DEFAULT 0,
  rating_4_count INTEGER DEFAULT 0,
  rating_5_count INTEGER DEFAULT 0,
  average_rating DECIMAL,
  total_reviews INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(entity_type, entity_id)
);

CREATE TABLE IF NOT EXISTS review_helpfulness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES user_reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  helpful BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

CREATE TABLE IF NOT EXISTS feedback_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name TEXT NOT NULL UNIQUE,
  category_description TEXT,
  parent_category_id UUID REFERENCES feedback_categories(id),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feedback_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id UUID REFERENCES feedback_submissions(id),
  sentiment_score DECIMAL,
  sentiment_label TEXT,
  key_topics JSONB DEFAULT '[]',
  action_items JSONB DEFAULT '[]',
  analyzed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS review_moderation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES user_reviews(id) ON DELETE CASCADE,
  moderation_status TEXT DEFAULT 'pending',
  moderation_reason TEXT,
  moderated_by UUID REFERENCES users(id),
  moderated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feedback_prioritization (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id UUID REFERENCES feedback_submissions(id),
  priority_score DECIMAL,
  priority_level TEXT,
  estimated_impact JSONB DEFAULT '{}',
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS review_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  statistic_date DATE NOT NULL,
  statistics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(entity_type, entity_id, statistic_date)
);

-- ============================================================================
-- PILLAR 21: PARTNERSHIPS & ASSOCIATIONS (Tables 223-232)
-- ============================================================================

CREATE TABLE IF NOT EXISTS partnerships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_name TEXT NOT NULL,
  partner_type TEXT,
  partnership_agreement JSONB DEFAULT '{}',
  partnership_start_date DATE,
  partnership_end_date DATE,
  partnership_status TEXT DEFAULT 'active',
  contact_info JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS association_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  association_name TEXT NOT NULL,
  membership_type TEXT,
  membership_number TEXT,
  membership_start_date DATE,
  membership_end_date DATE,
  membership_status TEXT DEFAULT 'active',
  membership_level TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS partnership_benefits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partnership_id UUID REFERENCES partnerships(id) ON DELETE CASCADE,
  benefit_type TEXT NOT NULL,
  benefit_description TEXT,
  benefit_value DECIMAL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS partnership_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partnership_id UUID REFERENCES partnerships(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(partnership_id, metric_date)
);

CREATE TABLE IF NOT EXISTS association_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  association_name TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_date DATE,
  event_location TEXT,
  event_type TEXT,
  member_only BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS partnership_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partnership_id UUID REFERENCES partnerships(id) ON DELETE CASCADE,
  referrer_id UUID REFERENCES users(id),
  referred_user_id UUID REFERENCES users(id),
  referral_status TEXT DEFAULT 'pending',
  reward_issued BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS partnership_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partnership_id UUID REFERENCES partnerships(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content_data JSONB DEFAULT '{}',
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS association_directories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  association_name TEXT NOT NULL,
  directory_entry JSONB DEFAULT '{}',
  listing_status TEXT DEFAULT 'active',
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS partnership_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partnership_id UUID REFERENCES partnerships(id) ON DELETE CASCADE,
  contract_type TEXT NOT NULL,
  contract_terms JSONB DEFAULT '{}',
  contract_document_url TEXT,
  signed_date DATE,
  expiry_date DATE,
  contract_status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS partnership_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partnership_id UUID REFERENCES partnerships(id) ON DELETE CASCADE,
  communication_type TEXT NOT NULL,
  communication_subject TEXT,
  communication_content TEXT,
  sent_to TEXT[],
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PILLAR 22: SELF-HEALING & RELIABILITY (Tables 233-242)
-- ============================================================================

CREATE TABLE IF NOT EXISTS system_health_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  check_name TEXT NOT NULL,
  check_type TEXT NOT NULL,
  check_status TEXT NOT NULL,
  check_result JSONB DEFAULT '{}',
  response_time_ms INTEGER,
  error_message TEXT,
  checked_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auto_recovery_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_condition TEXT NOT NULL,
  recovery_action TEXT NOT NULL,
  action_status TEXT DEFAULT 'pending',
  action_result JSONB DEFAULT '{}',
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_degradation_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  alert_type TEXT NOT NULL,
  severity TEXT,
  degradation_metrics JSONB DEFAULT '{}',
  acknowledged BOOLEAN DEFAULT FALSE,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS redundancy_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  redundancy_type TEXT NOT NULL,
  backup_instances INTEGER,
  failover_strategy TEXT,
  health_check_interval INTEGER,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS self_healing_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_type TEXT NOT NULL,
  issue_description TEXT,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  healing_action TEXT,
  healing_status TEXT,
  resolved_at TIMESTAMPTZ,
  resolution_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reliability_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  metric_date DATE NOT NULL,
  uptime_percentage DECIMAL,
  downtime_seconds INTEGER,
  error_rate DECIMAL,
  response_time_avg_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(service_name, metric_date)
);

CREATE TABLE IF NOT EXISTS failover_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  failover_type TEXT NOT NULL,
  primary_instance TEXT,
  failover_instance TEXT,
  failover_reason TEXT,
  failover_duration_ms INTEGER,
  failover_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS backup_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_id UUID NOT NULL,
  backup_type TEXT NOT NULL,
  verification_status TEXT,
  verification_result JSONB DEFAULT '{}',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_restoration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restoration_type TEXT NOT NULL,
  restoration_target TEXT NOT NULL,
  restoration_status TEXT,
  restoration_steps JSONB DEFAULT '[]',
  restoration_started_at TIMESTAMPTZ,
  restoration_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS preventive_maintenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  maintenance_type TEXT NOT NULL,
  scheduled_date DATE,
  maintenance_performed BOOLEAN DEFAULT FALSE,
  maintenance_performed_at TIMESTAMPTZ,
  maintenance_notes TEXT,
  next_scheduled_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PILLAR 12: SECURITY & COMPLIANCE
-- ============================================================================

-- Foreign key indexes
CREATE INDEX IF NOT EXISTS idx_security_audits_entity ON security_audits(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_access_control_user ON access_control_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_access_control_resource ON access_control_lists(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_data_privacy_user ON data_privacy_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_compliance_entity ON compliance_records(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_compliance_verified_by ON compliance_records(verified_by);
CREATE INDEX IF NOT EXISTS idx_authentication_logs_user ON authentication_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_session_security_user ON session_security(user_id);
CREATE INDEX IF NOT EXISTS idx_gdpr_compliance_user ON gdpr_compliance(user_id);

-- Status indexes
CREATE INDEX IF NOT EXISTS idx_security_audits_resolved ON security_audits(resolved);
CREATE INDEX IF NOT EXISTS idx_data_privacy_status ON data_privacy_requests(status);
CREATE INDEX IF NOT EXISTS idx_compliance_status ON compliance_records(compliance_status);
CREATE INDEX IF NOT EXISTS idx_security_policies_active ON security_policies(active);
CREATE INDEX IF NOT EXISTS idx_authentication_logs_success ON authentication_logs(success);
CREATE INDEX IF NOT EXISTS idx_session_security_blocked ON session_security(blocked);
CREATE INDEX IF NOT EXISTS idx_gdpr_consent_given ON gdpr_compliance(consent_given);

-- Metadata columns for Pillar 12
ALTER TABLE security_audits ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE security_audits ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE security_audits ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE access_control_lists ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE access_control_lists ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE access_control_lists ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE data_privacy_requests ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE data_privacy_requests ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE data_privacy_requests ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE encryption_keys ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE encryption_keys ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE encryption_keys ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE compliance_records ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE compliance_records ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE compliance_records ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE security_policies ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE security_policies ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE security_policies ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE authentication_logs ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE authentication_logs ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE authentication_logs ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE session_security ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE session_security ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE session_security ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE data_retention_policies ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE data_retention_policies ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE data_retention_policies ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE gdpr_compliance ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE gdpr_compliance ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE gdpr_compliance ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;

-- ============================================================================
-- INDEXES FOR PILLAR 13: MULTI-AI AGENTS
-- ============================================================================

-- Foreign key indexes
CREATE INDEX IF NOT EXISTS idx_ai_agent_sessions_user ON ai_agent_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_sessions_agent ON ai_agent_sessions(agent_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_interactions_session ON ai_agent_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_interactions_agent ON ai_agent_interactions(agent_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_performance_agent ON ai_agent_performance(agent_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_failures_agent ON ai_agent_failures(agent_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_routing_agent ON ai_agent_routing(agent_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_learning_agent ON ai_agent_learning(agent_id);

-- Status indexes
CREATE INDEX IF NOT EXISTS idx_ai_agent_configs_active ON ai_agent_configs(active);
CREATE INDEX IF NOT EXISTS idx_ai_agent_failures_resolved ON ai_agent_failures(resolved);
CREATE INDEX IF NOT EXISTS idx_ai_agent_routing_active ON ai_agent_routing(active);
CREATE INDEX IF NOT EXISTS idx_ai_agent_learning_applied ON ai_agent_learning(applied);
CREATE INDEX IF NOT EXISTS idx_ai_agent_workflows_active ON ai_agent_workflows(active);

-- Metadata columns for Pillar 13
ALTER TABLE ai_agent_configs ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE ai_agent_configs ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE ai_agent_configs ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE ai_agent_sessions ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE ai_agent_sessions ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE ai_agent_sessions ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE ai_agent_interactions ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE ai_agent_interactions ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE ai_agent_interactions ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE ai_agent_consensus ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE ai_agent_consensus ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE ai_agent_consensus ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE ai_agent_performance ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE ai_agent_performance ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE ai_agent_performance ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE ai_agent_failures ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE ai_agent_failures ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE ai_agent_failures ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE ai_agent_routing ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE ai_agent_routing ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE ai_agent_routing ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE ai_agent_learning ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE ai_agent_learning ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE ai_agent_learning ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE ai_agent_workflows ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE ai_agent_workflows ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE ai_agent_workflows ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;
ALTER TABLE ai_agent_coordination ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE ai_agent_coordination ADD COLUMN IF NOT EXISTS extended_data JSONB DEFAULT '{}';
ALTER TABLE ai_agent_coordination ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1;

-- Additional performance indexes
CREATE INDEX IF NOT EXISTS idx_security_audits_created ON security_audits(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_agent_interactions_created ON ai_agent_interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_agent_performance_recorded ON ai_agent_performance(recorded_at);
