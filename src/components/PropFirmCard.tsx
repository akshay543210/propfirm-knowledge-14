
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PropFirm } from "@/types/supabase";
import { motion } from "framer-motion";
import { useImageLazyLoad } from "@/hooks/useImageLazyLoad";
import { memo } from "react";

interface PropFirmCardProps {
  firm: PropFirm;
  index?: number;
}

const PropFirmCard = memo(({ firm, index = 0 }: PropFirmCardProps) => {
  const navigate = useNavigate();
  const { imgRef, imageSrc, isLoading } = useImageLazyLoad(firm.logo_url || '');

  const discountPercentage = Math.round(((firm.original_price - firm.price) / firm.original_price) * 100);
  
  // Normalize data with fallbacks for consistent display
  const normalizedFirm = {
    ...firm,
    review_score: firm.review_score || 0,
    trust_rating: firm.trust_rating || 0,
    platform: firm.platform || '—',
    features: firm.features?.slice(0, 3) || ['—', '—', '—'],
    coupon_code: firm.coupon_code || 'No coupon'
  };

  const handleBuyNow = () => {
    if (firm.affiliate_url) {
      window.open(firm.affiliate_url, '_blank');
    }
  };

  const handleViewReview = () => {
    navigate(`/firm-reviews/${firm.id}`);
  };

  const handleWriteReview = () => {
    navigate(`/write-review/${firm.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03, y: -5 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col glass-card hover-glow border-primary/20 hover:border-primary/40 transition-all duration-300">
        <CardHeader className="min-h-[120px]">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              {firm.logo_url && (
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-700">
                  <img
                    ref={imgRef}
                    src={imageSrc}
                    alt={`${firm.name} logo`}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      isLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    loading="lazy"
                  />
                  {isLoading && (
                    <div className="absolute inset-0 bg-slate-600 animate-pulse" />
                  )}
                </div>
              )}
              <h3 className="text-xl font-bold text-foreground line-clamp-2 leading-tight">{firm.name}</h3>
            </div>
            {firm.brand && (
              <Badge className="bg-primary/20 text-primary border-primary/30 shrink-0">
                {firm.brand}
              </Badge>
            )}
          </div>
        
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-success">${firm.price}</span>
              <span className="text-lg text-muted-foreground line-through">${firm.original_price}</span>
              <Badge className="bg-destructive/20 text-destructive border-destructive/30">
                -{discountPercentage}%
              </Badge>
            </div>
            
            <div className="h-[60px] flex items-center">
              {normalizedFirm.coupon_code !== 'No coupon' ? (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 w-full">
                  <div className="text-sm text-primary font-medium">Coupon Code</div>
                  <div className="text-lg font-bold text-foreground line-clamp-1">{normalizedFirm.coupon_code}</div>
                </div>
              ) : (
                <div className="bg-muted/10 border border-muted/20 rounded-lg p-3 w-full">
                  <div className="text-sm text-muted-foreground font-medium">No coupon available</div>
                </div>
              )}
            </div>
          </div>
      </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          <p className="text-muted-foreground mb-4 line-clamp-2 min-h-[48px]">{firm.description || 'No description available'}</p>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Review Score</span>
              <div className="flex items-center gap-1">
                <span className="text-warning text-lg">★</span>
                <span className="text-foreground font-semibold">{normalizedFirm.review_score}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Trust Rating</span>
              <span className="text-success font-semibold">{normalizedFirm.trust_rating}/10</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Profit Split</span>
              <span className="text-primary font-semibold">{firm.profit_split}%</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Payout Rate</span>
              <span className="text-accent font-semibold">{firm.payout_rate}%</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Platform</span>
              <span className="text-foreground font-semibold">{normalizedFirm.platform}</span>
            </div>
          </div>
        
          <div className="mt-4 flex-1">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Key Features:</h4>
            <ul className="space-y-1 min-h-[72px]">
              {normalizedFirm.features.map((feature, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-center">
                  <span className="text-primary mr-2">•</span>
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>

        <CardFooter className="gap-2 flex-col mt-auto">
          <div className="flex gap-2 w-full">
            <Button 
              variant="gradient"
              className="flex-1"
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
            <Button 
              variant="outline"
              className="flex-1"
              onClick={handleViewReview}
            >
              Read Full Review
            </Button>
          </div>
          <Button 
            variant="secondary"
            className="w-full"
            onClick={handleWriteReview}
          >
            Write Review
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
});

PropFirmCard.displayName = 'PropFirmCard';

export default PropFirmCard;
