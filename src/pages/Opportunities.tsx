import { useState, useEffect } from "react";
import { Calendar, Plus, Trash2, Eye, EyeOff, Briefcase, Code, Clock, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Opportunity {
  id: string;
  title: string;
  description: string;
  deadline: string;
  is_active: boolean;
  opportunity_type: string;
  created_at: string;
}

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState({
    title: "",
    description: "",
    deadline: "",
    opportunity_type: "project"
  });
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOpportunities();
    checkIsAdmin();
  }, [user]);

  const checkIsAdmin = () => {
    if (user?.email === 'iimmshl@gmail.com') {
      setIsAdmin(true);
    }
  };

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل الفرص",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddOpportunity = async () => {
    if (!newOpportunity.title || !newOpportunity.description || !newOpportunity.deadline) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('opportunities')
        .insert([newOpportunity]);

      if (error) throw error;

      toast({
        title: "تم بنجاح",
        description: "تم إضافة الفرصة بنجاح",
      });

      setShowAddDialog(false);
      setNewOpportunity({ title: "", description: "", deadline: "", opportunity_type: "project" });
      fetchOpportunities();
    } catch (error) {
      console.error('Error adding opportunity:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في إضافة الفرصة",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('opportunities')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "تم بنجاح",
        description: currentStatus ? "تم إخفاء الفرصة" : "تم إظهار الفرصة",
      });

      fetchOpportunities();
    } catch (error) {
      console.error('Error toggling opportunity:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحديث الفرصة",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOpportunity = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفرصة؟')) return;

    try {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "تم بنجاح",
        description: "تم حذف الفرصة بنجاح",
      });

      fetchOpportunities();
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حذف الفرصة",
        variant: "destructive",
      });
    }
  };

  const handleApply = (opportunityId: string) => {
    navigate(`/apply/${opportunityId}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border/20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <Users className="h-4 w-4" />
              <span>فرص العمل والمشاريع</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight animate-fade-in">
              الفرص المتاحة
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in">
              اكتشف الفرص المتاحة وتقدم للمناسب منها. فرص وظيفية ومشاريع متنوعة تناسب مهاراتك وخبراتك
            </p>
            
            {isAdmin && (
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-3 px-8 py-4 text-lg animate-fade-in">
                    <Plus className="h-5 w-5" />
                    إضافة فرصة جديدة
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                      <Plus className="h-6 w-6 text-primary" />
                      إضافة فرصة جديدة
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium">عنوان الفرصة</Label>
                      <Input
                        id="title"
                        value={newOpportunity.title}
                        onChange={(e) => setNewOpportunity(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="مثال: مطور واجهات أمامية"
                        className="h-12"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="opportunity_type" className="text-sm font-medium">نوع الفرصة</Label>
                      <Select 
                        value={newOpportunity.opportunity_type} 
                        onValueChange={(value) => setNewOpportunity(prev => ({ ...prev, opportunity_type: value }))}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="اختر نوع الفرصة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="project" className="flex items-center gap-2">
                            <Code className="h-4 w-4" />
                            فرصة مشروع
                          </SelectItem>
                          <SelectItem value="job" className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            فرصة وظيفية
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium">وصف الفرصة</Label>
                      <Textarea
                        id="description"
                        value={newOpportunity.description}
                        onChange={(e) => setNewOpportunity(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="اكتب وصفاً مفصلاً للفرصة..."
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deadline" className="text-sm font-medium">تاريخ انتهاء التقديم</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={newOpportunity.deadline}
                        onChange={(e) => setNewOpportunity(prev => ({ ...prev, deadline: e.target.value }))}
                        className="h-12"
                      />
                    </div>
                    
                    <Button onClick={handleAddOpportunity} className="w-full h-12 text-lg">
                      إضافة الفرصة
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="container mx-auto px-4 py-16">
        {opportunities.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">لا توجد فرص متاحة حالياً</h3>
            <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
              نعمل على إضافة فرص جديدة باستمرار. تابعنا للحصول على آخر التحديثات
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {opportunities.length} فرصة متاحة
              </h2>
              <p className="text-muted-foreground">
                اختر الفرصة المناسبة لمهاراتك وابدأ رحلتك المهنية
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {opportunities.map((opportunity, index) => (
                <Card 
                  key={opportunity.id} 
                  className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-background/80 backdrop-blur-sm hover:bg-background/90 overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Header with gradient */}
                  <div className="h-2 bg-gradient-to-r from-primary via-primary/70 to-secondary"></div>
                  
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          {opportunity.opportunity_type === 'job' ? (
                            <Briefcase className="h-6 w-6 text-primary" />
                          ) : (
                            <Code className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <Badge 
                            variant={opportunity.opportunity_type === 'job' ? 'default' : 'secondary'} 
                            className="text-xs mb-2"
                          >
                            {opportunity.opportunity_type === 'job' ? 'فرصة وظيفية' : 'فرصة مشروع'}
                          </Badge>
                        </div>
                      </div>
                      
                      {isAdmin && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(opportunity.id, opportunity.is_active)}
                            className="h-8 w-8 p-0"
                          >
                            {opportunity.is_active ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteOpportunity(opportunity.id)}
                            className="h-8 w-8 p-0 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {opportunity.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed line-clamp-3">
                      {opportunity.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span>آخر موعد: {new Date(opportunity.deadline).toLocaleDateString('ar-SA')}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <Badge variant={opportunity.is_active ? "default" : "secondary"} className="text-xs">
                        {opportunity.is_active ? 'متاحة' : 'منتهية'}
                      </Badge>
                      
                      {opportunity.is_active && (
                        <Button 
                          onClick={() => handleApply(opportunity.id)}
                          className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all px-6"
                          size="sm"
                        >
                          تقدم الآن
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}