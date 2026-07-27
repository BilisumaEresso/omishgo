import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity } from "react-native";
import { getRoleColors, neutralColors } from "../constants/colors";
import { spacing } from "../constants/layout";
import Typography from "./Typography";

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    alignItems: "center",
  },
  buttonBackground: {
    backgroundColor: neutralColors.surfaceLight,
  },
  small: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  large: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
});

const SkipButton = React.forwardRef(
  (
    {
      onPress,
      label,
      variant = "text", // 'text' | 'background'
      size = "medium", // 'small' | 'medium' | 'large'
      role = "farmer",
      disabled = false,
      style,
      testID,
      ...props
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const displayLabel = label || t("common.skip", "Skip");
    const roleColors = getRoleColors(role);

    const sizeStyle = {
      small: styles.small,
      medium: styles.button,
      large: styles.large,
    }[size];

    const variantStyle =
      variant === "background" ? styles.buttonBackground : {};

    const buttonStyle = [
      styles.button,
      sizeStyle,
      variantStyle,
      disabled && { opacity: 0.5 },
      style,
    ];

    const textColor =
      variant === "background" ? neutralColors.textMedium : roleColors.primary;

    return (
      <TouchableOpacity
        ref={ref}
        style={buttonStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        testID={testID}
        {...props}
      >
        <Typography
          variant={size === "small" ? "caption" : "body"}
          bold
          color={textColor}
          style={styles.buttonText}
        >
          {displayLabel}
        </Typography>
      </TouchableOpacity>
    );
  },
);

SkipButton.displayName = "SkipButton";

export default SkipButton;
