-- Add admin flag to users table
-- This allows us to identify admin users who can access the admin dashboard

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create an index for faster admin lookups
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON public.users(is_admin);

-- Optional: Add a comment to document the column
COMMENT ON COLUMN public.users.is_admin IS 'Flag to identify admin users who can access admin dashboard';



