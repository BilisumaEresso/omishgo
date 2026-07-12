// Mobile/src/screens/onboarding/LanguagePickerScreen.js
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AppButton from "../../components/common/AppButton";
import AppText from "../../components/common/AppText";
import api from "../../config/api";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

const LANGUAGE_OPTIONS = [
  { code: "en", label: "English", native: "English", letter: "EN" },
  { code: "am", label: "Amharic", native: "አማርኛ", letter: "AM" },
  { code: "om", label: "Afan Oromo", native: "Afaan Oromoo", letter: "OM" },
];

export default function LanguagePickerScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const setAppLanguage = useAuthStore((state) => state.setLanguage);

  const [selected, setSelected] = useState(i18n.language || "en");

  // ── Theme colours ──────────────────────────────────────────────────────────
  const primary = theme?.colors?.primary || "#2E7D32";
  const primaryContainer = theme?.colors?.primaryContainer || "#E8F5E9";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#1A2E1A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6741";
  const textMuted = theme?.colors?.textMuted || "#8FAF8A";
  const border = theme?.colors?.border || "#D0E8CE";
  const background = theme?.colors?.background || "#F9FBF9";

  const handleContinue = async (language = selected) => {
    try {
      await i18n.changeLanguage(language);
      await setAppLanguage(language);
      await AsyncStorage.setItem("@language_selected", "true");
      // Silently update backend if user is already signed in
      api
        .patch("/api/v1/auth/me/language", { preferredLang: language })
        .catch(() => {});
    } catch (error) {
      // ignore errors – user can still proceed
    }
    navigation.replace("Onboarding");
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Centered content */}
      <View style={styles.centered}>
        {/* Logo */}
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Globe icon */}
        <Ionicons
          name="globe-outline"
          size={56}
          color={primary}
          style={{ marginTop: 16 }}
        />

        {/* Title & subtitle */}
        <AppText style={[styles.title, { color: textPrimary }]}>
          {t("languagePicker.title")}
        </AppText>
        <AppText style={[styles.subtitle, { color: textMuted }]}>
          {t("languagePicker.subtitle")}
        </AppText>

        {/* Language cards */}
        <View style={styles.cardsContainer}>
          {LANGUAGE_OPTIONS.map((lang) => {
            const isSelected = selected === lang.code;
            const labelKey =
              lang.code === "en"
                ? t("languagePicker.english")
                : lang.code === "am"
                  ? t("languagePicker.amharic")
                  : t("languagePicker.oromo");
            return (
              <TouchableOpacity
                key={lang.code}
                activeOpacity={0.8}
                onPress={() => setSelected(lang.code)}
                style={[
                  styles.card,
                  {
                    backgroundColor: surface,
                    borderColor: isSelected ? primary : border,
                  },
                ]}
              >
                {/* Letter circle */}
                <View
                  style={[
                    styles.letterCircle,
                    { backgroundColor: primaryContainer },
                  ]}
                >
                  <AppText style={[styles.letter, { color: primary }]}>
                    {lang.letter}
                  </AppText>
                </View>

                {/* Language names */}
                <View style={styles.cardText}>
                  <AppText
                    style={[styles.languageName, { color: textPrimary }]}
                  >
                    {labelKey}
                  </AppText>
                  <AppText style={[styles.nativeName, { color: textMuted }]}>
                    {lang.native}
                  </AppText>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Continue button */}
        <AppButton
          title={t("common.continue")}
          onPress={handleContinue}
          fullWidth
          style={styles.continueButton}
        />
        <TouchableOpacity
          onPress={() => handleContinue("en")}
          activeOpacity={0.7}
          style={styles.skipLink}
        >
          <AppText style={{ color: primary, fontWeight: "600" }}>
            {t("common.skip")}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 64,
    height: 64,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 20,
  },
  cardsContainer: {
    width: "100%",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    borderWidth: 2,
  },
  letterCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  letter: {
    fontSize: 20,
    fontWeight: "700",
  },
  cardText: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  nativeName: {
    fontSize: 13,
  },
  continueButton: {
    marginTop: 16,
  },
  skipLink: {
    marginTop: 12,
    alignItems: "center",
  },
});
