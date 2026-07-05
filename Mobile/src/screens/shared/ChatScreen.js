// Mobile/src/screens/shared/ChatScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

const POLL_INTERVAL_MS = 5000;

// ─── Single message bubble ────────────────────────────────────────────────────
const MessageBubble = ({ message, isMe, theme }) => {
  const primary = theme?.colors?.primary || "#2E7D32";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#E0E0E0";
  const textPrimary = theme?.colors?.textPrimary || "#333";
  const textSecondary = theme?.colors?.textSecondary || "#888";

  return (
    <View style={[styles.bubbleRow, isMe ? styles.rowRight : styles.rowLeft]}>
      <View
        style={[
          styles.bubble,
          isMe
            ? [styles.bubbleMe, { backgroundColor: primary }]
            : [
                styles.bubbleThem,
                {
                  backgroundColor: surface,
                  borderColor: border,
                },
              ],
        ]}
      >
        <AppText
          variant="bodyMd"
          style={{ color: isMe ? surface : textPrimary }}
        >
          {message.content}
        </AppText>
        <AppText
          variant="label"
          style={[
            styles.timestamp,
            {
              color: isMe ? "rgba(255,255,255,0.65)" : textSecondary,
            },
          ]}
        >
          {formatTime(message.createdAt)}
        </AppText>
      </View>
    </View>
  );
};

const formatTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ChatScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const currentUser = useAuthStore((state) => state.user);

  const { userId, userName } = route.params || {};

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const flatListRef = useRef(null);
  const latestMsgCount = useRef(0);

  // Extract theme colors
  const primary = theme?.colors?.primary || "#2E7D32";
  const background = theme?.colors?.background || "#F5F5F5";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#333";
  const textSecondary = theme?.colors?.textSecondary || "#888";
  const border = theme?.colors?.border || "#E0E0E0";
  const errorColor = theme?.colors?.error || "#F44336";

  // ── Fetch thread ──────────────────────────────────────────────────────────
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
          setTimeout(
            () => flatListRef.current?.scrollToEnd({ animated: true }),
            100,
          );
        }
        setError("");
      } catch (err) {
        if (!silent) {
          setError(
            err?.response?.data?.message ||
              err.message ||
              "Failed to load messages",
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    fetchThread();
    const interval = setInterval(() => fetchThread(true), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchThread]);

  // ── Send message ──────────────────────────────────────────────────────────
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
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 80);

    setSending(true);
    try {
      const res = await api.post(API_ENDPOINTS.messages.send, {
        receiverId: userId,
        content: trimmed,
      });
      const saved = res.data?.data?.message;

      if (saved) {
        setMessages((prev) =>
          prev.map((m) => (m._id === optimistic._id ? saved : m)),
        );
        latestMsgCount.current += 1;
      }
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m._id !== optimistic._id));
      setError(err?.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const myId = currentUser?._id || currentUser?.id;
  const isMe = (msg) => {
    const sid = msg.senderId?._id || msg.senderId;
    return sid === myId;
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <AppHeader
        title={userName || t("messaging.unknownUser") || "Chat"}
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      ) : error && messages.length === 0 ? (
        <View style={styles.center}>
          <AppText style={{ color: errorColor, textAlign: "center" }}>
            {error}
          </AppText>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={90}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <MessageBubble message={item} isMe={isMe(item)} theme={theme} />
            )}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
            ListEmptyComponent={
              <View style={styles.center}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={36}
                  color={textSecondary}
                />
                <AppText
                  variant="bodyMd"
                  style={{
                    color: textSecondary,
                    marginTop: 8,
                    textAlign: "center",
                  }}
                >
                  {t("messaging.noMessages") || "No messages yet. Say hello!"}
                </AppText>
              </View>
            }
          />

          {/* Input bar */}
          <View
            style={[
              styles.inputBar,
              {
                backgroundColor: surface,
                borderTopColor: border,
              },
            ]}
          >
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: background,
                  color: textPrimary,
                },
              ]}
              placeholder={t("messaging.placeholder") || "Type a message..."}
              placeholderTextColor={textSecondary}
              value={text}
              onChangeText={setText}
              multiline
              maxLength={1000}
              returnKeyType="default"
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                { backgroundColor: primary },
                (!text.trim() || sending) && styles.sendBtnDisabled,
              ]}
              onPress={handleSend}
              disabled={!text.trim() || sending}
              activeOpacity={0.8}
            >
              {sending ? (
                <ActivityIndicator size="small" color={surface} />
              ) : (
                <Ionicons name="send" size={18} color={surface} />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
    flexGrow: 1,
  },
  bubbleRow: { marginVertical: 3, maxWidth: "80%" },
  rowRight: { alignSelf: "flex-end" },
  rowLeft: { alignSelf: "flex-start" },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
  },
  bubbleMe: { borderBottomRightRadius: 4 },
  bubbleThem: { borderBottomLeftRadius: 4, borderWidth: 1 },
  timestamp: { fontSize: 10, alignSelf: "flex-end" },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  input: {
    flex: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
    maxHeight: 120,
    minHeight: 42,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { opacity: 0.45 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
});
