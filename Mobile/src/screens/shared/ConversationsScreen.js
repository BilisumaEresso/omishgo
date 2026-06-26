// Mobile/src/screens/shared/ConversationsScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from "react-native";
import { useTranslation } from "react-i18next";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppText from "../../components/common/AppText";
import AppButton from "../../components/common/AppButton";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";

// ─── Conversation row ─────────────────────────────────────────────────────────
const ConvoRow = ({ convo, onPress, theme }) => {
  const hasUnread = convo.unreadCount > 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.row, { backgroundColor: theme.colors.surface || "#fff", borderBottomColor: theme.colors.border || "#f0f0f0" }]}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: theme.colors.primary || "#2e7d32" }]}>
        <AppText style={styles.avatarText}>
          {(convo.partnerName || "?")[0].toUpperCase()}
        </AppText>
      </View>

      {/* Text content */}
      <View style={styles.rowContent}>
        <View style={styles.rowTop}>
          <AppText
            variant="headingSm"
            style={[styles.partnerName, { color: theme.colors.textPrimary || "#333" }, hasUnread && styles.bold]}
          >
            {convo.partnerName || "Unknown"}
          </AppText>
          <AppText variant="label" style={{ color: theme.colors.textSecondary || "#aaa" }}>
            {formatRelativeTime(convo.lastMessageAt)}
          </AppText>
        </View>
        <View style={styles.rowBottom}>
          <AppText
            variant="bodyMd"
            style={[styles.preview, { color: theme.colors.textSecondary || "#888" }, hasUnread && styles.previewUnread]}
            numberOfLines={1}
          >
            {convo.lastMessage || "…"}
          </AppText>
          {hasUnread && (
            <View style={[styles.badge, { backgroundColor: theme.colors.primary || "#2e7d32" }]}>
              <AppText style={styles.badgeText}>{convo.unreadCount}</AppText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const formatRelativeTime = (iso) => {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ConversationsScreen({ navigation }) {
  const { t }     = useTranslation();
  const { theme } = useTheme();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [refreshing, setRefreshing]       = useState(false);
  const [error, setError]                 = useState("");

  const fetchConversations = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const res = await api.get(API_ENDPOINTS.messages.conversations);
      setConversations(res.data?.data?.conversations || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load conversations");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  const handleOpen = (convo) => {
    navigation.navigate("Chat", {
      userId:   convo.partnerId,
      userName: convo.partnerName,
    });
  };

  // ── Render states ──
  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary || "#2e7d32"} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper padding={false}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface || "#fff", borderBottomColor: theme.colors.border || "#e8e8e8" }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <AppText variant="headingMd" style={{ color: theme.colors.primary || "#2e7d32" }}>←</AppText>
        </TouchableOpacity>
        <AppText variant="headingMd">
          {t("messaging.conversations") || "Messages"}
        </AppText>
      </View>

      {error ? (
        <View style={styles.center}>
          <AppText style={{ color: theme.colors.error || "red", textAlign: "center", marginBottom: 12 }}>{error}</AppText>
          <AppButton title="Retry" onPress={() => fetchConversations()} />
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => String(item.partnerId)}
          renderItem={({ item }) => (
            <ConvoRow convo={item} onPress={() => handleOpen(item)} theme={theme} />
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchConversations(true)}
              colors={[theme.colors.primary || "#2e7d32"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <AppText style={{ fontSize: 48, marginBottom: 12 }}>💬</AppText>
              <AppText variant="headingSm" style={{ color: theme.colors.textSecondary || "#888", textAlign: "center" }}>
                {t("messaging.noConversations") || "No conversations yet"}
              </AppText>
              <AppText variant="bodyMd" style={{ color: theme.colors.textSecondary || "#aaa", textAlign: "center", marginTop: 6 }}>
                {t("messaging.startConvoHint") || "Browse a listing and message a farmer to start."}
              </AppText>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 10,
  },
  backBtn: { padding: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 14,
  },
  avatar: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 18 },
  rowContent: { flex: 1, gap: 3 },
  rowTop:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rowBottom:  { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  partnerName: { flex: 1 },
  bold:        { fontWeight: "700" },
  preview:     { flex: 1, marginRight: 8 },
  previewUnread: { fontWeight: "600", color: "#333" },
  badge: {
    minWidth: 20, height: 20, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
    paddingHorizontal: 5,
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },
});
