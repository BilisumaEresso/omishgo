import axios from "axios";
import { API_BASE_URL } from "../constants/api.js";
import storage from "../services/storage.service.js";
import { useAuthStore } from "../store/auth.store.js";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - attach token to every request
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await storage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handle 401 Unauthorized errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized error (401). Logging out user...");
      await useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export default api;
