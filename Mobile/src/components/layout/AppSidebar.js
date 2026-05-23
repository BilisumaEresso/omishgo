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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText";
import { useTheme } from "../../hooks/useTheme";
import { ROLES } from "../../constants/roles";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.75;

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
      if (onClose) {
        onClose();
      }
    });
  };

  const menuItems = role ? ROLE_MENU_ITEMS[role] || [] : [];

  const textPrimary = theme.colors.textPrimary || "#212121";
  const textSecondary = theme.colors.textSecondary || "#757575";
  const borderColor = theme.colors.border || "#F0F0F0";
  const backgroundColor = theme.colors.surface || "#FFFFFF";
  const pressedBg = theme.colors.backgroundSecondary || "#EEEEEE";
  const errorColor = theme.colors.error || "#FF3B30";

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
          />
        </Animated.View>

        {/* Drawer */}
        <Animated.View
          style={[
            styles.drawer,
            {
              backgroundColor: backgroundColor,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <SafeAreaView style={styles.drawerContent}>
            {/* Profile area */}
            <View
              style={[
                styles.profileSection,
                {
                  borderBottomColor: borderColor,
                  paddingHorizontal: theme.spacing?.md || 16,
                },
              ]}
            >
              <View
                style={[
                  styles.profileAvatar,
                  { backgroundColor: theme.colors.primary || "#6B4EFF" },
                ]}
              >
                <Ionicons name="person" size={24} color="#fff" />
              </View>
              <View style={styles.profileInfo}>
                <AppText
                  variant="headingMd"
                  style={{ color: textPrimary, fontWeight: "600" }}
                >
                  User Name
                </AppText>
                <AppText
                  variant="bodySm"
                  style={{ color: textSecondary, marginTop: 2 }}
                >
                  {role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"}
                </AppText>
              </View>
            </View>

            {/* Menu items */}
            <View style={styles.menuList}>
              {menuItems.map((item) => (
                <Pressable
                  key={item.label}
                  style={({ pressed }) => [
                    styles.menuItem,
                    {
                      backgroundColor: pressed ? pressedBg : "transparent",
                    },
                  ]}
                  onPress={() => handleCloseAnimation(item)}
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={textPrimary}
                    style={{ marginRight: 12 }}
                  />
                  <AppText variant="bodyMd" style={{ color: textPrimary }}>
                    {item.label}
                  </AppText>
                </Pressable>
              ))}

              {/* Divider */}
              <View
                style={{
                  height: 1,
                  backgroundColor: borderColor,
                  marginVertical: 12,
                }}
              />

              {/* Common items - always render (no condition) */}
              {COMMON_ITEMS.map((item) => (
                <Pressable
                  key={item.label}
                  style={({ pressed }) => [
                    styles.menuItem,
                    {
                      backgroundColor: pressed ? pressedBg : "transparent",
                    },
                  ]}
                  onPress={() => handleCloseAnimation(item)}
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={textPrimary}
                    style={{ marginRight: 12 }}
                  />
                  <AppText variant="bodyMd" style={{ color: textPrimary }}>
                    {item.label}
                  </AppText>
                </Pressable>
              ))}

              {/* Logout */}
              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  {
                    marginTop: "auto",
                    marginBottom: 16,
                    backgroundColor: pressed ? pressedBg : "transparent",
                  },
                ]}
                onPress={() =>
                  handleCloseAnimation({ label: "Logout", route: "Logout" })
                }
              >
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color={errorColor}
                  style={{ marginRight: 12 }}
                />
                <AppText
                  variant="bodyMd"
                  style={{ color: errorColor, fontWeight: "500" }}
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
    elevation: 16,
  },
  drawerContent: {
    flex: 1,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  menuList: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
});

export default AppSidebar;
