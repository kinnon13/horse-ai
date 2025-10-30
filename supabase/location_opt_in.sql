-- Add location opt-in tracking to user_memory table
ALTER TABLE public.user_memory 
ADD COLUMN IF NOT EXISTS location_opt_in boolean DEFAULT false;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_memory_location_opt_in ON public.user_memory(location_opt_in);





