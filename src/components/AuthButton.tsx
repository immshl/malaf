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