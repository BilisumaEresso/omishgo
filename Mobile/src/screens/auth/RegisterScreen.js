// Mobile/src/screens/auth/RegisterScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Easing,
  Image,
  KeyboardAvoidingView,
  LayoutAnimation,
  Linking,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import AppText from "../../components/common/AppText";
import ErrorBanner from "../../components/common/ErrorBanner";
import LocationPicker from "../../components/common/LocationPicker";
import SelectableChip from "../../components/common/SelectableChip";
import {
  getLocalizedRegions,
  getLocalizedWereda,
  getLocalizedZones,
} from "../../constants/locations.js";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LANGUAGE_OPTIONS = [
  { code: "en", label: "English" },
  { code: "am", label: "አማርኛ" },
  { code: "om", label: "Afaan Oromoo" },
];

const ROW_COUNT = 10;
const FOOTER_ROW_INDEX = ROW_COUNT;

export default function RegisterScreen({ navigation }) {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const register = useAuthStore((state) => state.register);
  const setAppLanguage = useAuthStore((state) => state.setLanguage);
  const currentLanguage = useAuthStore((state) => state.language);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [role, setRole] = useState("farmer");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [zone, setZone] = useState("");
  const [wereda, setWereda] = useState("");
  const [preferredLang, setPreferredLang] = useState(currentLanguage || "en");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [registerError, setRegisterError] = useState("");
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [showZonePicker, setShowZonePicker] = useState(false);
  const [showWeredaPicker, setShowWeredaPicker] = useState(false);

  const lang = i18n.language || "en";
  const regionOptions = getLocalizedRegions(lang);
  const availableZones = region ? getLocalizedZones(region, lang) : [];
  const availableWereda = zone ? getLocalizedWereda(region, zone, lang) : [];

  const regionLabel =
    regionOptions.find((r) => r.value === region)?.label || region;
  const zoneLabel = availableZones.find((z) => z.value === zone)?.label || zone;
  const weredaLabel =
    availableWereda.find((w) => w.value === wereda)?.label || wereda;

  const primary = theme?.colors?.primary || "#15803D";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";
  const backgroundColor = theme?.colors?.background || "#F8FAFC";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#E2E8F0";
  const errorColor = theme?.colors?.error || "#EF4444";

  // Scroll animations
  const scrollY = useRef(new Animated.Value(0)).current;

  const logoScale = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0.6],
    extrapolate: "clamp",
  });

  const logoOpacity = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [1, 0.85],
    extrapolate: "clamp",
  });

  // Entrance animations
  const heroAnim = useRef(new Animated.Value(0)).current;
  const rows = useRef(
    [...Array(ROW_COUNT + 1)].map(() => new Animated.Value(0)),
  ).current;
  const shakeX = useRef(new Animated.Value(0)).current;
  const ctaScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(heroAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 12,
        bounciness: 8,
      }),
      Animated.stagger(
        60,
        rows.map((v) =>
          Animated.timing(v, {
            toValue: 1,
            duration: 380,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ),
      ),
    ]).start();
  }, []);

  useEffect(() => {
    if (currentLanguage) setPreferredLang(currentLanguage);
  }, [currentLanguage]);

  const clearFieldError = (field) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (registerError) setRegisterError("");
  };

  const shake = () => {
    shakeX.setValue(0);
    Animated.sequence([
      Animated.timing(shakeX, { toValue: 8, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -8, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -4, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 0, duration: 45, useNativeDriver: true }),
    ]).start();
  };

  const pressIn = () =>
    Animated.spring(ctaScale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();

  const pressOut = () =>
    Animated.spring(ctaScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();

  const smoothLayout = () =>
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

  const togglePicker = (which) => {
    smoothLayout();
    if (which === "region") {
      setShowRegionPicker((v) => !v);
      setShowZonePicker(false);
      setShowWeredaPicker(false);
    } else if (which === "zone") {
      setShowZonePicker((v) => !v);
      setShowRegionPicker(false);
      setShowWeredaPicker(false);
    } else {
      setShowWeredaPicker((v) => !v);
      setShowRegionPicker(false);
      setShowZonePicker(false);
    }
  };

  const handleLanguageSelect = async (code) => {
    setPreferredLang(code);
    await setAppLanguage(code);
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = t("auth.nameRequired", { defaultValue: "Full name is required." });
    if (!phone.trim()) newErrors.phone = t("auth.phoneRequired", { defaultValue: "Phone number is required." });
    if (!pin.trim() || pin.trim().length < 4)
      newErrors.pin = t("auth.pinLengthError", { defaultValue: "Create a PIN with at least 4 digits." });
    if (!region.trim()) newErrors.region = t("auth.regionRequired", { defaultValue: "Region is required." });
    if (!zone.trim()) newErrors.zone = t("auth.zoneRequired", { defaultValue: "Zone is required." });
    if (!wereda.trim()) newErrors.wereda = t("auth.weredaRequired", { defaultValue: "Wereda is required." });
    smoothLayout();
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) {
      shake();
      return;
    }
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
        shake();
        setRegisterError(
          result.message || t("auth.registerError", { defaultValue: "Registration failed. Try again." }),
        );
        return;
      }
      await setAppLanguage(preferredLang);
      if (result.autoLoginFailed) navigation.replace("Login");
    } catch (error) {
      shake();
      setRegisterError(
        error.message ||
          t("auth.registrationFailed", { defaultValue: "Something went wrong. Please try again." }),
      );
    } finally {
      setLoading(false);
    }
  };

  const rowStyle = (i) => ({
    opacity: rows[i],
    transform: [
      {
        translateY: rows[i].interpolate({
          inputRange: [0, 1],
          outputRange: [14, 0],
        }),
      },
    ],
  });

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header Bar */}
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
          style={[styles.backBtn, { borderColor: border }]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={20} color={primary} />
        </TouchableOpacity>
        <AppText style={[styles.headerTitle, { color: textPrimary }]}>
          {t("auth.createAccountTitle", { defaultValue: "Create Account" })}
        </AppText>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <Animated.ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true },
          )}
          scrollEventThrottle={16}
        >
          {/* Logo emblem */}
          <Animated.View
            style={[
              styles.logoWrapper,
              {
                opacity: Animated.multiply(logoOpacity, heroAnim),
                transform: [
                  { scale: Animated.multiply(logoScale, heroAnim) },
                ],
              },
            ]}
          >
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.View style={{ opacity: heroAnim }}>
            <AppText style={[styles.title, { color: textPrimary }]}>
              {t("auth.registerTitle", { defaultValue: "Join OmishGo Marketplace" })}
            </AppText>
            <AppText style={[styles.subtitle, { color: textSecondary }]}>
              {t("auth.registerSubtitle", { defaultValue: "Direct trade platform connecting Ethiopian producers & wholesale buyers" })}
            </AppText>
          </Animated.View>

          <Animated.View
            style={[styles.form, { transform: [{ translateX: shakeX }] }]}
          >
            {/* Section 1: Account Credentials */}
            <Animated.View style={rowStyle(0)}>
              <AppText style={styles.sectionHeader}>
                1. {t("auth.credentialsSection", { defaultValue: "Account Credentials" })}
              </AppText>
            </Animated.View>

            {/* Name */}
            <Animated.View style={[styles.inputGroup, rowStyle(0)]}>
              <AppInput
                label={t("auth.nameLabel", { defaultValue: "Full Name" })}
                placeholder={t("auth.namePlaceholder", { defaultValue: "Enter your full name" })}
                value={name}
                onChangeText={(txt) => {
                  setName(txt);
                  clearFieldError("name");
                }}
                leftIcon="person-outline"
                error={errors.name}
              />
            </Animated.View>

            {/* Phone */}
            <Animated.View style={[styles.inputGroup, rowStyle(1)]}>
              <AppInput
                label={t("auth.phoneLabel", { defaultValue: "Phone Number" })}
                placeholder={t("auth.phonePlaceholder", { defaultValue: "e.g. 0911234567" })}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={(txt) => {
                  setPhone(txt);
                  clearFieldError("phone");
                }}
                leftIcon="call-outline"
                error={errors.phone}
              />
            </Animated.View>

            {/* PIN */}
            <Animated.View style={[styles.inputGroup, rowStyle(2)]}>
              <AppInput
                label={t("auth.pinLabel", { defaultValue: "PIN (4-6 digits)" })}
                placeholder={t("auth.pinPlaceholder", { defaultValue: "Create a 4-6 digit PIN" })}
                keyboardType="numeric"
                secureTextEntry
                maxLength={6}
                value={pin}
                onChangeText={(txt) => {
                  setPin(txt);
                  clearFieldError("pin");
                }}
                leftIcon="lock-closed-outline"
                error={errors.pin}
              />
            </Animated.View>

            {/* Section 2: Account Role & Language */}
            <Animated.View style={rowStyle(3)}>
              <AppText style={styles.sectionHeader}>
                2. {t("auth.roleLangSection", { defaultValue: "Account Role & Preferred Language" })}
              </AppText>
            </Animated.View>

            {/* Role Chips */}
            <Animated.View style={[styles.inputGroup, rowStyle(3)]}>
              <AppText style={[styles.label, { color: textSecondary }]}>
                {t("auth.roleLabel", { defaultValue: "I am joining as a..." })}
              </AppText>
              <View style={styles.roleContainer}>
                <SelectableChip
                  active={role === "farmer"}
                  onPress={() => setRole("farmer")}
                  icon="leaf"
                  label={t("auth.roleFarmer", { defaultValue: "Farmer Producer" })}
                  primary={primary}
                  border={border}
                  textSecondary={textSecondary}
                />
                <SelectableChip
                  active={role === "buyer"}
                  onPress={() => setRole("buyer")}
                  icon="cart"
                  label={t("auth.roleBuyer", { defaultValue: "Wholesale Buyer" })}
                  primary={primary}
                  border={border}
                  textSecondary={textSecondary}
                />
              </View>
            </Animated.View>

            {/* Language Chips */}
            <Animated.View style={[styles.inputGroup, rowStyle(4)]}>
              <AppText style={[styles.label, { color: textSecondary }]}>
                {t("auth.langLabel", { defaultValue: "Preferred Language / ቋንቋ" })}
              </AppText>
              <View style={styles.languageContainer}>
                {LANGUAGE_OPTIONS.map((opt) => (
                  <SelectableChip
                    key={opt.code}
                    active={preferredLang === opt.code}
                    onPress={() => handleLanguageSelect(opt.code)}
                    label={opt.label}
                    primary={primary}
                    border={border}
                    textSecondary={textSecondary}
                  />
                ))}
              </View>
            </Animated.View>

            {/* Section 3: Location Details */}
            <Animated.View style={rowStyle(5)}>
              <AppText style={styles.sectionHeader}>
                3. {t("postProduct.location", { defaultValue: "Location & Operation Center" })}
              </AppText>
            </Animated.View>

            {/* Region */}
            <Animated.View style={[styles.inputGroup, rowStyle(6)]}>
              <LocationPicker
                label={t("auth.regionLabel", { defaultValue: "Region" })}
                value={region}
                displayLabel={regionLabel}
                options={regionOptions}
                onSelect={(val) => {
                  setRegion(val);
                  setZone("");
                  setWereda("");
                  clearFieldError("region");
                }}
                visible={showRegionPicker}
                onToggle={() => togglePicker("region")}
                disabled={false}
                error={errors.region}
                primary={primary}
                border={border}
                textPrimary={textPrimary}
                textSecondary={textSecondary}
                errorColor={errorColor}
              />
            </Animated.View>

            {/* Zone */}
            <Animated.View style={[styles.inputGroup, rowStyle(7)]}>
              <LocationPicker
                label={t("auth.zoneLabel", { defaultValue: "Zone" })}
                value={zone}
                displayLabel={zoneLabel}
                options={availableZones}
                onSelect={(val) => {
                  setZone(val);
                  setWereda("");
                  clearFieldError("zone");
                }}
                visible={showZonePicker}
                onToggle={() => togglePicker("zone")}
                disabled={!region}
                error={errors.zone}
                primary={primary}
                border={border}
                textPrimary={textPrimary}
                textSecondary={textSecondary}
                errorColor={errorColor}
              />
            </Animated.View>

            {/* Wereda */}
            <Animated.View style={[styles.inputGroup, rowStyle(8)]}>
              <LocationPicker
                label={t("auth.weredaLabel", { defaultValue: "Wereda" })}
                value={wereda}
                displayLabel={weredaLabel}
                options={availableWereda}
                onSelect={(val) => {
                  setWereda(val);
                  clearFieldError("wereda");
                }}
                visible={showWeredaPicker}
                onToggle={() => togglePicker("wereda")}
                disabled={!zone}
                error={errors.wereda}
                primary={primary}
                border={border}
                textPrimary={textPrimary}
                textSecondary={textSecondary}
                errorColor={errorColor}
              />
            </Animated.View>

            {/* Optional Email */}
            <Animated.View style={[styles.inputGroup, rowStyle(9)]}>
              <AppInput
                label={t("auth.emailLabel", { defaultValue: "Email (Optional)" })}
                placeholder={t("auth.emailPlaceholder", { defaultValue: "e.g. user@domain.com" })}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                leftIcon="mail-outline"
              />
            </Animated.View>

            {registerError ? (
              <ErrorBanner message={registerError} errorColor={errorColor} />
            ) : null}

            {/* CTA Register Button */}
            <Animated.View
              style={{ transform: [{ scale: ctaScale }], marginTop: 24 }}
            >
              <Pressable
                onPressIn={pressIn}
                onPressOut={pressOut}
                onPress={handleRegister}
                disabled={loading}
              >
                <AppButton
                  title={loading ? t("common.loading", { defaultValue: "Creating Account..." }) : t("auth.registerBtn", { defaultValue: "Register Account" })}
                  onPress={handleRegister}
                  loading={loading}
                  disabled={loading}
                  fullWidth
                />
              </Pressable>
            </Animated.View>

            {/* Login Link Row */}
            <Animated.View
              style={[
                rowStyle(FOOTER_ROW_INDEX),
                styles.footerRow,
              ]}
            >
              <AppText style={styles.footerSub}>
                {t("auth.hasAccount", { defaultValue: "Already have an account?" })}
              </AppText>
              <Pressable
                onPress={() => navigation.navigate("Login")}
                hitSlop={10}
              >
                <AppText style={[styles.footerLink, { color: primary }]}>
                  {t("auth.loginBtn", { defaultValue: "Login to Account" })}
                </AppText>
              </Pressable>
            </Animated.View>

            {/* Support Helpline Pill */}
            <TouchableOpacity
              style={styles.supportPill}
              onPress={() => Linking.openURL("tel:0938730818")}
              activeOpacity={0.8}
            >
              <Ionicons name="headset-outline" size={14} color="#15803D" />
              <AppText style={styles.supportPillText}>
                {t("auth.registerSupportHelpline", { defaultValue: "Need registration help? Call Support: 0938730818" })}
              </AppText>
            </TouchableOpacity>
          </Animated.View>
        </Animated.ScrollView>
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: { flexGrow: 1, paddingHorizontal: 22, paddingBottom: 40 },
  logoWrapper: { alignItems: "center", marginTop: 16, marginBottom: 12 },
  logo: { width: 140, height: 140 },
  title: { textAlign: "center", fontWeight: "800", fontSize: 22, marginBottom: 6 },
  subtitle: { textAlign: "center", marginBottom: 20, fontSize: 13.5, lineHeight: 20 },
  form: { gap: 4 },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 12,
    marginBottom: 8,
  },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 4 },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: 38,
    zIndex: 10,
  },
  roleContainer: { flexDirection: "row", gap: 10, marginTop: 6 },
  languageContainer: { flexDirection: "row", gap: 10, marginTop: 6 },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    gap: 6,
  },
  footerSub: {
    fontSize: 14,
    color: "#64748B",
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "800",
  },
  supportPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#DCFCE7",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginTop: 24,
  },
  supportPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#15803D",
  },
});
