import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from "./components/ProtectedRoute";
import ReportItem from "./pages/ReportItem";
import ItemDetail from "./pages/ItemDetail";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import ImageSearch from "./pages/ImageSearch";
import Chat from "./pages/Chat";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { SocketProvider } from "./context/SocketContext";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <ErrorBoundary>
      <SocketProvider>
      <div className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 selection:text-violet-200 overflow-x-hidden">
        {/* Global Background */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-slate-950/50 to-slate-950 pointer-events-none z-0" />

        {/* Navbar - Show on all pages except auth */}
        {!isAuthPage && <Navbar />}

        {/* Main Content */}
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><ReportItem /></ProtectedRoute>} />
            <Route path="/item/:id" element={<ProtectedRoute><ItemDetail /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/image-search" element={<ProtectedRoute><ImageSearch /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        {/* Footer - Show on all pages except auth */}
        {!isAuthPage && <Footer />}
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.95), rgba(217, 70, 239, 0.95))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px 0 rgba(139, 92, 246, 0.4)',
            color: '#fff',
            fontWeight: '500',
            padding: '16px',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
      </SocketProvider>
    </ErrorBoundary>
  );
}

export default App;
