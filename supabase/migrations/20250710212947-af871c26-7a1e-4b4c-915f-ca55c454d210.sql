-- إضافة عمود الإيموجي لجدول الملفات الشخصية
ALTER TABLE public.profiles 
ADD COLUMN emoji text;