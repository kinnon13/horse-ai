-- Haul Support Points Table
-- This is the "Where can I pull in a 40' LQ safely right now?" network
-- This is the final piece that makes HorseGPT the safety layer for horse logistics

CREATE TABLE IF NOT EXISTS public.haul_support_points (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,                    -- "Love's Exit 178", "Brazos County Expo RV Hookups"
    type TEXT NOT NULL,                    -- 'fuel', 'overnight_stalls', 'arena_hookup', 'layover_barn', 'emergency_vet', 'safe_pull_through', 'feed_store', 'water_spigot'
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    lat NUMERIC NOT NULL,
    lng NUMERIC NOT NULL,
    
    -- Rig specifications
    rig_ok_length_ft INTEGER,              -- "you can swing a 40' trailer here without backing"
    overnight_ok BOOLEAN DEFAULT false,    -- "you can sit overnight without cops knocking"
    has_cameras BOOLEAN DEFAULT false,
    lit_at_night BOOLEAN DEFAULT false,
    has_hookups BOOLEAN DEFAULT false,     -- power/water
    stall_available BOOLEAN DEFAULT false, -- physical stalls on site
    emergency_ok BOOLEAN DEFAULT false,     -- "you can unload a sick horse here in a panic"
    
    -- Safety and verification
    safety_score NUMERIC DEFAULT 0,        -- aggregate safety rating (0-5)
    would_use_again_percentage NUMERIC DEFAULT 0, -- % of riders who said yes
    last_verified_at TIMESTAMPTZ,          -- last time we heard from a real hauler
    verified_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    -- Additional info
    notes TEXT,                            -- "park on east side, call ahead, gate code is 1937 after 10pm"
    contact_phone TEXT,
    contact_email TEXT,
    website TEXT,
    
    -- Status and admin
    is_approved BOOLEAN DEFAULT false,     -- admin approved for public recommendations
    admin_notes TEXT,                      -- admin-only notes
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Haul Support Feedback Table
-- This tracks user experiences at haul support points
-- Similar to provider_feedback but for locations

CREATE TABLE IF NOT EXISTS public.haul_support_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    haul_support_point_id UUID REFERENCES public.haul_support_points(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Safety ratings
    safe_score INTEGER NOT NULL CHECK (safe_score >= 1 AND safe_score <= 5),
    would_use_again BOOLEAN NOT NULL,
    
    -- Additional feedback
    notes TEXT,
    
    -- Context
    visit_date DATE,
    rig_length_ft INTEGER,
    time_of_day TEXT,                      -- 'morning', 'afternoon', 'evening', 'night'
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_haul_support_points_location ON public.haul_support_points(city, state);
CREATE INDEX IF NOT EXISTS idx_haul_support_points_coords ON public.haul_support_points(lat, lng);
CREATE INDEX IF NOT EXISTS idx_haul_support_points_type ON public.haul_support_points(type);
CREATE INDEX IF NOT EXISTS idx_haul_support_points_safety ON public.haul_support_points(safety_score DESC);
CREATE INDEX IF NOT EXISTS idx_haul_support_points_approved ON public.haul_support_points(is_approved);
CREATE INDEX IF NOT EXISTS idx_haul_support_feedback_point ON public.haul_support_feedback(haul_support_point_id);
CREATE INDEX IF NOT EXISTS idx_haul_support_feedback_user ON public.haul_support_feedback(user_id);

-- Add comments for documentation
COMMENT ON TABLE public.haul_support_points IS 'Safe locations for horse haulers - fuel stops, overnight stalls, emergency vets, etc.';
COMMENT ON TABLE public.haul_support_feedback IS 'User feedback on haul support point safety and experience';

COMMENT ON COLUMN public.haul_support_points.rig_ok_length_ft IS 'Maximum trailer length that can safely maneuver here';
COMMENT ON COLUMN public.haul_support_points.overnight_ok IS 'Can haulers stay overnight without issues';
COMMENT ON COLUMN public.haul_support_points.has_cameras IS 'Security cameras present';
COMMENT ON COLUMN public.haul_support_points.lit_at_night IS 'Well-lit at night for safety';
COMMENT ON COLUMN public.haul_support_points.has_hookups IS 'Power and water hookups available';
COMMENT ON COLUMN public.haul_support_points.stall_available IS 'Physical horse stalls on site';
COMMENT ON COLUMN public.haul_support_points.emergency_ok IS 'Can unload sick/injured horses in emergency';
COMMENT ON COLUMN public.haul_support_points.safety_score IS 'Aggregate safety rating from user feedback (0-5)';
COMMENT ON COLUMN public.haul_support_points.would_use_again_percentage IS 'Percentage of users who would use this location again';
COMMENT ON COLUMN public.haul_support_points.last_verified_at IS 'Last time a real hauler confirmed this location is still good';
COMMENT ON COLUMN public.haul_support_points.is_approved IS 'Admin approved for public recommendations';

-- Enable RLS
ALTER TABLE public.haul_support_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.haul_support_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for haul_support_points
-- Public read access for approved points
CREATE POLICY haul_support_points_public_read ON public.haul_support_points
    FOR SELECT USING (is_approved = true);

-- Users can read their own submissions
CREATE POLICY haul_support_points_user_read ON public.haul_support_points
    FOR SELECT USING (verified_by_user_id = auth.uid());

-- Users can insert their own submissions
CREATE POLICY haul_support_points_user_insert ON public.haul_support_points
    FOR INSERT WITH CHECK (verified_by_user_id = auth.uid());

-- Users can update their own submissions
CREATE POLICY haul_support_points_user_update ON public.haul_support_points
    FOR UPDATE USING (verified_by_user_id = auth.uid());

-- Service role can do anything
CREATE POLICY haul_support_points_service_role ON public.haul_support_points
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- RLS Policies for haul_support_feedback
-- Users can read their own feedback
CREATE POLICY haul_support_feedback_user_read ON public.haul_support_feedback
    FOR SELECT USING (user_id = auth.uid());

-- Users can insert their own feedback
CREATE POLICY haul_support_feedback_user_insert ON public.haul_support_feedback
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own feedback
CREATE POLICY haul_support_feedback_user_update ON public.haul_support_feedback
    FOR UPDATE USING (user_id = auth.uid());

-- Service role can do anything
CREATE POLICY haul_support_feedback_service_role ON public.haul_support_feedback
    FOR ALL TO service_role USING (true) WITH CHECK (true);



