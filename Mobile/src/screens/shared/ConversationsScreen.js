// Mobile/src/screens/shared/ConversationsScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AppButton from "../../components/common/AppButton";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";

// ─── Conversation row ─────────────────────────────────────────────────────────
const ConvoRow = ({ convo, onPress, theme }) => {
  // Extract theme colors
  const primary = theme?.colors?.primary || "#2E7D32";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#E0E0E0";
  const textPrimary = theme?.colors?.textPrimary || "#1A2E1A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6741";

  const hasUnread = convo.unreadCount > 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.row,
        {
          backgroundColor: surface,
          borderBottomColor: border,
        },
      ]}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: primary }]}>
        <AppText style={[styles.avatarText, { color: surface }]}>
          {(convo.partnerName || "?")[0].toUpperCase()}
        </AppText>
      </View>

      {/* Text content */}
      <View style={styles.rowContent}>
        <View style={styles.rowTop}>
          <AppText
            variant="headingSm"
            style={[
              styles.partnerName,
              { color: textPrimary },
              hasUnread && styles.bold,
            ]}
          >
            {convo.partnerName || "Unknown"}
          </AppText>
          <AppText variant="label" style={{ color: textSecondary }}>
            {formatRelativeTime(convo.lastMessageAt)}
          </AppText>
        </View>
        <View style={styles.rowBottom}>
          <AppText
            variant="bodyMd"
            style={[
              styles.preview,
              { color: textSecondary },
              hasUnread && styles.previewUnread,
            ]}
            numberOfLines={1}
          >
            {convo.lastMessage || "…"}
          </AppText>
          {hasUnread && (
            <View style={[styles.badge, { backgroundColor: primary }]}>
              <AppText style={[styles.badgeText, { color: surface }]}>
                {convo.unreadCount}
              </AppText>
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
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ConversationsScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Extract theme colors
  const primary = theme?.colors?.primary || "#2E7D32";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const background = theme?.colors?.background || "#F5F5F5";
  const textPrimary = theme?.colors?.textPrimary || "#1A2E1A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6741";
  const textMuted = theme?.colors?.textMuted || "#8FAF8A";
  const errorColor = theme?.colors?.error || "#F44336";

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchConversations = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const res = await api.get(API_ENDPOINTS.messages.conversations);
      setConversations(res.data?.data?.conversations || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load conversations",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleOpen = (convo) => {
    navigation.navigate("Chat", {
      userId: convo.partnerId,
      userName: convo.partnerName,
    });
  };

  // ── Loading state ──
  if (loading) {
    return (
      <View style={[styles.screen, { backgroundColor: background }]}>
        <AppHeader
          title={t("messaging.conversations") || "Messages"}
          showBack={true}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: background }]}>
      <AppHeader
        title={t("messaging.conversations") || "Messages"}
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      {error ? (
        <View style={styles.center}>
          <AppText
            style={{ color: errorColor, textAlign: "center", marginBottom: 12 }}
          >
            {error}
          </AppText>
          <AppButton title="Retry" onPress={() => fetchConversations()} />
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => String(item.partnerId)}
          renderItem={({ item }) => (
            <ConvoRow
              convo={item}
              onPress={() => handleOpen(item)}
              theme={theme}
            />
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchConversations(true)}
              colors={[primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              {/* Replaced emoji with Ionicons */}
              <Ionicons
                name="chatbubbles-outline"
                size={48}
                color={textSecondary}
              />
              <AppText
                variant="headingSm"
                style={{
                  color: textSecondary,
                  textAlign: "center",
                  marginTop: 12,
                }}
              >
                {t("messaging.noConversations") || "No conversations yet"}
              </AppText>
              <AppText
                variant="bodyMd"
                style={{ color: textMuted, textAlign: "center", marginTop: 6 }}
              >
                {t("messaging.startConvoHint") ||
                  "Browse a listing and message a farmer to start."}
              </AppText>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 14,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontWeight: "700", fontSize: 18 },
  rowContent: { flex: 1, gap: 3 },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  partnerName: { flex: 1 },
  bold: { fontWeight: "700" },
  preview: { flex: 1, marginRight: 8 },
  previewUnread: { fontWeight: "600" },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  badgeText: { fontSize: 11, fontWeight: "700" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
});
