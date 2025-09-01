import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, User, LogOut, Shield } from "lucide-react";
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

  const propFirms = location.state?.propFirms || [];

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-md border-b border-gradient-to-r from-blue-500/30 via-purple-500/20 to-blue-500/30 sticky top-0 z-50 shadow-xl shadow-blue-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-3">
              <Link to="/" className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent hover:from-blue-300 hover:via-purple-300 hover:to-cyan-300 transition-all duration-300">
                PropFirm Knowledge
              </Link>
              {isAdmin && (
                <span className="hidden md:inline-flex text-xs px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-blue-200 border border-blue-400/40 backdrop-blur-sm">
                  Admin
                </span>
              )}
            </div>
            
            <div className="hidden md:ml-12 md:flex md:space-x-1">
              <Link to="/" className="relative group text-gray-200 hover:text-white px-4 py-3 text-sm font-semibold transition-all duration-300 rounded-lg hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:shadow-lg">
                <span className="relative z-10">Home</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
              </Link>
              <Link 
                to="/propfirms" 
                state={{ propFirms }}
                className="relative group text-gray-200 hover:text-white px-4 py-3 text-sm font-semibold transition-all duration-300 rounded-lg hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:shadow-lg"
              >
                <span className="relative z-10">All Firms</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
              </Link>
              <Link 
                to="/reviews" 
                className="relative group text-gray-200 hover:text-white px-4 py-3 text-sm font-semibold transition-all duration-300 rounded-lg hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:shadow-lg"
              >
                <span className="relative z-10">Reviews</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
              </Link>
              <Link 
                to="/drama-tracker" 
                className="relative group text-gray-200 hover:text-white px-4 py-3 text-sm font-semibold transition-all duration-300 rounded-lg hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:shadow-lg"
              >
                <span className="relative z-10">Drama Tracker</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
              </Link>
              <Link 
                to="/compare" 
                state={{ propFirms }}
                className="relative group text-gray-200 hover:text-white px-4 py-3 text-sm font-semibold transition-all duration-300 rounded-lg hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:shadow-lg"
              >
                <span className="relative z-10">Compare</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
              </Link>
              <Link 
                to="/table-review" 
                className="relative group text-yellow-300 hover:text-yellow-100 px-4 py-3 text-sm font-bold transition-all duration-300 rounded-lg hover:bg-gradient-to-r hover:from-yellow-600/20 hover:to-orange-600/20 hover:shadow-lg border border-yellow-500/30 hover:border-yellow-400/50"
              >
                <span className="relative z-10">✨ Table Review</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-500/0 to-orange-500/0 group-hover:from-yellow-500/10 group-hover:to-orange-500/10 transition-all duration-300"></div>
              </Link>
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAdmin && (
              <Link to="/admin-dashboard-2024">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-500/30">
                  Admin Dashboard
                </Button>
              </Link>
            )}
            {!user && (
              <>
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="border-2 border-blue-400/50 text-blue-200 hover:bg-blue-600/20 hover:text-white hover:border-blue-300 font-semibold transition-all duration-300 backdrop-blur-sm"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 transition-all duration-300 rounded-lg border border-transparent hover:border-blue-500/30">
                    <User className="h-4 w-4 mr-2" />
                    {user.email ? user.email.split('@')[0] : 'Account'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-800/95 backdrop-blur-md text-gray-200 border border-blue-500/30 shadow-2xl">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/reviews')}>
                    My Reviews
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/admin-dashboard-2024')} className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Panel
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-400">
                    <LogOut className="h-4 w-4 mr-2" />
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
              className="text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 transition-all duration-300 rounded-lg p-2"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-slate-800/98 to-slate-900/98 backdrop-blur-md border-t border-gradient-to-r from-blue-500/30 to-purple-500/30 shadow-2xl">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link to="/" className="block px-4 py-3 text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 transition-all duration-300 rounded-lg font-medium">
              🏠 Home
            </Link>
            <Link 
              to="/propfirms" 
              state={{ propFirms }}
              className="block px-4 py-3 text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 transition-all duration-300 rounded-lg font-medium"
            >
              🏢 All Firms
            </Link>
            <Link 
              to="/reviews" 
              className="block px-4 py-3 text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 transition-all duration-300 rounded-lg font-medium"
            >
              ⭐ Reviews
            </Link>
            <Link 
              to="/drama-tracker" 
              className="block px-4 py-3 text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 transition-all duration-300 rounded-lg font-medium"
            >
              🎭 Drama Tracker
            </Link>
            <Link 
              to="/compare" 
              state={{ propFirms }}
              className="block px-4 py-3 text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 transition-all duration-300 rounded-lg font-medium"
            >
              ⚖️ Compare
            </Link>
            <Link 
              to="/table-review" 
              className="block px-4 py-3 text-yellow-200 hover:text-yellow-100 hover:bg-gradient-to-r hover:from-yellow-600/20 hover:to-orange-600/20 transition-all duration-300 rounded-lg font-bold border border-yellow-500/30 hover:border-yellow-400/50"
            >
              ✨ Table Review
            </Link>
            {isAdmin && (
              <Link 
                to="/admin-dashboard-2024"
                className="block px-4 py-3 text-purple-200 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20 transition-all duration-300 rounded-lg font-bold border border-purple-500/30 hover:border-purple-400/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                👑 Admin Dashboard
              </Link>
            )}
            {!user && (
              <div className="border-t border-gradient-to-r from-blue-500/30 to-purple-500/30 pt-4 mt-4 grid grid-cols-2 gap-3">
                <Link to="/login" className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-left text-blue-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/30 hover:to-purple-600/30 justify-start font-semibold border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🔐 Login
                  </Button>
                </Link>
                <Link to="/signup" className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-left text-cyan-200 hover:text-white hover:bg-gradient-to-r hover:from-cyan-600/30 hover:to-blue-600/30 justify-start font-semibold border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🚀 Sign Up
                  </Button>
                </Link>
              </div>
            )}
            {user && (
              <div className="border-t border-gradient-to-r from-blue-500/30 to-purple-500/30 pt-4 mt-4 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full text-left text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 justify-start font-medium transition-all duration-300 rounded-lg"
                  onClick={() => {
                    navigate('/reviews');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  📝 My Reviews
                </Button>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    className="w-full text-left text-purple-200 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20 justify-start font-medium transition-all duration-300 rounded-lg border border-purple-500/30"
                    onClick={() => {
                      navigate('/admin-dashboard-2024');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    👑 Admin Panel
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="w-full text-left text-red-300 hover:text-red-200 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-pink-600/20 justify-start font-medium transition-all duration-300 rounded-lg"
                  onClick={async () => { 
                    await handleLogout(); 
                    setIsMobileMenuOpen(false); 
                  }}
                >
                  🚪 Logout
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