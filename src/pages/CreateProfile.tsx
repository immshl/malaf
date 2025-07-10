import { useState, useEffect } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const CreateProfile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    fullName: "",
    username: "",
    bio: "",
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
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [user, loading, navigate]);

  // Load user data from auth
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        fullName: user.user_metadata?.full_name || "",
        username: user.user_metadata?.username || "",
        workEmail: user.email || ""
      }));
    }
  }, [user]);

  if (loading) {
    return <div className="min-h-screen bg-muted/30 flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">جاري التحميل...</div>
    </div>;
  }

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من البيانات المطلوبة
    if (!profileData.availableDays.length || !profileData.timeSlot) {
      toast({
        variant: "destructive",
        title: "بيانات ناقصة",
        description: "يرجى تحديد الأيام المتاحة والفترة الزمنية للحجز"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Filter out empty services and clients
      const services = profileData.services.filter(service => service.trim() !== "");
      const topClients = profileData.topClients.filter(client => client.trim() !== "");

      // Create or update profile
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          username: profileData.username,
          full_name: profileData.fullName,
          bio: profileData.bio,
          contact_email: profileData.workEmail,
          instagram_url: profileData.instagram || null,
          twitter_url: profileData.twitter || null,
          website: profileData.externalLink || null,
          avatar_url: profileData.profileImage || null
        });

      if (error) {
        console.error('Error creating profile:', error);
        toast({
          variant: "destructive",
          title: "خطأ في إنشاء الملف",
          description: error.message
        });
        return;
      }

      toast({
        title: "تم إنشاء ملفك بنجاح!",
        description: "يمكنك الآن مشاركة ملفك مع العملاء"
      });
      
      // الانتقال إلى صفحة الملف الشخصي
      navigate(`/profile/${profileData.username}`);
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "خطأ غير متوقع",
        description: "حدث خطأ أثناء إنشاء الملف"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      try {
        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, file);

        if (uploadError) {
          toast({
            variant: "destructive",
            title: "خطأ في رفع الصورة",
            description: uploadError.message
          });
          return;
        }

        // Get public URL
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        setProfileData(prev => ({ ...prev, profileImage: data.publicUrl }));
        
        toast({
          title: "تم رفع الصورة بنجاح",
          description: "تم حفظ صورتك الشخصية"
        });
        
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          variant: "destructive", 
          title: "خطأ في رفع الصورة",
          description: "حدث خطأ أثناء رفع الصورة"
        });
      }
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
            <div className="w-8 h-8 flex items-center justify-center">
              <img 
                src="/lovable-uploads/053ffcb6-5dac-4834-a5ef-585d29be4be9.png" 
                alt="ملف" 
                className="w-full h-full object-contain"
              />
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
                disabled={isLoading}
              >
                {isLoading ? "جاري إنشاء الملف..." : "إنشاء الملف"}
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate("/")}
                disabled={isLoading}
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