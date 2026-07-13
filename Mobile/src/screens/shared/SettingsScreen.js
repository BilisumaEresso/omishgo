// Mobile/src/screens/shared/SettingsScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

// ── Mock settings state (not wired to API — display only) ────────────────
const SettingsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuthStore();

  const primary = theme?.colors?.primary || "#2E7D32";
  const primaryCont = theme?.colors?.primaryContainer || "#E8F5E9";
  const textPrimary = theme?.colors?.textPrimary || "#1A2E1A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6741";
  const textMuted = theme?.colors?.textMuted || "#8FAF8A";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const background = theme?.colors?.background || "#F9FBF9";
  const border = theme?.colors?.border || "#D0E8CE";
  const error = theme?.colors?.error || "#C62828";

  // ── Local toggle states (mock — no API) ────────────────────────────────
  const [pushNotifications, setPushNotifications] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [locationAccess, setLocationAccess] = useState(true);

  const handleComingSoon = (feature) =>
    Alert.alert(
      "Coming Soon",
      `${feature} will be available in a future update.`,
    );

  // ── Reusable row components ────────────────────────────────────────────
  const SectionTitle = ({ title }) => (
    <AppText style={[styles.sectionTitle, { color: textMuted }]}>
      {title}
    </AppText>
  );

  const ToggleRow = ({ icon, label, subtitle, value, onToggle }) => (
    <View
      style={[
        styles.row,
        { backgroundColor: surface, borderBottomColor: border },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: primaryCont }]}>
        <Ionicons name={icon} size={18} color={primary} />
      </View>
      <View style={styles.rowText}>
        <AppText style={[styles.rowLabel, { color: textPrimary }]}>
          {label}
        </AppText>
        {subtitle && (
          <AppText style={[styles.rowSubtitle, { color: textMuted }]}>
            {subtitle}
          </AppText>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: border, true: primary + "80" }}
        thumbColor={value ? primary : "#ccc"}
        ios_backgroundColor={border}
      />
    </View>
  );

  const TapRow = ({ icon, label, subtitle, onPress, danger }) => (
    <TouchableOpacity
      style={[
        styles.row,
        { backgroundColor: surface, borderBottomColor: border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: danger ? "#FFEBEE" : primaryCont },
        ]}
      >
        <Ionicons name={icon} size={18} color={danger ? error : primary} />
      </View>
      <View style={styles.rowText}>
        <AppText
          style={[styles.rowLabel, { color: danger ? error : textPrimary }]}
        >
          {label}
        </AppText>
        {subtitle && (
          <AppText style={[styles.rowSubtitle, { color: textMuted }]}>
            {subtitle}
          </AppText>
        )}
      </View>
      <Ionicons name="chevron-forward" size={16} color={textMuted} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.root, { backgroundColor: background }]}>
      <AppHeader
        title="Settings"
        showBack={true}
        onBackPress={() => navigation?.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── NOTIFICATIONS ─────────────────────────────────────────── */}
        <SectionTitle title="NOTIFICATIONS" />
        <View style={[styles.card, { borderColor: border }]}>
          <ToggleRow
            icon="notifications-outline"
            label="Push Notifications"
            subtitle="Receive alerts on your device"
            value={pushNotifications}
            onToggle={setPushNotifications}
          />
          <ToggleRow
            icon="chatbubbles-outline"
            label="Message Alerts"
            subtitle="New message from buyer or farmer"
            value={messageAlerts}
            onToggle={setMessageAlerts}
          />
          <ToggleRow
            icon="receipt-outline"
            label="Order Updates"
            subtitle="Status changes on your orders"
            value={orderUpdates}
            onToggle={setOrderUpdates}
          />
          <ToggleRow
            icon="trending-up-outline"
            label="Market Price Alerts"
            subtitle="When crop prices change significantly"
            value={priceAlerts}
            onToggle={setPriceAlerts}
          />
        </View>

        {/* ── APPEARANCE ────────────────────────────────────────────── */}
        <SectionTitle title="APPEARANCE" />
        <View style={[styles.card, { borderColor: border }]}>
          <ToggleRow
            icon="moon-outline"
            label="Dark Mode"
            subtitle="Coming soon"
            value={darkMode}
            onToggle={() => handleComingSoon("Dark mode")}
          />
          <TapRow
            icon="language-outline"
            label="Language"
            subtitle="Change app language"
            onPress={() => handleComingSoon("Language change from settings")}
          />
          <TapRow
            icon="text-outline"
            label="Font Size"
            subtitle="Adjust text size for readability"
            onPress={() => handleComingSoon("Font size")}
          />
        </View>

        {/* ── PRIVACY & SECURITY ────────────────────────────────────── */}
        <SectionTitle title="PRIVACY & SECURITY" />
        <View style={[styles.card, { borderColor: border }]}>
          <ToggleRow
            icon="location-outline"
            label="Location Access"
            subtitle="Used for nearby farmers and buyers"
            value={locationAccess}
            onToggle={setLocationAccess}
          />
          <TapRow
            icon="lock-closed-outline"
            label="Change PIN"
            subtitle="Update your login PIN"
            onPress={() => handleComingSoon("Change PIN")}
          />
          <TapRow
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            onPress={() => handleComingSoon("Privacy policy")}
          />
        </View>

        {/* ── ACCOUNT ───────────────────────────────────────────────── */}
        <SectionTitle title="ACCOUNT" />
        <View style={[styles.card, { borderColor: border }]}>
          <TapRow
            icon="person-outline"
            label="Edit Profile"
            subtitle="Update name, phone, and location"
            onPress={() => handleComingSoon("Edit profile")}
          />
          <TapRow
            icon="cloud-download-outline"
            label="Export My Data"
            subtitle="Download your account data"
            onPress={() => handleComingSoon("Data export")}
          />
          <TapRow
            icon="trash-outline"
            label="Delete Account"
            subtitle="Permanently remove your account"
            onPress={() =>
              Alert.alert(
                "Delete Account",
                "This will permanently delete your account and all your data. This cannot be undone.",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => handleComingSoon("Account deletion"),
                  },
                ],
              )
            }
            danger
          />
        </View>

        {/* ── ABOUT ─────────────────────────────────────────────────── */}
        <SectionTitle title="ABOUT" />
        <View style={[styles.card, { borderColor: border }]}>
          <TapRow
            icon="information-circle-outline"
            label="About OmishGo"
            subtitle="Version 1.0 MVP"
            onPress={() =>
              Alert.alert(
                "OmishGo",
                "Version 1.0 MVP\n\nBuilt for Ethiopian farmers and buyers.\n\nFarm · Market · Deliver",
              )
            }
          />
          <TapRow
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => navigation?.navigate("Help")}
          />
          <TapRow
            icon="star-outline"
            label="Rate the App"
            onPress={() => handleComingSoon("App rating")}
          />
        </View>

        {/* ── Version info ──────────────────────────────────────────── */}
        <AppText style={[styles.version, { color: textMuted }]}>
          OmishGo v1.0 ·{" "}
          {user?.role
            ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
            : ""}{" "}
          account
        </AppText>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 8 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 6,
    marginLeft: 4,
  },
  card: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 15, fontWeight: "500" },
  rowSubtitle: { fontSize: 12, marginTop: 1 },
  version: { textAlign: "center", fontSize: 12, marginTop: 24 },
});

export default SettingsScreen;
