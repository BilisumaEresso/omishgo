// Mobile/src/screens/shared/SettingsScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Alert, StyleSheet, Switch, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import AppText from "../../components/common/AppText";
import DashboardLayout from "../../components/layout/DashBoardLayout";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

const SettingsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user } = useAuthStore();

  const primary = theme?.colors?.primary || "#1565C0";
  const primaryCont = theme?.colors?.primaryContainer || "#E3F2FD";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textMuted = theme?.colors?.textMuted || "#94A3B8";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#E2E8F0";
  const error = theme?.colors?.error || "#DC2626";

  const [pushNotifications, setPushNotifications] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [locationAccess, setLocationAccess] = useState(true);

  const handleComingSoon = (feature) =>
    Alert.alert(t("settingsScreen.comingSoonTitle"), t("settingsScreen.comingSoonMessage", { feature }));

  const SectionTitle = ({ title }) => (
    <AppText style={[styles.sectionTitle, { color: textMuted }]}>{title}</AppText>
  );

  const ToggleRow = ({ icon, label, subtitle, value, onToggle, isLast }) => (
    <View
      style={[
        styles.row,
        { backgroundColor: surface },
        !isLast && styles.rowBorder,
        !isLast && { borderBottomColor: border },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: primaryCont }]}>
        <Ionicons name={icon} size={18} color={primary} />
      </View>
      <View style={styles.rowText}>
        <AppText style={[styles.rowLabel, { color: textPrimary }]}>{label}</AppText>
        {subtitle && <AppText style={[styles.rowSubtitle, { color: textMuted }]}>{subtitle}</AppText>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: border, true: primary + "60" }}
        thumbColor={value ? primary : "#CBD5E1"}
        ios_backgroundColor={border}
      />
    </View>
  );

  const TapRow = ({ icon, label, subtitle, onPress, danger, isLast }) => (
    <TouchableOpacity
      style={[
        styles.row,
        { backgroundColor: surface },
        !isLast && styles.rowBorder,
        !isLast && { borderBottomColor: border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconCircle, { backgroundColor: danger ? "#FEF2F2" : primaryCont }]}>
        <Ionicons name={icon} size={18} color={danger ? error : primary} />
      </View>
      <View style={styles.rowText}>
        <AppText style={[styles.rowLabel, { color: danger ? error : textPrimary }]}>{label}</AppText>
        {subtitle && <AppText style={[styles.rowSubtitle, { color: textMuted }]}>{subtitle}</AppText>}
      </View>
      <Ionicons name="chevron-forward" size={16} color={textMuted} />
    </TouchableOpacity>
  );

  const Card = ({ children }) => (
    <View style={[styles.card, { borderColor: border }]}>{children}</View>
  );

  return (
    <DashboardLayout
      role={user?.role || "buyer"}
      title={t("settingsScreen.title")}
      showBack
      onBackPress={() => navigation?.goBack()}
    >
      {/* NOTIFICATIONS */}
      <SectionTitle title={t("settingsScreen.sectionNotifications")} />
      <Card>
        <ToggleRow icon="notifications-outline" label={t("settingsScreen.pushNotifications")} subtitle={t("settingsScreen.pushNotificationsSubtitle")} value={pushNotifications} onToggle={setPushNotifications} />
        <ToggleRow icon="chatbubbles-outline" label={t("settingsScreen.messageAlerts")} subtitle={t("settingsScreen.messageAlertsSubtitle")} value={messageAlerts} onToggle={setMessageAlerts} />
        <ToggleRow icon="receipt-outline" label={t("settingsScreen.orderUpdates")} subtitle={t("settingsScreen.orderUpdatesSubtitle")} value={orderUpdates} onToggle={setOrderUpdates} />
        <ToggleRow icon="trending-up-outline" label={t("settingsScreen.marketPriceAlerts")} subtitle={t("settingsScreen.marketPriceAlertsSubtitle")} value={priceAlerts} onToggle={setPriceAlerts} isLast />
      </Card>

      {/* APPEARANCE */}
      <SectionTitle title={t("settingsScreen.sectionAppearance")} />
      <Card>
        <ToggleRow icon="moon-outline" label={t("settingsScreen.darkMode")} subtitle={t("settingsScreen.comingSoon")} value={darkMode} onToggle={() => handleComingSoon(t("settingsScreen.darkMode"))} />
        <TapRow icon="language-outline" label={t("settingsScreen.language")} subtitle={t("settingsScreen.languageSubtitle")} onPress={() => handleComingSoon(t("settingsScreen.languageChangeFromSettings"))} />
        <TapRow icon="text-outline" label={t("settingsScreen.fontSize")} subtitle={t("settingsScreen.fontSizeSubtitle")} onPress={() => handleComingSoon(t("settingsScreen.fontSize"))} isLast />
      </Card>

      {/* PRIVACY */}
      <SectionTitle title={t("settingsScreen.sectionPrivacy")} />
      <Card>
        <ToggleRow icon="location-outline" label={t("settingsScreen.locationAccess")} subtitle={t("settingsScreen.locationAccessSubtitle")} value={locationAccess} onToggle={setLocationAccess} />
        <TapRow icon="lock-closed-outline" label={t("settingsScreen.changePin")} subtitle={t("settingsScreen.changePinSubtitle")} onPress={() => handleComingSoon(t("settingsScreen.changePin"))} />
        <TapRow icon="shield-checkmark-outline" label={t("settingsScreen.privacyPolicy")} onPress={() => handleComingSoon(t("settingsScreen.privacyPolicy"))} isLast />
      </Card>

      {/* ACCOUNT */}
      <SectionTitle title={t("settingsScreen.sectionAccount")} />
      <Card>
        <TapRow icon="person-outline" label={t("settingsScreen.editProfile")} subtitle={t("settingsScreen.editProfileSubtitle")} onPress={() => handleComingSoon(t("settingsScreen.editProfile"))} />
        <TapRow icon="cloud-download-outline" label={t("settingsScreen.exportMyData")} subtitle={t("settingsScreen.exportMyDataSubtitle")} onPress={() => handleComingSoon(t("settingsScreen.exportMyData"))} />
        <TapRow
          icon="trash-outline"
          label={t("settingsScreen.deleteAccount")}
          subtitle={t("settingsScreen.deleteAccountSubtitle")}
          onPress={() =>
            Alert.alert(
              t("settingsScreen.deleteAccountAlertTitle"),
              t("settingsScreen.deleteAccountAlertMessage"),
              [
                { text: t("settingsScreen.cancel"), style: "cancel" },
                { text: t("settingsScreen.delete"), style: "destructive", onPress: () => handleComingSoon(t("settingsScreen.accountDeletion")) },
              ]
            )
          }
          danger
          isLast
        />
      </Card>

      {/* ABOUT */}
      <SectionTitle title={t("settingsScreen.sectionAbout")} />
      <Card>
        <TapRow icon="information-circle-outline" label={t("settingsScreen.aboutOmishGo")} subtitle={t("settingsScreen.versionSubtitle")} onPress={() => Alert.alert(t("settingsScreen.aboutOmishGoAlertTitle"), t("settingsScreen.aboutOmishGoAlertMessage"))} />
        <TapRow icon="help-circle-outline" label={t("settingsScreen.helpAndSupport")} onPress={() => navigation?.navigate("Help")} />
        <TapRow icon="star-outline" label={t("settingsScreen.rateTheApp")} onPress={() => handleComingSoon(t("settingsScreen.rateTheApp"))} isLast />
      </Card>

      <AppText style={[styles.version, { color: textMuted }]}>
        {t("settingsScreen.versionWithRole", {
          role: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "",
        })}
      </AppText>

      <View style={{ height: 40 }} />
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 15, fontWeight: "500" },
  rowSubtitle: { fontSize: 12, marginTop: 1 },
  version: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 24,
  },
});

export default SettingsScreen;