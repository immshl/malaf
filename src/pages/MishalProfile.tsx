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
  User
} from "lucide-react";
import { Link } from "react-router-dom";

const MishalProfile = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://malaf.me/mishalth");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const services = [
    { name: "استشارة ماليّة", price: "من 300 ريال", duration: "ساعة واحدة" },
    { name: "إدارة الاستثمارات", price: "من 2000 ريال", duration: "شهريّاً" },
    { name: "تخطيط التقاعد", price: "من 1500 ريال", duration: "3 جلسات" },
    { name: "تحليل الميزانيّة", price: "من 500 ريال", duration: "2-3 أيام" },
  ];

  const availableTimes = [
    { day: "الأحد", times: ["10:00 ص", "2:00 م", "4:00 م"] },
    { day: "الاثنين", times: ["9:00 ص", "11:00 ص", "3:00 م", "5:00 م"] },
    { day: "الثلاثاء", times: ["10:00 ص", "12:00 م", "4:00 م"] },
    { day: "الأربعاء", times: ["9:00 ص", "1:00 م", "3:00 م"] },
    { day: "الخميس", times: ["11:00 ص", "2:00 م", "5:00 م"] },
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
                  src="/lovable-uploads/be1d2269-8206-422b-a395-e4fb9e1a88cc.png" 
                  alt="ملف" 
                  className="w-full h-full object-contain dark:hidden"
                />
                <img 
                  src="/lovable-uploads/822b255a-0cfa-4520-b9a5-aa69e7ef91e6.png" 
                  alt="ملف" 
                  className="w-full h-full object-contain hidden dark:block"
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

      {/* Profile Header Card */}
      <section className="pt-16 pb-8 lg:pt-24 lg:pb-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-background border border-border/10 rounded-3xl p-10 lg:p-12 shadow-soft hover:shadow-medium transition-smooth text-center">
            {/* Profile Avatar */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Avatar className="w-28 h-28 lg:w-36 lg:h-36 border border-border/10 shadow-soft">
                  <AvatarFallback className="text-2xl lg:text-4xl font-light bg-gradient-primary text-white">
                    <User className="w-12 h-12 lg:w-16 lg:h-16" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-1 -right-1 w-10 h-10 lg:w-12 lg:h-12 bg-background border-2 border-background rounded-full flex items-center justify-center text-2xl lg:text-3xl shadow-sm">
                  💰
                </div>
              </div>
            </div>

            {/* Name & Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground mb-4 tracking-tight">
              مشعل ثاني
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl font-light text-muted-foreground mb-8">
              مستشار مالي ومخطط استثمارات
            </p>

            {/* Location & Rating */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5" />
                <span className="text-base font-medium">الدمام، السعودية</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-base font-semibold text-foreground">4.8</span>
                <span className="text-base text-muted-foreground">(32 تقييم)</span>
              </div>
            </div>

            {/* Action Button */}
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleCopyLink}
              className="px-8 py-3 rounded-full font-medium border-border/30 hover:bg-muted/40 transition-smooth"
            >
              {copied ? <Check className="w-5 h-5 ml-2" /> : <Copy className="w-5 h-5 ml-2" />}
              {copied ? "تم النسخ!" : "نسخ الرابط"}
            </Button>
          </div>
        </div>
      </section>

      {/* Bio Card */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-background border border-border/10 rounded-3xl p-10 lg:p-12 shadow-soft hover:shadow-medium transition-smooth">
            <h3 className="text-2xl lg:text-3xl font-light text-foreground mb-8 tracking-tight text-center">
              نبذة تعريفية
            </h3>
            <p className="text-lg font-light text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto">
              مستشار مالي معتمد مع أكثر من 7 سنوات من الخبرة في التخطيط المالي وإدارة الاستثمارات. 
              أساعد الأفراد والشركات الناشئة في بناء استراتيجيات مالية مدروسة وتحقيق الاستقلال المالي.
            </p>
          </div>
        </div>
      </section>

      {/* Skills Card */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-background border border-border/10 rounded-3xl p-10 lg:p-12 shadow-soft hover:shadow-medium transition-smooth">
            <h3 className="text-2xl lg:text-3xl font-light text-foreground mb-10 tracking-tight text-center">
              المجالات التخصصية
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {["التخطيط المالي", "إدارة الاستثمارات", "تخطيط التقاعد", "التأمين", "الضرائب", "ريادة الأعمال"].map((skill) => (
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

      {/* Services Card */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="bg-background border border-border/10 rounded-3xl p-10 lg:p-12 shadow-soft hover:shadow-medium transition-smooth">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-foreground mb-6 tracking-tight">
                خدماتي
              </h2>
              <p className="text-lg font-light text-muted-foreground max-w-2xl mx-auto">
                استشارات مالية متخصصة لتحقيق أهدافك المالية
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <div 
                  key={index} 
                  className="p-6 rounded-2xl border border-border/10 hover:border-border/30 transition-smooth hover:shadow-soft bg-muted/5 hover:bg-muted/10"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-medium text-foreground mb-3 tracking-tight">
                      {service.name}
                    </h3>
                    <p className="text-xl lg:text-2xl font-light text-foreground mb-2">
                      {service.price}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration}</span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="w-full rounded-full border-foreground/20 hover:bg-foreground hover:text-background transition-smooth"
                  >
                    اطلب الخدمة
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Card */}
      <section className="py-8">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="bg-background border border-border/10 rounded-3xl p-10 lg:p-12 shadow-soft hover:shadow-medium transition-smooth">
            <div className="text-center mb-10">
              <h3 className="text-2xl lg:text-3xl font-light text-foreground mb-4 tracking-tight">
                احجز استشارة مجانية
              </h3>
              <p className="text-lg text-muted-foreground">
                اختر الوقت المناسب لك ودعنا نناقش وضعك المالي
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {availableTimes.map((daySchedule, dayIndex) => (
                <div key={dayIndex} className="border border-border/10 rounded-2xl p-4 hover:border-border/30 transition-smooth bg-muted/5">
                  <h4 className="text-base font-medium text-foreground mb-3 text-center">
                    {daySchedule.day}
                  </h4>
                  <div className="space-y-2">
                    {daySchedule.times.map((time, timeIndex) => (
                      <Button
                        key={timeIndex}
                        variant="outline"
                        size="sm"
                        className="w-full text-xs border-border/20 hover:bg-muted/30 transition-smooth"
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
                className="bg-foreground text-background hover:bg-foreground/90 px-10 py-4 rounded-full font-medium transition-smooth shadow-soft hover:shadow-medium"
              >
                <Calendar className="w-5 h-5 ml-2" />
                تأكيد الموعد
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Card */}
      <section className="py-8">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="bg-background border border-border/10 rounded-3xl p-10 lg:p-12 shadow-soft hover:shadow-medium transition-smooth">
            <div className="text-center mb-10">
              <h2 className="text-2xl lg:text-3xl font-light text-foreground mb-4 tracking-tight">
                تواصل معي
              </h2>
              <p className="text-lg font-light text-muted-foreground">
                ابدأ رحلتك نحو الاستقلال المالي
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <a 
                href="mailto:mishal@financialplanning.sa" 
                className="flex flex-col items-center p-6 rounded-2xl border border-border/10 hover:border-border/30 transition-smooth hover:shadow-soft group bg-muted/5 hover:bg-muted/10"
              >
                <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-muted/50 transition-smooth">
                  <Mail className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground text-center">mishal@financialplanning.sa</span>
              </a>
              
              <a 
                href="tel:+966555123456" 
                className="flex flex-col items-center p-6 rounded-2xl border border-border/10 hover:border-border/30 transition-smooth hover:shadow-soft group bg-muted/5 hover:bg-muted/10"
              >
                <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-muted/50 transition-smooth">
                  <Phone className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground text-center">+966 55 512 3456</span>
              </a>
              
              <a 
                href="https://mishalfinance.com" 
                className="flex flex-col items-center p-6 rounded-2xl border border-border/10 hover:border-border/30 transition-smooth hover:shadow-soft group bg-muted/5 hover:bg-muted/10"
              >
                <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-muted/50 transition-smooth">
                  <Globe className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground text-center">mishalfinance.com</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Card */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-background border border-border/10 rounded-3xl p-10 lg:p-12 shadow-soft hover:shadow-medium transition-smooth">
            <h3 className="text-2xl font-light text-foreground mb-8 text-center tracking-tight">
              تابعني على
            </h3>
            <div className="flex justify-center gap-6">
              <a 
                href="https://instagram.com/mishalfinance" 
                className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-105 transition-smooth shadow-soft hover:shadow-medium"
              >
                <Instagram className="w-6 h-6 text-white" />
              </a>
              <a 
                href="https://x.com/mishalfinance" 
                className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center hover:scale-105 transition-smooth shadow-soft hover:shadow-medium"
              >
                <Twitter className="w-6 h-6 text-white" />
              </a>
              <a 
                href="https://linkedin.com/in/mishalthani" 
                className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center hover:scale-105 transition-smooth shadow-soft hover:shadow-medium"
              >
                <Linkedin className="w-6 h-6 text-white" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Availability Status Card */}
      <section className="py-8 pb-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-background border border-border/10 rounded-3xl p-10 lg:p-12 shadow-soft hover:shadow-medium transition-smooth">
            <div className="text-center">
              <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/30 shadow-soft mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  متاح الآن للاستشارات الجديدة
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-light">
                الأحد - الخميس، 9:00 ص - 6:00 م (GMT+3)
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default MishalProfile;