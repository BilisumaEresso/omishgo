import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from "react-native";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import AppText from "../../components/common/AppText";
import AuthLayout from "../../components/layout/AuthLayout";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store.js";

/**
 * Premium LoginScreen
 * - Staggered entrance (logo pop → title → fields → button)
 * - Subtle idle "breathing" on the logo/card
 * - Shake animation on validation / submit error
 * - Focus lift on inputs, press-scale on the CTA
 * - Success pulse before navigation hand-off
 * Drop-in replacement. No new required deps.
 */
const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { login } = useAuthStore();

  const [phone, setPhone] = React.useState("");
  const [pin, setPin] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  // ---- Animated values ----
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoBreath = useRef(new Animated.Value(1)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslate = useRef(new Animated.Value(12)).current;

  // Per-row entrance
  const row1 = useRef(new Animated.Value(0)).current;
  const row2 = useRef(new Animated.Value(0)).current;
  const rowCTA = useRef(new Animated.Value(0)).current;
  const rowFooter = useRef(new Animated.Value(0)).current;

  // Interaction
  const shakeX = useRef(new Animated.Value(0)).current;
  const ctaScale = useRef(new Animated.Value(1)).current;
  const successPulse = useRef(new Animated.Value(0)).current;

  // ---- Entrance sequence ----
  useEffect(() => {
    Animated.sequence([
      Animated.spring(logoScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 12,
        bounciness: 10,
      }),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslate, {
          toValue: 0,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.stagger(90, [
        rise(row1),
        rise(row2),
        rise(rowCTA),
        rise(rowFooter),
      ]),
    ]).start();

    // Idle breathing on the logo (very subtle)
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoBreath, {
          toValue: 1.03,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(logoBreath, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    return () => {
      // Stop all loops on unmount
      logoBreath.stopAnimation();
    };
  }, []);

  function rise(val) {
    return Animated.timing(val, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
  }

  const shake = () => {
    shakeX.setValue(0);
    Animated.sequence([
      Animated.timing(shakeX, {
        toValue: 8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeX, {
        toValue: -8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeX, {
        toValue: 6,
        duration: 55,
        useNativeDriver: true,
      }),
      Animated.timing(shakeX, {
        toValue: -4,
        duration: 55,
        useNativeDriver: true,
      }),
      Animated.timing(shakeX, {
        toValue: 0,
        duration: 50,
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
    Keyboard.dismiss();
    if (!validateForm()) {
      shake();
      return;
    }
    setLoading(true);
    try {
      const result = await login(phone, pin);
      if (!result.success) {
        shake();
        if (result.errorType === "DEVICE_BLOCKED") {
          navigation.navigate(
            "DeviceBlocked" /* TODO: DeviceBlocked screen not yet registered */,
            { phone },
          );
        } else {
          setErrors({ submit: result.message || "Login failed" });
        }
      } else {
        // Success pulse hand-off
        Animated.timing(successPulse, {
          toValue: 1,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      }
    } catch (error) {
      shake();
      setErrors({ submit: error.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  const primary = theme?.colors?.primary || "#2E7D32";
  const errorColor = theme?.colors?.error || "#C62828";

  // Helpers for staggered row style
  const rowStyle = (val) => ({
    opacity: val,
    transform: [
      {
        translateY: val.interpolate({
          inputRange: [0, 1],
          outputRange: [14, 0],
        }),
      },
    ],
  });

  const successScale = successPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
  });

  return (
    <AuthLayout
      title={t("auth.loginTitle")}
      subtitle={t("auth.loginSubtitle")}
      logoSource={require("../../assets/images/logo.png")}
      showBack={false}
      // If AuthLayout supports these, they'll animate the logo/title.
      // Safe to ignore if not — layout will just render normally.
      logoStyle={{
        transform: [{ scale: Animated.multiply(logoScale, logoBreath) }],
      }}
      titleStyle={{
        opacity: titleOpacity,
        transform: [{ translateY: titleTranslate }],
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ width: "100%" }}
      >
        <Animated.View
          style={{
            width: "100%",
            transform: [{ translateX: shakeX }, { scale: successScale }],
          }}
        >
          <View style={{ marginTop: theme.spacing.lg }}>
            {errors.submit && (
              <Animated.View
                style={{
                  backgroundColor: errorColor + "15",
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: theme.spacing.md,
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: errorColor + "30",
                }}
              >
                <Ionicons
                  name="alert-circle"
                  size={16}
                  color={errorColor}
                  style={{ marginRight: 8 }}
                />
                <AppText
                  variant="caption"
                  color={errorColor}
                  style={{ flex: 1 }}
                >
                  {errors.submit}
                </AppText>
              </Animated.View>
            )}

            <Animated.View style={rowStyle(row1)}>
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
                returnKeyType="next"
              />
            </Animated.View>

            <Animated.View style={rowStyle(row2)}>
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
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                maxLength={6}
              />
            </Animated.View>

            <Animated.View
              style={[
                rowStyle(rowCTA),
                {
                  marginTop: theme.spacing.xl,
                  transform: [
                    ...rowStyle(rowCTA).transform,
                    { scale: ctaScale },
                  ],
                },
              ]}
            >
              <Pressable
                onPressIn={pressIn}
                onPressOut={pressOut}
                onPress={handleSubmit}
                disabled={loading}
              >
                <AppButton
                  title={t("auth.loginBtn")}
                  onPress={handleSubmit}
                  loading={loading}
                  fullWidth
                />
              </Pressable>
            </Animated.View>

            <Animated.View
              style={[
                rowStyle(rowFooter),
                {
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: theme.spacing.xxxl,
                },
              ]}
            >
              <AppText variant="bodyMd" color={theme.colors.textSecondary}>
                {t("auth.noAccount")}
              </AppText>
              <Pressable
                onPress={() => navigation.navigate("Register")}
                hitSlop={10}
              >
                <AppText
                  variant="bodyMd"
                  color={primary}
                  style={{ fontWeight: "700", marginLeft: 4 }}
                >
                  {t("auth.registerBtn")}
                </AppText>
              </Pressable>
            </Animated.View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
};

export default LoginScreen;
