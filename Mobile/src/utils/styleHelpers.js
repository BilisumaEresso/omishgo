/**
 * OmishGo Style Utilities
 *
 * Helper functions for common styling patterns
 */

import { Platform } from "react-native";
import { neutralColors } from "./colors";
import { borderRadius, shadows } from "./layout";

/**
 * Get platform-specific shadow styles
 * @param {string} intensity - Shadow intensity (none, sm, md, lg)
 * @returns {object} Platform-specific shadow style
 */
export const getShadow = (intensity = "md") => {
  const shadowPreset = shadows[intensity] || shadows.md;

  return Platform.select({
    ios: {
      shadowColor: shadowPreset.shadowColor,
      shadowOffset: shadowPreset.shadowOffset,
      shadowOpacity: shadowPreset.shadowOpacity,
      shadowRadius: shadowPreset.shadowRadius,
    },
    android: {
      elevation: shadowPreset.elevation,
    },
  });
};

/**
 * Get input border color based on state
 * @param {object} options - Options object
 * @returns {string} Border color
 */
export const getInputBorderColor = ({
  error = false,
  focused = false,
  disabled = false,
  roleColor = neutralColors.borderSubtle,
}) => {
  if (error) return neutralColors.error;
  if (disabled) return neutralColors.borderLight;
  if (focused) return roleColor;
  return neutralColors.borderSubtle;
};

/**
 * Get input background color based on state
 * @param {object} options - Options object
 * @returns {string} Background color
 */
export const getInputBgColor = ({ error = false, disabled = false }) => {
  if (error) return neutralColors.errorLight;
  if (disabled) return neutralColors.surfaceLight;
  return neutralColors.cardBg;
};

/**
 * Get button opacity based on state
 * @param {object} options - Options object
 * @returns {number} Opacity value (0-1)
 */
export const getButtonOpacity = ({
  disabled = false,
  loading = false,
  pressed = false,
}) => {
  if (disabled || loading) return 0.5;
  if (pressed) return 0.8;
  return 1;
};

/**
 * Combine multiple style objects intelligently
 * Last value wins for conflicting properties
 * @param {...any} styles - Style objects to combine
 * @returns {array} Combined style array
 */
export const combineStyles = (...styles) => {
  return styles.filter(Boolean).reduce((acc, style) => {
    if (Array.isArray(style)) {
      return [...acc, ...style];
    }
    return [...acc, style];
  }, []);
};

/**
 * Create role-based focus color
 * @param {string} roleColor - Role primary color
 * @returns {object} Focus color with opacity
 */
export const getRoleFocusStyle = (roleColor) => {
  return {
    borderColor: roleColor,
    borderWidth: 2,
  };
};

/**
 * Get text color based on contrast requirements
 * @param {string} bgColor - Background color hex
 * @returns {string} Text color (dark or light)
 */
export const getContrastTextColor = (bgColor) => {
  // Simple luminance calculation
  const hex = bgColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? neutralColors.textDark : "#FFFFFF";
};

/**
 * Create disabled state styling
 * @param {boolean} disabled - Is disabled
 * @returns {object} Disabled styles
 */
export const getDisabledStyle = (disabled) => {
  if (!disabled) return {};

  return {
    opacity: 0.5,
    pointerEvents: "none",
  };
};

/**
 * Get border radius based on size
 * @param {string} size - Component size (sm, md, lg)
 * @returns {number} Border radius value
 */
export const getBorderRadius = (size = "md") => {
  const radiusMap = {
    sm: borderRadius.md,
    md: borderRadius.lg,
    lg: borderRadius.xl,
  };

  return radiusMap[size] || borderRadius.lg;
};
