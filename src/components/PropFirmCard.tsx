
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PropFirm } from "@/types/supabase";

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
    <Card 
      className="bg-card border-border hover:border-primary/40 transition-all duration-300 hover:scale-105 animate-fade-in shadow-soft"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
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
            <span className="text-2xl font-bold text-primary">${firm.price}</span>
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
              <span className="text-amber-500 text-lg">★</span>
              <span className="text-foreground font-semibold">{firm.review_score}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Trust Rating</span>
            <span className="text-emerald-600 font-semibold">{firm.trust_rating}/10</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Profit Split</span>
            <span className="text-primary font-semibold">{firm.profit_split}%</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Payout Rate</span>
            <span className="text-info font-semibold">{firm.payout_rate}%</span>
          </div>

          {firm.platform && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Platform</span>
              <span className="text-foreground font-semibold">{firm.platform}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-foreground mb-2">Key Features:</h4>
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
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white transition-all hover:scale-105"
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>
          <Button 
            variant="outline"
            className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
            onClick={handleViewReview}
          >
            Read Full Review
          </Button>
        </div>
        <Button 
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all"
          onClick={handleWriteReview}
        >
          Write Review
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropFirmCard;
