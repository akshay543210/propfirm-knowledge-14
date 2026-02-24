import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PropFirmCard from "../components/PropFirmCard";
import { useSectionMemberships } from "../hooks/useSectionMemberships";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const TopFirms = () => {
  const { topFirms, loading, error, refetch, hasInitialized } = useSectionMemberships();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = async () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      await refetch();
    } else {
      toast.error("Maximum retry attempts reached. Please refresh the page.");
    }
  };

  useEffect(() => {
    if (error && retryCount === 0) {
      // Auto retry once on initial error
      setTimeout(() => {
        handleRetry();
      }, 1000);
    }
  }, [error, retryCount]);

  const goBack = () => {
    window.location.href = '/';
  };

  if (loading && !hasInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
        <div className="container mx-auto px-4 pt-56 sm:pt-36 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <div className="text-white text-lg">Loading top prop firms...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
        <div className="container mx-auto px-4 pt-56 sm:pt-36 py-8">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <div className="text-white text-lg mb-4">Failed to load top firms</div>
            <div className="text-gray-400 text-sm mb-4">{error}</div>
            <Button 
              onClick={handleRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Retrying...' : 'Retry'}
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
      
      <div className="container mx-auto px-4 pt-56 sm:pt-36 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            onClick={goBack}
            className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-900 mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🔥 Top PropFirms</h1>
          <p className="text-xl text-gray-300">The highest-rated prop trading firms</p>
        </div>

        <div className="mb-6">
          <p className="text-gray-300">
            Showing {topFirms.length} top prop firms
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {topFirms.map((firm, index) => (
            <PropFirmCard key={firm.id} firm={firm} index={index} />
          ))}
        </div>

        {topFirms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No top prop firms found.
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default TopFirms;