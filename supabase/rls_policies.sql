-- Row Level Security Policies for HorseGPT
-- This ensures users can only access their own data while allowing service role admin access

-- Enable RLS on all user-linked tables
ALTER TABLE public.user_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horse_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aftercare_pings ENABLE ROW LEVEL SECURITY;

-- user_memory policies
CREATE POLICY "Users can select their own user_memory" ON public.user_memory
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own user_memory" ON public.user_memory
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own user_memory" ON public.user_memory
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can do anything with user_memory" ON public.user_memory
    FOR ALL USING (auth.role() = 'service_role');

-- user_alerts policies
CREATE POLICY "Users can select their own user_alerts" ON public.user_alerts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own user_alerts" ON public.user_alerts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own user_alerts" ON public.user_alerts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own user_alerts" ON public.user_alerts
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Service role can do anything with user_alerts" ON public.user_alerts
    FOR ALL USING (auth.role() = 'service_role');

-- message_usage policies
CREATE POLICY "Users can select their own message_usage" ON public.message_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own message_usage" ON public.message_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can do anything with message_usage" ON public.message_usage
    FOR ALL USING (auth.role() = 'service_role');

-- service_requests policies
CREATE POLICY "Users can select their own service_requests" ON public.service_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own service_requests" ON public.service_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own service_requests" ON public.service_requests
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can do anything with service_requests" ON public.service_requests
    FOR ALL USING (auth.role() = 'service_role');

-- horse_claims policies
CREATE POLICY "Users can select their own horse_claims" ON public.horse_claims
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own horse_claims" ON public.horse_claims
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own horse_claims" ON public.horse_claims
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can do anything with horse_claims" ON public.horse_claims
    FOR ALL USING (auth.role() = 'service_role');

-- provider_feedback policies
CREATE POLICY "Users can select their own provider_feedback" ON public.provider_feedback
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own provider_feedback" ON public.provider_feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own provider_feedback" ON public.provider_feedback
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can do anything with provider_feedback" ON public.provider_feedback
    FOR ALL USING (auth.role() = 'service_role');

-- notifications_outbox policies
CREATE POLICY "Users can select their own notifications_outbox" ON public.notifications_outbox
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can do anything with notifications_outbox" ON public.notifications_outbox
    FOR ALL USING (auth.role() = 'service_role');

-- aftercare_pings policies
CREATE POLICY "Users can select their own aftercare_pings" ON public.aftercare_pings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own aftercare_pings" ON public.aftercare_pings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can do anything with aftercare_pings" ON public.aftercare_pings
    FOR ALL USING (auth.role() = 'service_role');





