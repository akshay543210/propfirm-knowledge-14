import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PropFirm } from "@/types/supabase";
import { motion } from "framer-motion";
import { useImageLazyLoad } from "@/hooks/useImageLazyLoad";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { memo } from "react";

interface PropFirmCardProps {
  firm: PropFirm;
  index?: number;
}

const PropFirmCard = memo(({ firm, index = 0 }: PropFirmCardProps) => {
  const navigate = useNavigate();
  const { imgRef, imageSrc, isLoading } = useImageLazyLoad(firm.logo_url || '');

  const discountPercentage = Math.round(((firm.original_price - firm.price) / firm.original_price) * 100);

  const normalizedFirm = {
    ...firm,
    review_score: firm.review_score || 0,
    trust_rating: firm.trust_rating || 0,
    platform: firm.platform || '—',
    features: firm.features?.slice(0, 3) || ['—', '—', '—'],
    coupon_code: firm.coupon_code || 'No coupon'
  };

  const handleBuyNow = () => {
    if (firm.affiliate_url) window.open(firm.affiliate_url, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="h-full"
    >
      <div className="h-full flex flex-col glass-card-premium light-sweep rounded-xl">
        {/* Header zone */}
        <div className="p-5 pb-3">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {firm.logo_url && (
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted/30 shrink-0">
                  <img
                    ref={imgRef}
                    src={imageSrc}
                    alt={`${firm.name} logo`}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    loading="lazy"
                  />
                  {isLoading && <div className="absolute inset-0 bg-muted/30 animate-pulse" />}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-foreground line-clamp-1 font-heading">{firm.name}</h3>
                {normalizedFirm.trust_rating >= 8 && <VerifiedBadge className="mt-1" />}
              </div>
            </div>
            {firm.brand && (
              <Badge className="bg-primary/15 text-primary border-primary/25 text-[10px] shrink-0">
                {firm.brand}
              </Badge>
            )}
          </div>

          {/* Price row */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-bold text-success tabular-nums">${firm.price}</span>
            <span className="text-base text-muted-foreground line-through tabular-nums">${firm.original_price}</span>
            <Badge className="bg-destructive/15 text-destructive border-destructive/25 text-[10px]">
              -{discountPercentage}%
            </Badge>
          </div>

          {/* Coupon */}
          <div className="h-[52px]">
            {normalizedFirm.coupon_code !== 'No coupon' ? (
              <div className="bg-primary/8 border border-primary/15 rounded-lg p-2.5 w-full">
                <div className="text-[10px] text-primary font-medium uppercase tracking-wider">Coupon Code</div>
                <div className="text-sm font-bold text-foreground line-clamp-1 tabular-nums">{normalizedFirm.coupon_code}</div>
              </div>
            ) : (
              <div className="bg-muted/20 border border-border rounded-lg p-2.5 w-full">
                <div className="text-[10px] text-muted-foreground">No coupon available</div>
              </div>
            )}
          </div>
        </div>

        {/* Content zone */}
        <div className="px-5 flex-1 flex flex-col">
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 min-h-[40px]">{firm.description || 'No description available'}</p>

          <div className="space-y-2.5 text-sm">
            {[
              { label: "Review Score", value: <><span className="text-warning">★</span> {normalizedFirm.review_score}</>, className: "text-foreground" },
              { label: "Trust Rating", value: `${normalizedFirm.trust_rating}/10`, className: "text-success" },
              { label: "Profit Split", value: `${firm.profit_split}%`, className: "text-primary" },
              { label: "Payout Rate", value: `${firm.payout_rate}%`, className: "text-accent" },
              { label: "Platform", value: normalizedFirm.platform, className: "text-foreground" },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-muted-foreground">{row.label}</span>
                <span className={`font-semibold tabular-nums ${row.className}`}>{row.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex-1">
            <h4 className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Key Features</h4>
            <ul className="space-y-1 min-h-[60px]">
              {normalizedFirm.features.map((feature, idx) => (
                <li key={idx} className="text-xs text-muted-foreground flex items-center">
                  <span className="text-primary mr-2 text-[8px]">●</span>
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer zone */}
        <div className="p-5 pt-3 mt-auto space-y-2">
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium"
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-muted/50 text-xs"
              onClick={() => navigate(`/${firm.slug}/reviews`)}
            >
              Full Review
            </Button>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="w-full text-xs text-muted-foreground hover:text-foreground"
            onClick={() => navigate(`/${firm.slug}/write-review`)}
          >
            Write Review
          </Button>
        </div>
      </div>
    </motion.div>
  );
});

PropFirmCard.displayName = 'PropFirmCard';

export default PropFirmCard;
