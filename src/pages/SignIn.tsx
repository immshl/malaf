import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const SignIn = () => {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    navigate('/create-profile');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);

  try {
    const { error } = await signIn(formData.email, formData.password);

    if (error) {
      console.log('Login error:', error); // للتتبع
      
      let errorMessage = "حدث خطأ أثناء تسجيل الدخول";
      
      // تخصيص رسائل الخطأ حسب النوع
      if (error.message.includes("Invalid login credentials") || error.message.includes("invalid_credentials")) {
        errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "يجب تأكيد البريد الإلكتروني أولاً";
      } else if (error.message.includes("Too many requests")) {
        errorMessage = "تم تجاوز عدد المحاولات المسموح، حاول مرة أخرى لاحقاً";
      } else {
        errorMessage = `خطأ: ${error.message}`;
      }
      
      toast({
        variant: "destructive",
        title: "فشل تسجيل الدخول",
        description: errorMessage,
      });
      return;
    }
    
    // انتظار قصير للتأكد من تحديث حالة المستخدم
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check if user has a profile
    const { data: userSession } = await supabase.auth.getUser();
    if (userSession.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('user_id', userSession.user.id)
        .single();

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك مرة أخرى",
      });

      if (profile?.username) {
        // Navigate to their profile
        navigate(`/profile/${profile.username}`);
      } else {
        // Navigate to create profile
        navigate('/create-profile');
      }
    }
      
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ غير متوقع، حاول مرة أخرى",
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
            <div className="w-8 h-8 flex items-center justify-center">
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
                disabled={isLoading}
              >
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
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