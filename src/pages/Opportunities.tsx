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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-muted border-t-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground font-light">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Logo */}
      <div className="bg-background border-b border-border/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8">
                <img 
                  src="/lovable-uploads/be1d2269-8206-422b-a395-e4fb9e1a88cc.png" 
                  alt="ملف" 
                  className="w-full h-full object-contain dark:hidden"
                />
                <img 
                  src="/lovable-uploads/822b255a-0cfa-4520-b9a5-aa69e7ef91e6.png" 
                  alt="ملف" 
                  className="w-full h-full object-contain hidden dark:block"
                />
              </div>
              <span className="font-bold text-lg text-foreground">ملف</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Apple-style minimal */}
      <div className="bg-background">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 leading-[1.1] tracking-tight">
              الفرص المتاحة
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              اكتشف الفرص المتاحة وتقدم للمناسب منها
            </p>
            
            {isAdmin && (
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="rounded-full px-8 py-4 text-base font-medium bg-foreground text-background hover:bg-foreground/90 transition-all"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    إضافة فرصة جديدة
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg rounded-2xl border-0 shadow-2xl">
                  <DialogHeader className="text-center pb-6">
                    <DialogTitle className="text-2xl font-semibold text-foreground">
                      إضافة فرصة جديدة
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium text-muted-foreground">عنوان الفرصة</Label>
                      <Input
                        id="title"
                        value={newOpportunity.title}
                        onChange={(e) => setNewOpportunity(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="مثال: مطور واجهات أمامية"
                        className="h-12 rounded-xl border-muted bg-muted/30 focus:bg-background transition-all"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="opportunity_type" className="text-sm font-medium text-muted-foreground">نوع الفرصة</Label>
                      <Select 
                        value={newOpportunity.opportunity_type} 
                        onValueChange={(value) => setNewOpportunity(prev => ({ ...prev, opportunity_type: value }))}
                      >
                        <SelectTrigger className="h-12 rounded-xl border-muted bg-muted/30">
                          <SelectValue placeholder="اختر نوع الفرصة" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-0 shadow-2xl">
                          <SelectItem value="project">فرصة مشروع</SelectItem>
                          <SelectItem value="job">فرصة وظيفية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium text-muted-foreground">وصف الفرصة</Label>
                      <Textarea
                        id="description"
                        value={newOpportunity.description}
                        onChange={(e) => setNewOpportunity(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="اكتب وصفاً مفصلاً للفرصة..."
                        rows={4}
                        className="resize-none rounded-xl border-muted bg-muted/30 focus:bg-background transition-all"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deadline" className="text-sm font-medium text-muted-foreground">تاريخ انتهاء التقديم</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={newOpportunity.deadline}
                        onChange={(e) => setNewOpportunity(prev => ({ ...prev, deadline: e.target.value }))}
                        className="h-12 rounded-xl border-muted bg-muted/30 focus:bg-background transition-all"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleAddOpportunity} 
                      className="w-full h-12 text-base rounded-xl bg-foreground text-background hover:bg-foreground/90"
                    >
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
      <div className="container mx-auto px-4 py-20">
        {opportunities.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-24 h-24 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 tracking-tight">لا توجد فرص متاحة حالياً</h3>
            <p className="text-muted-foreground text-xl max-w-md mx-auto font-light">
              نعمل على إضافة فرص جديدة باستمرار
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
                {opportunities.length} فرصة متاحة
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
                اختر الفرصة المناسبة لمهاراتك
              </p>
            </div>
            
            <div className="space-y-6">
              {opportunities.map((opportunity, index) => (
                <Card 
                  key={opportunity.id} 
                  className="group hover:shadow-xl transition-all duration-500 border-0 bg-background rounded-3xl overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                          {opportunity.opportunity_type === 'job' ? (
                            <Briefcase className="h-6 w-6 text-foreground" />
                          ) : (
                            <Code className="h-6 w-6 text-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <Badge 
                              variant={opportunity.opportunity_type === 'job' ? 'default' : 'secondary'} 
                              className="text-xs font-medium rounded-full px-3 py-1"
                            >
                              {opportunity.opportunity_type === 'job' ? 'فرصة وظيفية' : 'فرصة مشروع'}
                            </Badge>
                            <Badge variant="outline" className="text-xs font-medium rounded-full px-3 py-1">
                              {opportunity.is_active ? 'متاحة' : 'منتهية'}
                            </Badge>
                          </div>
                          <h3 className="text-2xl font-semibold text-foreground group-hover:text-foreground/80 transition-colors">
                            {opportunity.title}
                          </h3>
                        </div>
                      </div>
                      
                      {isAdmin && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(opportunity.id, opportunity.is_active)}
                            className="h-10 w-10 p-0 rounded-xl hover:bg-muted"
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
                            className="h-10 w-10 p-0 rounded-xl hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed mb-6 font-light text-lg">
                      {opportunity.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>آخر موعد: {new Date(opportunity.deadline).toLocaleDateString('ar', { calendar: 'gregory', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      
                      {opportunity.is_active && (
                        <Button 
                          onClick={() => handleApply(opportunity.id)}
                          className="rounded-full px-6 py-2 bg-foreground text-background hover:bg-foreground/90 transition-all hover:scale-105"
                        >
                          تقدم الآن
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}