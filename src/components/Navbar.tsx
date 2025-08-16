
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface NavbarProps {
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
}

const Navbar = ({ isAdminMode, setIsAdminMode }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  // Get prop firms from location state or empty array
  const propFirms = location.state?.propFirms || [];

  const handleAdminToggle = () => {
    setIsAdminMode(!isAdminMode);
  };

  return (
    <nav className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
                PropFirm Knowledge
              </Link>
            </div>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/" className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                Home
              </Link>
              <Link 
                to="/propfirms" 
                state={{ propFirms }}
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                All Firms
              </Link>
              <Link 
                to="/reviews" 
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Reviews
              </Link>
              <Link 
                to="/drama-tracker" 
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Drama Tracker
              </Link>
              <Link 
                to="/compare" 
                state={{ propFirms }}
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Compare
              </Link>
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAdmin && (
              <Button
                variant="ghost"
                onClick={handleAdminToggle}
                className={`text-muted-foreground hover:text-primary ${isAdminMode ? 'bg-primary/10 text-primary' : ''}`}
              >
                {isAdminMode ? 'User View' : 'Admin Panel'}
              </Button>
            )}
            {isAdmin && (
              <Link to="/admin-dashboard-2024">
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Full Admin
                </Button>
              </Link>
            )}
            {!isAdmin && (
              <Link to="/admin-login">
                <Button
                  variant="outline"
                  className="border-muted-foreground text-muted-foreground hover:bg-muted"
                >
                  Admin Login
                </Button>
              </Link>
            )}
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Write Review
            </Button>
          </div>

          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-muted-foreground"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-sm border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link 
              to="/propfirms" 
              state={{ propFirms }}
              className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
            >
              All Firms
            </Link>
            <Link 
              to="/reviews" 
              className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
            >
              Reviews
            </Link>
            <Link 
              to="/drama-tracker" 
              className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
            >
              Drama Tracker
            </Link>
            <Link 
              to="/compare" 
              state={{ propFirms }}
              className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
            >
              Compare
            </Link>
            {isAdmin && (
              <div className="border-t border-border pt-2">
                <Button
                  variant="ghost"
                  onClick={handleAdminToggle}
                  className="w-full text-left text-muted-foreground hover:text-primary justify-start"
                >
                  {isAdminMode ? 'User View' : 'Admin Panel'}
                </Button>
                <Link to="/admin-dashboard-2024" className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-left text-primary hover:text-primary/80 justify-start"
                  >
                    Full Admin Dashboard
                  </Button>
                </Link>
              </div>
            )}
            {!isAdmin && (
              <div className="border-t border-border pt-2">
                <Link to="/admin-login" className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-left text-muted-foreground hover:text-foreground justify-start"
                  >
                    Admin Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
