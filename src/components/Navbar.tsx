import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
}

const Navbar = ({ isAdminMode, setIsAdminMode }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  // Get prop firms from location state or empty array
  const propFirms = location.state?.propFirms || [];

  // Check admin status from localStorage
  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin");
    setIsAdmin(adminStatus === "true");
  }, []);

  const handleAdminToggle = () => {
    setIsAdminMode(!isAdminMode);
  };

  return (
    <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-blue-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                PropFirm Knowledge
              </Link>
            </div>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/" className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors">
                Home
              </Link>
              <Link 
                to="/propfirms" 
                state={{ propFirms }}
                className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                All Firms
              </Link>
              <Link 
                to="/reviews" 
                className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Reviews
              </Link>
              <Link 
                to="/compare" 
                state={{ propFirms }}
                className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Compare
              </Link>
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Removed Admin Login button */}
          </div>

          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800/95 backdrop-blur-sm border-t border-blue-500/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-gray-300 hover:text-blue-400 transition-colors">
              Home
            </Link>
            <Link 
              to="/propfirms" 
              state={{ propFirms }}
              className="block px-3 py-2 text-gray-300 hover:text-blue-400 transition-colors"
            >
              All Firms
            </Link>
            <Link 
              to="/reviews" 
              className="block px-3 py-2 text-gray-300 hover:text-blue-400 transition-colors"
            >
              Reviews
            </Link>
            <Link 
              to="/compare" 
              state={{ propFirms }}
              className="block px-3 py-2 text-gray-300 hover:text-blue-400 transition-colors"
            >
              Compare
            </Link>
            {/* Removed Admin Login button from mobile */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
