import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Briefcase, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ServiceProvider {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  profession: string;
  location: string;
  bio: string;
  emoji: string;
  skills: string[];
  experience_years: number;
}

const ServiceProvidersDirectory = () => {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("show_in_directory", true)
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error("Error fetching providers:", error);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل تحميل قائمة مقدمي الخدمات",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            ← العودة للرئيسية
          </Button>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            دليل مقدمي الخدمات
          </h1>
          <p className="text-muted-foreground">
            اطلع على مقدمي الخدمات المحترفين وتواصل معهم مباشرة
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {providers.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">
              لا يوجد مقدمي خدمات مسجلين حالياً
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <Card
                key={provider.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/${provider.username}`)}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={provider.avatar_url} alt={provider.full_name} />
                    <AvatarFallback className="text-2xl">
                      {provider.emoji || provider.full_name?.charAt(0) || "👤"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-2 w-full">
                    <h3 className="font-bold text-xl text-foreground">
                      {provider.full_name || provider.username}
                    </h3>

                    {provider.profession && (
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        <span>{provider.profession}</span>
                      </div>
                    )}

                    {provider.location && (
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{provider.location}</span>
                      </div>
                    )}

                    {provider.experience_years && (
                      <p className="text-sm text-muted-foreground">
                        {provider.experience_years} سنوات خبرة
                      </p>
                    )}

                    {provider.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-3">
                        {provider.bio}
                      </p>
                    )}

                    {provider.skills && provider.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center mt-3">
                        {provider.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {provider.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{provider.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <Button className="w-full" variant="outline">
                    <ExternalLink className="h-4 w-4 ml-2" />
                    عرض الملف الشخصي
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceProvidersDirectory;
