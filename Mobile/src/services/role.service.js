import api from "../config/api";
import { API_ENDPOINTS } from "../constants/api";

const roleService = {
  async getMyRoles() {
    try {
      const response = await api.get(API_ENDPOINTS.roles.myRoles);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to load roles",
      };
    }
  },

  async requestRole(role) {
    try {
      const response = await api.post(API_ENDPOINTS.roles.requestRole, {
        role,
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to request role",
      };
    }
  },

  async switchRole(role) {
    try {
      const response = await api.post(API_ENDPOINTS.roles.switchRole, { role });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to switch role",
      };
    }
  },
};

export default roleService;
