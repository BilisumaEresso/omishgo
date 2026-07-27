// Mobile/src/screens/shared/ChatScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Keyboard,
  Linking,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

const POLL_INTERVAL_MS = 5000;

const formatTime = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// ─── Sourcing Action Card ─────────────────────────────────────────────────────
const SourcingActionCard = ({ data, isMe, onAccept, onReject, role }) => {
  const { t } = useTranslation();
  if (!data) return null;
  const isPending = data.status === "pending";
  const isAccepted = data.status === "accepted";
  const isRejected = data.status === "rejected";
  const isMatched = data.status === "matched_listing";

  return (
    <View style={styles.actionCard}>
      <View style={styles.actionCardHeader}>
        <View style={styles.actionCardIconBg}>
          <Ionicons name="cube" size={14} color="#1565C0" />
        </View>
        <AppText style={styles.actionCardTitle}>{t("chat.bulkSourcingReq", { defaultValue: "Bulk Sourcing Request" })}</AppText>
      </View>

      <AppText style={styles.actionSpecs}>
        • Crop: {data.cropType}{"\n"}
        • Quantity: {data.quantity} {data.unit || "q"}{"\n"}
        • Target Rate: ETB {data.targetPrice} / {data.unit || "q"}{"\n"}
        • Destination: {data.deliveryRegion}
      </AppText>

      {!isMe && role === "farmer" && isPending && (
        <View style={styles.actionBtnRow}>
          <TouchableOpacity style={styles.acceptBtn} onPress={() => onAccept(data)} activeOpacity={0.85}>
            <AppText style={styles.acceptBtnText}>✓ Accept & List</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectBtn} onPress={() => onReject(data)} activeOpacity={0.85}>
            <AppText style={styles.rejectBtnText}>✕ Decline</AppText>
          </TouchableOpacity>
        </View>
      )}

      {isAccepted && (
        <View style={styles.statusPillSuccess}>
          <Ionicons name="checkmark-circle" size={14} color="#10B981" />
          <AppText style={styles.statusPillSuccessText}>{t("chat.acceptedListingLive", "Accepted — Produce Listing Live")}</AppText>
        </View>
      )}

      {isRejected && (
        <View style={styles.statusPillDeclined}>
          <Ionicons name="close-circle" size={14} color="#EF4444" />
          <AppText style={styles.statusPillDeclinedText}>{t("chat.declinedOutOfStock", { defaultValue: "Declined / Out of Stock" })}</AppText>
        </View>
      )}

      {isMatched && (
        <View style={styles.statusPillMatched}>
          <Ionicons name="bag-check" size={14} color="#1565C0" />
          <AppText style={styles.statusPillMatchedText}>{t("chat.matchingHarvest", { defaultValue: "Matching Harvest Posted" })}</AppText>
        </View>
      )}
    </View>
  );
};

// ─── Message Bubble ───────────────────────────────────────────────────────────
const MessageBubble = ({ message, isMe, showAvatar, avatarLetter, theme, onAccept, onReject, role }) => {
  const primary = theme?.colors?.primary || "#1565C0";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";

  return (
    <View style={[styles.bubbleRow, isMe ? styles.rowRight : styles.rowLeft]}>
      {!isMe && (
        showAvatar ? (
          <View style={[styles.avatarSmall, { backgroundColor: primary }]}>
            <AppText style={styles.avatarText}>{avatarLetter}</AppText>
          </View>
        ) : (
          <View style={{ width: 34 }} />
        )
      )}

      <View
        style={[
          styles.bubble,
          isMe
            ? [styles.bubbleMe, { backgroundColor: primary }]
            : [styles.bubbleThem, { backgroundColor: surface }],
        ]}
      >
        <AppText style={{ color: isMe ? "#FFFFFF" : textPrimary, fontSize: 14.5, lineHeight: 21, fontWeight: "400" }}>
          {message.content}
        </AppText>

        {message.sourcingRequestData && (
          <SourcingActionCard
            data={message.sourcingRequestData}
            isMe={isMe}
            onAccept={onAccept}
            onReject={onReject}
            role={role}
          />
        )}

        <View style={styles.metaRow}>
          <AppText style={[styles.timestamp, { color: isMe ? "rgba(255,255,255,0.7)" : textSecondary }]}>
            {formatTime(message.createdAt)}
          </AppText>
          {isMe && (
            <Ionicons
              name={message.isRead ? "checkmark-done" : "checkmark"}
              size={14}
              color={message.isRead ? "#4ADE80" : "rgba(255,255,255,0.7)"}
              style={{ marginLeft: 4 }}
            />
          )}
        </View>
      </View>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ChatScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const currentUser = useAuthStore((state) => state.user);

  const { userId, userName, phoneNumber } = route.params || {};

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const keyboardHeight = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const latestMsgCount = useRef(0);

  const primary = theme?.colors?.primary || "#1565C0";
  const background = "#F1F5F9";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";

  const isSupportChat =
    userId === "support" ||
    userId === "admin" ||
    (userName && userName.toLowerCase().includes("support"));

  const targetPhone = phoneNumber || (isSupportChat ? "0938730818" : null);

  // Smooth Animated Keyboard listener (Zero 3rd party native dependencies required)
  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      Animated.timing(keyboardHeight, {
        toValue: e.endCoordinates.height,
        duration: Platform.OS === "ios" ? e.duration || 250 : 150,
        useNativeDriver: false,
      }).start();
    });

    const hideSub = Keyboard.addListener(hideEvent, (e) => {
      Animated.timing(keyboardHeight, {
        toValue: 0,
        duration: Platform.OS === "ios" ? e.duration || 200 : 150,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [keyboardHeight]);

  const fetchThread = useCallback(
    async (silent = false) => {
      if (!userId) return;
      if (!silent) setLoading(true);
      try {
        const res = await api.get(API_ENDPOINTS.messages.thread(userId));
        const fetched = res.data?.data?.messages || [];
        if (fetched.length !== latestMsgCount.current) {
          latestMsgCount.current = fetched.length;
          setMessages(fetched);
        }
        setError("");
      } catch (err) {
        if (!silent) {
          setError(err?.response?.data?.message || err.message || t("chatScreen.errorLoadMessages"));
        }
      } finally {
        setLoading(false);
      }
    },
    [userId, t]
  );

  useEffect(() => {
    fetchThread();
    const interval = setInterval(() => fetchThread(true), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchThread]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const optimistic = {
      _id: `opt-${Date.now()}`,
      senderId: currentUser?._id || currentUser?.id || "me",
      receiverId: userId,
      content: trimmed,
      createdAt: new Date().toISOString(),
      isRead: false,
      _optimistic: true,
    };

    setMessages((prev) => [...prev, optimistic]);
    setText("");
    setSending(true);

    try {
      const res = await api.post(API_ENDPOINTS.messages.send, {
        receiverId: userId,
        content: trimmed,
      });
      const saved = res.data?.data?.message;
      if (saved) {
        setMessages((prev) => prev.map((m) => (m._id === optimistic._id ? saved : m)));
        latestMsgCount.current += 1;
      }
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m._id !== optimistic._id));
      setError(err?.response?.data?.message || t("chatScreen.errorSendMessage"));
    } finally {
      setSending(false);
    }
  };

  const handleAcceptRequest = (sourcingData) => {
    navigation?.navigate("PostProduct", {
      prefill: {
        cropType: sourcingData.cropType,
        quantity: sourcingData.quantity,
        price: sourcingData.targetPrice,
        unit: sourcingData.unit || "q",
        sourcingRequestId: sourcingData.sourcingRequestId,
      },
    });
  };

  const handleRejectRequest = async (sourcingData) => {
    try {
      const reqId = sourcingData.sourcingRequestId;
      if (!reqId) return;
      await api.post(API_ENDPOINTS.sourcing.respond(reqId), { action: "rejected" });
      await fetchThread(true);
    } catch (err) {
      console.warn("Reject request error:", err.message);
    }
  };

  const myId = currentUser?._id || currentUser?.id;
  const isMe = (msg) => {
    const sid = msg.senderId?._id || msg.senderId;
    return sid === myId;
  };

  const messagesWithSeparators = useCallback(() => {
    if (!messages.length) return [];

    const reversed = [];
    let currentDateGroup = null;

    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      const msgDateStr = new Date(msg.createdAt).toDateString();

      if (currentDateGroup !== null && currentDateGroup !== msgDateStr) {
        reversed.push({
          type: "date",
          date: currentDateGroup,
          id: `date-${currentDateGroup}`,
        });
      }

      currentDateGroup = msgDateStr;
      reversed.push({ type: "message", ...msg, id: msg._id });
    }

    if (currentDateGroup) {
      reversed.push({
        type: "date",
        date: currentDateGroup,
        id: `date-${currentDateGroup}`,
      });
    }

    return reversed;
  }, [messages]);

  const renderItem = ({ item, index }) => {
    if (item.type === "date") {
      return (
        <View style={styles.dateSeparator}>
          <AppText style={styles.dateText}>{item.date}</AppText>
        </View>
      );
    }

    const invertedList = messagesWithSeparators();
    const showAvatar =
      !isMe(item) &&
      (index === invertedList.length - 1 ||
        invertedList[index + 1]?.type === "date" ||
        isMe(invertedList[index + 1]));

    const avatarLetter = userName?.charAt(0).toUpperCase() || "?";

    return (
      <MessageBubble
        message={item}
        isMe={isMe(item)}
        showAvatar={showAvatar}
        avatarLetter={avatarLetter}
        theme={theme}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
        role={currentUser?.role}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      {/* Header */}
      <AppHeader
        title={userName || "Chat"}
        showBack
        onBackPress={() => navigation.goBack()}
        rightComponent={
          targetPhone ? (
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => Linking.openURL(`tel:${targetPhone}`)}
              activeOpacity={0.8}
            >
              <Ionicons name="call" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          ) : null
        }
      />

      <Animated.View style={{ flex: 1, paddingBottom: keyboardHeight }}>
        <View style={{ flex: 1 }}>
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={primary} />
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messagesWithSeparators()}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              inverted
              contentContainerStyle={styles.messageList}
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>

        {/* Error banner */}
        {!!error && (
          <View style={[styles.errorBanner, { backgroundColor: "#FEF2F2" }]}>
            <Ionicons name="alert-circle" size={16} color="#DC2626" />
            <AppText style={{ color: "#DC2626", fontSize: 13, flex: 1 }}>{error}</AppText>
          </View>
        )}

        {/* Floating Input Bar */}
        <View
          style={[
            styles.floatingInputWrapper,
            { paddingBottom: Math.max(insets.bottom, 8) },
          ]}
        >
          <View style={[styles.floatingInputCard, { backgroundColor: surface }]}>
            {/* Attachment (+) Button */}
            <TouchableOpacity
              style={styles.attachBtn}
              onPress={() => {}}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle" size={26} color={primary} />
            </TouchableOpacity>

            {/* Wide Multiline Input Field */}
            <TextInput
              style={[styles.inputField, { color: textPrimary }]}
              placeholder={t("chat.typeMessage", { defaultValue: "Type a message..." })}
              placeholderTextColor={textSecondary}
              value={text}
              onChangeText={setText}
              multiline
              maxLength={1500}
            />

            {/* Dynamic Send / Mic Action Button */}
            <TouchableOpacity
              style={[
                styles.sendFab,
                { backgroundColor: text.trim() ? primary : primary + "25" },
              ]}
              onPress={handleSend}
              disabled={!text.trim() || sending}
              activeOpacity={0.8}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons
                  name={text.trim() ? "send" : "mic"}
                  size={18}
                  color={text.trim() ? "#FFFFFF" : primary}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  messageList: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 16,
  },
  dateSeparator: { alignItems: "center", marginVertical: 14 },
  dateText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    overflow: "hidden",
  },
  bubbleRow: { flexDirection: "row", marginVertical: 3, alignItems: "flex-end" },
  rowRight: { justifyContent: "flex-end" },
  rowLeft: { justifyContent: "flex-start" },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  avatarText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 9,
    maxWidth: "82%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bubbleMe: {
    borderBottomRightRadius: 4,
    marginRight: 2,
  },
  bubbleThem: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
    gap: 2,
  },
  timestamp: { fontSize: 10.5 },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 12,
    marginBottom: 6,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  /* Floating WhatsApp / Telegram Input Bar */
  floatingInputWrapper: {
    paddingHorizontal: 10,
    paddingTop: 6,
  },
  floatingInputCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 26,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    gap: 6,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  attachBtn: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  inputField: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    maxHeight: 110,
    paddingHorizontal: 6,
    paddingVertical: Platform.OS === "ios" ? 8 : 4,
  },
  sendFab: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Sourcing Action Card */
  actionCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  actionCardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  actionCardIconBg: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
  },
  actionCardTitle: { fontSize: 13, fontWeight: "800", color: "#0F172A" },
  actionSpecs: { fontSize: 12.5, color: "#334155", lineHeight: 19, marginBottom: 8 },
  actionBtnRow: { flexDirection: "row", gap: 8 },
  acceptBtn: {
    flex: 1,
    backgroundColor: "#16A34A",
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: "center",
  },
  acceptBtnText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  rejectBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    alignItems: "center",
  },
  rejectBtnText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  statusPillSuccess: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    justifyContent: "center",
  },
  statusPillSuccessText: { color: "#059669", fontSize: 11.5, fontWeight: "700" },
  statusPillDeclined: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEF2F2",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    justifyContent: "center",
  },
  statusPillDeclinedText: { color: "#DC2626", fontSize: 11.5, fontWeight: "700" },
  statusPillMatched: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EFF6FF",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    justifyContent: "center",
  },
  statusPillMatchedText: { color: "#1D4ED8", fontSize: 11.5, fontWeight: "700" },
});
