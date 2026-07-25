// src/components/farmer/FarmerProductsMetricsBar.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../common/AppText";

export default function FarmerProductsMetricsBar({
  activeListingsCount = 0,
  soldOutCount = 0,
  currency = "ETB",
  onActivePress,
  onSoldPress,
}) {
  return (
    <View style={styles.metricsRow}>
      {/* Active Market Listings Card */}
      <TouchableOpacity
        style={[styles.metricCard, { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0" }]}
        onPress={onActivePress}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconBg, { backgroundColor: "#16A34A" }]}>
            <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
          </View>
          <AppText style={styles.badgeLabel}>Live On Market</AppText>
        </View>

        <AppText style={[styles.metricValue, { color: "#065F46" }]}>
          {activeListingsCount}
        </AppText>
        <AppText style={[styles.metricLabel, { color: "#047857" }]}>
          Active Harvest Crops
        </AppText>
      </TouchableOpacity>

      {/* Sold Out Harvest Card */}
      <TouchableOpacity
        style={[styles.metricCard, { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" }]}
        onPress={onSoldPress}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconBg, { backgroundColor: "#2563EB" }]}>
            <Ionicons name="archive" size={16} color="#FFFFFF" />
          </View>
          <AppText style={[styles.badgeLabel, { color: "#1D4ED8" }]}>Sold</AppText>
        </View>

        <AppText style={[styles.metricValue, { color: "#1E40AF" }]}>
          {soldOutCount}
        </AppText>
        <AppText style={[styles.metricLabel, { color: "#1D4ED8" }]}>
          Sold Out Batches
        </AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  metricsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  iconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
});
