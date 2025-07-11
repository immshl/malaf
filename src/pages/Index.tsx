import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users, Calendar, Link2, Star, Zap, Shield, Smartphone, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import AuthButton from "@/components/AuthButton";

const Index = () => {
  const { language, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Initialize scroll animations
  useScrollAnimation();

  // Simple carousel state
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    {
      number: 1,
      title: language === "ar" ? "أنشئ ملفك" : "Create Your Profile",
      description: language === "ar" ? "أدخل معلوماتك وخدماتك بخطوات بسيطة" : "Enter your information and services in simple steps"
    },
    {
      number: 2,
      title: language === "ar" ? "شارك ملفك" : "Share Your Profile", 
      description: language === "ar" ? "احصل على رابط شخصي لمشاركته مع العملاء" : "Get a personal link to share with clients"
    },
    {
      number: 3,
      title: language === "ar" ? "استقبل الطلبات" : "Receive Requests",
      description: language === "ar" ? "اربط مع العملاء واستقبل طلبات المشاريع" : "Connect with clients and receive project requests"
    }
  ];

  // Auto-advance steps
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [steps.length]);

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
      <nav className="sticky top-0 glass border-b border-border/20 z-40">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-24 py-2">
            {/* Logo */}
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-8 h-8">
                {/* Logo for light mode (black) */}
                <img 
                  src="/lovable-uploads/be1d2269-8206-422b-a395-e4fb9e1a88cc.png" 
                  alt="ملف" 
                  className="w-full h-full object-contain dark:hidden"
                />
                {/* Logo for dark mode (white) */}
                <img 
                  src="/lovable-uploads/822b255a-0cfa-4520-b9a5-aa69e7ef91e6.png" 
                  alt="ملف" 
                  className="w-full h-full object-contain hidden dark:block"
                />
              </div>
              <span className="font-bold text-lg text-foreground">
                {language === "ar" ? "ملف" : "malaf"}
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-10 space-x-reverse">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-smooth font-medium text-sm tracking-wide">
                {language === "ar" ? "المميزات" : "Features"}
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-smooth font-medium text-sm tracking-wide">
                {language === "ar" ? "كيف يعمل" : "How It Works"}
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
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-fade-in"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Content */}
            <div className="fixed top-18 left-0 right-0 z-50 animate-slide-down">
              <div className="mx-6 mt-4 glass rounded-2xl shadow-elegant border border-border/20 overflow-hidden">
                <div className="p-8 space-y-6">
                  {/* Navigation Links */}
                  <div className="space-y-2">
                    <a 
                      href="#features" 
                      className="flex items-center gap-4 p-4 text-foreground hover:text-primary hover:bg-muted/50 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-sm"></div>
                      <span className="text-lg font-medium">{language === "ar" ? "المميزات" : "Features"}</span>
                    </a>
                    <a 
                      href="#how-it-works" 
                      className="flex items-center gap-4 p-4 text-foreground hover:text-primary hover:bg-muted/50 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-sm"></div>
                      <span className="text-lg font-medium">{language === "ar" ? "كيف يعمل" : "How It Works"}</span>
                    </a>
                  </div>
                  
                  {/* Auth Section */}
                  <div className="pt-6 border-t border-border space-y-8">
                    <AuthButton isMobile={true} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 md:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-accent opacity-5"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-muted-foreground mb-12 font-medium tracking-wide uppercase scroll-animate px-3 py-1 rounded-full border border-muted-foreground/30 inline-block shadow-sm animate-pulse">
              {language === "ar" ? "لتمكين العمل الحر" : "Empowering Freelancers"} ✨
            </p>
            
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1] tracking-tight scroll-animate">
              <span className="text-foreground">
                {language === "ar" ? "ملف مهني خاص بك" : "Your Professional Profile"}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed font-light scroll-animate">
              {language === "ar" ? "اصنع هويتك الرقمية واجذب العملاء المناسبين. عرض خدماتك، تلقي طلبات المشاريع، وإدارة عملك بسهولة — كل ذلك برابط واحد مميز" : "Create your digital identity and attract the right clients. Showcase your services, receive project requests, and manage your work easily — all with one distinctive link"}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center scroll-animate">
              <Button 
                size="lg" 
                variant="hero"
                className="text-lg px-10 py-4 font-semibold"
                asChild
              >
                <Link to="/signup">
                  {language === "ar" ? "اصنع ملفك المهني 🚀" : "Create Your Profile 🚀"}
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-10 py-4 font-medium"
                asChild
              >
                <Link to="/immshl">
                  {language === "ar" ? "شاهد نموذج للملف 👀" : "View Example 👀"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 scroll-animate">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              {language === "ar" ? "كل ما تحتاجه لبناء حضور رقمي فعال" : "Everything You Need for Effective Digital Presence"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              {language === "ar" ? "حلول ذكية ومبتكرة تساعدك على التميز في سوق العمل الحر وجذب المزيد من الفرص" : "Smart and innovative solutions that help you stand out in the freelance market and attract more opportunities"}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <Card className="border-0 shadow-soft hover:shadow-medium transition-smooth glass group hover-lift scroll-animate-left">
              <CardContent className="p-10 text-center">
                <div className="mb-8 flex justify-center">
                  <div className="w-20 h-20 bg-muted/50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-spring">
                    <Users className="w-10 h-10 text-foreground" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-card-foreground tracking-tight">
                  {language === "ar" ? "واجهة مميزة" : "Professional Interface"}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg font-light">
                  {language === "ar" ? "اعرض خدماتك وبياناتك بطريقة منظمة لتبني ثقة مع العميل من اللحظة الأولى" : "Showcase your services and data in an organized way to build trust with clients from the first moment"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft hover:shadow-medium transition-smooth glass group hover-lift scroll-animate-scale">
              <CardContent className="p-10 text-center">
                <div className="mb-8 flex justify-center">
                  <div className="w-20 h-20 bg-muted/50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-spring">
                    <Calendar className="w-10 h-10 text-foreground" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-card-foreground tracking-tight">
                  {language === "ar" ? "نظام حجز ذكي" : "Smart Booking System"}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg font-light">
                  {language === "ar" ? "امنح عملاءك سهولة طلب المواعيد معك مباشرة، إدارة ذكية لجدولك مع إشعارات فورية لكل طلب جديد" : "Allow your clients to easily book appointments with you directly, smart management for your schedule with instant notifications for every new request"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft hover:shadow-medium transition-smooth glass group hover-lift scroll-animate-right">
              <CardContent className="p-10 text-center">
                <div className="mb-8 flex justify-center">
                  <div className="w-20 h-20 bg-muted/50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-spring">
                    <Link2 className="w-10 h-10 text-foreground" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-card-foreground tracking-tight">
                  {language === "ar" ? "عنوان رقمي مخصص" : "Custom Digital Address"}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg font-light">
                  {language === "ar" ? "احصل على رابط شخصي يعكس هويتك، سهل المشاركة، يُحفظ بسهولة، ويتيح الوصول إليك من أي مكان" : "Get a personal link that reflects your identity, easy to share, easy to remember, and allows access to you from anywhere"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 scroll-animate">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              {language === "ar" ? "كيف يعمل ملف؟" : "How Does Malaf Work?"}
            </h2>
            <p className="text-xl text-muted-foreground font-light">
              {language === "ar" ? "ثلاث خطوات بسيطة" : "Three Simple Steps"}
            </p>
          </div>
          
          {/* Simple Carousel */}
          <div className="relative max-w-2xl mx-auto">
            {/* Current Step Display */}
            <div className="glass rounded-3xl p-8 shadow-elegant hover:shadow-strong transition-smooth text-center border border-border/20 backdrop-blur-md">
              <div className="mb-8 flex justify-center">
                <div className="w-20 h-20 bg-foreground rounded-2xl flex items-center justify-center text-background text-3xl font-bold shadow-medium">
                  {steps[currentStep].number}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-6 text-foreground tracking-tight">
                {steps[currentStep].title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg font-light">
                {steps[currentStep].description}
              </p>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-8 gap-4">
              {steps.map((_, index) => (
                <button
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-500 ${
                    index === currentStep 
                      ? 'bg-blue-500 scale-125 shadow-lg ring-2 ring-blue-500/30' 
                      : 'bg-gray-400 hover:bg-gray-500 hover:scale-110'
                  }`}
                  onClick={() => setCurrentStep(index)}
                  aria-label={`انتقل إلى الخطوة ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden bg-muted/20">
        <div className="container mx-auto px-6 text-center relative z-10 scroll-animate">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 tracking-tight">
            {language === "ar" ? "ابدأ ملفك المميز" : "Start Your Distinguished Profile"}
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            {language === "ar" ? "انضم إلى ملف واحصل على ظهور رقمي فعال" : "Join Malaf and get an effective digital presence"}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-12 py-4 font-semibold bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              asChild
            >
              <Link to="/signup">{language === "ar" ? "أنشئ ملفك الآن" : "Create Your Profile Now"}</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-12 py-4 font-medium"
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