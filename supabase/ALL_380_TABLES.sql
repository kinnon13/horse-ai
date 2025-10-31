-- Migration 1: Pillars 1-11 (Tables 1-127)
-- For n8n workflows and data gathering

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================================================
-- PILLAR 1: HORSES (Tables 1-15)
-- ============================================================================

CREATE TABLE IF NOT EXISTS horses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  registered_name TEXT,
  barn_name TEXT,
  breed TEXT,
  color TEXT,
  gender TEXT CHECK (gender IN ('mare', 'stallion', 'gelding', 'filly', 'colt')),
  birth_date DATE,
  height_hands DECIMAL(3,1),
  weight_lbs INTEGER,
  owner_id UUID REFERENCES users(id),
  breeder_id UUID REFERENCES users(id),
  sire_id UUID REFERENCES horses(id),
  dam_id UUID REFERENCES horses(id),
  registration_number TEXT,
  microchip_number TEXT,
  passport_number TEXT,
  photos JSONB DEFAULT '[]',
  markings JSONB DEFAULT '{}',
  dna_profile JSONB,
  embedding VECTOR(384),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS horse_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  discipline TEXT,
  special_talents TEXT[],
  personality_traits TEXT[],
  training_level TEXT,
  competition_history JSONB DEFAULT '[]',
  health_summary JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS horse_registry_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  registry_name TEXT NOT NULL,
  registry_number TEXT,
  registration_date DATE,
  registration_status TEXT,
  documents JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS horse_bloodlines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  generation INTEGER,
  ancestor_id UUID REFERENCES horses(id),
  relationship_type TEXT,
  lineage_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS horse_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_type TEXT,
  caption TEXT,
  taken_date DATE,
  photographer TEXT,
  embedding VECTOR(384),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS horse_markings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  marking_type TEXT,
  location TEXT,
  description TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS horse_identifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  identifier_type TEXT NOT NULL,
  identifier_value TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS horse_ownership_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES users(id),
  ownership_start DATE,
  ownership_end DATE,
  transfer_type TEXT,
  documents JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS horse_location_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  location_city TEXT,
  location_state TEXT,
  location_country TEXT,
  lat DECIMAL,
  lng DECIMAL,
  location_start TIMESTAMPTZ,
  location_end TIMESTAMPTZ,
  facility_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS horse_social_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  profile_url TEXT,
  profile_id TEXT,
  followers_count INTEGER,
  posts_count INTEGER,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS horse_ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  insight_type TEXT,
  insight_data JSONB DEFAULT '{}',
  confidence_score DECIMAL,
  generated_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS horse_data_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL,
  source_name TEXT,
  source_url TEXT,
  data_points JSONB DEFAULT '{}',
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS horse_verification_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  verification_status TEXT NOT NULL,
  verified_by UUID REFERENCES users(id),
  verification_method TEXT,
  verification_data JSONB DEFAULT '{}',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS horse_related_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  related_type TEXT NOT NULL,
  related_id UUID NOT NULL,
  relationship_type TEXT,
  relationship_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS horse_genetic_testing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  test_type TEXT NOT NULL,
  test_date DATE,
  test_lab TEXT,
  results JSONB DEFAULT '{}',
  interpreted_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PILLAR 2: OWNERS/USERS (Tables 16-27)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT,
  phone TEXT,
  bio TEXT,
  location_city TEXT,
  location_state TEXT,
  location_country TEXT,
  timezone TEXT,
  preferred_language TEXT,
  avatar_url TEXT,
  background_image_url TEXT,
  social_links JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  embedding VECTOR(384),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_type TEXT NOT NULL,
  role_data JSONB DEFAULT '{}',
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  permission_type TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  device_info JSONB DEFAULT '{}',
  ip_address INET,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  notification_preferences JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{}',
  ui_preferences JSONB DEFAULT '{}',
  communication_preferences JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_tier TEXT NOT NULL,
  subscription_status TEXT NOT NULL,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  payment_method_type TEXT NOT NULL,
  stripe_payment_method_id TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  billing_details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_verification_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  identity_verified BOOLEAN DEFAULT FALSE,
  verification_documents JSONB DEFAULT '[]',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_social_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  platform_user_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  profile_data JSONB DEFAULT '{}',
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(platform, platform_user_id)
);

CREATE TABLE IF NOT EXISTS user_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, metric_date)
);

CREATE TABLE IF NOT EXISTS user_device_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  device_type TEXT NOT NULL,
  device_token TEXT NOT NULL,
  device_info JSONB DEFAULT '{}',
  app_version TEXT,
  os_version TEXT,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, device_token)
);

-- ============================================================================
-- PILLAR 3: VETS & PROVIDERS (Tables 28-37)
-- ============================================================================

CREATE TABLE IF NOT EXISTS vet_practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_name TEXT NOT NULL,
  license_number TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  specialties TEXT[],
  services_offered JSONB DEFAULT '[]',
  hours_of_operation JSONB DEFAULT '{}',
  emergency_services BOOLEAN DEFAULT FALSE,
  coordinates JSONB,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS veterinarians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  vet_practice_id UUID REFERENCES vet_practices(id),
  license_number TEXT,
  license_state TEXT,
  specialties TEXT[],
  years_experience INTEGER,
  education JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  bio TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS provider_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  credential_type TEXT NOT NULL,
  credential_number TEXT,
  issuing_organization TEXT,
  issue_date DATE,
  expiry_date DATE,
  verification_status TEXT,
  documents JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS provider_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  service_description TEXT,
  base_price DECIMAL,
  pricing_model TEXT,
  availability_schedule JSONB DEFAULT '{}',
  service_area JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS provider_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time_slots JSONB DEFAULT '[]',
  is_available BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider_id, date)
);

CREATE TABLE IF NOT EXISTS provider_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  equipment_type TEXT NOT NULL,
  equipment_name TEXT,
  specifications JSONB DEFAULT '{}',
  availability_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS provider_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  staff_name TEXT NOT NULL,
  role TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  specialties TEXT[],
  is_primary_contact BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS provider_facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  facility_type TEXT NOT NULL,
  facility_name TEXT,
  address JSONB DEFAULT '{}',
  capacity INTEGER,
  amenities JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS provider_insurance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  insurance_type TEXT NOT NULL,
  provider_name TEXT,
  policy_number TEXT,
  coverage_amount DECIMAL,
  expiry_date DATE,
  documents JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS provider_partnerships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  partner_type TEXT NOT NULL,
  partner_id UUID NOT NULL,
  partnership_terms JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PILLAR 4: PURCHASES & TRANSACTIONS (Tables 38-47)
-- ============================================================================

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES providers(id),
  order_number TEXT UNIQUE,
  items JSONB DEFAULT '[]',
  subtotal DECIMAL,
  tax_amount DECIMAL,
  total_amount DECIMAL,
  status TEXT DEFAULT 'pending',
  payment_status TEXT,
  shipping_address JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id),
  invoice_number TEXT UNIQUE,
  due_date DATE,
  paid_at TIMESTAMPTZ,
  line_items JSONB DEFAULT '[]',
  subtotal DECIMAL,
  tax DECIMAL,
  total DECIMAL,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id),
  amount DECIMAL NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  stripe_refund_id TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS billing_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  country TEXT DEFAULT 'US',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shipping_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipient_name TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  country TEXT DEFAULT 'US',
  phone TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id),
  payment_method_id UUID REFERENCES user_payment_methods(id),
  amount DECIMAL NOT NULL,
  payment_status TEXT NOT NULL,
  failure_reason TEXT,
  stripe_payment_method_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscription_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_subscription_id UUID REFERENCES user_subscriptions(id),
  transaction_id UUID REFERENCES transactions(id),
  billing_period_start TIMESTAMPTZ,
  billing_period_end TIMESTAMPTZ,
  amount DECIMAL NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS purchase_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  purchase_type TEXT NOT NULL,
  purchase_item_id UUID,
  purchase_item_name TEXT,
  amount DECIMAL,
  purchase_date TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transaction_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id),
  action TEXT NOT NULL,
  performed_by UUID REFERENCES users(id),
  changes JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PILLAR 5: HEALTH & VET CARE (Tables 48-62)
-- ============================================================================

CREATE TABLE IF NOT EXISTS health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL,
  record_date DATE NOT NULL,
  veterinarian_id UUID REFERENCES veterinarians(id),
  vet_practice_id UUID REFERENCES vet_practices(id),
  diagnosis TEXT,
  treatment TEXT,
  medications JSONB DEFAULT '[]',
  procedures JSONB DEFAULT '[]',
  notes TEXT,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vaccinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  vaccine_name TEXT NOT NULL,
  vaccine_type TEXT,
  administered_date DATE NOT NULL,
  veterinarian_id UUID REFERENCES veterinarians(id),
  batch_number TEXT,
  expiration_date DATE,
  next_due_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  medication_name TEXT NOT NULL,
  medication_type TEXT,
  dosage TEXT,
  frequency TEXT,
  start_date DATE,
  end_date DATE,
  prescribed_by UUID REFERENCES veterinarians(id),
  pharmacy TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vet_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  veterinarian_id UUID REFERENCES veterinarians(id),
  visit_date TIMESTAMPTZ NOT NULL,
  visit_type TEXT,
  reason_for_visit TEXT,
  findings TEXT,
  recommendations TEXT,
  follow_up_required BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  cost DECIMAL,
  invoice_id UUID REFERENCES invoices(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS surgeries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  surgery_type TEXT NOT NULL,
  surgery_date DATE NOT NULL,
  veterinarian_id UUID REFERENCES veterinarians(id),
  facility_id UUID,
  procedure_details TEXT,
  anesthesia_type TEXT,
  recovery_notes TEXT,
  complications TEXT,
  cost DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dental_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  dental_date DATE NOT NULL,
  veterinarian_id UUID REFERENCES veterinarians(id),
  age_estimate INTEGER,
  findings TEXT,
  procedures_performed TEXT[],
  recommendations TEXT,
  next_due_date DATE,
  cost DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lameness_exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  exam_date DATE NOT NULL,
  veterinarian_id UUID REFERENCES veterinarians(id),
  lameness_grade INTEGER,
  affected_limbs TEXT[],
  exam_findings TEXT,
  diagnostic_tests JSONB DEFAULT '[]',
  treatment_plan TEXT,
  follow_up_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lab_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  test_type TEXT NOT NULL,
  test_date DATE NOT NULL,
  lab_name TEXT,
  results JSONB DEFAULT '{}',
  reference_ranges JSONB DEFAULT '{}',
  interpreted_by UUID REFERENCES veterinarians(id),
  notes TEXT,
  report_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS injuries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  injury_type TEXT NOT NULL,
  injury_location TEXT,
  injury_date DATE,
  severity TEXT,
  treatment_provided TEXT,
  healing_stages JSONB DEFAULT '[]',
  fully_healed BOOLEAN DEFAULT FALSE,
  healed_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS health_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  alert_message TEXT NOT NULL,
  severity TEXT,
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_by UUID REFERENCES users(id),
  acknowledged_at TIMESTAMPTZ,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS health_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL,
  reminder_date DATE NOT NULL,
  reminder_message TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  notified BOOLEAN DEFAULT FALSE,
  notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vital_signs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ NOT NULL,
  temperature DECIMAL,
  heart_rate INTEGER,
  respiratory_rate INTEGER,
  weight DECIMAL,
  recorded_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS health_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  statistic_date DATE NOT NULL,
  statistics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(horse_id, statistic_date)
);

CREATE TABLE IF NOT EXISTS health_protocols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  protocol_name TEXT NOT NULL,
  protocol_type TEXT,
  start_date DATE,
  end_date DATE,
  frequency TEXT,
  instructions TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PILLAR 6: SOCIAL & COMMUNITY (Tables 63-74)
-- ============================================================================

CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  post_type TEXT,
  media_urls TEXT[],
  hashtags TEXT[],
  mentions JSONB DEFAULT '[]',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  visibility TEXT DEFAULT 'public',
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS social_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  parent_comment_id UUID REFERENCES social_comments(id),
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS social_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name TEXT NOT NULL,
  description TEXT,
  group_type TEXT,
  owner_id UUID REFERENCES users(id),
  privacy_settings JSONB DEFAULT '{}',
  member_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

CREATE TABLE IF NOT EXISTS group_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  post_type TEXT,
  media_urls TEXT[],
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS private_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message_content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  title TEXT,
  message TEXT NOT NULL,
  related_entity_type TEXT,
  related_entity_id UUID,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tag_name TEXT NOT NULL,
  tag_category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tag_name)
);

CREATE TABLE IF NOT EXISTS horse_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  tag_name TEXT NOT NULL,
  tag_category TEXT,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(horse_id, tag_name)
);

CREATE TABLE IF NOT EXISTS community_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  event_description TEXT,
  event_type TEXT,
  organizer_id UUID REFERENCES users(id),
  location JSONB DEFAULT '{}',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  registration_required BOOLEAN DEFAULT FALSE,
  max_participants INTEGER,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PILLAR 7: AI & RECOMMENDATIONS (Tables 75-89)
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL,
  recommendation_data JSONB DEFAULT '{}',
  confidence_score DECIMAL,
  ai_model TEXT,
  accepted BOOLEAN DEFAULT FALSE,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  query_text TEXT NOT NULL,
  query_type TEXT,
  ai_provider TEXT,
  response_data JSONB DEFAULT '{}',
  response_time_ms INTEGER,
  tokens_used INTEGER,
  cost DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  conversation_title TEXT,
  context_data JSONB DEFAULT '{}',
  message_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  ai_provider TEXT,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_model_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_provider TEXT NOT NULL,
  model_name TEXT NOT NULL,
  query_type TEXT,
  accuracy_score DECIMAL,
  response_time_ms INTEGER,
  cost_per_query DECIMAL,
  usage_count INTEGER DEFAULT 0,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recommendation_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_id UUID REFERENCES ai_recommendations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  feedback_type TEXT NOT NULL,
  feedback_score INTEGER,
  feedback_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_training_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_type TEXT NOT NULL,
  input_data JSONB DEFAULT '{}',
  expected_output JSONB DEFAULT '{}',
  actual_output JSONB DEFAULT '{}',
  accuracy_score DECIMAL,
  used_for_training BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS personalized_feeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  feed_type TEXT NOT NULL,
  content_items JSONB DEFAULT '[]',
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL,
  user_id UUID REFERENCES users(id),
  ranking_score DECIMAL,
  ranking_factors JSONB DEFAULT '{}',
  ranked_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_preference_learning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  preference_type TEXT NOT NULL,
  preference_data JSONB DEFAULT '{}',
  confidence_level DECIMAL,
  learned_from JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  prediction_data JSONB DEFAULT '{}',
  confidence_score DECIMAL,
  ai_model TEXT,
  predicted_at TIMESTAMPTZ DEFAULT NOW(),
  actual_outcome JSONB,
  accuracy_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS smart_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL,
  reminder_message TEXT NOT NULL,
  trigger_conditions JSONB DEFAULT '{}',
  scheduled_for TIMESTAMPTZ,
  sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_insights_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT NOT NULL UNIQUE,
  insight_data JSONB DEFAULT '{}',
  expires_at TIMESTAMPTZ,
  hit_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_model_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_category TEXT NOT NULL,
  ai_provider TEXT NOT NULL,
  model_name TEXT NOT NULL,
  ranking_position INTEGER,
  performance_score DECIMAL,
  usage_count INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PILLAR 8: ADMIN & MONITORING (Tables 90-104)
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  admin_level TEXT NOT NULL,
  permissions JSONB DEFAULT '{}',
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);

CREATE TABLE IF NOT EXISTS admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id),
  action_type TEXT NOT NULL,
  target_entity_type TEXT,
  target_entity_id UUID,
  action_data JSONB DEFAULT '{}',
  ip_address INET,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON admin_actions(admin_id);

CREATE TABLE IF NOT EXISTS system_health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value DECIMAL,
  metric_unit TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS api_usage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL,
  method TEXT,
  user_id UUID REFERENCES users(id),
  response_status INTEGER,
  response_time_ms INTEGER,
  request_size_bytes INTEGER,
  response_size_bytes INTEGER,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_api_usage_stats_user_id ON api_usage_stats(user_id);

CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  user_id UUID REFERENCES users(id),
  request_data JSONB DEFAULT '{}',
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON error_logs(user_id);

CREATE TABLE IF NOT EXISTS performance_monitoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  operation_name TEXT,
  duration_ms INTEGER,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS database_backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_type TEXT NOT NULL,
  backup_location TEXT,
  backup_size_bytes BIGINT,
  backup_status TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key TEXT NOT NULL UNIQUE,
  config_value JSONB DEFAULT '{}',
  description TEXT,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_config_updated_by ON system_config(updated_by);

CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_name TEXT NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT FALSE,
  enabled_for_users JSONB DEFAULT '[]',
  rollout_percentage INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  performed_by UUID REFERENCES users(id),
  changes JSONB DEFAULT '{}',
  ip_address INET,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_trail_performed_by ON audit_trail(performed_by);

CREATE TABLE IF NOT EXISTS system_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL,
  alert_level TEXT NOT NULL,
  alert_message TEXT NOT NULL,
  alert_data JSONB DEFAULT '{}',
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_by UUID REFERENCES users(id),
  acknowledged_at TIMESTAMPTZ,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_alerts_acknowledged_by ON system_alerts(acknowledged_by);

-- Table 91: admin_logins
CREATE TABLE IF NOT EXISTS admin_logins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  ip_address INET,
  login_method TEXT,
  success BOOLEAN DEFAULT TRUE,
  failure_reason TEXT,
  logged_in_at TIMESTAMPTZ DEFAULT NOW(),
  logged_out_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_admin_logins_admin_id ON admin_logins(admin_id);

-- Table 92: admin_permissions
CREATE TABLE IF NOT EXISTS admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  permission_type TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  granted BOOLEAN DEFAULT TRUE,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  granted_by UUID REFERENCES users(id),
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_admin_id ON admin_permissions(admin_id);

-- Table 93: monitoring_dashboards
CREATE TABLE IF NOT EXISTS monitoring_dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_name TEXT NOT NULL,
  dashboard_type TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  is_public BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_monitoring_dashboards_created_by ON monitoring_dashboards(created_by);

-- Table 94: monitoring_widgets
CREATE TABLE IF NOT EXISTS monitoring_widgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_id UUID REFERENCES monitoring_dashboards(id) ON DELETE CASCADE,
  widget_type TEXT NOT NULL,
  widget_config JSONB DEFAULT '{}',
  position_x INTEGER,
  position_y INTEGER,
  width INTEGER,
  height INTEGER,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_monitoring_widgets_dashboard_id ON monitoring_widgets(dashboard_id);

-- Table 95: system_notifications
CREATE TABLE IF NOT EXISTS system_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_type TEXT NOT NULL,
  notification_level TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  target_user_id UUID REFERENCES users(id),
  target_role TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  action_url TEXT,
  action_label TEXT,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_notifications_user_id ON system_notifications(target_user_id);

-- Table 96: system_backups_log
CREATE TABLE IF NOT EXISTS system_backups_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_id UUID REFERENCES database_backups(id),
  backup_step TEXT NOT NULL,
  step_status TEXT NOT NULL,
  step_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_backups_log_backup_id ON system_backups_log(backup_id);

-- Table 97: config_history
CREATE TABLE IF NOT EXISTS config_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID REFERENCES system_config(id) ON DELETE CASCADE,
  old_value JSONB,
  new_value JSONB,
  changed_by UUID REFERENCES users(id),
  change_reason TEXT,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_config_history_config_id ON config_history(config_id);

-- Table 98: alert_rules
CREATE TABLE IF NOT EXISTS alert_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL,
  condition_expression TEXT NOT NULL,
  threshold_value DECIMAL,
  alert_action TEXT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id),
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_alert_rules_created_by ON alert_rules(created_by);

-- Table 99: alert_notifications
CREATE TABLE IF NOT EXISTS alert_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID REFERENCES alert_rules(id) ON DELETE CASCADE,
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  alert_value DECIMAL,
  notification_sent BOOLEAN DEFAULT FALSE,
  notification_channel TEXT,
  notification_sent_at TIMESTAMPTZ,
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_by UUID REFERENCES users(id),
  acknowledged_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_alert_notifications_rule_id ON alert_notifications(rule_id);
CREATE INDEX IF NOT EXISTS idx_alert_notifications_triggered_at ON alert_notifications(triggered_at);

-- Table 100: system_maintenance
CREATE TABLE IF NOT EXISTS system_maintenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  maintenance_type TEXT NOT NULL,
  maintenance_description TEXT,
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  status TEXT DEFAULT 'scheduled',
  affected_services TEXT[],
  created_by UUID REFERENCES users(id),
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_maintenance_created_by ON system_maintenance(created_by);
CREATE INDEX IF NOT EXISTS idx_system_maintenance_status ON system_maintenance(status);

-- ============================================================================
-- PILLAR 9: RETENTION & OUTREACH (Tables 105-114)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_retention_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  campaign_type TEXT NOT NULL,
  target_users JSONB DEFAULT '[]',
  campaign_content JSONB DEFAULT '{}',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  status TEXT DEFAULT 'draft',
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS outreach_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL,
  message_content TEXT NOT NULL,
  channel TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  opened BOOLEAN DEFAULT FALSE,
  opened_at TIMESTAMPTZ,
  clicked BOOLEAN DEFAULT FALSE,
  clicked_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_outreach_messages_user_id ON outreach_messages(user_id);

CREATE TABLE IF NOT EXISTS re_engagement_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  trigger_type TEXT NOT NULL,
  trigger_data JSONB DEFAULT '{}',
  last_active_at TIMESTAMPTZ,
  re_engagement_sent BOOLEAN DEFAULT FALSE,
  re_engagement_sent_at TIMESTAMPTZ,
  re_engaged BOOLEAN DEFAULT FALSE,
  re_engaged_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_re_engagement_triggers_user_id ON re_engagement_triggers(user_id);

CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  subject_line TEXT NOT NULL,
  email_content TEXT NOT NULL,
  target_segment JSONB DEFAULT '{}',
  scheduled_for TIMESTAMPTZ,
  sent_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sms_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  message_content TEXT NOT NULL,
  target_segment JSONB DEFAULT '{}',
  scheduled_for TIMESTAMPTZ,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS push_notification_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  notification_title TEXT NOT NULL,
  notification_body TEXT NOT NULL,
  target_segment JSONB DEFAULT '{}',
  scheduled_for TIMESTAMPTZ,
  sent_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS retention_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  metrics JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, metric_date)
);
CREATE INDEX IF NOT EXISTS idx_retention_metrics_user_id ON retention_metrics(user_id);

CREATE TABLE IF NOT EXISTS user_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment_name TEXT NOT NULL UNIQUE,
  segment_criteria JSONB DEFAULT '{}',
  user_count INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS personalized_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  offer_type TEXT NOT NULL,
  offer_data JSONB DEFAULT '{}',
  discount_percentage DECIMAL,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_personalized_offers_user_id ON personalized_offers(user_id);

CREATE TABLE IF NOT EXISTS churn_prediction (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  churn_probability DECIMAL,
  risk_factors JSONB DEFAULT '[]',
  predicted_churn_date DATE,
  intervention_recommended BOOLEAN DEFAULT FALSE,
  intervention_applied BOOLEAN DEFAULT FALSE,
  actually_churned BOOLEAN DEFAULT FALSE,
  churned_at TIMESTAMPTZ,
  predicted_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_churn_prediction_user_id ON churn_prediction(user_id);

-- ============================================================================
-- PILLAR 10: VIRAL & MARKETING (Tables 115-124)
-- ============================================================================

CREATE TABLE IF NOT EXISTS referral_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_name TEXT NOT NULL,
  referral_code TEXT UNIQUE,
  referrer_reward JSONB DEFAULT '{}',
  referee_reward JSONB DEFAULT '{}',
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS referral_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referral_code TEXT,
  referral_program_id UUID REFERENCES referral_programs(id),
  reward_status TEXT DEFAULT 'pending',
  reward_issued BOOLEAN DEFAULT FALSE,
  reward_issued_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS social_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  platform TEXT NOT NULL,
  share_url TEXT,
  clicks_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS viral_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  campaign_type TEXT NOT NULL,
  target_virality_score DECIMAL,
  current_virality_score DECIMAL DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  engagement_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_virality_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL,
  virality_score DECIMAL DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  engagement_count INTEGER DEFAULT 0,
  reach_count INTEGER DEFAULT 0,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS influencer_partnerships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID REFERENCES users(id),
  partnership_type TEXT NOT NULL,
  partnership_terms JSONB DEFAULT '{}',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketing_attribution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  attribution_source TEXT,
  attribution_medium TEXT,
  attribution_campaign TEXT,
  first_touch_date TIMESTAMPTZ,
  last_touch_date TIMESTAMPTZ,
  conversion_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS brand_ambassadors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  ambassador_level TEXT,
  perks JSONB DEFAULT '[]',
  performance_metrics JSONB DEFAULT '{}',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_generated_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content_data JSONB DEFAULT '{}',
  approved_for_marketing BOOLEAN DEFAULT FALSE,
  used_in_campaigns JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS viral_loop_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  loop_type TEXT NOT NULL,
  loop_step TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PILLAR 11: SCALING & RELIABILITY (Tables 125-127)
-- ============================================================================

CREATE TABLE IF NOT EXISTS load_balancing_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL UNIQUE,
  config_data JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cache_configuration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key_pattern TEXT NOT NULL,
  ttl_seconds INTEGER,
  cache_strategy TEXT,
  invalidation_rules JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rate_limiting_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL,
  user_id UUID REFERENCES users(id),
  max_requests INTEGER,
  window_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scaling_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  dependency_name TEXT NOT NULL,
  dependency_type TEXT,
  health_check_url TEXT,
  status TEXT DEFAULT 'healthy',
  last_checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS infrastructure_monitoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type TEXT NOT NULL,
  resource_name TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value DECIMAL,
  unit TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS disaster_recovery_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name TEXT NOT NULL,
  plan_type TEXT NOT NULL,
  plan_steps JSONB DEFAULT '[]',
  last_tested_at TIMESTAMPTZ,
  recovery_time_objective INTEGER,
  recovery_point_objective INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS data_replication_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  replication_target TEXT,
  replication_status TEXT,
  last_synced_at TIMESTAMPTZ,
  lag_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS queue_management (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_name TEXT NOT NULL,
  queue_type TEXT NOT NULL,
  message_count INTEGER DEFAULT 0,
  processing_rate DECIMAL,
  dead_letter_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'healthy',
  last_checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS capacity_planning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type TEXT NOT NULL,
  current_usage DECIMAL,
  projected_usage DECIMAL,
  capacity_limit DECIMAL,
  alert_threshold DECIMAL,
  forecast_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_horses_owner ON horses(owner_id);
CREATE INDEX IF NOT EXISTS idx_horses_breed ON horses(breed);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_health_records_horse ON health_records(horse_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_user ON social_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user ON ai_recommendations(user_id);
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
