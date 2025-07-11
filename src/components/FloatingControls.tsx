import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "@/components/ui/button";
import { Globe, Moon, Sun } from "lucide-react";
import { useLanguage, type Language } from "@/hooks/useLanguage";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
    
    // Create magical theme transition with Framer Motion
    const container = document.createElement("div");
    container.id = "theme-transition";
    document.body.appendChild(container);
    
    const isGoingDark = theme === "light";
    
    // Create the magic animation component
    const root = createRoot(container);
    root.render(
      <AnimatePresence>
        <ThemeTransition 
          isGoingDark={isGoingDark} 
          onComplete={() => {
            callback();
            setTimeout(() => {
              root.unmount();
              document.body.removeChild(container);
              setIsTransitioning(false);
            }, 500);
          }}
        />
      </AnimatePresence>
    );
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

// Magical theme transition component
const ThemeTransition = ({ isGoingDark, onComplete }: { isGoingDark: boolean; onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
    >
      {/* Magical particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            y: "100vh", 
            x: Math.random() * window.innerWidth,
            scale: 0,
            rotate: 0
          }}
          animate={{ 
            y: "-20vh", 
            scale: [0, 1, 0],
            rotate: 360,
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            delay: Math.random() * 0.5,
            ease: "easeOut"
          }}
          className={`absolute w-2 h-2 rounded-full ${
            isGoingDark 
              ? 'bg-white shadow-[0_0_10px_#ffffff]' 
              : 'bg-yellow-400 shadow-[0_0_15px_#ffd700]'
          }`}
        />
      ))}

      {/* Central magical element */}
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: [0, 1.5, 0], rotate: 180 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        {isGoingDark ? (
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 1.5, ease: "linear" }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 shadow-[0_0_30px_#3b82f6]"
          />
        ) : (
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 1.5, ease: "linear" }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-[0_0_30px_#ffd700]"
          />
        )}
      </motion.div>

      {/* Color wave */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: [0, 0.7, 0] }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className={`absolute bottom-0 left-0 w-full h-32 ${
          isGoingDark
            ? 'bg-gradient-to-t from-slate-900 via-blue-900 to-transparent'
            : 'bg-gradient-to-t from-yellow-200 via-orange-300 to-transparent'
        }`}
      />
    </motion.div>
  );
};

export default FloatingControls;