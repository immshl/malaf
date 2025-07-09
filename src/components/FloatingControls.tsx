import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";
type Language = "ar" | "en";

const FloatingControls = () => {
  const [theme, setTheme] = useState<Theme>("light");
  const [language, setLanguage] = useState<Language>("ar");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Apply theme to document
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    // Apply language direction
    if (language === "ar") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    }
  }, [language]);

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
      setLanguage(prev => prev === "ar" ? "en" : "ar");
    });
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {/* Language Toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleLanguage}
        disabled={isTransitioning}
        className="glass w-12 h-12 rounded-full border-0 shadow-lg hover:scale-110 transition-all duration-300"
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
        className="glass w-12 h-12 rounded-full border-0 shadow-lg hover:scale-110 transition-all duration-300"
        title={theme === "light" ? "الوضع الداكن" : "الوضع الفاتح"}
      >
        {theme === "light" ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};

export default FloatingControls;