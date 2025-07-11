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
        <div className="relative h-14 w-14">
          {/* Skeleton أثناء التحميل */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted/50 rounded-full animate-pulse border-2 border-muted-foreground/20" />
          )}
          <Avatar className={`h-14 w-14 border-2 border-muted-foreground/20 transition-all duration-200 ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}>
            <AvatarImage 
              src={profile?.avatar_url || ''} 
              alt={profile?.full_name || user.email || 'User'}
              loading="eager"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col items-center text-center">
          <span className="text-sm font-medium text-foreground">
            {language === "ar" ? "مرحباً" : "Welcome"}
          </span>
          <span className="text-sm text-muted-foreground">
            {displayName}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col gap-1.5 w-full max-w-xs">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleProfileView}
          className="w-full transition-all duration-150 hover:scale-[1.02]"
        >
          {language === "ar" ? "الملف الشخصي" : "Profile"}
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={handleSignOut}
          className="w-full transition-all duration-150 hover:scale-[1.02]"
        >
          {language === "ar" ? "تسجيل الخروج" : "Sign Out"}
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;