-- HorseGPT Complete Database Schema
-- All 22 new tables for the complete money machine + logistics network

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. providers - Service Marketplace
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  service_type TEXT NOT NULL, -- 'farrier', 'repro', 'hauler', 'vet', 'trainer', 'layover_barn', 'food', 'tack_shop'
  specialty TEXT, -- 'corrective shoeing', 'ships cooled semen', 'trailer parking', '24hr', etc
  city TEXT,
  state TEXT,
  verified BOOLEAN DEFAULT FALSE,
  sponsored BOOLEAN DEFAULT FALSE, -- can pay to be top of list
  admin_blocked BOOLEAN DEFAULT FALSE, -- kill switch
  admin_block_reason TEXT,
  provider_last_seen_at TIMESTAMPTZ,
  provider_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. user_alerts - Retention Engine
CREATE TABLE user_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'paused', 'fulfilled'
  last_notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. horse_claims - Viral Growth + Auto-Verify
CREATE TABLE horse_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  claim_type TEXT NOT NULL, -- 'owner', 'rider', 'breeder', 'trainer', 'produced_event'
  name_submitted TEXT,
  phone TEXT,
  email TEXT,
  verification_doc_url TEXT, -- S3/Supabase storage URL for uploaded docs
  auto_verified BOOLEAN DEFAULT FALSE, -- AI approved from docs
  status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES users(id)
);

-- 4. message_usage - Paywall Enforcer
CREATE TABLE message_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_message_usage_user_time ON message_usage(user_id, created_at);

-- 5. notifications_outbox - Autopilot Growth
CREATE TABLE notifications_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  target_phone TEXT,
  target_email TEXT,
  message_body TEXT NOT NULL,
  channel TEXT NOT NULL, -- 'sms', 'email'
  status TEXT DEFAULT 'queued', -- 'queued', 'sent', 'failed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ
);
CREATE INDEX idx_notifications_status ON notifications_outbox(status, created_at);

-- 6. user_memory - Travel Preferences + Proactive Concierge
CREATE TABLE user_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  preferences JSONB DEFAULT '{}', -- food_likes, sleep_preference, kids_with_them, etc
  travel_pattern JSONB DEFAULT '{}', -- home_base, usual_cities, hauling_style, typical_show_needs
  current_location JSONB, -- { city, state, lat, lng, detected_at }
  last_known_city TEXT,
  last_known_state TEXT,
  last_seen_at TIMESTAMPTZ,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_user_memory_user_id ON user_memory(user_id);

-- 7. service_requests - Dispatch Jobs to Providers
CREATE TABLE service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  service_type TEXT NOT NULL, -- 'farrier', 'vet', 'layover_barn', 'food', etc
  location_city TEXT,
  location_state TEXT,
  needed_by TIMESTAMPTZ,
  details TEXT,
  status TEXT DEFAULT 'open', -- 'open', 'claimed', 'completed', 'canceled'
  claimed_by UUID REFERENCES providers(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
CREATE INDEX idx_service_requests_status ON service_requests(status, created_at);

-- 8. provider_claims - Providers Claim Jobs
CREATE TABLE provider_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  service_request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  price_quoted DECIMAL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. haul_support_points - Road Infrastructure Intelligence
CREATE TABLE haul_support_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- "Love's Exit 178" / "Lazy E Arena Hookups"
  type TEXT NOT NULL, -- 'truck_stop', 'arena_hookup', 'overnight_barn', 'fairgrounds', 'restaurant_rig_space'
  lat DECIMAL,
  lng DECIMAL,
  interstate_exit TEXT,
  highway TEXT,
  city TEXT,
  state TEXT,
  rig_swing_ok BOOLEAN DEFAULT FALSE, -- can you pull through 40' LQ without backing?
  lit_at_night BOOLEAN DEFAULT TRUE,
  cameras_visible BOOLEAN DEFAULT FALSE,
  is_24hr BOOLEAN DEFAULT FALSE,
  overnight_ok BOOLEAN DEFAULT FALSE,
  water_spigot_available BOOLEAN DEFAULT FALSE,
  hose_fill_ok BOOLEAN DEFAULT FALSE,
  safe_to_walk_horse BOOLEAN DEFAULT FALSE,
  hookups_available BOOLEAN DEFAULT FALSE,
  hookup_amps TEXT, -- '30amp', '50amp'
  hookup_cost_per_night DECIMAL,
  stalls_available BOOLEAN DEFAULT FALSE,
  stall_count INT,
  stall_cost_per_night DECIMAL,
  text_to_book_number TEXT,
  diesel_price_last_seen DECIMAL,
  def_available BOOLEAN DEFAULT FALSE,
  last_verified_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_haul_points_location ON haul_support_points(state, city);
CREATE INDEX idx_haul_points_type ON haul_support_points(type);

-- 10. need_events - Demand Heatmap (What People Actually Need)
CREATE TABLE need_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  category TEXT NOT NULL, -- 'fuel', 'overnight_stalls', 'emergency_vet', 'food_with_rig_space', 'hookups'
  location_city TEXT,
  location_state TEXT,
  urgency TEXT, -- 'asap', 'today', 'this_weekend', 'planning_ahead'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_need_events_category ON need_events(category, created_at);
CREATE INDEX idx_need_events_location ON need_events(location_state, location_city);

-- 11. provider_feedback - Trust + Safety Intelligence (THE MOAT)
CREATE TABLE provider_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID, -- links to providers OR haul_support_points
  support_point_id UUID,
  user_id UUID REFERENCES users(id),
  category TEXT NOT NULL, -- 'overnight_stall', 'emergency_vet', 'fuel_stop', 'arena_hookup', 'hauler', 'farrier'
  safe_score INT CHECK (safe_score BETWEEN 0 AND 2), -- 0=never again, 1=wasn't great, 2=safe and decent
  care_score INT CHECK (care_score BETWEEN 0 AND 2),
  reliability_score INT CHECK (reliability_score BETWEEN 0 AND 2),
  would_use_again TEXT CHECK (would_use_again IN ('yes', 'only_if_forced', 'no')),
  notes_private TEXT, -- for internal QA only
  followup_flag BOOLEAN DEFAULT FALSE, -- escalate to admin?
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_feedback_provider ON provider_feedback(provider_id);
CREATE INDEX idx_feedback_support_point ON provider_feedback(support_point_id);

-- 12. aftercare_pings - Feedback Collection System
CREATE TABLE aftercare_pings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  provider_id UUID,
  support_point_id UUID,
  recommendation_type TEXT, -- 'overnight_barn', 'emergency_vet', 'fuel_stop', etc
  ping_message TEXT, -- "How'd that barn work out?"
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'answered'
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  answered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_aftercare_status ON aftercare_pings(status, scheduled_for);

-- 13. provider_insights - Aggregated Trust Summary
CREATE TABLE provider_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID,
  support_point_id UUID,
  summary_text TEXT, -- "18 haulers this month said safe solo at night"
  total_feedback_count INT DEFAULT 0,
  avg_safe_score DECIMAL,
  avg_care_score DECIMAL,
  avg_reliability_score DECIMAL,
  would_use_again_count INT DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 14. user_calendar_events - Smart Calendar + Proactive Reminders
CREATE TABLE user_calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'reminder', 'show_date', 'haul_date', 'vet_appointment', 'farrier_appointment', 'entry_deadline'
  event_title TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  location_city TEXT,
  location_state TEXT,
  horse_id UUID REFERENCES horses(id), -- which horse is involved?
  reminder_time TIMESTAMPTZ, -- when to auto-ping them
  reminded_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending', -- 'pending', 'reminded', 'completed', 'canceled'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_calendar_user_date ON user_calendar_events(user_id, event_date);
CREATE INDEX idx_calendar_reminders ON user_calendar_events(reminder_time, status);

-- 15. user_acceptance_log - Legal Shield (Liability Protection)
CREATE TABLE user_acceptance_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  terms_version TEXT NOT NULL, -- 'v1.0', 'v2.0', etc
  accepted_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  geo_guess TEXT -- city/state if detectable
);
CREATE INDEX idx_acceptance_user ON user_acceptance_log(user_id, accepted_at);

-- 16. provider_acceptance_log - Provider Terms Consent
CREATE TABLE provider_acceptance_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  terms_version TEXT NOT NULL,
  accepted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. user_profile_state - "Your File" (Retention Anchor)
CREATE TABLE user_profile_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  home_base_city TEXT,
  home_base_state TEXT,
  preferred_fuel_stop_summary TEXT,
  preferred_farrier_id UUID REFERENCES providers(id),
  preferred_vet_id UUID REFERENCES providers(id),
  active_deadlines_json JSONB DEFAULT '[]',
  saved_safe_stops_json JSONB DEFAULT '[]',
  notes_from_ai TEXT, -- "she hauls futurity colts, prefers quiet stalls over cost"
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 18. provider_feedback_flagged - Safety Moderation Queue
CREATE TABLE provider_feedback_flagged (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id UUID REFERENCES provider_feedback(id),
  provider_id UUID,
  reason TEXT, -- 'accused_of_abuse', 'safety_risk', 'price_scam', 'repeated_unsafe'
  needs_review BOOLEAN DEFAULT TRUE,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_flagged_needs_review ON provider_feedback_flagged(needs_review, created_at);

-- 19. booking_transactions - Payment Flow + Refund Tracking
CREATE TABLE booking_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  provider_id UUID REFERENCES providers(id),
  service_request_id UUID REFERENCES service_requests(id),
  amount_usd DECIMAL NOT NULL,
  status TEXT DEFAULT 'authorized', -- 'authorized', 'captured', 'refunded', 'dispute_flag'
  refund_reason_code TEXT, -- 'barn_no_show', 'user_no_show', 'other'
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  refunded_at TIMESTAMPTZ
);
CREATE INDEX idx_booking_user ON booking_transactions(user_id, created_at);
CREATE INDEX idx_booking_provider ON booking_transactions(provider_id, created_at);

-- 20. event_claims - Event Producer Viral Loop (THE MULTIPLIER)
CREATE TABLE event_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  role TEXT NOT NULL, -- 'producer', 'arena_owner', 'secretary', 'ground_crew', 'sponsor'
  status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  verification_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES users(id)
);
CREATE INDEX idx_event_claims_status ON event_claims(status, created_at);

-- 21. user_language_preferences - Multi-Language Support (WORLDWIDE SCALE)
CREATE TABLE user_language_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  preferred_language TEXT DEFAULT 'en', -- 'en', 'es', 'pt', 'fr', 'de', 'it', 'nl', etc
  auto_detect BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_user_language ON user_language_preferences(user_id);

-- 22. translated_content_cache - Translation Performance Layer
CREATE TABLE translated_content_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key TEXT NOT NULL, -- hash of original content
  source_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  original_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  translation_engine TEXT, -- 'gpt4', 'deepl', 'google'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX idx_translation_cache ON translated_content_cache(content_key, source_language, target_language);
CREATE INDEX idx_translation_expiry ON translated_content_cache(expires_at);

-- Add missing columns to existing events table for geo + concierge
ALTER TABLE events ADD COLUMN IF NOT EXISTS lat DECIMAL;
ALTER TABLE events ADD COLUMN IF NOT EXISTS lng DECIMAL;
ALTER TABLE events ADD COLUMN IF NOT EXISTS arena_name TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS overnight_allowed BOOLEAN DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS hookups_info TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS producer_contact_id UUID;

-- Add missing columns to existing providers table
ALTER TABLE providers ADD COLUMN IF NOT EXISTS relationship_type TEXT DEFAULT 'info_only'; -- 'info_only', 'affiliate_booking', 'emergency_reference'

-- Row Level Security (RLS) Policies
-- Enable RLS on all new tables
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE horse_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE haul_support_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE need_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE aftercare_pings ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_acceptance_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_acceptance_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profile_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_feedback_flagged ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_language_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE translated_content_cache ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (users can only see their own data, admins can see everything)
-- This is a simplified version - you may want to customize based on your specific needs

-- User alerts - users can only see their own alerts
CREATE POLICY "Users can view their own alerts" ON user_alerts
  FOR ALL USING (auth.uid() = user_id);

-- User memory - users can only see their own memory
CREATE POLICY "Users can view their own memory" ON user_memory
  FOR ALL USING (auth.uid() = user_id);

-- User calendar events - users can only see their own events
CREATE POLICY "Users can view their own calendar events" ON user_calendar_events
  FOR ALL USING (auth.uid() = user_id);

-- User profile state - users can only see their own profile
CREATE POLICY "Users can view their own profile state" ON user_profile_state
  FOR ALL USING (auth.uid() = user_id);

-- User language preferences - users can only see their own preferences
CREATE POLICY "Users can view their own language preferences" ON user_language_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Message usage - users can only see their own usage
CREATE POLICY "Users can view their own message usage" ON message_usage
  FOR ALL USING (auth.uid() = user_id);

-- Service requests - users can only see their own requests
CREATE POLICY "Users can view their own service requests" ON service_requests
  FOR ALL USING (auth.uid() = user_id);

-- Provider feedback - users can only see their own feedback
CREATE POLICY "Users can view their own provider feedback" ON provider_feedback
  FOR ALL USING (auth.uid() = user_id);

-- Aftercare pings - users can only see their own pings
CREATE POLICY "Users can view their own aftercare pings" ON aftercare_pings
  FOR ALL USING (auth.uid() = user_id);

-- Booking transactions - users can only see their own transactions
CREATE POLICY "Users can view their own booking transactions" ON booking_transactions
  FOR ALL USING (auth.uid() = user_id);

-- Horse claims - users can only see their own claims
CREATE POLICY "Users can view their own horse claims" ON horse_claims
  FOR ALL USING (auth.uid() = user_id);

-- Event claims - users can only see their own claims
CREATE POLICY "Users can view their own event claims" ON event_claims
  FOR ALL USING (auth.uid() = user_id);

-- Public tables (everyone can read)
CREATE POLICY "Anyone can view providers" ON providers
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view haul support points" ON haul_support_points
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view provider insights" ON provider_insights
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view translated content cache" ON translated_content_cache
  FOR SELECT USING (true);

-- Need events - public read, authenticated write
CREATE POLICY "Anyone can view need events" ON need_events
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create need events" ON need_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications outbox - only system can write, users can read their own
CREATE POLICY "Users can view their own notifications" ON notifications_outbox
  FOR SELECT USING (auth.uid() = user_id);

-- Provider claims - providers can see claims for their requests
CREATE POLICY "Providers can view their own claims" ON provider_claims
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM service_requests sr 
      WHERE sr.id = provider_claims.service_request_id 
      AND sr.claimed_by = auth.uid()
    )
  );

-- User acceptance log - users can only see their own
CREATE POLICY "Users can view their own acceptance log" ON user_acceptance_log
  FOR ALL USING (auth.uid() = user_id);

-- Provider acceptance log - providers can only see their own
CREATE POLICY "Providers can view their own acceptance log" ON provider_acceptance_log
  FOR ALL USING (auth.uid() = provider_id);

-- Provider feedback flagged - admin only (no policy = admin only)
-- This table should only be accessible to admin users

-- Comments for admin access
-- For admin access to all tables, you'll need to create admin policies
-- or use service role key for admin operations
-- Example admin policy:
-- CREATE POLICY "Admins can do everything" ON [table_name]
--   FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
