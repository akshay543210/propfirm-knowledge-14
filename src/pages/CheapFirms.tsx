
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PropFirmCard from "../components/PropFirmCard";
import { useCheapestFirms } from "../hooks/useSupabaseData";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const CheapFirms = () => {
  const { propFirms, loading, error } = useCheapestFirms();
  const [isAdminMode, setIsAdminMode] = useState(false);

  const goBack = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-white text-lg">Loading cheapest prop firms...</div>
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
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-red-400 text-lg">Error: {error}</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
      
      <div className="container mx-auto px-4 py-8">
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
          <h1 className="text-4xl font-bold text-white mb-4">💰 Cheapest Cost PropFirms</h1>
          <p className="text-xl text-gray-300">Discover the most affordable prop trading firms sorted by starting fee</p>
        </div>

        <div className="mb-6">
          <p className="text-gray-300">
            Showing {propFirms.length} prop firms sorted by lowest starting fee
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {propFirms.map((firm, index) => (
            <PropFirmCard key={firm.id} firm={firm} index={index} />
          ))}
        </div>

        {propFirms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No prop firms found.
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CheapFirms;
