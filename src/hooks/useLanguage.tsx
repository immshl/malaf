import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
  ar: {
    // Hero Section
    heroSubtitle: "لتمكين العمل الحر",
    heroTitle: "ملف مهني خاص بك",
    heroDescription: "أنشئ صفحة تعريفية احترافية تجمع كل روابطك وخدماتك في مكان واحد. اسمح لعملائك بحجز اجتماع معك بسهولة وسرعة.",
    createProfile: "أنشئ ملفك المهني",
    viewExample: "شاهد نموذج",
    freePlatform: "مجاني تماماً • لا حاجة لبطاقة ائتمانية",
    
    // Features Section
    featuresTitle: "كل ما تحتاجه لبناء حضور رقمي فعّال",
    featuresSubtitle: "منصة شاملة تمكنك من إنشاء حضور رقمي قوي وجذب المزيد من العملاء",
    feature1Title: "واجهة احترافية منظمة",
    feature1Desc: "قوالب أنيقة ومتجاوبة تعكس مهنيتك وخبرتك",
    feature2Title: "نظام حجز ذكي",
    feature2Desc: "اسمح لعملائك بحجز اجتماع معك مباشرة من ملفك الشخصي",
    feature3Title: "رابط رقمي مخصص",
    feature3Desc: "احصل على رابط شخصي مميز يمكنك مشاركته بسهولة",
    
    // How it works
    howItWorksTitle: "كيف يعمل ملف؟",
    howItWorksSubtitle: "ثلاث خطوات بسيطة لإنشاء ملفك المهني",
    step1Title: "أنشئ ملفك",
    step1Desc: "سجل بياناتك الأساسية وأنشئ ملفك المهني في دقائق معدودة",
    step2Title: "شارك ملفك",
    step2Desc: "احصل على رابطك الخاص وشاركه مع عملائك وجمهورك",
    step3Title: "استقبل الطلبات",
    step3Desc: "ابدأ في استقبال طلبات العمل والاجتماعات من عملائك الجدد",
    
    // CTA Section
    ctaTitle: "ابدأ ملفك المميز",
    ctaSubtitle: "انضم إلى آلاف المحترفين المستقلين الذين يستخدمون ملف لتنمية أعمالهم",
    startNow: "أنشئ ملفك الآن",
    contactUs: "تواصل معنا",
    
    // Auth Pages
    signUp: "إنشاء حساب جديد",
    signUpDesc: "أنشئ حسابك لتبدأ في بناء ملفك المهني",
    signIn: "تسجيل الدخول",
    signInDesc: "ادخل إلى حسابك لإدارة ملفك المهني",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    forgotPassword: "نسيت كلمة المرور؟",
    noAccount: "لا تملك حساب؟",
    haveAccount: "تملك حساب؟",
    createNewAccount: "أنشئ حساب جديد",
    signInToAccount: "سجل دخولك",
  },
  en: {
    // Hero Section
    heroSubtitle: "Empowering Freelancers",
    heroTitle: "Your Professional Profile",
    heroDescription: "Create a professional showcase that brings together all your links and services in one place. Allow your clients to easily book meetings with you.",
    createProfile: "Create Your Profile",
    viewExample: "View Example",
    freePlatform: "Completely Free • No Credit Card Required",
    
    // Features Section
    featuresTitle: "Everything You Need for Effective Digital Presence",
    featuresSubtitle: "A comprehensive platform that enables you to create a strong digital presence and attract more clients",
    feature1Title: "Professional Organized Interface",
    feature1Desc: "Elegant and responsive templates that reflect your professionalism and expertise",
    feature2Title: "Smart Booking System",
    feature2Desc: "Allow your clients to book meetings with you directly from your personal profile",
    feature3Title: "Custom Digital Link",
    feature3Desc: "Get a unique personal link that you can easily share",
    
    // How it works
    howItWorksTitle: "How Does Malaf Work?",
    howItWorksSubtitle: "Three simple steps to create your professional profile",
    step1Title: "Create Your Profile",
    step1Desc: "Register your basic information and create your professional profile in minutes",
    step2Title: "Share Your Profile",
    step2Desc: "Get your unique link and share it with your clients and audience",
    step3Title: "Receive Requests",
    step3Desc: "Start receiving work requests and meeting bookings from your new clients",
    
    // CTA Section
    ctaTitle: "Start Your Distinguished Profile",
    ctaSubtitle: "Join thousands of freelancers who use Malaf to grow their businesses",
    startNow: "Create Your Profile Now",
    contactUs: "Contact Us",
    
    // Auth Pages
    signUp: "Create New Account",
    signUpDesc: "Create your account to start building your professional profile",
    signIn: "Sign In",
    signInDesc: "Sign in to your account to manage your professional profile",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?",
    noAccount: "Don't have an account?",
    haveAccount: "Have an account?",
    createNewAccount: "Create New Account",
    signInToAccount: "Sign In",
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('ar');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // Apply language direction
    if (lang === "ar") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    }
  };

  const t = (key: string): string => {
    const currentTranslations = translations[language];
    return currentTranslations[key as keyof typeof currentTranslations] || key;
  };

  useEffect(() => {
    // Set initial language
    setLanguage(language);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};