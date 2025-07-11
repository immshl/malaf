import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  MapPin, 
  Star, 
  Clock, 
  Mail, 
  Phone, 
  Globe, 
  Instagram, 
  Twitter, 
  Linkedin,
  Copy,
  Check,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

const ExampleProfile = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://malaf.me/ahmad-salem");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const services = [
    { name: "تصميم المواقع", price: "من 500 ريال", duration: "5-7 أيام" },
    { name: "تطوير التطبيقات", price: "من 1500 ريال", duration: "2-3 أسابيع" },
    { name: "استشارة تقنية", price: "200 ريال/ساعة", duration: "ساعة واحدة" },
  ];

  const availableTimes = [
    { day: "السبت", times: ["9:00 ص", "11:00 ص", "2:00 م", "4:00 م"] },
    { day: "الأحد", times: ["10:00 ص", "12:00 م", "3:00 م"] },
    { day: "الاثنين", times: ["9:00 ص", "1:00 م", "5:00 م"] },
    { day: "الثلاثاء", times: ["11:00 ص", "2:00 م", "4:00 م"] },
    { day: "الأربعاء", times: ["9:00 ص", "12:00 م", "3:00 م"] },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Apple-style Navigation */}
      <nav className="sticky top-0 bg-background/95 backdrop-blur-xl border-b border-border/5 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 space-x-reverse hover:opacity-80 transition-smooth">
              <div className="w-7 h-7">
                <img 
                  src="/lovable-uploads/053ffcb6-5dac-4834-a5ef-585d29be4be9.png" 
                  alt="ملف" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-lg font-semibold text-foreground tracking-tight">malaf</span>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              asChild 
              className="text-sm font-medium hover:bg-muted/30 transition-smooth px-4 py-2 rounded-full"
            >
              <Link to="/signup">أنشئ ملفك المجاني</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Apple Style */}
      <section className="pt-16 pb-16 lg:pt-24 lg:pb-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          {/* Profile Avatar */}
          <div className="flex justify-center mb-10">
            <Avatar className="w-28 h-28 lg:w-36 lg:h-36 border border-border/10 shadow-soft">
              <AvatarFallback className="text-2xl lg:text-4xl font-light bg-muted/50 text-foreground">أس</AvatarFallback>
            </Avatar>
          </div>

          {/* Name & Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6 tracking-tight leading-tight">
            أحمد سالم
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl font-light text-muted-foreground mb-12 leading-relaxed">
            مطور ويب ومصمم واجهات
          </p>

          {/* Location & Rating */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 lg:gap-12 mb-8">
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="w-5 h-5" />
              <span className="text-base font-medium">الرياض، السعودية</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-base font-semibold text-foreground">4.9</span>
              <span className="text-base text-muted-foreground">(47 تقييم)</span>
            </div>
          </div>

          {/* Copy Link Button */}
          <div className="flex justify-center mb-16">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleCopyLink}
              className="px-10 py-4 rounded-full font-medium border-border/30 hover:bg-muted/40 transition-smooth text-base hover:border-border/50"
            >
              {copied ? <Check className="w-5 h-5 ml-2" /> : <Copy className="w-5 h-5 ml-2" />}
              {copied ? "تم النسخ!" : "نسخ الرابط"}
            </Button>
          </div>
        </div>
      </section>

      {/* Bio Card */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-background border border-border/10 rounded-3xl p-10 lg:p-12 shadow-soft hover:shadow-medium transition-smooth">
            <h3 className="text-2xl lg:text-3xl font-light text-foreground mb-8 tracking-tight text-center">
              نبذة تعريفية
            </h3>
            <p className="text-lg lg:text-xl font-light text-muted-foreground leading-relaxed text-center">
              مطور ويب محترف مع أكثر من 5 سنوات من الخبرة في تطوير المواقع والتطبيقات. 
              أتخصص في React، Node.js، وتصميم تجارب المستخدم الحديثة.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid - Apple Product Style */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground mb-6 tracking-tight leading-tight">
              خدماتي
            </h2>
            <p className="text-lg lg:text-xl font-light text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              حلول تقنية متقدمة ومصممة خصيصاً لاحتياجاتك
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="group text-center p-8 lg:p-10 rounded-3xl bg-background border border-border/10 hover:border-border/30 transition-smooth hover:shadow-soft hover:-translate-y-1"
              >
                <div className="mb-8">
                  <h3 className="text-xl lg:text-2xl font-medium text-foreground mb-4 tracking-tight">
                    {service.name}
                  </h3>
                  <p className="text-2xl lg:text-3xl font-light text-foreground mb-3">
                    {service.price}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{service.duration}</span>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full py-3 rounded-full border-foreground/20 hover:bg-foreground hover:text-background transition-smooth text-sm font-medium"
                >
                  اطلب الخدمة
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Card */}
      <section className="py-20 bg-muted/5">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="bg-background border border-border/10 rounded-3xl p-10 lg:p-12 shadow-soft hover:shadow-medium transition-smooth">
            <h3 className="text-2xl lg:text-3xl font-light text-foreground mb-10 tracking-tight text-center">
              المهارات التقنية
            </h3>
            <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
              {["React", "Node.js", "TypeScript", "UI/UX", "Mobile Apps"].map((skill) => (
                <Badge 
                  key={skill} 
                  variant="secondary" 
                  className="px-6 py-2 text-sm font-medium bg-muted/30 text-foreground border border-border/20 rounded-full hover:bg-muted/50 transition-smooth"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Card */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-background border border-border/10 rounded-3xl p-10 lg:p-12 shadow-soft hover:shadow-medium transition-smooth">
            <div className="text-center mb-12">
              <h3 className="text-2xl lg:text-3xl font-light text-foreground mb-4 tracking-tight">
                احجز موعد مجاني
              </h3>
              <p className="text-lg text-muted-foreground">
                اختر الوقت المناسب لك ودعنا نناقش مشروعك
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {availableTimes.map((daySchedule, dayIndex) => (
                <div key={dayIndex} className="border border-border/10 rounded-2xl p-6 hover:border-border/30 transition-smooth">
                  <h4 className="text-lg font-medium text-foreground mb-4 text-center">
                    {daySchedule.day}
                  </h4>
                  <div className="space-y-2">
                    {daySchedule.times.map((time, timeIndex) => (
                      <Button
                        key={timeIndex}
                        variant="outline"
                        size="sm"
                        className="w-full py-2 text-sm border-border/20 hover:bg-muted/30 transition-smooth"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button 
                size="lg" 
                className="bg-foreground text-background hover:bg-foreground/90 px-12 py-4 rounded-full font-medium transition-smooth text-base shadow-soft hover:shadow-medium"
              >
                <Calendar className="w-5 h-5 ml-2" />
                تأكيد الموعد
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Grid - Clean Apple Layout */}
      <section className="py-32 lg:py-40 bg-muted/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6 tracking-tight leading-tight">
              تواصل معي
            </h2>
            <p className="text-xl lg:text-2xl font-light text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              دعنا نناقش مشروعك القادم
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-20">
            <a 
              href="mailto:ahmad@example.com" 
              className="flex flex-col items-center p-10 lg:p-12 rounded-3xl bg-background border border-border/10 hover:border-border/30 transition-smooth hover:shadow-soft hover:-translate-y-1 group"
            >
              <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-6 group-hover:bg-muted/50 transition-smooth">
                <Mail className="w-6 h-6 text-foreground" />
              </div>
              <span className="text-base font-medium text-foreground">ahmad@example.com</span>
            </a>
            
            <a 
              href="tel:+966500000000" 
              className="flex flex-col items-center p-10 lg:p-12 rounded-3xl bg-background border border-border/10 hover:border-border/30 transition-smooth hover:shadow-soft hover:-translate-y-1 group"
            >
              <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-6 group-hover:bg-muted/50 transition-smooth">
                <Phone className="w-6 h-6 text-foreground" />
              </div>
              <span className="text-base font-medium text-foreground">+966 50 000 0000</span>
            </a>
            
            <a 
              href="https://ahmad-portfolio.com" 
              className="flex flex-col items-center p-10 lg:p-12 rounded-3xl bg-background border border-border/10 hover:border-border/30 transition-smooth hover:shadow-soft hover:-translate-y-1 group"
            >
              <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-6 group-hover:bg-muted/50 transition-smooth">
                <Globe className="w-6 h-6 text-foreground" />
              </div>
              <span className="text-base font-medium text-foreground">ahmad-portfolio.com</span>
            </a>
          </div>

          {/* Social Media - Apple Minimal Style */}
          <div className="flex justify-center gap-6 lg:gap-8">
            <a 
              href="#" 
              className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-105 transition-smooth shadow-soft hover:shadow-medium"
            >
              <Instagram className="w-7 h-7 text-white" />
            </a>
            <a 
              href="#" 
              className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center hover:scale-105 transition-smooth shadow-soft hover:shadow-medium"
            >
              <Twitter className="w-7 h-7 text-white" />
            </a>
            <a 
              href="#" 
              className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center hover:scale-105 transition-smooth shadow-soft hover:shadow-medium"
            >
              <Linkedin className="w-7 h-7 text-white" />
            </a>
          </div>
        </div>
      </section>

      {/* Apple-style Availability Status */}
      <section className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/30 shadow-soft">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-base font-medium text-green-700 dark:text-green-400">
              متاح الآن للمشاريع الجديدة
            </span>
          </div>
          <p className="text-base text-muted-foreground mt-6 font-light">
            السبت - الخميس، 9:00 ص - 6:00 م (GMT+3)
          </p>
        </div>
      </section>
    </div>
  );
};

export default ExampleProfile;