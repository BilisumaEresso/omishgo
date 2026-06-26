import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Linking, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import NetInfo from "@react-native-community/netinfo";

const MessagingScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  
  // Passed in from BuyerBrowseScreen or ChatListScreen
  const { seller = { name: "Seller", phone: "0911234567" }, product } = route.params || {};

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    // Mock initial messages for UI MVP
    setMessages([
      { _id: "1", text: `Hi, is your ${product?.title || "product"} still available?`, senderId: "me", createdAt: new Date(Date.now() - 3600000).toISOString() },
      { _id: "2", text: "Yes, it is! How much do you need?", senderId: "them", createdAt: new Date(Date.now() - 1800000).toISOString() }
    ]);

    return () => unsubscribe();
  }, [product]);

  const handleSend = () => {
    if (!text.trim()) return;
    
    if (isOffline) {
      Alert.alert("Offline", t("messaging.offlineError"));
      return;
    }

    const newMessage = {
      _id: Date.now().toString(),
      text,
      senderId: "me",
      createdAt: new Date().toISOString()
    };

    setMessages([...messages, newMessage]);
    setText("");
    
    // API call would happen here
    // api.post("/messages", { receiverId: seller._id, productId: product?._id, text })
  };

  const handleCall = () => {
    const phoneNumber = seller.phone;
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`).catch(() => {
        Alert.alert("Error", "Could not open dialer");
      });
    } else {
      Alert.alert("Error", "No phone number available for this seller");
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.senderId === "me";
    return (
      <View style={[styles.messageBubble, isMe ? styles.messageMe : styles.messageThem]}>
        <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextThem]}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{seller.name}</Text>
        <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
          <Text style={styles.callBtnText}>{t("browse.callBtn")}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          data={messages}
          keyExtractor={item => item._id}
          renderItem={renderMessage}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>{t("messaging.noMessages")}</Text>
            </View>
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={t("messaging.placeholder")}
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendBtn, (!text.trim() || isOffline) && styles.sendBtnDisabled]} 
            onPress={handleSend}
            disabled={!text.trim() || isOffline}
          >
            <Text style={styles.sendBtnText}>{t("messaging.send")}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderColor: "#ddd" },
  backBtn: { padding: 8 },
  backText: { fontSize: 24, color: "#333" },
  title: { fontSize: 18, fontWeight: "bold", color: "#333" },
  callBtn: { backgroundColor: "#e8f5e9", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  callBtnText: { color: "#2e7d32", fontWeight: "bold", fontSize: 12 },
  keyboardAvoid: { flex: 1 },
  list: { padding: 16, gap: 12 },
  messageBubble: { maxWidth: "80%", padding: 12, borderRadius: 16, marginVertical: 4 },
  messageMe: { alignSelf: "flex-end", backgroundColor: "#2e7d32", borderBottomRightRadius: 4 },
  messageThem: { alignSelf: "flex-start", backgroundColor: "#fff", borderBottomLeftRadius: 4, borderWidth: 1, borderColor: "#eee" },
  messageText: { fontSize: 16 },
  messageTextMe: { color: "#fff" },
  messageTextThem: { color: "#333" },
  inputContainer: { flexDirection: "row", padding: 16, backgroundColor: "#fff", borderTopWidth: 1, borderColor: "#eee", alignItems: "flex-end" },
  input: { flex: 1, backgroundColor: "#f9f9f9", borderWidth: 1, borderColor: "#ddd", borderRadius: 20, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, maxHeight: 100, minHeight: 40 },
  sendBtn: { marginLeft: 12, marginBottom: 4, backgroundColor: "#2e7d32", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  sendBtnDisabled: { opacity: 0.5 },
  sendBtnText: { color: "#fff", fontWeight: "bold" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 40 },
  emptyText: { color: "#999" }
});

export default MessagingScreen;
