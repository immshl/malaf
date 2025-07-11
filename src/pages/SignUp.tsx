import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight, Check, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "@/hooks/use-toast";
import { Loading } from "@/components/ui/loading";

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const { t } = useLanguage();
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

  // Email domains for quick selection
  const emailDomains = ["@gmail.com", "@outlook.com", "@icloud.com"];

  // Password validation
  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password)
    };
  };

  // Username validation
  const validateUsername = (username: string) => {
    return {
      length: username.length >= 3 && username.length <= 20,
      format: /^[a-zA-Z0-9_]+$/.test(username),
      noSpaces: !/\s/.test(username)
    };
  };

  const passwordValidation = validatePassword(formData.password);
  const usernameValidation = validateUsername(formData.username);

  // Handle quick email domain selection
  const handleEmailDomainSelect = (domain: string) => {
    const currentEmail = formData.email;
    const atIndex = currentEmail.indexOf('@');
    const baseEmail = atIndex > -1 ? currentEmail.substring(0, atIndex) : currentEmail;
    setFormData({...formData, email: baseEmail + domain});
  };

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
            <CardTitle className="text-2xl font-bold text-foreground">{t('signUp')}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {t('signUpDesc')}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* اسم المستخدم */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground font-medium">
                  {t('username')}
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
                
                {/* شروط اسم المستخدم */}
                {formData.username && (
                  <div className="space-y-2 p-3 bg-muted/30 rounded-2xl border border-border/20">
                    <p className="text-sm font-medium text-foreground mb-2">شروط اسم المستخدم:</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        {usernameValidation.length ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        <span className={usernameValidation.length ? "text-green-600" : "text-red-600"}>
                          بين 3-20 حرف
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {usernameValidation.format ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        <span className={usernameValidation.format ? "text-green-600" : "text-red-600"}>
                          أحرف وأرقام و _ فقط
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {usernameValidation.noSpaces ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        <span className={usernameValidation.noSpaces ? "text-green-600" : "text-red-600"}>
                          بدون مسافات
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* الاسم الكامل */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground font-medium">
                  {t('fullName')}
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
                  {t('email')}
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
                
                {/* المربعات السريعة للبريد الإلكتروني */}
                <div className="grid grid-cols-3 gap-2">
                  {emailDomains.map((domain) => (
                    <Button
                      key={domain}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleEmailDomainSelect(domain)}
                      className="text-xs px-3 py-2 rounded-xl bg-background/60 hover:bg-background/80 border border-border/30 hover:border-border/60 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {domain}
                    </Button>
                  ))}
                </div>
              </div>

              {/* كلمة المرور */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">
                  {t('password')}
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
                
                {/* شروط كلمة المرور */}
                {formData.password && (
                  <div className="space-y-2 p-3 bg-muted/30 rounded-2xl border border-border/20">
                    <p className="text-sm font-medium text-foreground mb-2">شروط كلمة المرور:</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        {passwordValidation.length ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        <span className={passwordValidation.length ? "text-green-600" : "text-red-600"}>
                          8 أحرف على الأقل
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {passwordValidation.uppercase ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        <span className={passwordValidation.uppercase ? "text-green-600" : "text-red-600"}>
                          حرف كبير واحد على الأقل
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {passwordValidation.lowercase ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        <span className={passwordValidation.lowercase ? "text-green-600" : "text-red-600"}>
                          حرف صغير واحد على الأقل
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {passwordValidation.number ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        <span className={passwordValidation.number ? "text-green-600" : "text-red-600"}>
                          رقم واحد على الأقل
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* تأكيد كلمة المرور */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                  {t('confirmPassword')}
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
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loading variant="spinner" size="sm" />
                    {t('loading')}...
                  </div>
                ) : (
                  <>
                    {t('signUp')}
                    <ArrowRight className="mr-2 h-5 w-5" />
                  </>
                )}
              </Button>

              {/* رابط تسجيل الدخول */}
              <div className="text-center">
                <span className="text-muted-foreground">{t('haveAccount')} </span>
                <Link 
                  to="/signin" 
                  className="text-primary hover:text-primary-hover font-medium transition-smooth"
                >
                  {t('signInToAccount')}
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