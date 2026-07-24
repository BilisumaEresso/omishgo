// src/components/layout/AuthLayout.js
import "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image, TouchableOpacity, StatusBar } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "../common/AppText";
import { useTheme } from "../../hooks/useTheme";
const AuthLayout = ({
  title,
  subtitle,
  children,
  logoSource,
  showBack = false,
  onBackPress
}) => {
  const {
    theme
  } = useTheme();
  const insets = useSafeAreaInsets();
  const primary = theme?.colors?.primary || "#2E7D32";
  const textPrimary = theme?.colors?.textPrimary || "#212121";
  const textSecondary = theme?.colors?.textSecondary || "#757575";
  const background = theme?.colors?.background || "#F8F9FA";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#E0E0E0";
  return <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={[styles.container, {
    backgroundColor: background
  }]}>
      {/* Back header (only for Register) */}
      {showBack && <View style={[styles.header, {
      backgroundColor: surface,
      borderBottomColor: border,
      paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 24) + 12 : insets.top + 12
    }]}>
          <TouchableOpacity onPress={onBackPress} style={styles.backBtn} hitSlop={{
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }}>
            <Ionicons name="arrow-back" size={24} color={primary} />
          </TouchableOpacity>
          <AppText variant="headingMd" style={{
        color: textPrimary
      }}>
            {title || ""}
          </AppText>
          <View style={{
        width: 40
      }} />
        </View>}

      <ScrollView contentContainerStyle={[styles.scrollContent, {
      paddingTop: showBack ? 24 : insets.top + 48,
      paddingBottom: insets.bottom + 32,
      paddingHorizontal: 24
    }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Logo / Brand emblem */}
        <View style={styles.logoWrapper}>
          {logoSource ? <Image source={logoSource} style={styles.logoImage} resizeMode="contain" /> : <>
              <View style={[styles.brandEmblem, {
            borderColor: primary
          }]}>
                <Ionicons name="leaf" size={36} color={primary} />
              </View>
              <AppText variant="headingMd" style={[styles.brandText, {
            color: textPrimary
          }]}>
                Omish
                <AppText style={{
              color: primary,
              fontWeight: "800"
            }}>
                  Go
                </AppText>
              </AppText>
            </>}
        </View>

        {/* Title and subtitle – only show if header is hidden (otherwise title is in header) */}
        {!showBack && title && <AppText variant="headingLg" style={[styles.title, {
        color: textPrimary
      }]}>
            {title}
          </AppText>}

        {!showBack && subtitle && <AppText variant="bodyMd" style={[styles.subtitle, {
        color: textSecondary
      }]}>
            {subtitle}
          </AppText>}

        <View style={styles.formContainer}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>;
};
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center"
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: 24
  },
  brandEmblem: {
    width: 80,
    height: 80,
    borderRadius: 20,
    borderWidth: 2.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  brandText: {
    marginTop: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    fontSize: 26
  },
  logoImage: {
    width: 180,
    height: 180
  },
  title: {
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 8
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 22
  },
  formContainer: {
    width: "100%"
  }
});
export default AuthLayout;