-- Athlete Portal Database Schema
-- For riders/athletes to manage competition schedules, performance tracking, and horse partnerships

-- Athlete profiles table
CREATE TABLE IF NOT EXISTS athlete_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rider_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location_city TEXT,
  location_state TEXT,
  location_country TEXT DEFAULT 'USA',
  
  -- Athlete details
  age INTEGER,
  years_riding INTEGER,
  primary_disciplines TEXT[], -- ['barrel_racing', 'cutting', 'reining', 'pole_bending', 'team_roping']
  skill_level TEXT, -- 'beginner', 'intermediate', 'advanced', 'professional'
  
  -- Competition details
  competition_level TEXT, -- 'local', 'regional', 'national', 'professional'
  preferred_events TEXT[], -- ['rodeo', 'horse_shows', 'cutting_contests', 'reining_shows']
  travel_radius_miles INTEGER DEFAULT 100,
  
  -- Horse partnerships
  owns_horses INTEGER DEFAULT 0,
  leases_horses INTEGER DEFAULT 0,
  rides_for_others BOOLEAN DEFAULT false,
  
  -- Business details
  professional_rider BOOLEAN DEFAULT false,
  trainer BOOLEAN DEFAULT false,
  lesson_instructor BOOLEAN DEFAULT false,
  taking_clients BOOLEAN DEFAULT false,
  
  -- Social media and marketing
  instagram_handle TEXT,
  facebook_page TEXT,
  website TEXT,
  bio TEXT,
  
  -- Subscription details
  subscription_tier TEXT DEFAULT 'basic', -- 'basic', 'pro', 'professional'
  subscription_expires_at TIMESTAMPTZ,
  
  -- Status
  verified BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Athlete horses (horses they own, lease, or ride)
CREATE TABLE IF NOT EXISTS athlete_horses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  horse_name TEXT NOT NULL,
  registered_name TEXT,
  registration_number TEXT,
  breed TEXT NOT NULL,
  sex TEXT NOT NULL CHECK (sex IN ('mare', 'stallion', 'gelding')),
  birth_year INTEGER,
  color TEXT,
  
  -- Ownership details
  ownership_type TEXT NOT NULL CHECK (ownership_type IN ('owned', 'leased', 'rides_for_owner')),
  owner_name TEXT,
  owner_contact TEXT,
  
  -- Bloodline information
  sire_name TEXT,
  sire_registration TEXT,
  dam_name TEXT,
  dam_registration TEXT,
  
  -- Performance data
  primary_discipline TEXT,
  performance_disciplines TEXT[],
  performance_earnings DECIMAL(10,2) DEFAULT 0,
  performance_highlights TEXT,
  best_times TEXT, -- JSON for different events
  
  -- Competition status
  competition_status TEXT DEFAULT 'active', -- 'active', 'retired', 'injured', 'inactive'
  competition_level TEXT, -- 'local', 'regional', 'national', 'professional'
  
  -- Training and care
  trainer_name TEXT,
  farrier_name TEXT,
  vet_name TEXT,
  feed_program TEXT,
  
  -- Media
  profile_photo_url TEXT,
  video_url TEXT,
  performance_videos TEXT[],
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competition schedules and results
CREATE TABLE IF NOT EXISTS athlete_competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  horse_id UUID REFERENCES athlete_horses(id) ON DELETE CASCADE,
  
  -- Event details
  event_name TEXT NOT NULL,
  event_location TEXT NOT NULL,
  event_city TEXT,
  event_state TEXT,
  event_date DATE NOT NULL,
  event_type TEXT, -- 'rodeo', 'horse_show', 'cutting_contest', 'reining_show'
  discipline TEXT NOT NULL,
  
  -- Competition details
  division TEXT, -- 'open', 'amateur', 'youth', 'senior', 'novice'
  class_name TEXT,
  entry_fee DECIMAL(8,2),
  
  -- Results
  placement INTEGER,
  total_entries INTEGER,
  score DECIMAL(8,2),
  time DECIMAL(8,3), -- for timed events
  earnings DECIMAL(10,2) DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  
  -- Performance notes
  performance_notes TEXT,
  judge_comments TEXT,
  video_url TEXT,
  
  -- Status
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'no_show'
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training and lesson records
CREATE TABLE IF NOT EXISTS athlete_training (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  horse_id UUID REFERENCES athlete_horses(id) ON DELETE CASCADE,
  
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
  
  -- Media
  video_url TEXT,
  photos TEXT[],
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goals and achievements
CREATE TABLE IF NOT EXISTS athlete_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  
  -- Goal details
  goal_title TEXT NOT NULL,
  goal_description TEXT,
  goal_type TEXT, -- 'competition', 'skill', 'horse', 'financial', 'career'
  discipline TEXT,
  
  -- Timeline
  target_date DATE,
  created_date DATE DEFAULT CURRENT_DATE,
  
  -- Progress tracking
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'paused', 'cancelled'
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  
  -- Milestones
  milestones TEXT[],
  completed_milestones TEXT[],
  
  -- Achievement details
  achievement_date DATE,
  achievement_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Athlete analytics and insights
CREATE TABLE IF NOT EXISTS athlete_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  
  -- Competition metrics
  total_competitions INTEGER DEFAULT 0,
  competitions_won INTEGER DEFAULT 0,
  win_percentage DECIMAL(5,2),
  total_earnings DECIMAL(12,2) DEFAULT 0,
  average_earnings_per_event DECIMAL(10,2) DEFAULT 0,
  
  -- Performance metrics
  best_time_improvement DECIMAL(8,3),
  consistency_score DECIMAL(5,2),
  top_performing_horse TEXT,
  most_successful_discipline TEXT,
  
  -- Training metrics
  total_training_hours INTEGER DEFAULT 0,
  training_sessions INTEGER DEFAULT 0,
  skill_improvement_score DECIMAL(5,2),
  
  -- Goal metrics
  goals_set INTEGER DEFAULT 0,
  goals_achieved INTEGER DEFAULT 0,
  goal_completion_rate DECIMAL(5,2),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_athlete_profiles_user_id ON athlete_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_athlete_profiles_location ON athlete_profiles(location_state, location_city);
CREATE INDEX IF NOT EXISTS idx_athlete_profiles_disciplines ON athlete_profiles USING GIN(primary_disciplines);
CREATE INDEX IF NOT EXISTS idx_athlete_horses_athlete_id ON athlete_horses(athlete_id);
CREATE INDEX IF NOT EXISTS idx_athlete_horses_ownership_type ON athlete_horses(ownership_type);
CREATE INDEX IF NOT EXISTS idx_athlete_competitions_athlete_id ON athlete_competitions(athlete_id);
CREATE INDEX IF NOT EXISTS idx_athlete_competitions_event_date ON athlete_competitions(event_date);
CREATE INDEX IF NOT EXISTS idx_athlete_competitions_discipline ON athlete_competitions(discipline);
CREATE INDEX IF NOT EXISTS idx_athlete_training_athlete_id ON athlete_training(athlete_id);
CREATE INDEX IF NOT EXISTS idx_athlete_training_date ON athlete_training(training_date);
CREATE INDEX IF NOT EXISTS idx_athlete_goals_athlete_id ON athlete_goals(athlete_id);
CREATE INDEX IF NOT EXISTS idx_athlete_goals_status ON athlete_goals(status);
CREATE INDEX IF NOT EXISTS idx_athlete_analytics_athlete_id ON athlete_analytics(athlete_id);
CREATE INDEX IF NOT EXISTS idx_athlete_analytics_date ON athlete_analytics(metric_date);

-- Enable RLS
ALTER TABLE athlete_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_horses ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_training ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view all athlete profiles" ON athlete_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own athlete profile" ON athlete_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own athlete profile" ON athlete_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own athlete profile" ON athlete_profiles FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view all athlete horses" ON athlete_horses FOR SELECT USING (true);
CREATE POLICY "Athletes can manage their horses" ON athlete_horses FOR ALL USING (
  EXISTS (SELECT 1 FROM athlete_profiles WHERE id = athlete_id AND user_id = auth.uid())
);

CREATE POLICY "Athletes can manage their competitions" ON athlete_competitions FOR ALL USING (
  EXISTS (SELECT 1 FROM athlete_profiles WHERE id = athlete_id AND user_id = auth.uid())
);

CREATE POLICY "Athletes can manage their training" ON athlete_training FOR ALL USING (
  EXISTS (SELECT 1 FROM athlete_profiles WHERE id = athlete_id AND user_id = auth.uid())
);

CREATE POLICY "Athletes can manage their goals" ON athlete_goals FOR ALL USING (
  EXISTS (SELECT 1 FROM athlete_profiles WHERE id = athlete_id AND user_id = auth.uid())
);

CREATE POLICY "Athletes can view their analytics" ON athlete_analytics FOR SELECT USING (
  EXISTS (SELECT 1 FROM athlete_profiles WHERE id = athlete_id AND user_id = auth.uid())
);





