import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // مؤقت - سيتم ربطه بـ Supabase لاحقاً
    console.log("تسجيل دخول:", { email, password });
    
    // الانتقال لصفحة الملف الشخصي (محاكاة نجاح تسجيل الدخول)
    navigate("/profile/ahmed-salem");
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* شعار الموقع */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 space-x-reverse">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">ملف</span>
            </div>
            <span className="text-2xl font-bold text-foreground">malaf</span>
          </Link>
        </div>

        <Card className="shadow-strong border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">تسجيل الدخول</CardTitle>
            <CardDescription className="text-muted-foreground">
              ادخل إلى حسابك لإدارة ملفك المهني
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* البريد الإلكتروني */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="اكتب بريدك الإلكتروني"
                  required
                  className="text-right"
                />
              </div>

              {/* كلمة المرور */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="اكتب كلمة المرور"
                    required
                    className="text-right pl-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* رابط نسيان كلمة المرور */}
              <div className="text-left">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:text-primary-hover transition-smooth"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>

              {/* زر تسجيل الدخول */}
              <Button 
                type="submit" 
                className="w-full" 
                variant="hero"
                size="lg"
              >
                تسجيل الدخول
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>

              {/* رابط إنشاء حساب */}
              <div className="text-center">
                <span className="text-muted-foreground">لا تملك حساب؟ </span>
                <Link 
                  to="/signup" 
                  className="text-primary hover:text-primary-hover font-medium transition-smooth"
                >
                  أنشئ حساب جديد
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;