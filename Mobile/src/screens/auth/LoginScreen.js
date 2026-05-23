// src/screens/auth/LoginScreen.js
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AppText from "../../components/common/AppText";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme();
  const { login } = useAuthStore();

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!pin.trim()) newErrors.pin = "PIN is required";
    else if (!/^\d{4,6}$/.test(pin)) newErrors.pin = "PIN must be 4-6 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const result = await login(phone, pin);
      if (!result.success) {
        setErrors({ submit: result.message || "Login failed" });
      }
    } catch (error) {
      setErrors({ submit: error.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: theme.colors.background,
        }}
      >
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Image
            source={require("../../assets/images/hero-teff.png")}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View
            style={[
              styles.heroOverlay,
              { backgroundColor: theme.colors.background + "66" },
            ]}
          />
        </View>

        {/* Login Form */}
        <View
          style={[
            styles.formContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <View style={styles.headingBlock}>
            <AppText
              variant="bodyLg"
              color={theme.colors.primary}
              style={{ fontWeight: "700" }}
            >
              OmishGo
            </AppText>
            <AppText variant="headingMd" color={theme.colors.text}>
              Welcome Back
            </AppText>
          </View>

          {errors.submit && (
            <AppText
              color={theme.colors.error}
              variant="caption"
              style={{ marginBottom: 10 }}
            >
              {errors.submit}
            </AppText>
          )}

          <View style={styles.inputGroup}>
            <AppInput
              label="Phone Number"
              placeholder="911 234 567"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              error={errors.phone}
            />
            <AppInput
              label="PIN"
              placeholder="••••"
              value={pin}
              onChangeText={(t) => setPin(t.replace(/[^0-9]/g, ""))}
              keyboardType="number-pad"
              secureTextEntry
              error={errors.pin}
            />
          </View>

          <AppButton
            title="Login"
            fullWidth
            onPress={handleSubmit}
            loading={loading}
            style={{ marginBottom: 24 }}
          />

          <View style={styles.footerRow}>
            <AppText variant="bodyMd" color={theme.colors.textSecondary}>
              Don't have an account?{" "}
            </AppText>
            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
            >
              <AppText
                variant="bodyMd"
                color={theme.colors.primary}
                style={{ fontWeight: "700" }}
              >
                Sign Up
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  heroContainer: { height: 220, width: "100%" },
  heroImage: { width: "100%", height: "100%" },
  heroOverlay: { ...StyleSheet.absoluteFillObject },
  formContainer: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 24,
  },
  headingBlock: { alignItems: "center", marginBottom: 32 },
  inputGroup: { gap: 20, marginBottom: 24 },
  footerRow: { flexDirection: "row", justifyContent: "center" },
});
