// src/components/layout/AuthLayout.js
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import AppText from "../common/AppText";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

const LANG_ITEMS = [
  { code: "en", label: "EN", full: "English" },
  { code: "am", label: "አማ", full: "አማርኛ" },
  { code: "om", label: "OM", full: "Oromoo" },
];

const AuthLayout = ({
  title,
  subtitle,
  children,
  logoSource,
  showBack = false,
  onBackPress,
  logoStyle,
  titleStyle,
}) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const setLanguage = useAuthStore((state) => state.setLanguage);
  const insets = useSafeAreaInsets();

  const [langOpen, setLangOpen] = useState(false);

  const primary = theme?.colors?.primary || "#15803D";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";
  const background = theme?.colors?.background || "#F8FAFC";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#E2E8F0";

  const currentLang = i18n.language || "en";

  const handleSelectLang = async (code) => {
    try {
      await setLanguage(code);
    } catch (_) {}
    setLangOpen(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: background }]}
    >
      <StatusBar barStyle="dark-content" />

      {/* Top Header Bar with Language Switcher */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop:
              Platform.OS === "android"
                ? (StatusBar.currentHeight || 24) + 8
                : insets.top + 8,
          },
        ]}
      >
        {showBack ? (
          <TouchableOpacity
            onPress={onBackPress}
            style={[styles.backBtn, { backgroundColor: surface, borderColor: border }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={20} color={primary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.brandRow}>
            <View style={[styles.brandIconBg, { backgroundColor: primary + "15" }]}>
              <Ionicons name="leaf" size={18} color={primary} />
            </View>
            <AppText style={styles.brandTitle}>
              Omish<AppText style={{ color: primary, fontWeight: "900" }}>Go</AppText>
            </AppText>
          </View>
        )}

        {/* Language Switcher Pill */}
        <View style={{ zIndex: 100 }}>
          <TouchableOpacity
            style={[styles.langPill, { backgroundColor: surface, borderColor: border }]}
            onPress={() => setLangOpen((v) => !v)}
            activeOpacity={0.8}
          >
            <Ionicons name="globe-outline" size={15} color={primary} />
            <AppText style={styles.langPillText}>
              {LANG_ITEMS.find((l) => l.code === currentLang)?.label || "EN"}
            </AppText>
            <Ionicons
              name={langOpen ? "chevron-up" : "chevron-down"}
              size={12}
              color={textSecondary}
            />
          </TouchableOpacity>

          {langOpen && (
            <View style={[styles.langDropdown, { backgroundColor: surface, borderColor: border }]}>
              {LANG_ITEMS.map((item) => (
                <TouchableOpacity
                  key={item.code}
                  style={[
                    styles.langOption,
                    item.code === currentLang && { backgroundColor: primary + "15" },
                  ]}
                  onPress={() => handleSelectLang(item.code)}
                >
                  <AppText
                    style={[
                      styles.langOptionText,
                      item.code === currentLang && { color: primary, fontWeight: "800" },
                    ]}
                  >
                    {item.full}
                  </AppText>
                  {item.code === currentLang && (
                    <Ionicons name="checkmark" size={14} color={primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: insets.bottom + 32,
            paddingHorizontal: 24,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo / Brand emblem */}
        <View style={styles.logoWrapper}>
          {logoSource ? (
            <Image source={logoSource} style={styles.logoImage} resizeMode="contain" />
          ) : (
            <View style={[styles.brandEmblem, { borderColor: primary }]}>
              <Ionicons name="leaf" size={42} color={primary} />
            </View>
          )}
        </View>

        {/* Title & Subtitle */}
        {title && (
          <AppText variant="headingLg" style={[styles.title, { color: textPrimary }]}>
            {title}
          </AppText>
        )}

        {subtitle && (
          <AppText variant="bodyMd" style={[styles.subtitle, { color: textSecondary }]}>
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
    zIndex: 50,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  langPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  langPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },
  langDropdown: {
    position: "absolute",
    top: 38,
    right: 0,
    width: 120,
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  langOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  langOptionText: {
    fontSize: 12,
    color: "#334155",
    fontWeight: "600",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingTop: 12,
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },
  brandEmblem: {
    width: 80,
    height: 80,
    borderRadius: 24,
    borderWidth: 2.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  logoImage: {
    width: 150,
    height: 150,
  },
  title: {
    textAlign: "center",
    fontWeight: "800",
    marginBottom: 6,
    fontSize: 24,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
    fontSize: 14,
  },
  formContainer: {
    width: "100%",
  },
});

export default AuthLayout;