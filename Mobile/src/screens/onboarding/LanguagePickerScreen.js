// Mobile/src/screens/onboarding/LanguagePickerScreen.js

import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRef, useState } from "react";

import {
  Animated,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { useTranslation } from "react-i18next";

import AppButton from "../../components/common/AppButton";
import AppText from "../../components/common/AppText";

import api from "../../config/api";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

const LANGUAGE_OPTIONS = [
  {
    code: "en",
    label: "English",
    native: "English",
    letter: "EN",
  },

  {
    code: "am",
    label: "Amharic",
    native: "አማርኛ",
    letter: "AM",
  },

  {
    code: "om",
    label: "Afan Oromo",
    native: "Afaan Oromoo",
    letter: "OM",
  },
];

export default function LanguagePickerScreen({ navigation }) {
  const { t, i18n } = useTranslation();

  const { theme } = useTheme();

  const setAppLanguage = useAuthStore((state) => state.setLanguage);

  const [selected, setSelected] = useState(i18n.language || "en");

  const primary = theme?.colors?.primary || "#2E7D32";

  const background = theme?.colors?.background || "#F8FBF8";

  const textPrimary = theme?.colors?.textPrimary || "#173017";

  const textMuted = theme?.colors?.textMuted || "#7C9678";

  const handleContinue = async (language = selected) => {
    try {
      await i18n.changeLanguage(language);

      await setAppLanguage(language);

      await AsyncStorage.setItem("@language_selected", "true");

      api
        .patch("/api/v1/auth/me/language", {
          preferredLang: language,
        })
        .catch(() => {});
    } catch (e) {}

    navigation.replace("Onboarding");
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: background,
        },
      ]}
    >
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />

        <View
          style={[
            styles.globe,
            {
              backgroundColor: "#E8F5E9",
            },
          ]}
        >
          <Ionicons name="language" size={38} color={primary} />
        </View>

        <AppText
          style={[
            styles.title,
            {
              color: textPrimary,
            },
          ]}
        >
          {t("languagePicker.title")}
        </AppText>

        <AppText
          style={[
            styles.subtitle,
            {
              color: textMuted,
            },
          ]}
        >
          {t("languagePicker.subtitle")}
        </AppText>

        <View style={styles.cards}>
          {LANGUAGE_OPTIONS.map((lang) => {
            const active = selected === lang.code;

            return (
              <LanguageCard
                key={lang.code}
                lang={lang}
                active={active}
                primary={primary}
                onPress={() => setSelected(lang.code)}
              />
            );
          })}
        </View>

        <AppButton
          title={t("common.continue")}
          onPress={() => handleContinue()}
          fullWidth
          style={styles.button}
        />

        <TouchableOpacity
          onPress={() => handleContinue("en")}
          style={styles.skip}
        >
          <AppText
            style={{
              color: primary,
              fontWeight: "700",
            }}
          >
            {t("common.skip")}
          </AppText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function LanguageCard({ lang, active, primary, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [
          {
            scale,
          },
        ],
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={[
          styles.card,

          {
            borderColor: active ? primary : "#D9E8D6",

            backgroundColor: active ? "#F1FAF1" : "#FFFFFF",
          },
        ]}
      >
        <View
          style={[
            styles.circle,
            {
              backgroundColor: active ? "#D8F1DA" : "#EEF6EE",
            },
          ]}
        >
          <AppText
            style={[
              styles.letter,
              {
                color: primary,
              },
            ]}
          >
            {lang.letter}
          </AppText>
        </View>

        <View style={{ flex: 1 }}>
          <AppText style={styles.name}>{lang.label}</AppText>

          <AppText style={styles.native}>{lang.native}</AppText>
        </View>

        {active && (
          <Ionicons name="checkmark-circle" size={25} color={primary} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: "center",
  },

  logo: {
    width: 72,
    height: 72,
    marginBottom: 18,
  },

  globe: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    marginTop: 10,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 35,
  },

  cards: {
    width: "100%",
  },

  card: {
    height: 76,
    width: "100%",
    borderRadius: 18,
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    marginBottom: 14,
  },

  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  letter: {
    fontSize: 16,
    fontWeight: "800",
  },

  name: {
    fontSize: 17,
    fontWeight: "700",
  },

  native: {
    fontSize: 13,
    color: "#8AA087",
    marginTop: 3,
  },

  button: {
    marginTop: 15,
    height: 58,
    borderRadius: 18,
  },

  skip: {
    marginTop: 16,
  },
});
