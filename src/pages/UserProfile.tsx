import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Globe
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
    preferredContact: "",
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
          .single();

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
        preferred_contact: bookingForm.preferredContact || null,
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
      setBookingForm({ name: "", email: "", preferredContact: "", notes: "" });
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
        <Card className="border border-border/10 rounded-3xl shadow-soft hover:shadow-medium transition-smooth mb-8">
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
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-foreground mb-3 tracking-tight">
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
              <p className="text-lg font-light text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-6">
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
          <Card className="border border-border/10 rounded-3xl shadow-soft hover:shadow-medium transition-smooth mb-8">
            <CardContent className="p-10 lg:p-12">
              <h2 className="text-2xl lg:text-3xl font-light text-foreground mb-10 tracking-tight text-center">
                الخدمات
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {profile.skills.map((skill, index) => (
                  <div 
                    key={index} 
                    className="aspect-square flex items-center justify-center p-4 rounded-2xl bg-muted/10 hover:bg-muted/20 transition-all duration-200 border border-border/5 hover:border-border/20 cursor-default"
                  >
                    <span className="text-sm md:text-base font-light text-foreground text-center leading-tight">
                      {skill}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* بطاقة حجز الاجتماع - بارزة ومخصصة */}
        <Card className="border-2 border-primary/20 rounded-3xl shadow-strong hover:shadow-xl transition-smooth mb-8 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-8 lg:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-light text-foreground mb-4 tracking-tight">
                احجز اجتماع
              </h2>
              <p className="text-lg text-muted-foreground">
                اختر الوقت المناسب لك ودعنا نناقش مشروعك
              </p>
            </div>

            {/* المواعيد المتاحة */}
            <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-medium text-foreground mb-4 text-center">
                المواعيد المتاحة
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {["الأحد", "الثلاثاء", "الخميس"].map((day, dayIndex) => (
                  <div key={dayIndex} className="border border-border/10 rounded-xl p-4 bg-muted/5">
                    <h4 className="text-sm font-medium text-foreground mb-3 text-center">
                      {day}
                    </h4>
                    <div className="space-y-2">
                      {["5:00 م", "7:00 م", "8:00 م"].map((time, timeIndex) => (
                        <Button
                          key={timeIndex}
                          variant="outline"
                          size="sm"
                          className="w-full text-xs border-border/20 hover:bg-primary hover:text-primary-foreground transition-smooth"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>حجز اجتماع</DialogTitle>
                    <DialogDescription>
                      اختر الموعد المناسب لك أو اقترح موعد مختلف
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    {!showAlternativeBooking ? (
                      <>
                        {/* الحجز العادي */}
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">الأوقات المتاحة</h4>
                          <div className="text-sm text-muted-foreground mb-3">
                            <p>الفترة: المساء (5:00 م - 9:00 م)</p>
                          </div>
                        </div>

                        {/* اختيار اليوم */}
                        <div className="space-y-2">
                          <Label>اختر اليوم</Label>
                          <Select value={selectedDay} onValueChange={setSelectedDay}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر يوم من الأيام المتاحة" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {["sunday", "tuesday", "thursday"].map((day) => (
                                <SelectItem key={day} value={day}>
                                  {dayLabels[day as keyof typeof dayLabels]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* اختيار الوقت */}
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

                        {/* رابط اقتراح موعد مختلف */}
                        <div className="text-center">
                          <Button
                            type="button"
                            variant="link"
                            onClick={() => setShowAlternativeBooking(true)}
                            className="text-primary"
                          >
                            أو اقترح موعد مختلف
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* اقتراح موعد مختلف */}
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">اقتراح موعد مختلف</h4>
                          <p className="text-sm text-blue-700">
                            اقترح يوم وفترة مناسبة لك، وسيتم مراجعة طلبك والرد عليك
                          </p>
                        </div>

                        {/* اختيار يوم مختلف */}
                        <div className="space-y-2">
                          <Label>اليوم المقترح</Label>
                          <Select value={alternativeDay} onValueChange={setAlternativeDay}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر يوم" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {Object.entries(dayLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* اختيار فترة مختلفة */}
                        <div className="space-y-2">
                          <Label>الفترة المقترحة</Label>
                          <Select value={alternativeTimeSlot} onValueChange={setAlternativeTimeSlot}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر فترة" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {Object.entries(timeSlotLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* رابط العودة للحجز العادي */}
                        <div className="text-center">
                          <Button
                            type="button"
                            variant="link"
                            onClick={() => setShowAlternativeBooking(false)}
                            className="text-muted-foreground"
                          >
                            العودة للأوقات المتاحة
                          </Button>
                        </div>
                      </>
                    )}

                    {/* بيانات العميل */}
                    <div className="border-t pt-4 space-y-4">
                      <h4 className="font-medium">بياناتك</h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor="name">الاسم *</Label>
                        <Input
                          id="name"
                          value={bookingForm.name}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="اسمك الكامل"
                          className="text-right"
                          required
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
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contact">وسيلة التواصل المفضلة (اختياري)</Label>
                        <Input
                          id="contact"
                          value={bookingForm.preferredContact}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, preferredContact: e.target.value }))}
                          placeholder="واتساب، تيليجرام، إلخ"
                          className="text-right"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
                        <Textarea
                          id="notes"
                          value={bookingForm.notes}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="اكتب تفاصيل حول المشروع أو ما تريد مناقشته..."
                          rows={3}
                          className="text-right resize-none"
                        />
                      </div>

                      <Button 
                        onClick={handleBooking} 
                        className="w-full" 
                        disabled={!bookingForm.name || !bookingForm.email || (!selectedDay && !alternativeDay)}
                      >
                        {!showAlternativeBooking 
                          ? `تأكيد الحجز ${selectedDay && selectedTime ? `- ${dayLabels[selectedDay as keyof typeof dayLabels]} ${selectedTime}` : ''}` 
                          : `إرسال طلب الحجز ${alternativeDay && alternativeTimeSlot ? `- ${dayLabels[alternativeDay as keyof typeof dayLabels]} (${timeSlotLabels[alternativeTimeSlot as keyof typeof timeSlotLabels]})` : ''}`
                        }
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* وسائل التواصل */}
        {(profile.contact_email || profile.phone || profile.website || profile.instagram_url || profile.twitter_url || profile.linkedin_url || profile.github_url) && (
          <Card className="border border-border/10 rounded-3xl shadow-soft hover:shadow-medium transition-smooth mb-8">
            <CardContent className="p-8 lg:p-10">
              <h2 className="text-2xl lg:text-3xl font-light text-foreground mb-8 tracking-tight text-center">
                تواصل معي
              </h2>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.contact_email && (
                  <a 
                    href={`mailto:${profile.contact_email}`}
                    className="flex flex-col items-center p-6 rounded-2xl border border-border/10 hover:border-border/30 transition-smooth hover:shadow-soft group bg-muted/5 hover:bg-muted/10"
                  >
                    <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center mb-3 group-hover:bg-muted/50 transition-smooth">
                      <Mail className="w-5 h-5 text-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground text-center">{profile.contact_email}</span>
                  </a>
                )}

                {profile.website && (
                  <a 
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-6 rounded-2xl border border-border/10 hover:border-border/30 transition-smooth hover:shadow-soft group bg-muted/5 hover:bg-muted/10"
                  >
                    <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center mb-3 group-hover:bg-muted/50 transition-smooth">
                      <Globe className="w-5 h-5 text-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground text-center">الموقع الشخصي</span>
                  </a>
                )}

                {profile.instagram_url && (
                  <a 
                    href={profile.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-6 rounded-2xl border border-border/10 hover:border-border/30 transition-smooth hover:shadow-soft group bg-muted/5 hover:bg-muted/10"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-105 transition-smooth">
                      <Instagram className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-foreground text-center">Instagram</span>
                  </a>
                )}

                {profile.twitter_url && (
                  <a 
                    href={profile.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-6 rounded-2xl border border-border/10 hover:border-border/30 transition-smooth hover:shadow-soft group bg-muted/5 hover:bg-muted/10"
                  >
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-105 transition-smooth">
                      <Twitter className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-foreground text-center">X (Twitter)</span>
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