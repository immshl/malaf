import { useState, useEffect } from "react";
import { Calendar, Plus, Trash2, Eye, EyeOff, Briefcase, Code, Clock, MapPin, Users, Check, X, Menu, ArrowLeft } from "lucide-react";
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
import { Link, useNavigate } from "react-router-dom";
import UserProfile from "@/components/UserProfile";
import AuthButton from "@/components/AuthButton";

interface Opportunity {
  id: string;
  title: string;
  description: string;
  deadline: string;
  is_active: boolean;
  opportunity_type: string;
  status: string;
  emoji?: string;
  created_at: string;
}

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState({
    title: "",
    description: "",
    deadline: "",
    opportunity_type: "project",
    emoji: ""
  });
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkIsAdmin();
  }, [user]);

  useEffect(() => {
    fetchOpportunities();
  }, [isAdmin]);

  const checkIsAdmin = () => {
    if (user?.email === 'iimmshl@gmail.com') {
      setIsAdmin(true);
    }
  };

  const fetchOpportunities = async () => {
    try {
      let query = supabase.from('opportunities').select('*');
      
      // المدير يرى جميع الفرص، المستخدمين العاديين يرون النشطة فقط
      if (!isAdmin) {
        query = query.eq('status', 'active');
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      // فحص انتهاء التاريخ وتحديث الحالة تلقائياً
      const opportunitiesWithStatus = data?.map(opportunity => {
        const isExpired = new Date(opportunity.deadline) < new Date();
        const effectiveStatus = isExpired && opportunity.status === 'active' ? 'expired' : opportunity.status;
        
        // تحديث قاعدة البيانات إذا انتهت الفرصة
        if (isExpired && opportunity.status === 'active') {
          supabase
            .from('opportunities')
            .update({ status: 'expired' })
            .eq('id', opportunity.id);
        }
        
        return { ...opportunity, status: effectiveStatus };
      }) || [];
      
      setOpportunities(opportunitiesWithStatus);
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
      setNewOpportunity({ title: "", description: "", deadline: "", opportunity_type: "project", emoji: "" });
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

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('opportunities')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      const statusMessages = {
        'active': 'تم تفعيل الفرصة',
        'inactive': 'تم إخفاء الفرصة', 
        'completed': 'تم وضع الفرصة كمكتملة',
        'expired': 'تم وضع الفرصة كمنتهية'
      };

      toast({
        title: "تم بنجاح",
        description: statusMessages[newStatus as keyof typeof statusMessages],
      });

      fetchOpportunities();
    } catch (error) {
      console.error('Error updating opportunity status:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحديث حالة الفرصة",
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isMobileMenuOpen]);

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
    <div className="min-h-screen bg-background relative">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={closeMobileMenu}
        />
      )}
      
      <div className="relative z-40">
        {/* Navigation */}
        <nav className="sticky top-0 glass border-b border-border/20 z-40">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-20 py-2">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-0.5 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8">
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
                <span className="font-bold text-lg text-foreground">ملف</span>
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-4 space-x-reverse">
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-smooth font-medium text-sm tracking-wide">
                  الرئيسية
                </Link>
                <span className="text-foreground font-medium text-sm tracking-wide">
                  الفرص
                </span>
                {user ? (
                  <UserProfile />
                ) : (
                  <AuthButton />
                )}
              </div>

              {/* Mobile Menu Button */}
              <button 
                type="button"
                className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 mobile-menu-container"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const newState = !isMobileMenuOpen;
                  setIsMobileMenuOpen(newState);
                }}
                aria-label="فتح القائمة"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <>
              {/* Overlay */}
              <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-fade-in"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Menu Content */}
              <div className="fixed top-18 left-0 right-0 z-50 animate-slide-down mobile-menu-container">
                <div className="mx-6 mt-4 glass rounded-2xl shadow-elegant border border-border/20 overflow-hidden">
                  <div className="p-8 space-y-6">
                    {/* Navigation Links */}
                    <div className="space-y-2">
                      <Link 
                        to="/" 
                        className="flex items-center gap-4 p-4 text-foreground hover:text-primary hover:bg-muted/50 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-sm"></div>
                        <span className="text-lg font-medium">الرئيسية</span>
                      </Link>
                      <div className="flex items-center gap-4 p-4 text-primary bg-muted/50 rounded-xl">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-sm"></div>
                        <span className="text-lg font-medium">الفرص</span>
                      </div>
                    </div>
                    
                    {/* Auth Section */}
                    <div className="pt-6 border-t border-border space-y-8">
                       {user ? (
                        <UserProfile />
                       ) : (
                         <AuthButton isMobile={true} />
                       )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </nav>
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
                      <Label htmlFor="emoji" className="text-sm font-medium text-muted-foreground">أيقونة الفرصة (إيموجي)</Label>
                      <Input
                        id="emoji"
                        value={newOpportunity.emoji}
                        onChange={(e) => setNewOpportunity(prev => ({ ...prev, emoji: e.target.value }))}
                        placeholder="اكتب أي إيموجي (مثل: 💻 🎨 📱 🚀 📊 🎯 💡 🔧 ⭐ 🎪 🌟 🔥 💎 🎊 🎉 🎈 🏆 🎁 🌈 🦄 🌙 ⚡ 🎵 🎭 🍕 🍔 🍟 🍰 🎂 🍦 🍩 🧁 ☕ 🍺 🏠 🏢 🏰 🏖️ 🌍 🌎 🌏 🛡️ ⚔️ 🏹 🎪 🎯 🎲 🎮 🕹️ 📚 📖 📝 📊 📈 📉 💰 💵 💸 💳 💎 ⌚ 📱 💻 🖥️ ⌨️ 🖱️ 🖨️ 📷 📹 🔋 🔌 💡 🔦 🕯️ 🧯 🔧 🔨 ⚒️ 🛠️ ⚡ 🔥 ❄️ ☀️ 🌞 🌝 🌛 🌜 🌚 🌕 🌖 🌗 🌘 🌑 🌒 🌓 🌔)"
                        className="h-12 rounded-xl border-muted bg-muted/30 focus:bg-background transition-all"
                      />
                      <p className="text-xs text-muted-foreground">يمكنك استخدام أي إيموجي من لوحة المفاتيح أو نسخه من الإنترنت</p>
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
                  <CardContent className={`p-8 ${opportunity.status !== 'active' ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between mb-6">
                       <div className="flex items-center gap-4">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                           opportunity.status === 'active' ? 'bg-muted' : 'bg-muted/50'
                         }`}>
                           {opportunity.emoji ? (
                             <span>{opportunity.emoji}</span>
                           ) : opportunity.opportunity_type === 'job' ? (
                             <Briefcase className={`h-6 w-6 ${opportunity.status === 'active' ? 'text-foreground' : 'text-muted-foreground'}`} />
                           ) : (
                             <Code className={`h-6 w-6 ${opportunity.status === 'active' ? 'text-foreground' : 'text-muted-foreground'}`} />
                           )}
                         </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <Badge 
                              variant={opportunity.opportunity_type === 'job' ? 'default' : 'secondary'} 
                              className="text-xs font-medium rounded-full px-3 py-1"
                            >
                              {opportunity.opportunity_type === 'job' ? 'فرصة وظيفية' : 'فرصة مشروع'}
                            </Badge>
                            
                            {/* Status Badge */}
                            <Badge 
                              variant={
                                opportunity.status === 'active' ? 'default' :
                                opportunity.status === 'completed' ? 'outline' :
                                'secondary'
                              }
                              className={`text-xs font-medium rounded-full px-3 py-1 ${
                                opportunity.status === 'completed' ? 'border-green-500 text-green-700 bg-green-50' :
                                opportunity.status === 'expired' ? 'border-orange-500 text-orange-700 bg-orange-50' :
                                ''
                              }`}
                            >
                              {opportunity.status === 'active' ? 'متاحة' :
                               opportunity.status === 'completed' ? 'مكتملة - تم العثور على المناسب' :
                               opportunity.status === 'expired' ? 'منتهية الصلاحية' :
                               'مخفية'}
                            </Badge>
                          </div>
                          <h3 className={`text-2xl font-semibold transition-colors ${
                            opportunity.status === 'active' 
                              ? 'text-foreground group-hover:text-foreground/80' 
                              : 'text-muted-foreground'
                          }`}>
                            {opportunity.title}
                          </h3>
                        </div>
                      </div>
                      
                      {isAdmin && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Toggle Active/Inactive */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateStatus(
                              opportunity.id, 
                              opportunity.status === 'active' ? 'inactive' : 'active'
                            )}
                            className="h-8 w-8 p-0 rounded-xl hover:bg-muted"
                            title={opportunity.status === 'active' ? 'إخفاء' : 'إظهار'}
                          >
                            {opportunity.status === 'active' ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button>
                          
                          {/* Mark as Completed */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateStatus(
                              opportunity.id, 
                              opportunity.status === 'completed' ? 'active' : 'completed'
                            )}
                            className="h-8 w-8 p-0 rounded-xl hover:bg-green-50 hover:text-green-600"
                            title={opportunity.status === 'completed' ? 'إعادة تفعيل' : 'وضع كمكتملة'}
                          >
                            {opportunity.status === 'completed' ? (
                              <X className="h-4 w-4" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                          
                          {/* Delete */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteOpportunity(opportunity.id)}
                            className="h-8 w-8 p-0 rounded-xl hover:bg-red-50 hover:text-red-600"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <p className={`leading-relaxed mb-6 font-light text-lg ${
                      opportunity.status === 'active' ? 'text-muted-foreground' : 'text-muted-foreground/70'
                    }`}>
                      {opportunity.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-2 text-sm ${
                        opportunity.status === 'active' ? 'text-muted-foreground' : 'text-muted-foreground/70'
                      }`}>
                        <Clock className="h-4 w-4" />
                        <span>آخر موعد: {new Date(opportunity.deadline).toLocaleDateString('ar', { calendar: 'gregory', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      
                      {opportunity.status === 'active' && (
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