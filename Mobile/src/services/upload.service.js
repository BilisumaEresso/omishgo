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
      // React Native's fetch/FormData accepts this { uri, name, type } shape directly.
      formData.append("image", {
        uri,
        name: fileName,
        type: mimeType,
      });

      const response = await api.post(API_ENDPOINTS.upload.image, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        return { success: true, url: response.data.data.url };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Image upload failed";
      return { success: false, message };
    }
  },
};

export default uploadService;
