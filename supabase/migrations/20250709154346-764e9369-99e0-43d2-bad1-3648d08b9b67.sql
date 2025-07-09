-- إنشاء جدول البروفايلات للمستخدمين
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  website TEXT,
  location TEXT,
  profession TEXT,
  skills TEXT[],
  experience_years INTEGER,
  contact_email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تفعيل Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للبروفايلات
CREATE POLICY "البروفايلات العامة يمكن للجميع رؤيتها" 
ON public.profiles 
FOR SELECT 
USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "المستخدمون يمكنهم إنشاء بروفايلهم" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "المستخدمون يمكنهم تعديل بروفايلهم" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "المستخدمون يمكنهم حذف بروفايلهم" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- إنشاء trigger لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- إنشاء trigger لإنشاء بروفايل تلقائياً عند التسجيل
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    NEW.raw_user_meta_data ->> 'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- إنشاء buckets للتخزين
INSERT INTO storage.buckets (id, name, public) VALUES 
('avatars', 'avatars', true),
('portfolio', 'portfolio', true);

-- سياسات التخزين للصور الشخصية
CREATE POLICY "يمكن للجميع رؤية الصور الشخصية" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "المستخدمون يمكنهم رفع صورهم الشخصية" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "المستخدمون يمكنهم تحديث صورهم الشخصية" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "المستخدمون يمكنهم حذف صورهم الشخصية" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- سياسات التخزين لملفات البورتفوليو
CREATE POLICY "يمكن للجميع رؤية ملفات البورتفوليو" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'portfolio');

CREATE POLICY "المستخدمون يمكنهم رفع ملفات البورتفوليو" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'portfolio' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "المستخدمون يمكنهم تحديث ملفات البورتفوليو" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'portfolio' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "المستخدمون يمكنهم حذف ملفات البورتفوليو" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'portfolio' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- فهارس لتحسين الأداء
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_is_public ON public.profiles(is_public);
CREATE INDEX idx_profiles_created_at ON public.profiles(created_at);

-- إنشاء view للبروفايلات العامة
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

-- تفعيل Realtime للبروفايلات
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;