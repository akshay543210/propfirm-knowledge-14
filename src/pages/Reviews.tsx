
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Search } from "lucide-react";
<<<<<<< HEAD
import { useReviews } from "@/hooks/useSupabaseData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Dummy PropFirm data for reviews section
const dummyPropFirmsForReviews = [
  {
    id: "1",
    name: "FTMO",
    slug: "ftmo",
    rating: 4.8,
    expertRating: "Expert Rating",
    description: "FTMO stands as the gold standard in proprietary trading firms. With over 8 years in the market, they've built an impressive reputation through consistent payouts, fair evaluation processes, and excellent customer support.",
    category: "Big",
    trustScore: "9.2/10",
    profitSplit: "90%",
    payoutSpeed: "1-3 days",
    badge: "Most Popular"
  },
  {
    id: "2",
    name: "The Funded Trader",
    slug: "the-funded-trader",
    rating: 4.6,
    expertRating: "Expert Rating",
    description: "The Funded Trader brings innovation to the prop trading space with their flexible evaluation models and trader-friendly policies. Their one-step evaluation process is refreshing, and the ability to trade without traditional restrictions makes them stand out.",
    category: "Big",
    trustScore: "8.8/10",
    profitSplit: "85%",
    payoutSpeed: "2-5 days",
    badge: "Editor's Choice"
  },
  {
    id: "3",
    name: "MyForexFunds",
    slug: "myforexfunds",
    rating: 4.5,
    expertRating: "Expert Rating",
    description: "MyForexFunds has quickly established itself as a major player in the prop trading industry. Their instant funding model is attractive for traders who want to skip traditional evaluations, though this comes with its own set of challenges.",
    category: "Big",
    trustScore: "8.5/10",
    profitSplit: "85%",
    payoutSpeed: "1-2 days",
    badge: "Fast Growing"
  }
];

const Reviews = () => {
  const { reviews, loading, error } = useReviews();
  const [displayCount, setDisplayCount] = useState(10);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFirms = dummyPropFirmsForReviews.filter(firm =>
    firm.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
=======
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
>>>>>>> 0b83ad0 (Your commit message)

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

<<<<<<< HEAD
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Most Popular":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Editor's Choice":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Fast Growing":
=======
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
>>>>>>> 0b83ad0 (Your commit message)
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

<<<<<<< HEAD
  if (loading) {
=======
  if (loading || propFirmsLoading) {
>>>>>>> 0b83ad0 (Your commit message)
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
<<<<<<< HEAD
=======
          <Button 
            onClick={() => setShowWriteReview(true)}
            className="mb-8 bg-green-600 hover:bg-green-700 text-white"
          >
            Write Review
          </Button>
>>>>>>> 0b83ad0 (Your commit message)
          
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

<<<<<<< HEAD
        {/* PropFirm Cards for Reviews */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredFirms.map((firm) => (
=======

        {/* PropFirm Cards for Reviews */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredFirms.map((firm, index) => (
>>>>>>> 0b83ad0 (Your commit message)
            <Card key={firm.id} className="bg-slate-800/50 border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
<<<<<<< HEAD
                  <Badge className={`${getBadgeColor(firm.badge)} border text-xs`}>
                    {firm.badge}
=======
                  <Badge className={`${getBadgeColor(index)} border text-xs`}>
                    {getBadgeText(index)}
>>>>>>> 0b83ad0 (Your commit message)
                  </Badge>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{firm.name}</h3>
                
                <div className="flex items-center gap-2 mb-3">
<<<<<<< HEAD
                  <div className="flex">{renderStars(firm.rating)}</div>
                  <span className="text-white font-semibold">{firm.rating}</span>
                  <span className="text-gray-400 text-sm">{firm.expertRating}</span>
=======
                  <div className="flex">{renderStars(firm.review_score || 4.5)}</div>
                  <span className="text-white font-semibold">{firm.review_score || 4.5}</span>
                  <span className="text-gray-400 text-sm">Expert Rating</span>
>>>>>>> 0b83ad0 (Your commit message)
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-300 text-sm mb-6 line-clamp-4">
<<<<<<< HEAD
                  {firm.description}
=======
                  {firm.description || "Professional trading firm offering funding opportunities for traders."}
>>>>>>> 0b83ad0 (Your commit message)
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
<<<<<<< HEAD
                    <span className="text-gray-400">Category:</span>
                    <div className="text-blue-400 font-semibold">{firm.category}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Trust Score:</span>
                    <div className="text-green-400 font-semibold">{firm.trustScore}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Profit Split:</span>
                    <div className="text-white font-semibold">{firm.profitSplit}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Payout Speed:</span>
                    <div className="text-white font-semibold">{firm.payoutSpeed}</div>
                  </div>
                </div>
                
                <Link to={`/reviews/${firm.slug}`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Read Full Review
                  </Button>
                </Link>
=======
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
                  <Link to={`/firms/${firm.slug}`} className="flex-1">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Read Full Review
                    </Button>
                  </Link>
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      setSelectedFirm(firm);
                      setShowWriteReview(true);
                    }}
                  >
                    Write Review
                  </Button>
                </div>
>>>>>>> 0b83ad0 (Your commit message)
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User Reviews Section */}
        <Card className="bg-slate-800/50 border-blue-500/20">
          <CardHeader>
<<<<<<< HEAD
            <h2 className="text-white text-2xl font-bold">User Reviews</h2>
=======
            <div className="flex justify-between items-center">
              <h2 className="text-white text-2xl font-bold">User Reviews</h2>
              <Button 
                onClick={() => setShowWriteReview(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Write Review
              </Button>
            </div>
>>>>>>> 0b83ad0 (Your commit message)
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
<<<<<<< HEAD
=======
                
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
>>>>>>> 0b83ad0 (Your commit message)
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No user reviews yet.
<<<<<<< HEAD
=======
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
>>>>>>> 0b83ad0 (Your commit message)
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
