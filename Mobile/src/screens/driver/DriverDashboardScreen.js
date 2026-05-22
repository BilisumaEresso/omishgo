import { ScrollView, View } from "react-native";
import AppButton from "../../components/common/AppButton";
import AppCard from "../../components/common/AppCard";
import AppText from "../../components/common/AppText";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import { ROLES } from "../../constants/roles";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store.js";

const StatCard = ({ label, value, theme }) => (
  <AppCard
    style={{
      flex: 1,
      alignItems: "center",
      paddingVertical: theme.spacing.md,
    }}
  >
    <AppText
      variant="caption"
      color={theme.colors.textSecondary}
      style={{ marginBottom: theme.spacing.sm }}
    >
      {label}
    </AppText>
    <AppText variant="headingMd" color={theme.colors.primary}>
      {value}
    </AppText>
  </AppCard>
);

const ActionButton = ({ label, theme }) => (
  <AppCard
    style={{
      flex: 1,
      paddingVertical: theme.spacing.lg,
      alignItems: "center",
    }}
  >
    <AppText
      variant="label"
      color={theme.colors.textPrimary}
      style={{ textAlign: "center" }}
    >
      {label}
    </AppText>
  </AppCard>
);

const DriverDashboardScreen = () => {
  const { theme } = useTheme();
  const { logout } = useAuthStore();

  return (
    <ScreenWrapper scrollable>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ marginBottom: theme.spacing.xxxl }}>
          <AppText
            variant="bodyMd"
            color={theme.colors.textSecondary}
            style={{ marginBottom: theme.spacing.sm }}
          >
            Welcome Back 👋
          </AppText>
          <AppText variant="displayLg" color={theme.colors.textPrimary}>
            Billy
          </AppText>
          <AppText
            variant="label"
            color={theme.colors.primary}
            style={{ marginTop: theme.spacing.sm }}
          >
            {ROLES.DRIVER}
          </AppText>
        </View>

        {/* Stats Section */}
        <View style={{ marginBottom: theme.spacing.xxxl }}>
          <AppText
            variant="headingSm"
            color={theme.colors.textPrimary}
            style={{ marginBottom: theme.spacing.lg }}
          >
            Your Stats
          </AppText>
          <View style={{ gap: theme.spacing.md }}>
            <StatCard label="Deliveries" value="28" theme={theme} />
            <StatCard label="Trips" value="6" theme={theme} />
            <StatCard label="Distance" value="187 km" theme={theme} />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ marginBottom: theme.spacing.xxxl }}>
          <AppText
            variant="headingSm"
            color={theme.colors.textPrimary}
            style={{ marginBottom: theme.spacing.lg }}
          >
            Quick Actions
          </AppText>
          <View style={{ gap: theme.spacing.md }}>
            <ActionButton label="My Route" theme={theme} />
            <ActionButton label="Active Tasks" theme={theme} />
            <ActionButton label="Delivery History" theme={theme} />
          </View>
        </View>

        {/* Coming Soon */}
        <View style={{ marginBottom: theme.spacing.xxxl }}>
          <AppCard
            style={{
              alignItems: "center",
              paddingVertical: theme.spacing.xl,
              backgroundColor: theme.colors.primaryContainer,
            }}
          >
            <AppText
              variant="headingSm"
              color={theme.colors.primary}
              style={{ marginBottom: theme.spacing.md }}
            >
              More Features Coming Soon
            </AppText>
            <AppText
              variant="bodyMd"
              color={theme.colors.textSecondary}
              style={{ textAlign: "center" }}
            >
              We're adding real-time route optimization and navigation.
            </AppText>
          </AppCard>
          {/* Logout */}
          <AppButton
            title="Logout"
            onPress={logout}
            variant="danger"
            fullWidth
            style={{ marginBottom: theme.spacing.lg }}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default DriverDashboardScreen;
