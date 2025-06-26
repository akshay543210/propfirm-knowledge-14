
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AllPropFirms from "./pages/AllPropFirms";
import Comparison from "./pages/Comparison";
import CheapFirms from "./pages/CheapFirms";
import TopFirms from "./pages/TopFirms";
import PropFirmDetail from "./pages/PropFirmDetail";
import Reviews from "./pages/Reviews";
import ReviewDetail from "./pages/ReviewDetail";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/propfirms" element={<AllPropFirms />} />
          <Route path="/compare" element={<Comparison />} />
          <Route path="/cheap-firms" element={<CheapFirms />} />
          <Route path="/top-firms" element={<TopFirms />} />
          <Route path="/firms/:id" element={<PropFirmDetail />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/reviews/:slug" element={<ReviewDetail />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard-2024" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
