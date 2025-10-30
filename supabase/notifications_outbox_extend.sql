-- Extend notifications_outbox table to support provider outreach
-- This enables the provider dispatch system to queue notifications to providers
-- who aren't necessarily users in our system yet.

-- Add provider_id column to link notifications to providers
ALTER TABLE public.notifications_outbox 
ADD COLUMN IF NOT EXISTS provider_id uuid REFERENCES public.providers(id) ON DELETE SET NULL;

-- Add provider contact info for direct outreach
ALTER TABLE public.notifications_outbox 
ADD COLUMN IF NOT EXISTS provider_contact_email text;

ALTER TABLE public.notifications_outbox 
ADD COLUMN IF NOT EXISTS provider_contact_phone text;

-- Add meta column for additional context (service_request_id, dispatch_type, etc.)
ALTER TABLE public.notifications_outbox 
ADD COLUMN IF NOT EXISTS meta jsonb;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_outbox_provider_id ON public.notifications_outbox(provider_id);
CREATE INDEX IF NOT EXISTS idx_notifications_outbox_meta ON public.notifications_outbox USING GIN(meta);

-- Add comments to document the new columns
COMMENT ON COLUMN public.notifications_outbox.provider_id IS 'Link to providers table for provider outreach notifications';
COMMENT ON COLUMN public.notifications_outbox.provider_contact_email IS 'Provider email for direct outreach (when provider is not a user)';
COMMENT ON COLUMN public.notifications_outbox.provider_contact_phone IS 'Provider phone for direct outreach (when provider is not a user)';
COMMENT ON COLUMN public.notifications_outbox.meta IS 'Additional metadata for notifications (service_request_id, dispatch_type, etc.)';

-- Update RLS policies to allow service role to manage provider notifications
-- (The existing policies should already cover this, but let's be explicit)

-- Policy for service role to do anything on notifications_outbox (including provider notifications)
-- This should already exist from Task 1, but let's ensure it's there
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'notifications_outbox' 
        AND policyname = 'service_role_notifications_outbox_access'
    ) THEN
        CREATE POLICY service_role_notifications_outbox_access ON public.notifications_outbox
        FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
END $$;





