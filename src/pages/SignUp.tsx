import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("كلمتا المرور غير متطابقتان");
      return;
    }
    
    // مؤقت - سيتم ربطه بـ Supabase لاحقاً
    console.log("تسجيل حساب جديد:", { email, password });
    
    // الانتقال إلى صفحة التحقق
    navigate("/verify-email");
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
            <CardTitle className="text-2xl font-bold text-foreground">إنشاء حساب جديد</CardTitle>
            <CardDescription className="text-muted-foreground">
              أنشئ حسابك لتبدأ في بناء ملفك المهني
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
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>متطلبات كلمة المرور:</p>
                  <ul className="text-xs space-y-1 text-right">
                    <li className="flex items-center justify-end space-x-2 space-x-reverse">
                      <span>لا تقل عن 8 أحرف</span>
                      <div className={`w-2 h-2 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    </li>
                    <li className="flex items-center justify-end space-x-2 space-x-reverse">
                      <span>تحتوي على حرف كبير</span>
                      <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    </li>
                    <li className="flex items-center justify-end space-x-2 space-x-reverse">
                      <span>تحتوي على حرف صغير</span>
                      <div className={`w-2 h-2 rounded-full ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    </li>
                    <li className="flex items-center justify-end space-x-2 space-x-reverse">
                      <span>تحتوي على رقم</span>
                      <div className={`w-2 h-2 rounded-full ${/\d/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    </li>
                    <li className="flex items-center justify-end space-x-2 space-x-reverse">
                      <span>تحتوي على رمز خاص</span>
                      <div className={`w-2 h-2 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* تأكيد كلمة المرور */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                  تأكيد كلمة المرور
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="أعد كتابة كلمة المرور"
                    required
                    className="text-right pl-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* زر التسجيل */}
              <Button 
                type="submit" 
                className="w-full" 
                variant="hero"
                size="lg"
              >
                إنشاء حساب جديد
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>

              {/* رابط تسجيل الدخول */}
              <div className="text-center">
                <span className="text-muted-foreground">لديك حساب بالفعل؟ </span>
                <Link 
                  to="/signin" 
                  className="text-primary hover:text-primary-hover font-medium transition-smooth"
                >
                  سجل دخولك
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;