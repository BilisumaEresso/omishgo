// Mobile/src/screens/farmer/FarmerAnalyticsScreen.js
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import AppText from "../../components/common/AppText";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import AppHeader from "../../components/layout/AppHeader";
import { useSidebar } from "../../context/SidebarContext";
import { useTheme } from "../../hooks/useTheme";

const FarmerAnalyticsScreen = ({ navigation, onSwitchTab }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { openSidebar } = useSidebar();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(API_ENDPOINTS.products.analytics)
      .then((res) => setData(res.data?.data || null))
      .catch((err) => console.warn("Analytics fetch:", err.message))
      .finally(() => setLoading(false));
  }, []);

  // Extract theme colors with fallbacks
  const primary = theme?.colors?.primary || "#2E7D32";
  const primaryContainer = theme?.colors?.primaryContainer || "#E8F5E9";
  const textPrimary = theme?.colors?.textPrimary || "#1A2E1A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6741";
  const textMuted = theme?.colors?.textMuted || "#8FAF8A";
  const background = theme?.colors?.background || "#F9FBF9";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#D0E8CE";
  const successColor = theme?.colors?.success || "#2E7D32";
  const errorColor = theme?.colors?.error || "#C62828";
  const warningColor = theme?.colors?.warning || "#F9A825";

  // ---------- This Week Stats (yours) ----------
  const weeklyStats = [
    {
      label: t("farmerAnalytics.totalProducts"),
      value: data?.totalProducts ?? 0,
    },
    {
      label: t("farmerAnalytics.totalRevenue"),
      value: data?.totalRevenue ?? 0,
    },
    { label: t("farmerAnalytics.totalOrders"), value: data?.totalOrders ?? 0 },
    { label: t("farmerAnalytics.delivered"), value: data?.delivered ?? 0 },
    { label: t("farmerAnalytics.pending"), value: data?.pending ?? 0 },
  ];

  // ---------- Market Pulse (overall market snapshot) ----------
  const marketPulse = data?.marketPulse || {
    activeBuyers: 1240,
    marketsTracked: 12,
    avgPriceChange: "+6.4%",
    topMover: t("farmerAnalytics.cropOnion"),
  };

  // ---------- Top Crops by Demand (yours) ----------
  const topCrops = data?.topCrops || [
    { _id: t("farmerAnalytics.noDataYet"), orders: 1 },
  ];
  const maxOrders = Math.max(...topCrops.map((c) => c.orders), 1);

  // ---------- Demand by Location ----------
  const locationDemand = data?.locationDemand || [
    {
      city: "Addis Ababa",
      demandLevel: "high",
      demandScore: 92,
      topCrop: t("farmerAnalytics.cropTeff"),
    },
    {
      city: "Harar",
      demandLevel: "high",
      demandScore: 85,
      topCrop: t("farmerAnalytics.cropCoffee"),
    },
    {
      city: "Adama",
      demandLevel: "medium",
      demandScore: 63,
      topCrop: t("farmerAnalytics.cropOnion"),
    },
    {
      city: "Bishoftu",
      demandLevel: "medium",
      demandScore: 58,
      topCrop: t("farmerAnalytics.cropWheat"),
    },
  ];
  const maxDemandScore = Math.max(
    ...locationDemand.map((l) => l.demandScore),
    1,
  );

  const overallMarketStats = data?.overallMarketStats || {
    totalVolume: "48,300 q",
    activeMarkets: 12,
    mostActiveRegion: "Addis Ababa",
  };

  const getDemandColor = (level) => {
    if (level === "high") return successColor;
    if (level === "medium") return warningColor;
    return textMuted;
  };

  const getDemandLabel = (level) => {
    if (level === "high") return t("farmerAnalytics.demandHigh", "High demand");
    if (level === "medium")
      return t("farmerAnalytics.demandMedium", "Medium demand");
    return t("farmerAnalytics.demandLow", "Low demand");
  };

  // ---------- Market Prices Today (expanded, actionable) ----------
  const marketPrices = data?.marketPrices || [
    { crop: t("farmerAnalytics.cropTeff"), price: "5,200", trend: "up" },
    { crop: t("farmerAnalytics.cropOnion"), price: "4,500", trend: "up" },
    { crop: t("farmerAnalytics.cropTomato"), price: "3,800", trend: "down" },
    { crop: t("farmerAnalytics.cropWheat"), price: "4,100", trend: "neutral" },
    { crop: t("farmerAnalytics.cropMaize"), price: "3,300", trend: "up" },
    { crop: t("farmerAnalytics.cropCoffee"), price: "9,600", trend: "up" },
    { crop: t("farmerAnalytics.cropChickpea"), price: "6,750", trend: "down" },
    { crop: t("farmerAnalytics.cropBarley"), price: "3,950", trend: "neutral" },
  ];

  const getTrendArrow = (trend) => {
    if (trend === "up") return "↑";
    if (trend === "down") return "↓";
    return "→";
  };

  const getTrendColor = (trend) => {
    if (trend === "up") return successColor;
    if (trend === "down") return errorColor;
    return textMuted;
  };

  const handleSellPress = (trendItem) => {
    const priceNum = trendItem.price
      ? parseInt(trendItem.price.replace(/[^0-9]/g, ""), 10)
      : null;
    navigation.navigate("PostProduct", {
      prefill: {
        cropType: trendItem.crop,
        price: priceNum,
        unit: "kg",
      },
    });
  };

  // ---------- Weekly Price Trend (aggregate, mini bar chart) ----------
  const weeklyTrend = data?.weeklyTrend || [
    { label: t("farmerAnalytics.dayMon", "Mon"), value: 62 },
    { label: t("farmerAnalytics.dayTue", "Tue"), value: 68 },
    { label: t("farmerAnalytics.dayWed", "Wed"), value: 58 },
    { label: t("farmerAnalytics.dayThu", "Thu"), value: 74 },
    { label: t("farmerAnalytics.dayFri", "Fri"), value: 80 },
    { label: t("farmerAnalytics.dayToday", "Today"), value: 91 },
  ];
  const maxTrendValue = Math.max(...weeklyTrend.map((d) => d.value), 1);

  // ---------- Insight tips ----------
  const insights = data?.insights || [
    {
      icon: "bulb-outline",
      text: t(
        "farmerAnalytics.insightOnion",
        "Onion prices are rising — consider selling this week.",
      ),
    },
    {
      icon: "location-outline",
      text: t(
        "farmerAnalytics.insightHarar",
        "Coffee demand is highest in Harar right now.",
      ),
    },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: background }]}>
      <AppHeader
        title={t("farmerAnalytics.title")}
        showMenu={true}
        showNotification={true}
        notificationCount={0}
        onMenuPress={openSidebar}
        onNotificationPress={() => navigation.navigate("Notifications")}
      />

      {loading && (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      )}

      {!loading && (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* This Week Section */}
          <AppText style={[styles.sectionTitle, { color: textPrimary }]}>
            {t("farmerAnalytics.thisWeek")}
          </AppText>
          <View style={styles.statsRow}>
            {weeklyStats.map((stat, index) => (
              <View
                key={index}
                style={[styles.statCard, { backgroundColor: primaryContainer }]}
              >
                <AppText style={[styles.statValue, { color: primary }]}>
                  {stat.value}
                </AppText>
                <AppText style={[styles.statLabel, { color: textSecondary }]}>
                  {stat.label}
                </AppText>
              </View>
            ))}
          </View>

          {/* Market Pulse */}
          <AppText
            style={[styles.sectionTitle, { color: textPrimary, marginTop: 24 }]}
          >
            {t("farmerAnalytics.marketPulse", "Market Pulse")}
          </AppText>
          <View
            style={[
              styles.pulseCard,
              { backgroundColor: surface, borderColor: border },
            ]}
          >
            <View style={styles.pulseRow}>
              <View style={styles.pulseItem}>
                <Ionicons name="people-outline" size={18} color={primary} />
                <AppText style={[styles.pulseValue, { color: textPrimary }]}>
                  {marketPulse.activeBuyers}
                </AppText>
                <AppText style={[styles.pulseLabel, { color: textMuted }]}>
                  {t("farmerAnalytics.activeBuyers", "Active buyers")}
                </AppText>
              </View>
              <View
                style={[styles.pulseDivider, { backgroundColor: border }]}
              />
              <View style={styles.pulseItem}>
                <Ionicons name="storefront-outline" size={18} color={primary} />
                <AppText style={[styles.pulseValue, { color: textPrimary }]}>
                  {marketPulse.marketsTracked}
                </AppText>
                <AppText style={[styles.pulseLabel, { color: textMuted }]}>
                  {t("farmerAnalytics.marketsTracked", "Markets tracked")}
                </AppText>
              </View>
              <View
                style={[styles.pulseDivider, { backgroundColor: border }]}
              />
              <View style={styles.pulseItem}>
                <Ionicons
                  name="trending-up-outline"
                  size={18}
                  color={successColor}
                />
                <AppText style={[styles.pulseValue, { color: successColor }]}>
                  {marketPulse.avgPriceChange}
                </AppText>
                <AppText style={[styles.pulseLabel, { color: textMuted }]}>
                  {t("farmerAnalytics.avgPriceChange", "Avg. price change")}
                </AppText>
              </View>
            </View>
            <View style={[styles.topMoverRow, { borderTopColor: border }]}>
              <Ionicons name="flame-outline" size={16} color={warningColor} />
              <AppText style={[styles.topMoverText, { color: textSecondary }]}>
                {t("farmerAnalytics.topMover", "Top mover today")}:{" "}
                <AppText style={{ color: textPrimary, fontWeight: "700" }}>
                  {marketPulse.topMover}
                </AppText>
              </AppText>
            </View>
          </View>

          {/* Top Crops by Demand */}
          <AppText
            style={[styles.sectionTitle, { color: textPrimary, marginTop: 24 }]}
          >
            {t("farmerAnalytics.topCropsByDemand")}
          </AppText>
          <View style={styles.cropsContainer}>
            {topCrops.map((crop, index) => (
              <View key={index} style={styles.cropRow}>
                <AppText style={[styles.cropName, { color: textPrimary }]}>
                  {crop._id}
                </AppText>
                <View
                  style={[styles.barContainer, { backgroundColor: border }]}
                >
                  <View
                    style={[
                      styles.bar,
                      {
                        backgroundColor: primary,
                        width: `${(crop.orders / maxOrders) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <AppText style={[styles.percentText, { color: textPrimary }]}>
                  {crop.orders}
                </AppText>
              </View>
            ))}
          </View>

          {/* Demand by Location */}
          <AppText
            style={[styles.sectionTitle, { color: textPrimary, marginTop: 24 }]}
          >
            {t("farmerAnalytics.demandByLocation", "Demand by Location")}
          </AppText>

          <View
            style={[
              styles.overallStatsCard,
              { backgroundColor: primaryContainer },
            ]}
          >
            <View style={styles.overallStatItem}>
              <AppText style={[styles.overallStatValue, { color: primary }]}>
                {overallMarketStats.totalVolume}
              </AppText>
              <AppText
                style={[styles.overallStatLabel, { color: textSecondary }]}
              >
                {t("farmerAnalytics.totalVolume", "Total volume traded")}
              </AppText>
            </View>
            <View style={styles.overallStatItem}>
              <AppText style={[styles.overallStatValue, { color: primary }]}>
                {overallMarketStats.activeMarkets}
              </AppText>
              <AppText
                style={[styles.overallStatLabel, { color: textSecondary }]}
              >
                {t("farmerAnalytics.activeMarkets", "Active markets")}
              </AppText>
            </View>
            <View style={styles.overallStatItem}>
              <AppText
                style={[styles.overallStatValue, { color: primary }]}
                numberOfLines={1}
              >
                {overallMarketStats.mostActiveRegion}
              </AppText>
              <AppText
                style={[styles.overallStatLabel, { color: textSecondary }]}
              >
                {t("farmerAnalytics.mostActiveRegion", "Most active region")}
              </AppText>
            </View>
          </View>

          <View style={styles.locationsGrid}>
            {locationDemand.map((loc, index) => (
              <View
                key={index}
                style={[
                  styles.locationCard,
                  { backgroundColor: surface, borderColor: border },
                ]}
              >
                <View style={styles.locationHeaderRow}>
                  <Ionicons name="location" size={16} color={primary} />
                  <AppText
                    style={[styles.locationName, { color: textPrimary }]}
                    numberOfLines={1}
                  >
                    {loc.city}
                  </AppText>
                </View>

                <View
                  style={[
                    styles.demandBadge,
                    { backgroundColor: getDemandColor(loc.demandLevel) + "1A" },
                  ]}
                >
                  <AppText
                    style={[
                      styles.demandBadgeText,
                      { color: getDemandColor(loc.demandLevel) },
                    ]}
                  >
                    {getDemandLabel(loc.demandLevel)}
                  </AppText>
                </View>

                <View
                  style={[styles.locationBarTrack, { backgroundColor: border }]}
                >
                  <View
                    style={[
                      styles.locationBarFill,
                      {
                        backgroundColor: getDemandColor(loc.demandLevel),
                        width: `${(loc.demandScore / maxDemandScore) * 100}%`,
                      },
                    ]}
                  />
                </View>

                <AppText
                  style={[styles.locationTopCrop, { color: textMuted }]}
                  numberOfLines={1}
                >
                  {t("farmerAnalytics.mostWanted", "Most wanted")}:{" "}
                  {loc.topCrop}
                </AppText>
              </View>
            ))}
          </View>

          {/* Weekly Price Trend (mini chart) */}
          <AppText
            style={[styles.sectionTitle, { color: textPrimary, marginTop: 24 }]}
          >
            {t("farmerAnalytics.weeklyPriceTrend", "Weekly Price Trend")}
          </AppText>
          <View
            style={[
              styles.trendCard,
              { backgroundColor: surface, borderColor: border },
            ]}
          >
            <View style={styles.trendChart}>
              {weeklyTrend.map((point, index) => {
                const barHeight = Math.max(
                  6,
                  (point.value / maxTrendValue) * 70,
                );
                const isLast = index === weeklyTrend.length - 1;
                return (
                  <View key={index} style={styles.trendColumn}>
                    <View style={styles.trendTrack}>
                      <View
                        style={[
                          styles.trendBar,
                          {
                            height: barHeight,
                            backgroundColor: isLast ? primary : primary + "55",
                          },
                        ]}
                      />
                    </View>
                    <AppText style={[styles.trendLabel, { color: textMuted }]}>
                      {point.label}
                    </AppText>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Market Prices Today */}
          <AppText
            style={[styles.sectionTitle, { color: textPrimary, marginTop: 24 }]}
          >
            {t("farmerAnalytics.marketPricesToday")}
          </AppText>
          <View style={[styles.pricesCard, { backgroundColor: surface }]}>
            {marketPrices.map((item, index) => {
              const arrow = getTrendArrow(item.trend);
              const arrowColor = getTrendColor(item.trend);
              return (
                <View
                  key={index}
                  style={[
                    styles.priceRow,
                    index !== marketPrices.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: border,
                    },
                  ]}
                >
                  <AppText
                    style={[styles.priceCropName, { color: textPrimary }]}
                    numberOfLines={1}
                  >
                    {item.crop}
                  </AppText>
                  <View style={styles.priceRight}>
                    <View style={styles.priceValueCol}>
                      <AppText
                        style={[styles.priceValue, { color: textPrimary }]}
                      >
                        {item.price} ETB/q
                      </AppText>
                      <View style={styles.priceArrowRow}>
                        <AppText
                          style={[styles.priceArrow, { color: arrowColor }]}
                        >
                          {arrow}
                        </AppText>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={[styles.sellButton, { backgroundColor: primary }]}
                      activeOpacity={0.8}
                      onPress={() => handleSellPress(item)}
                    >
                      <AppText style={styles.sellButtonText}>
                        {t("farmerAnalytics.sell", "Sell")}
                      </AppText>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Insights */}
          <AppText
            style={[styles.sectionTitle, { color: textPrimary, marginTop: 8 }]}
          >
            {t("farmerAnalytics.insights", "Insights for You")}
          </AppText>
          <View style={styles.insightsContainer}>
            {insights.map((insight, index) => (
              <View
                key={index}
                style={[
                  styles.insightCard,
                  { backgroundColor: primaryContainer },
                ]}
              >
                <Ionicons name={insight.icon} size={18} color={primary} />
                <AppText style={[styles.insightText, { color: textPrimary }]}>
                  {insight.text}
                </AppText>
              </View>
            ))}
          </View>

          {/* Footer Note */}
          <AppText style={[styles.footerNote, { color: textMuted }]}>
            {t("farmerAnalytics.referencePrices")}
          </AppText>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },

  // This week
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  statCard: {
    width: "31%",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 4,
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
  },

  // Market pulse
  pulseCard: {
    borderRadius: 14,
    borderWidth: 1,
    paddingTop: 16,
    paddingHorizontal: 8,
  },
  pulseRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  pulseItem: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 4,
  },
  pulseDivider: {
    width: 1,
    height: 50,
  },
  pulseValue: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 6,
  },
  pulseLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
    textAlign: "center",
  },
  topMoverRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    marginTop: 14,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  topMoverText: {
    fontSize: 13,
    marginLeft: 8,
    flexShrink: 1,
  },

  // Crops by demand
  cropsContainer: {
    marginBottom: 8,
  },
  cropRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  cropName: {
    width: 70,
    fontSize: 14,
    fontWeight: "600",
  },
  barContainer: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 5,
  },
  percentText: {
    width: 40,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "700",
  },

  // Overall market stats strip
  overallStatsCard: {
    flexDirection: "row",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  overallStatItem: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 4,
  },
  overallStatValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  overallStatLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
    textAlign: "center",
  },

  // Location demand cards
  locationsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  locationCard: {
    width: "48%",
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  locationHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationName: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 4,
    flexShrink: 1,
  },
  demandBadge: {
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  demandBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  locationBarTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  locationBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  locationTopCrop: {
    fontSize: 11,
    fontWeight: "500",
  },

  // Weekly trend chart
  trendCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 4,
  },
  trendChart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 100,
  },
  trendColumn: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 4,
  },
  trendTrack: {
    height: 70,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  trendBar: {
    width: 10,
    borderRadius: 5,
  },
  trendLabel: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: "500",
  },

  // Prices today
  pricesCard: {
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  priceCropName: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  priceRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceValueCol: {
    alignItems: "flex-end",
    marginRight: 10,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  priceArrowRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceArrow: {
    fontSize: 14,
    fontWeight: "700",
  },
  sellButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  sellButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  // Insights
  insightsContainer: {
    marginBottom: 8,
  },
  insightCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  insightText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 8,
    lineHeight: 18,
  },

  footerNote: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
});

export default FarmerAnalyticsScreen;
