import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, CheckCircle, Clock, Briefcase, Code, Send, UserPlus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Opportunity {
  id: string;
  title: string;
  description: string;
  deadline: string;
  opportunity_type: string;
}

export default function ApplyOpportunity() {
  const { opportunityId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [signUpForm, setSignUpForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    applicant_name: "",
    applicant_email: "",
    applicant_phone: "",
    portfolio_link: ""
  });

  useEffect(() => {
    fetchOpportunity();
    loadSavedApplication();
    
    // Pre-fill user data if logged in
    if (user) {
      fetchUserProfile();
    }
  }, [opportunityId, user]);

  // Load saved application data from localStorage
  const loadSavedApplication = () => {
    const savedApplication = localStorage.getItem('pendingApplication');
    if (savedApplication) {
      try {
        const data = JSON.parse(savedApplication);
        if (data.opportunityId === opportunityId) {
          setApplicationForm({
            applicant_name: data.applicant_name || '',
            applicant_email: data.applicant_email || '',
            applicant_phone: data.applicant_phone || '',
            portfolio_link: data.portfolio_link || ''
          });
          // Clear saved data after loading
          localStorage.removeItem('pendingApplication');
          
          toast({
            title: "تم استرجاع بيانات التقديم",
            description: "تم ملء النموذج ببياناتك المحفوظة. يمكنك المراجعة والإرسال",
          });
        }
      } catch (error) {
        console.error('Error loading saved application:', error);
      }
    }
  };

  // Fetch user profile to pre-fill form for logged in users
  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      setApplicationForm(prev => ({
        ...prev,
        applicant_name: data.full_name || '',
        applicant_email: user.email || '',
        applicant_phone: data.phone || ''
      }));
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchOpportunity = async () => {
    if (!opportunityId) return;

    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('id', opportunityId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setOpportunity(data);
    } catch (error) {
      console.error('Error fetching opportunity:', error);
      toast({
        title: "خطأ",
        description: "لم يتم العثور على الفرصة أو انتهت صلاحيتها",
        variant: "destructive",
      });
      navigate('/opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!applicationForm.applicant_name || !applicationForm.applicant_email || 
        !applicationForm.applicant_phone || !applicationForm.portfolio_link) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    if (!applicationForm.portfolio_link.includes('drive.google.com')) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رابط Google Drive صحيح",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('opportunity_applications')
        .insert([{
          opportunity_id: opportunityId,
          user_id: user?.id || null,
          ...applicationForm
        }]);

      if (error) throw error;

      // Send notification email
      await supabase.functions.invoke('send-opportunity-notification', {
        body: {
          to: 'iimmshl@gmail.com',
          subject: `تقديم جديد على فرصة: ${opportunity?.title}`,
          html: `
            <div dir="rtl" style="font-family: Arial, sans-serif;">
              <h2>تقديم جديد على فرصة العمل</h2>
              <p><strong>الفرصة:</strong> ${opportunity?.title}</p>
              <p><strong>اسم المتقدم:</strong> ${applicationForm.applicant_name}</p>
              <p><strong>البريد الإلكتروني:</strong> ${applicationForm.applicant_email}</p>
              <p><strong>رقم الجوال:</strong> ${applicationForm.applicant_phone}</p>
              <p><strong>رابط الأعمال:</strong> <a href="${applicationForm.portfolio_link}">${applicationForm.portfolio_link}</a></p>
              <p><strong>تاريخ التقديم:</strong> ${new Date().toLocaleDateString('ar-SA')}</p>
            </div>
          `
        }
      });

      toast({
        title: "تم إرسال التقديم بنجاح!",
        description: "سنراجع طلبك ونتواصل معك قريباً",
      });

      navigate('/opportunities');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في إرسال التقديم، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleShowSignUpModal = () => {
    // Pre-fill signup form with application data
    setSignUpForm({
      fullName: applicationForm.applicant_name,
      email: applicationForm.applicant_email,
      phone: applicationForm.applicant_phone,
      username: "",
      password: "",
      confirmPassword: ""
    });
    setShowSignUpModal(true);
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signUpForm.fullName || !signUpForm.email || !signUpForm.phone || 
        !signUpForm.username || !signUpForm.password) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    if (signUpForm.password !== signUpForm.confirmPassword) {
      toast({
        title: "خطأ", 
        description: "كلمتا المرور غير متطابقتان",
        variant: "destructive",
      });
      return;
    }

    if (signUpForm.password.length < 6) {
      toast({
        title: "خطأ",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }

    setSignUpLoading(true);

    try {
      // Store application data for after verification
      localStorage.setItem('pendingApplication', JSON.stringify({
        opportunityId,
        ...applicationForm
      }));
      
      // Store the redirect URL for after email verification
      localStorage.setItem('postVerificationRedirect', `/apply/${opportunityId}`);

      const redirectUrl = `${window.location.origin}/verify-email`;
      
      const { data, error } = await supabase.auth.signUp({
        email: signUpForm.email,
        password: signUpForm.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: signUpForm.fullName,
            username: signUpForm.username,
            phone: signUpForm.phone
          }
        }
      });

      if (error) throw error;

      // Automatically submit application after account creation
      if (data.user) {
        try {
          await supabase
            .from('opportunity_applications')
            .insert([{
              opportunity_id: opportunityId,
              user_id: data.user.id,
              applicant_name: signUpForm.fullName,
              applicant_email: signUpForm.email,
              applicant_phone: signUpForm.phone,
              portfolio_link: applicationForm.portfolio_link
            }]);

          // Send notification email
          await supabase.functions.invoke('send-opportunity-notification', {
            body: {
              to: 'iimmshl@gmail.com',
              subject: `تقديم جديد على فرصة: ${opportunity?.title}`,
              html: `
                <div dir="rtl" style="font-family: Arial, sans-serif;">
                  <h2>تقديم جديد على فرصة العمل</h2>
                  <p><strong>الفرصة:</strong> ${opportunity?.title}</p>
                  <p><strong>اسم المتقدم:</strong> ${signUpForm.fullName}</p>
                  <p><strong>البريد الإلكتروني:</strong> ${signUpForm.email}</p>
                  <p><strong>رقم الجوال:</strong> ${signUpForm.phone}</p>
                  <p><strong>رابط الأعمال:</strong> <a href="${applicationForm.portfolio_link}">${applicationForm.portfolio_link}</a></p>
                  <p><strong>تاريخ التقديم:</strong> ${new Date().toLocaleDateString('ar-SA')}</p>
                </div>
              `
            }
          });
        } catch (appError) {
          console.error('Error submitting application after signup:', appError);
        }
      }

      toast({
        title: "تم إنشاء الحساب!",
        description: "يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب"
      });

      setShowSignUpModal(false);
      navigate('/verify-email');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ في إنشاء الحساب",
        variant: "destructive",
      });
    } finally {
      setSignUpLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-muted border-t-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground font-light">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md rounded-3xl border-0 shadow-xl">
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">لم يتم العثور على الفرصة</p>
            <Button 
              onClick={() => navigate('/opportunities')} 
              className="rounded-full px-6 py-2 bg-foreground text-background hover:bg-foreground/90"
            >
              العودة للفرص
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border/50">
        <div className="container mx-auto px-4 py-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/opportunities')}
            className="mb-8 gap-2 rounded-full px-4 py-2 hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            العودة للفرص
          </Button>
          
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-muted text-muted-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              {opportunity.opportunity_type === 'job' ? (
                <>
                  <Briefcase className="h-4 w-4" />
                  <span>فرصة وظيفية</span>
                </>
              ) : (
                <>
                  <Code className="h-4 w-4" />
                  <span>فرصة مشروع</span>
                </>
              )}
            </div>
            
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 leading-[1.1] tracking-tight">
              {opportunity.title}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8 font-light">
              {opportunity.description}
            </p>
            
            <div className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full text-sm">
              <Clock className="h-4 w-4" />
              <span>آخر موعد للتقديم: {new Date(opportunity.deadline).toLocaleDateString('ar', { calendar: 'gregory', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div className="container mx-auto px-4 py-20 max-w-2xl">
         <div className="text-center mb-12">
           <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
             تقدم للفرصة
           </h2>
           <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
             املأ النموذج أدناه وسنتواصل معك قريباً
           </p>
         </div>

        <Card className="border-0 shadow-xl bg-background rounded-3xl overflow-hidden">
          <CardContent className="p-10">
            <form onSubmit={handleSubmitApplication} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-muted-foreground">الاسم الكامل *</Label>
                  <Input
                    id="name"
                    value={applicationForm.applicant_name}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, applicant_name: e.target.value }))}
                    placeholder="مثال: أحمد محمد"
                    className="h-12 rounded-xl border-muted bg-muted/30 focus:bg-background transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={applicationForm.applicant_email}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, applicant_email: e.target.value }))}
                    placeholder="example@email.com"
                    className="h-12 rounded-xl border-muted bg-muted/30 focus:bg-background transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-muted-foreground">رقم الجوال *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={applicationForm.applicant_phone}
                  onChange={(e) => setApplicationForm(prev => ({ ...prev, applicant_phone: e.target.value }))}
                  placeholder="+966 50 123 4567"
                  className="h-12 rounded-xl border-muted bg-muted/30 focus:bg-background transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio" className="text-sm font-medium text-muted-foreground">رابط الأعمال (Google Drive) *</Label>
                <Input
                  id="portfolio"
                  type="url"
                  value={applicationForm.portfolio_link}
                  onChange={(e) => setApplicationForm(prev => ({ ...prev, portfolio_link: e.target.value }))}
                  placeholder="https://drive.google.com/..."
                  className="h-12 rounded-xl border-muted bg-muted/30 focus:bg-background transition-all"
                  required
                />
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-2 bg-muted/30 p-4 rounded-xl">
                  <ExternalLink className="h-4 w-4" />
                  <span>تأكد من ضبط الرابط ليكون متاحاً للجميع (Anyone with the link can view)</span>
                </p>
              </div>

              <div className="pt-6">
                {user ? (
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base gap-2 rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-all" 
                    disabled={submitting}
                  >
                    <Send className="h-5 w-5" />
                    {submitting ? "جاري الإرسال..." : "إرسال التقديم"}
                  </Button>
                 ) : (
                   <Button 
                     type="button"
                     onClick={handleShowSignUpModal}
                     className="w-full h-12 text-base gap-2 rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-all"
                   >
                     <UserPlus className="h-5 w-5" />
                     إنشئ حسابك للتقديم
                   </Button>
                 )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sign Up Modal */}
        <Dialog open={showSignUpModal} onOpenChange={setShowSignUpModal}>
          <DialogContent className="max-w-md rounded-2xl border-0 shadow-2xl">
            <DialogHeader className="text-center pb-4 border-b border-border/20">
              <DialogTitle className="text-2xl font-semibold text-foreground">
                إنشئ حسابك للتقديم
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSignUpSubmit} className="space-y-4 p-2">
              <div className="space-y-2">
                <Label htmlFor="modal-fullName" className="text-sm font-medium text-muted-foreground">الاسم الكامل *</Label>
                <Input
                  id="modal-fullName"
                  value={signUpForm.fullName}
                  onChange={(e) => setSignUpForm(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="الاسم الكامل"
                  className="h-12 rounded-xl border-muted bg-muted/30 focus:bg-background transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modal-email" className="text-sm font-medium text-muted-foreground">البريد الإلكتروني *</Label>
                <Input
                  id="modal-email"
                  type="email"
                  value={signUpForm.email}
                  onChange={(e) => setSignUpForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="example@email.com"
                  className="h-12 rounded-xl border-muted bg-muted/30 focus:bg-background transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modal-phone" className="text-sm font-medium text-muted-foreground">رقم الجوال *</Label>
                <Input
                  id="modal-phone"
                  type="tel"
                  value={signUpForm.phone}
                  onChange={(e) => setSignUpForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+966 50 123 4567"
                  className="h-12 rounded-xl border-muted bg-muted/30 focus:bg-background transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modal-username" className="text-sm font-medium text-muted-foreground">اسم المستخدم *</Label>
                <Input
                  id="modal-username"
                  value={signUpForm.username}
                  onChange={(e) => setSignUpForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="اسم المستخدم"
                  className="h-12 rounded-xl border-muted bg-muted/30 focus:bg-background transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modal-password" className="text-sm font-medium text-muted-foreground">كلمة المرور *</Label>
                <Input
                  id="modal-password"
                  type="password"
                  value={signUpForm.password}
                  onChange={(e) => setSignUpForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="كلمة المرور (6 أحرف على الأقل)"
                  className="h-12 rounded-xl border-muted bg-muted/30 focus:bg-background transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modal-confirmPassword" className="text-sm font-medium text-muted-foreground">تأكيد كلمة المرور *</Label>
                <Input
                  id="modal-confirmPassword"
                  type="password"
                  value={signUpForm.confirmPassword}
                  onChange={(e) => setSignUpForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="تأكيد كلمة المرور"
                  className="h-12 rounded-xl border-muted bg-muted/30 focus:bg-background transition-all"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSignUpModal(false)}
                  className="flex-1 h-12 rounded-xl"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={signUpLoading}
                  className="flex-1 h-12 rounded-xl bg-foreground text-background hover:bg-foreground/90"
                >
                  {signUpLoading ? "جاري الإنشاء..." : "إنشاء الحساب"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}