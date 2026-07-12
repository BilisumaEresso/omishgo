import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import api from "../../config/api.js";
import { ROLES } from "../../constants/roles.js";
import { useTheme } from "../../hooks/useTheme.js";
import { useAuthStore } from "../../store/auth.store.js";
import AppText from "../common/AppText.js";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.78, 320);

const LANGUAGE_OPTIONS = [
  { code: "en", label: "English" },
  { code: "am", label: "አማርኛ" },
  { code: "om", label: "Afaan Oromoo" },
];

function getRoleMenuItems(role, t) {
  if (role === ROLES.FARMER) {
    return [
      { label: t("sidebar.home"), icon: "home-outline", route: "Home" },
      {
        label: t("sidebar.products"),
        icon: "leaf-outline",
        route: "FarmerProducts",
      },
      {
        label: t("sidebar.orders"),
        icon: "receipt-outline",
        route: "FarmerOrders",
      },
      {
        label: t("sidebar.analytics"),
        icon: "stats-chart-outline",
        route: "FarmerAnalytics",
      },
      {
        label: t("sidebar.postProduct"),
        icon: "add-circle-outline",
        route: "PostProduct",
      },
      {
        label: t("sidebar.messages"),
        icon: "chatbubbles-outline",
        route: "Conversations",
      },
      {
        label: t("sidebar.profile"),
        icon: "person-outline",
        route: "Profile",
      },
    ];
  }

  if (role === ROLES.BUYER) {
    return [
      { label: t("sidebar.home"), icon: "home-outline", route: "Home" },
      {
        label: t("sidebar.marketplace"),
        icon: "storefront-outline",
        route: "BuyerMarketplace",
      },
      {
        label: t("sidebar.orders"),
        icon: "receipt-outline",
        route: "BuyerOrders",
      },
      {
        label: t("sidebar.saved"),
        icon: "bookmark-outline",
        route: "BuyerSaved",
      },
      {
        label: t("sidebar.messages"),
        icon: "chatbubbles-outline",
        route: "Conversations",
      },
      {
        label: t("sidebar.profile"),
        icon: "person-outline",
        route: "Profile",
      },
    ];
  }

  return [];
}

const AppSidebar = ({ visible, onClose, role, onItemPress }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { logout, user, language, setLanguage } = useAuthStore();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = useState(visible);

  const textPrimary = theme?.colors?.textPrimary || "#212121";
  const textSecondary = theme?.colors?.textSecondary || "#757575";
  const borderColor = theme?.colors?.border || "#E0E0E0";
  const backgroundColor = theme?.colors?.surface || "#FFFFFF";
  const pressedBg = theme?.colors?.backgroundSecondary || "#EEEEEE";
  const errorColor = theme?.colors?.error || "#F44336";
  const primaryColor = theme?.colors?.primary || "#4CAF50";
  const spacing = theme.spacing || { sm: 8, md: 12, lg: 16 };
  const radius = theme.radius || { sm: 8 };

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setShowModal(false));
    }
  }, [visible, slideAnim, fadeAnim]);

  const handleCloseAnimation = (callbackItem = null) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowModal(false);
      if (callbackItem && onItemPress) onItemPress(callbackItem);
      onClose?.();
    });
  };

  const handleLanguageSelect = async (code) => {
    await setLanguage(code);
    api
      .patch("/api/v1/auth/me/language", { preferredLang: code })
      .catch(() => {});
  };

  const handleLogout = () => {
    logout();
    handleCloseAnimation({ label: t("sidebar.logout"), route: "Logout" });
  };

  const menuItems = getRoleMenuItems(role, t);
  const roleLabel =
    role === ROLES.FARMER
      ? t("auth.roleFarmer")
      : role === ROLES.BUYER
        ? t("auth.roleBuyer")
        : role
          ? role.charAt(0).toUpperCase() + role.slice(1)
          : "User";

  const renderMenuItem = (item) => (
    <Pressable
      key={item.route}
      style={({ pressed }) => [
        styles.menuItem,
        {
          backgroundColor: pressed ? pressedBg : "transparent",
          borderRadius: radius.sm,
        },
      ]}
      onPress={() => handleCloseAnimation(item)}
      accessibilityRole="button"
      accessibilityLabel={item.label}
    >
      <Ionicons
        name={item.icon}
        size={22}
        color={textPrimary}
        style={{ marginRight: spacing.sm }}
      />
      <AppText
        variant="bodyMd"
        style={{ color: textPrimary, fontWeight: "500" }}
      >
        {item.label}
      </AppText>
    </Pressable>
  );

  return (
    <Modal
      visible={showModal}
      transparent
      animationType="none"
      onRequestClose={() => handleCloseAnimation()}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => handleCloseAnimation()}
            accessibilityLabel="Close menu"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.drawer,
            {
              backgroundColor,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <SafeAreaView style={styles.drawerContent}>
            <Pressable
              style={[
                styles.profileSection,
                {
                  borderBottomColor: borderColor,
                  paddingHorizontal: spacing.lg,
                },
              ]}
              onPress={() =>
                handleCloseAnimation({
                  label: t("sidebar.profile"),
                  route: "Profile",
                })
              }
              accessibilityRole="button"
              accessibilityLabel={t("sidebar.profile")}
            >
              <View
                style={[
                  styles.profileAvatar,
                  { backgroundColor: primaryColor },
                ]}
              >
                <Ionicons name="person" size={26} color="#fff" />
              </View>
              <View style={styles.profileInfo}>
                <AppText
                  variant="headingSm"
                  style={{ color: textPrimary, fontWeight: "700" }}
                  numberOfLines={1}
                >
                  {user?.name || roleLabel}
                </AppText>
                <AppText
                  variant="caption"
                  style={{ color: textSecondary, marginTop: 2 }}
                  numberOfLines={1}
                >
                  {roleLabel}
                </AppText>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={textSecondary}
              />
            </Pressable>

            <ScrollView
              style={styles.menuScroll}
              contentContainerStyle={[
                styles.menuList,
                { paddingHorizontal: spacing.md },
              ]}
              showsVerticalScrollIndicator={false}
            >
              {menuItems.map(renderMenuItem)}

              <View
                style={[
                  styles.divider,
                  { backgroundColor: borderColor, marginVertical: spacing.md },
                ]}
              />

              <AppText
                variant="caption"
                style={[
                  styles.sectionLabel,
                  { color: textSecondary, marginBottom: spacing.sm },
                ]}
              >
                {t("sidebar.language")}
              </AppText>
              <View style={styles.languageRow}>
                {LANGUAGE_OPTIONS.map((option) => {
                  const selected = language === option.code;
                  return (
                    <Pressable
                      key={option.code}
                      style={[
                        styles.languageBtn,
                        {
                          borderColor: selected ? primaryColor : borderColor,
                          backgroundColor: selected
                            ? primaryColor + "18"
                            : "transparent",
                        },
                      ]}
                      onPress={() => handleLanguageSelect(option.code)}
                    >
                      <AppText
                        style={{
                          color: selected ? primaryColor : textSecondary,
                          fontWeight: selected ? "700" : "500",
                          fontSize: 12,
                        }}
                      >
                        {option.label}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>

              <View
                style={[
                  styles.divider,
                  { backgroundColor: borderColor, marginVertical: spacing.md },
                ]}
              />

              {renderMenuItem({
                label: t("sidebar.help"),
                icon: "help-circle-outline",
                route: "Help",
              })}

              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  {
                    backgroundColor: pressed
                      ? errorColor + "15"
                      : "transparent",
                    borderRadius: radius.sm,
                    marginBottom: spacing.lg,
                  },
                ]}
                onPress={handleLogout}
                accessibilityRole="button"
                accessibilityLabel={t("sidebar.logout")}
              >
                <Ionicons
                  name="log-out-outline"
                  size={22}
                  color={errorColor}
                  style={{ marginRight: spacing.sm }}
                />
                <AppText
                  variant="bodyMd"
                  style={{ color: errorColor, fontWeight: "600" }}
                >
                  {t("sidebar.logout")}
                </AppText>
              </Pressable>
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  drawer: {
    width: DRAWER_WIDTH,
    height: "100%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: { elevation: 20 },
    }),
  },
  drawerContent: {
    flex: 1,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  menuScroll: {
    flex: 1,
  },
  menuList: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 12,
    marginBottom: 2,
  },
  divider: {
    height: 1,
  },
  sectionLabel: {
    paddingHorizontal: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontSize: 11,
  },
  languageRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
  },
  languageBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
  },
});

export default AppSidebar;
