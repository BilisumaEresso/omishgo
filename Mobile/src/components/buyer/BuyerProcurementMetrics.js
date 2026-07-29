// src/components/buyer/BuyerProcurementMetrics.js
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../common/AppText";
import { formatNumber } from "../../utils/formatNumber";

export default function BuyerProcurementMetrics({
  totalSpend = 0,
  activeOrdersCount = 0,
  uniqueFarmersCount = 12,
  currency = "ETB",
  onActiveOrdersPress,
  onPurchasesPress,
  onFarmersPress,
}) {
  const { t } = useTranslation();
  const formattedSpend = formatNumber(totalSpend || 0);

  return (
    <View style={styles.container}>
      <AppText style={styles.sectionTitle}>
        {t("buyerDashboard.procurementOverview", { defaultValue: "Procurement & Market Overview" })}
      </AppText>

      <View style={styles.row}>
        {/* Left Metric: Total Spend / Avg Rate */}
        <TouchableOpacity
          style={[styles.card, styles.cyanCard]}
          onPress={onPurchasesPress}
          activeOpacity={0.85}
        >
          <View style={[styles.iconCircle, styles.cyanIconBg]}>
            <Ionicons name="cart" size={20} color="#FFFFFF" />
          </View>

          <View>
            <AppText style={styles.amount}>
              {currency} {formattedSpend}
            </AppText>
            <AppText style={styles.label}>
              {t("buyerDashboard.totalSpend", { defaultValue: "Total Spend" })}
            </AppText>
          </View>
        </TouchableOpacity>

        {/* Middle Metric: Active Orders / Listings */}
        <TouchableOpacity
          style={[styles.card, styles.pinkCard]}
          onPress={onActiveOrdersPress}
          activeOpacity={0.85}
        >
          <View style={[styles.iconCircle, styles.pinkIconBg]}>
            <Ionicons name="cube" size={20} color="#FFFFFF" />
          </View>

          <View>
            <AppText style={styles.amount}>
              {activeOrdersCount}
            </AppText>
            <AppText style={styles.label}>
              {t("buyerDashboard.activeOrdersLabel", { defaultValue: "Active Orders" })}
            </AppText>
          </View>
        </TouchableOpacity>

        {/* Right Metric: Farmers */}
        <TouchableOpacity
          style={[styles.card, styles.emeraldCard]}
          onPress={onFarmersPress}
          activeOpacity={0.85}
        >
          <View style={[styles.iconCircle, styles.emeraldIconBg]}>
            <Ionicons name="people" size={20} color="#FFFFFF" />
          </View>

          <View>
            <AppText style={styles.amount}>
              {uniqueFarmersCount}
            </AppText>
            <AppText style={styles.label}>
              {t("buyerDashboard.verifiedFarmers", { defaultValue: "Verified Farmers" })}
            </AppText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    minHeight: 125,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  cyanCard: {
    backgroundColor: "#E0F2FE", // Soft cyan
  },
  pinkCard: {
    backgroundColor: "#FCE7F3", // Soft pink
  },
  emeraldCard: {
    backgroundColor: "#D1FAE5", // Soft emerald
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  cyanIconBg: {
    backgroundColor: "#0284C7",
  },
  pinkIconBg: {
    backgroundColor: "#E11D48",
  },
  emeraldIconBg: {
    backgroundColor: "#059669",
  },
  amount: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 8,
    lineHeight: 22,
    paddingBottom: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 2,
  },
});
