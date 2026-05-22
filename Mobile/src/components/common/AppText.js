// src/components/common/AppText.js
import React from "react";
import { Text } from "react-native";
import { useTheme } from "../../hooks/useTheme";

// Enhanced typography map combining size, weight, and readable line heights
const typographyMap = {
  displayLg: { fontSize: 32, fontWeight: "800", lineHeight: 38 },
  headingLg: { fontSize: 26, fontWeight: "700", lineHeight: 32 },
  headingMd: { fontSize: 22, fontWeight: "700", lineHeight: 28 },
  headingSm: { fontSize: 18, fontWeight: "600", lineHeight: 24 },
  bodyLg: { fontSize: 16, fontWeight: "400", lineHeight: 24 },
  bodyMd: { fontSize: 14, fontWeight: "400", lineHeight: 20 },
  bodySm: { fontSize: 12, fontWeight: "400", lineHeight: 18 },
  caption: { fontSize: 10, fontWeight: "400", lineHeight: 14 },
  button: { fontSize: 14, fontWeight: "600", lineHeight: 20 },
  label: { fontSize: 12, fontWeight: "500", lineHeight: 16 },
};

const AppText = ({
  variant = "bodyMd",
  color,
  align = "left",
  style,
  children,
  ...rest // Critical for passing numberOfLines, ellipsizeMode, etc.
}) => {
  const { theme } = useTheme();

  // Fallback to bodyMd if an invalid variant is passed
  const typography = typographyMap[variant] || typographyMap.bodyMd;

  // Auto-assign header accessibility roles for system screen readers
  const isHeader = variant.includes("heading") || variant.includes("display");

  // Determine standard, simple sans-serif font family handling
  const getFontFamily = () => {
    if (!theme.fonts) return undefined;

    // Distinguish between regular and medium/bold variants if theme supports it
    if (typography.fontWeight === "400") return theme.fonts.regular;
    if (typography.fontWeight === "500") return theme.fonts.medium;
    return theme.fonts.bold || theme.fonts.medium || theme.fonts.regular;
  };

  return (
    <Text
      accessibilityRole={isHeader ? "header" : "text"}
      style={[
        {
          fontSize: typography.fontSize,
          fontWeight: typography.fontWeight,
          lineHeight: typography.lineHeight,
          color: color || theme.colors.text || "#E0E0E0",
          textAlign: align,
          fontFamily: getFontFamily(),
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

export default AppText;
