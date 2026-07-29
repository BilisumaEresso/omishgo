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

  const currentLang = (i18n.language || "en").split("-")[0].split("_")[0];

  const handleSelectLang = async (code) => {
    try {
      await setLanguage(code);
      await i18n.changeLanguage(code);
    } catch (_) {}
    setLangOpen(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: background }]}
    >
      <StatusBar barStyle="dark-content" />

      {/* Top Header Bar */}
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
            <AppText style={[styles.brandTitle, { color: textPrimary }]}>
              Omish<AppText style={{ color: primary, fontWeight: "900" }}>Go</AppText>
              <AppText style={{ color: primary, fontWeight: "900" }}>.</AppText>
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
            <AppText style={[styles.langPillText, { color: textPrimary }]}>
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
                      { color: item.code === currentLang ? primary : textPrimary },
                      item.code === currentLang && { fontWeight: "800" },
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
            paddingHorizontal: 20,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo / Brand emblem */}
        <View style={styles.logoWrapper}>
          {logoSource ? (
            <View style={[styles.logoCard, { backgroundColor: surface, borderColor: border }]}>
              <Image source={logoSource} style={[styles.logoImage, logoStyle]} resizeMode="contain" />
            </View>
          ) : (
            <View style={[styles.brandEmblem, { backgroundColor: primary + "12", borderColor: primary + "30" }]}>
              <Ionicons name="leaf" size={38} color={primary} />
            </View>
          )}
        </View>

        {/* Title & Subtitle */}
        {title && (
          <AppText style={[styles.title, { color: textPrimary }, titleStyle]}>
            {title}
          </AppText>
        )}

        {subtitle && (
          <AppText style={[styles.subtitle, { color: textSecondary }]}>
            {subtitle}
          </AppText>
        )}

        {/* Card Container for Form Content */}
        <View style={[styles.formCard, { backgroundColor: surface, borderColor: border }]}>
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    zIndex: 50,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  langPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  langPillText: {
    fontSize: 12.5,
    fontWeight: "700",
  },
  langDropdown: {
    position: "absolute",
    top: 42,
    right: 0,
    width: 130,
    borderRadius: 16,
    borderWidth: 1,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 10,
  },
  langOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
  },
  langOptionText: {
    fontSize: 13,
    fontWeight: "600",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingTop: 8,
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: 18,
  },
  logoCard: {
    padding: 12,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  brandEmblem: {
    width: 76,
    height: 76,
    borderRadius: 24,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  title: {
    textAlign: "center",
    fontWeight: "800",
    marginBottom: 6,
    fontSize: 24,
    letterSpacing: -0.4,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
    fontSize: 13.5,
    alignSelf: "center",
  },
  formCard: {
    width: "100%",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
});

export default AuthLayout;