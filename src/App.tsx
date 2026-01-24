import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SplashScreen } from "./components/layout/SplashScreen";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Rides from "./pages/Rides";
import RideDetails from "./pages/RideDetails";
import PostRide from "./pages/PostRide";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import MyRides from "./pages/MyRides";
import Messages from "./pages/Messages";
import DriverGuide from "./pages/DriverGuide";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <NotificationProvider>
        <TooltipProvider>
          <SplashScreen />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/rides" element={<ProtectedRoute><Rides /></ProtectedRoute>} />
              <Route path="/rides/:id" element={<ProtectedRoute><RideDetails /></ProtectedRoute>} />
              <Route path="/post-ride" element={<ProtectedRoute><PostRide /></ProtectedRoute>} />
              <Route path="/driver-guide" element={<ProtectedRoute><DriverGuide /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/user/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              <Route path="/my-rides" element={<ProtectedRoute><MyRides /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
