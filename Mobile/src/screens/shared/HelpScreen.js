import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import { useTheme } from "../../hooks/useTheme";

const faqs = [
  {
    question: "How do I post a product?",
    answer:
      "Tap the Products tab or the Post button on your dashboard. Fill in your crop type, quantity, price, and location. Your listing goes live immediately.",
  },
  {
    question: "How do buyers contact me?",
    answer:
      "Buyers can message you directly from your listing. You will receive a notification when a new message arrives.",
  },
  {
    question: "How is the price suggested?",
    answer:
      "We show average prices from recent listings on the platform. Use it as a guide — you set your own price.",
  },
  {
    question: "How do I change my language?",
    answer:
      "Open the sidebar menu and tap My Profile. Language settings are in your profile page.",
  },
  {
    question: "Is my phone number safe?",
    answer:
      "Your phone number is only shared with buyers or farmers you have an active order with.",
  },
  {
    question: "What is a Quintal?",
    answer:
      "One quintal equals 100 kilograms. It is the standard unit for grain trading in Ethiopia.",
  },
  {
    question: "How do I cancel an order?",
    answer:
      "Open the order from your Orders tab and tap Cancel. Cancellation is only possible before delivery begins.",
  },
  {
    question: "I found a bug or have a suggestion.",
    answer:
      "We appreciate your feedback. Tap Send Message above to contact our team directly.",
  },
];

export default function HelpScreen({ navigation }) {
  const { theme } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const backgroundColor = theme?.colors?.background || "#FFFFFF";
  const primary = theme?.colors?.primary || "#2E7D32";
  const primaryContainer = theme?.colors?.primaryContainer || "#E8F5E9";
  const textPrimary = theme?.colors?.textPrimary || "#1A2E1A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6741";

  const toggleFaq = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const handleCall = () => {
    Linking.openURL("tel:+251911000000");
  };

  const handleSendMessage = () => {
    navigation.navigate("Chat", {
      userId: "support",
      userName: "OmishGo Support",
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <AppHeader
        title="Help & Support"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <AppText
            variant="headingSm"
            style={[styles.sectionTitle, { color: textPrimary }]}
          >
            Quick Contact
          </AppText>
          <View style={styles.contactRow}>
            <TouchableOpacity
              style={[
                styles.contactCard,
                { backgroundColor: primaryContainer },
              ]}
              onPress={handleCall}
              activeOpacity={0.8}
            >
              <Ionicons name="call-outline" size={24} color={primary} />
              <AppText style={[styles.cardTitle, { color: primary }]}>
                Call Support
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.contactCard,
                { backgroundColor: primaryContainer },
              ]}
              onPress={handleSendMessage}
              activeOpacity={0.8}
            >
              <Ionicons name="mail-outline" size={24} color={primary} />
              <AppText style={[styles.cardTitle, { color: primary }]}>
                Send Message
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <AppText
            variant="headingSm"
            style={[styles.sectionTitle, { color: textPrimary }]}
          >
            Frequently Asked Questions
          </AppText>
          {faqs.map((item, index) => (
            <TouchableOpacity
              key={item.question}
              onPress={() => toggleFaq(index)}
              activeOpacity={0.8}
              style={[
                styles.faqItem,
                { borderBottomColor: theme?.colors?.border || "#E0E0E0" },
              ]}
            >
              <View style={styles.faqHeader}>
                <AppText style={[styles.faqQuestion, { color: textPrimary }]}>
                  {item.question}
                </AppText>
                <Ionicons
                  name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={textSecondary}
                />
              </View>
              {expandedIndex === index && (
                <AppText style={[styles.faqAnswer, { color: textSecondary }]}>
                  {item.answer}
                </AppText>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.versionContainer}>
          <AppText style={[styles.versionText, { color: textSecondary }]}>
            OmishGo v1.0 MVP
          </AppText>
          <AppText style={[styles.versionText, { color: textSecondary }]}>
            Built for Ethiopian Farmers
          </AppText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: "row",
    gap: 14,
  },
  contactCard: {
    flex: 1,
    borderRadius: 14,
    padding: 18,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  faqItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
  },
  faqAnswer: {
    paddingBottom: 14,
    paddingHorizontal: 0,
    fontSize: 14,
    marginTop: 12,
    lineHeight: 20,
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  versionText: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 4,
  },
});
