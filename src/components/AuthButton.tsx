import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";

const AuthButton = () => {
  const { user, signOut, loading } = useAuth();
  const { language } = useLanguage();

  if (loading) {
    return <div className="w-20 h-9 bg-muted animate-pulse rounded-md"></div>;
  }

  if (user) {
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

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
      <Link to="/signin" className="w-full sm:w-auto">
        <Button 
          variant="glass" 
          size="lg" 
          className="w-full sm:w-auto text-lg py-3 px-6 rounded-full glass-button"
        >
          {language === "ar" ? "تسجيل الدخول" : "Sign In"}
        </Button>
      </Link>
      <Link to="/signup" className="w-full sm:w-auto">
        <Button 
          size="lg" 
          className="w-full sm:w-auto text-lg py-3 px-6 rounded-full bg-primary hover:bg-primary-hover"
        >
          {language === "ar" ? "إنشاء حساب" : "Sign Up"}
        </Button>
      </Link>
    </div>
  );
};

export default AuthButton;