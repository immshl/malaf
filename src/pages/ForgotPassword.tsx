import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();
  const { language, t } = useLanguage();

  const translations = {
    ar: {
      forgotPasswordTitle: "نسيت كلمة المرور؟",
      forgotPasswordDesc: "أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور",
      email: "البريد الإلكتروني",
      sendResetLink: "إرسال رابط إعادة التعيين",
      backToSignIn: "العودة لتسجيل الدخول",
      emailSentTitle: "تم إرسال الرابط!",
      emailSentDesc: "تحقق من بريدك الإلكتروني واتبع التعليمات لإعادة تعيين كلمة المرور",
      emailSentMessage: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
      checkEmail: "تحقق من صندوق الوارد وصندوق الرسائل غير المرغوب فيها",
      errorTitle: "خطأ في الإرسال",
      errorDesc: "حدث خطأ أثناء إرسال رابط إعادة التعيين",
      emailRequired: "يرجى إدخال البريد الإلكتروني",
      emailInvalid: "يرجى إدخال بريد إلكتروني صحيح"
    },
    en: {
      forgotPasswordTitle: "Forgot Password?",
      forgotPasswordDesc: "Enter your email address and we'll send you a link to reset your password",
      email: "Email",
      sendResetLink: "Send Reset Link",
      backToSignIn: "Back to Sign In",
      emailSentTitle: "Link Sent!",
      emailSentDesc: "Check your email and follow the instructions to reset your password",
      emailSentMessage: "Password reset link has been sent to your email",
      checkEmail: "Check your inbox and spam folder",
      errorTitle: "Send Error",
      errorDesc: "An error occurred while sending the reset link",
      emailRequired: "Please enter your email",
      emailInvalid: "Please enter a valid email"
    }
  };

  const currentTranslations = translations[language] || translations.ar;

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        variant: "destructive",
        title: currentTranslations.errorTitle,
        description: currentTranslations.emailRequired
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast({
        variant: "destructive",
        title: currentTranslations.errorTitle,
        description: currentTranslations.emailInvalid
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/signin?reset=true`,
      });

      if (error) {
        console.error('Password reset error:', error);
        toast({
          variant: "destructive",
          title: currentTranslations.errorTitle,
          description: currentTranslations.errorDesc
        });
        return;
      }

      setEmailSent(true);
      toast({
        title: currentTranslations.emailSentTitle,
        description: currentTranslations.emailSentMessage
      });

    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        variant: "destructive",
        title: currentTranslations.errorTitle,
        description: currentTranslations.errorDesc
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                {currentTranslations.emailSentTitle}
              </CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                {currentTranslations.emailSentDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      {email}
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      {currentTranslations.checkEmail}
                    </p>
                  </div>
                </div>
              </div>

              <Link to="/signin">
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {currentTranslations.backToSignIn}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-foreground">
              {currentTranslations.forgotPasswordTitle}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {currentTranslations.forgotPasswordDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  {currentTranslations.email}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.com"
                  className="h-12"
                  disabled={isLoading}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12" 
                variant="hero"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    جاري الإرسال...
                  </div>
                ) : (
                  currentTranslations.sendResetLink
                )}
              </Button>
            </form>

            <div className="text-center">
              <Link 
                to="/signin" 
                className="text-sm text-primary hover:text-primary-hover transition-smooth flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {currentTranslations.backToSignIn}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;