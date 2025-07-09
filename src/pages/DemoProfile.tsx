import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const DemoProfile = () => {
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showAlternativeBooking, setShowAlternativeBooking] = useState(false);
  const [alternativeDay, setAlternativeDay] = useState("");
  const [alternativeTimeSlot, setAlternativeTimeSlot] = useState("");
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    preferredContact: "",
    notes: ""
  });
  const { toast } = useToast();

  // بيانات النموذج التوضيحي
  const profileData = {
    fullName: "أحمد محمد السالم",
    username: "demo",
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

  const handleBooking = () => {
    toast({
      title: "هذا مجرد نموذج توضيحي",
      description: "لحجز اجتماع حقيقي، قم بإنشاء حسابك أولاً",
    });
  };

  const copyLink = () => {
    const profileUrl = `https://malaf.me/${profileData.username}`;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "تم نسخ الرابط",
      description: "تم نسخ رابط الملف الشخصي بنجاح",
    });
  };

  const dayLabels = {
    sunday: "الأحد",
    monday: "الاثنين", 
    tuesday: "الثلاثاء",
    wednesday: "الأربعاء",
    thursday: "الخميس",
    friday: "الجمعة",
    saturday: "السبت"
  };

  const timeSlotLabels = {
    morning: "الصباح (8:00 ص - 12:00 م)",
    afternoon: "بعد الظهر (12:00 م - 5:00 م)",
    evening: "المساء (5:00 م - 9:00 م)"
  };

  const availableTimeSlots = {
    morning: ["8:00 ص", "9:00 ص", "10:00 ص", "11:00 ص"],
    afternoon: ["12:00 م", "1:00 م", "2:00 م", "3:00 م", "4:00 م"],
    evening: ["5:00 م", "6:00 م", "7:00 م", "8:00 م"]
  };

  const getCurrentTimeSlots = () => {
    return availableTimeSlots[profileData.timeSlot as keyof typeof availableTimeSlots] || [];
  };

  const contactMethods = [
    { value: "email", label: "البريد الإلكتروني" },
    { value: "phone", label: "الهاتف" },
    { value: "whatsapp", label: "واتساب" },
    { value: "telegram", label: "تلقرام" }
  ];

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* تنبيه النموذج التوضيحي */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-center">
          <p className="text-blue-800 font-medium mb-2">📋 هذا نموذج توضيحي</p>
          <p className="text-blue-600 text-sm mb-4">
            يمكنك استكشاف كيف سيبدو ملفك المهني على منصة ملف
          </p>
          <Button variant="outline" size="sm" asChild className="text-blue-700 border-blue-300">
            <Link to="/signup">أنشئ ملفك الآن</Link>
          </Button>
        </div>

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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="hero">
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    حجز اجتماع (تجريبي)
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>حجز اجتماع (نموذج تجريبي)</DialogTitle>
                    <DialogDescription>
                      هذا نموذج توضيحي لنظام الحجز - لن يتم حفظ البيانات
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">الأوقات المتاحة</h4>
                      <div className="text-sm text-muted-foreground mb-3">
                        <p>الفترة: {timeSlotLabels[profileData.timeSlot as keyof typeof timeSlotLabels]}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>اختر اليوم</Label>
                      <Select value={selectedDay} onValueChange={setSelectedDay}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر يوم من الأيام المتاحة" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {profileData.availableDays.map((day) => (
                            <SelectItem key={day} value={day}>
                              {dayLabels[day as keyof typeof dayLabels]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>اختر الوقت</Label>
                      <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر وقت محدد" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {getCurrentTimeSlots().map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="border-t pt-4 space-y-4">
                      <h4 className="font-medium">بياناتك</h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor="name">الاسم الكامل *</Label>
                        <Input
                          id="name"
                          value={bookingForm.name}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="اكتب اسمك الكامل"
                          className="text-right"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={bookingForm.email}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="example@email.com"
                          className="text-left"
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={handleBooking} 
                      className="w-full" 
                      variant="hero"
                    >
                      تجربة الحجز (تجريبي)
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* العمود الأيسر - المعلومات الأساسية */}
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
                {profileData.location && (
                  <div className="flex items-center justify-center text-muted-foreground mb-4">
                    <MapPin className="ml-2 h-4 w-4" />
                    <span>{profileData.location}</span>
                  </div>
                )}
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
                      {timeSlotLabels[profileData.timeSlot as keyof typeof timeSlotLabels]}
                    </Badge>
                  </div>
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
                <h3 className="text-lg font-semibold mb-2">أعجبك هذا النموذج؟</h3>
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

export default DemoProfile;