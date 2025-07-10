import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users, Calendar, Link2, Star, Zap, Shield, Smartphone, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import AuthButton from "@/components/AuthButton";
import FloatingControls from "@/components/FloatingControls";

const Index = () => {
  const { language, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const toggleMobileMenu = () => {
    console.log('Toggling mobile menu:', !isMobileMenuOpen);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    console.log('Closing mobile menu');
    setIsMobileMenuOpen(false);
  };

  const handleContactUs = () => {
    window.open('mailto:info@malaf.me?subject=استفسار عن منصة ملف', '_blank');
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const menuContainer = target.closest('.mobile-menu-container');
      const menuButton = target.closest('[data-mobile-menu-button]');
      
      if (isMobileMenuOpen && !menuContainer && !menuButton) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isMobileMenuOpen]);

  // Add smooth scrolling for anchor links
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: smooth;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-blue-50/50"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-float stagger-2"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-float stagger-3"></div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30 md:hidden"
          onClick={closeMobileMenu}
        />
      )}
      <div className="relative z-40">

      {/* Navigation */}
      <nav className="sticky top-0 glass-nav z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 space-x-reverse group">
              <div className="w-12 h-12 glass-soft rounded-2xl p-2 group-hover:scale-110 transition-all duration-300">
                <img 
                  src="/lovable-uploads/053ffcb6-5dac-4834-a5ef-585d29be4be9.png" 
                  alt="ملف" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-2xl text-foreground tracking-tight">Malaf</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 space-x-reverse">
              <a href="#features" className="glass-soft px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg">
                {t('featuresTitle')}
              </a>
              <a href="#how-it-works" className="glass-soft px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg">
                {t('howItWorksTitle')}
              </a>
              <div className="ml-4">
                <AuthButton />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleMobileMenu}
                data-mobile-menu-button="true"
                className="glass-soft p-3 hover:bg-white/10 transition-all duration-300 relative z-50 rounded-xl"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-foreground" />
                ) : (
                  <Menu className="w-6 h-6 text-foreground" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div 
          className={`mobile-menu-container md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMobileMenuOpen ? 'max-h-screen opacity-100 visible' : 'max-h-0 opacity-0 invisible'
          }`} 
          style={{ zIndex: 50 }}
        >
          <div className="px-4 py-6 glass-card border-t border-border/50 shadow-xl">
            <div className="flex flex-col space-y-6">
              {/* أولاً: أقسام المنصة */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4">أقسام المنصة</h3>
                <a 
                  href="#features" 
                  className="flex items-center space-x-4 space-x-reverse glass-soft p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
                  onClick={closeMobileMenu}
                >
                  <div className="w-3 h-3 bg-primary rounded-full group-hover:scale-125 transition-all"></div>
                  <span className="text-lg font-medium text-foreground">{t('featuresTitle')}</span>
                </a>
                <a 
                  href="#how-it-works" 
                  className="flex items-center space-x-4 space-x-reverse glass-soft p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
                  onClick={closeMobileMenu}
                >
                  <div className="w-3 h-3 bg-accent rounded-full group-hover:scale-125 transition-all"></div>
                  <span className="text-lg font-medium text-foreground">{t('howItWorksTitle')}</span>
                </a>
              </div>
              
              {/* ثانياً: أزرار تسجيل الدخول وإنشاء الحساب */}
              <div className="glass-soft p-6 rounded-2xl">
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground">
                    {language === "ar" ? "ابدأ رحلتك معنا" : "Start your journey with us"}
                  </p>
                </div>
                
                <AuthButton />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-2 h-2 bg-primary/30 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-3 h-3 bg-accent/40 rounded-full animate-float stagger-2"></div>
          <div className="absolute bottom-40 left-1/4 w-1 h-1 bg-primary/50 rounded-full animate-float stagger-3"></div>
          <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-accent/30 rounded-full animate-float stagger-4"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="glass-card p-12 md:p-16 rounded-3xl mb-8 animate-slide-in-glass">
              <p className="text-base text-muted-foreground mb-6 font-medium animate-slide-in-glass stagger-1">
                {t('heroSubtitle')}
              </p>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight animate-slide-in-glass stagger-2">
                <span className="text-gradient tracking-tight">
                  {t('heroTitle')}
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed animate-slide-in-glass stagger-3">
                {t('heroDescription')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-in-glass stagger-4">
                <Button 
                  size="lg" 
                  className="btn-3d text-white text-xl px-12 py-6 rounded-2xl font-semibold shadow-2xl hover:shadow-3xl"
                  asChild
                >
                  <Link to="/signup">
                    {t('createProfile')}
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="glass-soft text-xl px-12 py-6 rounded-2xl border-2 border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-300"
                  asChild
                >
                  <Link to="/example">
                    {t('viewExample')}
                  </Link>
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-8 animate-slide-in-glass stagger-5">
                {t('freePlatform')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="glass-card p-8 rounded-3xl inline-block mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
                {t('featuresTitle')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t('featuresSubtitle')}
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 md:p-10 text-center group hover-lift animate-slide-in-glass stagger-1 rounded-3xl">
              <div className="absolute inset-0 animate-shimmer-flow opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>
              <div className="mb-8 flex justify-center relative z-10">
                <div className="w-20 h-20 glass-soft rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 float-element">
                  <Link2 className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-6 text-foreground relative z-10">{t('feature1Title')}</h3>
              <p className="text-muted-foreground leading-relaxed relative z-10 text-lg">
                {t('feature1Desc')}
              </p>
            </div>

            <div className="glass-card p-8 md:p-10 text-center group hover-lift animate-slide-in-glass stagger-2 rounded-3xl">
              <div className="absolute inset-0 animate-shimmer-flow opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>
              <div className="mb-8 flex justify-center relative z-10">
                <div className="w-20 h-20 glass-soft rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 float-element stagger-2">
                  <Calendar className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-6 text-foreground relative z-10">{t('feature2Title')}</h3>
              <p className="text-muted-foreground leading-relaxed relative z-10 text-lg">
                {t('feature2Desc')}
              </p>
            </div>

            <div className="glass-card p-8 md:p-10 text-center group hover-lift animate-slide-in-glass stagger-3 rounded-3xl">
              <div className="absolute inset-0 animate-shimmer-flow opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>
              <div className="mb-8 flex justify-center relative z-10">
                <div className="w-20 h-20 glass-soft rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 float-element stagger-3">
                  <Users className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-6 text-foreground relative z-10">{t('feature3Title')}</h3>
              <p className="text-muted-foreground leading-relaxed relative z-10 text-lg">
                {t('feature3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="glass-card p-8 rounded-3xl inline-block">
              <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
                {t('howItWorksTitle')}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t('howItWorksSubtitle')}
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center animate-slide-in-glass stagger-1">
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 btn-3d rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
                  1
                </div>
              </div>
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4 text-foreground">{t('step1Title')}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {t('step1Desc')}
                </p>
              </div>
            </div>

            <div className="text-center animate-slide-in-glass stagger-2">
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 btn-3d rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
                  2
                </div>
              </div>
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4 text-foreground">{t('step2Title')}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {t('step2Desc')}
                </p>
              </div>
            </div>

            <div className="text-center animate-slide-in-glass stagger-3">
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 btn-3d rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
                  3
                </div>
              </div>
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4 text-foreground">{t('step3Title')}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {t('step3Desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
        
        {/* Glass CTA Card */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="glass-card p-12 md:p-20 text-center rounded-3xl shadow-2xl animate-slide-in-glass">
              <h2 className="text-4xl md:text-6xl font-bold text-gradient mb-8 animate-pulse-glow">
                {t('ctaTitle')}
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                {t('ctaSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="btn-3d text-white text-xl md:text-2xl px-12 md:px-16 py-6 rounded-2xl font-semibold shadow-2xl" 
                  asChild
                >
                  <Link to="/signup">{t('startNow')}</Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="glass-soft text-xl md:text-2xl px-12 md:px-16 py-6 rounded-2xl border-2 border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-300" 
                  onClick={handleContactUs}
                >
                  {t('contactUs')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
      
      {/* Floating Controls */}
      <FloatingControls />
    </div>
  );
};

export default Index;