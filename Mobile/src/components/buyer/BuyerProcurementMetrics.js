// src/components/buyer/BuyerProcurementMetrics.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../common/AppText";

export default function BuyerProcurementMetrics({
  totalSpend = 0,
  activeOrdersCount = 0,
  uniqueFarmersCount = 12,
  currency = "ETB",
  onActiveOrdersPress,
  onPurchasesPress,
  onFarmersPress,
}) {
  const formattedSpend = Number(totalSpend || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <View style={styles.container}>
      <AppText style={styles.sectionTitle}>Procurement & Market Overview</AppText>

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
            <AppText style={styles.label}>Procurement Rate</AppText>
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
              {activeOrdersCount} {activeOrdersCount === 1 ? "Item" : "Items"}
            </AppText>
            <AppText style={styles.label}>Active Supply</AppText>
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
              {uniqueFarmersCount} Farmers
            </AppText>
            <AppText style={styles.label}>Verified</AppText>
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
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 2,
  },
});
