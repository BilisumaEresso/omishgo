import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Easing,
  Image,
  KeyboardAvoidingView,
  LayoutAnimation,
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

// Number of staggered form rows (0-9) + 1 dedicated footer row (index 10)
const ROW_COUNT = 10;
const FOOTER_ROW_INDEX = ROW_COUNT; // 10

export default function RegisterScreen({ navigation }) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const register = useAuthStore((state) => state.register);
  const setAppLanguage = useAuthStore((state) => state.setLanguage);
  const currentLanguage = useAuthStore((state) => state.language);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
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

  const lang = "en"; // can be dynamic: i18n.language || "en"
  const regionOptions = getLocalizedRegions(lang);
  const availableZones = region ? getLocalizedZones(region, lang) : [];
  const availableWereda = zone ? getLocalizedWereda(region, zone, lang) : [];

  const regionLabel =
    regionOptions.find((r) => r.value === region)?.label || region;
  const zoneLabel = availableZones.find((z) => z.value === zone)?.label || zone;
  const weredaLabel =
    availableWereda.find((w) => w.value === wereda)?.label || wereda;

  const primary = theme?.colors?.primary || "#2E7D32";
  const textPrimary = theme?.colors?.textPrimary || "#212121";
  const textSecondary = theme?.colors?.textSecondary || "#757575";
  const backgroundColor = theme?.colors?.background || "#FFFFFF";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#E0E0E0";
  const errorColor = theme?.colors?.error || "#C62828";
  const spacingXxxl = theme?.spacing?.xxxl ?? 32;

  // Scroll animations
  const scrollY = useRef(new Animated.Value(0)).current;

  const logoScale = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0.55],
    extrapolate: "clamp",
  });

  const logoTranslateY = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -20],
    extrapolate: "clamp",
  });

  const logoOpacity = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [1, 0.85],
    extrapolate: "clamp",
  });

  // Entrance animations
  const heroAnim = useRef(new Animated.Value(0)).current;
  // +1 extra slot for the footer row (login link row)
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
      Animated.timing(shakeX, {
        toValue: 8,
        duration: 55,
        useNativeDriver: true,
      }),
      Animated.timing(shakeX, {
        toValue: -8,
        duration: 55,
        useNativeDriver: true,
      }),
      Animated.timing(shakeX, {
        toValue: 6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeX, {
        toValue: -4,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeX, {
        toValue: 0,
        duration: 45,
        useNativeDriver: true,
      }),
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
    if (!name.trim()) newErrors.name = "Full name is required.";
    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    if (!pin.trim() || pin.trim().length < 4)
      newErrors.pin = "Create a PIN with at least 4 digits.";
    if (!region.trim()) newErrors.region = "Region is required.";
    if (!zone.trim()) newErrors.zone = "Zone is required.";
    if (!wereda.trim()) newErrors.wereda = "Wereda is required.";
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
          result.message || t("auth.registerError") || "Registration failed.",
        );
        return;
      }
      await setAppLanguage(preferredLang);
      if (result.autoLoginFailed) navigation.replace("Login");
    } catch (error) {
      shake();
      setRegisterError(
        error.message ||
          t("auth.registrationFailed") ||
          "Something went wrong.",
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
      <View
        style={[
          styles.header,
          {
            backgroundColor: surface,
            borderBottomColor: border,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 8,
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
          <Animated.View
            style={[
              styles.logoWrapper,
              {
                opacity: Animated.multiply(logoOpacity, heroAnim),
                transform: [
                  { translateY: logoTranslateY },
                  { scale: Animated.multiply(logoScale, heroAnim) },
                ],
              },
            ]}
          >
            <Image
              source={require("../../../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.View style={{ opacity: heroAnim }}>
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
          </Animated.View>

          <Animated.View
            style={[styles.form, { transform: [{ translateX: shakeX }] }]}
          >
            {/* Name */}
            <Animated.View style={[styles.inputGroup, rowStyle(0)]}>
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
                <ErrorRow message={errors.name} errorColor={errorColor} />
              )}
            </Animated.View>

            {/* Phone */}
            <Animated.View style={[styles.inputGroup, rowStyle(1)]}>
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
                <ErrorRow message={errors.phone} errorColor={errorColor} />
              )}
            </Animated.View>

            {/* PIN */}
            <Animated.View style={[styles.inputGroup, rowStyle(2)]}>
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
                <ErrorRow message={errors.pin} errorColor={errorColor} />
              )}
            </Animated.View>

            {/* Role */}
            <Animated.View style={[styles.inputGroup, rowStyle(3)]}>
              <AppText style={[styles.label, { color: textSecondary }]}>
                {t("auth.roleLabel")}
              </AppText>
              <View style={styles.roleContainer}>
                <SelectableChip
                  active={role === "farmer"}
                  onPress={() => setRole("farmer")}
                  icon="leaf"
                  label={t("auth.roleFarmer")}
                  primary={primary}
                  border={border}
                  textSecondary={textSecondary}
                />
                <SelectableChip
                  active={role === "buyer"}
                  onPress={() => setRole("buyer")}
                  icon="cart"
                  label={t("auth.roleBuyer")}
                  primary={primary}
                  border={border}
                  textSecondary={textSecondary}
                />
              </View>
            </Animated.View>

            {/* Language */}
            <Animated.View style={[styles.inputGroup, rowStyle(4)]}>
              <AppText style={[styles.label, { color: textSecondary }]}>
                {t("auth.langLabel")}
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

            {/* Location Section */}
            <Animated.View style={rowStyle(5)}>
              <AppText
                variant="headingSm"
                style={[styles.sectionTitle, { color: textPrimary }]}
              >
                {t("postProduct.location", { defaultValue: "Location" })}
              </AppText>
            </Animated.View>

            {/* Region */}
            <Animated.View style={[styles.inputGroup, rowStyle(6)]}>
              <LocationPicker
                label={t("auth.regionLabel")}
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
                label={t("auth.zoneLabel")}
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
                label="Wereda"
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

            {/* Email */}
            <Animated.View style={[styles.inputGroup, rowStyle(9)]}>
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
            </Animated.View>

            {registerError ? (
              <ErrorBanner message={registerError} errorColor={errorColor} />
            ) : null}

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
                  title={loading ? t("common.loading") : t("auth.registerBtn")}
                  onPress={handleRegister}
                  loading={loading}
                  disabled={loading}
                  fullWidth
                />
              </Pressable>
            </Animated.View>

            <Animated.View
              style={[
                rowStyle(FOOTER_ROW_INDEX),
                {
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: spacingXxxl,
                },
              ]}
            >
              <AppText variant="bodyMd" style={{ color: textSecondary }}>
                {t("auth.hasAccount")}
              </AppText>
              <Pressable
                onPress={() => navigation.navigate("Login")}
                hitSlop={10}
              >
                <AppText
                  variant="bodyMd"
                  style={{ color: primary, fontWeight: "700", marginLeft: 4 }}
                >
                  {t("auth.loginBtn")}
                </AppText>
              </Pressable>
            </Animated.View>
          </Animated.View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// Small error row component (inline for simplicity)
function ErrorRow({ message, errorColor }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
        gap: 4,
      }}
    >
      <Ionicons name="alert-circle" size={14} color={errorColor} />
      <AppText style={{ fontSize: 12, flex: 1, color: errorColor }}>
        {message}
      </AppText>
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
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  logoWrapper: { alignItems: "center", marginTop: 24, marginBottom: 20 },
  logo: { width: 180, height: 180 },
  title: { textAlign: "center", fontWeight: "700", marginBottom: 8 },
  subtitle: { textAlign: "center", marginBottom: 24 },
  form: { gap: 4 },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
  roleContainer: { flexDirection: "row", gap: 12, marginTop: 8 },
  languageContainer: { flexDirection: "row", gap: 12, marginTop: 8 },
  sectionTitle: { marginTop: 16, marginBottom: 8 },
  linkButton: { alignItems: "center", marginTop: 20 },
  linkText: { fontWeight: "600", fontSize: 14 },
});
