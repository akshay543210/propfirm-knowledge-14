import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import PropFirmSection from "../components/PropFirmSection";
import Footer from "../components/Footer";
import AdminPanel from "../components/AdminPanel";
import { useHomepagePropFirms } from "../hooks/useSupabaseData";
import { PropFirm } from "../types/supabase";
import { addTestReviews } from "../utils/addTestReviews";

const Index = () => {
  const { propFirms, loading, error, refetch } = useHomepagePropFirms();
  const [sortBy, setSortBy] = useState<'price' | 'review' | 'trust'>('review');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchResults, setSearchResults] = useState<PropFirm[] | undefined>(undefined);

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin");
    const isAdminUser = adminStatus === "true";
    setIsAdmin(isAdminUser);
    const adminModeStatus = localStorage.getItem("adminMode");
    if (isAdminUser && adminModeStatus === "true") {
      setIsAdminMode(true);
    }
  }, []);

  useEffect(() => {
    if (!loading && propFirms.length > 0) {
      const hasAddedReviews = localStorage.getItem("hasAddedTestReviews");
      if (!hasAddedReviews) {
        addTestReviews().then(success => {
          if (success) {
            localStorage.setItem("hasAddedTestReviews", "true");
          }
        });
      }
    }
  }, [propFirms, loading]);

  useEffect(() => {
    localStorage.setItem("adminMode", isAdminMode.toString());
  }, [isAdminMode]);

  const handleSearchResults = (results: PropFirm[]) => {
    setSearchResults(results);
  };

  return (
    <div className="min-h-screen bg-background font-body noise-overlay">
      <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
      <Hero
        propFirms={propFirms}
        onSearchResults={handleSearchResults}
      />

      {isAdmin && isAdminMode && <AdminPanel />}

      <PropFirmSection
        propFirms={propFirms}
        sortBy={sortBy}
        setSortBy={setSortBy}
        loading={loading}
        error={error}
        onRetry={refetch}
        searchResults={searchResults}
      />
      <Footer />
    </div>
  );
};

export default Index;
