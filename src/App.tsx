
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Outfits from "./pages/Outfits";
import Inspirations from "./pages/Inspirations";
import StyleAdvice from "./pages/StyleAdvice";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import PaymentCallback from "./pages/PaymentCallback";
import Accounts from "./pages/Accounts";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { Toaster } from "./components/ui/toaster";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/style-advice" element={
          <ProtectedRoute>
            <StyleAdvice />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/outfits" element={
          <ProtectedRoute>
            <Outfits />
          </ProtectedRoute>
        } />
        <Route path="/inspirations" element={
          <ProtectedRoute>
            <Inspirations />
          </ProtectedRoute>
        } />
        <Route path="/accounts" element={
          <ProtectedRoute>
            <Accounts />
          </ProtectedRoute>
        } />
        <Route path="/payment-callback" element={<PaymentCallback />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
