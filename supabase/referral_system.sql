-- Referral System Tables
-- This enables "text this code right now" for NFR blast

CREATE TABLE IF NOT EXISTS public.referral_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    owner_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    reward_type TEXT NOT NULL DEFAULT 'free_month', -- 'free_month', 'extended_trial', 'discount'
    reward_value NUMERIC DEFAULT 1, -- 1 = 1 month, 0.5 = 2 weeks, etc.
    expires_at TIMESTAMPTZ,
    max_uses INTEGER DEFAULT 1,
    current_uses INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.referral_claims (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referral_code_id UUID REFERENCES public.referral_codes(id) ON DELETE CASCADE,
    new_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    claimed_at TIMESTAMPTZ DEFAULT NOW(),
    reward_applied BOOLEAN DEFAULT false,
    reward_applied_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON public.referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_owner ON public.referral_codes(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_active ON public.referral_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_referral_claims_code ON public.referral_claims(referral_code_id);
CREATE INDEX IF NOT EXISTS idx_referral_claims_user ON public.referral_claims(new_user_id);

-- RLS Policies
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_claims ENABLE ROW LEVEL SECURITY;

-- Users can read their own referral codes
CREATE POLICY referral_codes_user_read ON public.referral_codes
    FOR SELECT USING (owner_user_id = auth.uid());

-- Users can create their own referral codes
CREATE POLICY referral_codes_user_insert ON public.referral_codes
    FOR INSERT WITH CHECK (owner_user_id = auth.uid());

-- Users can read their own referral claims
CREATE POLICY referral_claims_user_read ON public.referral_claims
    FOR SELECT USING (new_user_id = auth.uid());

-- Service role can do anything
CREATE POLICY referral_codes_service_role ON public.referral_codes
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY referral_claims_service_role ON public.referral_claims
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Add referral tracking to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS referral_code_used TEXT,
ADD COLUMN IF NOT EXISTS referral_reward_applied BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS referral_reward_applied_at TIMESTAMPTZ;






