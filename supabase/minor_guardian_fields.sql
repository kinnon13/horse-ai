-- Add minor/guardian safety fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_minor boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS guardian_name text,
ADD COLUMN IF NOT EXISTS guardian_phone text;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_users_is_minor ON public.users(is_minor);



