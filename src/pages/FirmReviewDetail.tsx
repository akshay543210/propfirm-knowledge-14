import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ArrowLeft, User, Calendar, DollarSign, TrendingUp, Award, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PropFirm, Review } from "@/types/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WriteReviewForm from "@/components/WriteReviewForm";
import { useReviews } from "@/hooks/useSupabaseData";

const FirmReviewDetail = () => {
  const { firmId } = useParams();
  const [firm, setFirm] = useState<PropFirm | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const { reviews, loading: reviewsLoading } = useReviews(firmId);

  useEffect(() => {
    const fetchFirm = async () => {
      if (!firmId) return;
      
      try {
        const { data, error } = await supabase
          .from('prop_firms')
          .select('*')
          .eq('id', firmId)
          .single();

        if (error) throw error;
        setFirm(data as any);
      } catch (error) {
        console.error('Error fetching firm:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFirm();
  }, [firmId]);

  // Real-time subscription for new reviews
  useEffect(() => {
    if (!firmId) return;

    const channel = supabase
      .channel('firm-reviews')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reviews',
          filter: `firm_id=eq.${firmId}`
        },
        (payload) => {
          console.log('New review added:', payload);
          // The useReviews hook will handle the update
          window.location.reload();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [firmId]);

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

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading || reviewsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-white">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!firm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-red-400">Firm not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
      
      <div className="container mx-auto px-4 py-6 md:py-12 max-w-7xl">
        {/* Back Button */}
        <Link 
          to="/reviews"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reviews
        </Link>

        {/* Firm Header */}
        <Card className="bg-slate-800/50 border-blue-500/20 backdrop-blur-sm mb-6 md:mb-8">
          <CardHeader className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 mb-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-slate-700/60 flex items-center justify-center flex-shrink-0 shadow-lg">
                {firm.logo_url ? (
                  <img
                    src={firm.logo_url}
                    alt={`${firm.name} logo`}
                    className="w-full h-full object-contain p-2"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-slate-600" />
                )}
              </div>
              <div className="flex-1 w-full sm:w-auto">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">{firm.name}</h1>
                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(Number(calculateAverageRating()))}</div>
                    <span className="text-white font-semibold text-lg md:text-xl">{calculateAverageRating()}</span>
                    <span className="text-gray-400 text-sm md:text-base">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-sm md:text-base">
                    <Award className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    {firm.trust_rating}/10 Trust Score
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30 hover:border-blue-500/30 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-400 text-xs md:text-sm font-medium">Funding</span>
                </div>
                <div className="text-blue-400 font-bold text-lg md:text-xl">{firm.funding_amount}</div>
                {firm.max_funding && (
                  <div className="text-gray-500 text-xs mt-1">Max: {firm.max_funding}</div>
                )}
              </div>
              
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30 hover:border-green-500/30 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span className="text-gray-400 text-xs md:text-sm font-medium">Profit Split</span>
                </div>
                <div className="text-green-400 font-bold text-lg md:text-xl">{firm.profit_split}%</div>
              </div>
              
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30 hover:border-purple-500/30 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-purple-400" />
                  <span className="text-gray-400 text-xs md:text-sm font-medium">Payout Rate</span>
                </div>
                <div className="text-purple-400 font-bold text-lg md:text-xl">{firm.payout_rate}%</div>
              </div>
              
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30 hover:border-yellow-500/30 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-yellow-400" />
                  <span className="text-gray-400 text-xs md:text-sm font-medium">Starting Fee</span>
                </div>
                <div className="text-yellow-400 font-bold text-lg md:text-xl">${firm.starting_fee}</div>
                {firm.coupon_code && (
                  <div className="text-green-400 text-xs mt-1 font-medium">Code: {firm.coupon_code}</div>
                )}
              </div>
            </div>

            {/* Additional Info Row */}
            {(firm.platform || firm.evaluation_model || firm.regulation) && (
              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  {firm.platform && (
                    <div>
                      <span className="text-gray-500">Platform:</span>
                      <span className="text-gray-300 ml-2 font-medium">{firm.platform}</span>
                    </div>
                  )}
                  {firm.evaluation_model && (
                    <div>
                      <span className="text-gray-500">Evaluation:</span>
                      <span className="text-gray-300 ml-2 font-medium">{firm.evaluation_model}</span>
                    </div>
                  )}
                  {firm.regulation && (
                    <div>
                      <span className="text-gray-500">Regulation:</span>
                      <span className="text-gray-300 ml-2 font-medium">{firm.regulation}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Write Review Button */}
        <div className="text-center mb-6 md:mb-8">
          <Button 
            onClick={() => setShowWriteReview(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 md:px-8 py-3 text-base md:text-lg font-semibold shadow-lg hover:shadow-green-500/20 transition-all"
          >
            <Star className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            Write a Review
          </Button>
        </div>

        {/* Reviews Section */}
        <Card className="bg-slate-800/50 border-blue-500/20 backdrop-blur-sm">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-white text-xl md:text-2xl flex items-center gap-2">
              <User className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
              User Reviews ({reviews.length})
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-4 md:p-6">
            {reviews.length > 0 ? (
              <div className="space-y-6 md:space-y-8">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-slate-700/50 pb-6 md:pb-8 last:border-b-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                          <User className="h-5 w-5 md:h-6 md:w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-white font-semibold text-base md:text-lg">{review.reviewer_name}</span>
                            <div className="flex">{renderStars(review.rating)}</div>
                          </div>
                          {review.title && (
                            <h4 className="text-blue-400 font-medium text-sm md:text-base mt-1">{review.title}</h4>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-xs md:text-sm sm:ml-auto flex-shrink-0">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-4 ml-0 sm:ml-14">{review.content}</p>
                    
                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 md:gap-3 flex-wrap mt-4 ml-0 sm:ml-14">
                        {review.images.map((imageUrl, idx) => (
                          <img
                            key={idx}
                            src={imageUrl}
                            alt={`Review image ${idx + 1}`}
                            className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 hover:scale-105 transition-all shadow-md"
                            onClick={() => window.open(imageUrl, '_blank')}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 md:py-16">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 md:h-10 md:w-10 text-gray-500" />
                </div>
                <p className="text-gray-400 text-base md:text-lg">
                  No reviews yet. Be the first to review {firm.name}!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Write Review Form Modal */}
        {showWriteReview && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8">
              <WriteReviewForm
                firmId={firm.id}
                firmName={firm.name}
                onClose={() => setShowWriteReview(false)}
              />
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default FirmReviewDetail;