
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PropFirm } from "@/types/supabase";
import { motion } from "framer-motion";

interface PropFirmCardProps {
  firm: PropFirm;
  index?: number;
}

const PropFirmCard = ({ firm, index = 0 }: PropFirmCardProps) => {
  const navigate = useNavigate();

  const discountPercentage = Math.round(((firm.original_price - firm.price) / firm.original_price) * 100);

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
    >
      <Card className="glass-card hover-glow border-primary/20 hover:border-primary/40 transition-all duration-300">
        <CardHeader>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-foreground">{firm.name}</h3>
            {firm.brand && (
              <Badge className="bg-primary/20 text-primary border-primary/30">
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
            
            {firm.coupon_code && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                <div className="text-sm text-primary font-medium">Coupon Code</div>
                <div className="text-lg font-bold text-foreground">{firm.coupon_code}</div>
              </div>
            )}
          </div>
      </CardHeader>

        <CardContent>
          <p className="text-muted-foreground mb-4">{firm.description}</p>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Review Score</span>
              <div className="flex items-center gap-1">
                <span className="text-warning text-lg">★</span>
                <span className="text-foreground font-semibold">{firm.review_score}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Trust Rating</span>
              <span className="text-success font-semibold">{firm.trust_rating}/10</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Profit Split</span>
              <span className="text-primary font-semibold">{firm.profit_split}%</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Payout Rate</span>
              <span className="text-accent font-semibold">{firm.payout_rate}%</span>
            </div>

            {firm.platform && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Platform</span>
                <span className="text-foreground font-semibold">{firm.platform}</span>
              </div>
            )}
          </div>
        
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Key Features:</h4>
            <ul className="space-y-1">
              {firm.features.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-center">
                  <span className="text-primary mr-2">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>

        <CardFooter className="gap-2 flex-col">
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
};

export default PropFirmCard;
