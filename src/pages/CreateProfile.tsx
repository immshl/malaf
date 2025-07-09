import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Upload, User } from "lucide-react";

const CreateProfile = () => {
  const [profileData, setProfileData] = useState({
    fullName: "",
    username: "",
    bio: "",
    profession: "",
    location: "",
    profileImage: ""
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // مؤقت - سيتم ربطه بـ Supabase لاحقاً
    console.log("بيانات الملف:", profileData);
    alert("تم إنشاء ملفك بنجاح!");
    
    // الانتقال إلى لوحة التحكم
    navigate("/dashboard");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // مؤقت - سيتم رفعها إلى Supabase Storage لاحقاً
      const imageUrl = URL.createObjectURL(file);
      setProfileData(prev => ({ ...prev, profileImage: imageUrl }));
    }
  };

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

        <Card className="shadow-strong border-0">
          <CardHeader>
            <CardTitle className="text-xl">المعلومات الأساسية</CardTitle>
            <CardDescription>
              املأ البيانات التالية لإنشاء ملفك المهني
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  النبذة التعريفية
                </Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="اكتب نبذة مختصرة عن خبرتك ومهاراتك..."
                  rows={4}
                  className="text-right resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  نبذة مختصرة تعرّف بك وبخدماتك (اختيارية)
                </p>
              </div>

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
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateProfile;