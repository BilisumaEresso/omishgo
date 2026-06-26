import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../../store/auth.store";

const RegisterScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const register = useAuthStore((state) => state.register);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [role, setRole] = useState("farmer");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [zone, setZone] = useState("");
  const [kebele, setKebele] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !phone || !pin || !region || !zone || !kebele) {
      Alert.alert(
        t("common.error") || "Error",
        t("auth.fillRequired") || "Please fill all required fields",
      );
      return;
    }

    setLoading(true);
    try {
      const result = await register({
        name,
        phone,
        pin,
        role,
        email: email || undefined,
        location: { region, zone, kebele },
        preferredLang: i18n.language || "am",
      });

      if (!result.success) {
        Alert.alert(
          t("common.error") || "Error",
          result.message || "Registration failed",
        );
        return;
      }

      if (result.autoLoginFailed) {
        // Registration OK but auto-login failed — send to Login screen manually
        navigation.replace("Login");
      }
      // Otherwise isAuthenticated is now true → RootNavigator swaps to AppNavigator automatically
    } catch (error) {
      Alert.alert(
        t("common.error") || "Error",
        error.message || "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t("auth.registerTitle")}</Text>
        <Text style={styles.subtitle}>{t("auth.registerSubtitle")}</Text>

        <View style={styles.form}>
          <Text style={styles.label}>{t("auth.nameLabel")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("auth.namePlaceholder")}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>{t("auth.phoneLabel")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("auth.phonePlaceholder")}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.label}>{t("auth.pinLabel")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("auth.pinPlaceholder")}
            keyboardType="numeric"
            secureTextEntry
            maxLength={6}
            value={pin}
            onChangeText={setPin}
          />

          <Text style={styles.label}>{t("auth.roleLabel")}</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleBtn, role === "farmer" && styles.roleActive]}
              onPress={() => setRole("farmer")}
            >
              <Text
                style={[
                  styles.roleText,
                  role === "farmer" && styles.roleTextActive,
                ]}
              >
                {t("auth.roleFarmer")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleBtn, role === "buyer" && styles.roleActive]}
              onPress={() => setRole("buyer")}
            >
              <Text
                style={[
                  styles.roleText,
                  role === "buyer" && styles.roleTextActive,
                ]}
              >
                {t("auth.roleBuyer")}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>{t("auth.locationLabel")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("auth.regionLabel")}
            value={region}
            onChangeText={setRegion}
          />
          <TextInput
            style={styles.input}
            placeholder={t("auth.zoneLabel")}
            value={zone}
            onChangeText={setZone}
          />
          <TextInput
            style={styles.input}
            placeholder={t("auth.kebeleLabel")}
            value={kebele}
            onChangeText={setKebele}
          />

          <Text style={styles.label}>{t("auth.emailLabel")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("auth.emailPlaceholder")}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? t("common.loading") : t("auth.registerBtn")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.linkText}>{t("auth.hasAccount")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", color: "#333", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 24 },
  form: { gap: 12 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: -4,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
  },
  roleContainer: { flexDirection: "row", gap: 12 },
  roleBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  roleActive: { backgroundColor: "#e8f5e9", borderColor: "#2e7d32" },
  roleText: { color: "#666", fontWeight: "600" },
  roleTextActive: { color: "#2e7d32" },
  button: {
    backgroundColor: "#2e7d32",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  linkButton: { alignItems: "center", marginTop: 16, paddingBottom: 32 },
  linkText: { color: "#2e7d32", fontSize: 14, fontWeight: "600" },
});

export default RegisterScreen;
