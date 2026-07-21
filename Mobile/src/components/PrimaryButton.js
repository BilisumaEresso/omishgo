import React from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { getRoleColors } from "../constants/colors";
import Typography from "./Typography";



const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    minHeight: 48,
  },
  buttonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 56,
  },
  buttonSmall: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    minHeight: 40,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    marginRight: 8,
  },
  text: {
    color: "#FFFFFF",
  },
});

const PrimaryButton = React.forwardRef(
  (
    {
      onPress,
      label,
      loading = false,
      disabled = false,
      size = "medium", // 'small' | 'medium' | 'large'
      role = "farmer", // farmer | buyer | supplier | driver
      style,
      textStyle,
      testID,
      ...props
    },
    ref,
  ) => {
    const roleColor = getRoleColors(role);
    const isDisabled = disabled || loading;

    const sizeStyle = {
      small: styles.buttonSmall,
      medium: styles.button,
      large: styles.buttonLarge,
    }[size];

    const buttonStyle = [
      styles.button,
      sizeStyle,
      {
        backgroundColor: roleColor.primary,
      },
      isDisabled && styles.disabled,
      style,
    ];

    return (
      <TouchableOpacity
        ref={ref}
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={buttonStyle}
        testID={testID}
        {...props}
      >
        <View style={styles.content}>
          {loading && (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
              style={styles.loader}
              testID={`${testID}-loader`}
            />
          )}
          <Typography
            variant={size === "small" ? "buttonSmall" : "button"}
            style={[styles.text, textStyle]}
          >
            {label}
          </Typography>
        </View>
      </TouchableOpacity>
    );
  },
);

PrimaryButton.displayName = "PrimaryButton";

export default PrimaryButton;

// Fix: Import View for component
import { View } from "react-native";
