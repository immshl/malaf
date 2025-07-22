import { useState, useEffect } from "react";
import { Calendar, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
    deadline: ""
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
      setNewOpportunity({ title: "", description: "", deadline: "" });
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">الفرص المتاحة</h1>
            <p className="text-muted-foreground">اكتشف الفرص الوظيفية المتاحة وتقدم للمناسب منها</p>
          </div>
          
          {isAdmin && (
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  إضافة فرصة جديدة
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>إضافة فرصة جديدة</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">عنوان الفرصة</Label>
                    <Input
                      id="title"
                      value={newOpportunity.title}
                      onChange={(e) => setNewOpportunity(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="أدخل عنوان الفرصة"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">وصف الفرصة</Label>
                    <Textarea
                      id="description"
                      value={newOpportunity.description}
                      onChange={(e) => setNewOpportunity(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="أدخل وصف الفرصة"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="deadline">تاريخ انتهاء التقديم</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={newOpportunity.deadline}
                      onChange={(e) => setNewOpportunity(prev => ({ ...prev, deadline: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleAddOpportunity} className="w-full">
                    إضافة الفرصة
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {opportunities.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground text-lg">لا توجد فرص متاحة حالياً</p>
              <p className="text-sm text-muted-foreground mt-2">تابعنا للحصول على آخر الفرص المتاحة</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opportunity) => (
              <Card key={opportunity.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">
                      {opportunity.title}
                    </CardTitle>
                    {isAdmin && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(opportunity.id, opportunity.is_active)}
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
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {opportunity.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>آخر موعد للتقديم: {new Date(opportunity.deadline).toLocaleDateString('ar-SA')}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="text-xs">
                      {opportunity.is_active ? 'متاحة' : 'منتهية'}
                    </Badge>
                    
                    {opportunity.is_active && (
                      <Button 
                        onClick={() => handleApply(opportunity.id)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        تقدم للفرصة
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}