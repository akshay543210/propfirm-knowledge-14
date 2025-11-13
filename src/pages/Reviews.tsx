
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Search } from "lucide-react";
import { useReviews, usePropFirms } from "@/hooks/useSupabaseData";
import WriteReviewForm from "@/components/WriteReviewForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Reviews = () => {
  const { reviews, loading, error } = useReviews();
  const { propFirms, loading: propFirmsLoading } = usePropFirms();
  const [displayCount, setDisplayCount] = useState(10);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState<any>(null);

  const filteredFirms = propFirms.filter(firm =>
    firm.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 6); // Show first 6 firms for review section

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
        }`}
      />
    ));
  };

  const getBadgeText = (index: number) => {
    switch (index) {
      case 0:
        return "Most Popular";
      case 1:
        return "Editor's Choice";
      case 2:
        return "Fast Growing";
      default:
        return "Featured";
    }
  };

  const getBadgeColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case 1:
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case 2:
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (loading || propFirmsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-white">Loading reviews...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-red-400">Error loading reviews: {error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Expert Reviews</h1>
          <p className="text-gray-300 text-lg mb-8">
            In-depth reviews of prop trading firms written by our trading experts
          </p>
          <Button 
            onClick={() => setShowWriteReview(true)}
            className="mb-8 bg-green-600 hover:bg-green-700 text-white"
          >
            Write Review
          </Button>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search reviews by firm name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-lg bg-white/10 backdrop-blur-sm border-blue-500/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>


        {/* PropFirm Cards for Reviews */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredFirms.map((firm, index) => (
            <Card key={firm.id} className="bg-slate-800/50 border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
              <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-700/60 flex items-center justify-center">
                      {firm.logo_url ? (
                        <img
                          src={firm.logo_url}
                          alt={`${firm.name} logo`}
                          className="w-full h-full object-contain"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) parent.innerHTML = '<div class="w-10 h-10 rounded-lg bg-slate-600"></div>';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-600" />
                      )}
                    </div>
                    <Badge className={`${getBadgeColor(index)} border text-xs`}>
                      {getBadgeText(index)}
                    </Badge>
                  </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{firm.name}</h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">{renderStars(firm.review_score || 4.5)}</div>
                  <span className="text-white font-semibold">{firm.review_score || 4.5}</span>
                  <span className="text-gray-400 text-sm">Expert Rating</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-300 text-sm mb-6 line-clamp-4">
                  {firm.description || "Professional trading firm offering funding opportunities for traders."}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <span className="text-gray-400">Funding:</span>
                    <div className="text-blue-400 font-semibold">{firm.funding_amount}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Trust Rating:</span>
                    <div className="text-green-400 font-semibold">{firm.trust_rating || 8}/10</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Profit Split:</span>
                    <div className="text-white font-semibold">{firm.profit_split}%</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Payout Rate:</span>
                    <div className="text-white font-semibold">{firm.payout_rate}%</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Link to={`/firm-reviews/${firm.id}`} className="flex-1">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Read Full Review
                    </Button>
                  </Link>
                  <Link to={`/write-review/${firm.id}`} className="flex-1">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      Write Review
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User Reviews Section */}
        <Card className="bg-slate-800/50 border-blue-500/20">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-white text-2xl font-bold">User Reviews</h2>
              <Button 
                onClick={() => setShowWriteReview(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Write Review
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.slice(0, displayCount).map((review) => (
                  <div key={review.id} className="border-b border-slate-700 pb-6 last:border-b-0">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="text-gray-400 text-sm">by {review.reviewer_name}</span>
                        </div>
                        {review.title && (
                          <h4 className="text-white font-semibold">{review.title}</h4>
                        )}
                      </div>
                      <span className="text-gray-400 text-sm">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300">{review.content}</p>
                  </div>
                ))}
                
                {/* Write Review Form - moved below the reviews */}
                {showWriteReview && (
                  <div className="border-t border-slate-700 pt-6">
                    <WriteReviewForm
                      firmId={selectedFirm?.id || propFirms[0]?.id || ''}
                      firmName={selectedFirm?.name || propFirms[0]?.name || 'PropFirm'}
                      onClose={() => {
                        setShowWriteReview(false);
                        setSelectedFirm(null);
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No user reviews yet.
                {/* Write Review Form for empty state */}
                {showWriteReview && (
                  <div className="mt-6">
                    <WriteReviewForm
                      firmId={selectedFirm?.id || propFirms[0]?.id || ''}
                      firmName={selectedFirm?.name || propFirms[0]?.name || 'PropFirm'}
                      onClose={() => {
                        setShowWriteReview(false);
                        setSelectedFirm(null);
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {reviews.length > displayCount && (
              <div className="text-center mt-8">
                <Button
                  onClick={() => setDisplayCount(prev => prev + 10)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Load More Reviews
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Reviews;
