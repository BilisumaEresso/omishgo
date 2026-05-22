// src/components/layout/BottomTabBar.js
import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText"; // Assuming you have this
import { useTheme } from "../../hooks/useTheme";
import { ROLE_TABS } from "../../constants/navigationTabs";
import { ROLES } from "../../constants/roles";

const TAB_ICON_SIZE = 22;

const BottomTabBar = ({ role, activeTab, onTabPress }) => {
  const { theme } = useTheme();
  const tabs = ROLE_TABS[role] || ROLE_TABS[ROLES.FARMER];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface || "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: theme.colors.border || "#F0F0F0",
          paddingBottom: theme.spacing.md || 20, // Accommodates iOS safe area
          paddingTop: theme.spacing.sm || 10,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.label;
        const color = isActive
          ? theme.colors.primary || "#6B4EFF"
          : theme.colors.textSecondary || "#999999";

        return (
          <Pressable
            key={tab.label}
            onPress={() => onTabPress && onTabPress(tab)}
            style={styles.tab}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            {/* DESIGN FIX: Added the active background pill from the mockups */}
            <View
              style={[
                styles.iconContainer,
                isActive && {
                  backgroundColor: theme.colors.primaryLight || "#F3F0FF",
                },
              ]}
            >
              <Ionicons
                name={isActive ? tab.activeIcon || tab.icon : tab.icon}
                size={TAB_ICON_SIZE}
                color={color}
              />
            </View>

            <AppText
              variant="caption"
              style={{
                color,
                marginTop: 4,
                fontWeight: isActive ? "600" : "400",
              }}
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
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16, // Creates the pill shape
  },
});

export default BottomTabBar;
