import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { ArrowRight, Mail, Phone, Globe, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Profile {
  full_name: string;
  username: string;
  bio: string;
  avatar_url: string;
  profession: string;
  location: string;
  contact_email: string;
  phone: string;
  website: string;
  skills: string[];
  emoji: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  additional_images: string[];
  video_links: string[];
}

const FullPortfolio = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    fetchPortfolioData();
  }, [username]);

  const fetchPortfolioData = async () => {
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .eq("has_portfolio_page", true)
        .eq("is_public", true)
        .single();

      if (!profileData) {
        navigate("/404");
        return;
      }

      setProfile(profileData);

      const { data: portfolioItems } = await supabase
        .from("portfolio_items")
        .select("*")
        .eq("profile_id", profileData.id)
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      setItems(portfolioItems || []);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      navigate("/404");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(`/${username}`)}
            className="mb-8"
          >
            <ArrowRight className="ml-2 h-4 w-4" />
            {t("العودة للملف الشخصي")}
          </Button>

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative">
              <img
                src={profile.avatar_url || "/placeholder.svg"}
                alt={profile.full_name}
                className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-xl"
              />
              {profile.emoji && (
                <span className="absolute -top-2 -right-2 text-4xl">{profile.emoji}</span>
              )}
            </div>

            <div className="flex-1 text-center md:text-right">
              <h1 className="text-4xl font-bold mb-2">{profile.full_name}</h1>
              {profile.profession && (
                <p className="text-xl text-muted-foreground mb-4">{profile.profession}</p>
              )}
              {profile.bio && <p className="text-lg mb-6 max-w-3xl">{profile.bio}</p>}

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {profile.contact_email && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${profile.contact_email}`}>
                      <Mail className="ml-2 h-4 w-4" />
                      {t("البريد الإلكتروني")}
                    </a>
                  </Button>
                )}
                {profile.phone && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${profile.phone}`}>
                      <Phone className="ml-2 h-4 w-4" />
                      {t("الهاتف")}
                    </a>
                  </Button>
                )}
                {profile.website && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profile.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="ml-2 h-4 w-4" />
                      {t("الموقع الإلكتروني")}
                    </a>
                  </Button>
                )}
              </div>

              {profile.skills && profile.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6 justify-center md:justify-start">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Items Section */}
      <div className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {t("معرض الأعمال")}
        </h2>

        {items.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground">
            {t("لا توجد أعمال معروضة حالياً")}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300"
                onClick={() => setSelectedItem(item)}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.cover_image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Item Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedItem.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <img
                  src={selectedItem.cover_image}
                  alt={selectedItem.title}
                  className="w-full rounded-lg"
                />

                <p className="text-lg whitespace-pre-wrap leading-relaxed">
                  {selectedItem.description}
                </p>

                {selectedItem.additional_images.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">{t("صور إضافية")}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedItem.additional_images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`${selectedItem.title} ${index + 1}`}
                          className="w-full rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.video_links.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">{t("روابط الفيديو")}</h3>
                    <div className="space-y-2">
                      {selectedItem.video_links.map((link, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full justify-between"
                          asChild
                        >
                          <a href={link} target="_blank" rel="noopener noreferrer">
                            {t("فيديو")} {index + 1}
                            <ExternalLink className="mr-2 h-4 w-4" />
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FullPortfolio;