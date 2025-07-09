import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Upload, User, Instagram, Twitter, Mail, Link as LinkIcon, Plus, X } from "lucide-react";

const CreateProfile = () => {
  const [profileData, setProfileData] = useState({
    fullName: "",
    username: "",
    bio: "",
    profession: "",
    location: "",
    profileImage: "",
    services: [""],
    topClients: [""],
    instagram: "",
    twitter: "",
    workEmail: "",
    externalLink: "",
    availableDays: [] as string[],
    timeSlot: ""
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من البيانات المطلوبة
    if (!profileData.availableDays.length || !profileData.timeSlot) {
      alert("يرجى تحديد الأيام المتاحة والفترة الزمنية للحجز");
      return;
    }
    
    // مؤقت - سيتم ربطه بـ Supabase لاحقاً
    console.log("بيانات الملف:", profileData);
    alert("تم إنشاء ملفك بنجاح!");
    
    // الانتقال إلى صفحة الملف الشخصي
    navigate(`/profile/${profileData.username}`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // مؤقت - سيتم رفعها إلى Supabase Storage لاحقاً
      const imageUrl = URL.createObjectURL(file);
      setProfileData(prev => ({ ...prev, profileImage: imageUrl }));
    }
  };

  const addService = () => {
    setProfileData(prev => ({
      ...prev,
      services: [...prev.services, ""]
    }));
  };

  const removeService = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const updateService = (index: number, value: string) => {
    setProfileData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => i === index ? value : service)
    }));
  };

  const addClient = () => {
    setProfileData(prev => ({
      ...prev,
      topClients: [...prev.topClients, ""]
    }));
  };

  const removeClient = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      topClients: prev.topClients.filter((_, i) => i !== index)
    }));
  };

  const updateClient = (index: number, value: string) => {
    setProfileData(prev => ({
      ...prev,
      topClients: prev.topClients.map((client, i) => i === index ? value : client)
    }));
  };

  const toggleDay = (day: string) => {
    setProfileData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const days = [
    { value: "sunday", label: "الأحد" },
    { value: "monday", label: "الاثنين" },
    { value: "tuesday", label: "الثلاثاء" },
    { value: "wednesday", label: "الأربعاء" },
    { value: "thursday", label: "الخميس" },
    { value: "friday", label: "الجمعة" },
    { value: "saturday", label: "السبت" }
  ];

  const timeSlots = [
    { value: "morning", label: "الصباح (8:00 ص - 12:00 م)" },
    { value: "afternoon", label: "بعد الظهر (12:00 م - 5:00 م)" },
    { value: "evening", label: "المساء (5:00 م - 9:00 م)" }
  ];

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* الرأس */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 space-x-reverse mb-6">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ملف</span>
            </div>
            <span className="text-xl font-bold text-foreground">malaf</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">أنشئ ملفك المهني</h1>
          <p className="text-muted-foreground">أضف معلوماتك لإنشاء ملف مهني مميز</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* القسم الأول: المعلومات الأساسية */}
            <Card className="border shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">المعلومات الأساسية</CardTitle>
                <CardDescription>
                  البيانات الشخصية والأساسية لملفك
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* الصورة الشخصية */}
                <div className="space-y-4">
                  <Label className="text-foreground font-medium">الصورة الشخصية</Label>
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={profileData.profileImage} />
                      <AvatarFallback className="bg-gradient-primary text-white">
                        <User className="w-8 h-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button type="button" variant="outline" className="relative overflow-hidden">
                        <Upload className="ml-2 h-4 w-4" />
                        اختر صورة
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        صورة احترافية واضحة (اختيارية)
                      </p>
                    </div>
                  </div>
                </div>

                {/* الاسم الكامل */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground font-medium">
                    الاسم الكامل *
                  </Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="اكتب اسمك الكامل"
                    required
                    className="text-right"
                  />
                </div>

                {/* اسم المستخدم */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-foreground font-medium">
                    اسم المستخدم *
                  </Label>
                  <div className="relative">
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="username"
                      required
                      className="text-left pl-24"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                      malaf.me/
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    سيكون رابطك: malaf.me/{profileData.username || "username"}
                  </p>
                </div>

                {/* المهنة */}
                <div className="space-y-2">
                  <Label htmlFor="profession" className="text-foreground font-medium">
                    المهنة *
                  </Label>
                  <Input
                    id="profession"
                    value={profileData.profession}
                    onChange={(e) => setProfileData(prev => ({ ...prev, profession: e.target.value }))}
                    placeholder="مثل: مطور ويب، مصمم جرافيك، مترجم"
                    required
                    className="text-right"
                  />
                </div>

                {/* الموقع */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-foreground font-medium">
                    الموقع
                  </Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="مثل: الرياض، السعودية"
                    className="text-right"
                  />
                </div>

                {/* النبذة التعريفية */}
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-foreground font-medium">
                    النبذة التعريفية *
                  </Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="اكتب نبذة مختصرة عن خبرتك ومهاراتك..."
                    rows={4}
                    className="text-right resize-none"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* القسم الثاني: الخدمات */}
            <Card className="border shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">الخدمات المقدّمة</CardTitle>
                <CardDescription>
                  اذكر الخدمات التي تقدمها لعملائك
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileData.services.map((service, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={service}
                      onChange={(e) => updateService(index, e.target.value)}
                      placeholder="مثل: تصميم مواقع ويب، ترجمة، كتابة محتوى"
                      className="text-right"
                      required={index === 0}
                    />
                    {profileData.services.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeService(index)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addService}
                  className="w-full"
                >
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة خدمة
                </Button>
              </CardContent>
            </Card>

            {/* القسم الثالث: أبرز العملاء */}
            <Card className="border shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">أبرز العملاء (اختياري)</CardTitle>
                <CardDescription>
                  اذكر أسماء أهم العملاء الذين عملت معهم
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileData.topClients.map((client, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={client}
                      onChange={(e) => updateClient(index, e.target.value)}
                      placeholder="اسم العميل أو الشركة"
                      className="text-right"
                    />
                    {profileData.topClients.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeClient(index)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addClient}
                  className="w-full"
                >
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة عميل
                </Button>
              </CardContent>
            </Card>

            {/* القسم الرابع: وسائل التواصل */}
            <Card className="border shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">وسائل التواصل</CardTitle>
                <CardDescription>
                  أضف روابط حساباتك ووسائل التواصل
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Instagram */}
                <div className="space-y-2">
                  <Label htmlFor="instagram" className="text-foreground font-medium flex items-center">
                    <Instagram className="ml-2 h-4 w-4" />
                    حساب إنستقرام
                  </Label>
                  <Input
                    id="instagram"
                    value={profileData.instagram}
                    onChange={(e) => setProfileData(prev => ({ ...prev, instagram: e.target.value }))}
                    placeholder="@username"
                    className="text-left"
                  />
                </div>

                {/* Twitter/X */}
                <div className="space-y-2">
                  <Label htmlFor="twitter" className="text-foreground font-medium flex items-center">
                    <Twitter className="ml-2 h-4 w-4" />
                    حساب X (تويتر)
                  </Label>
                  <Input
                    id="twitter"
                    value={profileData.twitter}
                    onChange={(e) => setProfileData(prev => ({ ...prev, twitter: e.target.value }))}
                    placeholder="@username"
                    className="text-left"
                  />
                </div>

                {/* بريد العمل */}
                <div className="space-y-2">
                  <Label htmlFor="workEmail" className="text-foreground font-medium flex items-center">
                    <Mail className="ml-2 h-4 w-4" />
                    بريد إلكتروني للعمل *
                  </Label>
                  <Input
                    id="workEmail"
                    type="email"
                    value={profileData.workEmail}
                    onChange={(e) => setProfileData(prev => ({ ...prev, workEmail: e.target.value }))}
                    placeholder="work@example.com"
                    className="text-left"
                    required
                  />
                </div>

                {/* رابط خارجي */}
                <div className="space-y-2">
                  <Label htmlFor="externalLink" className="text-foreground font-medium flex items-center">
                    <LinkIcon className="ml-2 h-4 w-4" />
                    رابط خارجي (اختياري)
                  </Label>
                  <Input
                    id="externalLink"
                    value={profileData.externalLink}
                    onChange={(e) => setProfileData(prev => ({ ...prev, externalLink: e.target.value }))}
                    placeholder="https://example.com"
                    className="text-left"
                  />
                  <p className="text-xs text-muted-foreground">
                    مثل: موقعك الشخصي، معرض أعمالك، أو أي رابط مهم
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* القسم الخامس: إعدادات الحجز */}
            <Card className="border shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">إعدادات الحجز</CardTitle>
                <CardDescription>
                  حدد الأوقات المتاحة لاستقبال الاجتماعات
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* الأيام المتاحة */}
                <div className="space-y-4">
                  <Label className="text-foreground font-medium">
                    الأيام المتاحة للاجتماعات *
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {days.map((day) => (
                      <div key={day.value} className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                          id={day.value}
                          checked={profileData.availableDays.includes(day.value)}
                          onCheckedChange={() => toggleDay(day.value)}
                        />
                        <Label
                          htmlFor={day.value}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {day.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* الفترة الزمنية */}
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">
                    الفترة الزمنية *
                  </Label>
                  <Select
                    value={profileData.timeSlot}
                    onValueChange={(value) => setProfileData(prev => ({ ...prev, timeSlot: value }))}
                  >
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="اختر الفترة المناسبة" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    ستطبق هذه الفترة على جميع الأيام المختارة
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* أزرار الإجراءات */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                className="flex-1" 
                variant="hero"
                size="lg"
              >
                إنشاء الملف
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate("/signup")}
              >
                العودة
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;