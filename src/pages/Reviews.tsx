import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Search } from "lucide-react";
import { useReviews, usePropFirms } from "@/hooks/useSupabaseData";
import WriteReviewForm from "@/components/WriteReviewForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { GlassCard } from "@/components/ui/glass-card";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FirmLogo = ({ logoUrl, name }: { logoUrl?: string | null; name: string }) => {
  const [hasError, setHasError] = useState(false);
  if (!logoUrl || hasError) return <div className="w-10 h-10 rounded-lg bg-muted/30" />;
  return (
    <img src={logoUrl} alt={`${name} logo`} className="w-full h-full object-contain" loading="lazy" onError={() => setHasError(true)} />
  );
};

const Reviews = () => {
  const { reviews, loading, error } = useReviews();
  const { propFirms, loading: propFirmsLoading } = usePropFirms();
  const [displayCount, setDisplayCount] = useState(10);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState<any>(null);
  const [sortBy, setSortBy] = useState<string>("newest");

  const filteredFirms = propFirms.filter(firm =>
    firm.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 6);

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "highest": return b.rating - a.rating;
      case "lowest": return a.rating - b.rating;
      case "helpful": return (b.helpful_count || 0) - (a.helpful_count || 0);
      default: return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    }
  });

  const renderStars = (rating: number) => (
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 transition-colors ${i < Math.floor(rating) ? 'fill-warning text-warning' : 'text-muted/30'}`} />
    ))
  );

  const getBadge = (index: number) => {
    const badges = [
      { text: "Most Popular", cls: "bg-primary/15 text-primary border-primary/25" },
      { text: "Editor's Choice", cls: "bg-success/15 text-success border-success/25" },
      { text: "Fast Growing", cls: "bg-warning/15 text-warning border-warning/25" },
    ];
    return badges[index] || { text: "Featured", cls: "bg-muted/15 text-muted-foreground border-border" };
  };

  return (
    <div className="min-h-screen bg-background font-body noise-overlay">
      <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />

      <SectionWrapper divider={false} className="pt-56 sm:pt-36">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 font-heading">Expert Reviews</h1>
            <p className="text-lg text-muted-foreground mb-6">
              In-depth reviews of prop trading firms written by our trading experts
            </p>
            <Button onClick={() => setShowWriteReview(true)} className="bg-success hover:bg-success/90 text-success-foreground font-medium">
              Write Review
            </Button>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search reviews by firm name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Expert Review Cards */}
          {loading || propFirmsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredFirms.map((firm, index) => {
                const badge = getBadge(index);
                return (
                  <GlassCard key={firm.id} className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted/20 flex items-center justify-center">
                        <FirmLogo logoUrl={firm.logo_url} name={firm.name} />
                      </div>
                      <Badge className={`${badge.cls} border text-[10px]`}>{badge.text}</Badge>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 font-heading">{firm.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">{renderStars(firm.review_score || 4.5)}</div>
                      <span className="text-foreground font-semibold text-sm tabular-nums">{firm.review_score || 4.5}</span>
                      <span className="text-muted-foreground text-xs">Expert Rating</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {firm.description || "Professional trading firm offering funding opportunities for traders."}
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
                      <div><span className="text-muted-foreground text-xs">Funding:</span><div className="text-primary font-semibold">{firm.funding_amount}</div></div>
                      <div><span className="text-muted-foreground text-xs">Trust:</span><div className="text-success font-semibold tabular-nums">{firm.trust_rating || 8}/10</div></div>
                      <div><span className="text-muted-foreground text-xs">Profit Split:</span><div className="text-foreground font-semibold tabular-nums">{firm.profit_split}%</div></div>
                      <div><span className="text-muted-foreground text-xs">Payout:</span><div className="text-foreground font-semibold tabular-nums">{firm.payout_rate}%</div></div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/${firm.slug}/reviews`} className="flex-1">
                        <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs">Read Full Review</Button>
                      </Link>
                      <Link to={`/${firm.slug}/write-review`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full border-border text-foreground text-xs">Write Review</Button>
                      </Link>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}

          {/* User Reviews */}
          <GlassCard className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-foreground font-heading">User Reviews</h2>
              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 bg-card border-border text-foreground text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="highest">Highest Rated</SelectItem>
                    <SelectItem value="lowest">Lowest Rated</SelectItem>
                    <SelectItem value="helpful">Most Helpful</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => setShowWriteReview(true)} size="sm" className="bg-success hover:bg-success/90 text-success-foreground text-xs">
                  Write Review
                </Button>
              </div>
            </div>

            {sortedReviews.length > 0 ? (
              <div className="space-y-4">
                {sortedReviews.slice(0, displayCount).map((review) => (
                  <div key={review.id} className="border-b border-border pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="text-muted-foreground text-xs">by {review.reviewer_name}</span>
                        </div>
                        {review.title && <h4 className="text-foreground font-semibold text-sm">{review.title}</h4>}
                      </div>
                      <span className="text-muted-foreground text-xs tabular-nums">
                        {new Date(review.created_at!).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">{review.content}</p>
                  </div>
                ))}

                {showWriteReview && (
                  <div className="border-t border-border pt-4">
                    <WriteReviewForm
                      firmId={selectedFirm?.id || propFirms[0]?.id || ''}
                      firmName={selectedFirm?.name || propFirms[0]?.name || 'PropFirm'}
                      onClose={() => { setShowWriteReview(false); setSelectedFirm(null); }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No user reviews yet.
                {showWriteReview && (
                  <div className="mt-6">
                    <WriteReviewForm
                      firmId={selectedFirm?.id || propFirms[0]?.id || ''}
                      firmName={selectedFirm?.name || propFirms[0]?.name || 'PropFirm'}
                      onClose={() => { setShowWriteReview(false); setSelectedFirm(null); }}
                    />
                  </div>
                )}
              </div>
            )}

            {sortedReviews.length > displayCount && (
              <div className="text-center mt-6">
                <Button onClick={() => setDisplayCount(prev => prev + 10)} variant="outline" className="border-border text-muted-foreground hover:text-foreground">
                  Load More Reviews
                </Button>
              </div>
            )}
          </GlassCard>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
};

export default Reviews;
