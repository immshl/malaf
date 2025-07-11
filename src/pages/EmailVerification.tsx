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
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

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
              title: "تم التحقق بنجاح! 🎉",
              description: "تم تأكيد بريدك الإلكتروني بنجاح"
            });
            
            setTimeout(() => {
              navigate("/create-profile");
            }, 3000);
          } else {
            console.error('Email verification error:', error);
            toast({
              variant: "destructive",
              title: "خطأ في التحقق",
              description: "رابط التحقق غير صالح أو منتهي الصلاحية"
            });
          }
        } catch (error) {
          console.error('Email verification error:', error);
        }
      }
      
      // Check if user is already verified
      if (user?.email_confirmed_at) {
        navigate("/create-profile");
      }
      
      setIsChecking(false);
    };

    checkEmailVerification();
  }, [searchParams, user, navigate]);

  const handleResendEmail = async () => {
    if (!user?.email) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "لم يتم العثور على البريد الإلكتروني"
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "تم إرسال الرابط مجدداً 📧",
        description: "تفقد بريدك الإلكتروني للرابط الجديد"
      });
      
    } catch (error) {
      console.error('Resend error:', error);
      toast({
        variant: "destructive",
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال رابط التحقق"
      });
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-strong border-0 bg-white/80 backdrop-blur-sm">
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
                <h2 className="text-2xl font-bold text-green-600 mb-2">تم التحقق بنجاح! 🎉</h2>
                <p className="text-muted-foreground mb-4">
                  تم تأكيد بريدك الإلكتروني بنجاح
                </p>
                <div className="text-sm text-purple-600 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  جارٍ التوجيه إلى إنشاء الملف الشخصي...
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

        <Card className="shadow-strong border-0 bg-white/80 backdrop-blur-sm">
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
            <CardTitle className="text-2xl font-bold text-foreground mb-2">تحقق من بريدك الإلكتروني 📧</CardTitle>
            <CardDescription className="text-muted-foreground text-base leading-relaxed">
              لقد أرسلنا رابط التحقق إلى{' '}
              <span className="font-medium text-purple-600">{user?.email}</span>
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
                  <h3 className="font-semibold text-foreground">اضغط على الرابط في البريد</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    تفقد صندوق الوارد الخاص بك واضغط على رابط التحقق لتأكيد حسابك وإكمال التسجيل
                  </p>
                  
                  <div className="flex items-center justify-center gap-2 text-xs text-purple-600 dark:text-purple-400 mt-4">
                    <Clock className="w-3 h-3" />
                    الرابط صالح لمدة 24 ساعة
                  </div>
                </div>
              </div>

              {/* نصائح */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800/30">
                <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
                  💡 لم تجد الإيميل؟ تأكد من مجلد البريد المزعج (Spam)
                </p>
              </div>

              {/* إعادة الإرسال */}
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  لم تستلم الإيميل؟
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendEmail}
                  className="min-w-[140px] hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-900/20"
                >
                  <RefreshCw className="ml-2 h-4 w-4" />
                  إرسال الرابط مجدداً
                </Button>
              </div>

              {/* رابط العودة */}
              <div className="text-center pt-4 border-t border-border/20">
                <Link 
                  to="/signup" 
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← العودة للتسجيل
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