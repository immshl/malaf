import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users, Calendar, Link2, Star, Zap, Shield, Smartphone, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import AuthButton from "@/components/AuthButton";

const Index = () => {
  const { language } = useLanguage();
  const [showWelcome, setShowWelcome] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Show welcome animation only on first visit
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem('hasVisited', 'true');
      
      // Hide welcome animation after 2 seconds
      setTimeout(() => {
        setShowWelcome(false);
      }, 2000);
    }
  }, []);

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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating Glass Particles Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="floating-particle w-3 h-3 top-20 left-10 animate-float"></div>
        <div className="floating-particle w-2 h-2 top-40 right-20 animate-float-reverse"></div>
        <div className="floating-particle w-4 h-4 bottom-40 left-1/4 animate-float stagger-2"></div>
        <div className="floating-particle w-1 h-1 top-60 right-1/3 animate-float-reverse stagger-3"></div>
        <div className="floating-particle w-2 h-2 bottom-20 right-1/6 animate-float stagger-4"></div>
        <div className="floating-particle w-3 h-3 top-1/3 left-1/6 animate-float-reverse stagger-5"></div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={closeMobileMenu}
        />
      )}
      
      <div className="relative z-40">
      {/* Welcome Animation */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 bg-gradient-primary flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="w-24 h-24 flex items-center justify-center mb-6 mx-auto animate-scale-in">
              <img 
                src="/lovable-uploads/053ffcb6-5dac-4834-a5ef-585d29be4be9.png" 
                alt="ملف" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">مرحباً بك في ملف</h1>
            <p className="text-xl text-white/90">منصتك لبناء حضور رقمي متميز</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sticky top-0 glass-nav z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-10 h-10">
                <img 
                  src="/lovable-uploads/053ffcb6-5dac-4834-a5ef-585d29be4be9.png" 
                  alt="ملف" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-xl text-foreground">Malaf</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 space-x-reverse">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-smooth">
                المميزات
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-smooth">
                كيف يعمل
              </a>
              <AuthButton />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleMobileMenu}
                data-mobile-menu-button="true"
                className="p-2 hover:bg-muted/50 transition-smooth relative z-50"
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
          <div className="px-4 py-6 bg-background border-t border-border/50 shadow-xl">
            <div className="flex flex-col space-y-4">
              {/* أولاً: تسجيل الدخول بشكل بارز */}
              <div className="mb-4">
                <AuthButton />
              </div>
              
              {/* ثانياً: روابط التنقل */}
              <div className="border-t border-border/20 pt-4 space-y-2">
                <a 
                  href="#features" 
                  className="flex items-center space-x-3 space-x-reverse text-muted-foreground hover:text-foreground transition-all duration-300 py-3 px-4 text-lg font-medium rounded-lg hover:bg-muted/50 hover:transform hover:scale-105 active:scale-95"
                  onClick={closeMobileMenu}
                >
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>المميزات</span>
                </a>
                <a 
                  href="#how-it-works" 
                  className="flex items-center space-x-3 space-x-reverse text-muted-foreground hover:text-foreground transition-all duration-300 py-3 px-4 text-lg font-medium rounded-lg hover:bg-muted/50 hover:transform hover:scale-105 active:scale-95"
                  onClick={closeMobileMenu}
                >
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>كيف يعمل</span>
                </a>
              </div>
              
              {/* ثالثاً: زر إنشاء الملف */}
              <div className="pt-4 border-t border-border/20">
                <Button 
                  variant="glass" 
                  size="lg" 
                  className="w-full text-lg py-4 rounded-full glass-button animate-glow"
                  asChild
                >
                  <Link to="/signup" onClick={closeMobileMenu}>أنشئ ملفك الآن</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Enhanced Glassmorphism */}
      <section className="relative py-24 md:py-40 overflow-hidden">
        {/* Hero Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse-glow stagger-2"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Hero Glass Card */}
            <div className="glass-card p-12 md:p-16 animate-slide-in-glass">
              <p className="text-lg text-muted-foreground mb-6 font-medium animate-fade-in-up opacity-0 stagger-1">
                ✨ لتمكين العمل الحر والإبداع الرقمي
              </p>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight animate-fade-in-up opacity-0 stagger-2">
                <span className="text-gradient block mb-4">
                  ملف مهني
                </span>
                <span className="text-foreground/90 text-4xl md:text-5xl lg:text-6xl">
                  خاص بك
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up opacity-0 stagger-3">
                منصة شاملة لبناء حضورك الرقمي المتميز وعرض خدماتك بطريقة احترافية تلفت الأنظار
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up opacity-0 stagger-4">
                <Button 
                  size="lg" 
                  className="glass-button text-white text-xl px-10 py-5 rounded-full font-semibold shadow-2xl"
                  asChild
                >
                  <Link to="/signup">
                    🚀 اصنع ملفك المهني
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-xl px-10 py-5 rounded-full glass border-2 hover-lift font-semibold"
                  asChild
                >
                  <Link to="/example">
                    👁️ شاهد نموذج حي
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Glass Cards */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="glass-card p-8 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
                كل ما تحتاجه لبناء حضور رقمي فعال
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                حلول ذكية ومبتكرة تساعدك على التميز في سوق العمل الحر وجذب المزيد من الفرص بأسلوب احترافي.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="glass-card group hover-lift animate-slide-in-glass opacity-0 stagger-1">
              <div className="p-10 text-center relative overflow-hidden">
                <div className="shimmer-effect absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="mb-8 flex justify-center relative z-10">
                  <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 animate-pulse-glow">
                    <Link2 className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-6 text-gradient relative z-10">واجهة مميزة</h3>
                <p className="text-muted-foreground leading-relaxed text-lg relative z-10">
                  اعرض خدماتك وبياناتك بطريقة منظمة ومبتكرة لتبني ثقة قوية مع العميل من اللحظة الأولى.
                </p>
              </div>
            </div>

            <div className="glass-card group hover-lift animate-slide-in-glass opacity-0 stagger-2">
              <div className="p-10 text-center relative overflow-hidden">
                <div className="shimmer-effect absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="mb-8 flex justify-center relative z-10">
                  <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 animate-pulse-glow stagger-2">
                    <Calendar className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-6 text-gradient relative z-10">نظام حجز ذكي</h3>
                <p className="text-muted-foreground leading-relaxed text-lg relative z-10">
                  امنح عملاءك سهولة طلب المواعيد معك مباشرة، إدارة ذكية لجدولك مع إشعارات فورية لكل طلب جديد.
                </p>
              </div>
            </div>

            <div className="glass-card group hover-lift animate-slide-in-glass opacity-0 stagger-3">
              <div className="p-10 text-center relative overflow-hidden">
                <div className="shimmer-effect absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="mb-8 flex justify-center relative z-10">
                  <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 animate-pulse-glow stagger-3">
                    <Users className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-6 text-gradient relative z-10">عنوان رقمي مخصص</h3>
                <p className="text-muted-foreground leading-relaxed text-lg relative z-10">
                  احصل على رابط شخصي يعكس هويتك المهنية، سهل المشاركة، يُحفظ بسهولة، ويتيح الوصول إليك من أي مكان.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Glass Steps */}
      <section id="how-it-works" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="glass-card p-8 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
                كيف يعمل ملف؟
              </h2>
              <p className="text-xl text-muted-foreground">
                ثلاث خطوات بسيطة لإنشاء ملفك المهني المتميز
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="text-center glass-card p-8 hover-lift animate-slide-in-glass opacity-0 stagger-1">
              <div className="mb-8 flex justify-center">
                <div className="w-20 h-20 glass-button rounded-3xl flex items-center justify-center text-white text-3xl font-bold animate-pulse-glow">
                  1
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-6 text-gradient">أنشئ ملفك</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                أدخل معلوماتك وخدماتك بخطوات بسيطة وسهلة مع إرشادات واضحة
              </p>
            </div>

            <div className="text-center glass-card p-8 hover-lift animate-slide-in-glass opacity-0 stagger-2">
              <div className="mb-8 flex justify-center">
                <div className="w-20 h-20 glass-button rounded-3xl flex items-center justify-center text-white text-3xl font-bold animate-pulse-glow stagger-2">
                  2
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-6 text-gradient">شارك ملفك</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                احصل على رابط شخصي مميز لمشاركته مع العملاء والشركاء
              </p>
            </div>

            <div className="text-center glass-card p-8 hover-lift animate-slide-in-glass opacity-0 stagger-3">
              <div className="mb-8 flex justify-center">
                <div className="w-20 h-20 glass-button rounded-3xl flex items-center justify-center text-white text-3xl font-bold animate-pulse-glow stagger-3">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-6 text-gradient">استقبل الطلبات</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                اربط مع العملاء واستقبل طلبات المشاريع والتعاون المثمر
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Grand Glass Finale */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="glass-card p-16 text-center animate-slide-in-glass">
              <h2 className="text-5xl md:text-6xl font-bold text-gradient mb-8">
                ابدأ ملفك المميز
              </h2>
              <p className="text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                انضم إلى ملف واحصل على ظهور رقمي فعال يميزك في سوق العمل الحر ويفتح لك آفاق جديدة
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="glass-button text-white text-2xl px-16 py-6 rounded-full font-bold shadow-2xl" 
                  asChild
                >
                  <Link to="/signup">🎯 أنشئ ملفك الآن</Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-2xl px-16 py-6 rounded-full glass hover-lift font-bold border-2" 
                  onClick={handleContactUs}
                >
                  💬 {language === "ar" ? "تواصل معنا" : "Contact Us"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default Index;