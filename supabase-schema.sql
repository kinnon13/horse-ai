-- Horse.AI Database Schema for Supabase
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'intro', 'pro')),
  points INTEGER DEFAULT 0,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  ai_queries_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create horses table
CREATE TABLE IF NOT EXISTS public.horses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  reg_number TEXT,
  sire TEXT,
  dam TEXT,
  owner_name TEXT,
  rider_name TEXT,
  breeder_name TEXT,
  discipline TEXT,
  notes TEXT,
  earnings DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  discipline TEXT NOT NULL,
  location TEXT,
  prize_money DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audits table for AI verification
CREATE TABLE IF NOT EXISTS public.audits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  horse_id UUID REFERENCES public.horses(id) ON DELETE CASCADE,
  audit_type TEXT NOT NULL CHECK (audit_type IN ('csv_upload', 'ai_verification', 'data_correction')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'verified', 'flagged', 'corrected')),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create horse_event_entries table for many-to-many relationship
CREATE TABLE IF NOT EXISTS public.horse_event_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  horse_id UUID REFERENCES public.horses(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  placement TEXT,
  earnings DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table for AI conversations
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_horses_name ON public.horses(name);
CREATE INDEX IF NOT EXISTS idx_horses_breed ON public.horses(breed);
CREATE INDEX IF NOT EXISTS idx_horses_sire ON public.horses(sire);
CREATE INDEX IF NOT EXISTS idx_horses_dam ON public.horses(dam);
CREATE INDEX IF NOT EXISTS idx_horses_earnings ON public.horses(earnings);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_discipline ON public.events(discipline);
CREATE INDEX IF NOT EXISTS idx_audits_horse_id ON public.audits(horse_id);
CREATE INDEX IF NOT EXISTS idx_audits_status ON public.audits(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horse_event_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Horses are visible to all authenticated users (for community features)
CREATE POLICY "Authenticated users can view horses" ON public.horses
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert horses" ON public.horses
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update horses" ON public.horses
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Events are visible to all authenticated users
CREATE POLICY "Authenticated users can view events" ON public.events
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert events" ON public.events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Audits are visible to all authenticated users
CREATE POLICY "Authenticated users can view audits" ON public.audits
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can insert audits" ON public.audits
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Chat messages are private to each user
CREATE POLICY "Users can view own messages" ON public.chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_horses_updated_at BEFORE UPDATE ON public.horses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, subscription_tier, points)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'free',
    100 -- Welcome bonus points
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create scraped_data table for self-expanding scrubs
CREATE TABLE IF NOT EXISTS public.scraped_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  horse_name TEXT NOT NULL,
  earnings DECIMAL(10,2),
  progeny JSONB,
  owners JSONB,
  riders JSONB,
  articles JSONB,
  social_media JSONB,
  bloodline JSONB,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create linked_entities table for mentioned people
CREATE TABLE IF NOT EXISTS public.linked_entities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('owner', 'rider', 'trainer', 'breeder')),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, type, user_id)
);

-- Create export_jobs table for CSV/PDF exports
CREATE TABLE IF NOT EXISTS public.export_jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL CHECK (job_type IN ('csv', 'pdf', 'report')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  filters JSONB,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create search_analytics table for niche insights
CREATE TABLE IF NOT EXISTS public.search_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  search_query TEXT NOT NULL,
  niche TEXT,
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create consent_records table for data sharing
CREATE TABLE IF NOT EXISTS public.consent_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('data_sharing', 'marketing', 'analytics')),
  granted BOOLEAN NOT NULL,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table for push notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Create sync_records table for CRM integrations
CREATE TABLE IF NOT EXISTS public.sync_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL CHECK (sync_type IN ('google_drive', 'hexicode', 'other')),
  file_url TEXT,
  contacts_count INTEGER DEFAULT 0,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create promo_tracking table for cross-promo analytics
CREATE TABLE IF NOT EXISTS public.promo_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  promo_id TEXT NOT NULL,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add FCM token to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS fcm_token TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS anonymous_session_id TEXT;

-- Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_scraped_data_horse_name ON public.scraped_data(horse_name);
CREATE INDEX IF NOT EXISTS idx_scraped_data_user_id ON public.scraped_data(user_id);
CREATE INDEX IF NOT EXISTS idx_linked_entities_name ON public.linked_entities(name);
CREATE INDEX IF NOT EXISTS idx_linked_entities_type ON public.linked_entities(type);
CREATE INDEX IF NOT EXISTS idx_export_jobs_user_id ON public.export_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_export_jobs_status ON public.export_jobs(status);
CREATE INDEX IF NOT EXISTS idx_search_analytics_niche ON public.search_analytics(niche);
CREATE INDEX IF NOT EXISTS idx_consent_records_user_id ON public.consent_records(user_id);

-- Enable RLS for new tables
ALTER TABLE public.scraped_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linked_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables
CREATE POLICY "Users can view own scraped data" ON public.scraped_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scraped data" ON public.scraped_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own linked entities" ON public.linked_entities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own linked entities" ON public.linked_entities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own export jobs" ON public.export_jobs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own export jobs" ON public.export_jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own search analytics" ON public.search_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own search analytics" ON public.search_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own consent records" ON public.consent_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own consent records" ON public.consent_records
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view own sync records" ON public.sync_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert sync records" ON public.sync_records
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view own promo tracking" ON public.promo_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own promo tracking" ON public.promo_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to trigger horse scrub on insert
CREATE OR REPLACE FUNCTION trigger_horse_scrub()
RETURNS TRIGGER AS $$
BEGIN
  -- This would call the scraping agent API
  -- In production, you'd use pg_cron or a webhook
  PERFORM pg_notify('horse_inserted', NEW.name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for horse insert
CREATE TRIGGER on_horse_insert
  AFTER INSERT ON public.horses
  FOR EACH ROW EXECUTE FUNCTION trigger_horse_scrub();

-- Insert sample data (optional)
INSERT INTO public.horses (name, breed, sire, dam, earnings, discipline) VALUES
('Dash Ta Fame', 'AQHA', 'First Down Dash', 'Sudden Fame', 15000.00, 'Barrel Racing'),
('First Down Dash', 'AQHA', 'Dash For Cash', 'First Prize Rose', 25000.00, 'Barrel Racing'),
('Sudden Fame', 'AQHA', 'Famous Coup', 'Sudden Money', 12000.00, 'Barrel Racing'),
('Dash For Cash', 'AQHA', 'Rocket Wrangler', ' Find A Buyer', 35000.00, 'Barrel Racing');

INSERT INTO public.events (name, date, discipline, location, prize_money) VALUES
('Diamond Classic', '2025-10-01', 'Barrel Racing', 'Fort Worth, TX', 50000.00),
('World Championship', '2025-11-15', 'Barrel Racing', 'Oklahoma City, OK', 100000.00),
('Breeders Cup', '2025-12-01', 'Quarter Horse Racing', 'Los Alamitos, CA', 200000.00);

-- Create data retention and compliance tables
CREATE TABLE IF NOT EXISTS public.data_export_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  export_types TEXT[] NOT NULL,
  export_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed'))
);

CREATE TABLE IF NOT EXISTS public.data_deletion_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  deletion_types TEXT[] NOT NULL,
  deletion_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  details JSONB
);

CREATE TABLE IF NOT EXISTS public.opt_out_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  contact_method TEXT NOT NULL CHECK (contact_method IN ('sms', 'email')),
  reason TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('processed', 'failed'))
);

CREATE TABLE IF NOT EXISTS public.scraped_data_archive (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  original_id UUID,
  horse_name TEXT NOT NULL,
  earnings DECIMAL(10,2),
  progeny JSONB,
  owners JSONB,
  riders JSONB,
  articles JSONB,
  social_media JSONB,
  bloodline JSONB,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE,
  archived_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add opt-out fields to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS do_not_contact BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS opt_out_reason TEXT,
ADD COLUMN IF NOT EXISTS opt_out_date TIMESTAMP WITH TIME ZONE;

-- Create indexes for compliance queries
CREATE INDEX IF NOT EXISTS idx_data_export_logs_user_id ON public.data_export_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_data_deletion_logs_user_id ON public.data_deletion_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_opt_out_logs_user_id ON public.opt_out_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_scraped_data_archive_user_id ON public.scraped_data_archive(user_id);

-- Create RLS policies for compliance tables
ALTER TABLE public.data_export_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_deletion_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opt_out_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scraped_data_archive ENABLE ROW LEVEL SECURITY;

-- Users can only see their own compliance data
CREATE POLICY "Users can view own export logs" ON public.data_export_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own deletion logs" ON public.data_deletion_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own opt-out logs" ON public.opt_out_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own archived data" ON public.scraped_data_archive
  FOR SELECT USING (auth.uid() = user_id);
