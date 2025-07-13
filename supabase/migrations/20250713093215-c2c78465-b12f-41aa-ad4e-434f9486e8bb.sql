-- تمكين Auth Hooks في Supabase
-- Create the auth.hooks table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.hooks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    hook_table_id integer NOT NULL,
    hook_name text NOT NULL,
    hook_url text NOT NULL,
    events text[] NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    request_id bigint
);

-- Add unique constraint on hook_name if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'hooks_hook_name_key') THEN
        ALTER TABLE auth.hooks ADD CONSTRAINT hooks_hook_name_key UNIQUE (hook_name);
    END IF;
END $$;

-- Configure Auth Hook to use our custom email function for signup verification
INSERT INTO auth.hooks (hook_table_id, hook_name, hook_url, events, created_at)
VALUES (
  1,
  'send-email', 
  'https://mfchmiwxlkvkwtucizzl.supabase.co/functions/v1/send-email',
  ARRAY['validate', 'signup', 'recovery'],
  now()
)
ON CONFLICT (hook_name) 
DO UPDATE SET 
  hook_url = 'https://mfchmiwxlkvkwtucizzl.supabase.co/functions/v1/send-email',
  events = ARRAY['validate', 'signup', 'recovery'];