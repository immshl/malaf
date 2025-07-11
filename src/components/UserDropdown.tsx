import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Edit, LogOut, ExternalLink } from "lucide-react";
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

const UserDropdown = () => {
  const { user, signOut } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
          return;
        }

        setProfile(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

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
      // If no username, go to create profile
      navigate("/create-profile");
    }
  };

  const handleEditProfile = () => {
    navigate("/create-profile");
  };

  if (!user || loading) {
    return null;
  }

  const initials = profile?.full_name 
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-muted/50">
          <Avatar className="h-10 w-10 border-2 border-muted-foreground/20 hover:border-primary/50 transition-colors">
            <AvatarImage 
              src={profile?.avatar_url || ''} 
              alt={profile?.full_name || user.email || 'User'} 
            />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-56 bg-background border border-border shadow-strong z-50" 
        align="end" 
        forceMount
        side="bottom"
        sideOffset={8}
        style={{ 
          backgroundColor: 'hsl(var(--background))',
          backdropFilter: 'blur(8px)',
          zIndex: 9999 
        }}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.full_name || language === "ar" ? "مستخدم" : "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleProfileView}
          className="cursor-pointer focus:bg-muted hover:bg-muted transition-colors"
        >
          <User className="mr-2 h-4 w-4" />
          <span>{language === "ar" ? "الملف الشخصي" : "View Profile"}</span>
          <ExternalLink className="mr-auto h-3 w-3" />
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleEditProfile}
          className="cursor-pointer focus:bg-muted hover:bg-muted transition-colors"
        >
          <Edit className="mr-2 h-4 w-4" />
          <span>{language === "ar" ? "تحرير الملف" : "Edit Profile"}</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/20 hover:bg-destructive/20 transition-colors"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{language === "ar" ? "تسجيل خروج" : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;