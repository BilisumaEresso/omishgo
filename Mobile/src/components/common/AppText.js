// src/components/common/AppText.js
import "react";
import { Text } from "react-native";
import { useTheme } from "../../hooks/useTheme";

// Fallback typography in case theme.typography is missing for a variant
const defaultTypography = {
  displayLg: {
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 38
  },
  headingLg: {
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 32
  },
  headingMd: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 28
  },
  headingSm: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24
  },
  bodyLg: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24
  },
  bodyMd: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20
  },
  bodySm: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18
  },
  caption: {
    fontSize: 10,
    fontWeight: "400",
    lineHeight: 14
  },
  button: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16
  }
};
const AppText = ({
  variant = "bodyMd",
  color,
  align = "left",
  style,
  children,
  ...rest
}) => {
  const {
    theme
  } = useTheme();

  // 1. Get typography from theme, fallback to default
  const themeTypography = theme.typography || {};
  const typography = themeTypography[variant] || defaultTypography[variant] || defaultTypography.bodyMd;

  // 2. Determine if header for accessibility
  const isHeader = variant.includes("heading") || variant.includes("display");

  // 3. Font family from theme (if defined)
  const fontFamily = themeTypography.fontFamily || undefined;

  // 4. Text color: use theme?.colors?.textPrimary by default (NOT undefined 'text')
  const defaultColor = theme.colors?.textPrimary || "#212121";
  return <Text accessibilityRole={isHeader ? "header" : "text"} style={[{
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight: typography.lineHeight,
    color: color || defaultColor,
    textAlign: align,
    fontFamily: fontFamily
  }, style]} {...rest}>
      {children}
    </Text>;
};
export default AppText;