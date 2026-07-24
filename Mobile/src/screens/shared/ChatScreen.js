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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// ─── Message bubble (unchanged except for minor polish) ──────────────────────
const MessageBubble = ({ message, isMe, showAvatar, avatarLetter, theme }) => {
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
            : [
                styles.bubbleThem,
                { backgroundColor: surface, borderColor: border },
              ],
        ]}
      >
        <AppText
          variant="bodyMd"
          style={{ color: isMe ? surface : textPrimary }}
        >
          {message.content}
        </AppText>
        <View style={styles.metaRow}>
          <AppText
            variant="label"
            style={[
              styles.timestamp,
              { color: isMe ? "rgba(255,255,255,0.65)" : textSecondary },
            ]}
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

  // ----- Keyboard handling (pixel‑perfect) -----
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const keyboardPadding = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      const height = e.endCoordinates.height;
      setKeyboardHeight(height);
      Animated.timing(keyboardPadding, {
        toValue: height,
        duration: e.duration || 250,
        useNativeDriver: false,
      }).start();
      setTimeout(() => {
        if (flatListRef.current && isAtBottom) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 150);
    });

    const hideSub = Keyboard.addListener(hideEvent, (e) => {
      Animated.timing(keyboardPadding, {
        toValue: 0,
        duration: e.duration || 150,
        useNativeDriver: false,
      }).start();
      setTimeout(() => setKeyboardHeight(0), 150);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [isAtBottom]);

  // Theme colors
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
          if (isAtBottom) {
            setTimeout(
              () => flatListRef.current?.scrollToEnd({ animated: true }),
              100,
            );
          }
        }
        setError("");
      } catch (err) {
        if (!silent) {
          setError(
            err?.response?.data?.message ||
              err.message ||
              t("chatScreen.errorLoadMessages"),
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [userId, isAtBottom],
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
      setError(
        err?.response?.data?.message || t("chatScreen.errorSendMessage"),
      );
    } finally {
      setSending(false);
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100,
      );
    }
  };

  const myId = currentUser?._id || currentUser?.id;
  const isMe = (msg) => {
    const sid = msg.senderId?._id || msg.senderId;
    return sid === myId;
  };

  // ── Date separators ───────────────────────────────────────────────────────
  const messagesWithSeparators = useCallback(() => {
    if (!messages.length) return [];
    const result = [];
    let lastDate = null;
    messages.forEach((msg, index) => {
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

  // ── Scroll helpers ────────────────────────────────────────────────────────
  const handleScroll = (event) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    setIsAtBottom(
      contentOffset.y >= contentSize.height - layoutMeasurement.height - 50,
    );
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
    setIsAtBottom(true);
  };

  // ── Render item ───────────────────────────────────────────────────────────
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
      />
    );
  };

  // ── Right actions: call + profile ─────────────────────────────────────────
  const handleCallPress = () => {
    if (phoneNumber) {
      const url = `tel:${phoneNumber}`;
      Linking.canOpenURL(url)
        .then((supported) => {
          if (supported) {
            Linking.openURL(url);
          } else {
            // fallback if tel protocol not supported (e.g., simulator)
            alert(
              t("chatScreen.callNotSupported") ||
                "Phone calls are not supported on this device.",
            );
          }
        })
        .catch(() =>
          alert(
            t("common.error") ||
              "Something went wrong while trying to place the call.",
          ),
        );
    } else {
      alert(
        t("chatScreen.callNotAvailable") ||
          "Phone number not available for this user.",
      );
    }
  };

  const rightActions = (
    <View style={{ flexDirection: "row", gap: 16, marginRight: 8 }}>
      <TouchableOpacity onPress={handleCallPress}>
        <Ionicons name="call-outline" size={22} color={primary} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (currentUser?.role === "buyer") {
            navigation.navigate("FarmerProfile", { farmerId: userId });
          } else {
            navigation.navigate("BuyerProfile", { buyerId: userId });
          }
        }}
      >
        <Ionicons name="person-circle-outline" size={24} color={primary} />
      </TouchableOpacity>
    </View>
  );

  // ── Loading / error states ────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <AppHeader
          title={
            userName || t("messaging.unknownUser") || t("chatScreen.title")
          }
          showBack
          onBackPress={() => navigation.goBack()}
          rightComponent={rightActions}
        />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      </View>
    );
  }

  if (error && messages.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <AppHeader
          title={
            userName || t("messaging.unknownUser") || t("chatScreen.title")
          }
          showBack
          onBackPress={() => navigation.goBack()}
          rightComponent={rightActions}
        />
        <View style={styles.center}>
          <AppText style={{ color: errorColor, textAlign: "center" }}>
            {error}
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <AppHeader
        title={userName || t("messaging.unknownUser") || t("chatScreen.title")}
        showBack
        onBackPress={() => navigation.goBack()}
        rightComponent={rightActions}
      />

      {/* Chat list */}
      <FlatList
        ref={flatListRef}
        data={messagesWithSeparators()}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
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

      {/* Scroll to bottom button */}
      {!isAtBottom && (
        <TouchableOpacity
          style={styles.scrollToBottomBtn}
          onPress={scrollToBottom}
        >
          <Ionicons name="chevron-down" size={20} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Input bar – always on top of the keyboard */}
      <Animated.View
        style={[
          styles.inputBar,
          {
            backgroundColor: surface,
            borderTopColor: border,
            paddingBottom: Animated.add(keyboardPadding, insets.bottom),
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            { backgroundColor: background, color: textPrimary },
          ]}
          placeholder={t("messaging.placeholder") || "Type a message..."}
          placeholderTextColor={textSecondary}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={1000}
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
      </Animated.View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexGrow: 1,
  },
  dateSeparator: {
    alignItems: "center",
    marginVertical: 12,
  },
  dateText: {
    fontSize: 12,
    color: "#999",
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: "hidden",
  },
  bubbleRow: {
    flexDirection: "row",
    marginVertical: 3,
    alignItems: "flex-end",
  },
  rowRight: { justifyContent: "flex-end" },
  rowLeft: { justifyContent: "flex-start" },
  avatarSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    alignSelf: "flex-end",
  },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: "75%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bubbleMe: { borderBottomRightRadius: 4, marginRight: 8 },
  bubbleThem: { borderBottomLeftRadius: 4, borderWidth: 1 },
  metaRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
  },
  timestamp: { fontSize: 10 },
  scrollToBottomBtn: {
    position: "absolute",
    bottom: 70,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#999",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.8,
    zIndex: 10,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingTop: 10,
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
