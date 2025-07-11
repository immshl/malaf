# منصة ملف - الملفات المهنية للفريلانسرز

## نظرة عامة
منصة ملف هي الحل الأمثل للفريلانسرز والمحترفين المستقلين لإنشاء ملفاتهم المهنية بطريقة احترافية وجذابة.

## المميزات الرئيسية
- ✨ واجهة مميزة وتصميم حديث
- 📅 نظام حجز ذكي للمواعيد
- 🔗 عنوان رقمي مخصص
- 📱 متوافق مع جميع الأجهزة
- 🚀 سهولة في الاستخدام

## التقنيات المستخدمة
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn UI
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Email**: Resend + React Email
- **Database**: PostgreSQL (Supabase)

## البدء السريع

### متطلبات النظام
- Node.js 18+
- npm أو yarn أو bun

### التثبيت
```bash
# استنساخ المشروع
git clone <YOUR_GIT_URL>

# الانتقال إلى مجلد المشروع
cd malaf-platform

# تثبيت التبعيات
npm install

# تشغيل المشروع محلياً
npm run dev
```

### متغيرات البيئة
إنشاء ملف `.env.local` وإضافة:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## هيكل المشروع
```
src/
├── components/       # المكونات القابلة لإعادة الاستخدام
├── pages/           # صفحات التطبيق
├── hooks/           # React Hooks مخصصة
├── lib/             # أدوات مساعدة
├── integrations/    # تكامل مع الخدمات الخارجية
└── assets/          # الملفات الثابتة

supabase/
├── functions/       # Edge Functions
├── migrations/      # قاعدة البيانات
└── config.toml     # إعدادات Supabase
```

## النشر
المنصة جاهزة للنشر على أي خدمة استضافة تدعم تطبيقات React:
- Vercel
- Netlify
- Cloudflare Pages

## المساهمة
نرحب بمساهماتكم لتطوير المنصة:

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى Branch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## الدعم
للحصول على الدعم أو الإبلاغ عن مشاكل:
- البريد الإلكتروني: support@malaf.me
- تويتر: [@malaf_me](https://twitter.com/malaf_me)

## الترخيص
هذا المشروع مرخص تحت رخصة MIT.

---
**ملف** - منصة احترافية للفريلانسرز 🚀
