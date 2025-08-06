import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ArrowLeft, User, Calendar, Camera } from "lucide-react";
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
        setFirm(data);
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
      
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link 
          to="/reviews"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reviews
        </Link>

        {/* Firm Header */}
        <Card className="bg-slate-800/50 border-blue-500/20 mb-8">
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{firm.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(Number(calculateAverageRating()))}</div>
                    <span className="text-white font-semibold text-lg">{calculateAverageRating()}</span>
                    <span className="text-gray-400">({reviews.length} reviews)</span>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {firm.trust_rating}/10 Trust Score
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Firm Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-gray-400 text-sm">Funding:</span>
                <div className="text-blue-400 font-semibold">{firm.funding_amount}</div>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Profit Split:</span>
                <div className="text-white font-semibold">{firm.profit_split}%</div>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Payout Rate:</span>
                <div className="text-white font-semibold">{firm.payout_rate}%</div>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Starting Fee:</span>
                <div className="text-white font-semibold">${firm.starting_fee}</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Write Review Button */}
        <div className="text-center mb-8">
          <Button 
            onClick={() => setShowWriteReview(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
          >
            Write a Review
          </Button>
        </div>

        {/* Reviews Section */}
        <Card className="bg-slate-800/50 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              User Reviews ({reviews.length})
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-slate-700 pb-6 last:border-b-0">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-semibold">{review.reviewer_name}</span>
                            <div className="flex">{renderStars(review.rating)}</div>
                          </div>
                          {review.title && (
                            <h4 className="text-blue-400 font-medium">{review.title}</h4>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Calendar className="h-4 w-4" />
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-4">{review.content}</p>
                    
                    {/* Review Images Placeholder */}
                    <div className="flex gap-2 text-gray-400 text-sm">
                      <Camera className="h-4 w-4" />
                      <span>Images support coming soon</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No reviews yet. Be the first to review {firm.name}!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Write Review Form Modal */}
        {showWriteReview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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