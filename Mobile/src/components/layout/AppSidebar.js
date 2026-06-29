// src/components/layout/AppSidebar.js
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Pressable,
  Modal,
  Animated,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText";
import { useTheme } from "../../hooks/useTheme";
import { ROLES } from "../../constants/roles";
import { useAuthStore } from "../../store/auth.store";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.75, 320); // capped at 320 for tablets

const ROLE_MENU_ITEMS = {
  [ROLES.FARMER]: [
    { label: "Products", icon: "leaf", route: "FarmerProducts" },
    { label: "Orders", icon: "cart", route: "FarmerOrders" },
    { label: "Analytics", icon: "bar-chart", route: "FarmerAnalytics" },
  ],
  [ROLES.BUYER]: [
    { label: "Marketplace", icon: "storefront", route: "BuyerMarketplace" },
    { label: "Orders", icon: "cart", route: "BuyerOrders" },
    { label: "Saved", icon: "bookmark", route: "BuyerSaved" },
  ],
  [ROLES.SUPPLIER]: [
    { label: "Inventory", icon: "cube", route: "SupplierInventory" },
    { label: "Orders", icon: "cart", route: "SupplierOrders" },
    { label: "Reports", icon: "document-text", route: "SupplierReports" },
  ],
  [ROLES.DRIVER]: [
    { label: "Deliveries", icon: "bicycle", route: "DriverDeliveries" },
    { label: "History", icon: "time", route: "DriverHistory" },
  ],
};

const COMMON_ITEMS = [
  { label: "Settings", icon: "settings-outline", route: "Settings" },
  { label: "Help", icon: "help-circle-outline", route: "Help" },
];

const AppSidebar = ({ visible, onClose, role, onItemPress }) => {
  const { theme } = useTheme();
  const { logout, user } = useAuthStore();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = useState(visible);

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
      });
    }
  }, [visible]);

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
      if (callbackItem && onItemPress) {
        onItemPress(callbackItem);
      }
      if (onClose) onClose();
    });
  };

  const menuItems = role ? ROLE_MENU_ITEMS[role] || [] : [];

  // Theme shortcuts
  const textPrimary = theme.colors.textPrimary || "#212121";
  const textSecondary = theme.colors.textSecondary || "#757575";
  const borderColor = theme.colors.border || "#E0E0E0";
  const backgroundColor = theme.colors.surface || "#FFFFFF";
  const pressedBg = theme.colors.backgroundSecondary || "#EEEEEE";
  const errorColor = theme.colors.error || "#F44336";
  const primaryColor = theme.colors.primary || "#4CAF50";
  const spacing = theme.spacing || { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
  const radius = theme.radius || { sm: 8, md: 12 };

  // Logout handler – we ensure the route is 'Logout' so dashboard can catch it
  const handleLogout = () => {
    logout();
    handleCloseAnimation({ label: "Logout", route: "Logout" });
  };

  return (
    <Modal
      visible={showModal}
      transparent
      animationType="none"
      onRequestClose={() => handleCloseAnimation()}
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => handleCloseAnimation()}
            accessibilityLabel="Close menu"
          />
        </Animated.View>

        {/* Drawer */}
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
            {/* Profile section – now tappable */}
            <Pressable
              style={[
                styles.profileSection,
                {
                  borderBottomColor: borderColor,
                  paddingHorizontal: spacing.lg,
                },
              ]}
              onPress={() =>
                handleCloseAnimation({ label: "Profile", route: "Profile" })
              }
              accessibilityRole="button"
              accessibilityLabel="View profile"
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
                  {user?.name || "Farmer"}
                </AppText>
                <AppText
                  variant="caption"
                  style={{ color: textSecondary, marginTop: 2 }}
                >
                  {role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"}
                </AppText>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={textSecondary}
              />
            </Pressable>

            {/* Menu items */}
            <View style={[styles.menuList, { paddingHorizontal: spacing.md }]}>
              {menuItems.map((item) => (
                <Pressable
                  key={item.label}
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
                    size={24} // increased from 20
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
              ))}

              {/* Divider */}
              <View
                style={[
                  styles.divider,
                  { backgroundColor: borderColor, marginVertical: spacing.md },
                ]}
              />

              {/* Common items */}
              {COMMON_ITEMS.map((item) => (
                <Pressable
                  key={item.label}
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
                    size={24}
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
              ))}

              {/* Logout – now clearly separated and tappable */}
              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  styles.logoutItem,
                  {
                    backgroundColor: pressed
                      ? errorColor + "15"
                      : "transparent",
                    borderRadius: radius.sm,
                    marginTop: "auto",
                    marginBottom: spacing.lg,
                  },
                ]}
                onPress={handleLogout}
                accessibilityRole="button"
                accessibilityLabel="Logout"
              >
                <Ionicons
                  name="log-out-outline"
                  size={24}
                  color={errorColor}
                  style={{ marginRight: spacing.sm }}
                />
                <AppText
                  variant="bodyMd"
                  style={{ color: errorColor, fontWeight: "600" }}
                >
                  Logout
                </AppText>
              </Pressable>
            </View>
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
      android: {
        elevation: 20,
      },
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
  menuList: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14, // ensures minimum 48pt touch height with icon
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  divider: {
    height: 1,
  },
  logoutItem: {
    // already styled inline, but keep base if needed
  },
});

export default AppSidebar;
