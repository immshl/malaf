-- Add available_days and time_slot columns to profiles table for meeting scheduling
ALTER TABLE public.profiles 
ADD COLUMN available_days TEXT[] DEFAULT NULL,
ADD COLUMN time_slot TEXT DEFAULT NULL;