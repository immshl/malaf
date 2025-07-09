import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-bold text-foreground mb-4">الصفحة غير موجودة</h2>
          <p className="text-muted-foreground mb-8">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
          </p>
        </div>
        
        <Button asChild variant="hero" size="lg">
          <Link to="/" className="inline-flex items-center">
            <Home className="ml-2 h-5 w-5" />
            العودة للصفحة الرئيسية
            <ArrowRight className="mr-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
