// src/screens/shared/NotificationsScreen.js
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  AppState,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import { useTheme } from "../../hooks/useTheme";

export default function NotificationsScreen({ navigation }) {
  const { theme } = useTheme();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const pollRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.notifications.list);
      const list = res.data?.data?.notifications || [];
      setNotifications(list);
      setUnreadCount(list.filter(n => !n.isRead).length);
    } catch (err) {
      console.warn("Notifications fetch:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
      pollRef.current = setInterval(fetchNotifications, 15000); // poll every 15s
      return () => {
        if (pollRef.current) clearInterval(pollRef.current);
      };
    }, [])
  );

  const primary = theme.colors.primary || "#2E7D32";
  const backgroundColor = theme.colors.background || "#F9FBF9";
  const surface = theme.colors.surface || "#FFFFFF";
  const textPrimary = theme.colors.textPrimary || "#1A2E1A";
  const textSecondary = theme.colors.textSecondary || "#4A6741";
  const textMuted = theme.colors.textMuted || "#8FAF8A";
  const borderColor = theme.colors.border || "#E0E0E0";

  const handleMarkRead = async (id) => {
    try {
      await api.patch(API_ENDPOINTS.notifications.markRead(id));
      setNotifications((prev) =>
        prev.map((n) => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (_) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch(API_ENDPOINTS.notifications.markAllRead);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (_) {}
  };

  const allRead = unreadCount === 0;

  const renderItem = ({ item }) => {
    const isUnread = !item.isRead;
    const TYPE_CONFIG = {
      new_message:        { icon: "chatbubbles-outline",      color: theme.colors.info || "#2196F3" },
      new_order:          { icon: "receipt-outline",          color: primary },
      order_update:       { icon: "bicycle-outline",          color: theme.colors.warning || "#FF9800" },
      account_approved:   { icon: "shield-checkmark-outline", color: theme.colors.success || "#4CAF50" },
      account_rejected:   { icon: "close-circle-outline",     color: theme.colors.error || "#F44336" },
    };
    const config = TYPE_CONFIG[item.type] || { icon: "notifications-outline", color: primary };

    return (
      <Pressable
        onPress={() => handleMarkRead(item._id || item.id)}
        style={[
          styles.notificationRow,
          {
            backgroundColor: isUnread ? primary + "08" : surface,
            borderBottomColor: borderColor,
          },
        ]}
      >
        {/* Left icon */}
        <View style={[styles.iconCircle, { backgroundColor: config.color }]}>
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
            {item.message || item.body}
          </AppText>
          <AppText style={[styles.time, { color: textMuted }]}>
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : item.time}
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
        keyExtractor={(item) => item._id || item.id}
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
