import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowRight, Mail, RefreshCw, ArrowLeft, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const EmailVerification = () => {
  const [code, setCode] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
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
              title: "تم التحقق بنجاح!",
              description: "تم تأكيد بريدك الإلكتروني بنجاح"
            });
            
            setTimeout(() => {
              navigate("/create-profile");
            }, 2000);
          }
        } catch (error) {
          console.error('Email verification error:', error);
        }
      }
      
      // Check if user is already verified
      if (user?.email_confirmed_at) {
        navigate("/create-profile");
      }
    };

    checkEmailVerification();
  }, [searchParams, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      toast({
        variant: "destructive",
        title: "كود غير مكتمل",
        description: "يرجى إدخال كود التحقق المكون من 6 أرقام"
      });
      return;
    }
    
    setIsVerifying(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: user?.email || '',
        token: code,
        type: 'email'
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "كود خاطئ",
          description: "كود التحقق غير صحيح أو منتهي الصلاحية"
        });
        return;
      }

      setIsVerified(true);
      toast({
        title: "تم التحقق بنجاح!",
        description: "تم تأكيد بريدك الإلكتروني بنجاح"
      });
      
      // الانتقال إلى صفحة بناء الملف
      setTimeout(() => {
        navigate("/create-profile");
      }, 2000);
      
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        variant: "destructive",
        title: "خطأ في التحقق",
        description: "حدث خطأ أثناء التحقق من الكود"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!user?.email) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "لم يتم العثور على البريد الإلكتروني"
      });
      return;
    }

    setIsResending(true);
    
    try {
      // First try using Supabase resend
      const { error: supabaseError } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });

      // If Supabase resend fails, try our custom edge function
      if (supabaseError) {
        console.log('Supabase resend failed, trying custom function:', supabaseError.message);
        
        const { error: functionError } = await supabase.functions.invoke('send-email', {
          body: {
            email: user.email,
            token: Math.floor(100000 + Math.random() * 900000).toString(),
            email_action_type: 'signup',
            redirect_to: `${window.location.origin}/verify-email`
          }
        });

        if (functionError) {
          throw functionError;
        }
      }

      toast({
        title: "تم إرسال كود جديد",
        description: "تم إرسال كود التحقق الجديد إلى بريدك الإلكتروني"
      });
      
    } catch (error) {
      console.error('Resend error:', error);
      toast({
        variant: "destructive",
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال كود التحقق"
      });
    } finally {
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-strong border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-600 mb-2">تم التحقق بنجاح!</h2>
                <p className="text-muted-foreground">
                  تم تأكيد بريدك الإلكتروني. سيتم توجيهك لإنشاء ملفك المهني...
                </p>
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
            <div className="w-12 h-12 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <img 
                src="/lovable-uploads/053ffcb6-5dac-4834-a5ef-585d29be4be9.png" 
                alt="ملف" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-foreground group-hover:text-purple-600 transition-colors duration-300">malaf</span>
          </Link>
        </div>

        <Card className="shadow-strong border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center animate-pulse">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">تحقق من بريدك الإلكتروني</CardTitle>
            <CardDescription className="text-muted-foreground text-base leading-relaxed">
              أرسلنا لك كود التحقق على البريد الإلكتروني{' '}
              <span className="font-medium text-purple-600">{user?.email}</span>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-8">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-2xl mb-4">
                    <div style={{ direction: 'ltr' }}>
                      <InputOTP
                        maxLength={6}
                        value={code}
                        onChange={(value) => setCode(value)}
                        className="justify-center"
                        style={{ direction: 'ltr' }}
                      >
                        <InputOTPGroup className="gap-3" style={{ direction: 'ltr' }}>
                          {[...Array(6)].map((_, index) => (
                            <InputOTPSlot 
                              key={index}
                              index={index} 
                              className="w-12 h-12 text-lg font-bold border-2 rounded-xl transition-all duration-200 hover:border-purple-400 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-200 dark:focus:shadow-purple-800/50" 
                              style={{ direction: 'ltr' }}
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    أدخل الكود المكون من 6 أرقام
                  </p>
                </div>

                {/* زر التحقق */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="hero"
                  size="lg"
                  disabled={isVerifying || code.length !== 6}
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="ml-2 h-5 w-5 animate-spin" />
                      جاري التحقق...
                    </>
                  ) : (
                    <>
                      تحقق من الكود
                      <ArrowRight className="mr-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                {/* إعادة الإرسال */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    لم تستلم الكود؟
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendCode}
                    disabled={isResending}
                    className="min-w-[120px]"
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="ml-2 h-4 w-4" />
                        إرسال كود جديد
                      </>
                    )}
                  </Button>
                </div>

                {/* رابط العودة */}
                <div className="text-center pt-4 border-t border-border/20">
                  <Link 
                    to="/signup" 
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    <ArrowLeft className="ml-1 h-4 w-4" />
                    العودة للتسجيل
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerification;