// src/components/shared/analytics/MarketAnalyticsHero.js
import { useTranslation } from "react-i18next";
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
    volume: "4,850 q",
    hubsCount: 12,
  },
  primaryColor = "#15803D",
  isFarmer = true,
}) {
  const { t } = useTranslation();
  const bgGradient = isFarmer ? "#15803D" : "#1565C0";
  const badgeColor = isFarmer ? "#A7F3D0" : "#BFDBFE";

  return (
    <View style={[styles.card, { backgroundColor: bgGradient }]}>
      {/* Top Header */}
      <View style={styles.topRow}>
        <View style={styles.cropTitleRow}>
          <View style={styles.tagBadge}>
            <Ionicons name="stats-chart" size={13} color={badgeColor} />
            <AppText style={[styles.tagBadgeText, { color: badgeColor }]}>
              {t("analytics.nationalCommodityIndex", { defaultValue: "National Commodity Index" })}
            </AppText>
          </View>
          <AppText style={styles.cropTitle}>{commodity.crop}</AppText>
        </View>

        <View
          style={[
            styles.changePill,
            {
              backgroundColor: commodity.isPositive
                ? "rgba(16, 185, 129, 0.2)"
                : "rgba(239, 68, 68, 0.2)",
            },
          ]}
        >
          <Ionicons
            name={commodity.isPositive ? "trending-up" : "trending-down"}
            size={14}
            color={commodity.isPositive ? "#4ADE80" : "#FCA5A5"}
          />
          <AppText
            style={[
              styles.changeText,
              { color: commodity.isPositive ? "#4ADE80" : "#FCA5A5" },
            ]}
          >
            {commodity.change} (7d)
          </AppText>
        </View>
      </View>

      {/* Main Price */}
      <View style={styles.priceRow}>
        <AppText style={styles.priceAmount}>ETB {commodity.price}</AppText>
        <AppText style={styles.priceUnit}>/ {commodity.unit}</AppText>
      </View>

      {/* 7-Day Low / High Range Track */}
      <View style={styles.rangeSection}>
        <View style={styles.rangeLabels}>
          <AppText style={styles.rangeText}>7d Low: ETB {commodity.low7d}/q</AppText>
          <AppText style={styles.rangeText}>7d High: ETB {commodity.high7d}/q</AppText>
        </View>
        <View style={styles.rangeTrack}>
          <View style={styles.rangeFill} />
        </View>
      </View>

      {/* Footer Info */}
      <View style={styles.footerRow}>
        <View style={styles.footerItem}>
          <Ionicons name="cube-outline" size={13} color="rgba(255,255,255,0.7)" />
          <AppText style={styles.footerText}>Traded Vol: {commodity.volume}</AppText>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.7)" />
          <AppText style={styles.footerText}>{commodity.hubsCount || 12} Regional Hubs</AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
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
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cropTitleRow: {
    flex: 1,
  },
  tagBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  tagBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  cropTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
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
    fontWeight: "800",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 16,
  },
  priceAmount: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  priceUnit: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
    marginLeft: 6,
  },
  rangeSection: {
    marginBottom: 16,
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  rangeText: {
    fontSize: 11.5,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "600",
  },
  rangeTrack: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  rangeFill: {
    width: "72%",
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.15)",
    paddingTop: 12,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "600",
  },
});
