import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users, Calendar, Link2, Star, Zap, Shield, Smartphone, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import AuthButton from "@/components/AuthButton";
import ScrollHero from "@/components/ScrollHero";

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

  const toggleMobileMenu = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsMobileMenuOpen(false);
  };

  const handleContactUs = () => {
    window.open('mailto:info@malaf.me?subject=استفسار عن منصة ملف', '_blank');
  };

  // Close mobile menu when clicking outside or pressing escape
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container') && !target.closest('[aria-expanded="true"]')) {
        closeMobileMenu();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleOutsideClick);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}
      
      <div className="relative z-50">
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
      <nav className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border/50 z-50">
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
                className="p-2 hover:bg-muted/50 transition-smooth relative z-50"
                aria-label="القائمة"
                aria-expanded={isMobileMenuOpen}
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
        <div className={`mobile-menu-container md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-background/98 backdrop-blur-md border-t border-border/50 shadow-xl ${
          isMobileMenuOpen ? 'max-h-96 opacity-100 visible' : 'max-h-0 opacity-0 invisible'
        }`}>
          <div className="px-4 py-6">
            <div className="flex flex-col space-y-4">
              <a 
                href="#features" 
                className="text-muted-foreground hover:text-foreground transition-all duration-300 py-3 px-4 text-lg font-medium rounded-lg hover:bg-muted/50 hover:transform hover:scale-105 active:scale-95"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>المميزات</span>
                </div>
              </a>
              <a 
                href="#how-it-works" 
                className="text-muted-foreground hover:text-foreground transition-all duration-300 py-3 px-4 text-lg font-medium rounded-lg hover:bg-muted/50 hover:transform hover:scale-105 active:scale-95"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>كيف يعمل</span>
                </div>
              </a>
              <Link 
                to="/signin" 
                className="text-muted-foreground hover:text-foreground transition-all duration-300 py-3 px-4 text-lg font-medium rounded-lg hover:bg-muted/50 hover:transform hover:scale-105 active:scale-95"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-primary/80 rounded-full"></div>
                  <span>تسجيل الدخول</span>
                </div>
              </Link>
              <div className="pt-4 border-t border-border/20">
                <Button 
                  variant="default" 
                  size="lg" 
                  className="w-full text-lg py-4 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
                  asChild
                >
                  <Link to="/signup" onClick={closeMobileMenu}>أنشئ ملفك</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Scroll Hero Section */}
      <ScrollHero />

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
            <Card className="border-0 shadow-soft hover:shadow-medium transition-smooth bg-card group">
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-smooth">
                    <Link2 className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">واجهة مميزة</h3>
                <p className="text-muted-foreground leading-relaxed">
                  اعرض خدماتك وبياناتك بطريقة منظمة لتبني ثقة مع العميل من اللحظة الأولى.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft hover:shadow-medium transition-smooth bg-card group">
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-smooth">
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">نظام حجز ذكي</h3>
                <p className="text-muted-foreground leading-relaxed">
                  امنح عملاءك سهولة طلب المواعيد معك مباشرة، إدارة ذكية لجدولك مع إشعارات فورية لكل طلب جديد.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft hover:shadow-medium transition-smooth bg-card group">
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-smooth">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">عنوان رقمي مخصص</h3>
                <p className="text-muted-foreground leading-relaxed">
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
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">أنشئ ملفك</h3>
              <p className="text-muted-foreground leading-relaxed">
                أدخل معلوماتك وخدماتك بخطوات بسيطة
              </p>
            </div>

            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">شارك ملفك</h3>
              <p className="text-muted-foreground leading-relaxed">
                احصل على رابط شخصي لمشاركته مع العملاء
              </p>
            </div>

            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
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
      <section className="py-20 relative overflow-hidden bg-muted/30">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            ابدأ ملفك المميز
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            انضم إلى ملف واحصل على ظهور رقمي فعال
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground text-lg px-12 py-4 rounded-full transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl" 
              asChild
            >
              <Link to="/signup">أنشئ ملفك الآن</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-12 py-4 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg" 
              onClick={handleContactUs}
            >
              {language === "ar" ? "تواصل معنا" : "Contact Us"}
            </Button>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default Index;