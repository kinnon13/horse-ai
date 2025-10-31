-- Entity Intelligence Schema
-- 360° entity intelligence tables for complete entity profiling

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. user_dimensions - Complete user profiling
CREATE TABLE IF NOT EXISTS user_dimensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  psychology_profile JSONB DEFAULT '{}',
  financial_profile JSONB DEFAULT '{}',
  emotional_profile JSONB DEFAULT '{}',
  behavioral_profile JSONB DEFAULT '{}',
  location_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. horse_dimensions - Complete horse profiling
CREATE TABLE IF NOT EXISTS horse_dimensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID NOT NULL REFERENCES horses(id) ON DELETE CASCADE,
  genetics_data JSONB DEFAULT '{}',
  health_data JSONB DEFAULT '{}',
  psychology_profile JSONB DEFAULT '{}',
  performance_data JSONB DEFAULT '{}',
  financial_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(horse_id)
);

-- 3. business_dimensions - Complete business profiling
CREATE TABLE IF NOT EXISTS business_dimensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  financial_data JSONB DEFAULT '{}',
  operational_data JSONB DEFAULT '{}',
  market_data JSONB DEFAULT '{}',
  reputation_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id)
);

-- 4. entity_relationships - Relationship graph between entities
CREATE TABLE IF NOT EXISTS entity_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity1_type TEXT NOT NULL,
  entity1_id UUID NOT NULL,
  entity2_type TEXT NOT NULL,
  entity2_id UUID NOT NULL,
  relationship_type TEXT NOT NULL,
  degree INTEGER DEFAULT 1,
  strength DECIMAL(5,2) DEFAULT 1.0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(entity1_type, entity1_id, entity2_type, entity2_id, relationship_type)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_dimensions_user_id ON user_dimensions(user_id);
CREATE INDEX IF NOT EXISTS idx_horse_dimensions_horse_id ON horse_dimensions(horse_id);
CREATE INDEX IF NOT EXISTS idx_business_dimensions_business_id ON business_dimensions(business_id);
CREATE INDEX IF NOT EXISTS idx_entity_relationships_entity1 ON entity_relationships(entity1_type, entity1_id);
CREATE INDEX IF NOT EXISTS idx_entity_relationships_entity2 ON entity_relationships(entity2_type, entity2_id);
CREATE INDEX IF NOT EXISTS idx_entity_relationships_type ON entity_relationships(relationship_type);

