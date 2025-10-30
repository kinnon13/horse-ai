-- HorseGPT Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('guest', 'free', 'basic', 'plus')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User horses table
CREATE TABLE IF NOT EXISTS user_horses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sex TEXT CHECK (sex IN ('mare', 'stud', 'gelding', 'filly', 'colt', 'unknown')),
  year TEXT,
  location_city TEXT,
  location_state TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Horses master table (your 12k horses database)
CREATE TABLE IF NOT EXISTS horses_master (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reg_name TEXT NOT NULL,
  sex TEXT,
  yob TEXT,
  sire TEXT,
  dam TEXT,
  discipline TEXT,
  last_known_price TEXT,
  location_region TEXT,
  notes TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Results master table (performance data)
CREATE TABLE IF NOT EXISTS results_master (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  horse_reg_name TEXT NOT NULL,
  event_name TEXT,
  event_type TEXT,
  event_date TEXT,
  placement TEXT,
  earnings DECIMAL,
  discipline TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  description TEXT,
  has_update BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Providers table
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  service_type TEXT NOT NULL,
  city TEXT,
  state TEXT,
  contact TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Message usage table (for rate limiting)
CREATE TABLE IF NOT EXISTS message_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Horse claims table
CREATE TABLE IF NOT EXISTS horse_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  horse_id UUID REFERENCES horses_master(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'breeder', 'rider', 'producer')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_horses_user_id ON user_horses(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_message_usage_user_id ON message_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_message_usage_created_at ON message_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_horses_master_reg_name ON horses_master(reg_name);
CREATE INDEX IF NOT EXISTS idx_results_master_horse_name ON results_master(horse_reg_name);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_horses ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE horse_claims ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_horses table
CREATE POLICY "Users can view own horses" ON user_horses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own horses" ON user_horses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own horses" ON user_horses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own horses" ON user_horses
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for alerts table
CREATE POLICY "Users can view own alerts" ON alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alerts" ON alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts" ON alerts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts" ON alerts
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for message_usage table
CREATE POLICY "Users can view own usage" ON message_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage" ON message_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for horse_claims table
CREATE POLICY "Users can view own claims" ON horse_claims
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own claims" ON horse_claims
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read access for horses_master, results_master, and providers
CREATE POLICY "Anyone can view horses_master" ON horses_master
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view results_master" ON results_master
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view providers" ON providers
  FOR SELECT USING (true);

-- Insert some sample data for testing
INSERT INTO horses_master (reg_name, sex, yob, sire, dam, discipline, last_known_price, location_region) VALUES
('Thunder Road', 'gelding', '2018', 'Famous Sire', 'Good Dam', 'Barrel Racing', '$25,000', 'Texas'),
('Lightning Strike', 'mare', '2019', 'Fast Sire', 'Quick Dam', 'Barrel Racing', '$35,000', 'Oklahoma'),
('Storm Chaser', 'stud', '2017', 'Power Sire', 'Speed Dam', 'Barrel Racing', '$50,000', 'Texas')
ON CONFLICT DO NOTHING;

INSERT INTO results_master (horse_reg_name, event_name, event_type, event_date, placement, earnings, discipline, location) VALUES
('Thunder Road', 'Pink Buckle Futurity', 'Futurity', '2023-10-15', '1st', 15000, 'Barrel Racing', 'Fort Worth, TX'),
('Lightning Strike', 'Ruby Buckle Classic', 'Classic', '2023-11-20', '2nd', 8000, 'Barrel Racing', 'Oklahoma City, OK'),
('Storm Chaser', 'Diamond Classic', 'Classic', '2023-09-10', '1st', 20000, 'Barrel Racing', 'Dallas, TX')
ON CONFLICT DO NOTHING;

INSERT INTO providers (name, service_type, city, state, contact, active) VALUES
('Dr. Smith Equine', 'Veterinary', 'Stephenville', 'TX', 'dr.smith@equine.com', true),
('Fast Track Farrier', 'Farrier', 'Weatherford', 'TX', 'fasttrack@farrier.com', true),
('Elite Horse Transport', 'Transportation', 'Fort Worth', 'TX', 'elite@transport.com', true)
ON CONFLICT DO NOTHING;