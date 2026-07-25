// src/components/shared/analytics/MarketAnalyticsHero.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View } from "react-native";
import AppText from "../../common/AppText";

export default function MarketAnalyticsHero({
  commodity = {
    crop: "Red Onion",
    price: "4,500",
    unit: "q",
    change: "+5.8%",
    isPositive: true,
    high7d: "4,800",
    low7d: "3,700",
    volume: "485 q",
  },
  primaryColor = "#1565C0",
}) {
  return (
    <View style={styles.card}>
      {/* Top Header */}
      <View style={styles.topRow}>
        <View style={styles.cropTitleRow}>
          <AppText style={styles.cropTitle}>{commodity.crop}</AppText>
          <AppText style={styles.marketSub}>Ethiopian Wholesale Average</AppText>
        </View>

        <View
          style={[
            styles.changePill,
            {
              backgroundColor: commodity.isPositive
                ? "rgba(16, 185, 129, 0.12)"
                : "rgba(239, 68, 68, 0.12)",
            },
          ]}
        >
          <Ionicons
            name={commodity.isPositive ? "trending-up" : "trending-down"}
            size={14}
            color={commodity.isPositive ? "#10B981" : "#EF4444"}
          />
          <AppText
            style={[
              styles.changeText,
              { color: commodity.isPositive ? "#10B981" : "#EF4444" },
            ]}
          >
            {commodity.change} (7 days)
          </AppText>
        </View>
      </View>

      {/* Main Price */}
      <View style={styles.priceRow}>
        <AppText style={styles.priceAmount}>ETB {commodity.price}</AppText>
        <AppText style={styles.priceUnit}>/ {commodity.unit}</AppText>
      </View>

      {/* 7-Day Low / High Range */}
      <View style={styles.rangeSection}>
        <View style={styles.rangeLabels}>
          <AppText style={styles.rangeText}>Low: ETB {commodity.low7d} / q</AppText>
          <AppText style={styles.rangeText}>High: ETB {commodity.high7d} / q</AppText>
        </View>
        <View style={styles.rangeTrack}>
          <View style={[styles.rangeFill, { backgroundColor: primaryColor }]} />
        </View>
      </View>

      {/* Footer Info */}
      <View style={styles.footerRow}>
        <AppText style={styles.footerText}>Total Volume Traded: {commodity.volume}</AppText>
        <AppText style={styles.footerText}>12 Regional Markets</AppText>
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
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cropTitleRow: {
    flex: 1,
  },
  cropTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  marketSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  changePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 16,
  },
  priceAmount: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  priceUnit: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "600",
    marginLeft: 4,
  },
  rangeSection: {
    marginBottom: 14,
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  rangeText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  rangeTrack: {
    height: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 3,
    overflow: "hidden",
  },
  rangeFill: {
    width: "75%",
    height: "100%",
    borderRadius: 3,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 10,
  },
  footerText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
});
