import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Calendar as CalendarIcon, 
  MapPin, 
  Mail, 
  Instagram, 
  Twitter, 
  ExternalLink,
  Clock,
  User,
  Star,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ExampleProfile = () => {
  const { toast } = useToast();

  // بيانات المثال
  const profileData = {
    fullName: "أحمد محمد السالم",
    username: "ahmed-salem",
    profession: "مطور ويب وتطبيقات",
    location: "الرياض، السعودية",
    bio: "مطور ويب محترف بخبرة تزيد عن 5 سنوات في تطوير التطبيقات والمواقع الإلكترونية. أساعد الشركات والأفراد على تحويل أفكارهم إلى واقع رقمي باستخدام أحدث التقنيات.",
    profileImage: "/placeholder.svg",
    services: [
      "تطوير مواقع الويب",
      "تطوير تطبيقات الجوال", 
      "تصميم واجهات المستخدم",
      "استشارات تقنية"
    ],
    topClients: [
      "شركة تقنية المستقبل",
      "مؤسسة الابتكار الرقمي",
      "متجر الإلكترونيات الذكية"
    ],
    instagram: "@ahmed_salem_dev",
    twitter: "@ahmedsalem",
    workEmail: "ahmed@example.com",
    externalLink: "https://ahmed-portfolio.com",
    availableDays: ["sunday", "tuesday", "thursday"],
    timeSlot: "evening"
  };

  const copyLink = () => {
    const profileUrl = `https://malaf.me/${profileData.username}`;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "تم نسخ الرابط",
      description: "تم نسخ رابط الملف الشخصي بنجاح",
    });
  };

  const handleBookingClick = () => {
    toast({
      title: "هذا مجرد مثال",
      description: "قم بإنشاء حسابك لبدء استقبال الحجوزات الحقيقية",
    });
  };

  const dayLabels = {
    sunday: "الأحد",
    tuesday: "الثلاثاء", 
    thursday: "الخميس"
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* تنبيه المثال */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-center">
          <p className="text-blue-800 font-medium mb-2">📋 هذا مثال توضيحي</p>
          <p className="text-blue-600 text-sm mb-4">
            يمكنك رؤية كيف سيبدو ملفك المهني على منصة ملف
          </p>
          <Button variant="outline" size="sm" asChild className="text-blue-700 border-blue-300">
            <Link to="/signup">أنشئ ملفك الآن</Link>
          </Button>
        </div>

        {/* رأس الصفحة */}
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
              <Button variant="hero" onClick={handleBookingClick}>
                <CalendarIcon className="ml-2 h-4 w-4" />
                حجز اجتماع
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* العمود الأيسر */}
          <div className="lg:col-span-1 space-y-6">
            {/* بطاقة المعلومات الشخصية */}
            <Card className="border-0 shadow-strong">
              <CardContent className="p-6 text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary/20">
                  <AvatarImage src={profileData.profileImage} />
                  <AvatarFallback className="bg-gradient-primary text-white text-3xl">
                    <User className="w-16 h-16" />
                  </AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {profileData.fullName}
                </h1>
                <p className="text-lg text-primary font-medium mb-3">
                  {profileData.profession}
                </p>
                <div className="flex items-center justify-center text-muted-foreground mb-4">
                  <MapPin className="ml-2 h-4 w-4" />
                  <span>{profileData.location}</span>
                </div>
                <Badge variant="secondary" className="mb-4">
                  <CheckCircle className="ml-2 h-3 w-3" />
                  ملف معتمد
                </Badge>
              </CardContent>
            </Card>

            {/* وسائل التواصل */}
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">وسائل التواصل</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="ml-3 h-4 w-4" />
                    <span className="text-sm">{profileData.workEmail}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Instagram className="ml-3 h-4 w-4" />
                    <span className="text-sm">{profileData.instagram}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Twitter className="ml-3 h-4 w-4" />
                    <span className="text-sm">{profileData.twitter}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <ExternalLink className="ml-3 h-4 w-4" />
                    <span className="text-sm">الموقع الشخصي</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* أوقات الحجز */}
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Clock className="ml-2 h-5 w-5" />
                  أوقات الحجز
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">الأيام المتاحة:</p>
                    <div className="flex flex-wrap gap-2">
                      {profileData.availableDays.map((day) => (
                        <Badge key={day} variant="outline">
                          {dayLabels[day as keyof typeof dayLabels]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">الوقت:</p>
                    <Badge variant="secondary">
                      المساء (5:00 م - 9:00 م)
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* العمود الأيمن */}
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
                <h2 className="text-xl font-semibold mb-4">الخدمات المقدّمة</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {profileData.services.map((service, index) => (
                    <div key={index} className="flex items-center p-3 bg-muted/50 rounded-lg">
                      <Star className="ml-3 h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* أبرز العملاء */}
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">أبرز العملاء</h2>
                <div className="space-y-3">
                  {profileData.topClients.map((client, index) => (
                    <div key={index} className="flex items-center p-3 bg-muted/50 rounded-lg">
                      <CheckCircle className="ml-3 h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">{client}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* دعوة للعمل */}
            <Card className="border-0 shadow-soft bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">أعجبك هذا المثال؟</h3>
                <p className="text-muted-foreground mb-4">
                  أنشئ ملفك المهني الآن واحصل على رابط مخصص لك
                </p>
                <Button variant="hero" asChild>
                  <Link to="/signup" className="inline-flex items-center">
                    ابدأ إنشاء ملفك
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </Link>
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