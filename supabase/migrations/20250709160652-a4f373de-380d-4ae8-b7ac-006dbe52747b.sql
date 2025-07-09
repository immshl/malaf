-- Configure Auth Hooks to use our custom email function
INSERT INTO auth.hooks (hook_name, hook_url, events, created_at)
VALUES (
  'send-email', 
  'https://mfchmiwxlkvkwtucizzl.supabase.co/functions/v1/send-email',
  '{"signup"}',
  now()
)
ON CONFLICT (hook_name) 
DO UPDATE SET 
  hook_url = 'https://mfchmiwxlkvkwtucizzl.supabase.co/functions/v1/send-email',
  events = '{"signup"}';