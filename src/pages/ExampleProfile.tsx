import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Check
} from "lucide-react";
import { Link } from "react-router-dom";
import profileMockup from "@/assets/profile-mockup.jpg";

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
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 space-x-reverse">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ملف</span>
            </div>
            <span className="font-bold text-foreground">malaf</span>
          </Link>
          <Button variant="outline" asChild>
            <Link to="/signup">أنشئ ملفك المجاني</Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <Card className="border-0 shadow-soft mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                <AvatarImage src={profileMockup} alt="أحمد سالم" />
                <AvatarFallback>أس</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">أحمد سالم</h1>
                    <p className="text-xl text-muted-foreground mb-3">مطور ويب ومصمم واجهات</p>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4 ml-1" />
                      الرياض، المملكة العربية السعودية
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold mr-1">4.9</span>
                      </div>
                      <span className="text-sm text-muted-foreground">(47 تقييم)</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCopyLink}
                      className="flex items-center gap-2"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "تم النسخ!" : "نسخ الرابط"}
                    </Button>
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed mb-4">
                  مطور ويب محترف مع أكثر من 5 سنوات من الخبرة في تطوير المواقع والتطبيقات. 
                  أتخصص في React، Node.js، وتصميم تجارب المستخدم الحديثة. أسعى دائماً لتقديم حلول تقنية مبتكرة تلبي احتياجات العملاء.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {["React", "Node.js", "TypeScript", "UI/UX", "Mobile Apps"].map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <a href="mailto:ahmad@example.com" className="flex items-center gap-2 text-primary hover:text-primary-hover transition-smooth">
                    <Mail className="w-4 h-4" />
                    ahmad@example.com
                  </a>
                  <a href="tel:+966500000000" className="flex items-center gap-2 text-primary hover:text-primary-hover transition-smooth">
                    <Phone className="w-4 h-4" />
                    +966 50 000 0000
                  </a>
                  <a href="https://ahmad-portfolio.com" className="flex items-center gap-2 text-primary hover:text-primary-hover transition-smooth">
                    <Globe className="w-4 h-4" />
                    ahmad-portfolio.com
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Services */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">خدماتي</h2>
                <div className="space-y-4">
                  {services.map((service, index) => (
                    <div key={index} className="border border-border rounded-lg p-4 hover:shadow-soft transition-smooth">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-foreground">{service.name}</h3>
                        <span className="font-bold text-primary">{service.price}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <Clock className="w-4 h-4 ml-1" />
                        مدة التسليم: {service.duration}
                      </div>
                      <Button size="sm" className="w-full">
                        اطلب الخدمة
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking & Contact */}
          <div className="space-y-6">
            {/* Book Meeting */}
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">احجز اجتماع</h3>
                <p className="text-muted-foreground mb-4">
                  احجز استشارة مجانية لمناقشة مشروعك
                </p>
                <Button className="w-full mb-4" variant="hero">
                  <Calendar className="w-4 h-4 ml-2" />
                  احجز موعد مجاني
                </Button>
                <div className="text-center">
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 ml-1" />
                    متاح: السبت - الخميس، 9ص - 6م
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">تواصل معي</h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Instagram className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium">@ahmad_designs</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Twitter className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium">@ahmad_dev</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <Linkedin className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium">Ahmad Salem</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleProfile;