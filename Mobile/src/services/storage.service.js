import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const STORAGE_KEYS = {
  TOKEN: "omishgo_token",
  USER: "omishgo_user",
};

// The JWT grants API access, so it belongs in the OS-encrypted keychain/
// keystore (SecureStore), not plaintext AsyncStorage — a lost/rooted
// device or a plain file-system read shouldn't hand over a working
// session token. SecureStore has no web implementation, so web (Expo web
// target only — not used for the pilot, but keeps `npm run mobile:web`
// from crashing) falls back to AsyncStorage.
const isWeb = Platform.OS === "web";

const storage = {
  async getToken() {
    try {
      return isWeb
        ? await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)
        : await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  async setToken(token) {
    try {
      if (isWeb) {
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
      } else {
        await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, token);
      }
    } catch (error) {
      console.error("Error setting token:", error);
    }
  },

  async removeToken() {
    try {
      if (isWeb) {
        await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
      } else {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN);
      }
    } catch (error) {
      console.error("Error removing token:", error);
    }
  },

  async getUser() {
    try {
      const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  },

  async setUser(user) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error("Error setting user:", error);
    }
  },

  async removeUser() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error("Error removing user:", error);
    }
  },

  async clear() {
    try {
      await this.removeToken();
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  },
};

export default storage;
