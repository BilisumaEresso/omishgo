import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";

import en from "./en.json";
import am from "./am.json";
import om from "./om.json";

const resources = {
  en: { translation: en },
  am: { translation: am },
  om: { translation: om },
};

const LANGUAGE_KEY = "@app_language";

const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: async (callback) => {
    try {
      const storedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (storedLang) {
        return callback(storedLang);
      }
      
      const deviceLang = Localization.getLocales()[0].languageCode;
      const supportedLangs = ["en", "am", "om"];
      const defaultLang = supportedLangs.includes(deviceLang) ? deviceLang : "am"; // Default to Amharic if not supported
      
      return callback(defaultLang);
    } catch (error) {
      console.log("Error reading language from async storage", error);
      callback("am");
    }
  },
  init: () => {},
  cacheUserLanguage: async (language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
    } catch (error) {
      console.log("Error saving language to async storage", error);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "am",
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    react: {
      useSuspense: false, // Required for React Native
    },
  });

export default i18n;
