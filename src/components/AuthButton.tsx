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
              className="w-full text-lg py-4 rounded-2xl border-2 border-green-500/30 text-green-600 hover:border-green-500 hover:bg-green-500 hover:text-white transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg backdrop-blur-sm flex items-center justify-center gap-3"
            >
              <User className="w-5 h-5" />
              {language === "ar" ? "ملفي الشخصي" : "My Profile"}
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => signOut()}
            className="w-full text-lg py-4 rounded-2xl border-2 border-red-500/30 text-red-600 hover:border-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg backdrop-blur-sm flex items-center justify-center gap-3"
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
            className="w-full text-lg py-4 rounded-2xl border-2 border-primary/30 text-primary hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg backdrop-blur-sm"
          >
            {language === "ar" ? "تسجيل الدخول" : "Sign In"}
          </Button>
        </Link>
        <Link to="/signup" className="w-full">
          <Button 
            size="lg" 
            className="w-full text-lg py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl shadow-lg"
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