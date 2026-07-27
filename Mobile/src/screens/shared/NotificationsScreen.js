// src/screens/shared/NotificationsScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import AppText from "../../components/common/AppText";
import DashboardLayout from "../../components/layout/DashBoardLayout";
import { useTheme } from "../../hooks/useTheme";
import { useNotificationStore } from "../../store/notification.store";

const TYPE_CONFIG = {
  new_message: { icon: "chatbubbles", color: "#2563EB", label: "Message" },
  new_order: { icon: "receipt", color: "#16A34A", label: "Order" },
  order_update: { icon: "bicycle", color: "#D97706", label: "Order Update" },
  account_approved: { icon: "shield-checkmark", color: "#059669", label: "Account Verified" },
  account_rejected: { icon: "close-circle", color: "#DC2626", label: "Account Alert" },
  system: { icon: "information-circle", color: "#1565C0", label: "System Notification" },
};

export default function NotificationsScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } =
    useNotificationStore();

  const [selectedNotif, setSelectedNotif] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications])
  );

  const primary = theme?.colors?.primary || "#1565C0";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";

  const allRead = unreadCount === 0;

  const handleTapNotification = (item) => {
    markAsRead(item._id || item.id);
    setSelectedNotif(item);
  };

  const handleNavigateFromModal = (item) => {
    setSelectedNotif(null);
    if (!item) return;

    if (item.type === "new_message") {
      const partnerId = item.data?.senderId || item.metadata?.senderId;
      const partnerName = item.data?.senderName || item.metadata?.senderName;
      if (partnerId) {
        navigation.navigate("Chat", { userId: partnerId, userName: partnerName });
      } else {
        navigation.navigate("Conversations");
      }
    } else if (item.type === "new_order" || item.type === "order_update") {
      const orderId = item.data?.orderId || item.metadata?.orderId;
      if (orderId) {
        navigation.navigate("OrderDetail", { order: { _id: orderId } });
      } else {
        navigation.navigate("Orders");
      }
    }
  };

  const renderItem = ({ item, index }) => {
    const isUnread = !item.isRead;
    const config = TYPE_CONFIG[item.type] || { icon: "notifications", color: primary, label: "Notification" };
    const isLast = index === notifications.length - 1;

    return (
      <TouchableOpacity
        onPress={() => handleTapNotification(item)}
        activeOpacity={0.75}
        style={[
          styles.notifCard,
          { backgroundColor: surface },
          isUnread && { borderLeftWidth: 3.5, borderLeftColor: primary },
          !isLast && styles.notifCardMargin,
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: config.color + "18" }]}>
          <Ionicons name={config.icon} size={20} color={config.color} />
        </View>

        <View style={styles.textBlock}>
          <AppText style={[styles.notifTitle, { color: textPrimary }]} numberOfLines={1}>
            {item.title}
          </AppText>
          <AppText style={[styles.notifBody, { color: textSecondary }]} numberOfLines={2}>
            {item.message || item.body}
          </AppText>
          <AppText style={styles.notifTime}>
            {item.createdAt ? new Date(item.createdAt).toLocaleString() : item.time}
          </AppText>
        </View>

        {isUnread && <View style={[styles.unreadDot, { backgroundColor: primary }]} />}
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconBg, { backgroundColor: primary + "12" }]}>
        <Ionicons name="notifications-off-outline" size={48} color={primary} />
      </View>
      <AppText style={[styles.emptyTitle, { color: textPrimary }]}>
        {t("notificationsScreen.empty")}
      </AppText>
      <AppText style={[styles.emptySub, { color: textSecondary }]}>
        {t("notificationsScreen.emptySub", "You are all caught up. New alerts will appear here.")}
      </AppText>
    </View>
  );

  return (
    <DashboardLayout
      role="buyer"
      title={t("notificationsScreen.title")}
      showBack
      onBackPress={() => navigation.goBack()}
      scrollable={false}
    >
      {/* Mark all row */}
      <TouchableOpacity
        onPress={markAllAsRead}
        style={styles.markAllRow}
        disabled={allRead}
        activeOpacity={0.75}
      >
        <Ionicons
          name="checkmark-done-outline"
          size={16}
          color={allRead ? "#94A3B8" : primary}
        />
        <AppText style={[styles.markAllText, { color: allRead ? "#94A3B8" : primary }]}>
          {t("notificationsScreen.markAllRead")}
        </AppText>
      </TouchableOpacity>

      {/* Unread count chip */}
      {!allRead && (
        <View style={[styles.unreadChip, { backgroundColor: primary + "12" }]}>
          <AppText style={[styles.unreadChipText, { color: primary }]}>
            {t("notificationsScreen.unreadCount", { count: unreadCount, defaultValue: `${unreadCount} unread notification(s)` })}
          </AppText>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id || item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.listContent,
          notifications.length === 0 && { flex: 1 },
        ]}
        showsVerticalScrollIndicator={false}
      />

      {/* Detail Alert Modal */}
      <Modal
        visible={!!selectedNotif}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedNotif(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedNotif(null)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalCard, { backgroundColor: surface }]}>
                {selectedNotif && (() => {
                  const config = TYPE_CONFIG[selectedNotif.type] || {
                    icon: "notifications",
                    color: primary,
                    label: "System Alert",
                  };
                  const hasTarget =
                    selectedNotif.type === "new_message" ||
                    selectedNotif.type === "new_order" ||
                    selectedNotif.type === "order_update";

                  return (
                    <>
                      <View style={[styles.modalIconCircle, { backgroundColor: config.color + "18" }]}>
                        <Ionicons name={config.icon} size={32} color={config.color} />
                      </View>

                      <View style={styles.modalTagRow}>
                        <View style={[styles.modalTag, { backgroundColor: config.color + "15" }]}>
                          <AppText style={[styles.modalTagText, { color: config.color }]}>
                            {config.label}
                          </AppText>
                        </View>
                      </View>

                      <AppText style={[styles.modalTitle, { color: textPrimary }]}>
                        {selectedNotif.title}
                      </AppText>

                      <AppText style={[styles.modalBody, { color: textSecondary }]}>
                        {selectedNotif.message || selectedNotif.body || "No detailed content provided."}
                      </AppText>

                      <AppText style={styles.modalTime}>
                        {selectedNotif.createdAt
                          ? new Date(selectedNotif.createdAt).toLocaleString()
                          : selectedNotif.time || "Just now"}
                      </AppText>

                      <View style={styles.modalBtnRow}>
                        {hasTarget && (
                          <TouchableOpacity
                            style={[styles.modalPrimaryBtn, { backgroundColor: primary }]}
                            onPress={() => handleNavigateFromModal(selectedNotif)}
                            activeOpacity={0.85}
                          >
                            <AppText style={styles.modalPrimaryBtnText}>
                              {selectedNotif.type === "new_message" ? "Open Chat" : "View Order"}
                            </AppText>
                          </TouchableOpacity>
                        )}

                        <TouchableOpacity
                          style={[
                            styles.modalCloseBtn,
                            !hasTarget && { backgroundColor: primary, flex: 1 },
                          ]}
                          onPress={() => setSelectedNotif(null)}
                          activeOpacity={0.85}
                        >
                          <AppText
                            style={[
                              styles.modalCloseBtnText,
                              !hasTarget ? { color: "#FFFFFF" } : { color: textSecondary },
                            ]}
                          >
                            {hasTarget ? "Close" : "Got It"}
                          </AppText>
                        </TouchableOpacity>
                      </View>
                    </>
                  );
                })()}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  markAllRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-end",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  markAllText: {
    fontSize: 13,
    fontWeight: "600",
  },
  unreadChip: {
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  unreadChipText: {
    fontSize: 12,
    fontWeight: "700",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  notifCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 12,
  },
  notifCardMargin: {
    marginBottom: 10,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textBlock: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  notifBody: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  notifTime: {
    fontSize: 11,
    color: "#94A3B8",
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 12,
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

  /* Alert Detail Modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  modalIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  modalTagRow: {
    marginBottom: 10,
  },
  modalTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modalTagText: {
    fontSize: 12,
    fontWeight: "700",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  modalBody: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 14,
  },
  modalTime: {
    fontSize: 11,
    color: "#94A3B8",
    marginBottom: 20,
  },
  modalBtnRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  modalPrimaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  modalPrimaryBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  modalCloseBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
  modalCloseBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
