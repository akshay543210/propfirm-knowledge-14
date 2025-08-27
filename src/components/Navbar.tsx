
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
}

const Navbar = ({ isAdminMode, setIsAdminMode }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  // Get prop firms from location state or empty array
  const propFirms = location.state?.propFirms || [];

  const handleAdminToggle = () => {
    setIsAdminMode(!isAdminMode);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
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
                to="/drama-tracker" 
                className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Drama Tracker
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
            {isAdmin && (
              <Button
                variant="ghost"
                onClick={handleAdminToggle}
                className={`text-gray-300 hover:text-blue-400 ${isAdminMode ? 'bg-blue-600/20 text-blue-400' : ''}`}
              >
                {isAdminMode ? 'User View' : 'Admin Panel'}
              </Button>
            )}
            {isAdmin && (
              <Link to="/admin-dashboard-2024">
                <Button
                  variant="outline"
                  className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-slate-900"
                >
                  Full Admin
                </Button>
              </Link>
            )}
            {!user && (
              <>
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="border-gray-400 text-gray-300 hover:bg-gray-700"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-gray-300">
                    {user.email || 'Account'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-800 text-gray-200 border-blue-500/20">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin-dashboard-2024')}>
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate('/reviews')}>
                    My Reviews
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-400">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
              to="/drama-tracker" 
              className="block px-3 py-2 text-gray-300 hover:text-blue-400 transition-colors"
            >
              Drama Tracker
            </Link>
            <Link 
              to="/compare" 
              state={{ propFirms }}
              className="block px-3 py-2 text-gray-300 hover:text-blue-400 transition-colors"
            >
              Compare
            </Link>
            {isAdmin && (
              <div className="border-t border-gray-700 pt-2">
                <Button
                  variant="ghost"
                  onClick={handleAdminToggle}
                  className="w-full text-left text-gray-300 hover:text-blue-400 justify-start"
                >
                  {isAdminMode ? 'User View' : 'Admin Panel'}
                </Button>
                <Link to="/admin-dashboard-2024" className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-left text-purple-400 hover:text-purple-300 justify-start"
                  >
                    Full Admin Dashboard
                  </Button>
                </Link>
              </div>
            )}
            {!user && (
              <div className="border-t border-gray-700 pt-2 grid grid-cols-2 gap-2">
                <Link to="/login" className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-left text-gray-300 hover:text-gray-200 justify-start"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup" className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-left text-blue-400 hover:text-blue-300 justify-start"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
            {user && (
              <div className="border-t border-gray-700 pt-2 space-y-1">
                {isAdmin && (
                  <Link to="/admin-dashboard-2024" className="block">
                    <Button
                      variant="ghost"
                      className="w-full text-left text-purple-400 hover:text-purple-300 justify-start"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="w-full text-left text-red-400 hover:text-red-300 justify-start"
                  onClick={async () => { await handleLogout(); setIsMobileMenuOpen(false); }}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
