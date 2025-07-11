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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowRight, Upload, User, Instagram, Twitter, Mail, Link as LinkIcon, Plus, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { LoadingPage, Loading } from "@/components/ui/loading";

const CreateProfile = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    fullName: "",
    username: "",
    bio: "",
    profileImage: "",
    emoji: "",
    services: [""],
    topClients: [""],
    instagram: "",
    twitter: "",
    workEmail: "",
    externalLink: "",
    availableDays: [] as string[],
    timeSlot: "",
    phone: "",
    location: "",
    profession: "",
    experienceYears: null as number | null,
    linkedinUrl: "",
    githubUrl: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [user, loading, navigate]);

  // Load existing profile data for editing
  useEffect(() => {
    const loadProfileData = async () => {
      if (user) {
        try {
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (existingProfile) {
            // User has existing profile, load it for editing
            setIsEditing(true);
            setProfileData({
              fullName: existingProfile.full_name || "",
              username: existingProfile.username || "",
              bio: existingProfile.bio || "",
              profileImage: existingProfile.avatar_url || "",
              emoji: existingProfile.emoji || "",
              services: existingProfile.skills && existingProfile.skills.length > 0 ? existingProfile.skills : [""],
              topClients: existingProfile.featured_clients && existingProfile.featured_clients.length > 0 ? existingProfile.featured_clients : [""],
              instagram: existingProfile.instagram_url ? existingProfile.instagram_url.replace('https://instagram.com/', '').replace('https://www.instagram.com/', '') : "",
              twitter: existingProfile.twitter_url ? existingProfile.twitter_url.replace('https://x.com/', '').replace('https://twitter.com/', '') : "",
              workEmail: existingProfile.contact_email || user.email || "",
              externalLink: existingProfile.website || "",
              availableDays: ["sunday", "tuesday", "thursday"], // Default available days
              timeSlot: "evening", // Default time slot
              phone: existingProfile.phone || "",
              location: existingProfile.location || "",
              profession: existingProfile.profession || "",
              experienceYears: existingProfile.experience_years || null,
              linkedinUrl: existingProfile.linkedin_url || "",
              githubUrl: existingProfile.github_url || ""
            });
          } else {
            // No existing profile, load user data from auth
            setProfileData(prev => ({
              ...prev,
              fullName: user.user_metadata?.full_name || "",
              username: user.user_metadata?.username || "",
              workEmail: user.email || ""
            }));
          }
        } catch (error) {
          console.log('No existing profile found, proceeding with creation');
          // Load user data from auth for new profile
          setProfileData(prev => ({
            ...prev,
            fullName: user.user_metadata?.full_name || "",
            username: user.user_metadata?.username || "",
            workEmail: user.email || ""
          }));
        }
      }
    };

    if (user && !loading) {
      loadProfileData();
    }
  }, [user, loading]);

  if (loading) {
    return (
      <LoadingPage 
        text={t('loading')}
        variant="line"
      />
    );
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

      // Process social media URLs
      const processUsername = (username: string, platform: string) => {
        if (!username || username.trim() === "") return null;
        const cleanUsername = username.replace(/^@/, "").trim();
        if (platform === "instagram") {
          return `https://instagram.com/${cleanUsername}`;
        } else if (platform === "twitter") {
          return `https://x.com/${cleanUsername}`;
        }
        return null;
      };

      // Create or update profile
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          username: profileData.username,
          full_name: profileData.fullName,
          bio: profileData.bio,
          contact_email: profileData.workEmail,
          phone: profileData.phone || null,
          location: profileData.location || null,
          profession: profileData.profession || null,
          skills: services.length > 0 ? services : null,
          featured_clients: topClients.length > 0 ? topClients : null,
          experience_years: profileData.experienceYears || null,
          linkedin_url: profileData.linkedinUrl || null,
          github_url: profileData.githubUrl || null,
          instagram_url: processUsername(profileData.instagram, "instagram"),
          twitter_url: processUsername(profileData.twitter, "twitter"),
          website: profileData.externalLink || null,
          avatar_url: profileData.profileImage || null,
          emoji: profileData.emoji || null
        }, {
          onConflict: 'user_id'
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

      // Verify the profile was created and get the correct username
      const { data: createdProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('username')
        .eq('user_id', user.id)
        .single();

      if (fetchError || !createdProfile) {
        console.error('Error fetching created profile:', fetchError);
        toast({
          variant: "destructive",
          title: "خطأ في الوصول للملف",
          description: "تم إنشاء الملف ولكن حدث خطأ في الانتقال إليه"
        });
        return;
      }

      toast({
        title: isEditing ? "تم تحديث ملفك بنجاح!" : "تم إنشاء ملفك بنجاح!",
        description: isEditing ? "تم حفظ التغييرات على ملفك الشخصي" : "يمكنك الآن مشاركة ملفك مع العملاء"
      });
      
      // الانتقال إلى صفحة الملف الشخصي باستخدام اسم المستخدم المحفوظ
      navigate(`/profile/${createdProfile.username}`);
      
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

  // الإيموجيات المقترحة (أول 3)
  const suggestedEmojis = ["😊", "🚀", "💎"];
  
  // كل الإيموجيات منظمة بفئات
  const emojiCategories = {
    "الوجوه": ["😊", "😎", "🤓", "😇", "🥳", "🤗", "🙂", "😌", "😍", "🤩"],
    "النشاطات": ["🚀", "⭐", "🔥", "💪", "⚡", "🎯", "🏆", "🎨", "💻", "📱"],
    "الرموز": ["💎", "👑", "🌟", "✨", "🎭", "🎪", "🎨", "🔮", "💝", "🎁"],
    "الطبيعة": ["🌈", "🌸", "🌺", "🌻", "🍀", "🌿", "🌱", "🦋", "🐝", "🌙"]
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* الرأس */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 space-x-reverse mb-6">
            <div className="w-6 h-6 flex items-center justify-center">
              {/* Logo for light mode (black) */}
              <img 
                src="/lovable-uploads/be1d2269-8206-422b-a395-e4fb9e1a88cc.png" 
                alt="ملف" 
                className="w-full h-full object-contain dark:hidden"
              />
              {/* Logo for dark mode (white) */}
              <img 
                src="/lovable-uploads/822b255a-0cfa-4520-b9a5-aa69e7ef91e6.png" 
                alt="ملف" 
                className="w-full h-full object-contain hidden dark:block"
              />
            </div>
            <span className="text-xl font-bold text-foreground">malaf</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isEditing ? "تحرير الملف الشخصي" : t('createProfileTitle')}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "قم بتحديث معلوماتك الشخصية" : t('createProfileDesc')}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* القسم الأول: المعلومات الأساسية */}
            <Card className="border shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">{t('basicInfo')}</CardTitle>
                <CardDescription>
                  {t('basicInfoDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 {/* الصورة الشخصية */}
                <div className="space-y-4">
                  <Label className="text-foreground font-medium">{t('profileImage')}</Label>
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="relative">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={profileData.profileImage} />
                        <AvatarFallback className="bg-gradient-primary text-white">
                          <User className="w-8 h-8" />
                        </AvatarFallback>
                      </Avatar>
                      {profileData.emoji && (
                        <div className="absolute -top-1 -right-1 w-8 h-8 bg-background border-2 border-background rounded-full flex items-center justify-center text-lg shadow-sm">
                          {profileData.emoji}
                        </div>
                      )}
                    </div>
                    <div>
                      <Button type="button" variant="outline" className="relative overflow-hidden">
                        <Upload className="ml-2 h-4 w-4" />
                        {t('chooseImage')}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('professionalImageNote')}
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

                {/* اختيار الإيموجي */}
                <div className="space-y-3">
                  <Label className="text-foreground font-medium">
                    اختر إيموجي يعبر عنك (اختياري)
                  </Label>
                  <div className="flex items-center gap-2">
                    {/* الإيموجيات المقترحة */}
                    {suggestedEmojis.map((emoji) => (
                      <Button
                        key={emoji}
                        type="button"
                        variant={profileData.emoji === emoji ? "default" : "outline"}
                        size="sm"
                        className="w-10 h-10 p-0 text-lg"
                        onClick={() => setProfileData(prev => ({ 
                          ...prev, 
                          emoji: prev.emoji === emoji ? "" : emoji 
                        }))}
                      >
                        {emoji}
                      </Button>
                    ))}
                    
                    {/* زر المزيد */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-10 h-10 p-0 hover:bg-gradient-primary hover:text-white transition-all duration-200"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent 
                        className="w-72 p-0 bg-background/95 backdrop-blur-md border shadow-xl rounded-xl z-50" 
                        align="center"
                        side="bottom"
                        sideOffset={8}
                        avoidCollisions={true}
                        collisionPadding={16}
                      >
                        <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-accent/5 rounded-t-xl">
                          <h4 className="font-semibold text-sm text-center text-foreground">اختر إيموجي مميز</h4>
                          <p className="text-xs text-muted-foreground text-center mt-1">اختر ما يعبر عن شخصيتك</p>
                        </div>
                        
                        <div className="max-h-80 overflow-y-auto overscroll-contain p-4 space-y-4">
                          {Object.entries(emojiCategories).map(([category, emojis]) => (
                            <div key={category} className="space-y-3">
                              <div className="flex items-center gap-2">
                                <div className="h-px bg-gradient-primary flex-1"></div>
                                <h5 className="text-xs font-medium text-primary px-2 bg-background rounded-full">
                                  {category}
                                </h5>
                                <div className="h-px bg-gradient-primary flex-1"></div>
                              </div>
                              <div className="grid grid-cols-8 gap-2">
                                {emojis.map((emoji) => (
                                  <Button
                                    key={emoji}
                                    type="button"
                                    variant={profileData.emoji === emoji ? "default" : "ghost"}
                                    size="sm"
                                    className={`w-9 h-9 p-0 text-lg rounded-lg hover:scale-110 transition-all duration-200 ${
                                      profileData.emoji === emoji 
                                        ? "bg-gradient-primary text-white shadow-md ring-2 ring-primary/20" 
                                        : "hover:bg-gradient-primary/10 hover:shadow-sm"
                                    }`}
                                    onClick={() => setProfileData(prev => ({ 
                                      ...prev, 
                                      emoji: prev.emoji === emoji ? "" : emoji 
                                    }))}
                                  >
                                    {emoji}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {profileData.emoji && (
                          <div className="p-4 border-t bg-muted/30 rounded-b-xl">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
                              onClick={() => setProfileData(prev => ({ ...prev, emoji: "" }))}
                            >
                              <X className="h-4 w-4 ml-2" />
                              إزالة الإيموجي
                            </Button>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    سيظهر الإيموجي بجانب صورتك الشخصية
                  </p>
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
                    placeholder="username (بدون @)"
                    className="text-left"
                  />
                  <p className="text-xs text-muted-foreground">
                    سيتم إنشاء الرابط: instagram.com/{profileData.instagram || "username"}
                  </p>
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
                    placeholder="username (بدون @)"
                    className="text-left"
                  />
                  <p className="text-xs text-muted-foreground">
                    سيتم إنشاء الرابط: x.com/{profileData.twitter || "username"}
                  </p>
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
                      <Button
                        key={day.value}
                        type="button"
                        variant={profileData.availableDays.includes(day.value) ? "default" : "outline"}
                        className={`h-12 relative transition-all duration-200 hover:scale-105 ${
                          profileData.availableDays.includes(day.value)
                            ? "bg-gradient-primary text-white shadow-md ring-2 ring-primary/20 border-primary"
                            : "hover:bg-gradient-primary/10 hover:border-primary/30"
                        }`}
                        onClick={() => toggleDay(day.value)}
                      >
                        <span className="font-medium">{day.label}</span>
                        {profileData.availableDays.includes(day.value) && (
                          <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-scale-in"></div>
                        )}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    اختر الأيام التي تكون متاحاً فيها لاستقبال الاجتماعات
                  </p>
                </div>

                {/* الفترة الزمنية */}
                <div className="space-y-4">
                  <Label className="text-foreground font-medium">
                    الفترة الزمنية *
                  </Label>
                  <div className="grid grid-cols-1 gap-3">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.value}
                        type="button"
                        variant={profileData.timeSlot === slot.value ? "default" : "outline"}
                        className={`h-14 justify-start text-right transition-all duration-200 hover:scale-105 ${
                          profileData.timeSlot === slot.value
                            ? "bg-gradient-primary text-white shadow-md ring-2 ring-primary/20 border-primary"
                            : "hover:bg-gradient-primary/10 hover:border-primary/30"
                        }`}
                        onClick={() => setProfileData(prev => ({ ...prev, timeSlot: slot.value }))}
                      >
                        <span className="font-medium">{slot.label}</span>
                        {profileData.timeSlot === slot.value && (
                          <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full animate-scale-in"></div>
                        )}
                      </Button>
                    ))}
                  </div>
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
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loading variant="spinner" size="sm" />
                    {isEditing ? "جاري حفظ التغييرات..." : "جاري إنشاء الملف..."}
                  </div>
                ) : (
                  isEditing ? "حفظ التغييرات" : "إنشاء الملف الشخصي"
                )}
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