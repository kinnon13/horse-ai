-- Payouts Ledger Table
-- This tracks every dollar we pay out to providers, haulers, breeders, etc.
-- Critical for IRS compliance and CFO dashboard

CREATE TABLE IF NOT EXISTS payouts_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  provider_id UUID REFERENCES providers(id),
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  currency VARCHAR(3) DEFAULT 'USD',
  payout_type VARCHAR(50) NOT NULL CHECK (payout_type IN ('hauling', 'breeding', 'referral', 'bounty', 'commission')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  description TEXT NOT NULL,
  service_request_id UUID REFERENCES service_requests(id),
  stripe_transfer_id VARCHAR(255),
  tax_year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_payouts_user_id ON payouts_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_payouts_tax_year ON payouts_ledger(tax_year);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts_ledger(status);
CREATE INDEX IF NOT EXISTS idx_payouts_created_at ON payouts_ledger(created_at);

-- Compliance Flags Table
-- This tracks when users cross thresholds that require action (1099, high volume, etc.)

CREATE TABLE IF NOT EXISTS compliance_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  flag_type VARCHAR(50) NOT NULL CHECK (flag_type IN ('1099_threshold', 'high_volume', 'suspicious_activity', 'tax_compliance')),
  amount_cents INTEGER NOT NULL,
  tax_year INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'escalated')),
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  notes TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_compliance_user_id ON compliance_flags(user_id);
CREATE INDEX IF NOT EXISTS idx_compliance_flag_type ON compliance_flags(flag_type);
CREATE INDEX IF NOT EXISTS idx_compliance_status ON compliance_flags(status);
CREATE INDEX IF NOT EXISTS idx_compliance_tax_year ON compliance_flags(tax_year);

-- Provider Availability Table
-- This tracks when providers are available for work

CREATE TABLE IF NOT EXISTS provider_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  service_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'booked', 'blocked')),
  booking_id UUID,
  booked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_provider_availability_provider_id ON provider_availability(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_availability_start_time ON provider_availability(start_time);
CREATE INDEX IF NOT EXISTS idx_provider_availability_status ON provider_availability(status);

-- Booking Locks Table
-- This prevents double-booking by temporarily locking slots

CREATE TABLE IF NOT EXISTS booking_locks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID NOT NULL REFERENCES provider_availability(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  service_request_id UUID NOT NULL REFERENCES service_requests(id),
  locked_until TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_booking_locks_slot_id ON booking_locks(slot_id);
CREATE INDEX IF NOT EXISTS idx_booking_locks_user_id ON booking_locks(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_locks_locked_until ON booking_locks(locked_until);

-- RLS Policies
ALTER TABLE payouts_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_locks ENABLE ROW LEVEL SECURITY;

-- Users can only see their own payouts
CREATE POLICY "Users can view own payouts" ON payouts_ledger
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only see their own compliance flags
CREATE POLICY "Users can view own compliance flags" ON compliance_flags
  FOR SELECT USING (auth.uid() = user_id);

-- Providers can view their own availability
CREATE POLICY "Providers can view own availability" ON provider_availability
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM providers WHERE id = provider_id));

-- Users can view their own booking locks
CREATE POLICY "Users can view own booking locks" ON booking_locks
  FOR SELECT USING (auth.uid() = user_id);




