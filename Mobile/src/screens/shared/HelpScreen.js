import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
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

export default function HelpScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const backgroundColor = theme?.colors?.background || "#FFFFFF";
  const primary = theme?.colors?.primary || "#2E7D32";
  const primaryContainer = theme?.colors?.primaryContainer || "#E8F5E9";
  const textPrimary = theme?.colors?.textPrimary || "#1A2E1A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6741";

  const faqs = [
    {
      question: t("helpScreen.faq1Question"),
      answer: t("helpScreen.faq1Answer"),
    },
    {
      question: t("helpScreen.faq2Question"),
      answer: t("helpScreen.faq2Answer"),
    },
    {
      question: t("helpScreen.faq3Question"),
      answer: t("helpScreen.faq3Answer"),
    },
    {
      question: t("helpScreen.faq4Question"),
      answer: t("helpScreen.faq4Answer"),
    },
    {
      question: t("helpScreen.faq5Question"),
      answer: t("helpScreen.faq5Answer"),
    },
    {
      question: t("helpScreen.faq6Question"),
      answer: t("helpScreen.faq6Answer"),
    },
    {
      question: t("helpScreen.faq7Question"),
      answer: t("helpScreen.faq7Answer"),
    },
    {
      question: t("helpScreen.faq8Question"),
      answer: t("helpScreen.faq8Answer"),
    },
  ];

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
        title={t("helpScreen.title")}
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <AppText
            variant="headingSm"
            style={[styles.sectionTitle, { color: textPrimary }]}
          >
            {t("helpScreen.quickContact")}
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
                {t("helpScreen.callSupport")}
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
                {t("helpScreen.sendMessage")}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <AppText
            variant="headingSm"
            style={[styles.sectionTitle, { color: textPrimary }]}
          >
            {t("helpScreen.faqTitle")}
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
            {t("helpScreen.versionTitle")}
          </AppText>
          <AppText style={[styles.versionText, { color: textSecondary }]}>
            {t("helpScreen.versionSubtitle")}
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
