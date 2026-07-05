import { useState } from "react";
import { Pressable, View } from "react-native";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import AppText from "../../components/common/AppText";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AuthLayout from "../../components/layout/AuthLayout";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store.js";

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { login } = useAuthStore();

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!pin.trim()) {
      newErrors.pin = "PIN is required";
    } else if (!/^\d{4,6}$/.test(pin)) {
      newErrors.pin = "PIN must be between 4 and 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

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
      // On success: auth store updates isAuthenticated, RootNavigator handles navigation
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ submit: error.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <AuthLayout title="Welcome Back" subtitle="Login to your account">
        <View style={{ marginTop: theme.spacing.lg }}>
          {errors.submit && (
            <AppText
              variant="caption"
              color={theme.colors.error}
              style={{ marginBottom: theme.spacing.md }}
            >
              {errors.submit}
            </AppText>
          )}

          <AppInput
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (errors.phone) {
                setErrors({ ...errors, phone: "" });
              }
            }}
            keyboardType="phone-pad"
            error={errors.phone}
          />

          <AppInput
            label="Enter PIN"
            placeholder="Enter your PIN"
            value={pin}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, "");
              setPin(numericText);
              if (errors.pin) {
                setErrors({ ...errors, pin: "" });
              }
            }}
            keyboardType="number-pad"
            secureTextEntry
            error={errors.pin}
          />

          <AppButton
            title="Login"
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
              Don't have an account?{" "}
            </AppText>
            <Pressable
              onPress={() => {
                navigation.navigate("Register");
              }}
            >
              <AppText
                variant="bodyMd"
                color={theme.colors.primary}
                style={{ fontWeight: "600" }}
              >
                Register
              </AppText>
            </Pressable>
          </View>
        </View>
      </AuthLayout>
    </ScreenWrapper>
  );
};

export default LoginScreen;
