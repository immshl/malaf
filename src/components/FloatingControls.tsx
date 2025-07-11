import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Moon, Sun } from "lucide-react";
import { useLanguage, type Language } from "@/hooks/useLanguage";

type Theme = "light" | "dark";

const FloatingControls = () => {
  const [theme, setTheme] = useState<Theme>("light");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { language, setLanguage } = useLanguage();

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
      <div className="glass rounded-2xl p-3 shadow-elegant border border-border/20">
        <div className="flex flex-col gap-3">
          {/* Language Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleLanguage}
            disabled={isTransitioning}
            className="bg-background/20 hover:bg-background/40 backdrop-blur-sm w-12 h-12 rounded-full border border-border/30 shadow-md hover:scale-110 transition-all duration-300"
            title={language === "ar" ? "Switch to English" : "التبديل للعربية"}
          >
            <Globe className="h-5 w-5" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            disabled={isTransitioning}
            className="bg-background/20 hover:bg-background/40 backdrop-blur-sm w-12 h-12 rounded-full border border-border/30 shadow-md hover:scale-110 transition-all duration-300"
            title={theme === "light" ? "الوضع الداكن" : "الوضع الفاتح"}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FloatingControls;