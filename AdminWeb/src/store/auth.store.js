import { create } from "zustand";
import api from "../services/api";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem("adminToken"),
  loading: false,
  error: null,

  login: async (phone, pin) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/auth/login", { phone, pin });
      const { user, token } = response.data.data;
      
      if (user.role !== "admin") {
        throw new Error("Access denied. Admin only.");
      }

      localStorage.setItem("adminToken", token);
      set({ user, isAuthenticated: true, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message || "Login failed", 
        loading: false 
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("adminToken");
    set({ user: null, isAuthenticated: false });
  },
  
  checkAuth: async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    
    try {
      const response = await api.get("/auth/me");
      const { user } = response.data.data;
      
      if (user.role !== "admin") {
        throw new Error("Access denied. Admin only.");
      }
      
      set({ user, isAuthenticated: true });
    } catch (error) {
      localStorage.removeItem("adminToken");
      set({ isAuthenticated: false, user: null });
    }
  }
}));
