-- Enable email confirmation in Supabase for the new email link verification system
-- This ensures users receive email verification links automatically

-- Re-enable auth.users email confirmation (this should be done via dashboard but documented here)
-- Users will need to enable "Confirm email" in Authentication > Settings in Supabase Dashboard

-- Create or update auth hooks to send verification emails
-- Note: This is mainly for documentation as hooks are managed via Supabase Dashboard

-- Cleanup: Remove the OTP cleanup function since we no longer use OTP codes
DROP FUNCTION IF EXISTS public.cleanup_expired_otps();