// src/components/common/AppInput.js
import React, { useState } from "react";
import { View, TextInput, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "./AppText";
import { useTheme } from "../../hooks/useTheme";

const AppInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
  keyboardType = "default",
  leftIcon,
  rightIcon,
  style,
  inputStyle,
  ...rest // Allows passing autoCapitalize, returnKeyType, etc.
}) => {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);
  const [secure, setSecure] = useState(secureTextEntry);

  const getBorderColor = () => {
    if (error) return theme.colors.error || "#FF3B30";
    if (focused) return theme.colors.primary || "#6B4EFF";
    return theme.colors.border || "#333333";
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <AppText
          variant="label"
          style={[styles.label, { color: theme.colors.textPrimary }]}
        >
          {label}
        </AppText>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors.surface || "#1A1A1A",
            borderColor: getBorderColor(),
          },
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={
              focused
                ? theme.colors.primary || "#6B4EFF"
                : theme.colors.textSecondary || "#888888"
            }
            style={styles.leftIcon}
          />
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary || "#666666"}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            styles.input,
            { color: theme.colors.textPrimary || "#FFFFFF" },
            inputStyle,
          ]}
          {...rest}
        />

        {secureTextEntry ? (
          <Pressable
            onPress={() => setSecure(!secure)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.rightIconWrapper}
          >
            <Ionicons
              name={secure ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={theme.colors.textSecondary || "#888888"}
            />
          </Pressable>
        ) : rightIcon ? (
          <View style={styles.rightIconWrapper}>
            <Ionicons
              name={rightIcon}
              size={20}
              color={theme.colors.textSecondary || "#888888"}
            />
          </View>
        ) : null}
      </View>

      {error && (
        <AppText
          variant="caption"
          style={[styles.errorText, { color: theme.colors.error || "#FF3B30" }]}
        >
          {error}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: "500",
  },
  inputContainer: {
    borderWidth: 1.5,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    minHeight: 52, // Standard minimum touch target size
  },
  leftIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  rightIconWrapper: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    marginTop: 6,
    marginLeft: 4,
  },
});

export default AppInput;
