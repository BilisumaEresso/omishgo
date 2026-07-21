import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { getRoleColors, neutralColors } from "../constants/colors";
import Typography from "./Typography";



const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    minHeight: 48,
    borderWidth: 1.5,
  },
  buttonLarge: {
    paddingVertical: 15,
    paddingHorizontal: 24,
    minHeight: 56,
  },
  buttonSmall: {
    paddingVertical: 9,
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
});

const SecondaryButton = React.forwardRef(
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
        borderColor: roleColor.primary,
      },
      isDisabled && styles.disabled,
      style,
    ];

    const textColor = isDisabled ? neutralColors.textLight : roleColor.primary;

    return (
      <TouchableOpacity
        ref={ref}
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.7}
        style={buttonStyle}
        testID={testID}
        {...props}
      >
        <View style={styles.content}>
          {loading && (
            <ActivityIndicator
              size="small"
              color={textColor}
              style={styles.loader}
              testID={`${testID}-loader`}
            />
          )}
          <Typography
            variant={size === "small" ? "buttonSmall" : "button"}
            color={textColor}
            style={textStyle}
          >
            {label}
          </Typography>
        </View>
      </TouchableOpacity>
    );
  },
);

SecondaryButton.displayName = "SecondaryButton";

export default SecondaryButton;
