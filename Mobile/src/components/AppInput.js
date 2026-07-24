import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getRoleColors, neutralColors } from "../constants/colors";
import Typography from "./Typography";



const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: neutralColors.cardBg,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  inputWrapperFocused: {
    borderWidth: 2,
  },
  inputWrapperError: {
    backgroundColor: neutralColors.errorLight,
    borderColor: neutralColors.error,
  },
  iconPrefix: {
    marginRight: 10,
    marginLeft: 0,
  },
  iconSuffix: {
    marginRight: 0,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: neutralColors.textDark,
    paddingVertical: 12,
    ...Platform.select({
      ios: {
        paddingHorizontal: 4,
      },
      android: {
        paddingHorizontal: 0,
      },
    }),
  },
  inputPlaceholder: {
    color: neutralColors.textPlaceholder,
  },
  errorText: {
    marginTop: 6,
  },
  helperText: {
    marginTop: 6,
  },
  icon: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  pinInput: {
    letterSpacing: 8,
    fontSize: 24,
    fontWeight: "600",
  },
});

const AppInput = React.forwardRef(
  (
    {
      label,
      placeholder,
      value,
      onChangeText,
      error,
      helperText,
      icon,
      iconColor,
      onIconPress,
      password = false,
      pin = false,
      role = "farmer",
      editable = true,
      style,
      containerStyle,
      testID,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const roleColor = getRoleColors(role);

    const borderColor = error
      ? neutralColors.error
      : isFocused
        ? roleColor.primary
        : neutralColors.borderSubtle;

    const isPasswordType = password || pin;
    const secureTextEntry = isPasswordType && !showPassword;

    const inputWrapperStyle = [
      styles.inputWrapper,
      {
        borderColor,
        backgroundColor: error
          ? neutralColors.errorLight
          : neutralColors.cardBg,
      },
      isFocused && styles.inputWrapperFocused,
      error && styles.inputWrapperError,
    ];

    const inputStyle = [
      styles.input,
      pin && styles.pinInput,
      !editable && { color: neutralColors.textPlaceholder },
      style,
    ];

    return (
      <View style={[styles.container, containerStyle]}>
        {/* Label */}
        {label && (
          <View style={styles.labelContainer}>
            <Typography
              variant="caption"
              bold
              color={error ? neutralColors.error : neutralColors.textDark}
              style={styles.label}
            >
              {label}
            </Typography>
          </View>
        )}

        {/* Input Wrapper */}
        <View style={inputWrapperStyle}>
          {/* Prefix Icon */}
          {icon && !isPasswordType && (
            <TouchableOpacity
              onPress={onIconPress}
              disabled={!onIconPress}
              style={styles.icon}
              testID={`${testID}-icon`}
            >
              <Ionicons
                name={icon}
                size={20}
                color={iconColor || neutralColors.textMedium}
              />
            </TouchableOpacity>
          )}

          {/* Text Input */}
          <TextInput
            ref={ref}
            style={inputStyle}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            editable={editable}
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            placeholderTextColor={neutralColors.textPlaceholder}
            testID={testID}
            {...props}
          />

          {/* Password Toggle / Suffix Icon */}
          {isPasswordType ? (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.icon}
              testID={`${testID}-toggle`}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={neutralColors.textMedium}
              />
            </TouchableOpacity>
          ) : (
            icon && (
              <TouchableOpacity
                onPress={onIconPress}
                disabled={!onIconPress}
                style={styles.icon}
                testID={`${testID}-suffix-icon`}
              >
                {/* Suffix icon can be rendered here if needed */}
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Error Text */}
        {error && (
          <Typography
            variant="caption"
            style={styles.errorText}
            color={neutralColors.error}
            testID={`${testID}-error`}
          >
            {error}
          </Typography>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <Typography
            variant="caption"
            style={styles.helperText}
            color={neutralColors.textLight}
            testID={`${testID}-helper`}
          >
            {helperText}
          </Typography>
        )}
      </View>
    );
  },
);

AppInput.displayName = "AppInput";

export default AppInput;
