// src/components/layout/AuthLayout.js
import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "../common/AppText";
import { useTheme } from "../../hooks/useTheme";

const AuthLayout = ({ title, subtitle, children }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const primaryColor = theme.colors.primary || "#4CAF50";
  const textPrimary = theme.colors.textPrimary || "#212121";
  const textSecondary = theme.colors.textSecondary || "#757575";
  const backgroundColor = theme.colors.background || "#F8F9FA";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor }]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          // compensate for safe areas so content is centered in the safe portion
          {
            paddingTop: insets.top + 32,
            paddingBottom: insets.bottom + 32,
            paddingHorizontal: 24,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand logo */}
        <View style={styles.logoWrapper}>
          <View style={[styles.brandEmblem, { borderColor: primaryColor }]}>
            <Ionicons name="leaf" size={36} color={primaryColor} />
          </View>
          <AppText
            variant="headingMd"
            style={[styles.brandText, { color: textPrimary }]}
          >
            Omish
            <AppText style={{ color: primaryColor, fontWeight: "800" }}>
              Go
            </AppText>
          </AppText>
        </View>

        {title && (
          <AppText
            variant="headingLg"
            style={[styles.title, { color: textPrimary }]}
          >
            {title}
          </AppText>
        )}

        {subtitle && (
          <AppText
            variant="bodyMd"
            style={[styles.subtitle, { color: textSecondary }]}
          >
            {subtitle}
          </AppText>
        )}

        <View style={styles.formContainer}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: 24,
  },
  brandEmblem: {
    width: 80,
    height: 80,
    borderRadius: 20,
    borderWidth: 2.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  brandText: {
    marginTop: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    fontSize: 26,
  },
  title: {
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 22,
  },
  formContainer: {
    width: "100%",
  },
});

export default AuthLayout;
