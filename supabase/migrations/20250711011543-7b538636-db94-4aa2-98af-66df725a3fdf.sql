-- إصلاح مشكلة Security Definer في public_profiles view
-- حذف الـ view الحالي وإعادة إنشاؤه بشكل آمن

DROP VIEW IF EXISTS public.public_profiles;

-- إنشاء view آمن جديد بدون SECURITY DEFINER
CREATE VIEW public.public_profiles AS
SELECT 
  id,
  username,
  full_name,
  bio,
  avatar_url,
  website,
  location,
  profession,
  skills,
  experience_years,
  linkedin_url,
  github_url,
  twitter_url,
  instagram_url,
  created_at
FROM public.profiles
WHERE is_public = true;

-- إضافة RLS للـ view الجديد
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- السماح للجميع بقراءة البيانات العامة فقط
GRANT SELECT ON public.public_profiles TO anon, authenticated;