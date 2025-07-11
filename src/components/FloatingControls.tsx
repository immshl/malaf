import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Moon, Sun } from "lucide-react";
import { useLanguage, type Language } from "@/hooks/useLanguage";
import { useLocation } from "react-router-dom";

type Theme = "light" | "dark";

const FloatingControls = () => {
  const [theme, setTheme] = useState<Theme>("light");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { language, setLanguage } = useLanguage();
  const location = useLocation();

  // Check if we're on a freelancer profile page (not main app pages)
  const isFreelancerPage = location.pathname !== "/" && 
                          location.pathname !== "/signup" && 
                          location.pathname !== "/signin" && 
                          location.pathname !== "/verify-email" && 
                          location.pathname !== "/create-profile" &&
                          !location.pathname.startsWith("/profile/");

  useEffect(() => {
    // Check for saved theme or default to light
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document and save to localStorage
    localStorage.setItem('theme', theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    console.log("Theme changed to:", theme);
  }, [theme]);

  const handleTransition = (callback: () => void) => {
    setIsTransitioning(true);
    
    // Create transition overlay
    const overlay = document.createElement("div");
    overlay.className = "screen-transition active";
    document.body.appendChild(overlay);
    
    // Wait for transition animation
    setTimeout(() => {
      callback();
      
      // Remove overlay after change
      setTimeout(() => {
        overlay.classList.remove("active");
        setTimeout(() => {
          document.body.removeChild(overlay);
          setIsTransitioning(false);
        }, 300);
      }, 100);
    }, 300);
  };

  const toggleTheme = () => {
    handleTransition(() => {
      setTheme(prev => prev === "light" ? "dark" : "light");
    });
  };

  const toggleLanguage = () => {
    handleTransition(() => {
      setLanguage(language === "ar" ? "en" : "ar");
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-background/10 backdrop-blur-md rounded-xl p-2 shadow-md border border-border/10 transition-opacity duration-300 hover:bg-background/20">
        <div className="flex flex-col gap-2">
          {/* Language Toggle - Hide on freelancer profile pages */}
          {!isFreelancerPage && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleLanguage}
              disabled={isTransitioning}
              className="bg-background/10 hover:bg-background/20 backdrop-blur-sm w-10 h-10 rounded-lg border border-border/20 shadow-sm hover:scale-105 transition-all duration-300"
              title={language === "ar" ? "Switch to English" : "التبديل للعربية"}
            >
              <Globe className="h-4 w-4" />
            </Button>
          )}

          {/* Theme Toggle - Always show with attractive animation */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            disabled={isTransitioning}
            className="bg-background/10 hover:bg-background/20 backdrop-blur-sm w-10 h-10 rounded-lg border border-border/20 shadow-sm hover:scale-105 transition-all duration-300 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/5 before:to-transparent before:translate-x-[-100%] before:animate-[shimmer_4s_ease-in-out_infinite] before:rounded-lg"
            title={theme === "light" ? "الوضع الداكن" : "الوضع الفاتح"}
          >
          {theme === "light" ? (
            <Moon className="h-4 w-4 animate-[glow_4s_ease-in-out_infinite_alternate]" />
          ) : (
            <Sun className="h-4 w-4 animate-[rotate_12s_ease-in-out_infinite] text-yellow-500" />
          )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FloatingControls;