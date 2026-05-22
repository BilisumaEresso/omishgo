/**
 * Device Service
 * Handles device validation with development bypass and production enforcement
 * Provides stable device ID validation logic
 */

/**
 * Check if running in development mode
 * @returns {boolean} True if NODE_ENV is development
 */
export const isDevMode = () => {
  return process.env.NODE_ENV === "development";
};

/**
 * Log device information for debugging
 * Only logs in development mode to avoid verbose production logs
 * @param {string} deviceId - The device identifier
 * @param {string} source - Source of the log (e.g., "login", "device_move")
 * @param {Object} metadata - Additional metadata
 */
export const logDeviceInfo = (deviceId, source, metadata = {}) => {
  if (!isDevMode()) {
    return; // Don't log in production
  }

  const mode = isDevMode() ? "DEVELOPMENT" : "PRODUCTION";
  console.log(`[DEVICE SERVICE] ${mode} | ${source}`, {
    deviceId: deviceId?.substring(0, 12) + "...", // Truncate for readability
    ...metadata,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Validate device for login
 * In development: Skip strict device lock, log for debugging
 * In production: Enforce one-device-per-account rule
 *
 * @param {Object} user - User document from database
 * @param {string} incomingDeviceId - Device ID from login request
 * @returns {Object} Validation result
 * {
 *   valid: boolean,
 *   message: string (if invalid),
 *   shouldMoveDevice: boolean (if invalid in production)
 * }
 */
export const validateDeviceForLogin = (user, incomingDeviceId) => {
  const mode = isDevMode() ? "DEVELOPMENT" : "PRODUCTION";

  // In development mode: Always allow, skip strict validation
  if (isDevMode()) {
    logDeviceInfo(incomingDeviceId, "LOGIN_DEVELOPMENT_BYPASS", {
      userId: user._id,
      previousDeviceId: user.activeDeviceId?.substring(0, 12) + "...",
      newDeviceId: incomingDeviceId?.substring(0, 12) + "...",
      reason: "Development mode - device lock disabled",
    });

    return {
      valid: true,
      message: "Development mode - device validation bypassed",
      isDevelopmentBypass: true,
    };
  }

  // In production mode: Enforce strict one-device-per-account
  if (user.activeDeviceId && user.activeDeviceId !== incomingDeviceId) {
    logDeviceInfo(incomingDeviceId, "LOGIN_DEVICE_MISMATCH", {
      userId: user._id,
      activeDeviceId: user.activeDeviceId?.substring(0, 12) + "...",
      incomingDeviceId: incomingDeviceId?.substring(0, 12) + "...",
      reason: "Production mode - device mismatch detected",
    });

    return {
      valid: false,
      message: "This account is already active on another device",
      shouldMoveDevice: true,
      code: "DEVICE_ALREADY_ACTIVE",
    };
  }

  return {
    valid: true,
    message: "Device validation passed",
    isDevelopmentBypass: false,
  };
};

/**
 * Update device for user after successful login
 * @param {Object} user - User document
 * @param {string} newDeviceId - New device ID
 * @returns {void}
 */
export const updateUserDevice = (user, newDeviceId) => {
  const oldDeviceId = user.activeDeviceId;

  user.activeDeviceId = newDeviceId;
  user.lastLoginAt = new Date();

  logDeviceInfo(newDeviceId, "DEVICE_UPDATED", {
    userId: user._id,
    previousDeviceId: oldDeviceId?.substring(0, 12) + "...",
    newDeviceId: newDeviceId?.substring(0, 12) + "...",
    mode: isDevMode() ? "development" : "production",
  });
};

/**
 * Get device validation status for this environment
 * @returns {Object} Status information
 */
export const getDeviceValidationStatus = () => {
  return {
    mode: isDevMode() ? "development" : "production",
    deviceLockEnabled: !isDevMode(),
    description: isDevMode()
      ? "Development mode - device lock disabled for testing"
      : "Production mode - strict one-device-per-account enforced",
  };
};
