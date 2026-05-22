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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor - handle 401 Unauthorized errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 Unauthorized, and we haven't already retried this request
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // Queue the request if we are already refreshing the token
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await storage.getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call direct axios to avoid circular dependency
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh-token`,
          { refreshToken },
        );

        if (response.data?.success) {
          const { token: newToken, refreshToken: newRefreshToken } =
            response.data.data;

          // Update storage
          await storage.setToken(newToken);
          if (newRefreshToken) {
            await storage.setRefreshToken(newRefreshToken);
          }

          // Update Zustand store
          useAuthStore.setState({
            token: newToken,
            refreshToken: newRefreshToken || refreshToken,
            isAuthenticated: true,
          });

          // Process queue
          processQueue(null, newToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          throw new Error("Token refresh response success is false");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        console.warn("Token refresh failed. Logging out user...");

        // Refresh failed: logout cleanly
        await useAuthStore.getState().logout();

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
