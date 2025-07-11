import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";

const AuthButton = ({ isMobile = false }: { isMobile?: boolean }) => {
  const { user, signOut, loading } = useAuth();
  const { language } = useLanguage();

  if (loading) {
    return <div className="w-20 h-9 bg-muted animate-pulse rounded-md"></div>;
  }

  if (user) {
    if (isMobile) {
      // عرض للموبايل (القائمة المنسدلة)
      return (
        <div className="flex flex-col gap-4 w-full">
          <Link to="/create-profile" className="w-full">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full text-lg py-4 modern-border hover:shadow-medium transition-smooth transform hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              <User className="w-5 h-5" />
              {language === "ar" ? "ملفي الشخصي" : "My Profile"}
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => signOut()}
            className="w-full text-lg py-4 modern-border text-destructive hover:bg-destructive hover:text-destructive-foreground transition-smooth transform hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            <LogOut className="w-5 h-5" />
            {language === "ar" ? "تسجيل الخروج" : "Sign Out"}
          </Button>
        </div>
      );
    } else {
      // عرض للديسكتوب
      return (
        <div className="flex items-center gap-2">
          <Link to="/create-profile">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {language === "ar" ? "الملف الشخصي" : "Profile"}
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => signOut()}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {language === "ar" ? "تسجيل الخروج" : "Sign Out"}
          </Button>
        </div>
      );
    }
  }

  if (isMobile) {
    // أزرار الموبايل للمستخدمين غير المسجلين
    return (
      <div className="flex flex-col gap-4 w-full">
        <Link to="/signin" className="w-full">
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full text-lg py-4 modern-border hover:bg-primary hover:text-primary-foreground transition-smooth transform hover:scale-[1.02]"
          >
            {language === "ar" ? "تسجيل الدخول" : "Sign In"}
          </Button>
        </Link>
        <Link to="/signup" className="w-full">
          <Button 
            size="lg" 
            variant="hero"
            className="w-full text-lg py-4 transition-smooth transform hover:scale-[1.02]"
          >
            {language === "ar" ? "أنشئ ملفك المهني" : "Create Your Profile"}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link to="/signin">
        <Button variant="ghost" size="sm">
          {language === "ar" ? "تسجيل الدخول" : "Sign In"}
        </Button>
      </Link>
      <Link to="/signup">
        <Button size="sm">
          {language === "ar" ? "إنشاء حساب" : "Sign Up"}
        </Button>
      </Link>
    </div>
  );
};

export default AuthButton;