import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { 
  Copy, 
  Edit, 
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
  Globe,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

type Profile = Tables<'profiles'>;

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showAlternativeBooking, setShowAlternativeBooking] = useState(false);
  const [alternativeDay, setAlternativeDay] = useState("");
  const [alternativeTimeSlot, setAlternativeTimeSlot] = useState("");
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });
  const { toast } = useToast();

  // Day labels
  const dayLabels = {
    sunday: "الأحد",
    monday: "الاثنين", 
    tuesday: "الثلاثاء",
    wednesday: "الأربعاء",
    thursday: "الخميس",
    friday: "الجمعة",
    saturday: "السبت"
  };

  // Time slot labels
  const timeSlotLabels = {
    morning: "الصباح (8:00 ص - 12:00 م)",
    afternoon: "بعد الظهر (12:00 م - 5:00 م)", 
    evening: "المساء (5:00 م - 9:00 م)"
  };

  // Get current time slots based on selected day
  const getCurrentTimeSlots = () => {
    return ["5:00 م", "6:00 م", "7:00 م", "8:00 م"];
  };

  // Load profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) {
        navigate('/');
        return;
      }

      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .eq('is_public', true)
          .maybeSingle();

        if (error || !profileData) {
          console.error('Profile not found:', error);
          navigate('/');
          return;
        }

        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, navigate]);

  const copyLink = () => {
    const profileUrl = `${window.location.origin}/${username}`;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "تم نسخ الرابط",
      description: "تم نسخ رابط الملف الشخصي بنجاح",
    });
  };

  const handleBooking = async () => {
    if (!profile?.id) return;

    try {
      // Validate form data
      if (!bookingForm.name || !bookingForm.email) {
        toast({
          variant: "destructive",
          title: "بيانات ناقصة",
          description: "يرجى ملء جميع الحقول المطلوبة",
        });
        return;
      }

      // Check if date/time is selected
      if (!showAlternativeBooking && (!selectedDay || !selectedTime)) {
        toast({
          variant: "destructive",
          title: "موعد غير محدد",
          description: "يرجى اختيار يوم ووقت للاجتماع",
        });
        return;
      }

      if (showAlternativeBooking && (!alternativeDay || !alternativeTimeSlot)) {
        toast({
          variant: "destructive",
          title: "موعد غير محدد",
          description: "يرجى اختيار يوم وفترة مقترحة",
        });
        return;
      }

      const bookingData = {
        profile_id: profile.id,
        client_name: bookingForm.name,
        client_email: bookingForm.email,
        preferred_contact: bookingForm.phone || null,
        notes: bookingForm.notes || null,
        is_alternative_request: showAlternativeBooking,
        requested_day: showAlternativeBooking ? null : selectedDay,
        requested_time: showAlternativeBooking ? null : selectedTime,
        suggested_day: showAlternativeBooking ? alternativeDay : null,
        suggested_time_slot: showAlternativeBooking ? alternativeTimeSlot : null,
        status: 'pending'
      };

      const { error } = await supabase
        .from('bookings')
        .insert([bookingData]);

      if (error) {
        console.error('Booking error:', error);
        toast({
          variant: "destructive",
          title: "خطأ في الحجز",
          description: "حدث خطأ أثناء إرسال طلب الحجز. يرجى المحاولة مرة أخرى.",
        });
        return;
      }

      toast({
        title: "تم إرسال طلب الحجز بنجاح!",
        description: showAlternativeBooking 
          ? "تم إرسال اقتراح الموعد وسيتم الرد عليك قريباً"
          : "تم تأكيد حجز الاجتماع وسيتم التواصل معك",
      });

      // Reset form
      setBookingForm({ name: "", email: "", phone: "", notes: "" });
      setSelectedDay("");
      setSelectedTime("");
      setAlternativeDay("");
      setAlternativeTimeSlot("");
      setShowAlternativeBooking(false);

    } catch (error) {
      console.error('Booking error:', error);
      toast({
        variant: "destructive",
        title: "خطأ في الحجز",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">جارٍ التحميل...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">الملف الشخصي غير موجود</h1>
          <p className="text-muted-foreground mb-6">عذراً، لم نتمكن من العثور على هذا الملف الشخصي</p>
          <Button onClick={() => navigate('/')} variant="outline">
            العودة للرئيسية
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 max-w-4xl py-8">
        
        {/* بطاقة المعلومات الرئيسية - صورة + اسم + نبذة + رابط */}
        <Card className="border border-border rounded-3xl shadow-soft hover:shadow-medium transition-smooth mb-8 animate-fade-in hover-scale">
          <CardContent className="p-8 lg:p-12 text-center">
            {/* صورة الملف الشخصي */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Avatar className="w-24 h-24 lg:w-32 lg:h-32 border border-border/10 shadow-soft">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl lg:text-3xl font-light bg-gradient-primary text-white">
                    <User className="w-10 h-10 lg:w-14 lg:h-14" />
                  </AvatarFallback>
                </Avatar>
                {profile.emoji && (
                  <div className="absolute -top-1 -right-1 w-8 h-8 lg:w-10 lg:h-10 bg-background border-2 border-background rounded-full flex items-center justify-center text-lg lg:text-xl shadow-sm">
                    {profile.emoji}
                  </div>
                )}
              </div>
            </div>

            {/* الاسم */}
            <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-3 tracking-tight">
              {profile.full_name || profile.username}
            </h1>

            {/* رابط الملف الشخصي + زر النسخ */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground font-mono">
                malaf.me/{profile.username}
              </span>
              <Button variant="ghost" size="sm" onClick={copyLink} className="h-6 w-6 p-0">
                <Copy className="h-3 w-3" />
              </Button>
            </div>

            {/* النبذة التعريفية */}
            {profile.bio && (
              <p className="text-base lg:text-lg font-light text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-6">
                {profile.bio}
              </p>
            )}

            {/* معلومات إضافية */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {profile.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{profile.location}</span>
                </div>
              )}
              {profile.profession && (
                <div className="text-sm text-muted-foreground">
                  {profile.profession}
                </div>
              )}
            </div>

            {/* زر تحرير - يظهر فقط لصاحب الملف */}
            {profile.user_id === useAuth().user?.id && (
              <div className="mt-6">
                <Button variant="outline" onClick={() => navigate('/create-profile')}>
                  <Edit className="ml-2 h-4 w-4" />
                  تحرير الملف
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* بطاقة الخدمات */}
        {profile.skills && profile.skills.length > 0 && (
          <Card className="border border-border rounded-3xl shadow-soft hover:shadow-medium transition-smooth mb-8 animate-fade-in hover-scale" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-10 lg:p-12">
              <div className="bg-background/80 backdrop-blur-sm border border-border/30 rounded-2xl shadow-sm mb-8 overflow-hidden">
                <div className="p-4 bg-muted/20">
                  <h2 className="text-xl lg:text-2xl font-semibold text-foreground tracking-tight text-center">
                    الخدمات
                  </h2>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {profile.skills.map((skill, index) => (
                  <div 
                    key={index} 
                    className="aspect-square flex items-center justify-center p-4 rounded-2xl bg-background/60 hover:bg-background/80 backdrop-blur-sm transition-all duration-200 border border-border/20 hover:border-border/40 cursor-default shadow-sm hover:shadow-md hover-scale"
                  >
                    <span className="text-sm md:text-base font-medium text-foreground text-center leading-tight">
                      {skill}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* بطاقة أبرز العملاء */}
        {profile.featured_clients && profile.featured_clients.length > 0 && (
          <Card className="border border-border rounded-3xl shadow-soft hover:shadow-medium transition-smooth mb-8 animate-fade-in hover-scale" style={{ animationDelay: '0.15s' }}>
            <CardContent className="p-10 lg:p-12">
              <div className="bg-background/80 backdrop-blur-sm border border-border/30 rounded-2xl shadow-sm mb-8 overflow-hidden">
                <div className="p-4 bg-muted/20">
                  <h2 className="text-xl lg:text-2xl font-semibold text-foreground tracking-tight text-center">
                    أبرز العملاء
                  </h2>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.featured_clients.map((client, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-center p-6 rounded-2xl bg-background/60 hover:bg-background/80 backdrop-blur-sm transition-all duration-200 border border-border/20 hover:border-border/40 cursor-default shadow-sm hover:shadow-md hover-scale"
                  >
                    <span className="text-base font-medium text-foreground text-center leading-relaxed">
                      {client}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* بطاقة حجز الاجتماع - بارزة ومخصصة */}
        <Card className="border border-primary/30 rounded-3xl shadow-xl hover:shadow-2xl transition-smooth mb-8 bg-background/40 backdrop-blur-xl animate-fade-in hover-scale" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-8 lg:p-10">
            <div className="text-center mb-8">
              <div className="bg-background/80 backdrop-blur-sm border border-border/30 rounded-2xl shadow-sm mb-6 overflow-hidden">
                <div className="p-4 bg-muted/20">
                  <h2 className="text-xl lg:text-2xl font-semibold text-foreground tracking-tight">
                    احجز اجتماع
                  </h2>
                </div>
              </div>
              <p className="text-lg text-muted-foreground">
                اختر الوقت المناسب لك ودعنا نناقش مشروعك
              </p>
            </div>

            {/* زر الحجز الرئيسي */}
            <div className="text-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-4 rounded-full font-medium transition-smooth shadow-soft hover:shadow-medium"
                  >
                    <CalendarIcon className="w-5 h-5 ml-2" />
                    احجز الآن
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border border-border/20 shadow-elegant bg-white rounded-3xl relative [&>button]:hidden fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50">
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50/30 rounded-3xl"></div>
                  
                  {/* زر الإغلاق في الزاوية اليمين */}
                  <DialogClose asChild>
                    <button className="absolute top-6 right-6 z-20 w-12 h-12 rounded-xl border-2 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 group">
                      <X className="w-6 h-6 text-gray-700 group-hover:text-gray-900 transition-colors" />
                    </button>
                  </DialogClose>

                  <div className="relative z-10 pt-4">
                    <DialogHeader className="text-center pb-6">
                      <div className="glass-soft rounded-2xl shadow-soft mb-4 overflow-hidden border border-primary/20 bg-primary/5">
                        <div className="p-4 bg-gradient-to-r from-primary/20 to-primary/20 backdrop-blur-sm">
                          <DialogTitle className="text-xl lg:text-2xl font-semibold text-foreground tracking-tight">
                            حجز اجتماع جديد
                          </DialogTitle>
                        </div>
                      </div>
                      <DialogDescription className="text-base text-muted-foreground">
                        اختر الموعد المناسب لك أو اقترح موعد مختلف لمناقشة مشروعك
                      </DialogDescription>
                    </DialogHeader>
                  <div className="space-y-8">
                    {!showAlternativeBooking ? (
                      <>
                        {/* الأوقات المتاحة */}
                        <Card className="glass-soft border border-primary/30 bg-primary/5 backdrop-blur-sm">
                          <CardContent className="p-6 relative">{/* Add "relative" to ensure backdrop-filter applies correctly */}
                            <div className="text-center mb-4">
                              <h4 className="text-lg font-semibold text-foreground mb-2">الأوقات المتاحة</h4>
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/80 rounded-full border border-border/30">
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="text-sm text-muted-foreground">المساء (5:00 م - 9:00 م)</span>
                              </div>
                            </div>
                            
                            <div className="space-y-6">
                              {/* اختيار اليوم */}
                              <div className="space-y-4">
                                <Label className="text-base font-medium">اختر اليوم المناسب</Label>
                                <div className="grid grid-cols-3 gap-3">
                                  {["sunday", "tuesday", "thursday"].map((day) => (
                                    <button
                                      key={day}
                                      type="button"
                                      onClick={() => setSelectedDay(day)}
                                      className={cn(
                                        "p-4 rounded-xl border-2 transition-all duration-200 text-center hover:shadow-md",
                                        selectedDay === day
                                          ? "border-primary bg-primary/10 shadow-soft"
                                          : "border-border/40 bg-background/60 hover:border-border/60"
                                      )}
                                    >
                                      <div className="text-sm font-medium text-foreground">
                                        {dayLabels[day as keyof typeof dayLabels]}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* اختيار الوقت */}
                              {selectedDay && (
                                <div className="space-y-4 animate-fade-in">
                                  <Label className="text-base font-medium">اختر الوقت المناسب</Label>
                                  <div className="grid grid-cols-2 gap-3">
                                    {getCurrentTimeSlots().map((time) => (
                                      <button
                                        key={time}
                                        type="button"
                                        onClick={() => setSelectedTime(time)}
                                        className={cn(
                                          "p-4 rounded-xl border-2 transition-all duration-200 text-center hover:shadow-md",
                                          selectedTime === time
                                            ? "border-primary bg-primary/10 shadow-soft"
                                            : "border-border/40 bg-background/60 hover:border-border/60"
                                        )}
                                      >
                                        <div className="text-sm font-medium text-foreground">
                                          {time}
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* رابط اقتراح موعد مختلف */}
                            <div className="text-center mt-6">
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowAlternativeBooking(true)}
                                className="text-primary hover:bg-primary/10 rounded-full px-6"
                              >
                                أو اقترح موعد مختلف
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    ) : (
                      <>
                        {/* اقتراح موعد مختلف */}
                        <Card className="glass-soft border border-accent/30 bg-accent/5 backdrop-blur-sm">
                          <CardContent className="p-6 relative">
                            <div className="text-center mb-6">
                              <h4 className="text-lg font-semibold text-foreground mb-2">اقتراح موعد مختلف</h4>
                              <p className="text-sm text-muted-foreground bg-background/80 rounded-full px-4 py-2 inline-block">
                                اقترح يوم وفترة مناسبة لك، وسيتم مراجعة طلبك والرد عليك
                              </p>
                            </div>
                            
                            <div className="space-y-6">
                              {/* اختيار يوم مختلف */}
                              <div className="space-y-4">
                                <Label className="text-base font-medium">اليوم المقترح</Label>
                                <div className="grid grid-cols-2 gap-3">
                                  {Object.entries(dayLabels).map(([value, label]) => (
                                    <button
                                      key={value}
                                      type="button"
                                      onClick={() => setAlternativeDay(value)}
                                      className={cn(
                                        "p-4 rounded-xl border-2 transition-all duration-200 text-center hover:shadow-md",
                                        alternativeDay === value
                                          ? "border-accent bg-accent/10 shadow-soft"
                                          : "border-border/40 bg-background/60 hover:border-border/60"
                                      )}
                                    >
                                      <div className="text-sm font-medium text-foreground">
                                        {label}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* اختيار فترة مختلفة */}
                              {alternativeDay && (
                                <div className="space-y-4 animate-fade-in">
                                  <Label className="text-base font-medium">الفترة المقترحة</Label>
                                  <div className="space-y-3">
                                    {Object.entries(timeSlotLabels).map(([value, label]) => (
                                      <button
                                        key={value}
                                        type="button"
                                        onClick={() => setAlternativeTimeSlot(value)}
                                        className={cn(
                                          "w-full p-4 rounded-xl border-2 transition-all duration-200 text-center hover:shadow-md",
                                          alternativeTimeSlot === value
                                            ? "border-accent bg-accent/10 shadow-soft"
                                            : "border-border/40 bg-background/60 hover:border-border/60"
                                        )}
                                      >
                                        <div className="text-sm font-medium text-foreground">
                                          {label}
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* رابط العودة للحجز العادي */}
                            <div className="text-center mt-6">
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowAlternativeBooking(false)}
                                className="text-muted-foreground hover:bg-muted/20 rounded-full px-6"
                              >
                                العودة للأوقات المتاحة
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}

                    {/* بيانات العميل */}
                    <Card className="glass-soft border border-border/30 backdrop-blur-sm">
                      <CardContent className="p-6 relative">
                        <div className="bg-background/80 backdrop-blur-sm border border-border/30 rounded-2xl shadow-sm mb-6 overflow-hidden">
                          <div className="p-3 bg-muted/20">
                            <h4 className="text-lg font-semibold text-foreground text-center">بياناتك</h4>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label htmlFor="name" className="text-base font-medium">الاسم *</Label>
                            <Input
                              id="name"
                              value={bookingForm.name}
                              onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="اسمك الكامل"
                              className="h-12 text-right bg-background/60 border border-border/40 rounded-xl"
                              required
                            />
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="email" className="text-base font-medium">البريد الإلكتروني *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={bookingForm.email}
                              onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="email@example.com"
                              className="h-12 text-right bg-background/60 border border-border/40 rounded-xl"
                              required
                            />
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="phone" className="text-base font-medium">رقم الجوال</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={bookingForm.phone || ""}
                              onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="05xxxxxxxx"
                              className="h-12 text-right bg-background/60 border border-border/40 rounded-xl"
                            />
                          </div>

                          <div className="space-y-3 md:col-span-2">
                            <Label htmlFor="notes" className="text-base font-medium">ملاحظات إضافية</Label>
                            <Textarea
                              id="notes"
                              value={bookingForm.notes}
                              onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                              placeholder="اكتب تفاصيل المشروع أو أي ملاحظات خاصة..."
                              className="min-h-[100px] text-right bg-background/60 border border-border/40 rounded-xl resize-none"
                            />
                          </div>
                        </div>

                        {/* زر الإرسال */}
                        <div className="text-center mt-8">
                          <Button 
                            onClick={handleBooking}
                            disabled={!bookingForm.name || !bookingForm.email || (!selectedDay && !alternativeDay)}
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-medium transition-smooth shadow-soft hover:shadow-medium min-w-[200px]"
                          >
                            <CheckCircle className="w-5 h-5 ml-2" />
                            {showAlternativeBooking ? "إرسال الاقتراح" : "تأكيد الحجز"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* وسائل التواصل */}
        {(profile.contact_email || profile.phone || profile.website || profile.instagram_url || profile.twitter_url || profile.linkedin_url || profile.github_url) && (
          <Card className="border border-border rounded-3xl shadow-soft hover:shadow-medium transition-smooth mb-8 animate-fade-in hover-scale" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-10 lg:p-12">
              <div className="bg-background/80 backdrop-blur-sm border border-border/30 rounded-2xl shadow-sm mb-8 overflow-hidden">
                <div className="p-4 bg-muted/20">
                  <h2 className="text-xl lg:text-2xl font-semibold text-foreground tracking-tight text-center">
                    تواصل معي
                  </h2>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {profile.contact_email && (
                  <a 
                    href={`mailto:${profile.contact_email}`}
                    className="aspect-square flex flex-col items-center justify-center p-4 rounded-2xl bg-background/60 hover:bg-background/80 backdrop-blur-sm transition-all duration-200 border border-border/20 hover:border-border/40 group shadow-sm hover:shadow-md hover-scale"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-smooth">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs text-foreground text-center font-medium">البريد</span>
                  </a>
                )}

                {profile.website && (
                  <a 
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square flex flex-col items-center justify-center p-4 rounded-2xl bg-background/60 hover:bg-background/80 backdrop-blur-sm transition-all duration-200 border border-border/20 hover:border-border/40 group shadow-sm hover:shadow-md"
                  >
                    <div className="w-8 h-8 bg-secondary/30 rounded-full flex items-center justify-center mb-2 group-hover:bg-secondary/50 transition-smooth">
                      <Globe className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <span className="text-xs text-foreground text-center font-medium">الموقع</span>
                  </a>
                )}

                {profile.instagram_url && (
                  <a 
                    href={profile.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square flex flex-col items-center justify-center p-4 rounded-2xl bg-background/60 hover:bg-background/80 backdrop-blur-sm transition-all duration-200 border border-border/20 hover:border-border/40 group shadow-sm hover:shadow-md"
                  >
                    <div className="w-8 h-8 bg-accent/30 rounded-full flex items-center justify-center mb-2 group-hover:bg-accent/50 transition-smooth">
                      <Instagram className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <span className="text-xs text-foreground text-center font-medium">Instagram</span>
                  </a>
                )}

                {profile.twitter_url && (
                  <a 
                    href={profile.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square flex flex-col items-center justify-center p-4 rounded-2xl bg-background/60 hover:bg-background/80 backdrop-blur-sm transition-all duration-200 border border-border/20 hover:border-border/40 group shadow-sm hover:shadow-md"
                  >
                    <div className="w-8 h-8 bg-muted/50 rounded-full flex items-center justify-center mb-2 group-hover:bg-muted/70 transition-smooth">
                      <Twitter className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-xs text-foreground text-center font-medium">X</span>
                  </a>
                )}

                {profile.linkedin_url && (
                  <a 
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square flex flex-col items-center justify-center p-4 rounded-2xl bg-background/60 hover:bg-background/80 backdrop-blur-sm transition-all duration-200 border border-border/20 hover:border-border/40 group shadow-sm hover:shadow-md"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-smooth">
                      <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <span className="text-xs text-foreground text-center font-medium">LinkedIn</span>
                  </a>
                )}

                {profile.github_url && (
                  <a 
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square flex flex-col items-center justify-center p-4 rounded-2xl bg-background/60 hover:bg-background/80 backdrop-blur-sm transition-all duration-200 border border-border/20 hover:border-border/40 group shadow-sm hover:shadow-md"
                  >
                    <div className="w-8 h-8 bg-secondary/30 rounded-full flex items-center justify-center mb-2 group-hover:bg-secondary/50 transition-smooth">
                      <svg className="w-4 h-4 text-secondary-foreground" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <span className="text-xs text-foreground text-center font-medium">GitHub</span>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        )}

      </div>

      {/* شعار المنصة في أسفل الصفحة */}
      <footer className="border-t border-border/10 bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img 
              src="/lovable-uploads/be1d2269-8206-422b-a395-e4fb9e1a88cc.png" 
              alt="ملف" 
              className="w-6 h-6 dark:hidden"
            />
            <img 
              src="/lovable-uploads/822b255a-0cfa-4520-b9a5-aa69e7ef91e6.png" 
              alt="ملف" 
              className="w-6 h-6 hidden dark:block"
            />
            <span className="font-bold text-lg text-foreground">malaf</span>
          </div>
          <p className="text-sm text-muted-foreground">
            منصة إنشاء الملفات المهنية للفريلانسر
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UserProfile;