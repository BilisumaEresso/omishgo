import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Application from "expo-application";
import { Platform } from "react-native";

const DEVICE_ID_KEY = "omishgo_device_id";

/**
 * Get or generate a stable device ID that persists across sessions.
 *
 * STEP 1: Check AsyncStorage for existing device ID
 * STEP 2: If exists → return it
 * STEP 3: If NOT exists → generate new device ID using platform-specific logic
 *   - Android: Application.androidId
 *   - iOS: Application.getIosIdForVendorAsync()
 *   - Web: "web-" + timestamp + random
 * STEP 4: If platform APIs fail → fallback: "device-" + timestamp + random
 * STEP 5: Store in AsyncStorage
 * STEP 6: Return device ID
 *
 * Device ID remains stable across:
 * - app restarts
 * - login/logout cycles
 * - navigation changes
 */
export const getDeviceId = async () => {
  try {
    // STEP 1: Check AsyncStorage for existing device ID
    const existingDeviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);

    // STEP 2: If exists → return it immediately
    if (existingDeviceId) {
      console.log("Using existing device ID:", existingDeviceId);
      return existingDeviceId;
    }

    // STEP 3: Generate new device ID using platform-specific logic
    let deviceId;

    if (Platform.OS === "android") {
      try {
        // Android: use Application.androidId
        deviceId = Application.androidId;

        // Check if androidId is valid (not null/undefined)
        if (!deviceId) {
          console.warn("Application.androidId is undefined, using fallback");
          deviceId = generateFallbackDeviceId();
        } else {
          console.log("Generated Android device ID:", deviceId);
        }
      } catch (error) {
        console.warn("Failed to get Android ID, using fallback");
        deviceId = generateFallbackDeviceId();
      }
    } else if (Platform.OS === "ios") {
      try {
        // iOS: use Application.getIosIdForVendorAsync()
        deviceId = await Application.getIosIdForVendorAsync();

        // Check if iOS ID is valid (not null/undefined)
        if (!deviceId) {
          console.warn(
            "Application.getIosIdForVendorAsync() returned undefined, using fallback",
          );
          deviceId = generateFallbackDeviceId();
        } else {
          console.log("Generated iOS device ID:", deviceId);
        }
      } catch (error) {
        console.warn("Failed to get iOS ID, using fallback");
        deviceId = generateFallbackDeviceId();
      }
    } else {
      // Web or other platforms: fallback to "web-" + timestamp + random
      deviceId = `web-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 11)}`;
      console.log("Generated web device ID:", deviceId);
    }

    // STEP 5: Store in AsyncStorage
    try {
      await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
      console.log("Device ID stored in AsyncStorage:", deviceId);
    } catch (storageError) {
      console.error("Failed to store device ID in AsyncStorage:", storageError);
      // Continue with the generated ID even if storage fails
    }

    // STEP 6: Return device ID
    return deviceId;
  } catch (error) {
    console.error("Error in getDeviceId:", error);
    // STEP 4: Fallback if everything fails
    const fallbackId = generateFallbackDeviceId();
    console.log("Using fallback device ID:", fallbackId);
    return fallbackId;
  }
};

/**
 * Generate a fallback device ID if platform-specific APIs fail.
 * Format: "device-" + timestamp + random string
 */
function generateFallbackDeviceId() {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 11);
  return `device-${timestamp}-${randomSuffix}`;
}

/**
 * Clear device ID from AsyncStorage.
 * Use with caution - this should only be used for testing/debugging.
 */
export const clearDeviceId = async () => {
  try {
    await AsyncStorage.removeItem(DEVICE_ID_KEY);
    console.log("Device ID cleared from AsyncStorage");
  } catch (error) {
    console.error("Error clearing device ID:", error);
  }
};

/**
 * Get stored device ID without regenerating if missing.
 * Returns null if no device ID exists.
 */
export const getStoredDeviceId = async () => {
  try {
    return await AsyncStorage.getItem(DEVICE_ID_KEY);
  } catch (error) {
    console.error("Error retrieving stored device ID:", error);
    return null;
  }
};
