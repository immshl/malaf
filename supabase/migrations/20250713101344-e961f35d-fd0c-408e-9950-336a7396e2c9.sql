-- إنشاء جدول auth.hooks إذا لم يكن موجوداً
CREATE TABLE IF NOT EXISTS auth.hooks (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    hook_table_id integer NOT NULL DEFAULT 1,
    hook_name text NOT NULL UNIQUE,
    hook_url text NOT NULL,
    events text[] NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    request_id bigint
);

-- تمكين الهوك لإرسال الإيميلات
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