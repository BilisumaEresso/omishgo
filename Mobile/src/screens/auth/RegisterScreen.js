// src/screens/auth/RegisterScreen.js
import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../../components/common/AppText";
import AppInput from "../../components/common/AppInput";
import AppButton from "../../components/common/AppButton";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

export default function RegisterScreen({ navigation }) {
  const { theme } = useTheme();
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
  const [errors, setErrors] = useState({});
  const [registerError, setRegisterError] = useState("");

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

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Full name is required.";
    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    if (!pin.trim() || pin.trim().length < 4)
      newErrors.pin = "Create a PIN with at least 4 digits.";
    if (!region.trim()) newErrors.region = "Region is required.";
    if (!zone.trim()) newErrors.zone = "Zone is required.";
    if (!kebele.trim()) newErrors.kebele = "Kebele is required.";
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
          kebele: kebele.trim(),
        },
        preferredLang: "en",
      });
      if (!result.success) {
        setRegisterError(result.message || "Registration failed. Try again.");
        return;
      }
      if (result.autoLoginFailed) {
        navigation.replace("Login");
      }
    } catch (error) {
      setRegisterError(
        error.message || "Something went wrong. Please try again.",
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
            Create Account
          </AppText>
          <AppText
            variant="bodyMd"
            style={[styles.subtitle, { color: textSecondary }]}
          >
            Join OmishGo and start trading
          </AppText>

          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <AppText style={[styles.label, { color: textSecondary }]}>
                Full Name
              </AppText>
              <AppInput
                placeholder="e.g. Bekele Tadesse"
                value={name}
                onChangeText={(t) => {
                  setName(t);
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
                Phone Number
              </AppText>
              <AppInput
                placeholder="e.g. 0911223344"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={(t) => {
                  setPhone(t);
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
                Create a PIN
              </AppText>
              <AppInput
                placeholder="At least 4 digits"
                keyboardType="numeric"
                secureTextEntry
                maxLength={6}
                value={pin}
                onChangeText={(t) => {
                  setPin(t);
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
                I am a...
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
                    Farmer
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
                    Buyer
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Location Section */}
            <AppText
              variant="headingSm"
              style={[styles.sectionTitle, { color: textPrimary }]}
            >
              Location
            </AppText>

            <View style={styles.inputGroup}>
              <AppText style={[styles.label, { color: textSecondary }]}>
                Region
              </AppText>
              <AppInput
                placeholder="e.g. Oromia"
                value={region}
                onChangeText={(t) => {
                  setRegion(t);
                  clearFieldError("region");
                }}
                leftIcon="location-outline"
                style={errors.region ? { borderColor: errorColor } : {}}
              />
              {errors.region && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle" size={14} color={errorColor} />
                  <AppText style={[styles.errorText, { color: errorColor }]}>
                    {errors.region}
                  </AppText>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <AppText style={[styles.label, { color: textSecondary }]}>
                Zone
              </AppText>
              <AppInput
                placeholder="e.g. Jimma"
                value={zone}
                onChangeText={(t) => {
                  setZone(t);
                  clearFieldError("zone");
                }}
                style={errors.zone ? { borderColor: errorColor } : {}}
              />
              {errors.zone && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle" size={14} color={errorColor} />
                  <AppText style={[styles.errorText, { color: errorColor }]}>
                    {errors.zone}
                  </AppText>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <AppText style={[styles.label, { color: textSecondary }]}>
                Kebele
              </AppText>
              <AppInput
                placeholder="e.g. Bure"
                value={kebele}
                onChangeText={(t) => {
                  setKebele(t);
                  clearFieldError("kebele");
                }}
                style={errors.kebele ? { borderColor: errorColor } : {}}
              />
              {errors.kebele && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle" size={14} color={errorColor} />
                  <AppText style={[styles.errorText, { color: errorColor }]}>
                    {errors.kebele}
                  </AppText>
                </View>
              )}
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <AppText style={[styles.label, { color: textSecondary }]}>
                Email (optional)
              </AppText>
              <AppInput
                placeholder="e.g. bek@example.com"
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
              title={loading ? "Creating Account..." : "Sign Up"}
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
                Already have an account? Sign in
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
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  loginButton: { marginTop: 24 },
  linkButton: {
    alignItems: "center",
    marginTop: 20,
  },
  linkText: { fontWeight: "600", fontSize: 14 },
});
