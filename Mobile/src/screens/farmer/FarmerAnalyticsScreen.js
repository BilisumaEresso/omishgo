// Mobile/src/screens/farmer/FarmerAnalyticsScreen.js
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
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

  // This Week Stats
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

  // Top Crops by Demand
  const topCrops = data?.topCrops || [
    { _id: t("farmerAnalytics.noDataYet"), orders: 1 },
  ];
  const maxOrders = Math.max(...topCrops.map((c) => c.orders), 1);

  // Market Prices Today
  const marketPrices = [
    { name: t("farmerAnalytics.cropTeff"), price: "5,200", trend: "up" },
    { name: t("farmerAnalytics.cropOnion"), price: "4,500", trend: "up" },
    { name: t("farmerAnalytics.cropTomato"), price: "3,800", trend: "down" },
    { name: t("farmerAnalytics.cropWheat"), price: "4,100", trend: "neutral" },
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
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 80,
          }}
        >
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
                  >
                    {item.name}
                  </AppText>
                  <View style={styles.priceRight}>
                    <AppText
                      style={[styles.priceValue, { color: textPrimary }]}
                    >
                      {item.price} ETB/q
                    </AppText>
                    <AppText style={[styles.priceArrow, { color: arrowColor }]}>
                      {"  "}
                      {arrow}
                    </AppText>
                  </View>
                </View>
              );
            })}
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
  scrollContent: {
    paddingTop: 16, // <-- breathing room below the header
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
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
  },
  priceRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  priceArrow: {
    fontSize: 16,
    fontWeight: "700",
  },
  footerNote: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
});

export default FarmerAnalyticsScreen;
