import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PropFirm } from "@/types/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WriteReviewForm from "@/components/WriteReviewForm";

const WriteReview = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [firm, setFirm] = useState<PropFirm | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    const fetchFirm = async () => {
      if (!slug) return;
      
      try {
        const { data, error } = await supabase
          .from('prop_firms')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setFirm(data as any);
        document.title = `Write Review for ${data.name} | PropFirm Knowledge`;
      } catch (error) {
        console.error('Error fetching firm:', error);
        navigate('/reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchFirm();
  }, [slug, navigate]);

  const handleReviewSubmitted = () => {
    navigate(`/${slug}/reviews`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
          <div className="container mx-auto px-4 pt-56 sm:pt-36 pb-12">
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
          <div className="container mx-auto px-4 pt-56 sm:pt-36 pb-12">
          <div className="text-center text-red-400">Firm not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
      
      <div className="container mx-auto px-4 pt-56 sm:pt-36 pb-12">
        {/* Back Button */}
        <Link 
          to={`/${slug}/reviews`}
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {firm.name} Reviews
        </Link>

        {/* Page Header */}
        <Card className="bg-slate-800/50 border-blue-500/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-3xl text-center">
              Write a Review for {firm.name}
            </CardTitle>
            <p className="text-gray-300 text-center">
              Share your experience to help other traders make informed decisions
            </p>
          </CardHeader>
        </Card>

        {/* Write Review Form */}
        <div className="max-w-2xl mx-auto">
          <WriteReviewForm
            firmId={firm.id}
            firmName={firm.name}
            onClose={handleReviewSubmitted}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WriteReview;