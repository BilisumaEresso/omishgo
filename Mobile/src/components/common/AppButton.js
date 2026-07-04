// src/components/common/AppButton.js
import React from "react";
import { Pressable, ActivityIndicator, StyleSheet } from "react-native";
import AppText from "./AppText";
import { useTheme } from "../../hooks/useTheme";

const AppButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  fullWidth = false,
  style,
}) => {
  const { theme } = useTheme();

  const getButtonStyles = (pressed) => {
    const isButtonDisabled = disabled || loading;
    let variantStyle = {};

    switch (variant) {
      case "secondary":
        variantStyle = {
          backgroundColor: theme?.colors?.secondary || "#FFA500",
        };
        break;
      case "outline":
        variantStyle = {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: theme?.colors?.primary || "#6B4EFF",
        };
        break;
      case "ghost":
        variantStyle = {
          backgroundColor: "transparent",
        };
        break;
      case "danger":
        variantStyle = {
          backgroundColor: theme?.colors?.error || "#FF3B30",
        };
        break;
      default:
        variantStyle = {
          backgroundColor: theme?.colors?.primary || "#6B4EFF",
        };
    }

    return [
      styles.base,
      {
        width: fullWidth ? "100%" : "auto",
        opacity: isButtonDisabled ? 0.5 : pressed ? 0.85 : 1,
        transform: [{ scale: pressed && !isButtonDisabled ? 0.98 : 1 }],
      },
      variantStyle,
      style,
    ];
  };

  const getTextColor = () => {
    if (disabled) {
      return theme?.colors?.textSecondary || "#666666";
    }

    switch (variant) {
      case "outline":
      case "ghost":
        return theme?.colors?.primary || "#6B4EFF";
      case "secondary":
      case "danger":
      default:
        // Use inverse text (white) for solid colored backgrounds
        return theme?.colors?.textInverse || "#FFFFFF";
    }
  };

  const isInteractionDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isInteractionDisabled}
      style={({ pressed }) => getButtonStyles(pressed)}
      accessibilityRole="button"
      accessibilityState={{ disabled: isInteractionDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <AppText
          variant="button"
          style={{ color: getTextColor(), fontWeight: "600" }}
        >
          {title}
        </AppText>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});

export default AppButton;
