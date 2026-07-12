import { useEffect } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import api from "./services/api";
import { useAuthStore } from "./store/auth.store";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Initialize auth header from stored token on app startup
    const stored = localStorage.getItem("adminToken");
    if (stored) {
      api.defaults.headers.common["Authorization"] = `Bearer ${stored}`;
    }
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
