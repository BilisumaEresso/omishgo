// Mobile/src/store/saved.store.js
// Global saved-products store — shared across BrowseScreen,
// BuyerSavedScreen, ListingDetailScreen, and BuyerDashboardScreen.
import { create } from "zustand";
import api from "../config/api";
import { API_ENDPOINTS } from "../constants/api";

export const useSavedStore = create((set, get) => ({
  // Set of product IDs that are saved (string IDs)
  savedIds: new Set(),
  // Full saved product objects for the Saved screen
  savedProducts: [],
  loading: false,
  initialized: false,

  /** Load all saved products from the backend and populate both savedIds and savedProducts */
  fetchSaved: async () => {
    set({ loading: true });
    try {
      const res = await api.get(API_ENDPOINTS.saved.list);
      const products = res.data?.data?.products || [];
      const ids = new Set(products.map((p) => p._id));
      set({ savedIds: ids, savedProducts: products, initialized: true });
    } catch (err) {
      console.warn("saved.store fetchSaved:", err.message);
    } finally {
      set({ loading: false });
    }
  },

  /** Toggle save/unsave for a product. Returns the new saved state (true = saved). */
  toggleSave: async (product) => {
    const id = product._id || product.id;
    const { savedIds, savedProducts } = get();
    const isSaved = savedIds.has(id);

    // Optimistic update
    const newIds = new Set(savedIds);
    if (isSaved) {
      newIds.delete(id);
      set({
        savedIds: newIds,
        savedProducts: savedProducts.filter((p) => p._id !== id),
      });
    } else {
      newIds.add(id);
      // Add the full product object so Saved screen has it immediately
      set({
        savedIds: newIds,
        savedProducts: [...savedProducts, product],
      });
    }

    // Sync with backend
    try {
      if (isSaved) {
        await api.delete(API_ENDPOINTS.saved.unsave(id));
      } else {
        await api.post(API_ENDPOINTS.saved.save(id));
      }
      return !isSaved;
    } catch (err) {
      console.warn("saved.store toggleSave:", err.message);
      // Revert optimistic update on failure
      set({ savedIds, savedProducts });
      return isSaved;
    }
  },

  /** Check if a product is saved */
  isSaved: (productId) => get().savedIds.has(productId),
}));
