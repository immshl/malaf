-- Remove the email confirmation requirement for new signups
-- This needs to be done in Supabase dashboard under Authentication settings
-- The migration here is for documentation purposes

-- Update auth hooks to not send emails for signup
UPDATE auth.hooks 
SET events = '{}' 
WHERE hook_name = 'send-email';