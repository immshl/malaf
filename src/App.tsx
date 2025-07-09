import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FloatingControls from "@/components/FloatingControls";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import EmailVerification from "./pages/EmailVerification";
import CreateProfile from "./pages/CreateProfile";
import UserProfile from "./pages/UserProfile";
import ExampleProfile from "./pages/ExampleProfile";
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
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/example" element={<ExampleProfile />} />
          <Route path="/profile/:username" element={<UserProfile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <FloatingControls />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
