-- Add comprehensive billing tracking for all payment sources
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS billing_source text DEFAULT 'stripe' CHECK (billing_source IN ('apple', 'google_play', 'stripe')),
ADD COLUMN IF NOT EXISTS ios_receipt text,
ADD COLUMN IF NOT EXISTS ios_expires_at timestamptz,
ADD COLUMN IF NOT EXISTS google_play_token text,
ADD COLUMN IF NOT EXISTS google_play_expires_at timestamptz,
ADD COLUMN IF NOT EXISTS stripe_customer_id text,
ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
ADD COLUMN IF NOT EXISTS billing_expires_at timestamptz;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_billing_source ON public.users(billing_source);
CREATE INDEX IF NOT EXISTS idx_users_ios_expires_at ON public.users(ios_expires_at);
CREATE INDEX IF NOT EXISTS idx_users_google_play_expires_at ON public.users(google_play_expires_at);
CREATE INDEX IF NOT EXISTS idx_users_billing_expires_at ON public.users(billing_expires_at);

