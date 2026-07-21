

import { Platform } from "react-native";
import { neutralColors } from "./colors";
import { borderRadius, shadows } from "./layout";


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


export const getInputBgColor = ({ error = false, disabled = false }) => {
  if (error) return neutralColors.errorLight;
  if (disabled) return neutralColors.surfaceLight;
  return neutralColors.cardBg;
};


export const getButtonOpacity = ({
  disabled = false,
  loading = false,
  pressed = false,
}) => {
  if (disabled || loading) return 0.5;
  if (pressed) return 0.8;
  return 1;
};


export const combineStyles = (...styles) => {
  return styles.filter(Boolean).reduce((acc, style) => {
    if (Array.isArray(style)) {
      return [...acc, ...style];
    }
    return [...acc, style];
  }, []);
};


export const getRoleFocusStyle = (roleColor) => {
  return {
    borderColor: roleColor,
    borderWidth: 2,
  };
};


export const getContrastTextColor = (bgColor) => {
  // Simple luminance calculation
  const hex = bgColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? neutralColors.textDark : "#FFFFFF";
};


export const getDisabledStyle = (disabled) => {
  if (!disabled) return {};

  return {
    opacity: 0.5,
    pointerEvents: "none",
  };
};


export const getBorderRadius = (size = "md") => {
  const radiusMap = {
    sm: borderRadius.md,
    md: borderRadius.lg,
    lg: borderRadius.xl,
  };

  return radiusMap[size] || borderRadius.lg;
};
