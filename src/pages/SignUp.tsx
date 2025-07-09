import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "خطأ في كلمة المرور",
        description: "كلمتا المرور غير متطابقتان",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(formData.email, formData.password, {
        username: formData.username,
        full_name: formData.fullName
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "خطأ في إنشاء الحساب",
          description: error.message,
        });
        return;
      }
      
      // Success toast
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "يرجى التحقق من بريدك الإلكتروني",
      });

      // Navigate to email verification
      navigate("/verify-email");
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في إنشاء الحساب",
        description: "حدث خطأ أثناء إنشاء الحساب",
      });
    } finally {
      setIsLoading(false);
    }
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
            <CardTitle className="text-2xl font-bold text-foreground">إنشاء حساب جديد</CardTitle>
            <CardDescription className="text-muted-foreground">
              أنشئ حسابك لتبدأ في بناء ملفك المهني
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* اسم المستخدم */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground font-medium">
                  اسم المستخدم
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="اكتب اسم المستخدم"
                  required
                  className="text-right"
                />
              </div>

              {/* الاسم الكامل */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground font-medium">
                  الاسم الكامل
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  placeholder="اكتب اسمك الكامل"
                  required
                  className="text-right"
                />
              </div>

              {/* البريد الإلكتروني */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
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

              {/* تأكيد كلمة المرور */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                  تأكيد كلمة المرور
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
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
                disabled={isLoading}
              >
                {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب جديد"}
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