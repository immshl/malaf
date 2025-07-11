-- Clean up OTP-related data since we're moving to email link verification only
-- Remove any existing auth hooks that might be sending OTP emails
UPDATE auth.hooks 
SET events = '{}' 
WHERE hook_name = 'send-email' AND 'validate' = ANY(events);

-- We can keep the send-email hook for other email purposes but remove validation events
UPDATE auth.hooks 
SET events = array_remove(events, 'validate') 
WHERE hook_name = 'send-email';

-- Drop the OTP codes table since we no longer need it
DROP TABLE IF EXISTS public.otp_codes;