import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Pressable, View } from "react-native";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import AppText from "../../components/common/AppText";
import AuthLayout from "../../components/layout/AuthLayout";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store.js";

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { login } = useAuthStore();

  const [phone, setPhone] = React.useState("");
  const [pin, setPin] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  // Animated values for welcome effect
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence: logo scales up, then title fades in, then form fades in
    Animated.sequence([
      Animated.spring(logoScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 2,
        bounciness: 8,
      }),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!pin.trim()) newErrors.pin = "PIN is required";
    else if (!/^\d{4,6}$/.test(pin))
      newErrors.pin = "PIN must be between 4 and 6 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const result = await login(phone, pin);
      if (!result.success) {
        if (result.errorType === "DEVICE_BLOCKED") {
          navigation.navigate("DeviceBlocked", { phone });
        } else {
          setErrors({ submit: result.message || "Login failed" });
        }
      }
    } catch (error) {
      setErrors({ submit: error.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  const primary = theme?.colors?.primary || "#2E7D32";
  const errorColor = theme?.colors?.error || "#C62828";

  return (
    <AuthLayout
      title={t("auth.loginTitle")}
      subtitle={t("auth.loginSubtitle")}
      logoSource={require("../../../assets/logo.png")}
      showBack={false}
    >
      {/* Animated container for the whole form */}
      <Animated.View
        style={{
          transform: [{ scale: logoScale }],
          opacity: formOpacity,
          width: "100%",
        }}
      >
        <View style={{ marginTop: theme.spacing.lg }}>
          {errors.submit && (
            <View
              style={{
                backgroundColor: errorColor + "15",
                borderRadius: 8,
                padding: 12,
                marginBottom: theme.spacing.md,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="alert-circle"
                size={16}
                color={errorColor}
                style={{ marginRight: 8 }}
              />
              <AppText variant="caption" color={errorColor} style={{ flex: 1 }}>
                {errors.submit}
              </AppText>
            </View>
          )}

          <AppInput
            label={t("auth.phoneLabel")}
            placeholder={t("auth.phonePlaceholder")}
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (errors.phone) setErrors({ ...errors, phone: "" });
            }}
            keyboardType="phone-pad"
            error={errors.phone}
            leftIcon="call-outline"
          />

          <AppInput
            label={t("auth.pinLabel")}
            placeholder={t("auth.pinPlaceholder")}
            value={pin}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, "");
              setPin(numericText);
              if (errors.pin) setErrors({ ...errors, pin: "" });
            }}
            keyboardType="number-pad"
            secureTextEntry
            error={errors.pin}
            leftIcon="lock-closed-outline"
          />

          <AppButton
            title={t("auth.loginBtn")}
            onPress={handleSubmit}
            loading={loading}
            fullWidth
            style={{ marginTop: theme.spacing.xl }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: theme.spacing.xxxl,
            }}
          >
            <AppText variant="bodyMd" color={theme.colors.textSecondary}>
              {t("auth.noAccount")}
            </AppText>
            <Pressable onPress={() => navigation.navigate("Register")}>
              <AppText
                variant="bodyMd"
                color={primary}
                style={{ fontWeight: "600" }}
              >
                {t("auth.registerBtn")}
              </AppText>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </AuthLayout>
  );
};

export default LoginScreen;
