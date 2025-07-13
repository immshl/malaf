-- إصلاح المشاكل الأمنية المعروضة في Security Advisor

-- إصلاح مشكلة Search Path للدوال الموجودة
CREATE OR REPLACE FUNCTION public.get_user_email_by_username(username_input text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    user_email text;
BEGIN
    -- Get the email from auth.users table using the user_id from profiles
    -- Make the search case insensitive by converting both to lowercase
    SELECT au.email INTO user_email
    FROM public.profiles p
    JOIN auth.users au ON au.id = p.user_id
    WHERE LOWER(p.username) = LOWER(username_input);
    
    RETURN user_email;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    INSERT INTO public.profiles (user_id, username, full_name)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data ->> 'username',
        NEW.raw_user_meta_data ->> 'full_name'
    );
    RETURN NEW;
END;
$function$;

-- إضافة RLS policies لجدول otp_codes
-- السماح للنظام فقط بالوصول لرموز OTP (لا يحتاج المستخدمون للوصول المباشر)
CREATE POLICY "System can manage OTP codes" 
ON public.otp_codes 
FOR ALL 
USING (false)
WITH CHECK (false);

-- سياسة خاصة للـ Edge Functions فقط
CREATE POLICY "Edge functions can manage OTP codes" 
ON public.otp_codes 
FOR ALL 
TO service_role 
USING (true)
WITH CHECK (true);