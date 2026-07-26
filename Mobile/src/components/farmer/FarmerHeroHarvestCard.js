// src/components/farmer/FarmerHeroHarvestCard.js
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../common/AppText";
import { useTheme } from "../../hooks/useTheme";

export default function FarmerHeroHarvestCard({
  totalRevenue = 0,
  activeInventory = 0,
  currency = "ETB",
  onPostHarvest,
  onViewOrders,
}) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View style={styles.cardContainer}>
      {/* Top Banner Row */}
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Ionicons name="leaf-outline" size={14} color="#A7F3D0" />
          <AppText style={styles.badgeText}>{t("farmerDashboard.producerOps", { defaultValue: "Producer Operations" })}</AppText>
        </View>

        <TouchableOpacity style={styles.historyBtn} onPress={onViewOrders} activeOpacity={0.8}>
          <AppText style={styles.historyBtnText}>{t("farmerDashboard.salesHistory", { defaultValue: "Sales History" })}</AppText>
          <Ionicons name="chevron-forward" size={14} color="#E2E8F0" />
        </TouchableOpacity>
      </View>

      {/* Main Revenue Amount */}
      <AppText style={styles.label}>{t("farmerDashboard.totalHarvestRevenue", { defaultValue: "Total Harvest Revenue" })}</AppText>
      <AppText style={styles.amountText}>
        {currency} {Number(totalRevenue).toLocaleString("en-US")}
      </AppText>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Inventory KPI & Primary Action */}
      <View style={styles.bottomRow}>
        <View>
          <AppText style={styles.subLabel}>{t("farmerDashboard.activeStockListed", { defaultValue: "Active Stock Listed" })}</AppText>
          <AppText style={styles.subValue}>{activeInventory} {t("units.quintal", { defaultValue: "quintals (q)" })}</AppText>
        </View>

        <TouchableOpacity style={styles.actionBtn} onPress={onPostHarvest} activeOpacity={0.85}>
          <Ionicons name="add-circle" size={18} color="#15803D" />
          <AppText style={styles.actionBtnText}>+ {t("farmerDashboard.listHarvest", { defaultValue: "Post Harvest" })}</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#15803D",
    borderRadius: 24,
    padding: 20,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: "#15803D",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
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
    color: "#A7F3D0",
    fontSize: 12,
    fontWeight: "700",
  },
  historyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  historyBtnText: {
    color: "#E2E8F0",
    fontSize: 12,
    fontWeight: "600",
  },
  label: {
    color: "#DCFCE7",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  amountText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    marginVertical: 14,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subLabel: {
    color: "#DCFCE7",
    fontSize: 11,
    fontWeight: "500",
  },
  subValue: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 2,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  actionBtnText: {
    color: "#15803D",
    fontSize: 13,
    fontWeight: "800",
  },
});
