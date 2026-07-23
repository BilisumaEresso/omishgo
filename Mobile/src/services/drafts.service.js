import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../config/api";
import { API_ENDPOINTS } from "../constants/api";
import uploadService from "./upload.service";

const DRAFTS_KEY = "omishgo_product_drafts";

/**
 * A draft mirrors the create-product payload, plus local-only bookkeeping:
 * {
 *   id: string,                // local id, not a server _id
 *   cropType, quantity, unit, price, description,
 *   location: { region, zone, kebele, wereda },
 *   photos: [{ uri, url }],    // url is null until uploaded
 *   createdAt: number,
 *   syncError: string | null,  // last sync failure message, if any
 * }
 */
const draftsService = {
  async getAll() {
    try {
      const raw = await AsyncStorage.getItem(DRAFTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error("Error reading drafts:", error);
      return [];
    }
  },

  async save(draft) {
    try {
      const drafts = await this.getAll();
      const withoutExisting = drafts.filter((d) => d.id !== draft.id);
      const updated = [draft, ...withoutExisting];
      await AsyncStorage.setItem(DRAFTS_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error("Error saving draft:", error);
      return null;
    }
  },

  async remove(id) {
    try {
      const drafts = await this.getAll();
      const updated = drafts.filter((d) => d.id !== id);
      await AsyncStorage.setItem(DRAFTS_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error("Error removing draft:", error);
      return null;
    }
  },

  async count() {
    const drafts = await this.getAll();
    return drafts.length;
  },

  /**
   * Attempt to fully sync one draft: upload any photos that don't have a
   * cloud URL yet, then create the product, then delete the local draft.
   * Returns { success, message? }. On partial failure the draft is updated
   * in place (photos that succeeded keep their url) so retrying doesn't
   * re-upload everything.
   */
  async syncDraft(draft) {
    try {
      const photos = [...(draft.photos || [])];
      for (let i = 0; i < photos.length; i++) {
        if (photos[i].url) continue;
        const result = await uploadService.uploadImage({ uri: photos[i].uri });
        if (!result.success) {
          await this.save({ ...draft, photos, syncError: result.message });
          return { success: false, message: result.message };
        }
        photos[i] = { ...photos[i], url: result.url };
      }

      await api.post(API_ENDPOINTS.products.create, {
        cropType: draft.cropType,
        quantity: draft.quantity,
        unit: draft.unit,
        price: draft.price,
        description: draft.description,
        photos: photos.map((p) => p.url).filter(Boolean),
        location: draft.location,
      });

      await this.remove(draft.id);
      return { success: true };
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Sync failed";
      await this.save({ ...draft, syncError: message });
      return { success: false, message };
    }
  },

  /** Sync every stored draft, best-effort, one at a time. */
  async syncAll() {
    const drafts = await this.getAll();
    const results = [];
    for (const draft of drafts) {
      results.push(await this.syncDraft(draft));
    }
    return results;
  },
};

export default draftsService;
