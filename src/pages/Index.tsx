import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users, Calendar, Link2, Star, Zap, Shield, Smartphone, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import AuthButton from "@/components/AuthButton";

const Index = () => {
  const { language } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    console.log('Toggling mobile menu:', !isMobileMenuOpen);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleContactUs = () => {
    window.open('mailto:info@malaf.me?subject=استفسار عن منصة ملف', '_blank');
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
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

      {/* Navigation */}
      <nav className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border/50 z-40">
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
            <button 
              type="button"
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const newState = !isMobileMenuOpen;
                console.log("Button clicked! Changing from", isMobileMenuOpen, "to", newState);
                setIsMobileMenuOpen(newState);
              }}
              aria-label="فتح القائمة"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Content */}
            <div className="fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-50 border-b">
              <div className="p-6 space-y-4">
                {/* Navigation Links */}
                <div className="space-y-3">
                  <a 
                    href="#features" 
                    className="flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-lg font-medium">المميزات</span>
                  </a>
                  <a 
                    href="#how-it-works" 
                    className="flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-lg font-medium">كيف يعمل</span>
                  </a>
                </div>
                
                {/* Auth Buttons */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  <Link 
                    to="/signin" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block"
                  >
                    <button className="w-full py-3 px-4 text-lg font-medium text-purple-600 border-2 border-purple-500 rounded-full hover:bg-purple-500 hover:text-white transition-all duration-300">
                      تسجيل الدخول
                    </button>
                  </Link>
                  <Link 
                    to="/signup" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block"
                  >
                    <button className="w-full py-3 px-4 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full transition-all duration-300">
                      أنشئ ملفك المهني
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-muted-foreground mb-4 font-medium">
              لتمكين العمل الحر
            </p>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500">
                ملف مهني خاص بك
              </span>
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg px-8 py-4 rounded-full transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
                asChild
              >
                <Link to="/signup">
                  اصنع ملفك المهني
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 rounded-full border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg"
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
            <Card className="border-0 shadow-soft hover:shadow-medium transition-smooth bg-white group">
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-smooth">
                    <Link2 className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">واجهة مميزة</h3>
                <p className="text-muted-foreground leading-relaxed">
                  اعرض خدماتك وبياناتك بطريقة منظمة لتبني ثقة مع العميل من اللحظة الأولى.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft hover:shadow-medium transition-smooth bg-white group">
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-smooth">
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">نظام حجز ذكي</h3>
                <p className="text-muted-foreground leading-relaxed">
                  امنح عملاءك سهولة طلب المواعيد معك مباشرة، إدارة ذكية لجدولك مع إشعارات فورية لكل طلب جديد.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft hover:shadow-medium transition-smooth bg-white group">
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-smooth">
                    <Users className="w-8 h-8 text-green-600" />
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
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
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
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
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
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
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
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg px-12 py-4 rounded-full transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl" 
              asChild
            >
              <Link to="/signup">أنشئ ملفك الآن</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-12 py-4 rounded-full border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg" 
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