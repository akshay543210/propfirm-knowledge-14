
import { Facebook, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900/95 backdrop-blur-sm border-t border-blue-500/20 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                PropFirm Knowledge
              </span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Your ultimate destination for prop trading firm reviews, comparisons, and insights. 
              Make informed decisions with our comprehensive analysis.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/propfirms" className="text-gray-300 hover:text-blue-400 transition-colors">
                  All Firms
                </a>
              </li>
              <li>
                <a href="/compare" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Compare
                </a>
              </li>
              <li>
                <a href="#reviews" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <a href="/propfirms?category=beginner" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Beginner Traders
                </a>
              </li>
              <li>
                <a href="/propfirms?category=intermediate" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Intermediate Traders
                </a>
              </li>
              <li>
                <a href="/propfirms?category=pro" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Pro Traders
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 PropFirmHub. All rights reserved. Trading involves risk. Please trade responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
