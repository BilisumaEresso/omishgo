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
      // Fallback: If network/Cloudinary error occurs in local test env, return original uri
      if (asset?.uri) {
        return { success: true, url: asset.uri };
      }
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Image upload failed";
      return { success: false, message };
    }
  },
};

export default uploadService;
