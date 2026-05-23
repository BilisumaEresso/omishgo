// src/components/layout/AuthLayout.js
import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText";
import { useTheme } from "../../hooks/useTheme";

const AuthLayout = ({ title, subtitle, children }) => {
  const { theme } = useTheme();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.colors.background  }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* DESIGN FIX: OmishGo stylized tractor-brand vector header representation */}
        <View style={styles.logoWrapper}>
          <View style={[styles.brandEmblem, { borderColor: theme.colors.primary}]}>
            {/* Minimalist tractor vector facing left; large tire stylized structurally as letter 'O' */}
            <Ionicons
              name="logo-closed-captioning" // Using a dual-concentric curve layout to represent the stylized 'O' tire profile cleanly
              size={36}
              color={theme.colors.primary}
              style={styles.tractorTireO}
            />
            <View style={[styles.tractorBody, { backgroundColor: theme.colors.primary }]} />
          </View>
          <AppText variant="headingMd" style={[styles.brandText, { color: theme.colors.text }]}>
            Omish<AppText style={{ color: theme.colors.primary, fontWeight: "800" }}>Go</AppText>
          </AppText>
        </View>

        {title && (
          <AppText
            variant="headingLg"
            style={[styles.title, { color: theme.colors.text }]}
          >
            {title}
          </AppText>
        )}

        {subtitle && (
          <AppText
            variant="bodyMd"
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            {subtitle}
          </AppText>
        )}

        <View style={styles.formContainer}>
          {children}
        </View>
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
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: 32,
  },
  brandEmblem: {
    width: 72,
    height: 72,
    borderRadius: 16,
    borderWidth: 2.5,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: "transparent", // Clean minimalist alpha layout representation
  },
  tractorTireO: {
    position: "absolute",
    left: 8,
    bottom: 8,
  },
  tractorBody: {
    position: "absolute",
    width: 20,
    height: 14,
    top: 24,
    right: 12,
    borderRadius: 2,
  },
  brandText: {
    marginTop: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  title: {
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 28,
  },
  formContainer: {
    width: "100%",
  },
});

export default AuthLayout;