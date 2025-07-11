import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Moon, Sun } from "lucide-react";
import { useLanguage, type Language } from "@/hooks/useLanguage";
import { useLocation } from "react-router-dom";
import { useSpring, animated } from "react-spring";

type Theme = "light" | "dark";

const FloatingControls = () => {
  const [theme, setTheme] = useState<Theme>("light");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
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
  }, [theme]);

  // Auto-hide controls when interacting with forms
  useEffect(() => {
    const handleInteraction = (event: Event) => {
      const target = event.target as HTMLElement;
      
      // Check if clicked on input, button, or any interactive element
      if (target.matches('input, button, textarea, select, [contenteditable], a')) {
        setIsHidden(true);
        
        // Show again after 3 seconds of no interaction
        setTimeout(() => {
          setIsHidden(false);
        }, 3000);
      }
    };

    const handleFocus = () => {
      setIsHidden(true);
    };

    const handleBlur = () => {
      setTimeout(() => {
        setIsHidden(false);
      }, 2000);
    };

    // Add event listeners
    document.addEventListener('click', handleInteraction);
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  }, []);

  // Spring animation for sliding
  const slideAnimation = useSpring({
    transform: isHidden ? 'translateX(100px)' : 'translateX(0px)',
    opacity: isHidden ? 0.3 : 1,
    config: { tension: 200, friction: 25 }
  });

  const handleTransition = (callback: () => void) => {
    setIsTransitioning(true);
    
    // Add page transition animation
    document.documentElement.style.transition = 'all 0.3s ease-in-out';
    document.documentElement.style.filter = 'brightness(0.7)';
    
    setTimeout(() => {
      callback();
      setTimeout(() => {
        document.documentElement.style.filter = 'brightness(1)';
        setTimeout(() => {
          document.documentElement.style.transition = '';
          setIsTransitioning(false);
        }, 300);
      }, 50);
    }, 150);
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

          {/* Theme Toggle - Beautiful React Spring Animation */}
          <ThemeToggleButton 
            theme={theme}
            onClick={toggleTheme}
            disabled={isTransitioning}
          />
        </div>
      </div>
    </div>
  );
};

// Beautiful React Spring Theme Toggle
const ThemeToggleButton = ({ theme, onClick, disabled }: { 
  theme: "light" | "dark"; 
  onClick: () => void; 
  disabled: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Spring animation for rotation
  const springProps = useSpring({
    transform: theme === "dark" ? "rotate(180deg)" : "rotate(0deg)",
    config: { tension: 120, friction: 14 }
  });
  
  // Spring animation for scale on hover
  const hoverSpring = useSpring({
    transform: isHovered ? "scale(1.1)" : "scale(1)",
    config: { tension: 300, friction: 10 }
  });
  
  return (
    <animated.div style={hoverSpring}>
      <Button
        variant="outline"
        size="icon"
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-background/10 hover:bg-background/20 backdrop-blur-sm w-10 h-10 rounded-lg border border-border/20 shadow-sm transition-all duration-300"
        title={theme === "light" ? "الوضع الداكن" : "الوضع الفاتح"}
      >
        <animated.div style={springProps}>
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4 text-yellow-500" />
          )}
        </animated.div>
      </Button>
    </animated.div>
  );
};

export default FloatingControls;