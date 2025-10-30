-- New Horse System Database Schema
-- Implements the scalable, drama-free horse management system

-- Core horses table (single source of truth)
CREATE TABLE IF NOT EXISTS horses_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic identification
  registered_name TEXT,
  barn_name TEXT,
  registration_number TEXT UNIQUE,
  
  -- Physical characteristics
  breed TEXT NOT NULL,
  sex TEXT NOT NULL CHECK (sex IN ('mare', 'stallion', 'gelding')),
  foal_year INTEGER,
  foal_date DATE,
  color TEXT,
  height_hands DECIMAL(3,1),
  markings TEXT,
  
  -- Bloodline
  sire_name TEXT,
  sire_registration TEXT,
  dam_name TEXT,
  dam_registration TEXT,
  pedigree_url TEXT,
  
  -- Media
  profile_photo_url TEXT,
  registration_papers_url TEXT,
  
  -- Business information (for stallions)
  stud_fee DECIMAL(10,2),
  stud_fee_terms TEXT,
  standing_farm_name TEXT,
  standing_farm_city TEXT,
  standing_farm_state TEXT,
  standing_farm_phone TEXT,
  standing_farm_website TEXT,
  
  -- Performance data
  performance_disciplines TEXT[],
  performance_earnings DECIMAL(12,2) DEFAULT 0,
  performance_highlights TEXT,
  best_times TEXT,
  
  -- Health and care
  primary_vet_name TEXT,
  primary_vet_phone TEXT,
  emergency_contact TEXT,
  
  -- Status and verification
  verification_status TEXT DEFAULT 'unverified', -- 'unverified', 'verified', 'disputed'
  last_confirmed_at TIMESTAMPTZ,
  confirmed_by_source TEXT, -- 'user_submission', 'public_listing', 'official_registry'
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User-horse associations (replaces "ownership" concept)
CREATE TABLE IF NOT EXISTS horse_user_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  horse_id UUID REFERENCES horses_master(id) ON DELETE CASCADE,
  
  -- Link metadata
  link_type TEXT DEFAULT 'tracking', -- 'tracking', 'managing', 'breeding_to'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique user-horse pairs
  UNIQUE(user_id, horse_id)
);

-- Data change requests (crowdsourced corrections)
CREATE TABLE IF NOT EXISTS data_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses_master(id) ON DELETE CASCADE,
  proposed_by_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Change details
  field_name TEXT NOT NULL,
  old_value TEXT,
  proposed_value TEXT,
  change_reason TEXT,
  
  -- Review process
  status TEXT DEFAULT 'pending', -- 'pending', 'auto_applied', 'needs_review', 'rejected'
  ai_confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  ai_reasoning TEXT,
  
  -- Human review
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id),
  review_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data flags (dispute/error reporting)
CREATE TABLE IF NOT EXISTS data_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses_master(id) ON DELETE CASCADE,
  flagged_by_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Flag details
  field_name TEXT, -- optional, if they specify which field
  flag_type TEXT DEFAULT 'incorrect', -- 'incorrect', 'outdated', 'spam', 'duplicate'
  message TEXT NOT NULL,
  suggested_correction TEXT,
  verification_source TEXT, -- optional source they provide
  
  -- Resolution process
  resolution_status TEXT DEFAULT 'open', -- 'open', 'verifying', 'resolved', 'dismissed'
  ai_verification_attempted BOOLEAN DEFAULT false,
  ai_verification_result TEXT,
  
  -- Human review
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id),
  resolution_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Horse search and discovery analytics
CREATE TABLE IF NOT EXISTS horse_discovery_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses_master(id) ON DELETE CASCADE,
  
  -- Discovery metrics
  search_count INTEGER DEFAULT 0,
  profile_views INTEGER DEFAULT 0,
  added_to_horses_count INTEGER DEFAULT 0,
  edit_requests_count INTEGER DEFAULT 0,
  flag_count INTEGER DEFAULT 0,
  
  -- Trending metrics
  weekly_adds INTEGER DEFAULT 0,
  monthly_adds INTEGER DEFAULT 0,
  trending_score DECIMAL(5,2) DEFAULT 0,
  
  -- Metadata
  metric_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_horses_master_registration_number ON horses_master(registration_number);
CREATE INDEX IF NOT EXISTS idx_horses_master_registered_name ON horses_master(registered_name);
CREATE INDEX IF NOT EXISTS idx_horses_master_barn_name ON horses_master(barn_name);
CREATE INDEX IF NOT EXISTS idx_horses_master_breed ON horses_master(breed);
CREATE INDEX IF NOT EXISTS idx_horses_master_sex ON horses_master(sex);
CREATE INDEX IF NOT EXISTS idx_horses_master_verification_status ON horses_master(verification_status);
CREATE INDEX IF NOT EXISTS idx_horses_master_standing_farm_state ON horses_master(standing_farm_state);

CREATE INDEX IF NOT EXISTS idx_horse_user_links_user_id ON horse_user_links(user_id);
CREATE INDEX IF NOT EXISTS idx_horse_user_links_horse_id ON horse_user_links(horse_id);
CREATE INDEX IF NOT EXISTS idx_horse_user_links_type ON horse_user_links(link_type);

CREATE INDEX IF NOT EXISTS idx_data_change_requests_horse_id ON data_change_requests(horse_id);
CREATE INDEX IF NOT EXISTS idx_data_change_requests_status ON data_change_requests(status);
CREATE INDEX IF NOT EXISTS idx_data_change_requests_field ON data_change_requests(field_name);
CREATE INDEX IF NOT EXISTS idx_data_change_requests_created ON data_change_requests(created_at);

CREATE INDEX IF NOT EXISTS idx_data_flags_horse_id ON data_flags(horse_id);
CREATE INDEX IF NOT EXISTS idx_data_flags_status ON data_flags(resolution_status);
CREATE INDEX IF NOT EXISTS idx_data_flags_type ON data_flags(flag_type);
CREATE INDEX IF NOT EXISTS idx_data_flags_created ON data_flags(created_at);

CREATE INDEX IF NOT EXISTS idx_horse_discovery_horse_id ON horse_discovery_analytics(horse_id);
CREATE INDEX IF NOT EXISTS idx_horse_discovery_date ON horse_discovery_analytics(metric_date);
CREATE INDEX IF NOT EXISTS idx_horse_discovery_trending ON horse_discovery_analytics(trending_score);

-- Enable RLS
ALTER TABLE horses_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE horse_user_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE horse_discovery_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view horses" ON horses_master FOR SELECT USING (true);
CREATE POLICY "Service role can manage horses" ON horses_master FOR ALL USING (is_service_role(auth.role()));

CREATE POLICY "Users can view their horse links" ON horse_user_links FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own horse links" ON horse_user_links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own horse links" ON horse_user_links FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage horse links" ON horse_user_links FOR ALL USING (is_service_role(auth.role()));

CREATE POLICY "Users can view their change requests" ON data_change_requests FOR SELECT USING (auth.uid() = proposed_by_user_id);
CREATE POLICY "Users can create change requests" ON data_change_requests FOR INSERT WITH CHECK (auth.uid() = proposed_by_user_id);
CREATE POLICY "Service role can manage change requests" ON data_change_requests FOR ALL USING (is_service_role(auth.role()));

CREATE POLICY "Users can view their flags" ON data_flags FOR SELECT USING (auth.uid() = flagged_by_user_id);
CREATE POLICY "Users can create flags" ON data_flags FOR INSERT WITH CHECK (auth.uid() = flagged_by_user_id);
CREATE POLICY "Service role can manage flags" ON data_flags FOR ALL USING (is_service_role(auth.role()));

CREATE POLICY "Service role can manage analytics" ON horse_discovery_analytics FOR ALL USING (is_service_role(auth.role()));

-- Helper function for service role (if not already defined)
CREATE OR REPLACE FUNCTION is_service_role(role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN role = 'service_role';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;




