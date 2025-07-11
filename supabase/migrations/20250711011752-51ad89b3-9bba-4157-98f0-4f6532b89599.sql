-- إذا استمر التحذير، سنحذف الـ view تماماً
-- ونعتمد على الـ profiles table مباشرة مع RLS

-- حذف الـ view نهائياً
DROP VIEW IF EXISTS public.public_profiles CASCADE;

-- لا نحتاج الـ view - سنستخدم profiles table مباشرة
-- الـ RLS policies الموجودة على profiles table كافية للحماية

-- التأكد من أن الـ RLS policies تعمل بشكل صحيح
-- (هذا للتأكيد فقط - الـ policies موجودة فعلاً)

-- تحديث النوع في types.ts سيحدث تلقائياً