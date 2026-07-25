// src/components/buyer/BuyerProcurementMetrics.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../common/AppText";

export default function BuyerProcurementMetrics({
  totalSpend = 0,
  activeOrdersCount = 0,
  currency = "ETB",
  onActiveOrdersPress,
  onPurchasesPress,
}) {
  const formattedSpend = Number(totalSpend || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <View style={styles.container}>
      <AppText style={styles.sectionTitle}>Procurement Summary</AppText>

      <View style={styles.row}>
        {/* Left Metric: Total Spend */}
        <TouchableOpacity
          style={[styles.card, styles.cyanCard]}
          onPress={onPurchasesPress}
          activeOpacity={0.85}
        >
          <View style={[styles.iconCircle, styles.cyanIconBg]}>
            <Ionicons name="cart" size={22} color="#0284C7" />
          </View>

          <AppText style={styles.amount}>
            {currency} {formattedSpend}
          </AppText>
          <AppText style={styles.label}>Total Spent</AppText>
        </TouchableOpacity>

        {/* Right Metric: Active Orders */}
        <TouchableOpacity
          style={[styles.card, styles.pinkCard]}
          onPress={onActiveOrdersPress}
          activeOpacity={0.85}
        >
          <View style={[styles.iconCircle, styles.pinkIconBg]}>
            <Ionicons name="cube" size={22} color="#EC4899" />
          </View>

          <AppText style={styles.amount}>
            {activeOrdersCount} {activeOrdersCount === 1 ? "Order" : "Orders"}
          </AppText>
          <AppText style={styles.label}>Active Shipments</AppText>
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
    color: "#1F2937",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 14,
  },
  card: {
    flex: 1,
    borderRadius: 22,
    padding: 18,
    minHeight: 140,
    justifyContent: "space-between",
  },
  cyanCard: {
    backgroundColor: "#E0F2FE", // Soft cyan
  },
  pinkCard: {
    backgroundColor: "#FCE7F3", // Soft pink
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  cyanIconBg: {
    backgroundColor: "#38BDF8",
  },
  pinkIconBg: {
    backgroundColor: "#F43F5E",
  },
  amount: {
    fontSize: 19,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 2,
  },
});
