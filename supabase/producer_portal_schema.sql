-- Producer Portal Database Schema
-- For horse producers to manage breeding operations, bloodlines, and client relationships

-- Producer profiles table
CREATE TABLE IF NOT EXISTS producer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  location_city TEXT,
  location_state TEXT,
  location_country TEXT DEFAULT 'USA',
  
  -- Business details
  years_in_business INTEGER,
  specialties TEXT[], -- ['quarter_horse', 'barrel_racing', 'cutting', 'reining', 'breeding']
  breeding_focus TEXT, -- 'performance', 'halter', 'all_around', 'specialized'
  
  -- Breeding operation details
  total_mares INTEGER DEFAULT 0,
  total_stallions INTEGER DEFAULT 0,
  annual_foals INTEGER DEFAULT 0,
  breeding_methods TEXT[], -- ['live_cover', 'ai', 'frozen', 'fresh_cooled']
  
  -- Business status
  taking_clients BOOLEAN DEFAULT true,
  verified BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  
  -- Subscription details
  subscription_tier TEXT DEFAULT 'basic', -- 'basic', 'pro', 'enterprise'
  subscription_expires_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Producer horses (mares/stallions they own/manage)
CREATE TABLE IF NOT EXISTS producer_horses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producer_id UUID REFERENCES producer_profiles(id) ON DELETE CASCADE,
  horse_name TEXT NOT NULL,
  registered_name TEXT,
  registration_number TEXT,
  breed TEXT NOT NULL,
  sex TEXT NOT NULL CHECK (sex IN ('mare', 'stallion', 'gelding')),
  birth_year INTEGER,
  color TEXT,
  
  -- Bloodline information
  sire_name TEXT,
  sire_registration TEXT,
  dam_name TEXT,
  dam_registration TEXT,
  
  -- Performance data
  performance_disciplines TEXT[], -- ['barrel_racing', 'cutting', 'reining', 'halter']
  performance_earnings DECIMAL(10,2) DEFAULT 0,
  performance_highlights TEXT,
  
  -- Breeding information
  breeding_status TEXT DEFAULT 'active', -- 'active', 'retired', 'inactive'
  breeding_fee DECIMAL(10,2),
  breeding_terms TEXT,
  ai_available BOOLEAN DEFAULT false,
  live_cover_available BOOLEAN DEFAULT false,
  
  -- Health and genetics
  health_clearances TEXT[], -- ['navicular', 'hypp', 'herda', 'pssm']
  genetic_testing TEXT[],
  
  -- Media
  profile_photo_url TEXT,
  video_url TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Producer clients (people who breed to their horses)
CREATE TABLE IF NOT EXISTS producer_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producer_id UUID REFERENCES producer_profiles(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  client_location_city TEXT,
  client_location_state TEXT,
  
  -- Breeding history
  mare_name TEXT,
  mare_registration TEXT,
  breeding_year INTEGER,
  breeding_method TEXT, -- 'live_cover', 'ai', 'frozen'
  breeding_status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  
  -- Financial
  breeding_fee DECIMAL(10,2),
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'partial', 'refunded'
  payment_method TEXT,
  
  -- Communication
  notes TEXT,
  last_contact_date TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Producer breeding records
CREATE TABLE IF NOT EXISTS producer_breeding_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producer_id UUID REFERENCES producer_profiles(id) ON DELETE CASCADE,
  stallion_id UUID REFERENCES producer_horses(id) ON DELETE CASCADE,
  mare_name TEXT NOT NULL,
  mare_registration TEXT,
  mare_owner TEXT,
  
  -- Breeding details
  breeding_date DATE,
  breeding_method TEXT, -- 'live_cover', 'ai', 'frozen'
  breeding_fee DECIMAL(10,2),
  
  -- Result tracking
  pregnancy_confirmed BOOLEAN DEFAULT false,
  pregnancy_date DATE,
  foal_due_date DATE,
  foal_born_date DATE,
  foal_name TEXT,
  foal_registration TEXT,
  foal_sex TEXT CHECK (foal_sex IN ('colt', 'filly')),
  foal_color TEXT,
  
  -- Financial
  payment_received BOOLEAN DEFAULT false,
  payment_date DATE,
  payment_amount DECIMAL(10,2),
  
  -- Notes
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Producer analytics and insights
CREATE TABLE IF NOT EXISTS producer_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producer_id UUID REFERENCES producer_profiles(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  
  -- Breeding metrics
  total_breedings INTEGER DEFAULT 0,
  successful_breedings INTEGER DEFAULT 0,
  pregnancy_rate DECIMAL(5,2), -- percentage
  foal_rate DECIMAL(5,2), -- percentage
  
  -- Financial metrics
  total_revenue DECIMAL(12,2) DEFAULT 0,
  average_breeding_fee DECIMAL(10,2) DEFAULT 0,
  
  -- Client metrics
  new_clients INTEGER DEFAULT 0,
  returning_clients INTEGER DEFAULT 0,
  client_retention_rate DECIMAL(5,2),
  
  -- Performance metrics
  top_performing_stallion TEXT,
  most_popular_breeding_method TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_producer_profiles_user_id ON producer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_producer_profiles_location ON producer_profiles(location_state, location_city);
CREATE INDEX IF NOT EXISTS idx_producer_profiles_specialties ON producer_profiles USING GIN(specialties);
CREATE INDEX IF NOT EXISTS idx_producer_horses_producer_id ON producer_horses(producer_id);
CREATE INDEX IF NOT EXISTS idx_producer_horses_sex ON producer_horses(sex);
CREATE INDEX IF NOT EXISTS idx_producer_horses_breed ON producer_horses(breed);
CREATE INDEX IF NOT EXISTS idx_producer_clients_producer_id ON producer_clients(producer_id);
CREATE INDEX IF NOT EXISTS idx_producer_breeding_records_producer_id ON producer_breeding_records(producer_id);
CREATE INDEX IF NOT EXISTS idx_producer_breeding_records_stallion_id ON producer_breeding_records(stallion_id);
CREATE INDEX IF NOT EXISTS idx_producer_analytics_producer_id ON producer_analytics(producer_id);
CREATE INDEX IF NOT EXISTS idx_producer_analytics_date ON producer_analytics(metric_date);

-- Enable RLS
ALTER TABLE producer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE producer_horses ENABLE ROW LEVEL SECURITY;
ALTER TABLE producer_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE producer_breeding_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE producer_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view all producer profiles" ON producer_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own producer profile" ON producer_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own producer profile" ON producer_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own producer profile" ON producer_profiles FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view all producer horses" ON producer_horses FOR SELECT USING (true);
CREATE POLICY "Producers can manage their horses" ON producer_horses FOR ALL USING (
  EXISTS (SELECT 1 FROM producer_profiles WHERE id = producer_id AND user_id = auth.uid())
);

CREATE POLICY "Producers can manage their clients" ON producer_clients FOR ALL USING (
  EXISTS (SELECT 1 FROM producer_profiles WHERE id = producer_id AND user_id = auth.uid())
);

CREATE POLICY "Producers can manage their breeding records" ON producer_breeding_records FOR ALL USING (
  EXISTS (SELECT 1 FROM producer_profiles WHERE id = producer_id AND user_id = auth.uid())
);

CREATE POLICY "Producers can view their analytics" ON producer_analytics FOR SELECT USING (
  EXISTS (SELECT 1 FROM producer_profiles WHERE id = producer_id AND user_id = auth.uid())
);





