// src/screens/shared/NotificationsScreen.js
import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import { useTheme } from "../../hooks/useTheme";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INITIAL_NOTIFICATIONS = [
  {
    id: "1",
    type: "order",
    title: "New order received",
    body: "Abebe Girma ordered 50kg Teff",
    time: "2 min ago",
    isRead: false,
  },
  {
    id: "2",
    type: "message",
    title: "New message",
    body: "Buyer Tigist sent you a message",
    time: "15 min ago",
    isRead: false,
  },
  {
    id: "3",
    type: "market",
    title: "Price update",
    body: "Onion prices rose 12% today in Meki market",
    time: "1 hr ago",
    isRead: true,
  },
  {
    id: "4",
    type: "system",
    title: "Account verified",
    body: "Your account has been verified by the Union",
    time: "2 days ago",
    isRead: true,
  },
  {
    id: "5",
    type: "order",
    title: "Order completed",
    body: "Delivery of 30kg Tomatoes to Tigist is complete",
    time: "3 hr ago",
    isRead: false,
  },
  {
    id: "6",
    type: "market",
    title: "Demand alert",
    body: "Maize demand is high in Adama region",
    time: "5 hr ago",
    isRead: false,
  },
  {
    id: "7",
    type: "message",
    title: "New message",
    body: "Farmer Dawit asked about your listing",
    time: "1 day ago",
    isRead: true,
  },
  {
    id: "8",
    type: "system",
    title: "Update available",
    body: "New features: order tracking & price graphs",
    time: "3 days ago",
    isRead: true,
  },
];

// ─── Icon & Color helpers by type ────────────────────────────────────────────
const typeConfig = {
  order: {
    icon: "receipt-outline",
    colorKey: "primary", // will use theme.colors.primary
  },
  message: {
    icon: "chatbubbles-outline",
    colorKey: "info",
  },
  market: {
    icon: "stats-chart-outline",
    colorKey: "warning",
  },
  system: {
    icon: "shield-checkmark-outline",
    colorKey: "success",
  },
};

export default function NotificationsScreen({ navigation }) {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const primary = theme.colors.primary || "#2E7D32";
  const backgroundColor = theme.colors.background || "#F9FBF9";
  const surface = theme.colors.surface || "#FFFFFF";
  const textPrimary = theme.colors.textPrimary || "#1A2E1A";
  const textSecondary = theme.colors.textSecondary || "#4A6741";
  const textMuted = theme.colors.textMuted || "#8FAF8A";
  const borderColor = theme.colors.border || "#E0E0E0";

  // Map type color key to actual color from theme
  const getTypeColor = (type) => {
    const colorKey = typeConfig[type]?.colorKey || "primary";
    return theme.colors[colorKey] || primary;
  };

  const handleMarkRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const allRead = unreadCount === 0;

  const renderItem = ({ item }) => {
    const config = typeConfig[item.type] || typeConfig.system;
    const typeColor = getTypeColor(item.type);
    const isUnread = !item.isRead;

    return (
      <Pressable
        onPress={() => handleMarkRead(item.id)}
        style={[
          styles.notificationRow,
          {
            backgroundColor: isUnread ? primary + "08" : surface,
            borderBottomColor: borderColor,
          },
        ]}
      >
        {/* Left icon */}
        <View style={[styles.iconCircle, { backgroundColor: typeColor }]}>
          <Ionicons name={config.icon} size={20} color="#FFFFFF" />
        </View>

        {/* Text content */}
        <View style={styles.textBlock}>
          <AppText
            style={[styles.title, { color: textPrimary }]}
            numberOfLines={1}
          >
            {item.title}
          </AppText>
          <AppText
            style={[styles.body, { color: textSecondary }]}
            numberOfLines={2}
          >
            {item.body}
          </AppText>
          <AppText style={[styles.time, { color: textMuted }]}>
            {item.time}
          </AppText>
        </View>

        {/* Unread indicator */}
        {isUnread && <View style={styles.unreadDot} />}
      </Pressable>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off-outline" size={64} color={textMuted} />
      <AppText style={[styles.emptyText, { color: textSecondary }]}>
        No notifications
      </AppText>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header with back arrow */}
      <AppHeader
        title="Notifications"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      {/* Mark all as read */}
      <TouchableOpacity
        onPress={handleMarkAllRead}
        style={styles.markAllRow}
        disabled={allRead}
      >
        <AppText
          style={[styles.markAllText, { color: allRead ? textMuted : primary }]}
        >
          Mark all as read
        </AppText>
      </TouchableOpacity>

      {/* Notification list */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={notifications.length === 0 && styles.emptyList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  markAllRow: {
    alignItems: "flex-end",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  markAllText: {
    fontSize: 13,
    fontWeight: "600",
  },
  notificationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textBlock: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  body: {
    fontSize: 13,
    marginBottom: 4,
  },
  time: {
    fontSize: 11,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2E7DFF", // blue for unread dot
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: "center",
  },
  emptyList: {
    flexGrow: 1,
  },
});
