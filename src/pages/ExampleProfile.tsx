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
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* رأس الصفحة مع الرابط والأزرار */}
        <div className="bg-white rounded-2xl shadow-strong p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground mb-2">رابط الملف الشخصي</p>
              <p className="text-lg font-mono bg-muted px-4 py-2 rounded-lg">
                malaf.me/{profileData.username}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={copyLink}>
                <Copy className="ml-2 h-4 w-4" />
                نسخ الرابط
              </Button>
              <Button variant="outline" asChild>
                <Link to="/signup">أنشئ ملفك المجاني</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* العمود الأيسر - المعلومات الأساسية */}
          <div className="lg:col-span-1 space-y-6">
            {/* بطاقة المعلومات الشخصية */}
            <Card className="border-0 shadow-strong">
              <CardContent className="p-6 text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Avatar className="w-32 h-32 border-4 border-primary/20">
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
                
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {profileData.fullName}
                </h1>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Badge variant="secondary">
                    <CheckCircle className="ml-2 h-3 w-3" />
                    ملف معتمد
                  </Badge>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold mr-1 text-foreground">{profileData.rating}</span>
                    <span className="text-sm text-muted-foreground">({profileData.reviewCount})</span>
                  </div>
                </div>

                {profileData.location && (
                  <div className="flex items-center justify-center text-sm text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4 ml-1" />
                    {profileData.location}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* وسائل التواصل */}
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">وسائل التواصل</h3>
                <div className="space-y-3">
                  {profileData.workEmail && (
                    <a 
                      href={`mailto:${profileData.workEmail}`}
                      className="flex items-center text-muted-foreground hover:text-primary transition-smooth"
                    >
                      <Mail className="ml-3 h-4 w-4" />
                      {profileData.workEmail}
                    </a>
                  )}
                  {profileData.instagram && (
                    <a 
                      href={`https://instagram.com/${profileData.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-muted-foreground hover:text-primary transition-smooth"
                    >
                      <Instagram className="ml-3 h-4 w-4" />
                      {profileData.instagram}
                    </a>
                  )}
                  {profileData.twitter && (
                    <a 
                      href={`https://x.com/${profileData.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-muted-foreground hover:text-primary transition-smooth"
                    >
                      <Twitter className="ml-3 h-4 w-4" />
                      {profileData.twitter}
                    </a>
                  )}
                  {profileData.externalLink && (
                    <a 
                      href={profileData.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-muted-foreground hover:text-primary transition-smooth"
                    >
                      <ExternalLink className="ml-3 h-4 w-4" />
                      الموقع الشخصي
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* العمود الأيمن - المحتوى الرئيسي */}
          <div className="lg:col-span-2 space-y-6">
            {/* النبذة التعريفية */}
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">نبذة تعريفية</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {profileData.bio}
                </p>
              </CardContent>
            </Card>

            {/* الخدمات */}
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">الخدمات المقدمة</h2>
                <div className="flex flex-wrap gap-2">
                  {profileData.services.map((service, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {service}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* المهارات */}
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">المهارات</h2>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* أوقات التوفر */}
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">أوقات التوفر</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">الأيام المتاحة</h4>
                    <p className="text-sm">السبت - الخميس</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">أوقات العمل</h4>
                    <p className="text-sm">9:00 ص - 6:00 م</p>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="hero">
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  احجز استشارة مجانية
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleProfile;