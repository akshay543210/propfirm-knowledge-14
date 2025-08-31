import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AllPropFirms from "./pages/AllPropFirms";
import Comparison from "./pages/Comparison";
import CheapFirms from "./pages/CheapFirms";
import DramaTracker from "./pages/DramaTracker";
import DramaSubmit from "./pages/DramaSubmit";
import TopFirms from "./pages/TopFirms";
import PropFirmDetail from "./pages/PropFirmDetail";
import Reviews from "./pages/Reviews";
import ReviewDetail from "./pages/ReviewDetail";
import FirmReviewDetail from "./pages/FirmReviewDetail";
import WriteReview from "./pages/WriteReview";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TableReview from "./pages/TableReview";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import PayoutSupportBanner from "@/components/PayoutSupportBanner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PayoutSupportBanner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/propfirms" element={<AllPropFirms />} />
          <Route path="/compare" element={<Comparison />} />
          <Route path="/cheap-firms" element={<CheapFirms />} />
          <Route path="/drama-tracker" element={<DramaTracker />} />
          <Route path="/drama-tracker/submit" element={<DramaSubmit />} />
          <Route path="/top-firms" element={<TopFirms />} />
          <Route path="/firms/:id" element={<PropFirmDetail />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/reviews/:slug" element={<ReviewDetail />} />
          <Route path="/firm-reviews/:firmId" element={<FirmReviewDetail />} />
          <Route path="/write-review/:firmId" element={<WriteReview />} />
          <Route path="/table-review" element={<TableReview />} />

          {/* Public auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin auth */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Protected admin routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin-dashboard-2024" element={<AdminDashboard />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;