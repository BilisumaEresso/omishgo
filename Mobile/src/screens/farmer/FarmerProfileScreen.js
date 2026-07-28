// Mobile/src/screens/farmer/FarmerProfileScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AppText from "../../components/common/AppText";
import DashboardLayout from "../../components/layout/DashBoardLayout";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useSidebar } from "../../context/SidebarContext";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";
import { formatNumber } from "../../utils/formatNumber";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "am", label: "አማርኛ", native: "Amharic" },
  { code: "om", label: "Afaan Oromoo", native: "Afan Oromo" },
];

export default function FarmerProfileScreen({ navigation, onSwitchTab }) {
  const { theme } = useTheme();
  const { user, logout, setLanguage } = useAuthStore();
  const { openSidebar } = useSidebar();
  const { t, i18n } = useTranslation();

  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [languageOpen, setLanguageOpen] = useState(false);

  const primaryColor = theme?.colors?.primary || "#15803D";
  const surfaceColor = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";

  const currentLang = i18n.language || "en";
  const currentLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  const fetchFarmerData = async () => {
    try {
      const prodRes = await api.get(API_ENDPOINTS.products.list, {
        params: { farmerId: user?._id || user?.id },
      });
      const prodList = prodRes.data?.data?.products || [];
      setProductsCount(prodList.length);
    } catch (_) {}

    try {
      const ordersRes = await api.get(API_ENDPOINTS.orders.list);
      const orderList = ordersRes.data?.data?.orders || [];
      setOrdersCount(orderList.length);
      const rev = orderList.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      setTotalRevenue(rev);
    } catch (_) {}
  };

  useEffect(() => {
    fetchFarmerData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFarmerData();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert(
      t("buyerProfile.logoutAlertTitle", { defaultValue: "Sign Out" }),
      t("buyerProfile.logoutAlertMessage", { defaultValue: "Are you sure you want to log out of your OmishGo producer account?" }),
      [
        { text: t("common.cancel", { defaultValue: "Cancel" }), style: "cancel" },
        { text: t("buyerProfile.logoutAlertConfirm", { defaultValue: "Log Out" }), style: "destructive", onPress: () => logout() },
      ]
    );
  };

  const handleChangeLanguage = async (code) => {
    try {
      if (setLanguage) await setLanguage(code);
      setLanguageOpen(false);
    } catch (_) {}
  };

  const handleCallSupport = () => {
    Linking.openURL("tel:0938730818");
  };

  return (
    <DashboardLayout
      role="farmer"
      title={t("farmerProfile.title", { defaultValue: "Producer Account" })}
      showMenu
      onMenuPress={openSidebar}
      showNotification
      notificationCount={0}
      onNotificationPress={() => navigation.navigate("Notifications")}
      scrollable
      contentPaddingHorizontal={14}
      navigation={navigation}
    >
      {/* Profile Header Card */}
      <View style={[styles.profileHeaderCard, { backgroundColor: surfaceColor }]}>
        <View style={[styles.avatar, { backgroundColor: primaryColor }]}>
          <Ionicons name="person" size={36} color="#FFFFFF" />
        </View>

        <AppText style={[styles.userName, { color: textPrimary }]}>
          {user?.name || t("farmerProfile.fallbackName", { defaultValue: "Verified Farmer Producer" })}
        </AppText>

        <View style={styles.verifiedBadge}>
          <Ionicons name="shield-checkmark" size={14} color={primaryColor} />
          <AppText style={[styles.verifiedText, { color: primaryColor }]}>
            {t("profile.verifiedProducer", { defaultValue: "Verified Producer Partner" })}
          </AppText>
        </View>

        <AppText style={[styles.phoneText, { color: textSecondary }]}>
          {user?.phone || t("common.unknownPhone", { defaultValue: "Phone Not Provided" })} • {[user?.location?.wereda, user?.location?.zone, user?.location?.region].filter(Boolean).join(", ") || t("common.unknownLocation", { defaultValue: "Location Not Provided" })}
        </AppText>
      </View>

      {/* Account KPI Stats */}
      <View style={styles.statsRow}>
        <TouchableOpacity
          style={[styles.statBox, { backgroundColor: "#DCFCE7" }]}
          onPress={() => onSwitchTab?.("Products")}
        >
          <AppText style={styles.statNumber}>{productsCount}</AppText>
          <AppText style={styles.statLabel}>{t("profile.myCrops", { defaultValue: "My Crops" })}</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statBox, { backgroundColor: "#EFF6FF" }]}
          onPress={() => onSwitchTab?.("Orders")}
        >
          <AppText style={styles.statNumber}>{ordersCount}</AppText>
          <AppText style={styles.statLabel}>{t("profile.salesOrders", { defaultValue: "Sales Orders" })}</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statBox, { backgroundColor: "#FEF3C7" }]}
          onPress={() => navigation?.navigate("MarketAnalytics")}
        >
          <AppText style={styles.statNumber}>
            ETB {formatNumber(totalRevenue)}
          </AppText>
          <AppText style={styles.statLabel}>{t("profile.totalSales", { defaultValue: "Total Sales" })}</AppText>
        </TouchableOpacity>
      </View>

      {/* Account Settings List */}
      <View style={[styles.settingsGroup, { backgroundColor: surfaceColor }]}>
        <AppText style={styles.groupTitle}>{t("profile.preferencesAndSettings", { defaultValue: "Preferences & Settings" })}</AppText>

        {/* Language Selector */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => setLanguageOpen(!languageOpen)}
          activeOpacity={0.8}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.iconWrap, { backgroundColor: "rgba(21, 128, 61, 0.1)" }]}>
              <Ionicons name="globe-outline" size={20} color={primaryColor} />
            </View>
            <View>
              <AppText style={styles.settingTitle}>{t("buyerProfile.languageLabel", { defaultValue: "Language / ቋንቋ" })}</AppText>
              <AppText style={styles.settingSub}>{currentLangObj.label} ({currentLangObj.native})</AppText>
            </View>
          </View>
          <Ionicons name={languageOpen ? "chevron-up" : "chevron-down"} size={18} color="#64748B" />
        </TouchableOpacity>

        {languageOpen && (
          <View style={styles.languageDropdown}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.langOption,
                  lang.code === currentLang && { backgroundColor: primaryColor + "15" },
                ]}
                onPress={() => handleChangeLanguage(lang.code)}
              >
                <AppText
                  style={[
                    styles.langText,
                    lang.code === currentLang && { color: primaryColor, fontWeight: "700" },
                  ]}
                >
                  {lang.label} ({lang.native})
                </AppText>
                {lang.code === currentLang && (
                  <Ionicons name="checkmark" size={16} color={primaryColor} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Market Price Analytics Link */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation?.navigate("MarketAnalytics")}
          activeOpacity={0.8}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.iconWrap, { backgroundColor: "rgba(16, 185, 129, 0.1)" }]}>
              <Ionicons name="stats-chart-outline" size={20} color="#16A34A" />
            </View>
            <View>
              <AppText style={styles.settingTitle}>{t("profile.marketPriceIndex", { defaultValue: "Market Price Index" })}</AppText>
              <AppText style={styles.settingSub}>{t("profile.marketPriceIndexSub", { defaultValue: "View national commodity wholesale rates" })}</AppText>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#64748B" />
        </TouchableOpacity>

        {/* Help & Support */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleCallSupport}
          activeOpacity={0.8}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.iconWrap, { backgroundColor: "rgba(245, 158, 11, 0.1)" }]}>
              <Ionicons name="call-outline" size={20} color="#D97706" />
            </View>
            <View>
              <AppText style={styles.settingTitle}>{t("profile.producerSupport", { defaultValue: "Producer Support & Help" })}</AppText>
              <AppText style={styles.settingSub}>{t("profile.callSupportSub", { defaultValue: "Call official support (0938730818)" })}</AppText>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
        activeOpacity={0.85}
      >
        <Ionicons name="log-out-outline" size={18} color="#DC2626" />
        <AppText style={styles.logoutBtnText}>{t("appSidebar.logout", { defaultValue: "Sign Out Account" })}</AppText>
      </TouchableOpacity>

      <View style={{ height: 80 }} />
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  profileHeaderCard: {
    alignItems: "center",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: "800",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
    marginBottom: 6,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: "700",
  },
  phoneText: {
    fontSize: 13,
    color: "#64748B",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  statNumber: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    marginTop: 2,
  },
  settingsGroup: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  settingSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 1,
  },
  languageDropdown: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 8,
    marginVertical: 8,
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
    color: "#334155",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  logoutBtnText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "800",
  },
});
