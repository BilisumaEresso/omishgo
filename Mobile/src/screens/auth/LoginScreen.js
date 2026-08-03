// Mobile/src/screens/auth/LoginScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
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
  const [showPin, setShowPin] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  // ---- Animated values ----
  const logoScale = useRef(new Animated.Value(0.8)).current;
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

    // Idle breathing on logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoBreath, {
          toValue: 1.02,
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
    if (!phone.trim())
      newErrors.phone = t("auth.phoneRequired", {
        defaultValue: "Phone number is required",
      });
    if (!pin.trim())
      newErrors.pin = t("auth.pinRequired", {
        defaultValue: "PIN is required",
      });
    else if (!/^\d{4,6}$/.test(pin))
      newErrors.pin = t("auth.pinLengthError", {
        defaultValue: "PIN must be between 4 and 6 digits",
      });
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
        setErrors({
          submit:
            result.message ||
            t("auth.loginFailed", {
              defaultValue: "Login failed. Check your phone & PIN.",
            }),
        });
      } else {
        Animated.timing(successPulse, {
          toValue: 1,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      }
    } catch (error) {
      shake();
      setErrors({
        submit:
          error.message ||
          t("auth.loginFailed", {
            defaultValue: "Login failed. Please try again.",
          }),
      });
    } finally {
      setLoading(false);
    }
  };

  const primary = theme?.colors?.primary || "#15803D";
  const errorColor = theme?.colors?.error || "#EF4444";

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
      title={t("auth.loginTitle", { defaultValue: "Welcome Back" })}
      subtitle={t("auth.loginSubtitle", {
        defaultValue: "Sign in to access produce listings & wholesale orders",
      })}
      logoSource={require("../../assets/images/logo.png")}
      showBack={false}
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
          <View style={{ marginTop: 8 }}>
            {errors.submit && (
              <Animated.View style={styles.errorCard}>
                <Ionicons name="alert-circle" size={18} color={errorColor} />
                <AppText style={styles.errorText}>{errors.submit}</AppText>
              </Animated.View>
            )}

            {/* Phone Input */}
            <Animated.View style={rowStyle(row1)}>
              <AppInput
                label={t("auth.phoneLabel", { defaultValue: "Phone Number" })}
                placeholder={t("auth.phonePlaceholder", {
                  defaultValue: "e.g. 0911234567",
                })}
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

            {/* PIN Input */}
            <Animated.View style={rowStyle(row2)}>
              <AppInput
                label={t("auth.pinLabel", { defaultValue: "PIN (4-6 digits)" })}
                placeholder={t("auth.pinPlaceholder", {
                  defaultValue: "Enter your 4-6 digit PIN",
                })}
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

            {/* CTA Button */}
            <Animated.View
              style={[
                rowStyle(rowCTA),
                {
                  marginTop: 20,
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
                  title={t("auth.loginBtn", {
                    defaultValue: "Login to Account",
                  })}
                  onPress={handleSubmit}
                  loading={loading}
                  fullWidth
                />
              </Pressable>
            </Animated.View>

            {/* Register Redirect Row */}
            <Animated.View style={[rowStyle(rowFooter), styles.footerRow]}>
              <AppText style={styles.footerSub}>
                {t("auth.noAccount", {
                  defaultValue: "Don't have an account?",
                })}
              </AppText>
              <Pressable
                onPress={() => navigation.navigate("Register")}
                hitSlop={10}
              >
                <AppText style={[styles.footerLink, { color: primary }]}>
                  {t("auth.registerBtn", { defaultValue: "Register Account" })}
                </AppText>
              </Pressable>
            </Animated.View>

            {/* Customer Support Helpline Pill */}
            <TouchableOpacity
              style={styles.supportPill}
              onPress={() => Linking.openURL("tel:0938730818")}
              activeOpacity={0.8}
            >
              <Ionicons name="headset-outline" size={14} color="#15803D" />
              <AppText style={styles.supportPillText}>
                {t("auth.supportHelpline", {
                  defaultValue: "Need help? Call Support: 0938730818",
                })}
              </AppText>
            </TouchableOpacity>

            {/* FAQ Link */}
            <View style={styles.footerRow}>
              <Pressable
                onPress={() => navigation.navigate("Help")}
                hitSlop={10}
              >
                <AppText style={[styles.footerLink, { color: primary }]}>
                  {t("auth.viewFaq", { defaultValue: "View FAQ" })}
                </AppText>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  errorCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: {
    fontSize: 12.5,
    color: "#EF4444",
    flex: 1,
    fontWeight: "600",
  },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: 38,
    zIndex: 10,
  },
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
    marginTop: 28,
  },
  supportPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#15803D",
  },
});

export default LoginScreen;
