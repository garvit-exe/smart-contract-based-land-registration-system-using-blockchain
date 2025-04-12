import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Web3Provider } from "./contexts/Web3Context";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import PrivacyPolicyCheck from "./components/PrivacyPolicyCheck";
import AIChatbot from "./components/AIChatbot";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import PropertyMortgage from "./pages/PropertyMortgage";
import RegisterProperty from "./pages/RegisterProperty";
import TransferProperty from "./pages/TransferProperty";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import VerifyProperty from "./pages/VerifyProperty";
import Documents from "./pages/Documents";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Web3Provider>
            <Toaster />
            <Sonner />
            <PrivacyPolicyCheck>
              <AIChatbot />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-property" element={<VerifyProperty />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/properties/:id" element={<PropertyDetails />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/settings" element={<Settings />} />
                  
                  <Route path="/register-property" 
                    element={<RoleBasedRoute roles={["official"]}>
                      <RegisterProperty />
                    </RoleBasedRoute>} 
                  />
                  
                  <Route path="/transfer-property/:id" 
                    element={<RoleBasedRoute roles={["owner"]}>
                      <TransferProperty />
                    </RoleBasedRoute>} 
                  />
                  
                  <Route path="/property-mortgage/:id" 
                    element={<RoleBasedRoute roles={["owner"]}>
                      <PropertyMortgage />
                    </RoleBasedRoute>} 
                  />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PrivacyPolicyCheck>
          </Web3Provider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
