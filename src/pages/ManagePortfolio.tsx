import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowRight, Plus, X, Upload, GripVertical } from "lucide-react";
import { Loading } from "@/components/ui/loading";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  additional_images: string[];
  video_links: string[];
  display_order: number;
  is_published: boolean;
}

const ManagePortfolio = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cover_image: "",
    additional_images: ["", "", "", "", "", "", ""],
    video_links: ["", "", "", "", "", "", ""],
  });
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }
    fetchProfileAndItems();
  }, [user, navigate]);

  const fetchProfileAndItems = async () => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, has_portfolio_page")
        .eq("user_id", user?.id)
        .single();

      if (!profile?.has_portfolio_page) {
        toast.error(t("يجب تفعيل صفحة الأعمال من إعدادات الملف الشخصي"));
        navigate("/create-profile");
        return;
      }

      setProfileId(profile.id);

      const { data: portfolioItems } = await supabase
        .from("portfolio_items")
        .select("*")
        .eq("profile_id", profile.id)
        .order("display_order", { ascending: true });

      setItems(portfolioItems || []);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user?.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("portfolio").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const url = await uploadImage(file);
      setFormData({ ...formData, cover_image: url });
      toast.success(t("تم رفع الصورة بنجاح"));
    } catch (error) {
      console.error("Error uploading cover image:", error);
      toast.error(t("فشل رفع الصورة"));
    } finally {
      setUploadingCover(false);
    }
  };

  const handleAdditionalImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    try {
      const url = await uploadImage(file);
      const newImages = [...formData.additional_images];
      newImages[index] = url;
      setFormData({ ...formData, additional_images: newImages });
      toast.success(t("تم رفع الصورة بنجاح"));
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(t("فشل رفع الصورة"));
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleVideoLinkChange = (index: number, value: string) => {
    const newLinks = [...formData.video_links];
    newLinks[index] = value;
    setFormData({ ...formData, video_links: newLinks });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...formData.additional_images];
    newImages[index] = "";
    setFormData({ ...formData, additional_images: newImages });
    toast.success(t("تم حذف الصورة"));
  };

  const handleMoveImageUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...formData.additional_images];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    setFormData({ ...formData, additional_images: newImages });
  };

  const handleMoveImageDown = (index: number) => {
    if (index === formData.additional_images.length - 1) return;
    const newImages = [...formData.additional_images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    setFormData({ ...formData, additional_images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileId || !formData.title || !formData.description || !formData.cover_image) {
      toast.error(t("يرجى ملء جميع الحقول المطلوبة"));
      return;
    }

    try {
      const cleanedImages = formData.additional_images.filter((img) => img.trim() !== "");
      const cleanedVideos = formData.video_links.filter((link) => link.trim() !== "");

      const itemData = {
        profile_id: profileId,
        title: formData.title,
        description: formData.description,
        cover_image: formData.cover_image,
        additional_images: cleanedImages,
        video_links: cleanedVideos,
        display_order: editingItem?.display_order ?? items.length,
        is_published: true,
      };

      if (editingItem) {
        await supabase
          .from("portfolio_items")
          .update(itemData)
          .eq("id", editingItem.id);
        toast.success(t("تم تحديث العمل بنجاح"));
      } else {
        await supabase.from("portfolio_items").insert(itemData);
        toast.success(t("تم إضافة العمل بنجاح"));
      }

      setFormData({
        title: "",
        description: "",
        cover_image: "",
        additional_images: ["", "", "", "", "", "", ""],
        video_links: ["", "", "", "", "", "", ""],
      });
      setEditingItem(null);
      fetchProfileAndItems();
    } catch (error) {
      console.error("Error saving portfolio item:", error);
      toast.error(t("حدث خطأ أثناء الحفظ"));
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    const paddedImages = [...item.additional_images];
    while (paddedImages.length < 7) paddedImages.push("");
    const paddedVideos = [...item.video_links];
    while (paddedVideos.length < 7) paddedVideos.push("");

    setFormData({
      title: item.title,
      description: item.description,
      cover_image: item.cover_image,
      additional_images: paddedImages,
      video_links: paddedVideos,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("هل أنت متأكد من حذف هذا العمل؟"))) return;

    try {
      await supabase.from("portfolio_items").delete().eq("id", id);
      toast.success(t("تم حذف العمل بنجاح"));
      fetchProfileAndItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(t("فشل حذف العمل"));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t("إدارة الأعمال")}
          </h1>
          <Button variant="outline" onClick={() => navigate(-1)} className="hover-scale">
            <ArrowRight className="ml-2 h-4 w-4" />
            {t("رجوع")}
          </Button>
        </div>

        <Card className="p-6 lg:p-8 mb-8 shadow-soft hover:shadow-medium transition-smooth animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("عنوان العمل")} <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t("أدخل عنوان العمل")}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t("الوصف")} <span className="text-destructive">*</span>
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t("اكتب وصفاً تفصيلياً عن العمل...")}
                rows={8}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t("صورة الغلاف")} <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-4 items-center">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                  disabled={uploadingCover}
                  className="flex-1"
                />
                {uploadingCover && <Loading />}
              </div>
              {formData.cover_image && (
                <img
                  src={formData.cover_image}
                  alt="Cover preview"
                  className="mt-4 w-full h-48 object-cover rounded-lg"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t("صور إضافية (حتى 7 صور)")}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.additional_images.map((img, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleAdditionalImageUpload(e, index)}
                        disabled={uploadingIndex === index}
                        className="flex-1"
                      />
                      {uploadingIndex === index && <Loading />}
                    </div>
                    {img && (
                      <div className="relative">
                        <img
                          src={img}
                          alt={`Additional ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          {index > 0 && formData.additional_images[index - 1] && (
                            <Button
                              type="button"
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8"
                              onClick={() => handleMoveImageUp(index)}
                            >
                              <Upload className="h-4 w-4 rotate-180" />
                            </Button>
                          )}
                          {index < formData.additional_images.length - 1 && formData.additional_images[index + 1] && (
                            <Button
                              type="button"
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8"
                              onClick={() => handleMoveImageDown(index)}
                            >
                              <Upload className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t("روابط فيديو (حتى 7 روابط)")}
              </label>
              <div className="space-y-2">
                {formData.video_links.map((link, index) => (
                  <Input
                    key={index}
                    value={link}
                    onChange={(e) => handleVideoLinkChange(index, e.target.value)}
                    placeholder={`${t("رابط الفيديو")} ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full">
              {editingItem ? t("تحديث العمل") : t("إضافة العمل")}
            </Button>

            {editingItem && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setEditingItem(null);
                  setFormData({
                    title: "",
                    description: "",
                    cover_image: "",
                    additional_images: ["", "", "", "", "", "", ""],
                    video_links: ["", "", "", "", "", "", ""],
                  });
                }}
              >
                {t("إلغاء التعديل")}
              </Button>
            )}
          </form>
        </Card>

        <div className="space-y-4 animate-fade-in">
          <h2 className="text-xl lg:text-2xl font-bold">{t("أعمالك الحالية")}</h2>
          {items.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground shadow-soft">
              {t("لم تضف أي أعمال بعد")}
            </Card>
          ) : (
            items.map((item) => (
              <Card key={item.id} className="p-4 lg:p-6 shadow-soft hover:shadow-medium transition-smooth hover-scale">
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={item.cover_image}
                    alt={item.title}
                    className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg lg:text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-sm lg:text-base text-muted-foreground line-clamp-2 mb-4">
                      {item.description}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                        {t("تعديل")}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        {t("حذف")}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagePortfolio;