// src/components/layout/DashboardLayout.js
import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import ScreenWrapper from "../common/ScreenWrapper"; // Assuming you have this
import AppHeader from "./AppHeader";
import BottomTabBar from "./BottomTabBar";
import { useTheme } from "../../hooks/useTheme";

const DashboardLayout = ({
  title,
  subtitle,
  role,
  children,
  scrollable = true,
  showHeader = true,
  showTabs = true,
  activeTab,
  onTabPress,
  disablePadding = false, // DESIGN FIX: Allows full-bleed screen elements (e.g., maps, carousels)
  ...headerProps
}) => {
  const { theme } = useTheme();

  return (
    <ScreenWrapper>
      <View style={styles.flex}>
        {showHeader && (
          <AppHeader title={title} subtitle={subtitle} {...headerProps} />
        )}

        <View
          style={[
            styles.content,
            { backgroundColor: theme.colors.background || "#F8F9FA" },
          ]}
        >
          {scrollable ? (
            <ScrollView
              contentContainerStyle={[
                styles.scrollContent,
                disablePadding && { padding: 0 }, // Drop container margins for fluid edge-to-edge sections
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>
          ) : (
            <View
              style={[styles.flex, !disablePadding && styles.staticPadding]}
            >
              {children}
            </View>
          )}
        </View>

        {showTabs && (
          <BottomTabBar
            role={role}
            activeTab={activeTab}
            onTabPress={onTabPress}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  staticPadding: {
    padding: 16,
  },
});

export default DashboardLayout;
