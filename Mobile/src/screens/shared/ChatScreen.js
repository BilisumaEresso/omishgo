// Mobile/src/screens/shared/ChatScreen.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, StyleSheet,
  ActivityIndicator, SafeAreaView,
} from "react-native";
import { useTranslation } from "react-i18next";
import AppText from "../../components/common/AppText";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useAuthStore } from "../../store/auth.store";
import { useTheme } from "../../hooks/useTheme";

const POLL_INTERVAL_MS = 5000;

// ─── Single message bubble ────────────────────────────────────────────────────
const MessageBubble = ({ message, isMe, theme }) => (
  <View style={[styles.bubbleRow, isMe ? styles.rowRight : styles.rowLeft]}>
    <View
      style={[
        styles.bubble,
        isMe
          ? [styles.bubbleMe,   { backgroundColor: theme.colors.primary || "#2e7d32" }]
          : [styles.bubbleThem, { backgroundColor: theme.colors.surface || "#fff",
                                  borderColor: theme.colors.border || "#e0e0e0" }],
      ]}
    >
      <AppText
        variant="bodyMd"
        style={{ color: isMe ? "#fff" : (theme.colors.textPrimary || "#333") }}
      >
        {message.content}
      </AppText>
      <AppText
        variant="label"
        style={[styles.timestamp, { color: isMe ? "rgba(255,255,255,0.65)" : (theme.colors.textSecondary || "#aaa") }]}
      >
        {formatTime(message.createdAt)}
      </AppText>
    </View>
  </View>
);

const formatTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ChatScreen({ route, navigation }) {
  const { t }     = useTranslation();
  const { theme } = useTheme();
  const currentUser = useAuthStore((state) => state.user);

  const { userId, userName } = route.params || {};

  const [messages, setMessages]   = useState([]);
  const [text, setText]           = useState("");
  const [loading, setLoading]     = useState(true);
  const [sending, setSending]     = useState(false);
  const [error, setError]         = useState("");
  const flatListRef               = useRef(null);
  const latestMsgCount            = useRef(0);

  // ── Fetch thread ──────────────────────────────────────────────────────────
  const fetchThread = useCallback(async (silent = false) => {
    if (!userId) return;
    if (!silent) setLoading(true);

    try {
      const res = await api.get(API_ENDPOINTS.messages.thread(userId));
      const fetched = res.data?.data?.messages || [];

      // Only update + scroll if there are new messages (avoids jitter on poll)
      if (fetched.length !== latestMsgCount.current) {
        latestMsgCount.current = fetched.length;
        setMessages(fetched);
        // Scroll to bottom after render
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      }
      setError("");
    } catch (err) {
      if (!silent) {
        setError(err?.response?.data?.message || err.message || "Failed to load messages");
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Initial load + 5-second poll
  useEffect(() => {
    fetchThread();
    const interval = setInterval(() => fetchThread(true), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchThread]);

  // ── Send message ──────────────────────────────────────────────────────────
  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    // Optimistic local append
    const optimistic = {
      _id:        `opt-${Date.now()}`,
      senderId:   currentUser?._id || currentUser?.id || "me",
      receiverId: userId,
      content:    trimmed,
      createdAt:  new Date().toISOString(),
      isRead:     false,
      _optimistic: true,
    };
    setMessages((prev) => [...prev, optimistic]);
    setText("");
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 80);

    setSending(true);
    try {
      const res = await api.post(API_ENDPOINTS.messages.send, {
        receiverId: userId,
        content:    trimmed,
      });
      const saved = res.data?.data?.message;

      // Replace optimistic message with the real one from server
      if (saved) {
        setMessages((prev) =>
          prev.map((m) => (m._id === optimistic._id ? saved : m))
        );
        latestMsgCount.current += 1;
      }
    } catch (err) {
      // Roll back the optimistic message on failure
      setMessages((prev) => prev.filter((m) => m._id !== optimistic._id));
      setError(err?.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // ── Determine "is me" for a message ───────────────────────────────────────
  const myId = currentUser?._id || currentUser?.id;
  const isMe = (msg) => {
    const sid = msg.senderId?._id || msg.senderId;
    return sid === myId;
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background || "#f5f7fa" }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface || "#fff", borderBottomColor: theme.colors.border || "#e8e8e8" }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <AppText variant="headingMd" style={{ color: theme.colors.primary || "#2e7d32" }}>←</AppText>
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary || "#2e7d32" }]}>
            <AppText style={{ color: "#fff", fontWeight: "700" }}>
              {(userName || "?")[0].toUpperCase()}
            </AppText>
          </View>
          <AppText variant="headingSm" style={{ color: theme.colors.textPrimary || "#333" }}>
            {userName || t("messaging.unknownUser") || "Chat"}
          </AppText>
        </View>
      </View>

      {/* Messages */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary || "#2e7d32"} />
        </View>
      ) : error && messages.length === 0 ? (
        <View style={styles.center}>
          <AppText style={{ color: theme.colors.error || "red", textAlign: "center" }}>{error}</AppText>
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
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            ListEmptyComponent={
              <View style={styles.center}>
                <AppText style={{ fontSize: 36 }}>💬</AppText>
                <AppText variant="bodyMd" style={{ color: theme.colors.textSecondary || "#999", marginTop: 8, textAlign: "center" }}>
                  {t("messaging.noMessages") || "No messages yet. Say hello!"}
                </AppText>
              </View>
            }
          />

          {/* Input bar */}
          <View style={[styles.inputBar, { backgroundColor: theme.colors.surface || "#fff", borderTopColor: theme.colors.border || "#e8e8e8" }]}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.background || "#f0f0f0", color: theme.colors.textPrimary || "#333" }]}
              placeholder={t("messaging.placeholder") || "Type a message..."}
              placeholderTextColor={theme.colors.textSecondary || "#aaa"}
              value={text}
              onChangeText={setText}
              multiline
              maxLength={1000}
              returnKeyType="default"
            />
            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: theme.colors.primary || "#2e7d32" }, (!text.trim() || sending) && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!text.trim() || sending}
              activeOpacity={0.8}
            >
              {sending
                ? <ActivityIndicator size="small" color="#fff" />
                : <AppText style={styles.sendIcon}>➤</AppText>
              }
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1 },
  flex:        { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 10,
  },
  backBtn:     { padding: 4 },
  headerInfo:  { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
  },
  messageList: { paddingHorizontal: 16, paddingVertical: 12, gap: 6, flexGrow: 1 },
  bubbleRow:   { marginVertical: 3, maxWidth: "80%" },
  rowRight:    { alignSelf: "flex-end" },
  rowLeft:     { alignSelf: "flex-start" },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
  },
  bubbleMe:    { borderBottomRightRadius: 4 },
  bubbleThem:  { borderBottomLeftRadius: 4, borderWidth: 1 },
  timestamp:   { fontSize: 10, alignSelf: "flex-end" },
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
    width: 42, height: 42, borderRadius: 21,
    alignItems: "center", justifyContent: "center",
  },
  sendBtnDisabled: { opacity: 0.45 },
  sendIcon:    { color: "#fff", fontSize: 16, fontWeight: "700" },
  center:      { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },
});
