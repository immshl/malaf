import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowRight, Mail, RefreshCw, ArrowLeft } from "lucide-react";

const EmailVerification = () => {
  const [code, setCode] = useState("");
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 4) {
      alert("يرجى إدخال كود التحقق المكون من 4 أرقام");
      return;
    }
    
    // مؤقت - سيتم ربطه بـ Supabase لاحقاً
    console.log("التحقق من الكود:", code);
    alert("تم التحقق بنجاح! الانتقال إلى بناء الملف");
    
    // الانتقال إلى صفحة بناء الملف
    navigate("/create-profile");
  };

  const handleResendCode = async () => {
    setIsResending(true);
    
    // مؤقت - سيتم ربطه بـ Supabase لاحقاً
    setTimeout(() => {
      setIsResending(false);
      alert("تم إرسال كود جديد إلى بريدك الإلكتروني");
    }, 2000);
  };

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
            <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">malaf</span>
          </Link>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
          <CardHeader className="text-center pb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground mb-2">تحقق من بريدك الإلكتروني</CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              أرسلنا كود التحقق المكون من 4 أرقام إلى بريدك الإلكتروني
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* كود التحقق */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-2xl mb-4">
                    <div style={{ direction: 'ltr' }}>
                      <InputOTP
                        maxLength={4}
                        value={code}
                        onChange={(value) => setCode(value)}
                        className="justify-center"
                        style={{ direction: 'ltr' }}
                      >
                        <InputOTPGroup className="gap-3" style={{ direction: 'ltr' }}>
                          <InputOTPSlot 
                            index={0} 
                            className="w-14 h-14 text-xl font-bold border-2 rounded-xl transition-all duration-200 hover:border-purple-400 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-200 dark:focus:shadow-purple-800/50" 
                            style={{ direction: 'ltr' }}
                          />
                          <InputOTPSlot 
                            index={1} 
                            className="w-14 h-14 text-xl font-bold border-2 rounded-xl transition-all duration-200 hover:border-purple-400 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-200 dark:focus:shadow-purple-800/50" 
                            style={{ direction: 'ltr' }}
                          />
                          <InputOTPSlot 
                            index={2} 
                            className="w-14 h-14 text-xl font-bold border-2 rounded-xl transition-all duration-200 hover:border-purple-400 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-200 dark:focus:shadow-purple-800/50" 
                            style={{ direction: 'ltr' }}
                          />
                          <InputOTPSlot 
                            index={3} 
                            className="w-14 h-14 text-xl font-bold border-2 rounded-xl transition-all duration-200 hover:border-purple-400 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-200 dark:focus:shadow-purple-800/50" 
                            style={{ direction: 'ltr' }}
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    ادخل الكود المرسل إلى بريدك الإلكتروني
                  </p>
                </div>
              </div>

              {/* زر التحقق */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                size="lg"
                disabled={code.length !== 4}
              >
                <span className="flex items-center gap-2">
                  تحقق من الكود
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>

              {/* إعادة إرسال الكود */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
                  <p className="text-sm text-muted-foreground">
                    لم تستلم الكود؟
                  </p>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-medium rounded-lg px-6 py-2 transition-all duration-300"
                >
                  {isResending ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      جاري الإرسال...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      إعادة إرسال الكود
                    </span>
                  )}
                </Button>
              </div>

              {/* رابط العودة */}
              <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link 
                  to="/signup" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center justify-center gap-2 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                  العودة إلى التسجيل
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* مؤشر التقدم */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-1 bg-purple-500 rounded-full"></div>
            <div className="w-8 h-1 bg-purple-500 rounded-full"></div>
            <div className="w-8 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          </div>
          <p className="text-xs text-muted-foreground">الخطوة 2 من 3</p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;