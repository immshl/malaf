import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowRight, Mail, RefreshCw } from "lucide-react";

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
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* شعار الموقع */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 space-x-reverse">
            <div className="w-10 h-10 flex items-center justify-center">
              <img 
                src="/lovable-uploads/053ffcb6-5dac-4834-a5ef-585d29be4be9.png" 
                alt="ملف" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-foreground">malaf</span>
          </Link>
        </div>

        <Card className="shadow-strong border-0">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">تحقق من بريدك الإلكتروني</CardTitle>
            <CardDescription className="text-muted-foreground">
              أرسلنا كود التحقق المكون من 4 أرقام إلى بريدك الإلكتروني
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* كود التحقق */}
              <div className="space-y-4">
                <div className="text-center">
                  <InputOTP
                    maxLength={4}
                    value={code}
                    onChange={(value) => setCode(value)}
                    className="justify-center"
                    dir="ltr"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                      <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                      <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                      <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                
                <p className="text-sm text-muted-foreground text-center">
                  ادخل الكود المرسل إلى بريدك الإلكتروني
                </p>
              </div>

              {/* زر التحقق */}
              <Button 
                type="submit" 
                className="w-full" 
                variant="hero"
                size="lg"
                disabled={code.length !== 4}
              >
                تحقق من الكود
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>

              {/* إعادة إرسال الكود */}
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  لم تستلم الكود؟
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="text-primary hover:text-primary-hover"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    "إعادة إرسال الكود"
                  )}
                </Button>
              </div>

              {/* رابط العودة */}
              <div className="text-center">
                <Link 
                  to="/signup" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
                >
                  العودة إلى التسجيل
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerification;