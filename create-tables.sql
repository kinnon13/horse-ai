-- Create providers table
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  service_type TEXT NOT NULL,
  specialty TEXT,
  city TEXT,
  state TEXT,
  verified BOOLEAN DEFAULT FALSE,
  sponsored BOOLEAN DEFAULT FALSE,
  admin_blocked BOOLEAN DEFAULT FALSE,
  admin_block_reason TEXT,
  provider_last_seen_at TIMESTAMPTZ,
  provider_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_alerts table
CREATE TABLE IF NOT EXISTS user_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  last_notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create horse_claims table
CREATE TABLE IF NOT EXISTS horse_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  claim_type TEXT NOT NULL,
  name_submitted TEXT,
  phone TEXT,
  email TEXT,
  verification_doc_url TEXT,
  auto_verified BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES users(id)
);

-- Create message_usage table
CREATE TABLE IF NOT EXISTS message_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications_outbox table
CREATE TABLE IF NOT EXISTS notifications_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  target_phone TEXT,
  target_email TEXT,
  message_body TEXT NOT NULL,
  channel TEXT NOT NULL,
  status TEXT DEFAULT 'queued',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ
);

-- Create user_memory table
CREATE TABLE IF NOT EXISTS user_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  preferences JSONB DEFAULT '{}',
  travel_pattern JSONB DEFAULT '{}',
  current_location JSONB,
  last_known_city TEXT,
  last_known_state TEXT,
  last_seen_at TIMESTAMPTZ,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Create service_requests table
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  service_type TEXT NOT NULL,
  location_city TEXT,
  location_state TEXT,
  needed_by TIMESTAMPTZ,
  details TEXT,
  status TEXT DEFAULT 'open',
  claimed_by UUID REFERENCES providers(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Create provider_claims table
CREATE TABLE IF NOT EXISTS provider_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  service_request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  price_quoted DECIMAL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_calendar_events table
CREATE TABLE IF NOT EXISTS user_calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_title TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  location_city TEXT,
  location_state TEXT,
  horse_id UUID REFERENCES horses(id),
  reminder_time TIMESTAMPTZ,
  reminded_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_message_usage_user_time ON message_usage(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications_outbox(status, created_at);
CREATE INDEX IF NOT EXISTS idx_user_memory_user_id ON user_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status, created_at);
CREATE INDEX IF NOT EXISTS idx_calendar_user_date ON user_calendar_events(user_id, event_date);
CREATE INDEX IF NOT EXISTS idx_calendar_reminders ON user_calendar_events(reminder_time, status);



