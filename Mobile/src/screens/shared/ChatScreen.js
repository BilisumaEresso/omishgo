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
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// ─── Interactive Sourcing Request Card ───────────────────────────────────────
const SourcingActionCard = ({ data, isMe, onAccept, onReject, role }) => {
  if (!data) return null;
  const isPending = data.status === "pending";
  const isAccepted = data.status === "accepted";
  const isRejected = data.status === "rejected";
  const isMatched = data.status === "matched_listing";

  return (
    <View style={styles.actionCard}>
      <View style={styles.actionCardHeader}>
        <Ionicons name="cube-outline" size={18} color="#1565C0" />
        <AppText style={styles.actionCardTitle}>Bulk Sourcing Request Specs</AppText>
      </View>

      <AppText style={styles.actionSpecs}>
        • Crop: {data.cropType}{"\n"}
        • Quantity: {data.quantity} {data.unit || "q"}{"\n"}
        • Target Rate: ETB {data.targetPrice} / {data.unit || "q"}{"\n"}
        • Destination: {data.deliveryRegion}
      </AppText>

      {/* Interactive Action Buttons for Farmer */}
      {!isMe && role === "farmer" && isPending && (
        <View style={styles.actionBtnRow}>
          <TouchableOpacity style={styles.acceptBtn} onPress={() => onAccept(data)}>
            <AppText style={styles.acceptBtnText}>✓ Accept & List Produce</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectBtn} onPress={() => onReject(data)}>
            <AppText style={styles.rejectBtnText}>✕ Decline</AppText>
          </TouchableOpacity>
        </View>
      )}

      {isAccepted && (
        <View style={styles.statusPillSuccess}>
          <AppText style={styles.statusPillSuccessText}>✓ Accepted — Produce Listing Created</AppText>
        </View>
      )}

      {isRejected && (
        <View style={styles.statusPillDeclined}>
          <AppText style={styles.statusPillDeclinedText}>Declined / Out of Stock</AppText>
        </View>
      )}

      {isMatched && (
        <View style={styles.statusPillMatched}>
          <AppText style={styles.statusPillMatchedText}>📦 Matching Listing Posted</AppText>
        </View>
      )}
    </View>
  );
};

// ─── Message Bubble ─────────────────────────────────────────────────────────
const MessageBubble = ({ message, isMe, showAvatar, avatarLetter, theme, onAccept, onReject, role }) => {
  const primary = theme?.colors?.primary || "#2E7D32";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#E0E0E0";
  const textPrimary = theme?.colors?.textPrimary || "#333";
  const textSecondary = theme?.colors?.textSecondary || "#888";

  return (
    <View style={[styles.bubbleRow, isMe ? styles.rowRight : styles.rowLeft]}>
      {!isMe && showAvatar ? (
        <View style={[styles.avatarSmall, { backgroundColor: primary }]}>
          <AppText style={styles.avatarText}>{avatarLetter}</AppText>
        </View>
      ) : (
        !isMe && <View style={{ width: 30 }} />
      )}

      <View
        style={[
          styles.bubble,
          isMe
            ? [styles.bubbleMe, { backgroundColor: primary }]
            : [styles.bubbleThem, { backgroundColor: surface, borderColor: border }],
        ]}
      >
        <AppText variant="bodyMd" style={{ color: isMe ? surface : textPrimary }}>
          {message.content}
        </AppText>

        {/* Structured Sourcing Request Data Card */}
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
          <AppText
            variant="label"
            style={[styles.timestamp, { color: isMe ? "rgba(255,255,255,0.65)" : textSecondary }]}
          >
            {formatTime(message.createdAt)}
          </AppText>
          {isMe && (
            <Ionicons
              name={message.isRead ? "checkmark-done" : "checkmark"}
              size={14}
              color={message.isRead ? "#4CAF50" : "rgba(255,255,255,0.65)"}
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
  const flatListRef = useRef(null);
  const latestMsgCount = useRef(0);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const primary = theme?.colors?.primary || "#2E7D32";
  const background = theme?.colors?.background || "#F5F5F5";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#333";
  const textSecondary = theme?.colors?.textSecondary || "#888";
  const border = theme?.colors?.border || "#E0E0E0";
  const errorColor = theme?.colors?.error || "#F44336";

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
          if (isAtBottom) {
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
          }
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
    [userId, isAtBottom]
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
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  // Farmer accepts request -> navigates to PostProductScreen pre-filled
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

  // Farmer rejects request -> sends reject update to API
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
    const result = [];
    let lastDate = null;
    messages.forEach((msg) => {
      const currentDate = new Date(msg.createdAt).toDateString();
      if (currentDate !== lastDate) {
        result.push({
          type: "date",
          date: currentDate,
          id: `date-${currentDate}`,
        });
        lastDate = currentDate;
      }
      result.push({ type: "message", ...msg, id: msg._id });
    });
    return result;
  }, [messages]);

  const renderItem = ({ item }) => {
    if (item.type === "date") {
      return (
        <View style={styles.dateSeparator}>
          <AppText style={styles.dateText}>{item.date}</AppText>
        </View>
      );
    }
    const showAvatar =
      !isMe(item) &&
      item.senderId !== messages[messages.indexOf(item) - 1]?.senderId;
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
      <AppHeader
        title={userName || "Chat"}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <FlatList
        ref={flatListRef}
        data={messagesWithSeparators()}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
      />

      {/* Input bar */}
      <View style={[styles.inputBar, { backgroundColor: surface, borderTopColor: border }]}>
        <TextInput
          style={[styles.input, { backgroundColor: background, color: textPrimary }]}
          placeholder="Type a message..."
          placeholderTextColor={textSecondary}
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: primary }]}
          onPress={handleSend}
          disabled={!text.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color={surface} />
          ) : (
            <Ionicons name="send" size={18} color={surface} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  messageList: { paddingHorizontal: 16, paddingVertical: 12, flexGrow: 1 },
  dateSeparator: { alignItems: "center", marginVertical: 12 },
  dateText: { fontSize: 12, color: "#999", backgroundColor: "#e0e0e0", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  bubbleRow: { flexDirection: "row", marginVertical: 4, alignItems: "flex-end" },
  rowRight: { justifyContent: "flex-end" },
  rowLeft: { justifyContent: "flex-start" },
  avatarSmall: { width: 30, height: 30, borderRadius: 15, justifyContent: "center", alignItems: "center", marginRight: 8 },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  bubble: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, maxWidth: "82%" },
  bubbleMe: { borderBottomRightRadius: 4, marginRight: 4 },
  bubbleThem: { borderBottomLeftRadius: 4, borderWidth: 1 },
  metaRow: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginTop: 4 },
  timestamp: { fontSize: 10 },
  inputBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8, borderTopWidth: 1, gap: 8 },
  input: { flex: 1, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 8, fontSize: 15, maxHeight: 100 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },

  /* Sourcing Action Card Styles */
  actionCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  actionCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  actionCardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  actionSpecs: {
    fontSize: 12,
    color: "#334155",
    lineHeight: 18,
    marginBottom: 8,
  },
  actionBtnRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: "#2E7D32",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  acceptBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  rejectBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    alignItems: "center",
  },
  rejectBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  statusPillSuccess: {
    backgroundColor: "#ECFDF5",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  statusPillSuccessText: {
    color: "#10B981",
    fontSize: 11,
    fontWeight: "700",
  },
  statusPillDeclined: {
    backgroundColor: "#FEF2F2",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  statusPillDeclinedText: {
    color: "#EF4444",
    fontSize: 11,
    fontWeight: "700",
  },
  statusPillMatched: {
    backgroundColor: "#EFF6FF",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  statusPillMatchedText: {
    color: "#1565C0",
    fontSize: 11,
    fontWeight: "700",
  },
});
