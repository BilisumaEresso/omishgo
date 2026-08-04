import api from "../config/api.js";
import { API_ENDPOINTS } from "../constants/api.js";

const uploadService = {
  /**
   * Upload a single local image (picked from camera/gallery) to the backend,
   * which forwards it to Cloudinary and returns a hosted URL.
   *
   * @param {{ uri: string, mimeType?: string, fileName?: string }} asset - result item from expo-image-picker
   * @returns {Promise<{ success: boolean, url?: string, message?: string }>}
   */
  async uploadImage(asset) {
    try {
      const uri = asset.uri;
      const inferredExt = uri.split(".").pop()?.toLowerCase() || "jpg";
      const mimeType =
        asset.mimeType ||
        (inferredExt === "png"
          ? "image/png"
          : inferredExt === "webp"
            ? "image/webp"
            : "image/jpeg");
      const fileName = asset.fileName || `photo_${Date.now()}.${inferredExt}`;

      const formData = new FormData();
      formData.append("image", {
        uri,
        name: fileName,
        type: mimeType,
      });

      // Pass transformRequest so Axios preserves React Native's native FormData boundary
      const response = await api.post(API_ENDPOINTS.upload.image, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: (data) => data,
      });

      if (response.data?.success && response.data?.data?.url) {
        return { success: true, url: response.data.data.url };
      }
      return { success: false, message: response.data?.message || "Upload failed" };
    } catch (error) {
      console.warn("Upload service error:", error?.response?.data || error.message);
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Image upload failed";
      return { success: false, message };
    }
  },

  /**
   * Upload user profile avatar to Cloudinary and update User avatarUrl field.
   *
   * @param {{ uri: string, mimeType?: string, fileName?: string }} asset
   * @returns {Promise<{ success: boolean, avatarUrl?: string, user?: object, message?: string }>}
   */
  async uploadAvatar(asset) {
    try {
      const uri = asset.uri;
      const inferredExt = uri.split(".").pop()?.toLowerCase() || "jpg";
      const mimeType =
        asset.mimeType ||
        (inferredExt === "png"
          ? "image/png"
          : inferredExt === "webp"
            ? "image/webp"
            : "image/jpeg");
      const fileName = asset.fileName || `avatar_${Date.now()}.${inferredExt}`;

      const formData = new FormData();
      formData.append("avatar", {
        uri,
        name: fileName,
        type: mimeType,
      });

      const response = await api.post(API_ENDPOINTS.upload.avatar, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: (data) => data,
      });

      if (response.data?.success && response.data?.data?.avatarUrl) {
        return {
          success: true,
          avatarUrl: response.data.data.avatarUrl,
          user: response.data.data.user,
        };
      }
      return { success: false, message: response.data?.message || "Avatar upload failed" };
    } catch (error) {
      console.warn("Upload avatar error:", error?.response?.data || error.message);
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Avatar upload failed";
      return { success: false, message };
    }
  },

  /**
   * Remove profile avatar from user profile.
   *
   * @returns {Promise<{ success: boolean, message?: string }>}
   */
  async removeAvatar() {
    try {
      const response = await api.delete(API_ENDPOINTS.upload.avatar);
      if (response.data?.success) {
        return { success: true };
      }
      return { success: false, message: response.data?.message || "Avatar removal failed" };
    } catch (error) {
      console.warn("Remove avatar error:", error?.response?.data || error.message);
      return {
        success: false,
        message: error?.response?.data?.message || error.message || "Avatar removal failed",
      };
    }
  },
};

export default uploadService;
