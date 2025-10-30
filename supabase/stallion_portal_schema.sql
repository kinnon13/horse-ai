-- Stallion Portal Database Schema
-- For stallion stations to manage breeding books, pricing, availability, and client relationships

-- Stallion station profiles table
CREATE TABLE IF NOT EXISTS stallion_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  station_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  location_city TEXT,
  location_state TEXT,
  location_country TEXT DEFAULT 'USA',
  
  -- Station details
  years_in_business INTEGER,
  total_stallions INTEGER DEFAULT 0,
  annual_breedings INTEGER DEFAULT 0,
  breeding_methods TEXT[], -- ['live_cover', 'ai', 'frozen', 'fresh_cooled']
  
  -- Services offered
  services TEXT[], -- ['breeding', 'collection', 'storage', 'shipping', 'mare_care', 'foaling']
  ai_services BOOLEAN DEFAULT false,
  live_cover_services BOOLEAN DEFAULT false,
  mare_care BOOLEAN DEFAULT false,
  foaling_services BOOLEAN DEFAULT false,
  
  -- Business status
  taking_clients BOOLEAN DEFAULT true,
  verified BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  
  -- Subscription details
  subscription_tier TEXT DEFAULT 'basic', -- 'basic', 'pro', 'premium'
  subscription_expires_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stallion profiles (horses owned/managed by the station)
CREATE TABLE IF NOT EXISTS stallion_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID REFERENCES stallion_stations(id) ON DELETE CASCADE,
  stallion_name TEXT NOT NULL,
  registered_name TEXT,
  registration_number TEXT,
  breed TEXT NOT NULL,
  birth_year INTEGER,
  color TEXT,
  
  -- Bloodline information
  sire_name TEXT,
  sire_registration TEXT,
  dam_name TEXT,
  dam_registration TEXT,
  pedigree_url TEXT,
  
  -- Performance data
  performance_disciplines TEXT[], -- ['barrel_racing', 'cutting', 'reining', 'halter']
  performance_earnings DECIMAL(12,2) DEFAULT 0,
  performance_highlights TEXT,
  best_times TEXT, -- JSON for different events
  
  -- Breeding information
  breeding_status TEXT DEFAULT 'active', -- 'active', 'retired', 'inactive', 'limited'
  breeding_fee DECIMAL(10,2),
  breeding_fee_terms TEXT,
  ai_available BOOLEAN DEFAULT false,
  live_cover_available BOOLEAN DEFAULT false,
  frozen_available BOOLEAN DEFAULT false,
  fresh_cooled_available BOOLEAN DEFAULT false,
  
  -- Health and genetics
  health_clearances TEXT[], -- ['navicular', 'hypp', 'herda', 'pssm']
  genetic_testing TEXT[],
  fertility_status TEXT, -- 'excellent', 'good', 'fair', 'poor'
  
  -- Breeding statistics
  total_breedings INTEGER DEFAULT 0,
  successful_breedings INTEGER DEFAULT 0,
  pregnancy_rate DECIMAL(5,2), -- percentage
  foal_rate DECIMAL(5,2), -- percentage
  top_performing_offspring TEXT[],
  
  -- Media
  profile_photo_url TEXT,
  video_url TEXT,
  performance_videos TEXT[],
  offspring_photos TEXT[],
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Breeding clients (people who breed to stallions)
CREATE TABLE IF NOT EXISTS stallion_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID REFERENCES stallion_stations(id) ON DELETE CASCADE,
  stallion_id UUID REFERENCES stallion_profiles(id) ON DELETE CASCADE,
  
  -- Client information
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  client_location_city TEXT,
  client_location_state TEXT,
  
  -- Mare information
  mare_name TEXT NOT NULL,
  mare_registration TEXT,
  mare_breed TEXT,
  mare_age INTEGER,
  
  -- Breeding details
  breeding_year INTEGER,
  breeding_method TEXT, -- 'live_cover', 'ai', 'frozen', 'fresh_cooled'
  breeding_date DATE,
  breeding_status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  
  -- Financial
  breeding_fee DECIMAL(10,2),
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'partial', 'refunded'
  payment_method TEXT,
  payment_date DATE,
  
  -- Result tracking
  pregnancy_confirmed BOOLEAN DEFAULT false,
  pregnancy_date DATE,
  foal_due_date DATE,
  foal_born_date DATE,
  foal_name TEXT,
  foal_registration TEXT,
  foal_sex TEXT CHECK (foal_sex IN ('colt', 'filly')),
  foal_color TEXT,
  
  -- Communication
  notes TEXT,
  last_contact_date TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Breeding records and statistics
CREATE TABLE IF NOT EXISTS stallion_breeding_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID REFERENCES stallion_stations(id) ON DELETE CASCADE,
  stallion_id UUID REFERENCES stallion_profiles(id) ON DELETE CASCADE,
  
  -- Breeding details
  breeding_year INTEGER NOT NULL,
  total_breedings INTEGER DEFAULT 0,
  successful_breedings INTEGER DEFAULT 0,
  pregnancy_rate DECIMAL(5,2),
  foal_rate DECIMAL(5,2),
  
  -- Financial metrics
  total_revenue DECIMAL(12,2) DEFAULT 0,
  average_breeding_fee DECIMAL(10,2) DEFAULT 0,
  
  -- Performance metrics
  top_performing_offspring TEXT[],
  most_popular_breeding_method TEXT,
  
  -- Client metrics
  new_clients INTEGER DEFAULT 0,
  returning_clients INTEGER DEFAULT 0,
  client_retention_rate DECIMAL(5,2),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stallion availability calendar
CREATE TABLE IF NOT EXISTS stallion_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stallion_id UUID REFERENCES stallion_profiles(id) ON DELETE CASCADE,
  
  -- Availability details
  date DATE NOT NULL,
  available BOOLEAN DEFAULT true,
  max_breedings INTEGER DEFAULT 1,
  current_bookings INTEGER DEFAULT 0,
  
  -- Restrictions
  restrictions TEXT, -- 'health', 'performance', 'owner_request'
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stallion analytics and insights
CREATE TABLE IF NOT EXISTS stallion_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID REFERENCES stallion_stations(id) ON DELETE CASCADE,
  stallion_id UUID REFERENCES stallion_profiles(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  
  -- Breeding metrics
  total_breedings INTEGER DEFAULT 0,
  successful_breedings INTEGER DEFAULT 0,
  pregnancy_rate DECIMAL(5,2),
  foal_rate DECIMAL(5,2),
  
  -- Financial metrics
  total_revenue DECIMAL(12,2) DEFAULT 0,
  average_breeding_fee DECIMAL(10,2) DEFAULT 0,
  
  -- Client metrics
  new_clients INTEGER DEFAULT 0,
  returning_clients INTEGER DEFAULT 0,
  client_retention_rate DECIMAL(5,2),
  
  -- Performance metrics
  top_performing_offspring TEXT,
  most_popular_breeding_method TEXT,
  booking_fill_rate DECIMAL(5,2),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_stallion_stations_user_id ON stallion_stations(user_id);
CREATE INDEX IF NOT EXISTS idx_stallion_stations_location ON stallion_stations(location_state, location_city);
CREATE INDEX IF NOT EXISTS idx_stallion_stations_services ON stallion_stations USING GIN(services);
CREATE INDEX IF NOT EXISTS idx_stallion_profiles_station_id ON stallion_profiles(station_id);
CREATE INDEX IF NOT EXISTS idx_stallion_profiles_breed ON stallion_profiles(breed);
CREATE INDEX IF NOT EXISTS idx_stallion_profiles_breeding_status ON stallion_profiles(breeding_status);
CREATE INDEX IF NOT EXISTS idx_stallion_clients_station_id ON stallion_clients(station_id);
CREATE INDEX IF NOT EXISTS idx_stallion_clients_stallion_id ON stallion_clients(stallion_id);
CREATE INDEX IF NOT EXISTS idx_stallion_clients_breeding_year ON stallion_clients(breeding_year);
CREATE INDEX IF NOT EXISTS idx_stallion_breeding_records_station_id ON stallion_breeding_records(station_id);
CREATE INDEX IF NOT EXISTS idx_stallion_breeding_records_stallion_id ON stallion_breeding_records(stallion_id);
CREATE INDEX IF NOT EXISTS idx_stallion_breeding_records_year ON stallion_breeding_records(breeding_year);
CREATE INDEX IF NOT EXISTS idx_stallion_availability_stallion_id ON stallion_availability(stallion_id);
CREATE INDEX IF NOT EXISTS idx_stallion_availability_date ON stallion_availability(date);
CREATE INDEX IF NOT EXISTS idx_stallion_analytics_station_id ON stallion_analytics(station_id);
CREATE INDEX IF NOT EXISTS idx_stallion_analytics_stallion_id ON stallion_analytics(stallion_id);
CREATE INDEX IF NOT EXISTS idx_stallion_analytics_date ON stallion_analytics(metric_date);

-- Enable RLS
ALTER TABLE stallion_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE stallion_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stallion_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE stallion_breeding_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE stallion_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE stallion_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view all stallion stations" ON stallion_stations FOR SELECT USING (true);
CREATE POLICY "Users can insert their own stallion station" ON stallion_stations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own stallion station" ON stallion_stations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own stallion station" ON stallion_stations FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view all stallion profiles" ON stallion_profiles FOR SELECT USING (true);
CREATE POLICY "Stations can manage their stallions" ON stallion_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM stallion_stations WHERE id = station_id AND user_id = auth.uid())
);

CREATE POLICY "Stations can manage their clients" ON stallion_clients FOR ALL USING (
  EXISTS (SELECT 1 FROM stallion_stations WHERE id = station_id AND user_id = auth.uid())
);

CREATE POLICY "Stations can manage their breeding records" ON stallion_breeding_records FOR ALL USING (
  EXISTS (SELECT 1 FROM stallion_stations WHERE id = station_id AND user_id = auth.uid())
);

CREATE POLICY "Stations can manage stallion availability" ON stallion_availability FOR ALL USING (
  EXISTS (SELECT 1 FROM stallion_profiles WHERE id = stallion_id AND station_id IN (
    SELECT id FROM stallion_stations WHERE user_id = auth.uid()
  ))
);

CREATE POLICY "Stations can view their analytics" ON stallion_analytics FOR SELECT USING (
  EXISTS (SELECT 1 FROM stallion_stations WHERE id = station_id AND user_id = auth.uid())
);




