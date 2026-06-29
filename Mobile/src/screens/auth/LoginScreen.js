// src/screens/auth/LoginScreen.js
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../../components/common/AppText";
import AppInput from "../../components/common/AppInput";
import AppButton from "../../components/common/AppButton";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme();
  const login = useAuthStore((state) => state.login);

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const primary = theme.colors.primary || "#4CAF50";
  const textPrimary = theme.colors.textPrimary || "#212121";
  const textSecondary = theme.colors.textSecondary || "#757575";
  const backgroundColor = theme.colors.background || "#FFFFFF";
  const errorColor = theme.colors.error || "#F44336";

  // Clear field error when user types
  const handlePhoneChange = (text) => {
    setPhone(text);
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
    if (loginError) setLoginError("");
  };

  const handlePinChange = (text) => {
    setPin(text);
    if (errors.pin) setErrors((prev) => ({ ...prev, pin: "" }));
    if (loginError) setLoginError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!phone.trim()) {
      newErrors.phone = "Please enter your phone number.";
    }
    if (!pin.trim() || pin.trim().length < 4) {
      newErrors.pin = "Enter a PIN with at least 4 digits.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    setLoginError("");
    try {
      const result = await login(phone.trim(), pin.trim());
      if (!result.success) {
        setLoginError(
          result.message || "Incorrect phone or PIN. Please try again.",
        );
      }
    } catch (error) {
      setLoginError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoWrapper}>
          <Image
            source={require("../../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <AppText
          variant="headingLg"
          style={[styles.title, { color: textPrimary }]}
        >
          Welcome Back
        </AppText>
        <AppText
          variant="bodyMd"
          style={[styles.subtitle, { color: textSecondary }]}
        >
          Sign in with your phone and PIN
        </AppText>

        {/* Form */}
        <View style={styles.form}>
          {/* Phone Input */}
          <View style={styles.inputGroup}>
            <AppText style={[styles.label, { color: textSecondary }]}>
              Phone Number
            </AppText>
            <AppInput
              placeholder="e.g. 0911223344"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={handlePhoneChange}
              leftIcon="call-outline"
              style={errors.phone ? { borderColor: errorColor } : {}}
            />
            {errors.phone ? (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle" size={14} color={errorColor} />
                <AppText style={[styles.errorText, { color: errorColor }]}>
                  {errors.phone}
                </AppText>
              </View>
            ) : null}
          </View>

          {/* PIN Input */}
          <View style={styles.inputGroup}>
            <AppText style={[styles.label, { color: textSecondary }]}>
              PIN
            </AppText>
            <AppInput
              placeholder="Enter your PIN"
              keyboardType="numeric"
              secureTextEntry
              maxLength={6}
              value={pin}
              onChangeText={handlePinChange}
              leftIcon="lock-closed-outline"
              style={errors.pin ? { borderColor: errorColor } : {}}
            />
            {errors.pin ? (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle" size={14} color={errorColor} />
                <AppText style={[styles.errorText, { color: errorColor }]}>
                  {errors.pin}
                </AppText>
              </View>
            ) : null}
          </View>

          {/* Login‑error banner */}
          {loginError ? (
            <View
              style={[
                styles.errorBanner,
                { backgroundColor: errorColor + "15" },
              ]}
            >
              <Ionicons name="alert-circle" size={16} color={errorColor} />
              <AppText style={[styles.errorBannerText, { color: errorColor }]}>
                {loginError}
              </AppText>
            </View>
          ) : null}

          <AppButton
            title={loading ? "Signing in..." : "Sign In"}
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            fullWidth
            style={styles.loginButton}
          />

          <View style={styles.linksRow}>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate("ForgotPIN")}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <AppText style={[styles.linkText, { color: primary }]}>
                Forgot PIN?
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate("Register")}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <AppText style={[styles.linkText, { color: primary }]}>
                Create account
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 200,
  },
  title: {
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 32,
  },
  form: {
    gap: 12,
  },
  inputGroup: {
    marginBottom: 4,
  },
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
  errorText: {
    fontSize: 12,
    flex: 1,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    gap: 6,
    marginTop: 4,
  },
  errorBannerText: {
    fontSize: 13,
    flex: 1,
  },
  loginButton: {
    marginTop: 8,
  },
  linksRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  linkButton: {
    paddingVertical: 8,
  },
  linkText: {
    fontWeight: "600",
    fontSize: 14,
  },
});
