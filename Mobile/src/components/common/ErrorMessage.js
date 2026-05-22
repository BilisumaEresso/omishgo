// src/components/common/ErrorMessage.js
import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "./AppText";
import AppButton from "./AppButton";
import { useTheme } from "../../hooks/useTheme";

const ErrorMessage = ({ message, onRetry, inline = false, style }) => {
  const { theme } = useTheme();

  if (!message) return null;

  // Variant A: Inline banner error (Perfect for forms, card callouts, or small headers)
  if (inline) {
    return (
      <View
        style={[
          styles.inlineContainer,
          {
            backgroundColor: `${theme.colors.error || "#FF3B30"}15`, // Alpha tint color injection
            borderColor: theme.colors.error || "#FF3B30",
          },
          style,
        ]}
      >
        <Ionicons
          name="alert-circle-outline"
          size={20}
          color={theme.colors.error || "#FF3B30"}
          style={styles.inlineIcon}
        />
        <AppText
          variant="bodySm"
          style={{ color: theme.colors.text || "#333333", flex: 1 }}
        >
          {message}
        </AppText>
      </View>
    );
  }

  // Variant B: Full-screen display wrapper (Perfect for failed page fetches or network timeouts)
  return (
    <View style={[styles.fullscreenContainer, style]}>
      <View
        style={[
          styles.iconWrapper,
          { backgroundColor: `${theme.colors.error || "#FF3B30"}10` },
        ]}
      >
        <Ionicons
          name="alert-circle"
          size={40}
          color={theme.colors.error || "#FF3B30"}
        />
      </View>

      <AppText
        variant="headingSm"
        style={[styles.title, { color: theme.colors.text || "#333333" }]}
      >
        An Error Occurred
      </AppText>

      <AppText
        variant="bodyMd"
        align="center"
        style={[
          styles.message,
          { color: theme.colors.textSecondary || "#666666" },
        ]}
      >
        {message}
      </AppText>

      {onRetry && (
        <AppButton
          title="Try Again"
          onPress={onRetry}
          variant="outline"
          style={styles.retryButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 8,
    width: "100%",
  },
  inlineIcon: {
    marginRight: 10,
  },
  fullscreenContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    marginBottom: 24,
    maxWidth: 280,
  },
  retryButton: {
    minWidth: 140,
  },
});

export default ErrorMessage;
