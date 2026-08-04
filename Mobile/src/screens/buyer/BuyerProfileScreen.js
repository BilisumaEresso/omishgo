import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../../components/common/AppText";
import PublicProfileShareCard from "../../components/common/PublicProfileShareCard";
import DashboardLayout from "../../components/layout/DashBoardLayout";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";
import uploadService from "../../services/upload.service";
import { useAuthStore } from "../../store/auth.store";
import { formatNumber } from "../../utils/formatNumber";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "am", label: "አማርኛ", native: "Amharic" },
  { code: "om", label: "Afaan Oromoo", native: "Afan Oromo" },
];

export default function BuyerProfileScreen({ navigation, onSwitchTab }) {
  const { theme } = useTheme();
  const { user, logout, setLanguage, updateUser } = useAuthStore();
  const { t, i18n } = useTranslation();

  const [savedCount, setSavedCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const primaryColor = theme?.colors?.primary || "#1565C0";
  const surfaceColor = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";

  const currentLang = i18n.language || "en";
  const currentLangObj =
    LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.customId) {
        try {
          const meRes = await api.get(API_ENDPOINTS.auth.me);
          if (meRes.data?.data?.user) {
            updateUser(meRes.data.data.user);
          }
        } catch (_) {}
      }

      try {
        const savedRes = await api.get(API_ENDPOINTS.saved.list);
        const savedList = savedRes.data?.data?.products || [];
        setSavedCount(savedList.length);
      } catch (_) {}

      try {
        const ordersRes = await api.get(API_ENDPOINTS.orders.list);
        const orderList = ordersRes.data?.data?.orders || [];
        setOrdersCount(orderList.length);
        const spent = orderList.reduce(
          (acc, o) => acc + (o.totalPrice || 0),
          0,
        );
        setTotalSpent(spent);
      } catch (_) {}
    };

    fetchUserData();
  }, []);

  const launchAvatarPicker = async (source) => {
    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        t("profile.permissionRequiredTitle", { defaultValue: "Permission Required" }),
        t("profile.permissionRequiredMsg", {
          defaultValue: "Camera/Gallery access is required to update profile photo.",
        }),
      );
      return;
    }

    const pickerOptions = {
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    };

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync(pickerOptions)
        : await ImagePicker.launchImageLibraryAsync(pickerOptions);

    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    setUploadingAvatar(true);
    try {
      const res = await uploadService.uploadAvatar(asset);
      if (res.success && res.avatarUrl) {
        if (updateUser) await updateUser({ avatarUrl: res.avatarUrl });
      } else {
        Alert.alert(
          t("profile.uploadErrorTitle", { defaultValue: "Upload Error" }),
          res.message || t("profile.uploadErrorMsg", { defaultValue: "Failed to upload profile photo." }),
        );
      }
    } catch (err) {
      Alert.alert(
        t("profile.uploadErrorTitle", { defaultValue: "Upload Error" }),
        err.message || t("profile.uploadErrorMsg", { defaultValue: "Failed to upload profile photo." }),
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setUploadingAvatar(true);
    try {
      const res = await uploadService.removeAvatar();
      if (res.success) {
        if (updateUser) await updateUser({ avatarUrl: null });
      } else {
        Alert.alert(
          t("profile.removeErrorTitle", { defaultValue: "Remove Error" }),
          res.message || t("profile.removeErrorMsg", { defaultValue: "Failed to remove profile photo." }),
        );
      }
    } catch (err) {
      Alert.alert(
        t("profile.removeErrorTitle", { defaultValue: "Remove Error" }),
        err.message || t("profile.removeErrorMsg", { defaultValue: "Failed to remove profile photo." }),
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatarPress = () => {
    if (uploadingAvatar) return;
    if (user?.avatarUrl) {
      Alert.alert(
        t("profile.avatarOptionTitle", { defaultValue: "Profile Photo" }),
        t("profile.avatarOptionMsg", { defaultValue: "Choose an option to manage your profile photo:" }),
        [
          {
            text: t("profile.takePhoto", { defaultValue: "Take Photo" }),
            onPress: () => launchAvatarPicker("camera"),
          },
          {
            text: t("profile.chooseGallery", { defaultValue: "Choose from Gallery" }),
            onPress: () => launchAvatarPicker("gallery"),
          },
          {
            text: t("profile.removePhoto", { defaultValue: "Remove Photo" }),
            style: "destructive",
            onPress: handleRemoveAvatar,
          },
          {
            text: t("common.cancel", { defaultValue: "Cancel" }),
            style: "cancel",
          },
        ],
        { cancelable: true },
      );
    } else {
      Alert.alert(
        t("profile.addAvatarTitle", { defaultValue: "Add Profile Photo" }),
        t("profile.chooseSource", { defaultValue: "Choose photo source:" }),
        [
          {
            text: t("profile.takePhoto", { defaultValue: "Take Photo" }),
            onPress: () => launchAvatarPicker("camera"),
          },
          {
            text: t("profile.chooseGallery", { defaultValue: "Choose from Gallery" }),
            onPress: () => launchAvatarPicker("gallery"),
          },
          {
            text: t("common.cancel", { defaultValue: "Cancel" }),
            style: "cancel",
          },
        ],
        { cancelable: true },
      );
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t("buyerProfile.logoutAlertTitle", { defaultValue: "Sign Out" }),
      t("buyerProfile.logoutAlertMessage", {
        defaultValue: "Are you sure you want to log out of OmishGo?",
      }),
      [
        {
          text: t("common.cancel", { defaultValue: "Cancel" }),
          style: "cancel",
        },
        {
          text: t("buyerProfile.logoutAlertConfirm", {
            defaultValue: "Log Out",
          }),
          style: "destructive",
          onPress: () => logout(),
        },
      ],
    );
  };

  const handleChangeLanguage = async (code) => {
    try {
      if (setLanguage) await setLanguage(code);
      setLanguageOpen(false);
    } catch (_) {}
  };

  return (
    <DashboardLayout
      role="buyer"
      title={t("buyerProfile.title", { defaultValue: "Buyer Account" })}
      showBack={false}
    >
      {/* Profile Header Card */}
      <View
        style={[styles.profileHeaderCard, { backgroundColor: surfaceColor }]}
      >
        <TouchableOpacity
          style={[styles.avatar, { backgroundColor: primaryColor }]}
          onPress={handleAvatarPress}
          activeOpacity={0.8}
          disabled={uploadingAvatar}
        >
          {user?.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              style={styles.avatarImg}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person" size={36} color="#FFFFFF" />
          )}

          {uploadingAvatar ? (
            <View style={styles.avatarOverlay}>
              <ActivityIndicator size="small" color="#FFFFFF" />
            </View>
          ) : (
            <View style={[styles.cameraBadge, { backgroundColor: primaryColor }]}>
              <Ionicons name="camera" size={12} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>

        <AppText style={[styles.userName, { color: textPrimary }]}>
          {user?.name ||
            t("buyerProfile.fallbackName", { defaultValue: "Wholesale Buyer" })}
        </AppText>

        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark-circle" size={14} color={primaryColor} />
          <AppText style={[styles.verifiedText, { color: primaryColor }]}>
            {t("buyerProfile.statusVerified", {
              defaultValue: "Verified Procurement Partner",
            })}
          </AppText>
        </View>

        <AppText style={[styles.phoneText, { color: textSecondary }]}>
          {user?.phone ||
            t("common.unknownPhone", {
              defaultValue: "Phone Not Provided",
            })}{" "}
          •{" "}
          {[
            user?.location?.wereda,
            user?.location?.zone,
            user?.location?.region,
          ]
            .filter(Boolean)
            .join(", ") ||
            t("common.unknownLocation", {
              defaultValue: "Location Not Provided",
            })}
        </AppText>
      </View>

      {/* Account KPI Stats */}
      <View style={styles.statsRow}>
        <TouchableOpacity
          style={[styles.statBox, { backgroundColor: "#E0F2FE" }]}
          onPress={() =>
            onSwitchTab?.(t("tabs.orders", { defaultValue: "Orders" }))
          }
        >
          <AppText style={styles.statNumber}>{ordersCount}</AppText>
          <AppText style={styles.statLabel}>
            {t("tabs.orders", { defaultValue: "Orders" })}
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statBox, { backgroundColor: "#FCE7F3" }]}
          onPress={() =>
            onSwitchTab?.(t("tabs.saved", { defaultValue: "Saved" }))
          }
        >
          <AppText style={styles.statNumber}>{savedCount}</AppText>
          <AppText style={styles.statLabel}>
            {t("tabs.saved", { defaultValue: "Saved" })}
          </AppText>
        </TouchableOpacity>

        <View style={[styles.statBox, { backgroundColor: "#D1FAE5" }]}>
          <AppText style={styles.statNumber}>
            ETB {formatNumber(totalSpent)}
          </AppText>
          <AppText style={styles.statLabel}>
            {t("profile.totalSpend", { defaultValue: "Total Spend" })}
          </AppText>
        </View>
      </View>

      {/* Public Profile & QR Code Card */}
      <PublicProfileShareCard user={user} theme={theme} />

      {/* Account Settings List */}
      <View style={[styles.settingsGroup, { backgroundColor: surfaceColor }]}>
        <AppText style={styles.groupTitle}>
          {t("buyerProfile.preferencesTitle", {
            defaultValue: "Preferences & Settings",
          })}
        </AppText>

        {/* Language Selector */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => setLanguageOpen(!languageOpen)}
          activeOpacity={0.8}
        >
          <View style={styles.settingLeft}>
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: "rgba(21, 101, 192, 0.08)" },
              ]}
            >
              <Ionicons name="globe-outline" size={20} color={primaryColor} />
            </View>
            <View>
              <AppText style={styles.settingTitle}>
                {t("buyerProfile.languageLabel", {
                  defaultValue: "Language / ቋንቋ",
                })}
              </AppText>
              <AppText style={styles.settingSub}>
                {currentLangObj.label} ({currentLangObj.native})
              </AppText>
            </View>
          </View>
          <Ionicons
            name={languageOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color="#64748B"
          />
        </TouchableOpacity>

        {languageOpen && (
          <View style={styles.languageDropdown}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.langOption,
                  lang.code === currentLang && {
                    backgroundColor: primaryColor + "15",
                  },
                ]}
                onPress={() => handleChangeLanguage(lang.code)}
              >
                <AppText
                  style={[
                    styles.langText,
                    lang.code === currentLang && {
                      color: primaryColor,
                      fontWeight: "700",
                    },
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

        {/* Quick Sourcing Request Action */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation?.navigate("MarketAnalytics")}
          activeOpacity={0.8}
        >
          <View style={styles.settingLeft}>
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: "rgba(16, 185, 129, 0.1)" },
              ]}
            >
              <Ionicons name="stats-chart-outline" size={20} color="#10B981" />
            </View>
            <View>
              <AppText style={styles.settingTitle}>
                {t("profile.priceTrends", {
                  defaultValue: "Market Price Analytics",
                })}
              </AppText>
              <AppText style={styles.settingSub}>
                {t("profile.viewRegionalTrends", {
                  defaultValue: "View regional crop wholesale price trends",
                })}
              </AppText>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#64748B" />
        </TouchableOpacity>

        {/* Help & FAQs */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation?.navigate("Help")}
          activeOpacity={0.8}
        >
          <View style={styles.settingLeft}>
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: "rgba(245, 158, 11, 0.1)" },
              ]}
            >
              <Ionicons name="help-circle-outline" size={20} color="#F59E0B" />
            </View>
            <View>
              <AppText style={styles.settingTitle}>
                {t("buyerProfile.helpSupport", {
                  defaultValue: "Help & Support",
                })}
              </AppText>
              <AppText style={styles.settingSub}>
                {t("buyerProfile.helpSupportSub", {
                  defaultValue: "FAQs and contact customer service",
                })}
              </AppText>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
        activeOpacity={0.85}
      >
        <Ionicons name="log-out-outline" size={18} color="#EF4444" />
        <AppText style={styles.logoutBtnText}>
          {t("buyerProfile.signOutBtn", { defaultValue: "Sign Out Account" })}
        </AppText>
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
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    position: "relative",
    overflow: "visible",
  },
  avatarImg: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
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
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
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
    fontWeight: "700",
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
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "700",
  },
});
