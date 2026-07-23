import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_KEY = "omishgo_browse_cache";

const browseCacheService = {
  async set(products) {
    try {
      await AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ products, cachedAt: Date.now() }),
      );
    } catch (error) {
      console.error("Error caching browse results:", error);
    }
  },

  /** @returns {Promise<{ products: object[], cachedAt: number } | null>} */
  async get() {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error("Error reading browse cache:", error);
      return null;
    }
  },
};

export default browseCacheService;
