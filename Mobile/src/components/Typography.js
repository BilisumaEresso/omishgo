import React from "react";
import { StyleSheet, Text } from "react-native";
import { neutralColors } from "../constants/colors";

/**
 * Typography System
 * Provides consistent text styling across the app
 */

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 36,
    color: neutralColors.textDark,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
    color: neutralColors.textDark,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    color: neutralColors.textMedium,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    color: neutralColors.textMedium,
  },
  caption: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: neutralColors.textLight,
  },
  captionBold: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    color: neutralColors.textLight,
  },
  button: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  error: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: neutralColors.error,
  },
});

/**
 * Typography Component
 *
 * @param {string} variant - Text style variant (title, subtitle, body, caption, etc.)
 * @param {string} color - Text color override
 * @param {object} style - Additional custom styles
 * @param {any} children - Text content
 * @param {boolean} bold - Bold variant (for body/caption)
 * @param {object} props - Other Text props
 */
export const Typography = React.forwardRef(
  (
    { variant = "body", color, style, bold = false, children, ...props },
    ref,
  ) => {
    let baseStyle = styles[variant];

    // Handle bold variants
    if (bold && (variant === "body" || variant === "caption")) {
      baseStyle = styles[`${variant}Bold`];
    }

    const computedStyle = [baseStyle, color && { color }, style];

    return (
      <Text ref={ref} style={computedStyle} {...props}>
        {children}
      </Text>
    );
  },
);

Typography.displayName = "Typography";

export default Typography;
