import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Monitoring from "./pages/Monitoring";
import Territories from "./pages/Territories";
import Assets from "./pages/Assets";
import Analytics from "./pages/Analytics";
import Risks from "./pages/Risks";
import Reports from "./pages/Reports";
import Audit from "./pages/Audit";
import Integrations from "./pages/Integrations";
import Governance from "./pages/Governance";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
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
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/monitoring" element={<ProtectedRoute><Monitoring /></ProtectedRoute>} />
          <Route path="/territories" element={<ProtectedRoute><Territories /></ProtectedRoute>} />
          <Route path="/assets" element={<ProtectedRoute><Assets /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/risks" element={<ProtectedRoute><Risks /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/audit" element={<ProtectedRoute><Audit /></ProtectedRoute>} />
          <Route path="/integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
          <Route path="/governance" element={<ProtectedRoute><Governance /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
