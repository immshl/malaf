import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users, Calendar, Link2, Star, Zap, Shield, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import profileMockup from "@/assets/profile-mockup.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b glass-soft sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ملف</span>
            </div>
            <span className="text-xl font-bold text-foreground">malaf</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-smooth">المميزات</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-smooth">كيف يعمل</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/signin">تسجيل الدخول</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/signup">إنشاء ملف مجاني</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-right">
              <p className="text-lg text-muted-foreground mb-4">لتمكين العمل الحر</p>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-primary">ملف مهني خاص بك</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                أنشئ صفحة تعريفية احترافية تجمع كل روابطك وخدماتك في مكان واحد. 
                اسمح لعملائك بحجز اجتماع معك بسهولة وسرعة.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
                <Button size="lg" variant="hero" className="text-lg px-8 py-4" asChild>
                  <Link to="/signup">أنشئ ملفك المهني</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4" asChild>
                  <Link to="/example">شاهد نموذج</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                مجاني تماماً • لا حاجة لبطاقة ائتمانية
              </p>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-strong">
                <img 
                  src={heroImage} 
                  alt="منصة ملف للمحترفين المستقلين" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-secondary rounded-full opacity-60"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-primary rounded-full opacity-40"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              كل ما تحتاجه لبناء حضور رقمي فعّال
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              منصة شاملة تمكنك من إنشاء حضور رقمي قوي وجذب المزيد من العملاء
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8 text-primary" />,
                title: "واجهة احترافية منظمة",
                description: "قوالب أنيقة ومتجاوبة تعكس مهنيتك وخبرتك"
              },
              {
                icon: <Calendar className="w-8 h-8 text-primary" />,
                title: "نظام حجز ذكي",
                description: "اسمح لعملائك بحجز اجتماع معك مباشرة من ملفك الشخصي"
              },
              {
                icon: <Link2 className="w-8 h-8 text-primary" />,
                title: "رابط رقمي مخصص",
                description: "احصل على رابط شخصي مميز يمكنك مشاركته بسهولة"
              },
              {
                icon: <Zap className="w-8 h-8 text-primary" />,
                title: "سرعة في التحميل",
                description: "صفحات فائقة السرعة تضمن تجربة ممتازة لزوارك"
              },
              {
                icon: <Smartphone className="w-8 h-8 text-primary" />,
                title: "متوافق مع الجوال",
                description: "تصميم متجاوب يعمل بسلاسة على جميع الأجهزة"
              },
              {
                icon: <Shield className="w-8 h-8 text-primary" />,
                title: "أمان وخصوصية",
                description: "بياناتك آمنة ومحمية بأعلى معايير الأمان"
              }
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-soft hover:shadow-medium transition-smooth bg-white">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center opacity-10">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Profile Preview Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src={profileMockup} 
                alt="معاينة الملف الشخصي" 
                className="w-full max-w-md mx-auto rounded-2xl shadow-strong"
              />
            </div>
            <div className="text-center lg:text-right">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                ملف شخصي يعكس
                <span className="block text-transparent bg-clip-text bg-gradient-primary">احترافيتك</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                اعرض خدماتك ومهاراتك بطريقة جذابة ومنظمة. أضف روابط حساباتك الاجتماعية 
                ونماذج من أعمالك السابقة. اجعل من السهل على العملاء التواصل معك وحجز استشارة.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "إضافة صورة شخصية احترافية",
                  "عرض خدماتك وأسعارها",
                  "ربط حساباتك الاجتماعية",
                  "نماذج من أعمالك السابقة",
                  "معلومات التواصل وحجز المواعيد"
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-center lg:justify-end space-x-reverse space-x-3">
                    <Star className="w-5 h-5 text-primary fill-current" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <Button variant="hero" size="lg" className="px-8" asChild>
                <Link to="/signup">ابدأ إنشاء ملفك</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              كيف يعمل ملف؟
            </h2>
            <p className="text-xl text-muted-foreground">
              ثلاث خطوات بسيطة لإنشاء ملفك المهني
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "أنشئ ملفك",
                description: "سجل بياناتك الأساسية وأنشئ ملفك المهني في دقائق معدودة"
              },
              {
                step: "2", 
                title: "شارك ملفك",
                description: "احصل على رابطك الخاص وشاركه مع عملائك وجمهورك"
              },
              {
                step: "3",
                title: "استقبل الطلبات",
                description: "ابدأ في استقبال طلبات العمل والاجتماعات من عملائك الجدد"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            ابدأ ملفك المميز
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف المحترفين المستقلين الذين يستخدمون ملف لتنمية أعمالهم
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="hero" className="text-lg px-12 py-4" asChild>
              <Link to="/signup">أنشئ ملفك الآن</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-12 py-4">
              تواصل معنا
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ملف</span>
                </div>
                <span className="text-xl font-bold">malaf</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                منصة احترافية للفريلانسرز لإنشاء ملف تعريفي رقمي وإدارة علاقاتهم مع العملاء.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">المنتج</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-smooth">المميزات</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-smooth">كيف يعمل</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">الدعم</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-smooth">مركز المساعدة</a></li>
                <li><a href="#" className="hover:text-white transition-smooth">تواصل معنا</a></li>
                <li><a href="#" className="hover:text-white transition-smooth">الحالة</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">الشركة</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-smooth">من نحن</a></li>
                <li><a href="#" className="hover:text-white transition-smooth">الخصوصية</a></li>
                <li><a href="#" className="hover:text-white transition-smooth">الشروط</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ملف. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;