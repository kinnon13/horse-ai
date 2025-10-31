-- Performance Indexes Migration
-- Adds indexes for common query patterns to improve database performance
-- Run this in Supabase SQL editor

-- Indexes for users table
-- Optimize queries by email (login, lookups)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Optimize queries by tier (filtering users by subscription level)
CREATE INDEX IF NOT EXISTS idx_users_tier ON users(tier);

-- Composite index for common user filtering patterns
CREATE INDEX IF NOT EXISTS idx_users_tier_email ON users(tier, email);

-- Indexes for horses_master table
-- Optimize searches by horse name (fuzzy search, exact match)
CREATE INDEX IF NOT EXISTS idx_horses_master_name ON horses_master(reg_name);

-- Optimize breed-based queries (filtering by breed)
CREATE INDEX IF NOT EXISTS idx_horses_master_breed ON horses_master(breed);

-- Composite index for name and breed searches (common search pattern)
CREATE INDEX IF NOT EXISTS idx_horses_master_name_breed ON horses_master(reg_name, breed);

-- Indexes for results_master table
-- Optimize queries by horse (lookup performance history)
CREATE INDEX IF NOT EXISTS idx_results_master_horse_name ON results_master(horse_reg_name);

-- Optimize date-based queries (filtering by event date)
CREATE INDEX IF NOT EXISTS idx_results_master_date ON results_master(event_date);

-- Composite index for horse performance lookups by date range
CREATE INDEX IF NOT EXISTS idx_results_master_horse_date ON results_master(horse_reg_name, event_date);

-- Indexes for providers table
-- Optimize service type filtering (finding providers by service)
CREATE INDEX IF NOT EXISTS idx_providers_service_type ON providers(service_type);

-- Optimize location-based queries (finding providers by city)
CREATE INDEX IF NOT EXISTS idx_providers_city ON providers(city);

-- Optimize state-based queries (finding providers by state)
CREATE INDEX IF NOT EXISTS idx_providers_state ON providers(state);

-- Composite indexes for common provider search patterns
CREATE INDEX IF NOT EXISTS idx_providers_service_location ON providers(service_type, city, state);
CREATE INDEX IF NOT EXISTS idx_providers_state_city ON providers(state, city);

-- Additional performance indexes for frequently joined tables
-- If horse_user_links or similar table exists for owner relationships
-- CREATE INDEX IF NOT EXISTS idx_horse_user_links_user_id ON horse_user_links(user_id);
-- CREATE INDEX IF NOT EXISTS idx_horse_user_links_horse_id ON horse_user_links(horse_id);

-- Analyze tables to update statistics for query planner
ANALYZE users;
ANALYZE horses_master;
ANALYZE results_master;
ANALYZE providers;
