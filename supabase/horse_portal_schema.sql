-- Horse Portal Database Schema
-- For individual horse owners to manage their horses, track health, performance, and connect with services

-- Horse owner profiles table
CREATE TABLE IF NOT EXISTS horse_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location_city TEXT,
  location_state TEXT,
  location_country TEXT DEFAULT 'USA',
  
  -- Owner details
  years_owning_horses INTEGER,
  number_of_horses INTEGER DEFAULT 0,
  primary_disciplines TEXT[], -- ['barrel_racing', 'trail_riding', 'pleasure', 'competition']
  experience_level TEXT, -- 'beginner', 'intermediate', 'advanced', 'professional'
  
  -- Facility details
  facility_type TEXT, -- 'private', 'boarding', 'training', 'breeding'
  facility_name TEXT,
  facility_address TEXT,
  boarding_capacity INTEGER,
  
  -- Services needed
  services_needed TEXT[], -- ['training', 'boarding', 'vet_care', 'farrier', 'grooming']
  emergency_contacts TEXT[], -- JSON array of emergency contact info
  
  -- Preferences
  preferred_vets TEXT[],
  preferred_farriers TEXT[],
  preferred_trainers TEXT[],
  
  -- Subscription details
  subscription_tier TEXT DEFAULT 'basic', -- 'basic', 'premium', 'professional'
  subscription_expires_at TIMESTAMPTZ,
  
  -- Status
  verified BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual horse profiles
CREATE TABLE IF NOT EXISTS horse_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES horse_owners(id) ON DELETE CASCADE,
  horse_name TEXT NOT NULL,
  registered_name TEXT,
  registration_number TEXT,
  breed TEXT NOT NULL,
  sex TEXT NOT NULL CHECK (sex IN ('mare', 'stallion', 'gelding')),
  birth_year INTEGER,
  color TEXT,
  
  -- Physical characteristics
  height_hands DECIMAL(3,1), -- height in hands
  weight_lbs INTEGER,
  markings TEXT,
  
  -- Bloodline information
  sire_name TEXT,
  sire_registration TEXT,
  dam_name TEXT,
  dam_registration TEXT,
  pedigree_url TEXT,
  
  -- Performance data
  primary_discipline TEXT,
  performance_disciplines TEXT[],
  performance_earnings DECIMAL(12,2) DEFAULT 0,
  performance_highlights TEXT,
  best_times TEXT, -- JSON for different events
  
  -- Health information
  health_status TEXT DEFAULT 'healthy', -- 'healthy', 'injured', 'recovering', 'chronic'
  current_medications TEXT[],
  allergies TEXT[],
  chronic_conditions TEXT[],
  last_vet_visit DATE,
  next_vet_visit DATE,
  
  -- Care team
  primary_vet_name TEXT,
  primary_vet_phone TEXT,
  farrier_name TEXT,
  farrier_phone TEXT,
  trainer_name TEXT,
  trainer_phone TEXT,
  
  -- Feeding and care
  feed_program TEXT,
  supplements TEXT[],
  exercise_routine TEXT,
  special_care_notes TEXT,
  
  -- Insurance and registration
  insurance_company TEXT,
  insurance_policy_number TEXT,
  insurance_expires DATE,
  microchip_number TEXT,
  coggins_date DATE,
  coggins_expires DATE,
  
  -- Media
  profile_photo_url TEXT,
  video_url TEXT,
  photo_gallery TEXT[],
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Health records and veterinary care
CREATE TABLE IF NOT EXISTS horse_health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horse_profiles(id) ON DELETE CASCADE,
  
  -- Record details
  record_date DATE NOT NULL,
  record_type TEXT NOT NULL, -- 'vaccination', 'deworming', 'dental', 'lameness', 'injury', 'routine', 'emergency'
  veterinarian_name TEXT,
  veterinarian_phone TEXT,
  
  -- Health information
  diagnosis TEXT,
  treatment TEXT,
  medications_prescribed TEXT[],
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  
  -- Cost tracking
  cost DECIMAL(8,2),
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'insurance', 'partial'
  
  -- Notes and observations
  notes TEXT,
  owner_observations TEXT,
  
  -- Attachments
  documents TEXT[], -- URLs to uploaded documents
  photos TEXT[], -- URLs to photos
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance and competition records
CREATE TABLE IF NOT EXISTS horse_performance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horse_profiles(id) ON DELETE CASCADE,
  
  -- Event details
  event_date DATE NOT NULL,
  event_name TEXT NOT NULL,
  event_location TEXT,
  discipline TEXT NOT NULL,
  class_name TEXT,
  
  -- Performance results
  placement INTEGER,
  total_entries INTEGER,
  score DECIMAL(8,2),
  time DECIMAL(8,3), -- for timed events
  earnings DECIMAL(10,2) DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  
  -- Performance notes
  performance_notes TEXT,
  judge_comments TEXT,
  areas_for_improvement TEXT,
  
  -- Media
  photos TEXT[],
  videos TEXT[],
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training and lesson records
CREATE TABLE IF NOT EXISTS horse_training_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horse_profiles(id) ON DELETE CASCADE,
  
  -- Training details
  training_date DATE NOT NULL,
  training_type TEXT, -- 'lesson', 'practice', 'clinics', 'training_session'
  trainer_name TEXT,
  training_location TEXT,
  
  -- Training content
  focus_area TEXT, -- 'barrels', 'poles', 'cutting', 'reining', 'general'
  exercises TEXT[],
  duration_minutes INTEGER,
  
  -- Performance notes
  horse_performance TEXT,
  rider_performance TEXT,
  areas_improvement TEXT,
  next_session_focus TEXT,
  
  -- Progress tracking
  skill_level_before TEXT,
  skill_level_after TEXT,
  confidence_rating INTEGER CHECK (confidence_rating >= 1 AND confidence_rating <= 10),
  
  -- Cost tracking
  cost DECIMAL(8,2),
  payment_status TEXT DEFAULT 'pending',
  
  -- Media
  photos TEXT[],
  videos TEXT[],
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service requests and bookings
CREATE TABLE IF NOT EXISTS horse_service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horse_profiles(id) ON DELETE CASCADE,
  
  -- Service details
  service_type TEXT NOT NULL, -- 'vet', 'farrier', 'training', 'boarding', 'grooming', 'transport'
  service_description TEXT,
  requested_date DATE,
  urgency TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'emergency'
  
  -- Provider information
  preferred_provider TEXT,
  provider_contact TEXT,
  
  -- Status tracking
  status TEXT DEFAULT 'pending', -- 'pending', 'scheduled', 'in_progress', 'completed', 'cancelled'
  scheduled_date DATE,
  completed_date DATE,
  
  -- Cost and payment
  estimated_cost DECIMAL(8,2),
  actual_cost DECIMAL(8,2),
  payment_status TEXT DEFAULT 'pending',
  
  -- Notes and feedback
  notes TEXT,
  provider_notes TEXT,
  owner_feedback TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Horse analytics and insights
CREATE TABLE IF NOT EXISTS horse_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horse_profiles(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  
  -- Health metrics
  total_vet_visits INTEGER DEFAULT 0,
  total_health_costs DECIMAL(10,2) DEFAULT 0,
  average_health_cost DECIMAL(8,2) DEFAULT 0,
  days_since_last_vet INTEGER,
  
  -- Performance metrics
  total_competitions INTEGER DEFAULT 0,
  competitions_won INTEGER DEFAULT 0,
  win_percentage DECIMAL(5,2),
  total_earnings DECIMAL(12,2) DEFAULT 0,
  average_earnings_per_event DECIMAL(10,2) DEFAULT 0,
  
  -- Training metrics
  total_training_hours INTEGER DEFAULT 0,
  training_sessions INTEGER DEFAULT 0,
  average_training_cost DECIMAL(8,2) DEFAULT 0,
  
  -- Service metrics
  total_service_requests INTEGER DEFAULT 0,
  completed_services INTEGER DEFAULT 0,
  average_service_cost DECIMAL(8,2) DEFAULT 0,
  
  -- Overall metrics
  total_care_costs DECIMAL(12,2) DEFAULT 0,
  cost_per_month DECIMAL(8,2) DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_horse_owners_user_id ON horse_owners(user_id);
CREATE INDEX IF NOT EXISTS idx_horse_owners_location ON horse_owners(location_state, location_city);
CREATE INDEX IF NOT EXISTS idx_horse_owners_disciplines ON horse_owners USING GIN(primary_disciplines);
CREATE INDEX IF NOT EXISTS idx_horse_profiles_owner_id ON horse_profiles(owner_id);
CREATE INDEX IF NOT EXISTS idx_horse_profiles_breed ON horse_profiles(breed);
CREATE INDEX IF NOT EXISTS idx_horse_profiles_sex ON horse_profiles(sex);
CREATE INDEX IF NOT EXISTS idx_horse_profiles_health_status ON horse_profiles(health_status);
CREATE INDEX IF NOT EXISTS idx_horse_health_records_horse_id ON horse_health_records(horse_id);
CREATE INDEX IF NOT EXISTS idx_horse_health_records_date ON horse_health_records(record_date);
CREATE INDEX IF NOT EXISTS idx_horse_health_records_type ON horse_health_records(record_type);
CREATE INDEX IF NOT EXISTS idx_horse_performance_records_horse_id ON horse_performance_records(horse_id);
CREATE INDEX IF NOT EXISTS idx_horse_performance_records_date ON horse_performance_records(event_date);
CREATE INDEX IF NOT EXISTS idx_horse_performance_records_discipline ON horse_performance_records(discipline);
CREATE INDEX IF NOT EXISTS idx_horse_training_records_horse_id ON horse_training_records(horse_id);
CREATE INDEX IF NOT EXISTS idx_horse_training_records_date ON horse_training_records(training_date);
CREATE INDEX IF NOT EXISTS idx_horse_service_requests_horse_id ON horse_service_requests(horse_id);
CREATE INDEX IF NOT EXISTS idx_horse_service_requests_status ON horse_service_requests(status);
CREATE INDEX IF NOT EXISTS idx_horse_service_requests_date ON horse_service_requests(requested_date);
CREATE INDEX IF NOT EXISTS idx_horse_analytics_horse_id ON horse_analytics(horse_id);
CREATE INDEX IF NOT EXISTS idx_horse_analytics_date ON horse_analytics(metric_date);

-- Enable RLS
ALTER TABLE horse_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE horse_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE horse_health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE horse_performance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE horse_training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE horse_service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE horse_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view all horse owners" ON horse_owners FOR SELECT USING (true);
CREATE POLICY "Users can insert their own horse owner profile" ON horse_owners FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own horse owner profile" ON horse_owners FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own horse owner profile" ON horse_owners FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view all horse profiles" ON horse_profiles FOR SELECT USING (true);
CREATE POLICY "Owners can manage their horses" ON horse_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM horse_owners WHERE id = owner_id AND user_id = auth.uid())
);

CREATE POLICY "Owners can manage their horse health records" ON horse_health_records FOR ALL USING (
  EXISTS (SELECT 1 FROM horse_profiles WHERE id = horse_id AND owner_id IN (
    SELECT id FROM horse_owners WHERE user_id = auth.uid()
  ))
);

CREATE POLICY "Owners can manage their horse performance records" ON horse_performance_records FOR ALL USING (
  EXISTS (SELECT 1 FROM horse_profiles WHERE id = horse_id AND owner_id IN (
    SELECT id FROM horse_owners WHERE user_id = auth.uid()
  ))
);

CREATE POLICY "Owners can manage their horse training records" ON horse_training_records FOR ALL USING (
  EXISTS (SELECT 1 FROM horse_profiles WHERE id = horse_id AND owner_id IN (
    SELECT id FROM horse_owners WHERE user_id = auth.uid()
  ))
);

CREATE POLICY "Owners can manage their horse service requests" ON horse_service_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM horse_profiles WHERE id = horse_id AND owner_id IN (
    SELECT id FROM horse_owners WHERE user_id = auth.uid()
  ))
);

CREATE POLICY "Owners can view their horse analytics" ON horse_analytics FOR SELECT USING (
  EXISTS (SELECT 1 FROM horse_profiles WHERE id = horse_id AND owner_id IN (
    SELECT id FROM horse_owners WHERE user_id = auth.uid()
  ))
);


