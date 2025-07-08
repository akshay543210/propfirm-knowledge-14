
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PropFirm } from "@/types/supabase";
<<<<<<< HEAD
=======
import React, { memo, useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { motion } from "framer-motion";
>>>>>>> 0b83ad0 (Your commit message)

interface PropFirmCardProps {
  firm: PropFirm;
  index?: number;
}

const PropFirmCard = ({ firm, index = 0 }: PropFirmCardProps) => {
  const navigate = useNavigate();

  const discountPercentage = Math.round(((firm.original_price - firm.price) / firm.original_price) * 100);

<<<<<<< HEAD
=======
  // Skeleton loader state (simulate loading for demo, replace with real loading state in integration)
  const [isLoading, setIsLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-50px" });

  // Smooth scroll into view on mount (microinteraction)
  useEffect(() => {
    if (index === 0 && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Optionally, you can trigger loading for demo purposes
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

>>>>>>> 0b83ad0 (Your commit message)
  const handleBuyNow = () => {
    if (firm.affiliate_url) {
      window.open(firm.affiliate_url, '_blank');
    }
  };

<<<<<<< HEAD
  const handleViewReview = () => {
=======

  // Fix: navigate to the correct review detail route (should be /firms/:slug or /review-detail/:slug)
  const handleViewReview = () => {
    // Try both, prefer /firms/:slug if that is the review detail route
>>>>>>> 0b83ad0 (Your commit message)
    navigate(`/firms/${firm.slug}`);
  };

  return (
<<<<<<< HEAD
    <Card 
      className="bg-slate-800/50 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-105 animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardHeader>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">{firm.name}</h3>
          {firm.brand && (
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {firm.brand}
            </Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-400">${firm.price}</span>
            <span className="text-lg text-gray-400 line-through">${firm.original_price}</span>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              -{discountPercentage}%
            </Badge>
          </div>
          
          {firm.coupon_code && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <div className="text-sm text-blue-400 font-medium">Coupon Code</div>
              <div className="text-lg font-bold text-white">{firm.coupon_code}</div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-gray-300 mb-4">{firm.description}</p>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Review Score</span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-white font-semibold">{firm.review_score}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Trust Rating</span>
            <span className="text-green-400 font-semibold">{firm.trust_rating}/10</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Profit Split</span>
            <span className="text-blue-400 font-semibold">{firm.profit_split}%</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Payout Rate</span>
            <span className="text-purple-400 font-semibold">{firm.payout_rate}%</span>
          </div>

          {firm.platform && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Platform</span>
              <span className="text-gray-300 font-semibold">{firm.platform}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Key Features:</h4>
          <ul className="space-y-1">
            {firm.features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="text-sm text-gray-400 flex items-center">
                <span className="text-blue-400 mr-2">•</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="gap-2 flex-col">
        <div className="flex gap-2 w-full">
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700 text-white transition-all hover:scale-105"
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>
          <Button 
            variant="outline"
            className="flex-1 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-900 transition-all"
            onClick={handleViewReview}
          >
            View Review
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PropFirmCard;
=======
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.10, ease: "easeOut" }}
      whileHover={{ scale: 1.045, boxShadow: "0 8px 32px 0 rgba(34,139,230,0.18)" }}
      whileTap={{ scale: 0.98 }}
      tabIndex={0}
      aria-label={`Prop firm card for ${firm.name}`}
      className="focus:outline-none focus:ring-2 focus:ring-blue-400 group relative"
      style={{ overflow: 'visible' }}
    >
      {isLoading ? (
        <div className="animate-pulse bg-slate-800/40 border border-blue-500/10 rounded-xl p-6 min-h-[340px] flex flex-col gap-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-700 rounded-lg" />
            <div className="flex-1 h-6 bg-slate-700 rounded w-2/3" />
            <div className="w-16 h-6 bg-blue-900/30 rounded" />
          </div>
          <div className="h-5 bg-slate-700 rounded w-1/2" />
          <div className="h-4 bg-slate-700 rounded w-1/3" />
          <div className="h-4 bg-slate-700 rounded w-1/4" />
          <div className="h-4 bg-slate-700 rounded w-1/4" />
          <div className="h-4 bg-slate-700 rounded w-1/4" />
          <div className="h-4 bg-slate-700 rounded w-1/4" />
          <div className="h-4 bg-slate-700 rounded w-1/4" />
          <div className="flex gap-2 mt-4">
            <div className="flex-1 h-10 bg-green-900/30 rounded" />
            <div className="flex-1 h-10 bg-blue-900/30 rounded" />
          </div>
        </div>
      ) : (
        <Card 
          tabIndex={-1}
          className="bg-slate-800/50 border-blue-500/20 group-hover:border-blue-400/60 group-hover:bg-slate-800/70 transition-all duration-300 shadow-2xl backdrop-blur-lg focus-within:ring-2 focus-within:ring-blue-400 relative overflow-hidden"
          style={{
            backdropFilter: 'blur(12px) saturate(1.3)',
            background: 'linear-gradient(120deg, rgba(30,41,59,0.7) 60%, rgba(67,56,202,0.12) 100%)',
            border: '1.5px solid rgba(59,130,246,0.18)',
            boxShadow: '0 8px 32px 0 rgba(34,139,230,0.18), 0 1.5px 8px 0 rgba(67,56,202,0.10)',
          }}
        >
          {/* Floating animated gradient background */}
          <motion.div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500/30 via-purple-500/20 to-cyan-400/20 blur-2xl opacity-60 z-0 pointer-events-none"
            animate={{
              y: [0, 10, -10, 0],
              x: [0, -10, 10, 0],
              opacity: [0.5, 0.7, 0.5, 0.6],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={firm.logo_url || '/placeholder.svg'}
                  alt={firm.name + ' logo'}
                  loading="lazy"
                  className="w-12 h-12 rounded-lg object-contain bg-slate-700 border border-slate-600 shadow-md animate-pulse"
                  onError={e => (e.currentTarget.src = '/placeholder.svg')}
                />
                <h3 className="text-xl font-bold text-white drop-shadow-lg">{firm.name}</h3>
              </div>
              {firm.brand && (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 animate-fade-in">
                  {firm.brand}
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-400 drop-shadow">${firm.price}</span>
                <span className="text-lg text-gray-400 line-through">${firm.original_price}</span>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-bounce">
                  -{discountPercentage}%
                </Badge>
              </div>
              {firm.coupon_code && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 animate-fade-in">
                  <div className="text-sm text-blue-400 font-medium">Coupon Code</div>
                  <div className="text-lg font-bold text-white tracking-wider">{firm.coupon_code}</div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4 min-h-[48px] animate-pulse-slow">{firm.description}</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Review Score</span>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-lg animate-wiggle">★</span>
                  <span className="text-white font-semibold">{firm.review_score}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Trust Rating</span>
                <span className="text-green-400 font-semibold">{firm.trust_rating}/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Profit Split</span>
                <span className="text-blue-400 font-semibold">{firm.profit_split}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Payout Rate</span>
                <span className="text-purple-400 font-semibold">{firm.payout_rate}%</span>
              </div>
              {firm.platform && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Platform</span>
                  <span className="text-gray-300 font-semibold">{firm.platform}</span>
                </div>
              )}
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Key Features:</h4>
              <ul className="space-y-1">
                {firm.features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="text-sm text-gray-400 flex items-center group hover:text-blue-300 transition-colors">
                    <span className="text-blue-400 mr-2 group-hover:scale-125 transition-transform">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="gap-2 flex-col z-10 relative">
            <div className="flex gap-2 w-full">
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700 text-white transition-all hover:scale-105 focus:ring-2 focus:ring-green-400 focus:outline-none relative overflow-hidden ripple"
                onClick={handleBuyNow}
                tabIndex={0}
                aria-label={`Buy ${firm.name} now`}
                onMouseDown={e => {
                  const ripple = document.createElement('span');
                  ripple.className = 'ripple-effect';
                  ripple.style.left = `${e.nativeEvent.offsetX}px`;
                  ripple.style.top = `${e.nativeEvent.offsetY}px`;
                  e.currentTarget.appendChild(ripple);
                  setTimeout(() => ripple.remove(), 500);
                }}
              >
                Buy Now
              </Button>
              <Button 
                variant="outline"
                className="flex-1 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-900 transition-all focus:ring-2 focus:ring-blue-400 focus:outline-none relative overflow-hidden ripple"
                onClick={handleViewReview}
                tabIndex={0}
                aria-label={`View review for ${firm.name}`}
                onMouseDown={e => {
                  const ripple = document.createElement('span');
                  ripple.className = 'ripple-effect';
                  ripple.style.left = `${e.nativeEvent.offsetX}px`;
                  ripple.style.top = `${e.nativeEvent.offsetY}px`;
                  e.currentTarget.appendChild(ripple);
                  setTimeout(() => ripple.remove(), 500);
                }}
              >
                View Review
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </motion.div>
  );
};

// Add ripple effect CSS
const style = document.createElement('style');
style.innerHTML = `
.ripple-effect {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 0.5s linear;
  background: rgba(255,255,255,0.3);
  pointer-events: none;
  width: 100px;
  height: 100px;
  opacity: 0.7;
  z-index: 10;
}
@keyframes ripple {
  to {
    transform: scale(2.5);
    opacity: 0;
  }
}`;
if (typeof window !== 'undefined' && !document.head.querySelector('style[data-ripple]')) {
  style.setAttribute('data-ripple', '');
  document.head.appendChild(style);
}

export default memo(PropFirmCard);
>>>>>>> 0b83ad0 (Your commit message)
