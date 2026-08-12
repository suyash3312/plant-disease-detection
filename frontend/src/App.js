import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState, createContext, useContext, useCallback } from "react";
import axios from "axios";
import { Toaster } from "sonner";

import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import AuthCallback from "@/pages/AuthCallback";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

axios.defaults.withCredentials = true;

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const r = await axios.get(`${API}/auth/me`);
      setUser(r.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // CRITICAL: If returning from OAuth callback, skip the /me check.
    // AuthCallback will exchange the session_id and establish the session first.
    if (window.location.hash?.includes("session_id=")) {
      setLoading(false);
      return;
    }
    checkAuth();
  }, [checkAuth]);

  const logout = async () => {
    try { await axios.post(`${API}/auth/logout`); } catch {}
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, setUser, loading, checkAuth, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

function AppRouter() {
  const location = useLocation();
  // Detect session_id in hash synchronously during render
  if (location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
          <Toaster position="top-center" richColors closeButton />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
