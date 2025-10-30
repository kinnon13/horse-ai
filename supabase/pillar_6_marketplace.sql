-- PILLAR 6: MARKETPLACE & COMMERCE
-- Horse sales, marketplace listings, transactions

-- Horse listings
CREATE TABLE IF NOT EXISTS horse_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id),
  seller_id UUID REFERENCES users(id),
  listing_type VARCHAR(50), -- sale, lease, stud service
  price_cents INTEGER,
  currency VARCHAR(3) DEFAULT 'USD',
  description TEXT,
  location_city VARCHAR(100),
  location_state VARCHAR(50),
  listing_date TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'active', -- active, sold, expired, withdrawn
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT false,
  adjacency_impact INTEGER DEFAULT 0
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES users(id),
  seller_id UUID REFERENCES users(id),
  horse_id UUID REFERENCES horses(id),
  transaction_type VARCHAR(50), -- sale, lease, stud service
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  transaction_date TIMESTAMPTZ DEFAULT NOW(),
  payment_method VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, cancelled, refunded
  commission_cents INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT false,
  adjacency_impact INTEGER DEFAULT 0
);

-- Marketplace categories
CREATE TABLE IF NOT EXISTS marketplace_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name VARCHAR(100) NOT NULL,
  parent_category_id UUID REFERENCES marketplace_categories(id),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT false
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_horse_listings_horse ON horse_listings(horse_id);
CREATE INDEX IF NOT EXISTS idx_horse_listings_seller ON horse_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_horse_listings_status ON horse_listings(status);
CREATE INDEX IF NOT EXISTS idx_horse_listings_location ON horse_listings(location_city, location_state);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_horse ON transactions(horse_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);

-- Triggers
CREATE TRIGGER update_horse_listings_timestamp BEFORE UPDATE ON horse_listings FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_transactions_timestamp BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_marketplace_categories_timestamp BEFORE UPDATE ON marketplace_categories FOR EACH ROW EXECUTE FUNCTION update_timestamp();



