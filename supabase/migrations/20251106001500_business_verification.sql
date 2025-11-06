-- Complete Business Verification & User Matching System
-- Run this in Supabase SQL Editor

-- ========================================
-- 1. USERS TABLE (200k people)
-- ========================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic info
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  
  -- Profile
  user_type TEXT, -- owner, trainer, breeder, buyer, etc
  location_city TEXT,
  location_state TEXT,
  location_zip TEXT,
  
  -- Preferences
  interests TEXT[], -- stallions, training, veterinary, etc
  
  -- Business discovery
  owns_business BOOLEAN DEFAULT false,
  business_name TEXT,
  business_type TEXT,
  business_claimed_id UUID REFERENCES businesses(id),
  
  -- Subscription
  is_subscribed BOOLEAN DEFAULT false,
  subscription_tier TEXT, -- free, basic, premium
  subscription_started_at TIMESTAMPTZ,
  subscription_expires_at TIMESTAMPTZ,
  
  -- Verification
  verification_token TEXT UNIQUE,
  verification_sent_at TIMESTAMPTZ,
  email_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  
  -- Auth (if not using Supabase Auth)
  password_hash TEXT,
  
  -- Engagement
  first_chat_at TIMESTAMPTZ,
  last_chat_at TIMESTAMPTZ,
  total_searches INTEGER DEFAULT 0,
  
  -- Metadata
  source TEXT, -- where did this contact come from
  imported_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_location ON users(location_state, location_city);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_users_verified ON users(email_verified);
CREATE INDEX idx_users_subscribed ON users(is_subscribed);
CREATE INDEX idx_users_owns_business ON users(owns_business);
CREATE INDEX idx_users_business_claimed ON users(business_claimed_id);

-- ========================================
-- 1b. HORSES TABLE (user's horses)
-- ========================================
CREATE TABLE IF NOT EXISTS horses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Horse info
  horse_name TEXT NOT NULL,
  breed TEXT,
  color TEXT,
  gender TEXT, -- stallion, mare, gelding
  year_born INTEGER,
  
  -- Registration
  registration_number TEXT,
  registration_org TEXT, -- AQHA, APHA, etc
  
  -- Performance
  discipline TEXT[], -- racing, barrel_racing, dressage, etc
  achievements TEXT,
  
  -- Verification
  info_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  verification_source TEXT, -- user_confirmed, registry_api, etc
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(owner_user_id, horse_name, year_born)
);

CREATE INDEX idx_horses_owner ON horses(owner_user_id);
CREATE INDEX idx_horses_breed ON horses(breed);
CREATE INDEX idx_horses_verified ON horses(info_verified);

-- ========================================
-- 2. BUSINESSES TABLE (30k businesses)
-- ========================================
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic info
  business_name TEXT NOT NULL,
  business_type TEXT, -- stallion_breeder, trainer, vet, farrier, transport, etc
  contact_email TEXT,
  contact_phone TEXT,
  
  -- Location
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  
  -- Online presence
  website TEXT,
  facebook_url TEXT,
  instagram_handle TEXT,
  
  -- Services/Products
  services TEXT[], -- breeding, training, transport, etc
  specialties TEXT[], -- specific breeds, disciplines, etc
  
  -- Verification status
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  verification_token TEXT UNIQUE,
  verification_email_sent BOOLEAN DEFAULT false,
  verification_email_sent_at TIMESTAMPTZ,
  
  -- CRM upload status
  crm_uploaded BOOLEAN DEFAULT false,
  crm_uploaded_at TIMESTAMPTZ,
  total_contacts_uploaded INTEGER DEFAULT 0,
  verified_contacts_count INTEGER DEFAULT 0,
  
  -- Ranking
  ranking_score INTEGER DEFAULT 0,
  last_ranking_update TIMESTAMPTZ,
  
  -- Engagement
  profile_views INTEGER DEFAULT 0,
  search_matches_30d INTEGER DEFAULT 0,
  
  -- Metadata
  source TEXT,
  imported_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_businesses_verified ON businesses(verified);
CREATE INDEX idx_businesses_crm ON businesses(crm_uploaded);
CREATE INDEX idx_businesses_ranking ON businesses(ranking_score DESC);
CREATE INDEX idx_businesses_location ON businesses(state, city);
CREATE INDEX idx_businesses_type ON businesses(business_type);
CREATE INDEX idx_businesses_email ON businesses(contact_email);

-- ========================================
-- 3. UPLOADED CONTACTS (CRM data from businesses)
-- ========================================
CREATE TABLE IF NOT EXISTS uploaded_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  
  -- Contact info (from business CRM)
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contact_role TEXT, -- customer, prospect, past_client, etc
  contact_notes TEXT,
  relationship_type TEXT, -- bought_stallion, training_client, etc
  
  -- Matching to users table
  matched_user_id UUID REFERENCES users(id),
  match_confidence DECIMAL(3,2), -- 0.00 to 1.00
  matched_at TIMESTAMPTZ,
  
  -- Verification by contact
  verification_sent BOOLEAN DEFAULT false,
  verification_sent_at TIMESTAMPTZ,
  verified_by_contact BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  verification_token TEXT UNIQUE,
  
  -- Metadata
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  raw_data JSONB, -- store original CSV row
  
  UNIQUE(business_id, contact_email)
);

CREATE INDEX idx_uploaded_contacts_business ON uploaded_contacts(business_id);
CREATE INDEX idx_uploaded_contacts_email ON uploaded_contacts(contact_email);
CREATE INDEX idx_uploaded_contacts_matched_user ON uploaded_contacts(matched_user_id);
CREATE INDEX idx_uploaded_contacts_verified ON uploaded_contacts(verified_by_contact);
CREATE INDEX idx_uploaded_contacts_match_confidence ON uploaded_contacts(match_confidence DESC);

-- ========================================
-- 4. SEARCH MATCHES (AI matching log)
-- ========================================
CREATE TABLE IF NOT EXISTS search_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Who searched
  user_id UUID REFERENCES users(id),
  session_id TEXT, -- for anonymous users
  
  -- What they searched
  query_text TEXT NOT NULL,
  query_type TEXT, -- stallion, trainer, vet, transport, etc
  query_location_state TEXT,
  query_location_city TEXT,
  
  -- AI analysis
  extracted_intent JSONB, -- what the AI understood
  
  -- Results
  matched_business_ids UUID[] NOT NULL,
  top_3_business_ids UUID[],
  result_count INTEGER,
  
  -- User interaction
  clicked_business_id UUID REFERENCES businesses(id),
  clicked_at TIMESTAMPTZ,
  converted BOOLEAN DEFAULT false, -- did they contact the business
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_search_matches_user ON search_matches(user_id);
CREATE INDEX idx_search_matches_query_type ON search_matches(query_type);
CREATE INDEX idx_search_matches_location ON search_matches(query_location_state);
CREATE INDEX idx_search_matches_clicked ON search_matches(clicked_business_id);
CREATE INDEX idx_search_matches_created ON search_matches(created_at DESC);
CREATE INDEX idx_search_matches_converted ON search_matches(converted);

-- ========================================
-- 5. BUSINESS RANKINGS (computed daily)
-- ========================================
CREATE TABLE IF NOT EXISTS business_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  
  -- Ranking factors
  verified_bonus INTEGER DEFAULT 0,
  crm_uploaded_bonus INTEGER DEFAULT 0,
  contacts_uploaded_score INTEGER DEFAULT 0,
  verified_contacts_score INTEGER DEFAULT 0,
  search_matches_score INTEGER DEFAULT 0,
  click_through_score INTEGER DEFAULT 0,
  conversion_score INTEGER DEFAULT 0,
  profile_completeness_score INTEGER DEFAULT 0,
  
  -- Total
  total_score INTEGER DEFAULT 0,
  
  -- Position in category
  category_rank INTEGER,
  state_rank INTEGER,
  
  -- Time period
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(business_id, calculated_at)
);

CREATE INDEX idx_rankings_business ON business_rankings(business_id);
CREATE INDEX idx_rankings_score ON business_rankings(total_score DESC);
CREATE INDEX idx_rankings_date ON business_rankings(calculated_at DESC);

-- ========================================
-- 6. VERIFICATION EMAILS LOG
-- ========================================
CREATE TABLE IF NOT EXISTS verification_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  recipient_type TEXT NOT NULL, -- 'business' or 'contact'
  business_id UUID REFERENCES businesses(id),
  uploaded_contact_id UUID REFERENCES uploaded_contacts(id),
  
  email_to TEXT NOT NULL,
  email_subject TEXT,
  email_body TEXT,
  
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  opened BOOLEAN DEFAULT false,
  opened_at TIMESTAMPTZ,
  clicked BOOLEAN DEFAULT false,
  clicked_at TIMESTAMPTZ,
  
  verification_completed BOOLEAN DEFAULT false,
  verification_completed_at TIMESTAMPTZ
);

CREATE INDEX idx_verification_emails_business ON verification_emails(business_id);
CREATE INDEX idx_verification_emails_contact ON verification_emails(uploaded_contact_id);
CREATE INDEX idx_verification_emails_opened ON verification_emails(opened);

-- ========================================
-- 7. CONTACT MATCH SUGGESTIONS (AI-powered)
-- ========================================
CREATE TABLE IF NOT EXISTS contact_match_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  uploaded_contact_id UUID NOT NULL REFERENCES uploaded_contacts(id),
  suggested_user_id UUID NOT NULL REFERENCES users(id),
  
  match_score DECIMAL(3,2), -- 0.00 to 1.00
  match_reasons JSONB, -- why we think it's a match
  
  reviewed BOOLEAN DEFAULT false,
  accepted BOOLEAN,
  reviewed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(uploaded_contact_id, suggested_user_id)
);

CREATE INDEX idx_match_suggestions_contact ON contact_match_suggestions(uploaded_contact_id);
CREATE INDEX idx_match_suggestions_user ON contact_match_suggestions(suggested_user_id);
CREATE INDEX idx_match_suggestions_score ON contact_match_suggestions(match_score DESC);

-- ========================================
-- FUNCTIONS & TRIGGERS
-- ========================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER horses_updated_at BEFORE UPDATE ON horses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER businesses_updated_at BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-match contacts to users when uploaded
CREATE OR REPLACE FUNCTION match_contact_to_user()
RETURNS TRIGGER AS $$
DECLARE
  matched_user UUID;
  confidence DECIMAL;
BEGIN
  -- Try exact email match first
  SELECT id INTO matched_user
  FROM users
  WHERE email = NEW.contact_email
  LIMIT 1;
  
  IF matched_user IS NOT NULL THEN
    NEW.matched_user_id := matched_user;
    NEW.match_confidence := 1.00;
    NEW.matched_at := NOW();
  ELSE
    -- Try fuzzy match on name + phone
    -- (implement more sophisticated matching later)
    NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_match_contacts BEFORE INSERT ON uploaded_contacts
  FOR EACH ROW EXECUTE FUNCTION match_contact_to_user();

-- Calculate business ranking
CREATE OR REPLACE FUNCTION calculate_business_ranking(biz_id UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  biz RECORD;
  matches_30d INTEGER;
  clicks_30d INTEGER;
  conversions_30d INTEGER;
BEGIN
  SELECT * INTO biz FROM businesses WHERE id = biz_id;
  
  -- Verification bonus
  IF biz.verified THEN
    score := score + 100;
  END IF;
  
  -- CRM upload bonus
  IF biz.crm_uploaded THEN
    score := score + 200;
  END IF;
  
  -- Contacts uploaded (2 points each, max 500)
  score := score + LEAST(biz.total_contacts_uploaded * 2, 500);
  
  -- Verified contacts (5 points each, max 500)
  score := score + LEAST(biz.verified_contacts_count * 5, 500);
  
  -- Search matches last 30 days (10 points each)
  SELECT COUNT(*) INTO matches_30d
  FROM search_matches
  WHERE biz_id = ANY(matched_business_ids)
    AND created_at > NOW() - INTERVAL '30 days';
  score := score + (matches_30d * 10);
  
  -- Clicks last 30 days (20 points each)
  SELECT COUNT(*) INTO clicks_30d
  FROM search_matches
  WHERE clicked_business_id = biz_id
    AND created_at > NOW() - INTERVAL '30 days';
  score := score + (clicks_30d * 20);
  
  -- Conversions last 30 days (50 points each)
  SELECT COUNT(*) INTO conversions_30d
  FROM search_matches
  WHERE clicked_business_id = biz_id
    AND converted = true
    AND created_at > NOW() - INTERVAL '30 days';
  score := score + (conversions_30d * 50);
  
  -- Update business
  UPDATE businesses 
  SET ranking_score = score,
      last_ranking_update = NOW(),
      search_matches_30d = matches_30d
  WHERE id = biz_id;
  
  -- Log ranking history
  INSERT INTO business_rankings (
    business_id,
    verified_bonus,
    crm_uploaded_bonus,
    contacts_uploaded_score,
    verified_contacts_score,
    search_matches_score,
    click_through_score,
    conversion_score,
    total_score
  ) VALUES (
    biz_id,
    CASE WHEN biz.verified THEN 100 ELSE 0 END,
    CASE WHEN biz.crm_uploaded THEN 200 ELSE 0 END,
    LEAST(biz.total_contacts_uploaded * 2, 500),
    LEAST(biz.verified_contacts_count * 5, 500),
    matches_30d * 10,
    clicks_30d * 20,
    conversions_30d * 50,
    score
  );
  
  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT ALL ON users TO authenticated, anon;
GRANT ALL ON horses TO authenticated, anon;
GRANT ALL ON businesses TO authenticated, anon;
GRANT ALL ON uploaded_contacts TO authenticated, anon;
GRANT ALL ON search_matches TO authenticated, anon;
GRANT ALL ON business_rankings TO authenticated, anon;
GRANT ALL ON verification_emails TO authenticated, anon;
GRANT ALL ON contact_match_suggestions TO authenticated, anon;
