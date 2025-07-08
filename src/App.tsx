
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import FloatingParticles from "@/components/FloatingParticles";
const Index = lazy(() => import("./pages/Index"));
const AllPropFirms = lazy(() => import("./pages/AllPropFirms"));
const Comparison = lazy(() => import("./pages/Comparison"));
const CheapFirms = lazy(() => import("./pages/CheapFirms"));
const TopFirms = lazy(() => import("./pages/TopFirms"));
const PropFirmDetail = lazy(() => import("./pages/PropFirmDetail"));
const Reviews = lazy(() => import("./pages/Reviews"));
const ReviewDetail = lazy(() => import("./pages/ReviewDetail"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <FloatingParticles />
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-900"><span className="loader" /></div>}>
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
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
