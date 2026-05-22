# Device ID Implementation Guide for Mobile Team

## Overview

The backend now supports development bypass for device validation, making testing in Expo Go much smoother. Here's what mobile needs to implement for production stability.

---

## Backend Changes

### Development Mode (NODE_ENV="development")

- Device ID validation is bypassed
- Multiple devices can login to the same account
- Device ID is still logged for debugging
- Perfect for Expo Go testing

### Production Mode (NODE_ENV="production")

- Strict one-device-per-account enforcement
- Stable device ID required
- Login fails if device ID changes

---

## Mobile Implementation: Getting Stable Device ID

### Create `device.service.js` (or similar)

```javascript
import { Platform } from "react-native";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

const PERSISTENT_DEVICE_ID_KEY = "app_persistent_device_id";

/**
 * Get a stable device ID using priority-based fallback strategy
 * Priority:
 * 1. Native device identifier (when available)
 * 2. Installation ID (more stable)
 * 3. Persisted UUID (fallback)
 */
export const getStableDeviceId = async () => {
  try {
    // Priority 1: Try native device identifier
    if (Device.deviceId) {
      console.log("[Device Service] Using native device ID:", Device.deviceId);
      return Device.deviceId;
    }

    // Priority 2: Try installation ID (more stable than UUID)
    if (Device.installationId) {
      console.log(
        "[Device Service] Using installation ID:",
        Device.installationId,
      );
      return Device.installationId;
    }

    // Priority 3: Try persisted UUID from storage
    let persistedId = await AsyncStorage.getItem(PERSISTENT_DEVICE_ID_KEY);
    if (persistedId) {
      console.log("[Device Service] Using persisted device ID from storage");
      return persistedId;
    }

    // Fallback: Generate and persist new UUID
    const newId = uuidv4();
    await AsyncStorage.setItem(PERSISTENT_DEVICE_ID_KEY, newId);
    console.log("[Device Service] Generated and persisted new device ID");
    return newId;
  } catch (error) {
    console.error("[Device Service] Error getting device ID:", error);
    // Always return something to prevent login crashes
    // This UUID will be different on each app start, but won't crash
    return uuidv4();
  }
};

/**
 * Reset device ID (use with caution - only in specific scenarios)
 */
export const resetDeviceId = async () => {
  try {
    await AsyncStorage.removeItem(PERSISTENT_DEVICE_ID_KEY);
    console.log("[Device Service] Device ID reset");
  } catch (error) {
    console.error("[Device Service] Error resetting device ID:", error);
  }
};

/**
 * Get device info for debugging
 */
export const getDeviceInfo = async () => {
  const deviceId = await getStableDeviceId();
  return {
    deviceId,
    platform: Platform.OS,
    nativeDeviceId: Device.deviceId || "N/A",
    installationId: Device.installationId || "N/A",
    brand: Device.brand || "N/A",
    model: Device.model || "N/A",
    osVersion: Device.osVersion || "N/A",
  };
};
```

---

## Integration: Login Request

### Update Login Payload

```javascript
import { getStableDeviceId } from "./services/device.service";

export const loginUser = async (email, pin) => {
  try {
    // Get stable device ID
    const deviceId = await getStableDeviceId();

    // Make login request
    const response = await fetch("https://api.omishgo.com/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        pin,
        deviceId, // ← Send stable device ID
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Store token and user data
      await AsyncStorage.setItem("authToken", data.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.data.user));
      return data.data;
    } else if (data.code === "DEVICE_ALREADY_ACTIVE") {
      // Handle device move scenario
      return handleDeviceMove(data);
    }

    throw new Error(data.message || "Login failed");
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
```

---

## Device ID Behavior by Environment

### Development (Expo Go Testing)

**Backend:** NODE_ENV=development
**Behavior:** Device validation bypassed

**What happens:**

1. Reinstall app → New device ID generated
2. Try login → Succeeds (device lock disabled)
3. Device ID logged but not enforced

**Perfect for:**

- Testing login/logout flows
- Testing multi-device scenarios
- QA testing on multiple devices

### Production

**Backend:** NODE_ENV=production
**Behavior:** One-device-per-account enforced

**What happens:**

1. Install app → Device ID persisted
2. Login → Device ID saved to account
3. Uninstall/reinstall → Try with new device ID → Device mismatch error
4. User can complete device move flow

**Features:**

- Account security
- Device move support
- Device tracking

---

## Fallback Strategy

If something goes wrong with device ID detection:

```
Try Native ID → Fail
  ↓
Try Installation ID → Fail
  ↓
Try Persisted UUID → Fail
  ↓
Generate new UUID (non-persistent, for this session)
  ↓
Never crash login
```

**Result:** Login always works, even if device ID generation fails

---

## Testing Device ID

### Development Mode Testing

```javascript
// Login from device 1
await loginUser("farmer@example.com", "1234");

// Uninstall app, reinstall from Expo
// Clear AsyncStorage (or don't)

// Login again - should succeed in development mode
await loginUser("farmer@example.com", "1234");
// ✓ Works! (Device lock disabled)
```

### Production Mode Testing

```javascript
// Set NODE_ENV=production in backend

// Login from device 1
await loginUser("farmer@example.com", "1234");
// ✓ Success, device ID stored

// Try login from device 2 with same account
await loginUser("farmer@example.com", "1234");
// ✗ Error: Device already active on another device
// → User can complete device move flow
```

---

## Environment Variables

### Backend

```env
NODE_ENV=development   # Disables device lock for testing
NODE_ENV=production    # Enables device lock enforcement
```

### Mobile

No changes needed - mobile respects backend's device policy automatically.

---

## Device Move Flow (Production)

If user logs in from a different device:

```
1. User tries login from new device
   ↓
2. Backend returns: code="DEVICE_ALREADY_ACTIVE", requiresAction="MOVE_DEVICE"
   ↓
3. App shows: "This account is active on another device. Move device?"
   ↓
4. User clicks "Move Device"
   ↓
5. App calls: POST /api/v1/auth/request-device-move (sends current device ID)
   ↓
6. Backend sends OTP to user's phone
   ↓
7. User receives OTP
   ↓
8. User enters OTP
   ↓
9. App calls: POST /api/v1/auth/confirm-device-move (sends OTP)
   ↓
10. Backend validates OTP, updates activeDeviceId
    ↓
11. User can now login from new device ✓
```

---

## Debugging Device ID Issues

### View Device Info

```javascript
import { getDeviceInfo } from "./services/device.service";

const info = await getDeviceInfo();
console.log(info);
// Output:
// {
//   deviceId: "abc123def456...",
//   platform: "ios",
//   nativeDeviceId: "E621E1F8-C36C-495A-93FC-0C247A3E6E5F",
//   installationId: "installation-123...",
//   brand: "Apple",
//   model: "iPhone12,1",
//   osVersion: "15.1"
// }
```

### Check Backend Logs (Development)

Backend logs device ID source and changes:

```
[DEVICE SERVICE] DEVELOPMENT | LOGIN_DEVELOPMENT_BYPASS
{
  deviceId: "abc123def...",
  previousDeviceId: "def456abc...",
  newDeviceId: "abc123def...",
  reason: "Development mode - device lock disabled"
}
```

### Reset Device ID (Development Only)

```javascript
import { resetDeviceId } from "./services/device.service";

// Only in development/testing
await resetDeviceId();
// Next login will regenerate device ID
```

---

## Common Issues & Solutions

### Issue: "Device already active on another device"

**In Development:**

- This shouldn't happen (device lock is disabled)
- Check NODE_ENV on backend (should be "development")

**In Production:**

- This is expected behavior
- User needs to complete device move flow
- This is a feature, not a bug

### Issue: Device ID changes on app restart

**Cause:** Likely using UUID without persistence
**Solution:** Implement AsyncStorage persistence as shown above

### Issue: Login fails after app uninstall/reinstall

**In Development:** Should work (device lock disabled)
**In Production:** User needs to move device

### Issue: Device ID is different on each login

**Cause:** Not using stable device ID
**Solution:** Use native device ID or installation ID, fall back to persisted UUID

---

## Best Practices

1. **Always use stable device ID** - Don't generate new UUID every login
2. **Persist UUID to AsyncStorage** - So it survives app restarts
3. **Handle device move gracefully** - Provide clear UX
4. **Log device ID changes** - For debugging
5. **Never crash on device ID errors** - Always return something
6. **Test in dev mode first** - Device lock disabled, easier testing
7. **Test device move in prod mode** - Verify full flow works

---

## Summary

**For Mobile Team:**

- Implement stable device ID using priority fallback
- Send deviceId in every login request
- Handle device move flow when needed
- Test in development (device lock disabled) first
- Production will enforce device lock when deployed

**Backend supports both:**

- Development mode: Bypass for testing
- Production mode: Strict enforcement for security
