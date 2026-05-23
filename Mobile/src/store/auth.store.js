import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { API_BASE_URL } from "../constants/api.js";
import authService from "../services/auth.service.js";
import storageService from "../services/storage.service.js";

const isTokenExpired = (token) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;

    // Base64Url decode helper
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // Polyfill/safe base64 decoding for React Native
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let str = base64.replace(/=+$/, "");
    let decoded = "";
    let buffer = 0;
    let bits = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const value = chars.indexOf(char);
      if (value === -1) continue;
      buffer = (buffer << 6) | value;
      bits += 6;
      if (bits >= 8) {
        bits -= 8;
        decoded += String.fromCharCode((buffer >> bits) & 0xff);
      }
    }

    const payload = JSON.parse(decoded);
    if (!payload.exp) return true;

    // Expire 10 seconds early to prevent race conditions
    return payload.exp < Date.now() / 1000 - 10;
  } catch (e) {
    return true;
  }
};

/**
 * Platform-safe storage adapter
 * - Native: AsyncStorage
 * - Web: AsyncStorage fallback (safe wrapper)
 */
const storage = {
  getItem: async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ?? null;
    } catch (e) {
      return null;
    }
  },

  setItem: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // ignore on web fallback issues
    }
  },

  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      // ignore
    }
  },
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      isInitializingAuth: true,
      error: null,

      register: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          const result = await authService.register(userData);
console.log(result)
          if (!result.success) {
            set({ isLoading: false, error: result.message });
            return result;
          }

          set({ isLoading: false });
          return result;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, message: error.message };
        }
      },

      login: async (phone, pin) => {
        set({ isLoading: true, error: null });

        try {
          const result = await authService.login(phone, pin);

          if (!result.success) {
            set({ isLoading: false, error: result.message });
            return result;
          }

          // Store refreshToken in AsyncStorage (via storageService)
          if (result.data.refreshToken) {
            await storageService.setRefreshToken(result.data.refreshToken);
          }

          set({
            user: result.data.user,
            token: result.data.token,
            refreshToken: result.data.refreshToken || null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return result;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, message: error.message };
        }
      },

      restoreSession: async () => {
        set({ isInitializingAuth: true, isLoading: true });

        try {
          const token = await storageService.getToken();
          const refreshToken = await storageService.getRefreshToken();
          const user = await storageService.getUser();

          if (!token || !user) {
            set({
              user: null,
              token: null,
              refreshToken: null,
              isAuthenticated: false,
              isLoading: false,
              isInitializingAuth: false,
            });
            return false;
          }

          // Check if token is expired
          if (isTokenExpired(token)) {
            if (refreshToken) {
              console.log("Token expired, attempting silent refresh...");
              try {
                const response = await axios.post(
                  `${API_BASE_URL}/api/v1/auth/refresh-token`,
                  { refreshToken },
                );

                if (response.data?.success) {
                  const { token: newToken, refreshToken: newRefreshToken } =
                    response.data.data;
                  await storageService.setToken(newToken);
                  if (newRefreshToken) {
                    await storageService.setRefreshToken(newRefreshToken);
                  }

                  set({
                    user,
                    token: newToken,
                    refreshToken: newRefreshToken || refreshToken,
                    isAuthenticated: true,
                    isLoading: false,
                    isInitializingAuth: false,
                    error: null,
                  });
                  return true;
                }
              } catch (refreshErr) {
                console.error("Silent refresh failed:", refreshErr.message);
              }
            }

            // Expiry/refresh failed - clean logout
            await authService.logout();
            set({
              user: null,
              token: null,
              refreshToken: null,
              isAuthenticated: false,
              isLoading: false,
              isInitializingAuth: false,
            });
            return false;
          }

          // Session token is valid
          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            isInitializingAuth: false,
            error: null,
          });

          return true;
        } catch (error) {
          console.error("Session restore error:", error.message);
          await authService.logout();
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            isInitializingAuth: false,
          });
          return false;
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          await authService.logout();

          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            isInitializingAuth: false,
            error: null,
          });

          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, message: error.message };
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-store",

      /**
       * IMPORTANT FIX:
       * Use Zustand built-in JSON storage wrapper
       * instead of manual JSON parsing
       */
      storage: createJSONStorage(() => storage),

      /**
       * Only persist essential fields
       */
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
