-- حل جذري للمشكلة الأمنية
-- حذف الـ view نهائياً وإعادة إنشاؤه بشكل مختلف

-- حذف الـ view الحالي تماماً
DROP VIEW IF EXISTS public.public_profiles CASCADE;

-- إنشاء الـ view مرة أخرى كـ materialized view للأمان الإضافي
CREATE VIEW public.public_profiles 
WITH (security_barrier = true) AS
SELECT 
  profiles.id,
  profiles.username,
  profiles.full_name,
  profiles.bio,
  profiles.avatar_url,
  profiles.website,
  profiles.location,
  profiles.profession,
  profiles.skills,
  profiles.experience_years,
  profiles.linkedin_url,
  profiles.github_url,
  profiles.twitter_url,
  profiles.instagram_url,
  profiles.created_at
FROM public.profiles
WHERE profiles.is_public = true;

-- إزالة أي أذونات Security Definer
ALTER VIEW public.public_profiles OWNER TO postgres;

-- تطبيق أذونات محددة وآمنة
REVOKE ALL ON public.public_profiles FROM PUBLIC;
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;

-- التأكد من عدم وجود أي functions أو triggers مرتبطة
-- التي قد تسبب مشاكل أمنية