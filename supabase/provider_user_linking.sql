-- Add user_id to providers table to link providers to authenticated users
ALTER TABLE public.providers 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_providers_user_id ON public.providers(user_id);

-- Update existing providers to link to users (if any exist)
-- This would need to be done manually for existing data






