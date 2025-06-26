import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useReviews } from "@/hooks/useSupabaseData";
import { PropFirm } from "@/types/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WriteReviewForm from "@/components/WriteReviewForm";

const PropFirmDetail = () => {
  const { id } = useParams();
  const [firm, setFirm] = useState<PropFirm | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { reviews, loading: reviewsLoading } = useReviews(firm?.id);

  useEffect(() => {
    const fetchFirm = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('prop_firms')
          .select('*')
          .eq('slug', id)
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
  }, [id]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-white">Loading firm details...</div>
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

  const discountPercentage = Math.round(((firm.original_price - firm.price) / firm.original_price) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
      
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link 
          to="/"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Firm Details Card */}
        <Card className="bg-slate-800/50 border-blue-500/20 mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-3xl font-bold text-white">{firm.name}</h1>
                  {firm.brand && (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {firm.brand}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(Math.round(firm.review_score))}</div>
                    <span className="text-white font-semibold">{firm.review_score}</span>
                    <span className="text-gray-400">({firm.user_review_count} reviews)</span>
                  </div>
                  <div className="text-green-400 font-semibold">
                    Trust: {firm.trust_rating}/10
                  </div>
                </div>

                <p className="text-gray-300 text-lg mb-6">{firm.description}</p>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-6 min-w-[300px]">
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-blue-400">${firm.price}</span>
                    <span className="text-xl text-gray-400 line-through">${firm.original_price}</span>
                  </div>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    Save {discountPercentage}%
                  </Badge>
                </div>

                {firm.coupon_code && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                    <div className="text-sm text-blue-400 font-medium text-center">Coupon Code</div>
                    <div className="text-lg font-bold text-white text-center">{firm.coupon_code}</div>
                  </div>
                )}

                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white mb-3"
                  onClick={() => firm.affiliate_url && window.open(firm.affiliate_url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Get Started
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Firm Details */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Firm Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Funding Amount</span>
                    <span className="text-white font-semibold">{firm.funding_amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Funding</span>
                    <span className="text-white font-semibold">{firm.max_funding || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Profit Split</span>
                    <span className="text-blue-400 font-semibold">{firm.profit_split}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payout Rate</span>
                    <span className="text-purple-400 font-semibold">{firm.payout_rate}%</span>
                  </div>
                  {firm.platform && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Platform</span>
                      <span className="text-white font-semibold">{firm.platform}</span>
                    </div>
                  )}
                  {firm.evaluation_model && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Evaluation</span>
                      <span className="text-white font-semibold">{firm.evaluation_model}</span>
                    </div>
                  )}
                  {firm.regulation && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Regulation</span>
                      <span className="text-white font-semibold">{firm.regulation}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Features & Pros/Cons */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Features</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-green-400 font-semibold mb-2">✓ Pros</h4>
                    <ul className="space-y-1">
                      {firm.pros.map((pro, idx) => (
                        <li key={idx} className="text-gray-300 text-sm">• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-red-400 font-semibold mb-2">✗ Cons</h4>
                    <ul className="space-y-1">
                      {firm.cons.map((con, idx) => (
                        <li key={idx} className="text-gray-300 text-sm">• {con}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-blue-400 font-semibold mb-2">Platform Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {firm.features.map((feature, idx) => (
                        <Badge key={idx} className="bg-slate-700 text-gray-300">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Reviews Section */}
        <Card className="bg-slate-800/50 border-blue-500/20">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white text-2xl">User Reviews</CardTitle>
              <Button
                onClick={() => setShowReviewForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Write Review
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {showReviewForm && (
              <div className="mb-8">
                <WriteReviewForm 
                  firmId={firm.id}
                  firmName={firm.name}
                  onClose={() => setShowReviewForm(false)}
                />
              </div>
            )}

            {reviewsLoading ? (
              <div className="text-center py-8 text-gray-400">Loading reviews...</div>
            ) : reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
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
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No reviews yet. Be the first to review this firm!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default PropFirmDetail;
