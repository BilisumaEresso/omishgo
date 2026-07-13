// Mobile/src/components/layout/AppSidebar.js
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import AppText from "../common/AppText";
import { useTheme } from "../../hooks/useTheme";
import { ROLES } from "../../constants/roles";
import { useAuthStore } from "../../store/auth.store";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.78, 300);

// ---------- role-based menu items ----------
const ROLE_MENU_ITEMS = {
  [ROLES.FARMER]: [
    { label: "Products", icon: "leaf-outline", route: "FarmerProducts" },
    { label: "Orders", icon: "cart-outline", route: "FarmerOrders" },
    {
      label: "Insights",
      icon: "stats-chart-outline",
      route: "FarmerAnalytics",
    },
  ],
  [ROLES.BUYER]: [
    {
      label: "Marketplace",
      icon: "storefront-outline",
      route: "BuyerMarketplace",
    },
    { label: "Orders", icon: "cart-outline", route: "BuyerOrders" },
    { label: "Saved", icon: "bookmark-outline", route: "BuyerSaved" },
  ],
  [ROLES.SUPPLIER]: [
    { label: "Inventory", icon: "cube-outline", route: "SupplierInventory" },
    { label: "Orders", icon: "cart-outline", route: "SupplierOrders" },
    {
      label: "Reports",
      icon: "document-text-outline",
      route: "SupplierReports",
    },
  ],
  [ROLES.DRIVER]: [
    { label: "Deliveries", icon: "bicycle-outline", route: "DriverDeliveries" },
    { label: "History", icon: "time-outline", route: "DriverHistory" },
  ],
};

// ---------- language options ----------
const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "am", label: "አማርኛ", native: "Amharic" },
  { code: "om", label: "Afaan Oromoo", native: "Afan Oromo" },
];

const AppSidebar = ({
  visible,
  onClose,
  role,
  onItemPress,
  activeRoute = "",
}) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const { logout, user } = useAuthStore();

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  // ---------- animation ----------
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
      ]).start(() => {
        setShowModal(false);
        setLanguageOpen(false);
      });
    }
  }, [visible]);

  const handleClose = () => {
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
      setLanguageOpen(false);
      if (onClose) onClose();
    });
  };

  const handleItem = (item) => {
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
      setLanguageOpen(false);
      if (onItemPress) onItemPress(item);
    });
  };

  const handleLogout = () => {
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
      setLanguageOpen(false);
      logout();
    });
  };

  const changeLanguage = (code) => {
    i18n.changeLanguage(code).catch(() => {});
    setLanguageOpen(false);
  };

  // ---------- theme colours ----------
  const primaryColor = theme.colors.primary || "#2E7D32";
  const primaryDark = theme.colors.primaryDark || "#1B5E20";
  const textPrimary = theme.colors.textPrimary || "#1A2E1A";
  const textSecondary = theme.colors.textSecondary || "#4A6741";
  const borderColor = theme.colors.border || "#D0E8CE";
  const surface = theme.colors.surface || "#FFFFFF";
  const errorColor = theme.colors.error || "#C62828";
  const successColor = theme.colors.success || "#2E7D32";
  const menuItems = role ? ROLE_MENU_ITEMS[role] || [] : [];

  // ---------- current language display ----------
  const currentLang = i18n.language || "en";
  const currentLangLabel =
    LANGUAGES.find((l) => l.code === currentLang)?.label || "English";

  return (
    <Modal
      visible={showModal}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <Pressable
            style={{ flex: 1 }}
            onPress={handleClose}
            accessibilityLabel="Close menu"
          />
        </Animated.View>

        {/* Drawer */}
        <Animated.View
          style={[
            styles.drawer,
            {
              backgroundColor: surface,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Profile header with gradient */}
          <LinearGradient
            colors={[primaryColor, primaryDark]}
            style={styles.profileHeader}
          >
            <Pressable
              onPress={() => handleItem({ label: "Profile", route: "Profile" })}
              style={styles.profilePressable}
              accessibilityRole="button"
              accessibilityLabel="View profile"
            >
              <View style={styles.avatar}>
                <Ionicons name="person" size={32} color={primaryColor} />
              </View>
              <View style={styles.profileInfo}>
                <AppText style={styles.userName} numberOfLines={1}>
                  {user?.name || "User"}
                </AppText>
                <View style={styles.rolePill}>
                  <AppText style={styles.roleText}>
                    {role ? role.toUpperCase() : "USER"}
                  </AppText>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#FFF" />
            </Pressable>
          </LinearGradient>

          {/* Scrollable menu area */}
          <ScrollView
            style={styles.menuScroll}
            contentContainerStyle={styles.menuContent}
          >
            {/* Role-based items */}
            {menuItems.map((item) => {
              const isActive = activeRoute === item.route;
              return (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.menuItem,
                    isActive && { backgroundColor: primaryColor + "15" },
                  ]}
                  onPress={() => handleItem(item)}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                >
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color={isActive ? primaryColor : textSecondary}
                  />
                  <AppText
                    style={[
                      styles.menuLabel,
                      { color: isActive ? primaryColor : textPrimary },
                    ]}
                  >
                    {item.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: borderColor }]} />

            {/* My Profile, Settings & Help */}
            {[
              { label: "My Profile", route: "Profile", icon: "person-outline" },
              {
                label: "Settings",
                route: "Settings",
                icon: "settings-outline",
              },
              { label: "Help", route: "Help", icon: "help-circle-outline" },
            ].map(({ label, route, icon }) => (
              <TouchableOpacity
                key={route}
                style={styles.menuItem}
                onPress={() => handleItem({ label, route })}
                accessibilityRole="button"
                accessibilityLabel={label}
              >
                <Ionicons name={icon} size={22} color={textSecondary} />
                <AppText style={[styles.menuLabel, { color: textPrimary }]}>
                  {label}
                </AppText>
              </TouchableOpacity>
            ))}

            {/* Language Picker */}
            <View style={{ marginVertical: 4 }}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => setLanguageOpen(!languageOpen)}
                accessibilityRole="button"
                accessibilityLabel="Change language"
              >
                <Ionicons
                  name="globe-outline"
                  size={22}
                  color={textSecondary}
                />
                <AppText
                  style={[styles.menuLabel, { color: textPrimary, flex: 1 }]}
                >
                  {currentLangLabel}
                </AppText>
                <Ionicons
                  name={languageOpen ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={textSecondary}
                />
              </TouchableOpacity>
              {languageOpen && (
                <View style={styles.languageSubmenu}>
                  {LANGUAGES.map((lang) => (
                    <TouchableOpacity
                      key={lang.code}
                      style={[
                        styles.languageOption,
                        currentLang === lang.code && {
                          backgroundColor: primaryColor + "15",
                        },
                      ]}
                      onPress={() => changeLanguage(lang.code)}
                      accessibilityRole="button"
                      accessibilityLabel={lang.native}
                    >
                      <AppText
                        style={[
                          styles.languageOptionText,
                          {
                            color:
                              currentLang === lang.code
                                ? primaryColor
                                : textPrimary,
                          },
                        ]}
                      >
                        {lang.native}
                      </AppText>
                      {currentLang === lang.code && (
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color={primaryColor}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          {/* Logout button (fixed at bottom) */}
          <View
            style={[styles.logoutContainer, { borderTopColor: borderColor }]}
          >
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              accessibilityRole="button"
              accessibilityLabel="Logout"
            >
              <Ionicons name="log-out-outline" size={22} color={errorColor} />
              <AppText style={[styles.logoutLabel, { color: errorColor }]}>
                Logout
              </AppText>
            </TouchableOpacity>
            <AppText style={[styles.version, { color: textSecondary }]}>
              v1.0.0
            </AppText>
          </View>
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
  profileHeader: {
    paddingTop: Platform.OS === "android" ? 40 : 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  profilePressable: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  rolePill: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  menuScroll: {
    flex: 1,
  },
  menuContent: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexGrow: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 2,
    borderRadius: 10,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 14,
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: 8,
    marginHorizontal: 12,
  },
  languageSubmenu: {
    marginLeft: 36,
    marginTop: 4,
    marginBottom: 8,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 2,
  },
  languageOptionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  logoutContainer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingBottom: Platform.OS === "ios" ? 20 : 14,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  logoutLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 14,
  },
  version: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 8,
  },
});

export default AppSidebar;
