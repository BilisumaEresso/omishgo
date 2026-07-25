// src/components/shared/analytics/RegionalPriceComparison.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View } from "react-native";
import AppText from "../../common/AppText";

export default function RegionalPriceComparison({
  hubs = [
    { city: "Adama Market Hub", region: "Oromia", price: "4,600", unit: "q", supply: "high", distance: "95 km" },
    { city: "Debre Zeit Grain Market", region: "East Shewa", price: "4,500", unit: "q", supply: "normal", distance: "45 km" },
    { city: "Addis Ababa (Mercato)", region: "Capital Hub", price: "4,850", unit: "q", supply: "normal", distance: "0 km" },
    { city: "Ziway Terminal", region: "Rift Valley", price: "4,300", unit: "q", supply: "high", distance: "160 km" },
  ],
  primaryColor = "#1565C0",
}) {
  const getSupplyBadge = (supply) => {
    if (supply === "high") {
      return { label: "High Supply", color: "#10B981", bg: "rgba(16, 185, 129, 0.1)" };
    }
    if (supply === "scarcity") {
      return { label: "Low Supply", color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)" };
    }
    return { label: "Normal Supply", color: "#2563EB", bg: "rgba(37, 99, 235, 0.1)" };
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <AppText style={styles.title}>Regional Market Prices</AppText>
        <AppText style={styles.subtitle}>Wholesale rates per quintal (100 kg) across key markets</AppText>
      </View>

      <View style={styles.list}>
        {hubs.map((hub, idx) => {
          const badge = getSupplyBadge(hub.supply);
          return (
            <View key={hub.city} style={[styles.hubRow, idx < hubs.length - 1 && styles.borderBottom]}>
              <View style={styles.leftGroup}>
                <AppText style={styles.cityName}>{hub.city}</AppText>
                <View style={styles.metaRow}>
                  <Ionicons name="location-outline" size={13} color="#64748B" />
                  <AppText style={styles.distanceText}>{hub.distance}</AppText>
                  <View style={[styles.supplyBadge, { backgroundColor: badge.bg }]}>
                    <AppText style={[styles.supplyText, { color: badge.color }]}>{badge.label}</AppText>
                  </View>
                </View>
              </View>

              <View style={styles.rightGroup}>
                <AppText style={[styles.priceText, { color: primaryColor }]}>
                  ETB {hub.price}
                </AppText>
                <AppText style={styles.unitText}>/ quintal</AppText>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  header: {
    marginBottom: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  list: {
    gap: 2,
  },
  hubRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  leftGroup: {
    flex: 1,
  },
  cityName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 3,
  },
  distanceText: {
    fontSize: 12,
    color: "#64748B",
    marginRight: 6,
  },
  supplyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  supplyText: {
    fontSize: 11,
    fontWeight: "700",
  },
  rightGroup: {
    alignItems: "flex-end",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "800",
  },
  unitText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
});
