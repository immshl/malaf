import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, RefreshCw, CheckCircle, Clock, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const EmailVerification = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();

  // دالة الترجمة
  const t = (key: string, fallback: string) => {
    const translations: Record<string, Record<string, string>> = {
      ar: {
        verificationSuccess: "تم التحقق بنجاح! 🎉",
        emailConfirmed: "تم تأكيد بريدك الإلكتروني بنجاح",
        redirectingToProfile: "جارٍ التوجيه إلى إنشاء الملف الشخصي...",
        verificationError: "خطأ في التحقق",
        invalidOrExpiredLink: "رابط التحقق غير صالح أو منتهي الصلاحية",
        checkYourEmail: "تحقق من بريدك الإلكتروني 📧",
        sentVerificationTo: "لقد أرسلنا رابط التحقق إلى",
        clickEmailLink: "اضغط على الرابط في البريد",
        checkInboxInstructions: "تفقد صندوق الوارد الخاص بك واضغط على رابط التحقق لتأكيد حسابك وإكمال التسجيل",
        linkValidFor24h: "الرابط صالح لمدة 24 ساعة",
        didntReceiveEmail: "لم تستلم الإيميل؟",
        resendLink: "إرسال الرابط مجدداً",
        backToSignup: "العودة للتسجيل",
        checkSpamFolder: "💡 لم تجد الإيميل؟ تأكد من مجلد البريد المزعج (Spam)",
        error: "خطأ",
        emailNotFound: "لم يتم العثور على البريد الإلكتروني",
        emailSentAgain: "تم إرسال الرابط مجدداً 📧",
        checkEmailAndSpam: "تفقد بريدك الإلكتروني للرابط الجديد. تحقق من مجلد الرسائل المزعجة أيضاً.",
        signupRequired: "مطلوب إعادة التسجيل",
        incompleteAccount: "يبدو أن حسابك غير مكتمل. يرجى العودة وإعادة التسجيل بكلمة مرور جديدة.",
        resignup: "إعادة التسجيل",
        sendError: "خطأ في الإرسال",
        verificationSendError: "حدث خطأ أثناء إرسال رابط التحقق",
        rateLimitError: "تم تجاوز الحد المسموح",
        waitBeforeResend: "يرجى الانتظار دقيقة واحدة قبل إعادة المحاولة. هذا للحماية من الإرسال المتكرر."
      },
      en: {
        verificationSuccess: "Verification successful! 🎉",
        emailConfirmed: "Your email has been successfully confirmed",
        redirectingToProfile: "Redirecting to profile creation...",
        verificationError: "Verification error",
        invalidOrExpiredLink: "Verification link is invalid or expired",
        checkYourEmail: "Check your email 📧",
        sentVerificationTo: "We sent a verification link to",
        clickEmailLink: "Click the link in the email",
        checkInboxInstructions: "Check your inbox and click the verification link to confirm your account and complete registration",
        linkValidFor24h: "Link is valid for 24 hours",
        didntReceiveEmail: "Didn't receive the email?",
        resendLink: "Resend link",
        backToSignup: "Back to signup",
        checkSpamFolder: "💡 Didn't find the email? Check your spam folder",
        error: "Error",
        emailNotFound: "Email address not found",
        emailSentAgain: "Link sent again 📧",
        checkEmailAndSpam: "Check your email for the new link. Also check your spam folder.",
        signupRequired: "Signup required",
        incompleteAccount: "Your account seems incomplete. Please go back and signup again with a new password.",
        resignup: "Signup again",
        sendError: "Send error",
        verificationSendError: "An error occurred while sending the verification link",
        rateLimitError: "Rate limit exceeded",
        waitBeforeResend: "Please wait one minute before trying again. This is to protect from excessive sending."
      }
    };
    
    return translations[language]?.[key] || fallback;
  };

  // Check if user is already verified or coming from email link
  useEffect(() => {
    const checkEmailVerification = async () => {
      // Check for token in URL (email link verification)
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      
      if (token && type === 'signup') {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
          });
          
          if (!error) {
            setIsVerified(true);
            toast({
              title: t('verificationSuccess', 'تم التحقق بنجاح! 🎉'),
              description: t('emailConfirmed', 'تم تأكيد بريدك الإلكتروني بنجاح')
            });
            
            setTimeout(() => {
              // Check if user needs to complete an application
              const postVerificationRedirect = localStorage.getItem('postVerificationRedirect');
              if (postVerificationRedirect) {
                localStorage.removeItem('postVerificationRedirect');
                navigate(postVerificationRedirect);
              } else {
                navigate("/create-profile");
              }
            }, 3000);
          } else {
            console.error('Email verification error:', error);
            toast({
              variant: "destructive",
              title: t('verificationError', 'خطأ في التحقق'),
              description: t('invalidOrExpiredLink', 'رابط التحقق غير صالح أو منتهي الصلاحية')
            });
          }
        } catch (error) {
          console.error('Email verification error:', error);
        }
      }
      
      // Check if user is already verified
      if (user?.email_confirmed_at) {
        // Check if user needs to complete an application
        const postVerificationRedirect = localStorage.getItem('postVerificationRedirect');
        if (postVerificationRedirect) {
          localStorage.removeItem('postVerificationRedirect');
          navigate(postVerificationRedirect);
        } else {
          navigate("/create-profile");
        }
      }
      
      setIsChecking(false);
    };

    checkEmailVerification();
  }, [searchParams, user, navigate]);

  // Poll for email verification status every 5 seconds
  useEffect(() => {
    if (isVerified || isChecking) return;

    setIsPolling(true);
    
    const pollInterval = setInterval(async () => {
      try {
        // Get fresh user session to check email confirmation
        const { data: session } = await supabase.auth.getSession();
        
        if (session?.session?.user?.email_confirmed_at) {
          setIsVerified(true);
          clearInterval(pollInterval);
          
          toast({
            title: t('verificationSuccess', 'تم التحقق بنجاح! 🎉'),
            description: t('emailConfirmed', 'تم تأكيد بريدك الإلكتروني بنجاح')
          });
          
          setTimeout(() => {
            // Check if user needs to complete an application
            const postVerificationRedirect = localStorage.getItem('postVerificationRedirect');
            if (postVerificationRedirect) {
              localStorage.removeItem('postVerificationRedirect');
              navigate(postVerificationRedirect);
            } else {
              navigate("/create-profile");
            }
          }, 2000);
        }
      } catch (error) {
        console.error('Error polling verification status:', error);
      }
    }, 5000); // Poll every 5 seconds

    // Cleanup interval after 10 minutes (to avoid infinite polling)
    const timeoutId = setTimeout(() => {
      clearInterval(pollInterval);
      setIsPolling(false);
    }, 600000); // 10 minutes

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeoutId);
      setIsPolling(false);
    };
  }, [isVerified, isChecking, navigate, t]);

  const handleResendEmail = async () => {
    if (!user?.email) {
      toast({
        variant: "destructive",
        title: t('error', 'خطأ'),
        description: t('emailNotFound', 'لم يتم العثور على البريد الإلكتروني')
      });
      return;
    }

    try {
      const redirectUrl = window.location.hostname.includes('malaf.me') 
        ? `${window.location.origin}/verify-email`
        : 'https://malaf.me/verify-email';

      // نحاول signInWithOtp مباشرة لأنه يعمل كإعادة تسجيل
      const { error } = await supabase.auth.signInWithOtp({
        email: user.email,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        // إذا كان الخطأ متعلق بـ rate limiting
        if (error.message.includes("rate") || error.message.includes("too many") || 
            error.message.includes("wait") || error.message.includes("لديك طلبات كثيرة")) {
          toast({
            variant: "destructive",
            title: t('rateLimitError', 'تم تجاوز الحد المسموح'),
            description: t('waitBeforeResend', 'يرجى الانتظار دقيقة واحدة قبل إعادة المحاولة. هذا للحماية من الإرسال المتكرر.'),
          });
          return;
        }
        
        // إذا فشل OTP، نجرب signUp كعملية تسجيل جديدة
        console.log('OTP failed, trying signUp:', error.message);
        
        const { error: signUpError } = await supabase.auth.signUp({
          email: user.email,
          password: 'temp-password-' + Date.now(), // كلمة مرور مؤقتة
          options: {
            emailRedirectTo: redirectUrl
          }
        });

        if (signUpError && !signUpError.message.includes("User already registered")) {
          throw signUpError;
        }
      }

      toast({
        title: t('emailSentAgain', 'تم إرسال الرابط مجدداً 📧'),
        description: t('checkEmailAndSpam', 'تفقد بريدك الإلكتروني للرابط الجديد. تحقق من مجلد الرسائل المزعجة أيضاً.')
      });
      
    } catch (error: any) {
      console.error('Resend error:', error);
      
      // معالجة أخطاء Rate Limiting
      if (error.message?.includes("rate") || error.message?.includes("too many") || 
          error.message?.includes("wait") || error.message?.includes("لديك طلبات كثيرة")) {
        toast({
          variant: "destructive",
          title: t('rateLimitError', 'تم تجاوز الحد المسموح'),
          description: t('waitBeforeResend', 'يرجى الانتظار دقيقة واحدة قبل إعادة المحاولة. هذا للحماية من الإرسال المتكرر.'),
        });
        return;
      }
      
      // إذا كانت المشكلة أن المستخدم مسجل بالفعل، نوجهه لإعادة التسجيل
      if (error.message?.includes("User already registered") || 
          error.message?.includes("user_repeated_signup")) {
        toast({
          variant: "destructive",
          title: t('signupRequired', 'مطلوب إعادة التسجيل'),
          description: t('incompleteAccount', 'يبدو أن حسابك غير مكتمل. يرجى العودة وإعادة التسجيل بكلمة مرور جديدة.'),
          action: (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/signup")}
            >
              {t('resignup', 'إعادة التسجيل')}
            </Button>
          )
        });
      } else {
        toast({
          variant: "destructive",
          title: t('sendError', 'خطأ في الإرسال'),
          description: error.message || t('verificationSendError', 'حدث خطأ أثناء إرسال رابط التحقق')
        });
      }
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-strong border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {t('verificationSuccess', 'تم التحقق بنجاح! 🎉')}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {t('emailConfirmed', 'تم تأكيد بريدك الإلكتروني بنجاح')}
                </p>
                <div className="text-sm text-purple-600 dark:text-purple-400 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  {t('redirectingToProfile', 'جارٍ التوجيه إلى إنشاء الملف الشخصي...')}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* شعار الموقع */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 space-x-reverse group">
            <div className="w-10 h-10 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              {/* Logo for light mode (black) */}
              <img 
                src="/lovable-uploads/be1d2269-8206-422b-a395-e4fb9e1a88cc.png" 
                alt="ملف" 
                className="w-full h-full object-contain dark:hidden"
              />
              {/* Logo for dark mode (white) */}
              <img 
                src="/lovable-uploads/822b255a-0cfa-4520-b9a5-aa69e7ef91e6.png" 
                alt="ملف" 
                className="w-full h-full object-contain hidden dark:block"
              />
            </div>
            <span className="text-2xl font-bold text-foreground group-hover:text-purple-600 transition-colors duration-300">malaf</span>
          </Link>
        </div>

        <Card className="shadow-strong border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-lg">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground mb-2">
              {t('checkYourEmail', 'تحقق من بريدك الإلكتروني 📧')}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base leading-relaxed">
              {t('sentVerificationTo', 'لقد أرسلنا رابط التحقق إلى')}{' '}
              <span className="font-medium text-purple-600 dark:text-purple-400">{user?.email}</span>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-8">
            <div className="space-y-6">
              {/* رسالة التعليمات */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-purple-100 dark:border-purple-800/30">
                <div className="text-center space-y-4">
                  <div className="text-purple-600 dark:text-purple-400">
                    <Sparkles className="w-8 h-8 mx-auto mb-3" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {t('clickEmailLink', 'اضغط على الرابط في البريد')}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('checkInboxInstructions', 'تفقد صندوق الوارد الخاص بك واضغط على رابط التحقق لتأكيد حسابك وإكمال التسجيل')}
                  </p>
                  
                  <div className="flex items-center justify-center gap-2 text-xs text-purple-600 dark:text-purple-400 mt-4">
                    <Clock className="w-3 h-3" />
                    {t('linkValidFor24h', 'الرابط صالح لمدة 24 ساعة')}
                  </div>
                </div>
              </div>

              {/* نصائح */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800/30">
                <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
                  {t('checkSpamFolder', '💡 لم تجد الإيميل؟ تأكد من مجلد البريد المزعج (Spam)')}
                </p>
              </div>

              {/* إعادة الإرسال */}
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t('didntReceiveEmail', 'لم تستلم الإيميل؟')}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendEmail}
                  className="min-w-[140px] hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-900/20 dark:hover:border-purple-600"
                >
                  <RefreshCw className="ml-2 h-4 w-4" />
                  {t('resendLink', 'إرسال الرابط مجدداً')}
                </Button>
              </div>

              {/* رابط العودة */}
              <div className="text-center pt-4 border-t border-border/20">
                <Link 
                  to="/signup" 
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {language === 'ar' ? '← ' : '→ '}{t('backToSignup', 'العودة للتسجيل')}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerification;