import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Alert, Modal, StyleSheet, Switch, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import AppText from "../../components/common/AppText";
import PublicProfileShareCard from "../../components/common/PublicProfileShareCard";
import DashboardLayout from "../../components/layout/DashBoardLayout";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "am", label: "አማርኛ", native: "Amharic" },
  { code: "om", label: "Afaan Oromoo", native: "Afan Oromo" },
];

const SettingsScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { user, setLanguage } = useAuthStore();

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
  const [languageOpen, setLanguageOpen] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);

  const currentLang = i18n.language || "en";
  const currentLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

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

  const TapRow = ({ icon, label, subtitle, onPress, danger, isLast, rightElement }) => (
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
      {rightElement || <Ionicons name="chevron-forward" size={16} color={textMuted} />}
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
        <TapRow
          icon="language-outline"
          label={t("settingsScreen.language")}
          subtitle={`${currentLangObj.label} (${currentLangObj.native})`}
          onPress={() => setLanguageOpen(!languageOpen)}
          rightElement={<Ionicons name={languageOpen ? "chevron-up" : "chevron-down"} size={16} color={textMuted} />}
        />
        {languageOpen && (
          <View style={[styles.languageDropdown, { backgroundColor: surface, borderBottomWidth: 1, borderBottomColor: border }]}>
            {LANGUAGES.map((lang) => {
              const active = currentLang === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.langOption,
                    active && { backgroundColor: primary + "14" },
                  ]}
                  onPress={() => {
                    if (setLanguage) setLanguage(lang.code);
                    setLanguageOpen(false);
                  }}
                >
                  <AppText
                    style={[
                      styles.langText,
                      { color: active ? primary : textPrimary, fontWeight: active ? "700" : "500" },
                    ]}
                  >
                    {lang.label} ({lang.native})
                  </AppText>
                  {active && <Ionicons name="checkmark" size={16} color={primary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        <TapRow icon="text-outline" label={t("settingsScreen.fontSize")} subtitle={t("settingsScreen.fontSizeSubtitle")} onPress={() => handleComingSoon(t("settingsScreen.fontSize"))} isLast />
      </Card>

      {/* PRIVACY */}
      <SectionTitle title={t("settingsScreen.sectionPrivacy")} />
      <Card>
        <ToggleRow icon="location-outline" label={t("settingsScreen.locationAccess")} subtitle={t("settingsScreen.locationAccessSubtitle")} value={locationAccess} onToggle={setLocationAccess} />
        <TapRow icon="lock-closed-outline" label={t("settingsScreen.changePin")} subtitle={t("settingsScreen.changePinSubtitle")} onPress={() => handleComingSoon(t("settingsScreen.changePin"))} />
        <TapRow icon="shield-checkmark-outline" label={t("settingsScreen.privacyPolicy")} onPress={() => handleComingSoon(t("settingsScreen.privacyPolicy"))} isLast />
      </Card>

      {/* PUBLIC PROFILE */}
      <SectionTitle title={t("settingsScreen.sectionPublicProfile", { defaultValue: "Public Profile" })} />
      <Card>
        <View style={[styles.row, { backgroundColor: surface, borderBottomWidth: 1, borderBottomColor: border }]}>
          <View style={[styles.iconCircle, { backgroundColor: primaryCont }]}>
            <Ionicons name="globe-outline" size={18} color={primary} />
          </View>
          <View style={styles.rowText}>
            <AppText style={[styles.rowLabel, { color: textPrimary, fontWeight: "700" }]}>
              {t("settingsScreen.publicProfileExplanationTitle", { defaultValue: "Public Profile Info" })}
            </AppText>
            <AppText style={[styles.rowSubtitle, { color: textMuted, lineHeight: 18, marginTop: 4 }]}>
              {t("settingsScreen.publicProfileExplanation", {
                defaultValue:
                  "Your profile (name, verified status, location region/zone, activity — not your phone number) can be viewed publicly via a shareable link, for buyers/farmers to check before dealing with you.",
              })}
            </AppText>
          </View>
        </View>
        <TapRow
          icon="share-social-outline"
          label={t("settingsScreen.viewSharePublicProfile", { defaultValue: "View & Share My Public Profile" })}
          subtitle={t("settingsScreen.viewSharePublicProfileSub", { defaultValue: "Shareable public link & QR code" })}
          onPress={() => setQrModalVisible(true)}
          isLast
        />
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

      {/* Public Profile Share Modal */}
      <Modal
        visible={qrModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: surface }]}>
            <View style={styles.modalHeader}>
              <AppText style={[styles.modalTitle, { color: textPrimary }]}>
                {t("profile.publicProfileModalTitle", { defaultValue: "Public Profile & QR Code" })}
              </AppText>
              <TouchableOpacity onPress={() => setQrModalVisible(false)} style={{ padding: 4 }}>
                <Ionicons name="close" size={24} color={textMuted} />
              </TouchableOpacity>
            </View>

            <PublicProfileShareCard user={user} theme={theme} />
          </View>
        </View>
      </Modal>
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
  languageDropdown: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 4,
  },
  langOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 10,
  },
  langText: {
    fontSize: 13,
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
});

export default SettingsScreen;