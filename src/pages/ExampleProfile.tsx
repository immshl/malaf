import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Copy, 
  Calendar as CalendarIcon, 
  MapPin, 
  Star, 
  Clock, 
  Mail, 
  Instagram, 
  Twitter, 
  ExternalLink,
  User,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";


const ExampleProfile = () => {
  const { toast } = useToast();
  
  // بيانات المستخدم التجريبية
  const profileData = {
    fullName: "مشعل ثاني",
    username: "immshl",
    bio: "أعرف أفكر — أساعد الشركات والأفراد على ابتكار حلول أعمال إبداعية وسويت هذي المنصة عشان الكل يستفيد منها. خبرة واسعة في تطوير الاستراتيجيات والحلول المبتكرة للأعمال.",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    emoji: "👑",
    services: [
      "استشارة أعمال",
      "تطوير استراتيجية", 
      "حلول إبداعية",
      "تطوير الأعمال"
    ],
    skills: ["استشارة أعمال", "حلول إبداعية", "استراتيجية", "تطوير الأعمال", "ريادة الأعمال"],
    topClients: [
      "stc",
      "وزارة الاتصالات", 
      "anb",
      "هدف"
    ],
    instagram: "@immshl",
    twitter: "@immshl", 
    workEmail: "iimmshl@gmail.com",
    externalLink: "",
    location: "الرياض، المملكة العربية السعودية",
    rating: 4.9,
    reviewCount: 47,
    availableDays: ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday"],
    timeSlot: "morning"
  };

  const copyLink = () => {
    const profileUrl = `https://malaf.me/${profileData.username}`;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "تم نسخ الرابط",
      description: "تم نسخ رابط الملف الشخصي بنجاح",
    });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* الملف الشخصي المركزي */}
        <div className="text-center space-y-8">
          {/* الصورة الشخصية والمعلومات الأساسية */}
          <div className="space-y-6">
            <div className="relative inline-block">
              <Avatar className="w-32 h-32 mx-auto border-4 border-muted">
                <AvatarImage src={profileData.profileImage} />
                <AvatarFallback className="bg-gradient-primary text-white text-3xl">
                  <User className="w-16 h-16" />
                </AvatarFallback>
              </Avatar>
              {profileData.emoji && (
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-background border-2 border-background rounded-full flex items-center justify-center text-xl shadow-sm">
                  {profileData.emoji}
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-foreground">
                {profileData.fullName}
              </h1>
              
              <p className="text-muted-foreground leading-relaxed max-w-md mx-auto text-lg">
                {profileData.bio}
              </p>
              
              {profileData.location && (
                <div className="flex items-center justify-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 ml-2" />
                  {profileData.location}
                </div>
              )}
            </div>
          </div>

          {/* الخدمات */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">الخدمات</h2>
            <div className="grid grid-cols-2 gap-6">
              {profileData.services.map((service, index) => (
                <Card key={index} className="border-0 shadow-soft hover:shadow-medium transition-all duration-300 p-6">
                  <CardContent className="p-0 text-center">
                    <h3 className="font-semibold text-foreground text-lg">{service}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* احجز موعد */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">احجز موعد</h2>
              <p className="text-muted-foreground">
                احجز موعد لمناقشة مشروعك
              </p>
            </div>
            
            <Button 
              size="lg" 
              className="w-full max-w-sm mx-auto bg-foreground text-background hover:bg-foreground/90 rounded-2xl h-14 text-lg font-medium"
            >
              <CalendarIcon className="ml-3 h-5 w-5" />
              احجز موعد
            </Button>
          </div>

          {/* عملاء مميزون */}
          {profileData.topClients && profileData.topClients.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">عملاء مميزون</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* عرض أول 4 عملاء فقط */}
                {profileData.topClients.slice(0, 4).map((client, index) => (
                  <div key={index} className="bg-muted/30 rounded-lg p-4">
                    <p className="font-medium text-foreground text-center">{client}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* وسائل التواصل الاجتماعي */}
          <div className="space-y-6 pt-8 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground">وسائل التواصل الاجتماعي</h2>
            <div className="space-y-4">
              {profileData.instagram && (
                <a 
                  href={`https://instagram.com/${profileData.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 text-muted-foreground hover:text-primary transition-smooth"
                >
                  <Instagram className="w-5 h-5" />
                  <span className="text-lg">{profileData.instagram}</span>
                </a>
              )}
              {profileData.twitter && (
                <a 
                  href={`https://x.com/${profileData.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 text-muted-foreground hover:text-primary transition-smooth"
                >
                  <Twitter className="w-5 h-5" />
                  <span className="text-lg">{profileData.twitter}</span>
                </a>
              )}
            </div>
          </div>

          {/* رابط النسخ في الأسفل */}
          <div className="pt-8">
            <Button variant="outline" onClick={copyLink} className="mx-auto">
              <Copy className="ml-2 h-4 w-4" />
              نسخ الرابط
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              malaf.me/{profileData.username}
            </p>
          </div>

          {/* رابط إنشاء ملف جديد */}
          <div className="pt-4 pb-8">
            <Button variant="outline" asChild>
              <Link to="/signup">أنشئ ملفك المجاني</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleProfile;