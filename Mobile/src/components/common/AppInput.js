// src/components/common/AppInput.js
import { useEffect, useState } from "react";
import { View, TextInput, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
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

  useEffect(() => {
    setSecure(secureTextEntry);
  }, [secureTextEntry]);

  const getBorderColor = () => {
    if (error) return theme?.colors?.error || "#EF4444";
    if (focused) return theme?.colors?.primary || "#15803D";
    return theme?.colors?.border || "#E2E8F0";
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <AppText
          variant="label"
          style={[styles.label, { color: theme?.colors?.textPrimary || "#0F172A" }]}
        >
          {label}
        </AppText>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme?.colors?.surface || "#FFFFFF",
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
                ? theme?.colors?.primary || "#15803D"
                : theme?.colors?.textSecondary || "#64748B"
            }
            style={styles.leftIcon}
          />
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={"#94A3B8"}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            styles.input,
            { color: theme?.colors?.textPrimary || "#0F172A" },
            inputStyle,
          ]}
          {...rest}
        />

        {secureTextEntry ? (
          <Pressable
            onPress={() => setSecure(!secure)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.rightIconWrapper}
          >
            <Ionicons
              name={secure ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={theme?.colors?.textSecondary || "#64748B"}
            />
          </Pressable>
        ) : rightIcon ? (
          <View style={styles.rightIconWrapper}>
            <Ionicons
              name={rightIcon}
              size={20}
              color={theme?.colors?.textSecondary || "#64748B"}
            />
          </View>
        ) : null}
      </View>

      {error && (
        <AppText
          variant="caption"
          style={[styles.errorText, { color: theme?.colors?.error || "#EF4444" }]}
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
    marginBottom: 6,
    fontWeight: "600",
    fontSize: 13,
  },
  inputContainer: {
    borderWidth: 1.5,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    minHeight: 50,
  },
  leftIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
  },
  rightIconWrapper: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    marginTop: 5,
    marginLeft: 4,
    fontSize: 12,
  },
});

export default AppInput;