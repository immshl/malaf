-- Add featured_links column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN featured_links JSONB DEFAULT '[]'::jsonb;