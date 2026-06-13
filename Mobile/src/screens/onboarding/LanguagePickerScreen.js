import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LanguagePickerScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();

  const handleSelectLanguage = async (lang) => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem("@app_language", lang);
    await AsyncStorage.setItem("@language_selected", "true");
    // After language selection, show onboarding carousel
    navigation.replace("Onboarding");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>OmishGo</Text>
        <Text style={styles.title}>{t("languagePicker.title")}</Text>
        <Text style={styles.subtitle}>{t("languagePicker.subtitle")}</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleSelectLanguage("en")}>
          <Text style={styles.buttonFlag}>🇬🇧</Text>
          <Text style={styles.buttonText}>{t("languagePicker.english")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleSelectLanguage("am")}>
          <Text style={styles.buttonFlag}>🇪🇹</Text>
          <Text style={styles.buttonText}>{t("languagePicker.amharic")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleSelectLanguage("om")}>
          <Text style={styles.buttonFlag}>🇪🇹</Text>
          <Text style={styles.buttonText}>{t("languagePicker.oromo")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  appName: {
    fontSize: 36,
    fontWeight: "900",
    color: "#2e7d32",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },
  optionsContainer: {
    gap: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    gap: 16,
  },
  buttonFlag: { fontSize: 28 },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
});

export default LanguagePickerScreen;
