-- Add column to control profile visibility in service providers directory
ALTER TABLE public.profiles 
ADD COLUMN show_in_directory boolean DEFAULT false;

-- Add comment to explain the column
COMMENT ON COLUMN public.profiles.show_in_directory IS 'Whether the profile should appear in the public service providers directory';

-- Create index for better performance when querying directory listings
CREATE INDEX idx_profiles_show_in_directory ON public.profiles(show_in_directory) 
WHERE show_in_directory = true AND is_public = true;