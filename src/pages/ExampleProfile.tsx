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

  return (
    <div className="min-h-screen bg-background">
      {/* Apple-style Navigation */}
      <nav className="sticky top-0 bg-background/80 backdrop-blur-xl border-b border-border/10 z-50">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 space-x-reverse">
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
              className="text-sm font-medium hover:bg-muted/50 transition-smooth"
            >
              <Link to="/signup">أنشئ ملفك المجاني</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Apple Style */}
      <section className="pt-20 pb-32">
        <div className="max-w-4xl mx-auto px-8 text-center">
          {/* Profile Avatar */}
          <div className="flex justify-center mb-8">
            <Avatar className="w-32 h-32 border border-border/20 shadow-sm">
              <AvatarFallback className="text-3xl font-light bg-muted text-foreground">أس</AvatarFallback>
            </Avatar>
          </div>

          {/* Name & Title */}
          <h1 className="text-5xl md:text-6xl font-light text-foreground mb-4 tracking-tight">
            أحمد سالم
          </h1>
          <p className="text-2xl font-light text-muted-foreground mb-8">
            مطور ويب ومصمم واجهات
          </p>

          {/* Location & Rating */}
          <div className="flex items-center justify-center gap-8 mb-12">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">الرياض، السعودية</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-foreground">4.9</span>
              <span className="text-sm text-muted-foreground">(47 تقييم)</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              size="lg" 
              className="bg-foreground text-background hover:bg-foreground/90 px-8 py-3 rounded-full font-medium transition-smooth"
            >
              <Calendar className="w-4 h-4 ml-2" />
              احجز موعد مجاني
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleCopyLink}
              className="px-8 py-3 rounded-full font-medium border-muted-foreground/20 hover:bg-muted/30 transition-smooth"
            >
              {copied ? <Check className="w-4 h-4 ml-2" /> : <Copy className="w-4 h-4 ml-2" />}
              {copied ? "تم النسخ!" : "نسخ الرابط"}
            </Button>
          </div>

          {/* Bio */}
          <div className="max-w-2xl mx-auto">
            <p className="text-lg font-light text-muted-foreground leading-relaxed">
              مطور ويب محترف مع أكثر من 5 سنوات من الخبرة في تطوير المواقع والتطبيقات. 
              أتخصص في React، Node.js، وتصميم تجارب المستخدم الحديثة.
            </p>
          </div>
        </div>
      </section>

      {/* Skills - Minimal Apple Style */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-4xl mx-auto px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {["React", "Node.js", "TypeScript", "UI/UX", "Mobile Apps"].map((skill) => (
              <Badge 
                key={skill} 
                variant="secondary" 
                className="px-6 py-2 text-sm font-medium bg-muted/50 text-foreground border-0 rounded-full"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid - Apple Product Style */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-4 tracking-tight">
              خدماتي
            </h2>
            <p className="text-lg font-light text-muted-foreground">
              حلول تقنية متقدمة ومصممة خصيصاً لاحتياجاتك
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="group text-center p-8 rounded-3xl bg-background border border-border/10 hover:border-border/30 transition-smooth hover:shadow-sm"
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-medium text-foreground mb-4 tracking-tight">
                    {service.name}
                  </h3>
                  <p className="text-3xl font-light text-foreground mb-2">
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
                  className="w-full rounded-full border-foreground/20 hover:bg-foreground hover:text-background transition-smooth"
                >
                  اطلب الخدمة
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Grid - Clean Apple Layout */}
      <section className="py-32 bg-muted/20">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-4 tracking-tight">
              تواصل معي
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <a 
              href="mailto:ahmad@example.com" 
              className="flex flex-col items-center p-8 rounded-3xl bg-background border border-border/10 hover:border-border/30 transition-smooth hover:shadow-sm group"
            >
              <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mb-4 group-hover:bg-muted transition-smooth">
                <Mail className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">ahmad@example.com</span>
            </a>
            
            <a 
              href="tel:+966500000000" 
              className="flex flex-col items-center p-8 rounded-3xl bg-background border border-border/10 hover:border-border/30 transition-smooth hover:shadow-sm group"
            >
              <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mb-4 group-hover:bg-muted transition-smooth">
                <Phone className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">+966 50 000 0000</span>
            </a>
            
            <a 
              href="https://ahmad-portfolio.com" 
              className="flex flex-col items-center p-8 rounded-3xl bg-background border border-border/10 hover:border-border/30 transition-smooth hover:shadow-sm group"
            >
              <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mb-4 group-hover:bg-muted transition-smooth">
                <Globe className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">ahmad-portfolio.com</span>
            </a>
          </div>

          {/* Social Media - Apple Minimal Style */}
          <div className="flex justify-center gap-8">
            <a 
              href="#" 
              className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-105 transition-smooth shadow-sm"
            >
              <Instagram className="w-5 h-5 text-white" />
            </a>
            <a 
              href="#" 
              className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center hover:scale-105 transition-smooth shadow-sm"
            >
              <Twitter className="w-5 h-5 text-white" />
            </a>
            <a 
              href="#" 
              className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:scale-105 transition-smooth shadow-sm"
            >
              <Linkedin className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>
      </section>

      {/* Apple-style Availability Status */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-8 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/30">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              متاح الآن للمشاريع الجديدة
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-4 font-light">
            السبت - الخميس، 9:00 ص - 6:00 م (GMT+3)
          </p>
        </div>
      </section>
    </div>
  );
};

export default ExampleProfile;