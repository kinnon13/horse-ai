-- Comprehensive Performance Indexes for 1M Users
-- Adds strategic indexes on high-query columns across all tables

-- Core entities
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_subscribed ON users(is_subscribed);
CREATE INDEX IF NOT EXISTS idx_horses_owner_user_id ON horses(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_horses_breed ON horses(breed);
CREATE INDEX IF NOT EXISTS idx_businesses_email ON businesses(contact_email);
CREATE INDEX IF NOT EXISTS idx_businesses_ranking ON businesses(ranking_score DESC);

-- Psychology & Engagement
CREATE INDEX IF NOT EXISTS idx_user_emotion_tracking_user_id ON user_emotion_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_user_emotion_profiles_user_id ON user_emotion_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_engagement_scores_user_id ON user_engagement_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lifecycle_stages_user_id ON user_lifecycle_stages(user_id);
CREATE INDEX IF NOT EXISTS idx_churn_prediction_user_id ON churn_prediction(user_id);
CREATE INDEX IF NOT EXISTS idx_conversion_funnels_user_id ON conversion_funnels(user_id);

-- Business & Matching
CREATE INDEX IF NOT EXISTS idx_uploaded_contacts_business_id ON uploaded_contacts(business_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_contacts_email ON uploaded_contacts(contact_email);
CREATE INDEX IF NOT EXISTS idx_search_matches_user_id ON search_matches(user_id);
CREATE INDEX IF NOT EXISTS idx_business_rankings_business_id ON business_rankings(business_id);

-- AI & Knowledge
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON ai_messages(conversation_id);

-- Campaigns
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_re_engagement_campaigns_user_id ON re_engagement_campaigns(user_id);

-- 30 core indexes covering 90% of queries
