-- HorseGPT Production Migration Script
-- Run this in your Supabase SQL editor to set up all tables and policies

-- 1. Add admin flag to users table
\i admin_flag.sql

-- 2. Add referral system tables
\i referral_system.sql

-- 3. Add haul support tables
\i haul_support_schema.sql

-- 4. Extend notifications_outbox for provider outreach
\i notifications_outbox_extend.sql

-- 5. Add RLS policies for all user-linked tables
\i rls_policies.sql

-- 6. Add referral fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS referral_code_used text,
ADD COLUMN IF NOT EXISTS referral_reward_applied boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS referral_reward_applied_at timestamptz;

-- 7. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON public.referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_owner ON public.referral_codes(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_claims_code ON public.referral_claims(referral_code_id);
CREATE INDEX IF NOT EXISTS idx_referral_claims_user ON public.referral_claims(new_user_id);
CREATE INDEX IF NOT EXISTS idx_haul_support_location ON public.haul_support_points USING GIST (ll_to_earth(lat, lng));
CREATE INDEX IF NOT EXISTS idx_haul_support_type ON public.haul_support_points(service_type);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled ON public.notifications_outbox(scheduled_for) WHERE status = 'pending';

-- 8. Insert sample referral code for testing
INSERT INTO public.referral_codes (
  code, 
  owner_user_id, 
  reward_type, 
  reward_value, 
  expires_at, 
  max_uses, 
  current_uses, 
  is_active
) VALUES (
  'NFR2024',
  (SELECT id FROM public.users WHERE is_admin = true LIMIT 1),
  'free_month',
  1,
  '2024-12-31 23:59:59'::timestamptz,
  1000,
  0,
  true
) ON CONFLICT (code) DO NOTHING;

-- 9. Insert sample haul support points for testing
INSERT INTO public.haul_support_points (
  name,
  service_type,
  city,
  state,
  lat,
  lng,
  rig_ok_length_ft,
  overnight_ok,
  has_cameras,
  lit_at_night,
  has_hookups,
  stall_available,
  emergency_ok,
  notes,
  safety_score,
  would_use_again,
  is_approved
) VALUES 
(
  'Love''s Travel Stop - Exit 178',
  'fuel',
  'Amarillo',
  'TX',
  35.2220,
  -101.8313,
  45,
  true,
  true,
  true,
  true,
  false,
  true,
  'Diesel + DEF available. Pull-through for big rigs. Safe overnight.',
  4.2,
  0.85,
  true
),
(
  'Brazos County Expo Center',
  'overnight_stalls',
  'Bryan',
  'TX',
  30.6744,
  -96.3700,
  40,
  true,
  true,
  true,
  true,
  true,
  true,
  'Call ahead for stalls. Gate code 1937 after 10pm. East side parking.',
  4.5,
  0.92,
  true
),
(
  'Oklahoma State Fairgrounds',
  'arena_hookup',
  'Oklahoma City',
  'OK',
  35.4676,
  -97.5164,
  50,
  true,
  true,
  true,
  true,
  true,
  true,
  'Full hookups available. Emergency vet on call. Safe for women.',
  4.8,
  0.95,
  true
) ON CONFLICT DO NOTHING;

-- 10. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Migration complete!
SELECT 'HorseGPT Production Migration Complete!' as status;





