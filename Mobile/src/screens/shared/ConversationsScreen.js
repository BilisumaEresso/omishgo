// Mobile/src/screens/shared/ConversationsScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
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
import DashboardLayout from "../../components/layout/DashBoardLayout";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";

const formatRelativeTime = (iso, t) => {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t("conversationsScreen.timeNow");
  if (mins < 60) return t("conversationsScreen.timeMinutes", { mins });
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return t("conversationsScreen.timeHours", { hrs });
  return t("conversationsScreen.timeDays", { days: Math.floor(hrs / 24) });
};

const ConvoRow = ({ convo, onPress, theme, t, isLast }) => {
  const primary = theme?.colors?.primary || "#1565C0";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";
  const hasUnread = convo.unreadCount > 0;
  const partnerName = convo.partnerName || t("conversationsScreen.unknownPartner");
  const initials = (partnerName || "?")[0].toUpperCase();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.convoCard,
        { backgroundColor: surface },
        !isLast && styles.convoCardMargin,
      ]}
    >
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: primary }]}>
        <AppText style={styles.avatarText}>{initials}</AppText>
      </View>

      {/* Content */}
      <View style={styles.convoContent}>
        <View style={styles.convoTop}>
          <AppText
            style={[
              styles.partnerName,
              { color: textPrimary },
              hasUnread && styles.partnerNameBold,
            ]}
            numberOfLines={1}
          >
            {partnerName}
          </AppText>
          <AppText style={[styles.timeText, { color: textSecondary }]}>
            {formatRelativeTime(convo.lastMessageAt, t)}
          </AppText>
        </View>
        <View style={styles.convoBottom}>
          <AppText
            style={[
              styles.preview,
              { color: textSecondary },
              hasUnread && styles.previewBold,
            ]}
            numberOfLines={1}
          >
            {convo.lastMessage || "…"}
          </AppText>
          {hasUnread && (
            <View style={[styles.badge, { backgroundColor: primary }]}>
              <AppText style={styles.badgeText}>
                {convo.unreadCount > 99 ? "99+" : convo.unreadCount}
              </AppText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ConversationsScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const primary = theme?.colors?.primary || "#1565C0";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";
  const errorColor = theme?.colors?.error || "#EF4444";

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
          t("conversationsScreen.errorLoadConversations")
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleOpen = (convo) => {
    navigation.navigate("Chat", {
      userId: convo.partnerId,
      userName: convo.partnerName,
    });
  };

  return (
    <DashboardLayout
      role="buyer"
      title={t("messaging.conversations", { defaultValue: "Messages" })}
      showBack
      onBackPress={() => navigation.goBack()}
      scrollable={false}
    >
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color={errorColor} />
          <AppText style={[styles.errorText, { color: errorColor }]}>{error}</AppText>
          <AppButton title={t("conversationsScreen.retry")} onPress={() => fetchConversations()} />
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => String(item.partnerId)}
          renderItem={({ item, index }) => (
            <ConvoRow
              convo={item}
              onPress={() => handleOpen(item)}
              theme={theme}
              t={t}
              isLast={index === conversations.length - 1}
            />
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchConversations(true)}
              colors={[primary]}
              tintColor={primary}
            />
          }
          contentContainerStyle={[
            styles.listContent,
            conversations.length === 0 && { flex: 1 },
          ]}
          ListEmptyComponent={
            <View style={styles.center}>
              <View style={[styles.emptyIconBg, { backgroundColor: primary + "12" }]}>
                <Ionicons name="chatbubbles-outline" size={48} color={primary} />
              </View>
              <AppText style={[styles.emptyTitle, { color: "#0F172A" }]}>
                {t("messaging.noConversations", { defaultValue: "No conversations yet" })}
              </AppText>
              <AppText style={[styles.emptySub, { color: textSecondary }]}>
                {t("messaging.startConvoHint", { defaultValue: "Browse a listing and message a farmer to start." })}
              </AppText>
            </View>
          }
        />
      )}
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  convoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 12,
  },
  convoCardMargin: {
    marginBottom: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
  },
  convoContent: {
    flex: 1,
    gap: 4,
  },
  convoTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  convoBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  partnerName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  partnerNameBold: {
    fontWeight: "800",
  },
  timeText: {
    fontSize: 11,
    flexShrink: 0,
  },
  preview: {
    flex: 1,
    fontSize: 13,
  },
  previewBold: {
    fontWeight: "700",
    color: "#0F172A",
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    flexShrink: 0,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
  },
  emptyIconBg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  emptySub: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
});
