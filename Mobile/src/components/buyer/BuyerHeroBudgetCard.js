// src/components/buyer/BuyerHeroBudgetCard.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import AppText from "../common/AppText";
import { formatNumber } from "../../utils/formatNumber";

export default function BuyerHeroBudgetCard({
  totalSpend = 0,
  currency = "ETB",
  onSeeDetails,
}) {
  const { t } = useTranslation();

  const formattedSpend = formatNumber(totalSpend || 0, 2);
  
  // Highlight a stat buyers care about: Money saved by skipping middlemen
  const estimatedSavings = (totalSpend || 0) * 0.15; 
  const formattedSavings = formatNumber(estimatedSavings, 2);

  return (
    <View style={styles.container}>
      {/* Upper Hero Card */}
      <View style={styles.heroCard}>
        {/* Background Geometric Abstract Shapes */}
        <View style={styles.abstractContainer} pointerEvents="none">
          <View style={[styles.leafShape, styles.leafCyan]} />
          <View style={[styles.leafShape, styles.leafPink]} />
          <View style={[styles.circleShape, styles.circleYellow]} />
          <View style={[styles.circleShape, styles.circleBlue]} />
        </View>

        <View style={styles.heroContent}>
          <AppText style={styles.label}>
            {t("buyerDashboard.totalPurchases", { defaultValue: "Total Purchases (This Month)" })}
          </AppText>
          <AppText style={styles.amount}>
            {currency} {formattedSpend}
          </AppText>

          <TouchableOpacity
            onPress={onSeeDetails}
            activeOpacity={0.8}
            style={styles.seeDetailsBtn}
          >
            <AppText style={styles.seeDetailsText}>
              {t("recentOrdersList.seeAll", { defaultValue: "See details" })}
            </AppText>
            <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lower Savings Strip Card */}
      <View style={styles.savingsStripCard}>
        <View style={styles.stripHeader}>
          <View style={styles.stripTextWrap}>
            <AppText style={styles.stripTitle}>
              {t("buyerDashboard.estimatedSavings", { defaultValue: "Estimated Savings" })}
            </AppText>
            <AppText style={styles.stripSubtitle}>
              {t("buyerDashboard.savingsSubtitle", { defaultValue: "By buying directly from farmers" })}
            </AppText>
          </View>
          <View style={styles.savingsBadge}>
            <Ionicons name="trending-up" size={16} color="#10B981" />
            <AppText style={styles.stripAmount}>
              {currency} {formattedSavings}
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  heroCard: {
    backgroundColor: "#1E1B4B",
    borderRadius: 24,
    padding: 22,
    position: "relative",
    overflow: "hidden",
    minHeight: 155,
    justifyContent: "center",
  },
  abstractContainer: {
    position: "absolute",
    right: 10,
    top: 10,
    bottom: 10,
    width: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  leafShape: {
    position: "absolute",
    width: 50,
    height: 70,
    borderRadius: 35,
  },
  leafCyan: {
    backgroundColor: "#38BDF8",
    top: 10,
    right: 50,
    transform: [{ rotate: "-45deg" }],
  },
  leafPink: {
    backgroundColor: "#F43F5E",
    bottom: 15,
    right: 15,
    transform: [{ rotate: "35deg" }],
  },
  circleShape: {
    position: "absolute",
    borderRadius: 999,
  },
  circleYellow: {
    width: 32,
    height: 32,
    backgroundColor: "#FBBF24",
    top: 5,
    right: 25,
  },
  circleBlue: {
    width: 24,
    height: 24,
    backgroundColor: "#818CF8",
    bottom: 5,
    right: 70,
  },
  heroContent: {
    zIndex: 2,
    maxWidth: "68%",
  },
  label: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.75)",
    fontWeight: "500",
    marginBottom: 6,
  },
  amount: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    marginTop: 6,
    marginBottom: 14,
    lineHeight: 36,
    paddingBottom: 4,
  },
  seeDetailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeDetailsText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  savingsStripCard: {
    backgroundColor: "#2E2A68",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 10,
  },
  stripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stripTextWrap: {
    flex: 1,
    paddingRight: 10,
  },
  stripTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  stripSubtitle: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.65)",
    marginTop: 4,
    lineHeight: 16,
  },
  savingsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  stripAmount: {
    fontSize: 16,
    fontWeight: "800",
    color: "#10B981",
    lineHeight: 22,
    paddingBottom: 2,
  },
});

