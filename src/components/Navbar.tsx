import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { motion, AnimatePresence } from "framer-motion";
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

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/propfirms", label: "All Firms" },
  { to: "/reviews", label: "Reviews" },
  { to: "/drama-tracker", label: "Drama Tracker" },
  { to: "/compare", label: "Compare" },
];

const Navbar = ({ isAdminMode, setIsAdminMode }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const { direction, atTop } = useScrollDirection();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: direction === "down" && !atTop ? -100 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        atTop
          ? "bg-background/60 backdrop-blur-xl border-b border-border/0"
          : "bg-background/80 backdrop-blur-2xl border-b border-border/50 shadow-lg shadow-black/20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl md:text-2xl font-bold font-heading gradient-text-primary hover:opacity-80 transition-opacity">
              PropFirm Knowledge
            </Link>
            {isAdmin && (
              <span className="hidden md:inline-flex ml-3 text-[10px] px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 font-medium animate-glow-pulse">
                Admin
              </span>
            )}

            <div className="hidden md:flex md:ml-10 md:gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                  {isActive(link.to) && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
              <Link
                to="/table-review"
                className="relative px-3 py-2 text-sm font-semibold"
              >
                <span className="relative z-10 gradient-text-primary">✨ Table Review</span>
                {isActive("/table-review") && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:gap-3">
            {isAdmin && (
              <Link to="/admin-dashboard-2024">
                <Button size="sm" className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 font-medium text-xs">
                  <Shield className="h-3.5 w-3.5 mr-1.5" />
                  Admin
                </Button>
              </Link>
            )}
            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <User className="h-4 w-4 mr-1.5" />
                    {user.email ? user.email.split("@")[0] : "Account"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-border">
                  <DropdownMenuLabel className="text-foreground">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/reviews")}>My Reviews</DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/admin-dashboard-2024")}>
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Panel
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-foreground">
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile slide-in menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-card/95 backdrop-blur-2xl border-l border-border z-50 md:hidden"
            >
              <div className="flex justify-end p-4">
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="px-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.to) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/table-review"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-semibold gradient-text-primary"
                >
                  ✨ Table Review
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin-dashboard-2024"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-primary hover:bg-primary/10"
                  >
                    <Shield className="inline h-4 w-4 mr-2" />
                    Admin Dashboard
                  </Link>
                )}
                <div className="gradient-divider my-4" />
                {!user ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full text-sm border-border">Login</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full text-sm bg-primary text-primary-foreground">Sign Up</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground" onClick={() => { navigate("/reviews"); setIsMobileMenuOpen(false); }}>
                      My Reviews
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm text-destructive" onClick={async () => { await handleLogout(); setIsMobileMenuOpen(false); }}>
                      <LogOut className="h-4 w-4 mr-2" />Logout
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
