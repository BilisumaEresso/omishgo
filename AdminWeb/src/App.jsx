import { useEffect } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Users from "./pages/Users";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
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
        
        {/* Protected Admin Routes wrapped in AdminLayout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Users />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Orders />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Products />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
