import api from "../config/api.js";
import { API_ENDPOINTS } from "../constants/api.js";
import { getDeviceId } from "../utils/deviceId.js";
import storage from "./storage.service.js";

const authService = {
  async register(userData) {
    try {
      const registrationData = {
        name: userData.name,
        phone: userData.phone,
        pin: userData.pin,
        role: userData.role,
      };

      // Only include email if it's provided and not empty
      if (userData.email && userData.email.trim()) {
        registrationData.email = userData.email;
      }

      const response = await api.post(
        API_ENDPOINTS.auth.register,
        registrationData,
      );

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
        };
      }

      return {
        success: false,
        message: response.data.message,
        errors: response.data.errors,
      };
    } catch (error) {
      console.error(error);
      return handleApiError(error);
    }
  },

  async login(phone, pin) {
    try {
      // Retrieve device ID before sending request
      const deviceId = await getDeviceId();
      console.log("LOGIN PAYLOAD DEVICE_ID:", deviceId);

      const response = await api.post(API_ENDPOINTS.auth.login, {
        phone,
        pin,
        deviceId,
      });

      if (response.data.success) {
        const { token, user } = response.data.data;
        await storage.setToken(token);
        await storage.setUser(user);

        return {
          success: true,
          data: { token, user },
        };
      }

      // Check for DEVICE_ALREADY_ACTIVE error from backend
      if (response.data.data?.code === "DEVICE_ALREADY_ACTIVE") {
        return {
          success: false,
          errorType: "DEVICE_BLOCKED",
          message: response.data.message,
          phone, // Pass phone for device move flow
        };
      }

      return {
        success: false,
        message: response.data.message,
        errors: response.data.errors,
      };
    } catch (error) {
      if (error.response?.data?.data?.code === "DEVICE_ALREADY_ACTIVE") {
        return {
          success: false,
          errorType: "DEVICE_BLOCKED",
          message: error.response.data.message,
          phone,
        };
      }
      return handleApiError(error);
    }
  },

  async restoreSession() {
    try {
      const token = await storage.getToken();
      const user = await storage.getUser();

      if (!token || !user) {
        return { success: false, message: "No session found" };
      }

      // MVP: Check local storage only, no API call for speed
      // TODO: In production, validate token with server
      return {
        success: true,
        data: { user, token },
      };
    } catch (error) {
      console.error("Session restore error:", error.message);
      await storage.clear();
      return { success: false, message: "Session restore failed" };
    }
  },

  async logout() {
    try {
      await storage.clear();
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false };
    }
  },

  async requestDeviceMove(phone) {
    try {
      const response = await api.post(API_ENDPOINTS.auth.requestDeviceMove, {
        phone,
      });

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
        };
      }

      return {
        success: false,
        message: response.data.message,
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async confirmDeviceMove(phone, otp, deviceId) {
    try {
      const response = await api.post(API_ENDPOINTS.auth.confirmDeviceMove, {
        phone,
        otp,
        deviceId,
      });

      if (response.data.success) {
        const { token, user } = response.data.data;
        await storage.setToken(token);
        await storage.setUser(user);

        return {
          success: true,
          data: { token, user },
        };
      }

      return {
        success: false,
        message: response.data.message,
      };
    } catch (error) {
      return handleApiError(error);
    }
  },
};

function handleApiError(error) {
  if (error.response?.data) {
    return {
      success: false,
      message: error.response.data.message,
      errors: error.response.data.errors,
    };
  }

  if (error.message === "Network Error") {
    return {
      success: false,
      message: "Network error. Please check your connection.",
    };
  }

  return {
    success: false,
    message: error.message || "An error occurred",
  };
}

export default authService;
