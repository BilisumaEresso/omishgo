import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { View } from "react-native";
import AppButton from "../../components/common/AppButton";
import AppText from "../../components/common/AppText";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import { useTheme } from "../../hooks/useTheme";
import authService from "../../services/auth.service.js";

const DeviceBlockedScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { phone } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMoveAccount = async () => {
    if (!phone) {
      setError("Phone number is missing");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await authService.requestDeviceMove(phone);

      if (!result.success) {
        setError(result.message || "Failed to send OTP");
        setLoading(false);
        return;
      }

      // Navigate to OTP verification screen
      navigation.replace("OTPVerification", { phone });
    } catch (err) {
      console.error("Device move error:", err);
      setError(err.message || "Failed to send OTP");
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: theme.spacing.lg,
        }}
      >
        {/* Icon */}
        <MaterialCommunityIcons
          name="phone-lock"
          size={80}
          color={theme?.colors?.error}
          style={{ marginBottom: theme.spacing.xl }}
        />

        {/* Title */}
        <AppText
          variant="headingMd"
          color={theme?.colors?.textPrimary}
          style={{
            textAlign: "center",
            marginBottom: theme.spacing.md,
            fontWeight: "600",
          }}
        >
          Account Already in Use
        </AppText>

        {/* Message */}
        <AppText
          variant="bodyMd"
          color={theme?.colors?.textSecondary}
          style={{
            textAlign: "center",
            marginBottom: theme.spacing.xl,
            lineHeight: 22,
          }}
        >
          This account is currently active on another device. To use it on this
          device, you'll need to verify with an OTP sent to your phone.
        </AppText>

        {/* Error message */}
        {error && (
          <AppText
            variant="caption"
            color={theme?.colors?.error}
            style={{
              textAlign: "center",
              marginBottom: theme.spacing.md,
            }}
          >
            {error}
          </AppText>
        )}

        {/* Buttons */}
        <View
          style={{
            width: "100%",
            gap: theme.spacing.md,
            marginTop: theme.spacing.xl,
          }}
        >
          <AppButton
            title="Move Account to This Device"
            onPress={handleMoveAccount}
            loading={loading}
            fullWidth
            variant="primary"
          />

          <AppButton
            title="Cancel"
            onPress={() => navigation.goBack()}
            fullWidth
            variant="outline"
            disabled={loading}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default DeviceBlockedScreen;
