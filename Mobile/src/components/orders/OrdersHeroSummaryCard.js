// src/components/orders/OrdersHeroSummaryCard.js
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View } from "react-native";
import AppText from "../common/AppText";
import { formatNumber } from "../../utils/formatNumber";

export default function OrdersHeroSummaryCard({
  totalValue = 0,
  activeCount = 0,
  role = "farmer",
  currency = "ETB",
}) {
  const { t } = useTranslation();
  const isFarmer = role === "farmer";
  const bgGradient = isFarmer ? "#15803D" : "#1565C0";
  const badgeColor = isFarmer ? "#A7F3D0" : "#BFDBFE";
  const titleText = isFarmer
    ? t("farmerOrders.title", { defaultValue: "Harvest Sales Orders" })
    : t("buyerOrders.title", { defaultValue: "Produce Procurement Orders" });

  return (
    <View style={[styles.cardContainer, { backgroundColor: bgGradient }]}>
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Ionicons name={isFarmer ? "cube-outline" : "cart-outline"} size={14} color={badgeColor} />
          <AppText style={[styles.badgeText, { color: badgeColor }]}>{titleText}</AppText>
        </View>
        <AppText style={styles.activeBadgeText}>{t("orders.activeCountText", { count: activeCount, defaultValue: "{{count}} Active" })}</AppText>
      </View>

      <AppText style={styles.label}>{t("orders.totalActiveValue", { defaultValue: "Total Active Orders Value" })}</AppText>
      <AppText style={styles.amountText}>
        {currency} {formatNumber(totalValue)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 24,
    padding: 20,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  activeBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  label: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  amountText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginVertical: 6,
    lineHeight: 36,
    paddingBottom: 4,
  },
});
