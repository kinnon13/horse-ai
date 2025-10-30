-- $$$ ledger of what we owe / paid
CREATE TABLE IF NOT EXISTS payouts_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount_cents BIGINT NOT NULL,
  reason TEXT NOT NULL, -- 'haul_bounty' | 'stud_referral' | 'provider_job'...
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  ai_generated BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_payouts_user ON payouts_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_payouts_time ON payouts_ledger(created_at);

-- compliance flags (IRS_THRESHOLD, ODD_ACTIVITY, RISKY_LANGUAGE, etc)
CREATE TABLE IF NOT EXISTS compliance_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  flag_type TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_flags_user ON compliance_flags(user_id);

-- provider_availability used by dispatch + booking lock
CREATE TABLE IF NOT EXISTS provider_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'open', -- open | held | booked
  job_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_provider_window
ON provider_availability(provider_id, start_time, status);