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
  ArrowLeft,
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
    const profileUrl = `${window.location.origin}/profile/${username}`;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "تم نسخ الرابط",
      description: "تم نسخ رابط الملف الشخصي بنجاح",
    });
  };

  const handleBooking = async () => {
    if (!profile?.id) return;

    try {
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
      };

      const { error } = await supabase
        .from('bookings')
        .insert(bookingData);

      if (error) {
        console.error('Booking error:', error);
        toast({
          variant: "destructive",
          title: "خطأ في الحجز",
          description: "حدث خطأ أثناء إرسال طلب الحجز"
        });
        return;
      }

      if (showAlternativeBooking) {
        toast({
          title: "تم إرسال اقتراح الموعد",
          description: "سيتم مراجعة طلبك والرد عليك قريباً",
        });
      } else {
        toast({
          title: "تم إرسال طلب الحجز",
          description: "سيتم التواصل معك قريباً لتأكيد الموعد",
        });
      }
      
      // إعادة تعيين النموذج
      setSelectedDay("");
      setSelectedTime("");
      setShowAlternativeBooking(false);
      setAlternativeDay("");
      setAlternativeTimeSlot("");
      setBookingForm({ name: "", email: "", preferredContact: "", notes: "" });
      
    } catch (error) {
      console.error('Unexpected booking error:', error);
      toast({
        variant: "destructive",
        title: "خطأ غير متوقع",
        description: "حدث خطأ أثناء معالجة طلب الحجز"
      });
    }
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
    return availableTimeSlots["evening"] || [];
  };

  const contactMethods = [
    { value: "email", label: "البريد الإلكتروني" },
    { value: "phone", label: "الهاتف" },
    { value: "whatsapp", label: "واتساب" },
    { value: "telegram", label: "تلقرام" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل الملف الشخصي...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">الملف الشخصي غير موجود</h1>
          <p className="text-muted-foreground mb-6">عذراً، لم نتمكن من العثور على هذا الملف الشخصي</p>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة للرئيسية
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header with logo */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            العودة
          </Button>
          <div className="flex items-center gap-2">
            {/* Logo for light mode (black) */}
            <img 
              src="/lovable-uploads/822b255a-0cfa-4520-b9a5-aa69e7ef91e6.png" 
              alt="ملف" 
              className="w-5 h-5 dark:hidden"
            />
            {/* Logo for dark mode (white) */}
            <img 
              src="/lovable-uploads/be1d2269-8206-422b-a395-e4fb9e1a88cc.png" 
              alt="ملف" 
              className="w-5 h-5 hidden dark:block"
            />
            <span className="font-bold text-lg">malaf</span>
          </div>
        </div>

        {/* رأس الصفحة مع الرابط والأزرار */}
        <div className="bg-background border border-border/10 rounded-3xl shadow-soft p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground mb-2">رابط الملف الشخصي</p>
              <p className="text-lg font-mono bg-muted px-4 py-2 rounded-lg">
                malaf.me/{profile.username}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={copyLink}>
                <Copy className="ml-2 h-4 w-4" />
                نسخ الرابط
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" className="bg-foreground text-background hover:bg-foreground/90">
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    حجز اجتماع
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
                        <Label htmlFor="name">الاسم الكامل *</Label>
                        <Input
                          id="name"
                          value={bookingForm.name}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="اكتب اسمك الكامل"
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
                        <Select 
                          value={bookingForm.preferredContact} 
                          onValueChange={(value) => setBookingForm(prev => ({ ...prev, preferredContact: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر وسيلة التواصل" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {contactMethods.map((method) => (
                              <SelectItem key={method.value} value={method.value}>
                                {method.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="notes">ملاحظة إضافية (اختياري)</Label>
                        <Textarea
                          id="notes"
                          value={bookingForm.notes}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="أي معلومات إضافية تود مشاركتها..."
                          className="text-right resize-none"
                          rows={3}
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={handleBooking} 
                      className="w-full" 
                      variant="hero"
                      disabled={
                        !bookingForm.name || 
                        !bookingForm.email || 
                        (!showAlternativeBooking ? (!selectedDay || !selectedTime) : (!alternativeDay || !alternativeTimeSlot))
                      }
                    >
                      {showAlternativeBooking ? "إرسال اقتراح الموعد" : "إرسال طلب الحجز"}
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
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6 text-center">
                <div className="relative flex justify-center mb-4">
                  <Avatar className="w-32 h-32 border-4 border-border/20">
                    <AvatarImage src={profile.avatar_url || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-3xl font-light">
                      {profile.full_name?.split(' ').map(n => n[0]).join('') || <User className="w-16 h-16" />}
                    </AvatarFallback>
                  </Avatar>
                  {profile.emoji && (
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-background border-2 border-border/20 rounded-full flex items-center justify-center text-2xl shadow-soft">
                      {profile.emoji}
                    </div>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {profile.full_name}
                </h1>
                <Badge variant="secondary" className="mb-4">
                  <CheckCircle className="ml-2 h-3 w-3" />
                  ملف معتمد
                </Badge>
                {profile.profession && (
                  <p className="text-muted-foreground text-sm">{profile.profession}</p>
                )}
              </CardContent>
            </Card>

            {/* وسائل التواصل */}
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">وسائل التواصل</h3>
                <div className="space-y-3">
                  {profile.contact_email && (
                    <a 
                      href={`mailto:${profile.contact_email}`}
                      className="flex items-center text-muted-foreground hover:text-primary transition-smooth"
                    >
                      <Mail className="ml-3 h-4 w-4" />
                      <span className="text-sm">{profile.contact_email}</span>
                    </a>
                  )}
                  {profile.instagram_url && (
                    <a 
                      href={profile.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-muted-foreground hover:text-primary transition-smooth"
                    >
                      <Instagram className="ml-3 h-4 w-4" />
                      <span className="text-sm">Instagram</span>
                    </a>
                  )}
                  {profile.twitter_url && (
                    <a 
                      href={profile.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-muted-foreground hover:text-primary transition-smooth"
                    >
                      <Twitter className="ml-3 h-4 w-4" />
                      <span className="text-sm">Twitter</span>
                    </a>
                  )}
                  {profile.website && (
                    <a 
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-muted-foreground hover:text-primary transition-smooth"
                    >
                      <Globe className="ml-3 h-4 w-4" />
                      <span className="text-sm">الموقع الشخصي</span>
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a 
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-muted-foreground hover:text-primary transition-smooth"
                    >
                      <ExternalLink className="ml-3 h-4 w-4" />
                      <span className="text-sm">LinkedIn</span>
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
                  {profile.bio || "لم يتم إضافة نبذة تعريفية بعد."}
                </p>
              </CardContent>
            </Card>

            {/* المهارات */}
            {profile.skills && profile.skills.length > 0 && (
              <Card className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">المهارات</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* الخبرة */}
            {profile.experience_years && (
              <Card className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">سنوات الخبرة</h2>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-lg font-medium">{profile.experience_years} سنة</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* الموقع */}
            {profile.location && (
              <Card className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">الموقع</h2>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">{profile.location}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;