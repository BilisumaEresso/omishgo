// Mobile/src/screens/buyer/BuyerProfileScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import api from "../../config/api";
import { useSidebar } from "../../context/SidebarContext";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";
import { API_ENDPOINTS } from "../../constants/api";
const LANGUAGES = [{
  code: "en",
  label: "English",
  native: "English"
}, {
  code: "am",
  label: "አማርኛ",
  native: "Amharic"
}, {
  code: "om",
  label: "Afaan Oromoo",
  native: "Afan Oromo"
}];
const BuyerProfileScreen = ({
  navigation,
  onSwitchTab
}) => {
  const {
    theme
  } = useTheme();
  const {
    user,
    logout,
    setLanguage
  } = useAuthStore();
  const {
    openSidebar
  } = useSidebar();
  const {
    t,
    i18n
  } = useTranslation();
  const [languageOpen, setLanguageOpen] = useState(false);
  const [updatingLang, setUpdatingLang] = useState(false);
  const [saved, setSaved] = useState([]);
  const [orders, setOrders] = useState([]);
  const primary = theme?.colors?.primary || "#1565C0";
  const primaryContainer = theme?.colors?.primaryContainer || "#E3F2FD";
  const textPrimary = theme?.colors?.textPrimary || "#0D1B2A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6080";
  const textMuted = theme?.colors?.textMuted || "#8FA3BE";
  const background = theme?.colors?.background || "#F5F8FF";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#D0DEF5";
  const errorColor = theme?.colors?.error || "#C62828";
  const successColor = theme?.colors?.success || "#2E7D32";

  // KPI data
  const activeOrders = orders.length;
  const savedItems = saved.length;
  const spentAmount = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  const currentLang = i18n.language || "en";
  const currentLangLabel = LANGUAGES.find(l => l.code === currentLang)?.native || "English";
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await api.get(API_ENDPOINTS.saved.list);
        const fetched = res.data?.data?.products || [];
        setSaved(fetched);
      } catch (err) {
        console.warn("Failed to load saved:", err.message);
      }
    };
    fetchSaved();
    const fetchOrders = async () => {
      try {
        const res = await api.get(API_ENDPOINTS.orders.list);
        const fetched = res.data?.data?.orders || [];
        setOrders(fetched);
      } catch (err) {
        console.warn("Failed to load orders:", err.message);
      }
    };
    fetchOrders();
  });
  const getLanguageName = code => {
    switch (code) {
      case "am":
        return "Amharic";
      case "om":
        return "Afan Oromo";
      case "en":
      default:
        return "English";
    }
  };
  const handleLogout = () => {
    Alert.alert(t("buyerProfile.logoutAlertTitle"), t("buyerProfile.logoutAlertMessage"), [{
      text: t("buyerProfile.logoutAlertCancel"),
      style: "cancel"
    }, {
      text: t("buyerProfile.logoutAlertConfirm"),
      style: "destructive",
      onPress: () => logout()
    }]);
  };
  const handleChangeLanguage = async code => {
    if (code === currentLang || updatingLang) return;
    setUpdatingLang(true);
    try {
      await i18n.changeLanguage(code);
      if (setLanguage) setLanguage(code);
      api.patch("/api/v1/auth/me/language", {
        preferredLang: code
      }).catch(() => {});
    } catch (err) {
      console.warn("Language change failed:", err);
    } finally {
      setUpdatingLang(false);
      setLanguageOpen(false);
    }
  };
  const userName = user?.name || t("buyerProfile.fallbackName");
  const phone = user?.phone || "+251 900 000000";
  const location = user?.location || {
    region: "Addis Ababa",
    zone: "Bole"
  };
  const isVerified = user?.isVerified ?? true;
  return <View style={[styles.screen, {
    backgroundColor: background
  }]}>
      <AppHeader title={t("buyerProfile.title")} showMenu showNotification notificationCount={0} onMenuPress={openSidebar} onNotificationPress={() => navigation.navigate("Notifications")} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Hero */}
        <View style={styles.heroSection}>
          <View style={[styles.avatar, {
          backgroundColor: primary
        }]}>
            <Ionicons name="person" size={40} color="#FFFFFF" />
          </View>
          <AppText style={[styles.name, {
          color: textPrimary
        }]}>
            {userName}
          </AppText>
          <View style={[styles.rolePill, {
          backgroundColor: primaryContainer
        }]}>
            <AppText style={[styles.roleText, {
            color: primary
          }]}>
              {t("buyerProfile.roleBuyer")}
            </AppText>
          </View>
          <AppText style={[styles.phoneNumber, {
          color: textSecondary
        }]}>
            {phone}
          </AppText>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, {
          backgroundColor: surface
        }]}>
            <AppText style={[styles.statValue, {
            color: textPrimary
          }]}>
              {activeOrders}
            </AppText>
            <AppText style={[styles.statLabel, {
            color: textSecondary
          }]}>
              {t("buyerProfile.statsOrders")}
            </AppText>
          </View>
          <View style={[styles.statCard, {
          backgroundColor: surface
        }]}>
            <AppText style={[styles.statValue, {
            color: textPrimary
          }]}>
              {saved.length}
            </AppText>
            <AppText style={[styles.statLabel, {
            color: textSecondary
          }]}>
              {t("buyerProfile.statsSaved")}
            </AppText>
          </View>
          <View style={[styles.statCard, {
          backgroundColor: surface
        }]}>
            <AppText style={[styles.statValue, {
            color: textPrimary
          }]}>
              {t("buyerProfile.spentAmount", {
              amount: spentAmount
            })}
            </AppText>
            <AppText style={[styles.statLabel, {
            color: textSecondary
          }]}>
              {t("buyerProfile.statsSpent")}
            </AppText>
          </View>
        </View>

        {/* Account Info Section */}
        <AppText style={[styles.sectionTitle, {
        color: textPrimary
      }]}>
          {t("buyerProfile.sectionAccountInfo")}
        </AppText>
        <View style={[styles.infoCard, {
        backgroundColor: surface
      }]}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color={textSecondary} />
            <View style={styles.infoTextContainer}>
              <AppText style={[styles.infoLabel, {
              color: textMuted
            }]}>
                {t("buyerProfile.infoLocation")}
              </AppText>
              <AppText style={[styles.infoValue, {
              color: textPrimary
            }]}>
                {location.region}, {location.zone}
              </AppText>
            </View>
          </View>
          <View style={[styles.divider, {
          backgroundColor: border
        }]} />
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color={textSecondary} />
            <View style={styles.infoTextContainer}>
              <AppText style={[styles.infoLabel, {
              color: textMuted
            }]}>
                {t("buyerProfile.infoPhone")}
              </AppText>
              <AppText style={[styles.infoValue, {
              color: textPrimary
            }]}>
                {phone}
              </AppText>
            </View>
          </View>
          <View style={[styles.divider, {
          backgroundColor: border
        }]} />
          <View style={styles.infoRow}>
            <Ionicons name="shield-checkmark-outline" size={20} color={isVerified ? successColor : textMuted} />
            <View style={styles.infoTextContainer}>
              <AppText style={[styles.infoLabel, {
              color: textMuted
            }]}>
                {t("buyerProfile.infoStatus")}
              </AppText>
              <AppText style={[styles.infoValue, {
              color: isVerified ? successColor : textMuted
            }]}>
                {isVerified ? t("buyerProfile.statusVerified") : t("buyerProfile.statusUnverified")}
              </AppText>
            </View>
          </View>
        </View>

        {/* Language Section – dropdown style */}
        <AppText style={[styles.sectionTitle, {
        color: textPrimary,
        marginTop: 24
      }]}>
          {t("buyerProfile.sectionLanguage")}
        </AppText>
        <View style={[styles.infoCard, {
        backgroundColor: surface
      }]}>
          <TouchableOpacity onPress={() => setLanguageOpen(!languageOpen)} style={styles.languageToggle}>
            <View style={{
            flexDirection: "row",
            alignItems: "center"
          }}>
              <Ionicons name="globe-outline" size={20} color={textSecondary} style={{
              marginRight: 12
            }} />
              <AppText style={{
              color: textPrimary,
              fontSize: 15,
              fontWeight: "500"
            }}>
                {currentLangLabel}
              </AppText>
            </View>
            <Ionicons name={languageOpen ? "chevron-up" : "chevron-down"} size={18} color={textSecondary} />
          </TouchableOpacity>
          {languageOpen && <View style={styles.languageList}>
              {LANGUAGES.map(lang => <TouchableOpacity key={lang.code} onPress={() => handleChangeLanguage(lang.code)} style={[styles.languageOption, currentLang === lang.code && {
            backgroundColor: primary + "15"
          }]} disabled={updatingLang}>
                  <AppText style={{
              color: currentLang === lang.code ? primary : textPrimary,
              fontSize: 14,
              fontWeight: currentLang === lang.code ? "600" : "400"
            }}>
                    {lang.native} ({lang.label})
                  </AppText>
                  {currentLang === lang.code && <Ionicons name="checkmark" size={18} color={primary} />}
                </TouchableOpacity>)}
            </View>}
        </View>

        {/* Settings menu item – fixed UI */}
        <TouchableOpacity style={[styles.menuItem, {
        backgroundColor: surface,
        borderColor: border
      }]} onPress={() => navigation?.navigate("Settings")} activeOpacity={0.7}>
          <Ionicons name="settings-outline" size={20} color={primary} />
          <AppText style={[styles.menuLabel, {
          color: textPrimary
        }]}>
            {t("farmerProfile.menuSettings")}
          </AppText>
          <Ionicons name="chevron-forward" size={16} color={textMuted} style={{
          marginLeft: "auto"
        }} />
        </TouchableOpacity>

        {/* Logout Button */}
        <View style={[styles.logoutContainer, {
        backgroundColor: background
      }]}>
          <TouchableOpacity style={[styles.logoutButton, {
          backgroundColor: errorColor
        }]} onPress={handleLogout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" style={{
            marginRight: 8
          }} />
            <AppText style={styles.logoutText}>
              {t("buyerProfile.logoutButton")}
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>;
};
const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 20
  },
  heroSection: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 16
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8
  },
  rolePill: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8
  },
  roleText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5
  },
  phoneNumber: {
    fontSize: 15
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 20
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4
  },
  statLabel: {
    fontSize: 13
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginHorizontal: 16,
    marginBottom: 10,
    marginTop: 4
  },
  infoCard: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "500"
  },
  divider: {
    height: 1,
    marginHorizontal: 12
  },
  // Language dropdown
  languageToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 14
  },
  languageList: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#D0DEF5",
    paddingVertical: 4
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8
  },
  // Settings menu item
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: "500",
    flex: 1
  },
  logoutContainer: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 20 : 16,
    paddingTop: 10,
    marginTop: 16
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: 12
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700"
  }
});
export default BuyerProfileScreen;