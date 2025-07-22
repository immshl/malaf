import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, CheckCircle } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">لم يتم العثور على الفرصة</p>
            <Button onClick={() => navigate('/opportunities')} className="mt-4">
              العودة للفرص
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/opportunities')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          العودة للفرص
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">{opportunity.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{opportunity.description}</p>
            <p className="text-sm text-muted-foreground">
              آخر موعد للتقديم: {new Date(opportunity.deadline).toLocaleDateString('ar-SA')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>تقدم للفرصة</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-sm leading-relaxed">
                <strong>خطوات التقديم:</strong><br />
                1. املأ النموذج أدناه بمعلوماتك الشخصية<br />
                2. أرفق رابط Google Drive يحتوي على أعمالك (تأكد من إتاحة الوصول للجميع)<br />
                3. سنراجع طلبك ونتواصل مع المرشحين المناسبين لاجتماع أونلاين<br />
                4. إذا لم يكن لديك حساب، ستتم إعادة توجيهك لإنشاء حساب سريع
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmitApplication} className="space-y-6">
              <div>
                <Label htmlFor="name">الاسم الكامل *</Label>
                <Input
                  id="name"
                  value={applicationForm.applicant_name}
                  onChange={(e) => setApplicationForm(prev => ({ ...prev, applicant_name: e.target.value }))}
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  value={applicationForm.applicant_email}
                  onChange={(e) => setApplicationForm(prev => ({ ...prev, applicant_email: e.target.value }))}
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">رقم الجوال *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={applicationForm.applicant_phone}
                  onChange={(e) => setApplicationForm(prev => ({ ...prev, applicant_phone: e.target.value }))}
                  placeholder="أدخل رقم جوالك"
                  required
                />
              </div>

              <div>
                <Label htmlFor="portfolio">رابط الأعمال (Google Drive) *</Label>
                <Input
                  id="portfolio"
                  type="url"
                  value={applicationForm.portfolio_link}
                  onChange={(e) => setApplicationForm(prev => ({ ...prev, portfolio_link: e.target.value }))}
                  placeholder="https://drive.google.com/..."
                  required
                />
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  تأكد من ضبط الرابط ليكون متاحاً للجميع (Anyone with the link can view)
                </p>
              </div>

              {user ? (
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={submitting}
                >
                  {submitting ? "جاري الإرسال..." : "إرسال التقديم"}
                </Button>
              ) : (
                <Button 
                  type="button"
                  onClick={handleSignUpAndApply}
                  className="w-full"
                >
                  إنشاء حساب وإرسال التقديم
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}