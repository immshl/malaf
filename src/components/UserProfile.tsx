import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // دالة لتحديد التحية حسب توقيت السعودية
  const getGreeting = () => {
    const now = new Date();
    const saudiTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Riyadh"}));
    const hour = saudiTime.getHours();

    if (language === "ar") {
      // من 5 صباحاً إلى 12 ظهراً: صباح الخير
      if (hour >= 5 && hour < 12) {
        return "صباح الخير";
      }
      // باقي الأوقات: مساء الخير
      return "مساء الخير";
    } else {
      // للغة الإنجليزية
      if (hour >= 5 && hour < 12) {
        return "Good Morning";
      }
      return "Good Evening";
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        setProfile(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // تنفيذ الطلب مرة واحدة فقط عند تحميل المكون
    if (user && !profile) {
      fetchUserProfile();
    }
  }, [user, profile]);

  if (!user) {
    return null;
  }

  const initials = profile?.full_name 
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.charAt(0).toUpperCase() || 'U';

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      
      toast({
        title: language === "ar" ? "تم تسجيل الخروج بنجاح" : "Successfully signed out",
        description: language === "ar" ? "شكراً لزيارتك!" : "Thanks for visiting!",
      });
      
      navigate("/");
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: language === "ar" ? "خطأ في تسجيل الخروج" : "Sign out error",
        description: language === "ar" ? "حدث خطأ أثناء تسجيل الخروج" : "An error occurred while signing out",
      });
    }
  };

  const handleProfileView = () => {
    if (profile?.username) {
      navigate(`/${profile.username}`);
    } else {
      navigate("/create-profile");
    }
  };

  const displayName = profile?.full_name || (language === "ar" ? "مستخدم" : "User");

  return (
    <div className="flex flex-col items-center gap-3 animate-fade-in">
      <div className="flex flex-col items-center gap-2">
        <div className="relative h-16 w-16">
          {/* Skeleton أثناء التحميل */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted/50 rounded-full animate-pulse border-2 border-muted-foreground/20" />
          )}
          <Avatar className={`h-16 w-16 border-2 border-muted-foreground/20 transition-all duration-200 ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}>
            <AvatarImage 
              src={profile?.avatar_url || ''} 
              alt={profile?.full_name || user.email || 'User'}
              loading="eager"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex items-center gap-2 text-center">
          <span className="text-base font-medium text-foreground">
            {getGreeting()}
          </span>
          <span className="text-base text-muted-foreground">
            {displayName}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col gap-2 w-full max-w-xs pb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleProfileView}
          className="w-full transition-all duration-150 hover:scale-[1.02] py-3"
        >
          {language === "ar" ? "الملف الشخصي" : "Profile"}
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={handleSignOut}
          className="w-full transition-all duration-150 hover:scale-[1.02] py-3"
        >
          {language === "ar" ? "تسجيل الخروج" : "Sign Out"}
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;