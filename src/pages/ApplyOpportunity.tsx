import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, CheckCircle, Clock, Briefcase, Code, Send, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  const [applicationForm, setApplicationForm] = useState({
    applicant_name: "",
    applicant_email: "",
    applicant_phone: "",
    portfolio_link: ""
  });

  useEffect(() => {
    fetchOpportunity();
  }, [opportunityId]);

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

  const handleSignUpAndApply = () => {
    // Store application data in sessionStorage for after signup
    sessionStorage.setItem('pendingApplication', JSON.stringify({
      opportunityId,
      ...applicationForm
    }));
    navigate('/signup');
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
            
            <h1 className="text-5xl md:text-6xl font-light text-foreground mb-6 tracking-tight leading-tight">
              {opportunity.title}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8 font-light">
              {opportunity.description}
            </p>
            
            <div className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full text-sm">
              <Clock className="h-4 w-4" />
              <span>آخر موعد للتقديم: {new Date(opportunity.deadline).toLocaleDateString('ar-SA')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div className="container mx-auto px-4 py-20 max-w-2xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-foreground mb-4">
            تقدم للفرصة
          </h2>
          <p className="text-muted-foreground font-light">
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
                    onClick={handleSignUpAndApply}
                    className="w-full h-12 text-base gap-2 rounded-xl bg-muted text-foreground hover:bg-muted/80 transition-all"
                    variant="outline"
                  >
                    <UserPlus className="h-5 w-5" />
                    إنشاء حساب وإرسال التقديم
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}