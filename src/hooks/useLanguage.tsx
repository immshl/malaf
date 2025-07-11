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
    username: "اسم المستخدم",
    fullName: "الاسم الكامل",
    
    // Create Profile Page
    createProfileTitle: "أنشئ ملفك المهني",
    createProfileDesc: "أضف معلوماتك لإنشاء ملف مهني مميز",
    basicInfo: "المعلومات الأساسية",
    basicInfoDesc: "البيانات الشخصية والأساسية لملفك",
    profileImage: "الصورة الشخصية",
    chooseImage: "اختر صورة",
    professionalImageNote: "صورة احترافية واضحة (اختيارية)",
    bio: "النبذة التعريفية",
    bioPlaceholder: "اكتب نبذة مختصرة عن خبرتك ومهاراتك...",
    emojiSection: "اختر إيموجي يعبر عنك (اختياري)",
    moreEmojis: "المزيد",
    save: "حفظ",
    loading: "جاري التحميل...",
    
    // Email Verification Page
    emailVerificationTitle: "تحقق من بريدك الإلكتروني",
    emailVerificationDesc: "أرسلنا لك كود التحقق على البريد الإلكتروني",
    enterCode: "أدخل الكود المكون من 6 أرقام",
    verifyCode: "تحقق من الكود",
    verifying: "جاري التحقق...",
    didntReceiveCode: "لم تستلم الكود؟",
    resendCode: "إرسال كود جديد",
    sending: "جاري الإرسال...",
    backToSignup: "العودة للتسجيل",
    verificationSuccess: "تم التحقق بنجاح!",
    verificationSuccessDesc: "تم تأكيد بريدك الإلكتروني. سيتم توجيهك لإنشاء ملفك المهني...",
    
    // User Profile Page
    profileLink: "رابط الملف الشخصي",
    copyLink: "نسخ الرابط",
    bookMeeting: "حجز اجتماع",
    bookMeetingTitle: "حجز اجتماع",
    bookMeetingDesc: "اختر الموعد المناسب لك أو اقترح موعد مختلف",
    availableTimes: "الأوقات المتاحة",
    selectDay: "اختر اليوم",
    selectTime: "اختر الوقت",
    suggestDifferentTime: "أو اقترح موعد مختلف",
    suggestTimeTitle: "اقتراح موعد مختلف",
    suggestTimeDesc: "اقترح يوم وفترة مناسبة لك، وسيتم مراجعة طلبك والرد عليك",
    backToAvailableTimes: "العودة للأوقات المتاحة",
    yourInfo: "بياناتك",
    preferredContact: "وسيلة التواصل المفضلة (اختياري)",
    notes: "ملاحظات إضافية (اختياري)",
    sendBookingRequest: "إرسال طلب الحجز",
    profileNotFound: "الملف الشخصي غير موجود",
    profileNotFoundDesc: "عذراً، لم نتمكن من العثور على هذا الملف الشخصي",
    backToHome: "العودة للرئيسية",
    loadingProfile: "جاري تحميل الملف الشخصي...",
    
    // Common
    back: "العودة",
    next: "التالي",
    cancel: "إلغاء",
    confirm: "تأكيد",
    optional: "(اختياري)",
    required: "*",
    submit: "إرسال",
    edit: "تعديل",
    delete: "حذف",
    add: "إضافة",
    remove: "إزالة",
    
    // Days
    sunday: "الأحد",
    monday: "الاثنين",
    tuesday: "الثلاثاء",
    wednesday: "الأربعاء",
    thursday: "الخميس",
    friday: "الجمعة",
    saturday: "السبت",
    
    // Time slots
    morning: "الصباح (8:00 ص - 12:00 م)",
    afternoon: "بعد الظهر (12:00 م - 5:00 م)",
    evening: "المساء (5:00 م - 9:00 م)",
    
    // Contact methods
    emailContact: "البريد الإلكتروني",
    phone: "الهاتف",
    whatsapp: "واتساب",
    telegram: "تلقرام",
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
    username: "Username",
    fullName: "Full Name",
    
    // Create Profile Page
    createProfileTitle: "Create Your Professional Profile",
    createProfileDesc: "Add your information to create a distinguished professional profile",
    basicInfo: "Basic Information",
    basicInfoDesc: "Personal and basic data for your profile",
    profileImage: "Profile Picture",
    chooseImage: "Choose Image",
    professionalImageNote: "Professional clear image (optional)",
    bio: "Bio",
    bioPlaceholder: "Write a brief description of your experience and skills...",
    emojiSection: "Choose an emoji that represents you (optional)",
    moreEmojis: "More",
    save: "Save",
    loading: "Loading...",
    
    // Email Verification Page
    emailVerificationTitle: "Verify Your Email",
    emailVerificationDesc: "We sent you a verification code to your email",
    enterCode: "Enter the 6-digit code",
    verifyCode: "Verify Code",
    verifying: "Verifying...",
    didntReceiveCode: "Didn't receive the code?",
    resendCode: "Send New Code",
    sending: "Sending...",
    backToSignup: "Back to Signup",
    verificationSuccess: "Verification Successful!",
    verificationSuccessDesc: "Your email has been confirmed. You will be redirected to create your professional profile...",
    
    // User Profile Page
    profileLink: "Profile Link",
    copyLink: "Copy Link",
    bookMeeting: "Book Meeting",
    bookMeetingTitle: "Book a Meeting",
    bookMeetingDesc: "Choose a suitable time for you or suggest a different time",
    availableTimes: "Available Times",
    selectDay: "Select Day",
    selectTime: "Select Time",
    suggestDifferentTime: "Or suggest a different time",
    suggestTimeTitle: "Suggest Different Time",
    suggestTimeDesc: "Suggest a suitable day and period for you, and your request will be reviewed and responded to",
    backToAvailableTimes: "Back to Available Times",
    yourInfo: "Your Information",
    preferredContact: "Preferred Contact Method (optional)",
    notes: "Additional Notes (optional)",
    sendBookingRequest: "Send Booking Request",
    profileNotFound: "Profile Not Found",
    profileNotFoundDesc: "Sorry, we couldn't find this profile",
    backToHome: "Back to Home",
    loadingProfile: "Loading profile...",
    
    // Common
    back: "Back",
    next: "Next",
    cancel: "Cancel",
    confirm: "Confirm",
    optional: "(optional)",
    required: "*",
    submit: "Submit",
    edit: "Edit",
    delete: "Delete",
    add: "Add",
    remove: "Remove",
    
    // Days
    sunday: "Sunday",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    
    // Time slots
    morning: "Morning (8:00 AM - 12:00 PM)",
    afternoon: "Afternoon (12:00 PM - 5:00 PM)",
    evening: "Evening (5:00 PM - 9:00 PM)",
    
    // Contact methods
    emailContact: "Email",
    phone: "Phone",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
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
    return translations[language][key as keyof typeof translations[Language]] || key;
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