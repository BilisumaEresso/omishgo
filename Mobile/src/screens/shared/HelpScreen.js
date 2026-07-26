// src/screens/shared/HelpScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "../../components/common/AppText";
import DashboardLayout from "../../components/layout/DashBoardLayout";
import { useTheme } from "../../hooks/useTheme";

export default function HelpScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const primary = theme?.colors?.primary || "#1565C0";
  const primaryContainer = theme?.colors?.primaryContainer || "#E3F2FD";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";
  const surface = theme?.colors?.surface || "#FFFFFF";

  const faqs = [
    { question: t("helpScreen.faq1Question"), answer: t("helpScreen.faq1Answer") },
    { question: t("helpScreen.faq2Question"), answer: t("helpScreen.faq2Answer") },
    { question: t("helpScreen.faq3Question"), answer: t("helpScreen.faq3Answer") },
    { question: t("helpScreen.faq4Question"), answer: t("helpScreen.faq4Answer") },
    { question: t("helpScreen.faq5Question"), answer: t("helpScreen.faq5Answer") },
    { question: t("helpScreen.faq6Question"), answer: t("helpScreen.faq6Answer") },
    { question: t("helpScreen.faq7Question"), answer: t("helpScreen.faq7Answer") },
    { question: t("helpScreen.faq8Question"), answer: t("helpScreen.faq8Answer") },
  ];

  const toggleFaq = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <DashboardLayout
      role="buyer"
      title={t("helpScreen.title")}
      showBack
      onBackPress={() => navigation.goBack()}
    >
      {/* Quick Contact Cards */}
      <AppText style={[styles.sectionLabel, { color: textSecondary }]}>
        {t("helpScreen.quickContact")}
      </AppText>
      <View style={styles.contactRow}>
        <TouchableOpacity
          style={[styles.contactCard, { backgroundColor: primaryContainer }]}
          onPress={() => Linking.openURL("tel:0938730818")}
          activeOpacity={0.8}
        >
          <View style={[styles.contactIconBg, { backgroundColor: primary }]}>
            <Ionicons name="call" size={22} color="#FFFFFF" />
          </View>
          <AppText style={[styles.contactCardTitle, { color: primary }]}>
            {t("helpScreen.callSupport")}
          </AppText>
          <AppText style={[styles.contactCardSub, { color: textSecondary }]}>
            0938730818
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.contactCard, { backgroundColor: primaryContainer }]}
          onPress={() => navigation.navigate("Chat", { userId: "admin", userName: "OmishGo Support Admin", phoneNumber: "0938730818" })}
          activeOpacity={0.8}
        >
          <View style={[styles.contactIconBg, { backgroundColor: primary }]}>
            <Ionicons name="chatbubble-ellipses" size={22} color="#FFFFFF" />
          </View>
          <AppText style={[styles.contactCardTitle, { color: primary }]}>
            {t("helpScreen.sendMessage")}
          </AppText>
          <AppText style={[styles.contactCardSub, { color: textSecondary }]}>
            {t("help.directAdmin", { defaultValue: "Direct message to admin" })}
          </AppText>
        </TouchableOpacity>
      </View>

      {/* FAQ Section */}
      <AppText style={[styles.sectionLabel, { color: textSecondary }]}>
        {t("helpScreen.faqTitle")}
      </AppText>
      <View style={styles.faqContainer}>
        {faqs.map((item, index) => {
          const isOpen = expandedIndex === index;
          const isLast = index === faqs.length - 1;
          return (
            <TouchableOpacity
              key={item.question}
              onPress={() => toggleFaq(index)}
              activeOpacity={0.8}
              style={[
                styles.faqItem,
                { backgroundColor: surface },
                !isLast && styles.faqItemBorder,
              ]}
            >
              <View style={styles.faqHeader}>
                <AppText style={[styles.faqQuestion, { color: textPrimary }]} numberOfLines={isOpen ? undefined : 2}>
                  {item.question}
                </AppText>
                <View style={[styles.chevronBg, isOpen && { backgroundColor: primary + "18" }]}>
                  <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={isOpen ? primary : textSecondary}
                  />
                </View>
              </View>
              {isOpen && (
                <AppText style={[styles.faqAnswer, { color: textSecondary }]}>
                  {item.answer}
                </AppText>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Version */}
      <View style={styles.versionContainer}>
        <AppText style={[styles.versionText, { color: textSecondary }]}>
          {t("helpScreen.versionTitle")}
        </AppText>
        <AppText style={[styles.versionText, { color: textSecondary }]}>
          {t("helpScreen.versionSubtitle")}
        </AppText>
      </View>

      <View style={{ height: 32 }} />
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 10,
    marginTop: 4,
  },
  contactRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  contactCard: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  contactIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  contactCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  contactCardSub: {
    fontSize: 11,
    textAlign: "center",
  },
  faqContainer: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    marginBottom: 24,
  },
  faqItem: {
    padding: 16,
  },
  faqItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  chevronBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  faqAnswer: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },
  versionContainer: {
    alignItems: "center",
    gap: 4,
  },
  versionText: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.7,
  },
});
