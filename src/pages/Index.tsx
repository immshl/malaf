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
    <div className="min-h-screen bg-background relative">
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
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-muted-foreground mb-4 font-medium animate-fade-in opacity-0 [animation-fill-mode:forwards]">
              لتمكين العمل الحر
            </p>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-slide-up opacity-0 [animation-fill-mode:forwards] stagger-1">
              <span className="text-gradient">
                ملف مهني خاص بك
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in opacity-0 [animation-fill-mode:forwards] stagger-2">
              منصة شاملة لبناء حضورك الرقمي وعرض خدماتك بطريقة احترافية
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up opacity-0 [animation-fill-mode:forwards] stagger-3">
              <Button 
                size="lg" 
                className="glass-button text-white text-lg px-8 py-4 rounded-full animate-glow"
                asChild
              >
                <Link to="/signup">
                  اصنع ملفك المهني
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 rounded-full border-2 glass-soft hover-lift"
                asChild
              >
                <Link to="/example">
                  شاهد نموذج
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              كل ما تحتاجه لبناء حضور رقمي فعال
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              حلول ذكية ومبتكرة تساعدك على التميز في سوق العمل الحر وجذب المزيد من الفرص.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-card border-0 group hover-lift animate-fade-in opacity-0 [animation-fill-mode:forwards] stagger-1">
              <CardContent className="p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="mb-6 flex justify-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-smooth animate-float">
                    <Link2 className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground relative z-10">واجهة مميزة</h3>
                <p className="text-muted-foreground leading-relaxed relative z-10">
                  اعرض خدماتك وبياناتك بطريقة منظمة لتبني ثقة مع العميل من اللحظة الأولى.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-0 group hover-lift animate-fade-in opacity-0 [animation-fill-mode:forwards] stagger-2">
              <CardContent className="p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="mb-6 flex justify-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-smooth animate-float stagger-2">
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground relative z-10">نظام حجز ذكي</h3>
                <p className="text-muted-foreground leading-relaxed relative z-10">
                  امنح عملاءك سهولة طلب المواعيد معك مباشرة، إدارة ذكية لجدولك مع إشعارات فورية لكل طلب جديد.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-0 group hover-lift animate-fade-in opacity-0 [animation-fill-mode:forwards] stagger-3">
              <CardContent className="p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="mb-6 flex justify-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-smooth animate-float stagger-3">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground relative z-10">عنوان رقمي مخصص</h3>
                <p className="text-muted-foreground leading-relaxed relative z-10">
                  احصل على رابط شخصي يعكس هويتك، سهل المشاركة، يُحفظ بسهولة، ويتيح الوصول إليك من أي مكان.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              كيف يعمل ملف؟
            </h2>
            <p className="text-lg text-muted-foreground">
              ثلاث خطوات بسيطة
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center animate-slide-up opacity-0 [animation-fill-mode:forwards] stagger-1">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center text-white text-2xl font-bold hover-scale animate-glow">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">أنشئ ملفك</h3>
              <p className="text-muted-foreground leading-relaxed">
                أدخل معلوماتك وخدماتك بخطوات بسيطة
              </p>
            </div>

            <div className="text-center animate-slide-up opacity-0 [animation-fill-mode:forwards] stagger-2">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center text-white text-2xl font-bold hover-scale animate-glow">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">شارك ملفك</h3>
              <p className="text-muted-foreground leading-relaxed">
                احصل على رابط شخصي لمشاركته مع العملاء
              </p>
            </div>

            <div className="text-center animate-slide-up opacity-0 [animation-fill-mode:forwards] stagger-3">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center text-white text-2xl font-bold hover-scale animate-glow">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">استقبل الطلبات</h3>
              <p className="text-muted-foreground leading-relaxed">
                اربط مع العملاء واستقبل طلبات المشاريع
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
        
        {/* Glass CTA Card */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto glass-card p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-6 animate-fade-in">
              ابدأ ملفك المميز
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up stagger-1">
              انضم إلى ملف واحصل على ظهور رقمي فعال يميزك في سوق العمل الحر
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up stagger-2">
              <Button 
                size="lg" 
                className="glass-button text-white text-lg px-12 py-4 rounded-full animate-glow" 
                asChild
              >
                <Link to="/signup">أنشئ ملفك الآن</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-12 py-4 rounded-full glass-soft hover-lift" 
                onClick={handleContactUs}
              >
                {language === "ar" ? "تواصل معنا" : "Contact Us"}
              </Button>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default Index;