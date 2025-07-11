-- إضافة حقل أبرز العملاء للبروفايل
ALTER TABLE public.profiles 
ADD COLUMN featured_clients TEXT[];

-- إضافة فهرس للبحث السريع
CREATE INDEX idx_profiles_featured_clients ON public.profiles USING GIN(featured_clients);