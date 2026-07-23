// src/components/layout/DashboardLayout.js
import { useTranslation } from "react-i18next";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useSidebar } from "../../context/SidebarContext";
import { useTheme } from "../../hooks/useTheme";
import AppHeader from "./AppHeader";

const DashboardLayout = ({
  title,
  subtitle,
  role,
  children,
  scrollable = true,
  showHeader = true,
  refreshing = false,
  onRefresh,
  notificationMessage,
  onDismissNotification,
  contentPaddingHorizontal = 16,
  contentPaddingVertical = 12,
  navigation,
  ...headerProps
}) => {
  const { theme } = useTheme();
  const primaryColor = theme?.colors?.primary || "#4CAF50";
  const backgroundColor = theme?.colors?.background || "#F8F9FA";
  const successColor = theme?.colors?.success || "#2e7d32";
  const { t } = useTranslation();
  const { openSidebar } = useSidebar();

  return (
    <View style={[styles.flex, { backgroundColor }]}>
      <AppHeader
        title={t("browse.title")}
        showMenu={true}
        showNotification={true}
        notificationCount={0}
        onMenuPress={openSidebar}
        onNotificationPress={() => navigation.navigate("Notifications")}
      />

      <View style={styles.content}>
        {scrollable ? (
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingHorizontal: contentPaddingHorizontal,
                paddingVertical: contentPaddingVertical,
              },
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
              {
                paddingHorizontal: contentPaddingHorizontal,
                paddingVertical: contentPaddingVertical,
              },
            ]}
          >
            {children}
          </View>
        )}
      </View>
    </View>
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
  },
  notificationBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 44,
    paddingHorizontal: 16,
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
