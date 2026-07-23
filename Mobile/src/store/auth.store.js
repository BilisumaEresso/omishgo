import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { API_BASE_URL } from "../constants/api.js";
import i18n from "../locales/i18n.js";
import authService from "../services/auth.service.js";
import storageService from "../services/storage.service.js";
const isTokenExpired = token => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;

    // Base64Url decode helper
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // Polyfill/safe base64 decoding for React Native
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let str = base64.replace(/=+$/, "");
    let decoded = "";
    let buffer = 0;
    let bits = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const value = chars.indexOf(char);
      if (value === -1) continue;
      buffer = buffer << 6 | value;
      bits += 6;
      if (bits >= 8) {
        bits -= 8;
        decoded += String.fromCharCode(buffer >> bits & 0xff);
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
const storage = {
  getItem: async key => {
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
  removeItem: async key => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      // ignore
    }
  }
};
export const useAuthStore = create(persist((set, get) => ({
  user: null,
  token: null,
  language: "en",
  isAuthenticated: false,
  isLoading: false,
  isInitializingAuth: true,
  error: null,
  role: null,
  setLanguage: async language => {
    const normalized = ["en", "am", "om"].includes(language) ? language : "en";
    set({
      language: normalized
    });
    try {
      await i18n.changeLanguage(normalized);
      await AsyncStorage.setItem("@app_language", normalized);
    } catch (error) {
      console.warn("Failed to persist app language", error);
    }
  },
  register: async userData => {
    set({
      isLoading: true,
      error: null
    });
    try {
      // Step 1: Create the account
      const result = await authService.register(userData);
      if (!result.success) {
        set({
          isLoading: false,
          error: result.message
        });
        return result;
      }

      // Step 2: Immediately log in with the same credentials so the
      // user lands directly on their role dashboard. RootNavigator will
      // swap to AppNavigator as soon as isAuthenticated flips to true.
      const loginResult = await authService.login(userData.phone, userData.pin);
      if (!loginResult.success) {
        // Registration worked but auto-login failed — send them to Login screen
        set({
          isLoading: false,
          error: null
        });
        return {
          success: true,
          autoLoginFailed: true
        };
      }
      await storageService.setToken(loginResult.data.token);
      await storageService.setUser(loginResult.data.user);
      set({
        user: loginResult.data.user,
        token: loginResult.data.token,
        role: loginResult.data.user.role,
        language: loginResult.data.user.preferredLang || "en",
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      return {
        success: true
      };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message
      });
      return {
        success: false,
        message: error.message
      };
    }
  },
  login: async (phone, pin) => {
    set({
      isLoading: true,
      error: null
    });
    try {
      const result = await authService.login(phone, pin);
      if (!result.success) {
        set({
          isLoading: false,
          error: result.message
        });
        return result;
      }

      // Store refreshToken in AsyncStorage (via storageService)
      await storageService.setToken(result.data.token);
      await storageService.setUser(result.data.user);
      set({
        user: result.data.user,
        token: result.data.token,
        role: result.data.user.role,
        language: result.data.user.preferredLang || "en",
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      return result;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message
      });
      return {
        success: false,
        message: error.message
      };
    }
  },
  restoreSession: async () => {
    set({
      isInitializingAuth: true,
      isLoading: true
    });
    try {
      const token = await storageService.getToken();
      const user = await storageService.getUser();
      if (!token || !user) {
        const storedLanguage = await AsyncStorage.getItem("@app_language");
        set({
          user: null,
          token: null,
          language: storedLanguage || "en",
          isAuthenticated: false,
          isLoading: false,
          isInitializingAuth: false,
          error: null,
          role: null
        });
        return false;
      }

      // Check if token is expired
      if (isTokenExpired(token)) {
        // Expiry - clean logout
        await authService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          isInitializingAuth: false
        });
        return false;
      }

      // Session token is valid
      set({
        user,
        token,
        language: user.preferredLang || "en",
        isAuthenticated: true,
        isLoading: false,
        isInitializingAuth: false,
        error: null
      });
      return true;
    } catch (error) {
      console.error("Session restore error:", error.message);
      await authService.logout();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isInitializingAuth: false
      });
      return false;
    }
  },
  // MVP: Removed requestRole and switchRole since users only have a single role

  logout: async () => {
    set({
      isLoading: true
    });
    try {
      await authService.logout();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isInitializingAuth: false,
        error: null,
        role: null
      });
      return {
        success: true
      };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message
      });
      return {
        success: false,
        message: error.message
      };
    }
  },
  clearError: () => set({
    error: null
  })
}), {
  name: "auth-store",
  storage: createJSONStorage(() => storage),
  /**
   * Only persist non-sensitive fields. `token` and `user` are deliberately
   * excluded: they already live in storageService (the token via
   * expo-secure-store), and restoreSession() reconstructs both from there
   * on every app start. Persisting them here too would mean a second,
   * plaintext copy of the session token sitting in AsyncStorage — exactly
   * what moving to SecureStore was meant to avoid.
   */
  partialize: state => ({
    isAuthenticated: state.isAuthenticated,
    role: state.role,
    language: state.language
  })
}));