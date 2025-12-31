import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, BarChart3, Zap } from "lucide-react";

const tradingSlogans = [
  "Building your trading empire...",
  "Analyzing the markets...",
  "Loading prop firm data...",
  "Calculating profit splits...",
  "Fetching the best opportunities...",
  "Preparing your trading dashboard...",
  "Connecting to top firms...",
  "Trade smart, grow fast...",
  "Your funded journey starts here...",
  "Loading trading insights...",
];

const TradingLoader = () => {
  const [currentSlogan, setCurrentSlogan] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sloganInterval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % tradingSlogans.length);
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 300);

    return () => {
      clearInterval(sloganInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        {/* Animated Logo/Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto relative">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-pulse" />
            
            {/* Spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
            
            {/* Inner content */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <TrendingUp className="w-10 h-10 text-white animate-bounce" />
            </div>
          </div>
          
          {/* Floating icons */}
          <div className="absolute -top-2 -left-4 animate-float">
            <DollarSign className="w-6 h-6 text-green-400 opacity-60" />
          </div>
          <div className="absolute -top-2 -right-4 animate-float-delayed">
            <BarChart3 className="w-6 h-6 text-blue-400 opacity-60" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 animate-float">
            <Zap className="w-5 h-5 text-yellow-400 opacity-60" />
          </div>
        </div>

        {/* Brand name */}
        <h1 className="text-2xl font-bold text-white mb-2">
          PropFirm <span className="text-blue-400">Knowledge</span>
        </h1>

        {/* Animated slogan */}
        <div className="h-8 mb-6">
          <p className="text-gray-300 text-lg animate-fade-in" key={currentSlogan}>
            {tradingSlogans[currentSlogan]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs mx-auto">
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-gray-500 text-xs mt-2">
            {Math.round(Math.min(progress, 100))}% loaded
          </p>
        </div>

        {/* Trading tips */}
        <div className="mt-8 text-xs text-gray-500">
          <p>💡 Tip: Compare multiple firms before choosing</p>
        </div>
      </div>
    </div>
  );
};

export default TradingLoader;
