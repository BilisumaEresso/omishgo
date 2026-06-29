// src/components/layout/DashboardLayout.js
import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Text,
  TouchableOpacity,
} from "react-native";
import ScreenWrapper from "../common/ScreenWrapper";
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
  disablePadding = false,
  refreshing = false,
  onRefresh,
  notificationMessage,
  onDismissNotification,
  // 👇 new prop if you ever need full control
  contentPaddingHorizontal = 12,
  contentPaddingVertical = 16,
  ...headerProps
}) => {
  const { theme } = useTheme();
  const primaryColor = theme.colors.primary || "#4CAF50";
  const backgroundColor = theme.colors.background || "#F8F9FA";
  const successColor = theme.colors.success || "#2e7d32";

  return (
    <ScreenWrapper>
      <View style={styles.flex}>
        {showHeader && (
          <AppHeader title={title} subtitle={subtitle} {...headerProps} />
        )}

        {notificationMessage ? (
          <View
            style={[
              styles.notificationBanner,
              { backgroundColor: successColor },
            ]}
          >
            <Text style={styles.notificationText}>{notificationMessage}</Text>
            {onDismissNotification && (
              <TouchableOpacity
                onPress={onDismissNotification}
                style={styles.dismissBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.dismissText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}

        <View style={[styles.content, { backgroundColor }]}>
          {scrollable ? (
            <ScrollView
              contentContainerStyle={[
                styles.scrollContent,
                // Apply custom horizontal/vertical padding
                {
                  paddingHorizontal: contentPaddingHorizontal,
                  paddingVertical: contentPaddingVertical,
                },
                // If full-bleed is needed, override to 0
                disablePadding && { padding: 0 },
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              refreshControl={
                onRefresh ? (
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[primaryColor]}
                    tintColor={primaryColor}
                    title="Refreshing…"
                    titleColor={primaryColor}
                  />
                ) : undefined
              }
            >
              {children}
            </ScrollView>
          ) : (
            <View
              style={[
                styles.flex,
                !disablePadding && {
                  paddingHorizontal: contentPaddingHorizontal,
                  paddingVertical: contentPaddingVertical,
                },
              ]}
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
    // default values are set inline now, this is just for base
  },
  staticPadding: {
    // kept for compatibility, but now inline handles it
  },
  notificationBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 2,
  },
  notificationText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    flex: 1,
  },
  dismissBtn: {
    marginLeft: 12,
    padding: 4,
    minWidth: 32,
    minHeight: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  dismissText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DashboardLayout;
