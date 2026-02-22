import { Facebook, Linkedin, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-card border-t border-border">
      {/* Gradient divider at top */}
      <div className="gradient-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-xl font-bold font-heading gradient-text-primary">
                PropFirm Knowledge
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md text-sm leading-relaxed">
              Your ultimate destination for prop trading firm reviews, comparisons, and insights.
              Make informed decisions with our comprehensive analysis.
            </p>
            <div className="flex space-x-3">
              {[
                { href: "https://facebook.com", icon: Facebook },
                { href: "https://linkedin.com", icon: Linkedin },
                { href: "https://youtube.com", icon: Youtube },
              ].map(({ href, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg glass-panel flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4 text-sm font-heading">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { to: "/", label: "Home" },
                { to: "/propfirms", label: "All Firms" },
                { to: "/compare", label: "Compare" },
                { to: "/reviews", label: "Reviews" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-foreground font-semibold mb-4 text-sm font-heading">Categories</h3>
            <ul className="space-y-2.5">
              {[
                { to: "/propfirms?category=beginner", label: "Beginner Traders" },
                { to: "/propfirms?category=intermediate", label: "Intermediate Traders" },
                { to: "/propfirms?category=pro", label: "Pro Traders" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="gradient-divider my-8" />
        <div className="text-center">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} PropFirm Knowledge. All rights reserved. Trading involves risk. Please trade responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
