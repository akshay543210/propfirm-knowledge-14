import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Page not found</p>
        <div className="flex gap-4 justify-center">
          <Link to="/">
            <Button variant="outline" className="border-border text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
          <Link to="/propfirms">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              All Firms
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
