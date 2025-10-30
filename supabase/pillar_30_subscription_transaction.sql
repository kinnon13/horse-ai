-- Pillar 30: Subscription & Transaction Management – Assumes prior pillars (e.g., users, deal_transactions).
-- Precision: DECIMALS/fees, ENUMs for tiers. Scalability: Partitioning on dates. AI: Vectors for upsells. Adjacents: Impacts for ag/tourism.

CREATE TABLE IF NOT EXISTS subscription_tiers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tier_type TEXT NOT NULL CHECK (tier_type IN ('free', 'basic', 'pro', 'business')),
    monthly_price DECIMAL(5,2) NOT NULL,
    question_limit INTEGER,
    features JSONB NOT NULL
);
CREATE TRIGGER trig_subscription_tiers_updated_at BEFORE UPDATE ON subscription_tiers FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_subscription_tiers_tier_type ON subscription_tiers(tier_type);

CREATE TABLE IF NOT EXISTS user_subscriptions (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    tier_id INTEGER REFERENCES subscription_tiers(id) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    auto_bump_date DATE,
    opt_in_auto_bump BOOLEAN DEFAULT FALSE,
    payment_method TEXT CHECK (payment_method IN ('iap_apple', 'iap_google', 'stripe', 'other'))
);
CREATE TRIGGER trig_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);

CREATE TABLE IF NOT EXISTS question_usage_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    query_text TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    cost DECIMAL(5,4) DEFAULT 0.03,
    upsell_triggered BOOLEAN DEFAULT FALSE
) PARTITION BY RANGE (timestamp);
CREATE TRIGGER trig_question_usage_logs_updated_at BEFORE UPDATE ON question_usage_logs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_question_usage_logs_user_id ON question_usage_logs(user_id);
CREATE INDEX idx_question_usage_logs_timestamp ON question_usage_logs(timestamp);

CREATE TABLE IF NOT EXISTS upsell_predictions (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    prediction_score DECIMAL(5,4) CHECK (prediction_score BETWEEN 0 AND 1),
    upsell_embedding VECTOR(384),
    recommended_tier TEXT CHECK (recommended_tier IN ('basic', 'pro'))
);
CREATE TRIGGER trig_upsell_predictions_updated_at BEFORE UPDATE ON upsell_predictions FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_upsell_predictions_user_id ON upsell_predictions(user_id);
CREATE INDEX idx_upsell_predictions_embedding ON upsell_predictions USING hnsw (upsell_embedding vector_cosine_ops);

CREATE TABLE IF NOT EXISTS transaction_commissions (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deal_id INTEGER REFERENCES deal_transactions(id) ON DELETE CASCADE NOT NULL,
    order_amount DECIMAL(12,2) NOT NULL,
    commission DECIMAL(12,2) NOT NULL CHECK (commission <= 100),
    buyer_pays_fees BOOLEAN DEFAULT TRUE,
    shipping DECIMAL(10,2),
    adjacency_type TEXT CHECK (adjacency_type IN ('agribusiness', 'tourism', 'other'))
);
CREATE TRIGGER trig_transaction_commissions_updated_at BEFORE UPDATE ON transaction_commissions FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_transaction_commissions_deal_id ON transaction_commissions(deal_id);

CREATE TABLE IF NOT EXISTS payment_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'completed', 'failed')),
    gateway TEXT NOT NULL,
    transaction_fee DECIMAL(5,2)
);
CREATE TRIGGER trig_payment_logs_updated_at BEFORE UPDATE ON payment_logs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_payment_logs_user_id ON payment_logs(user_id);

CREATE TABLE IF NOT EXISTS auto_bump_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    bump_date DATE NOT NULL,
    previous_tier TEXT,
    new_tier TEXT,
    consent_given BOOLEAN NOT NULL
);
CREATE TRIGGER trig_auto_bump_logs_updated_at BEFORE UPDATE ON auto_bump_logs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_auto_bump_logs_user_id ON auto_bump_logs(user_id);

CREATE TABLE IF NOT EXISTS report_generation_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    report_type TEXT NOT NULL CHECK (report_type IN ('performance', 'dam_produce', 'sire', 'maternal_grandsire', 'nicking', 'other')),
    generated_data JSONB NOT NULL,
    cost DECIMAL(5,2) DEFAULT 0.00
);
CREATE TRIGGER trig_report_generation_logs_updated_at BEFORE UPDATE ON report_generation_logs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_report_generation_logs_user_id ON report_generation_logs(user_id);

CREATE TABLE IF NOT EXISTS upsell_notifications (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    sent_via TEXT CHECK (sent_via IN ('twilio', 'mailgun', 'in_app')),
    response TEXT
);
CREATE TRIGGER trig_upsell_notifications_updated_at BEFORE UPDATE ON upsell_notifications FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_upsell_notifications_user_id ON upsell_notifications(user_id);

CREATE TABLE IF NOT EXISTS revenue_reinvestment_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    category TEXT CHECK (category IN ('marketing', 'compute', 'acquisitions', 'other')),
    date DATE NOT NULL
);
CREATE TRIGGER trig_revenue_reinvestment_logs_updated_at BEFORE UPDATE ON revenue_reinvestment_logs FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE INDEX idx_revenue_reinvestment_logs_date ON revenue_reinvestment_logs(date);
