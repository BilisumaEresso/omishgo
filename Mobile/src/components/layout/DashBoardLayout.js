// src/components/layout/DashboardLayout.js
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
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
  ...headerProps
}) => {
  const { theme } = useTheme();
  const primaryColor = theme.colors.primary || "#4CAF50";
  const backgroundColor = theme.colors.background || "#F8F9FA";
  const successColor = theme.colors.success || "#2e7d32";

  return (
    <View style={[styles.flex, { backgroundColor }]}>
      {showHeader && (
        <AppHeader
          title={title}
          subtitle={subtitle}
          {...headerProps} // notificationCount, showBack, etc. passed through
        />
      )}

      {notificationMessage ? (
        <View
          style={[styles.notificationBanner, { backgroundColor: successColor }]}
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
