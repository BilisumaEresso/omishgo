// src/components/layout/BottomTabBar.js
import React, { useRef, useEffect } from "react";
import { View, Pressable, StyleSheet, Animated, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "../common/AppText";
import { useTheme } from "../../hooks/useTheme";
import { ROLE_TABS } from "../../constants/navigationTabs";
import { ROLES } from "../../constants/roles";
import * as NavigationBar from "expo-navigation-bar";

const TAB_ICON_SIZE = 24;

const BottomTabBar = ({ role, activeTab, onTabPress }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const tabs = ROLE_TABS[role] || ROLE_TABS[ROLES.FARMER];

  const primary = theme.colors.primary || "#4CAF50";
  const primaryLight = theme.colors.primaryLight || "#81C784";
  const surface = theme.colors.surface || "#FFFFFF";
  const border = theme.colors.border || "#E0E0E0";
  const textSecondary = theme.colors.textSecondary || "#757575";
  const tabInactive = theme.colors.tabInactive || "#9E9E9E";

  // Hide Android navigation bar (works in production builds)
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("hidden");
      return () => NavigationBar.setVisibilityAsync("visible");
    }
  }, []);

  // Tab bar sits exactly above system UI (home indicator / nav buttons)
  const bottomMargin = insets.bottom;

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const animatePress = (toValue) => {
    Animated.spring(scaleAnim, {
      toValue,
      useNativeDriver: true,
      speed: 100,
      bounciness: 12,
    }).start();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: surface,
          borderTopColor: border,
          marginBottom: bottomMargin,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
            },
            android: { elevation: 10 },
          }),
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.label;
        const iconName = isActive ? tab.activeIcon || tab.icon : tab.icon;
        const iconColor = isActive ? primary : tabInactive;
        const labelColor = isActive ? primary : textSecondary;

        return (
          <Pressable
            key={tab.label}
            onPress={() => onTabPress && onTabPress(tab)}
            onPressIn={() => animatePress(0.9)}
            onPressOut={() => animatePress(1)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            style={styles.tab}
          >
            {isActive && (
              <View
                style={[styles.activeIndicator, { backgroundColor: primary }]}
              />
            )}
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: isActive ? primaryLight : "transparent",
                  transform: [{ scale: scaleAnim }],
                  ...(isActive && { width: 48, height: 38, borderRadius: 22 }),
                },
              ]}
            >
              <Ionicons
                name={iconName}
                size={TAB_ICON_SIZE}
                color={iconColor}
              />
            </Animated.View>
            <AppText
              variant="caption"
              style={[
                styles.label,
                { color: labelColor, fontWeight: isActive ? "700" : "400" },
              ]}
              numberOfLines={1}
            >
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 10,
    paddingBottom: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  iconContainer: {
    width: 44,
    height: 38,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  activeIndicator: {
    position: "absolute",
    top: 0,
    width: 24,
    height: 3,
    borderRadius: 1.5,
    alignSelf: "center",
  },
  label: {
    marginTop: 2,
    fontSize: 12,
    textAlign: "center",
  },
});

export default BottomTabBar;
