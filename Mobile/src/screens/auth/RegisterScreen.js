// src/screens/auth/RegisterScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import AppText from "../../components/common/AppText";
import {
  REGIONS,
  getWeredaByZone,
  getZonesByRegion,
} from "../../constants/locations.js";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

const LANGUAGE_OPTIONS = [
  { code: "en", label: "English" },
  { code: "am", label: "አማርኛ" },
  { code: "om", label: "Afaan Oromoo" },
];

export default function RegisterScreen({ navigation }) {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const register = useAuthStore((state) => state.register);
  const setAppLanguage = useAuthStore((state) => state.setLanguage);
  const currentLanguage = useAuthStore((state) => state.language);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [role, setRole] = useState("farmer");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [zone, setZone] = useState("");
  const [wereda, setWereda] = useState("");
  const [preferredLang, setPreferredLang] = useState(
    currentLanguage || i18n.language || "en",
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [registerError, setRegisterError] = useState("");
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [showZonePicker, setShowZonePicker] = useState(false);
  const [showWeredaPicker, setShowWeredaPicker] = useState(false);

  const availableZones = region ? getZonesByRegion(region) : [];
  const availableWereda = zone ? getWeredaByZone(region, zone) : [];

  const primary = theme?.colors?.primary || "#2E7D32";
  const textPrimary = theme?.colors?.textPrimary || "#212121";
  const textSecondary = theme?.colors?.textSecondary || "#757575";
  const backgroundColor = theme?.colors?.background || "#FFFFFF";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#E0E0E0";
  const errorColor = theme?.colors?.error || "#C62828";

  const scrollY = useRef(new Animated.Value(0)).current;
  const logoScale = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0.6],
    extrapolate: "clamp",
  });

  const clearFieldError = (field) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (registerError) setRegisterError("");
  };

  useEffect(() => {
    if (currentLanguage) {
      setPreferredLang(currentLanguage);
    }
  }, [currentLanguage]);

  const handleLanguageSelect = async (code) => {
    setPreferredLang(code);
    await setAppLanguage(code);
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Full name is required.";
    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    if (!pin.trim() || pin.trim().length < 4)
      newErrors.pin = "Create a PIN with at least 4 digits.";
    if (!region.trim()) newErrors.region = "Region is required.";
    if (!zone.trim()) newErrors.zone = "Zone is required.";
    if (!wereda.trim()) newErrors.wereda = "Wereda is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    setRegisterError("");
    try {
      const result = await register({
        name: name.trim(),
        phone: phone.trim(),
        pin: pin.trim(),
        role,
        email: email.trim() || undefined,
        location: {
          region: region.trim(),
          zone: zone.trim(),
          wereda: wereda.trim(),
        },
        preferredLang,
      });
      if (!result.success) {
        setRegisterError(
          result.message ||
            t("auth.registerError") ||
            "Registration failed. Try again.",
        );
        return;
      }
      await setAppLanguage(preferredLang);
      if (result.autoLoginFailed) {
        navigation.replace("Login");
      }
    } catch (error) {
      setRegisterError(
        error.message ||
          t("auth.registrationFailed") ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header with back arrow */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: surface,
            borderBottomColor: border,
            paddingTop:
              Platform.OS === "android"
                ? (StatusBar.currentHeight || 24) + 12
                : 54,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={primary} />
        </TouchableOpacity>
        <AppText variant="headingMd" style={{ color: textPrimary }}>
          Create Account
        </AppText>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onScroll={(e) => scrollY.setValue(e.nativeEvent.contentOffset.y)}
          scrollEventThrottle={16}
        >
          {/* Logo */}
          <View style={styles.logoWrapper}>
            <Animated.View style={{ transform: [{ scale: logoScale }] }}>
              <Image
                source={require("../../../assets/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>
          </View>

          <AppText
            variant="headingLg"
            style={[styles.title, { color: textPrimary }]}
          >
            {t("auth.registerTitle")}
          </AppText>
          <AppText
            variant="bodyMd"
            style={[styles.subtitle, { color: textSecondary }]}
          >
            {t("auth.registerSubtitle")}
          </AppText>

          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <AppText style={[styles.label, { color: textSecondary }]}>
                {t("auth.nameLabel")}
              </AppText>
              <AppInput
                placeholder={t("auth.namePlaceholder")}
                value={name}
                onChangeText={(txt) => {
                  setName(txt);
                  clearFieldError("name");
                }}
                leftIcon="person-outline"
                style={errors.name ? { borderColor: errorColor } : {}}
              />
              {errors.name && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle" size={14} color={errorColor} />
                  <AppText style={[styles.errorText, { color: errorColor }]}>
                    {errors.name}
                  </AppText>
                </View>
              )}
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
              <AppText style={[styles.label, { color: textSecondary }]}>
                {t("auth.phoneLabel")}
              </AppText>
              <AppInput
                placeholder={t("auth.phonePlaceholder")}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={(txt) => {
                  setPhone(txt);
                  clearFieldError("phone");
                }}
                leftIcon="call-outline"
                style={errors.phone ? { borderColor: errorColor } : {}}
              />
              {errors.phone && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle" size={14} color={errorColor} />
                  <AppText style={[styles.errorText, { color: errorColor }]}>
                    {errors.phone}
                  </AppText>
                </View>
              )}
            </View>

            {/* PIN */}
            <View style={styles.inputGroup}>
              <AppText style={[styles.label, { color: textSecondary }]}>
                {t("auth.pinLabel")}
              </AppText>
              <AppInput
                placeholder={t("auth.pinPlaceholder")}
                keyboardType="numeric"
                secureTextEntry
                maxLength={6}
                value={pin}
                onChangeText={(txt) => {
                  setPin(txt);
                  clearFieldError("pin");
                }}
                leftIcon="lock-closed-outline"
                style={errors.pin ? { borderColor: errorColor } : {}}
              />
              {errors.pin && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle" size={14} color={errorColor} />
                  <AppText style={[styles.errorText, { color: errorColor }]}>
                    {errors.pin}
                  </AppText>
                </View>
              )}
            </View>

            {/* Role */}
            <View style={styles.inputGroup}>
              <AppText style={[styles.label, { color: textSecondary }]}>
                {t("auth.roleLabel")}
              </AppText>
              <View style={styles.roleContainer}>
                <TouchableOpacity
                  style={[
                    styles.roleBtn,
                    {
                      borderColor: role === "farmer" ? primary : border,
                      backgroundColor:
                        role === "farmer" ? primary + "15" : "transparent",
                    },
                  ]}
                  onPress={() => setRole("farmer")}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="leaf"
                    size={18}
                    color={role === "farmer" ? primary : textSecondary}
                  />
                  <AppText
                    style={[
                      styles.roleText,
                      { color: role === "farmer" ? primary : textSecondary },
                    ]}
                  >
                    {t("auth.roleFarmer")}
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.roleBtn,
                    {
                      borderColor: role === "buyer" ? primary : border,
                      backgroundColor:
                        role === "buyer" ? primary + "15" : "transparent",
                    },
                  ]}
                  onPress={() => setRole("buyer")}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="cart"
                    size={18}
                    color={role === "buyer" ? primary : textSecondary}
                  />
                  <AppText
                    style={[
                      styles.roleText,
                      { color: role === "buyer" ? primary : textSecondary },
                    ]}
                  >
                    {t("auth.roleBuyer")}
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Language Picker */}
            <View style={styles.inputGroup}>
              <AppText style={[styles.label, { color: textSecondary }]}>
                {t("auth.langLabel")}
              </AppText>
              <View style={styles.languageContainer}>
                {LANGUAGE_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.code}
                    style={[
                      styles.languageBtn,
                      {
                        borderColor:
                          preferredLang === option.code ? primary : border,
                        backgroundColor:
                          preferredLang === option.code
                            ? primary + "15"
                            : "transparent",
                      },
                    ]}
                    onPress={() => handleLanguageSelect(option.code)}
                    activeOpacity={0.8}
                  >
                    <AppText
                      style={[
                        styles.languageText,
                        {
                          color:
                            preferredLang === option.code
                              ? primary
                              : textSecondary,
                        },
                      ]}
                    >
                      {option.label}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Location Section */}
            <AppText
              variant="headingSm"
              style={[styles.sectionTitle, { color: textPrimary }]}
            >
              Location
            </AppText>

            {/* Region Picker */}
            <View style={styles.inputGroup}>
              <AppText style={[styles.label, { color: textSecondary }]}>
                {t("auth.regionLabel")}
              </AppText>
              <TouchableOpacity
                onPress={() => setShowRegionPicker(!showRegionPicker)}
                style={[
                  styles.pickerButton,
                  { borderColor: errors.region ? errorColor : border },
                ]}
              >
                <AppText
                  style={{
                    color: region ? textPrimary : textSecondary,
                    flex: 1,
                  }}
                >
                  {region || t("auth.regionLabel")}
                </AppText>
                <Ionicons
                  name={showRegionPicker ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={primary}
                />
              </TouchableOpacity>
              {showRegionPicker && (
                <View
                  style={[
                    styles.dropdownContainer,
                    { backgroundColor: surface, borderColor: border },
                  ]}
                >
                  {REGIONS.map((r) => (
                    <TouchableOpacity
                      key={r}
                      onPress={() => {
                        setRegion(r);
                        setZone("");
                        setWereda("");
                        setShowRegionPicker(false);
                        clearFieldError("region");
                      }}
                      style={[
                        styles.dropdownItem,
                        { borderBottomColor: border },
                      ]}
                    >
                      <AppText style={{ color: textPrimary }}>{r}</AppText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {errors.region && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle" size={14} color={errorColor} />
                  <AppText style={[styles.errorText, { color: errorColor }]}>
                    {errors.region}
                  </AppText>
                </View>
              )}
            </View>

            {/* Zone Picker */}
            <View style={styles.inputGroup}>
              <AppText style={[styles.label, { color: textSecondary }]}>
                {t("auth.zoneLabel")}
              </AppText>
              <TouchableOpacity
                onPress={() => setShowZonePicker(!showZonePicker)}
                disabled={!region}
                style={[
                  styles.pickerButton,
                  {
                    borderColor: errors.zone ? errorColor : border,
                    opacity: region ? 1 : 0.5,
                  },
                ]}
              >
                <AppText
                  style={{
                    color: zone ? textPrimary : textSecondary,
                    flex: 1,
                  }}
                >
                  {zone || t("auth.zoneLabel")}
                </AppText>
                <Ionicons
                  name={showZonePicker ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={primary}
                />
              </TouchableOpacity>
              {showZonePicker && availableZones.length > 0 && (
                <View
                  style={[
                    styles.dropdownContainer,
                    { backgroundColor: surface, borderColor: border },
                  ]}
                >
                  {availableZones.map((z) => (
                    <TouchableOpacity
                      key={z}
                      onPress={() => {
                        setZone(z);
                        setWereda("");
                        setShowZonePicker(false);
                        clearFieldError("zone");
                      }}
                      style={[
                        styles.dropdownItem,
                        { borderBottomColor: border },
                      ]}
                    >
                      <AppText style={{ color: textPrimary }}>{z}</AppText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {errors.zone && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle" size={14} color={errorColor} />
                  <AppText style={[styles.errorText, { color: errorColor }]}>
                    {errors.zone}
                  </AppText>
                </View>
              )}
            </View>

            {/* Wereda Picker */}
            <View style={styles.inputGroup}>
              <AppText style={[styles.label, { color: textSecondary }]}>
                Wereda
              </AppText>
              <TouchableOpacity
                onPress={() => setShowWeredaPicker(!showWeredaPicker)}
                disabled={!zone}
                style={[
                  styles.pickerButton,
                  {
                    borderColor: errors.wereda ? errorColor : border,
                    opacity: zone ? 1 : 0.5,
                  },
                ]}
              >
                <AppText
                  style={{
                    color: wereda ? textPrimary : textSecondary,
                    flex: 1,
                  }}
                >
                  {wereda || "Select Wereda"}
                </AppText>
                <Ionicons
                  name={showWeredaPicker ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={primary}
                />
              </TouchableOpacity>
              {showWeredaPicker && availableWereda.length > 0 && (
                <View
                  style={[
                    styles.dropdownContainer,
                    { backgroundColor: surface, borderColor: border },
                  ]}
                >
                  {availableWereda.map((w) => (
                    <TouchableOpacity
                      key={w}
                      onPress={() => {
                        setWereda(w);
                        setShowWeredaPicker(false);
                        clearFieldError("wereda");
                      }}
                      style={[
                        styles.dropdownItem,
                        { borderBottomColor: border },
                      ]}
                    >
                      <AppText style={{ color: textPrimary }}>{w}</AppText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {errors.wereda && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle" size={14} color={errorColor} />
                  <AppText style={[styles.errorText, { color: errorColor }]}>
                    {errors.wereda}
                  </AppText>
                </View>
              )}
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <AppText style={[styles.label, { color: textSecondary }]}>
                {t("auth.emailLabel")}
              </AppText>
              <AppInput
                placeholder={t("auth.emailPlaceholder")}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                leftIcon="mail-outline"
              />
            </View>

            {registerError ? (
              <View
                style={[
                  styles.errorBanner,
                  { backgroundColor: errorColor + "15" },
                ]}
              >
                <Ionicons name="alert-circle" size={16} color={errorColor} />
                <AppText
                  style={[styles.errorBannerText, { color: errorColor }]}
                >
                  {registerError}
                </AppText>
              </View>
            ) : null}

            <AppButton
              title={loading ? t("common.loading") : t("auth.registerBtn")}
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              fullWidth
              style={styles.loginButton}
            />

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <AppText style={[styles.linkText, { color: primary }]}>
                {t("auth.hasAccount")} {t("auth.loginBtn")}
              </AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoWrapper: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 20,
  },
  logo: {
    width: 180,
    height: 180,
  },
  title: {
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24,
  },
  form: { gap: 4 },
  inputGroup: { marginBottom: 12 },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  errorText: { fontSize: 12, flex: 1 },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    gap: 6,
    marginTop: 8,
    marginBottom: 8,
  },
  errorBannerText: { fontSize: 13, flex: 1 },
  roleContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  roleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 8,
  },
  roleText: { fontWeight: "600", fontSize: 15 },
  languageContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  languageBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  languageText: {
    fontWeight: "600",
    fontSize: 13,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  dropdownContainer: {
    borderRadius: 8,
    borderWidth: 1,
    maxHeight: 200,
    marginTop: 4,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  loginButton: { marginTop: 24 },
  linkButton: {
    alignItems: "center",
    marginTop: 20,
  },
  linkText: { fontWeight: "600", fontSize: 14 },
});
