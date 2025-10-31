-- Agent 5: Pillars 10-11 Migration
-- Pillar 10: Viral & Marketing (10 tables) - Tables 115-124
-- Pillar 11: Scaling & Reliability (3 tables) - Tables 125-127

-- PILLAR 10: VIRAL & MARKETING

-- Table 115: Referral Tracking
CREATE TABLE IF NOT EXISTS referral_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referral_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  reward_earned DECIMAL(10,2) DEFAULT 0,
  reward_paid BOOLEAN DEFAULT FALSE,
  converted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referral_tracking_referrer_id ON referral_tracking(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_tracking_referred_id ON referral_tracking(referred_id);
CREATE INDEX IF NOT EXISTS idx_referral_referrer ON referral_tracking(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_code ON referral_tracking(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_status ON referral_tracking(status);

-- Table 116: Social Sharing Events
CREATE TABLE IF NOT EXISTS social_sharing_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'twitter', 'instagram', 'linkedin', 'email', 'sms', 'copy_link')),
  content_type TEXT NOT NULL CHECK (content_type IN ('conversation', 'horse_profile', 'ai_insight', 'competition_result')),
  content_id UUID,
  shared_message TEXT,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_sharing_events_user_id ON social_sharing_events(user_id);
CREATE INDEX IF NOT EXISTS idx_sharing_user ON social_sharing_events(user_id);
CREATE INDEX IF NOT EXISTS idx_sharing_platform ON social_sharing_events(platform);
CREATE INDEX IF NOT EXISTS idx_sharing_content ON social_sharing_events(content_type, content_id);

-- Table 117: Viral Loop Participants
CREATE TABLE IF NOT EXISTS viral_loop_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  loop_type TEXT NOT NULL CHECK (loop_type IN ('horse_claim', 'referral', 'share_challenge', 'content_viral')),
  entry_point TEXT,
  completion_status TEXT DEFAULT 'in_progress' CHECK (completion_status IN ('in_progress', 'completed', 'abandoned')),
  shares_generated INTEGER DEFAULT 0,
  conversions_generated INTEGER DEFAULT 0,
  viral_score DECIMAL(5,2) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  entered_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_viral_loop_participants_user_id ON viral_loop_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_viral_user ON viral_loop_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_viral_type ON viral_loop_participants(loop_type);
CREATE INDEX IF NOT EXISTS idx_viral_status ON viral_loop_participants(completion_status);
CREATE INDEX IF NOT EXISTS idx_viral_score ON viral_loop_participants(viral_score DESC);

-- Table 118: Sharing Hooks Tracking
CREATE TABLE IF NOT EXISTS sharing_hooks_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  hook_type TEXT NOT NULL CHECK (hook_type IN ('achievement_unlocked', 'insight_generated', 'horse_matched', 'competition_result', 'personalized_tip')),
  hook_content JSONB NOT NULL,
  shown_at TIMESTAMPTZ DEFAULT NOW(),
  clicked BOOLEAN DEFAULT FALSE,
  shared BOOLEAN DEFAULT FALSE,
  conversion_result TEXT,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sharing_hooks_tracking_user_id ON sharing_hooks_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_hooks_user ON sharing_hooks_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_hooks_type ON sharing_hooks_tracking(hook_type);
CREATE INDEX IF NOT EXISTS idx_hooks_clicked ON sharing_hooks_tracking(clicked);
CREATE INDEX IF NOT EXISTS idx_hooks_shared ON sharing_hooks_tracking(shared);

-- Table 119: Referral Rewards
CREATE TABLE IF NOT EXISTS referral_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id UUID REFERENCES referral_tracking(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('credit', 'subscription_discount', 'feature_unlock', 'cash')),
  reward_value DECIMAL(10,2) NOT NULL,
  reward_status TEXT DEFAULT 'pending' CHECK (reward_status IN ('pending', 'issued', 'redeemed', 'expired')),
  issued_at TIMESTAMPTZ,
  redeemed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referral_rewards_referral_id ON referral_rewards(referral_id);
CREATE INDEX IF NOT EXISTS idx_rewards_referral ON referral_rewards(referral_id);
CREATE INDEX IF NOT EXISTS idx_rewards_status ON referral_rewards(reward_status);

-- Table 120: Content Sharing Analytics
CREATE TABLE IF NOT EXISTS content_sharing_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL,
  sharer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  share_method TEXT NOT NULL,
  recipient_count INTEGER DEFAULT 1,
  views_from_share INTEGER DEFAULT 0,
  signups_from_share INTEGER DEFAULT 0,
  revenue_from_share DECIMAL(10,2) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  shared_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_sharing_analytics_sharer_id ON content_sharing_analytics(sharer_id);
CREATE INDEX IF NOT EXISTS idx_analytics_content ON content_sharing_analytics(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sharer ON content_sharing_analytics(sharer_id);

-- Table 121: Social Media Integration
CREATE TABLE IF NOT EXISTS social_media_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'twitter', 'instagram', 'linkedin', 'tiktok')),
  platform_user_id TEXT NOT NULL,
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMPTZ,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_media_integrations_user_id ON social_media_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_social_user ON social_media_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_social_platform ON social_media_integrations(platform, platform_user_id);
CREATE INDEX IF NOT EXISTS idx_social_active ON social_media_integrations(is_active);

-- Table 122: Viral Growth Metrics
CREATE TABLE IF NOT EXISTS viral_growth_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL,
  total_referrals INTEGER DEFAULT 0,
  active_referrers INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  viral_coefficient DECIMAL(5,3) DEFAULT 0,
  conversion_rate DECIMAL(5,3) DEFAULT 0,
  revenue_from_viral DECIMAL(12,2) DEFAULT 0,
  top_content_id UUID,
  top_content_type TEXT,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(metric_date)
);

CREATE INDEX IF NOT EXISTS idx_viral_metrics_date ON viral_growth_metrics(metric_date DESC);

-- Table 123: Sharing Campaigns
CREATE TABLE IF NOT EXISTS sharing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  campaign_type TEXT NOT NULL CHECK (campaign_type IN ('referral_bonus', 'content_challenge', 'social_contest', 'viral_incentive')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  target_metric TEXT NOT NULL,
  target_value INTEGER,
  current_value INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
  reward_structure JSONB,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON sharing_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_dates ON sharing_campaigns(start_date, end_date);

-- Table 124: Referral Program Config
CREATE TABLE IF NOT EXISTS referral_program_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_level TEXT NOT NULL CHECK (tier_level IN ('basic', 'premium', 'plus')),
  referrer_reward DECIMAL(10,2) NOT NULL,
  referee_reward DECIMAL(10,2) NOT NULL,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('credit', 'subscription_discount', 'feature_unlock')),
  minimum_referrals INTEGER DEFAULT 1,
  maximum_referrals INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referral_config_tier ON referral_program_config(tier_level, is_active);
CREATE INDEX IF NOT EXISTS idx_referral_config_active ON referral_program_config(is_active);

-- PILLAR 11: SCALING & RELIABILITY

-- Table 125: Load Balancing Config
CREATE TABLE IF NOT EXISTS load_balancing_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL UNIQUE,
  config_data JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_load_balancing_config_active ON load_balancing_config(active);
CREATE INDEX IF NOT EXISTS idx_load_balancing_config_service ON load_balancing_config(service_name);

-- Table 126: Cache Configuration
CREATE TABLE IF NOT EXISTS cache_configuration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key_pattern TEXT NOT NULL,
  ttl_seconds INTEGER,
  cache_strategy TEXT,
  invalidation_rules JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cache_configuration_pattern ON cache_configuration(cache_key_pattern);

-- Table 127: Rate Limiting Rules
CREATE TABLE IF NOT EXISTS rate_limiting_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  max_requests INTEGER,
  window_seconds INTEGER,
  metadata JSONB DEFAULT '{}',
  extended_data JSONB DEFAULT '{}',
  schema_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limiting_rules_user_id ON rate_limiting_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_rate_limiting_rules_endpoint ON rate_limiting_rules(endpoint);
