import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users, Calendar, Link2, Star, Zap, Shield, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

const Index = () => {
  const { t } = useLanguage();
  const [showWelcome, setShowWelcome] = useState(false);

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

  const handleContactUs = () => {
    window.open('mailto:info@malaf.me?subject=استفسار عن منصة ملف', '_blank');
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Welcome Animation */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 bg-gradient-primary flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 mx-auto animate-scale-in">
              <span className="text-3xl font-bold text-primary">ملف</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">مرحباً بك في ملف</h1>
            <p className="text-xl text-white/90">منصتك لبناء حضور رقمي متميز</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border/50 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ملف</span>
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
              <Link to="/signin" className="text-muted-foreground hover:text-foreground transition-smooth">
                تسجيل الدخول
              </Link>
              <Button variant="default" size="sm" asChild>
                <Link to="/signup">أنشئ ملفك</Link>
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Button variant="outline" size="sm" asChild>
                <Link to="/signup">أنشئ ملفك</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-muted-foreground mb-4 font-medium">
              للمستقلين في كل مكان ✨
            </p>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-foreground">ملف </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500">
                مهني 
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-green-500 to-purple-600">
                خاص 
              </span>
              <span className="text-foreground">بك</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              اصنع هويتك الرقمية واجذب العملاء المناسبين، عرض خدماتك، تلقي طلبات المشاريع، 
              وإدارة عملك بسهولة — كل ذلك برابط واحد مميز.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gray-900 hover:bg-gray-800 text-white text-lg px-8 py-4 rounded-full"
                asChild
              >
                <Link to="/signup">
                  ❤️ ابدأ رحلتك الآن
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 rounded-full"
                asChild
              >
                <Link to="/example">
                  👀 شاهد نموذج
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
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-smooth">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">عنوان رقمي مخصص</h3>
                <p className="text-muted-foreground leading-relaxed">
                  احصل على رابط شخصي أنيق يعكس هويتك. 
                  سهل المشاركة، يحفظ بسهولة، ويمنح العملاء انطباعاً احترافياً.
                  <br />
                  <span className="text-primary font-medium">🌐 malaf.me/اسمك</span>
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
                  امنح عملائك سهولة طلب المواعيد مباشرة.
                  نظام ذكي لجدولة الموعيد يوفر وقتك ويحل مشكل التنسيق بين الطرفين.
                  <br />
                  <span className="text-primary font-medium">📅 طلب جديد</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft hover:shadow-medium transition-smooth bg-white group">
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-smooth">
                    <Link2 className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">واجهة مميزة وجذابة</h3>
                <p className="text-muted-foreground leading-relaxed">
                  اعرض خبراتك واحجياجات بطريقة جذابة ومنظمة
                  تلفت انتباه عميل وتبني الثقة من اللحظة الأولى.
                  <br />
                  <span className="text-primary font-medium">✨ الأول</span>
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
              خطوات بسيطة للحصول على ملفك المهني
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
              <h3 className="text-xl font-bold mb-4 text-foreground">شارك رابطك</h3>
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
            انضم لآلاف المستقلين الذين اختاروا ملف لبناء حضورهم الرقمي وجذب العملاء الذين يحتاجونهم.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gray-900 hover:bg-gray-800 text-white text-lg px-12 py-4 rounded-full" 
              asChild
            >
              <Link to="/signup">أنشئ ملفك الآن</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-12 py-4 rounded-full" 
              onClick={handleContactUs}
            >
              {t('contactUs')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;