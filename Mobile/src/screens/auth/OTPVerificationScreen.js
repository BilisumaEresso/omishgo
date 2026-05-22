import { useEffect, useState } from "react";
import { View } from "react-native";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import AppText from "../../components/common/AppText";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import { useTheme } from "../../hooks/useTheme";
import authService from "../../services/auth.service.js";
import { useAuthStore } from "../../store/auth.store.js";
import { getDeviceId } from "../../utils/deviceId.js";

const OTPVerificationScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { phone } = route.params || {};

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleVerify = async () => {
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Get device ID
      const deviceId = await getDeviceId();
      console.log("OTP_VERIFICATION_DEVICE_ID:", deviceId);

      // Confirm device move
      const result = await authService.confirmDeviceMove(phone, otp, deviceId);

      if (!result.success) {
        setError(result.message || "Invalid OTP");
        setLoading(false);
        return;
      }

      // Success - user is now logged in on new device
      // Update auth store
      useAuthStore.setState({
        user: result.data.user,
        token: result.data.token,
        isAuthenticated: true,
        error: null,
      });

      // Auto-navigate to App (handled by RootNavigator watching isAuthenticated)
      console.log("✅ Device move successful - User logged in on new device");
    } catch (err) {
      console.error("OTP verification error:", err);
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError("");

    try {
      const result = await authService.requestDeviceMove(phone);

      if (!result.success) {
        setError(result.message || "Failed to resend OTP");
        setResendLoading(false);
        return;
      }

      // Start resend timer (60 seconds)
      setResendTimer(60);
      setOtp("");
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError(err.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: theme.spacing.lg,
        }}
      >
        {/* Title */}
        <AppText
          variant="headingMd"
          color={theme.colors.textPrimary}
          style={{
            marginBottom: theme.spacing.md,
            fontWeight: "600",
          }}
        >
          Verify OTP
        </AppText>

        {/* Message */}
        <AppText
          variant="bodyMd"
          color={theme.colors.textSecondary}
          style={{
            marginBottom: theme.spacing.xl,
            lineHeight: 22,
          }}
        >
          We've sent a 6-digit code to{" "}
          <AppText
            variant="bodyMd"
            style={{ fontWeight: "600", color: theme.colors.textPrimary }}
          >
            {phone}
          </AppText>
          . Please enter it below to move your account to this device.
        </AppText>

        {/* Error message */}
        {error && (
          <AppText
            variant="caption"
            color={theme.colors.error}
            style={{
              marginBottom: theme.spacing.md,
            }}
          >
            {error}
          </AppText>
        )}

        {/* OTP Input */}
        <AppInput
          label="OTP Code"
          placeholder="000000"
          value={otp}
          onChangeText={(text) => {
            // Only allow digits
            const digitsOnly = text.replace(/[^0-9]/g, "");
            if (digitsOnly.length <= 6) {
              setOtp(digitsOnly);
              if (error) setError("");
            }
          }}
          keyboardType="number-pad"
          maxLength={6}
          error={error ? "" : undefined}
          editable={!loading}
        />

        {/* Resend section */}
        <View
          style={{
            marginTop: theme.spacing.lg,
            alignItems: "center",
          }}
        >
          <AppText variant="caption" color={theme.colors.textSecondary}>
            Didn't receive the code?
          </AppText>
          {resendTimer > 0 ? (
            <AppText
              variant="caption"
              color={theme.colors.textSecondary}
              style={{ marginTop: theme.spacing.xs }}
            >
              Resend in {resendTimer}s
            </AppText>
          ) : (
            <AppButton
              title="Resend OTP"
              onPress={handleResend}
              loading={resendLoading}
              variant="link"
              style={{ marginTop: theme.spacing.xs }}
            />
          )}
        </View>

        {/* Verify Button */}
        <AppButton
          title="Verify & Login"
          onPress={handleVerify}
          loading={loading}
          fullWidth
          style={{ marginTop: theme.spacing.xxxl }}
          disabled={otp.length !== 6 || loading}
        />

        {/* Back Button */}
        <AppButton
          title="Back to Login"
          onPress={() => navigation.navigate("Login")}
          fullWidth
          variant="outline"
          style={{ marginTop: theme.spacing.md }}
          disabled={loading}
        />
      </View>
    </ScreenWrapper>
  );
};

export default OTPVerificationScreen;
