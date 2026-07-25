// src/components/farmer/FarmerProductsHeroCard.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../common/AppText";

export default function FarmerProductsHeroCard({
  totalVolume = 0,
  totalValuation = 0,
  currency = "ETB",
  onPostHarvest,
}) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Ionicons name="leaf" size={14} color="#A7F3D0" />
          <AppText style={styles.badgeText}>Crop Stock Management</AppText>
        </View>

        <TouchableOpacity style={styles.actionBtn} onPress={onPostHarvest} activeOpacity={0.85}>
          <Ionicons name="add" size={16} color="#15803D" />
          <AppText style={styles.actionBtnText}>+ Post Listing</AppText>
        </TouchableOpacity>
      </View>

      <AppText style={styles.label}>Total Active Harvest Volume</AppText>
      <AppText style={styles.amountText}>
        {totalVolume} <AppText style={styles.unitText}>quintals (q)</AppText>
      </AppText>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <View>
          <AppText style={styles.subLabel}>Estimated Total Inventory Value</AppText>
          <AppText style={styles.subValue}>
            {currency} {Number(totalValuation).toLocaleString()}
          </AppText>
        </View>
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
  unitText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DCFCE7",
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
    fontSize: 11.5,
    fontWeight: "500",
  },
  subValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 2,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  actionBtnText: {
    color: "#15803D",
    fontSize: 12.5,
    fontWeight: "800",
  },
});
