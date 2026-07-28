// src/screens/farmer/FarmerAnalyticsScreen.js
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useSidebar } from "../../context/SidebarContext";
import { useTheme } from "../../hooks/useTheme";
import { getLocalizedCropName } from "../../constants/crops";
import { getLocalizedUnitName } from "../../constants/units";
import {
  getLocalizedWeredaName,
  getLocalizedZoneName,
  getLocalizedRegionName,
} from "../../constants/locations";
import { formatNumber } from "../../utils/formatNumber";

export default function FarmerAnalyticsScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const { theme } = useTheme();
  const { openSidebar } = useSidebar();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(API_ENDPOINTS.products.analytics)
      .then((res) => setData(res.data?.data || null))
      .catch((err) => console.warn("Farmer Analytics fetch error:", err.message))
      .finally(() => setLoading(false));
  }, []);

  const primaryColor = theme?.colors?.primary || "#2E7D32";
  const primaryContainer = theme?.colors?.primaryContainer || "#E8F5E9";
  const surfaceColor = theme?.colors?.surface || "#FFFFFF";
  const backgroundColor = theme?.colors?.background || "#F9FBF9";
  const textPrimary = theme?.colors?.textPrimary || "#1A2E1A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6741";
  const textMuted = theme?.colors?.textMuted || "#8FAF8A";
  const border = theme?.colors?.border || "#D0E8CE";
  const successColor = "#2E7D32";
  const errorColor = "#C62828";
  const warningColor = "#F9A825";

  // Farmer metrics
  const farmerMetrics = [
    { label: t("farmerProducts.activeListings", { defaultValue: "Active Listings" }), value: data?.totalProducts ?? 8, icon: "cube-outline" },
    { label: t("farmerDashboard.totalRevenue", { defaultValue: "Total Revenue" }), value: data?.totalRevenue ? `ETB ${data.totalRevenue}` : "ETB 142.5k", icon: "cash-outline" },
    { label: t("farmerOrders.ordersDelivered", { defaultValue: "Orders Delivered" }), value: data?.delivered ?? 34, icon: "checkmark-circle-outline" },
    { label: t("farmerOrders.pendingOrders", { defaultValue: "Pending Orders" }), value: data?.pending ?? 5, icon: "time-outline" },
  ];

  const getLocalizedLocationName = (locStr) => {
    if (!locStr) return "";
    const loc =
      getLocalizedWeredaName(locStr, currentLang) ||
      getLocalizedZoneName(locStr, currentLang) ||
      getLocalizedRegionName(locStr, currentLang);
    return loc && loc !== locStr ? loc : locStr;
  };

  // Market Prices in Quintal (q)
  const marketPrices = data?.marketPrices || [
    { crop: "Red Onion", price: 4500, unit: "q", trend: "up", change: "+5.8%", market: "Adama Town" },
    { crop: "Teff", price: 5200, unit: "q", trend: "up", change: "+3.2%", market: "Bishoftu Town" },
    { crop: "Tomato", price: 3800, unit: "q", trend: "down", change: "-2.4%", market: "Meki Town" },
    { crop: "Garlic", price: 12000, unit: "q", trend: "up", change: "+8.5%", market: "Bishoftu Town" },
    { crop: "Wheat", price: 4100, unit: "q", trend: "neutral", change: "0.0%", market: "Arsi" },
    { crop: "Coffee", price: 9600, unit: "q", trend: "up", change: "+4.1%", market: "Jimma Town" },
  ];

  // Regional Buyer Demand Heatmap
  const locationDemand = data?.locationDemand || [
    { city: "Addis Ababa", demandLevel: "high", demandScore: 94, topCrop: "Teff", activeBuyers: 420 },
    { city: "Adama Town", demandLevel: "high", demandScore: 88, topCrop: "Red Onion", activeBuyers: 310 },
    { city: "Jimma Town", demandLevel: "high", demandScore: 82, topCrop: "Coffee", activeBuyers: 185 },
    { city: "Bishoftu Town", demandLevel: "medium", demandScore: 65, topCrop: "Garlic", activeBuyers: 140 },
  ];

  const handleSellPress = (cropItem) => {
    navigation?.navigate("PostProduct", {
      prefill: {
        cropType: cropItem.crop,
        price: cropItem.price,
        unit: "q",
      },
    });
  };

  const getDemandColor = (level) => {
    if (level === "high") return successColor;
    if (level === "medium") return warningColor;
    return textMuted;
  };

  return (
    <View style={[styles.screen, { backgroundColor }]}>
      <AppHeader
        title={t("farmerAnalytics.title", { defaultValue: "Market Insights & Sales" })}
        subtitle={t("analytics.subtitle", { unit: getLocalizedUnitName("q", currentLang, t), defaultValue: `Wholesale market rates per ${getLocalizedUnitName("q", currentLang, t)}` })}
        showMenu={true}
        onMenuPress={openSidebar}
        showNotification={true}
        onNotificationPress={() => navigation?.navigate("Notifications")}
      />

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* 1. Store Performance Grid */}
          <AppText style={[styles.sectionTitle, { color: textPrimary }]}>
            {t("farmerAnalytics.storePerformance", { defaultValue: "Your Store Performance" })}
          </AppText>
          <View style={styles.metricsGrid}>
            {farmerMetrics.map((item, idx) => (
              <View key={idx} style={[styles.metricCard, { backgroundColor: primaryContainer }]}>
                <Ionicons name={item.icon} size={20} color={primaryColor} style={{ marginBottom: 6 }} />
                <AppText style={[styles.metricVal, { color: primaryColor }]}>{item.value}</AppText>
                <AppText style={[styles.metricLabel, { color: textSecondary }]}>{item.label}</AppText>
              </View>
            ))}
          </View>

          {/* 2. Market Rates & Quick Sell */}
          <View style={styles.sectionHeaderRow}>
            <AppText style={[styles.sectionTitle, { color: textPrimary }]}>
              {t("analytics.marketRatesTitle", { defaultValue: "Market Rates per Quintal" })}
            </AppText>
            <TouchableOpacity
              onPress={() => navigation?.navigate("PostProduct")}
              activeOpacity={0.8}
            >
              <AppText style={[styles.addListingBtnText, { color: primaryColor }]}>
                {t("farmerProducts.addListingBtn", { defaultValue: "+ Post Listing" })}
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={[styles.pricesCard, { backgroundColor: surfaceColor, borderColor: border }]}>
            {marketPrices.map((item, idx) => {
              const isUp = item.trend === "up";
              const isDown = item.trend === "down";
              const localizedCrop = getLocalizedCropName(item.crop, currentLang, t);
              const localizedUnit = getLocalizedUnitName(item.unit || "q", currentLang, t);
              const localizedMarket = getLocalizedLocationName(item.market);

              return (
                <View
                  key={item.crop}
                  style={[styles.priceRow, idx < marketPrices.length - 1 && { borderBottomWidth: 1, borderBottomColor: border }]}
                >
                  <View style={styles.priceLeft}>
                    <AppText style={[styles.cropTitle, { color: textPrimary }]}>{localizedCrop}</AppText>
                    <AppText style={[styles.marketName, { color: textMuted }]}>{localizedMarket}</AppText>
                  </View>

                  <View style={styles.priceCenter}>
                    <AppText style={[styles.priceText, { color: textPrimary }]}>
                      ETB {formatNumber(item.price)} / {localizedUnit}
                    </AppText>
                    <View style={styles.trendPillRow}>
                      <Ionicons
                        name={isUp ? "arrow-up" : isDown ? "arrow-down" : "remove"}
                        size={12}
                        color={isUp ? successColor : isDown ? errorColor : textMuted}
                      />
                      <AppText
                        style={[
                          styles.trendText,
                          { color: isUp ? successColor : isDown ? errorColor : textMuted },
                        ]}
                      >
                        {item.change}
                      </AppText>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.sellBtn, { backgroundColor: primaryColor }]}
                    onPress={() => handleSellPress(item)}
                    activeOpacity={0.85}
                  >
                    <AppText style={styles.sellBtnText}>{t("farmerAnalytics.sellHarvest", { defaultValue: "Sell Harvest" })}</AppText>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {/* 3. Regional Buyer Demand */}
          <AppText style={[styles.sectionTitle, { color: textPrimary, marginTop: 24 }]}>
            {t("farmerAnalytics.buyerDemandByLoc", { defaultValue: "Buyer Demand by Location" })}
          </AppText>
          <View style={styles.locationGrid}>
            {locationDemand.map((loc) => {
              const badgeColor = getDemandColor(loc.demandLevel);
              const localizedCity = getLocalizedLocationName(loc.city);
              const localizedTopCrop = getLocalizedCropName(loc.topCrop, currentLang, t);

              return (
                <View key={loc.city} style={[styles.locationCard, { backgroundColor: surfaceColor, borderColor: border }]}>
                  <View style={styles.locationTopRow}>
                    <View style={styles.cityRow}>
                      <Ionicons name="location-outline" size={16} color={primaryColor} />
                      <AppText style={[styles.cityName, { color: textPrimary }]}>{localizedCity}</AppText>
                    </View>
                    <View style={[styles.demandBadge, { backgroundColor: badgeColor + "18" }]}>
                      <AppText style={[styles.demandText, { color: badgeColor }]}>
                        {loc.demandLevel.toUpperCase()} {t("analytics.demand", { defaultValue: "DEMAND" })}
                      </AppText>
                    </View>
                  </View>

                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { backgroundColor: badgeColor, width: `${loc.demandScore}%` }]} />
                  </View>

                  <View style={styles.locationFooterRow}>
                    <AppText style={styles.topCropText}>{t("analytics.topWanted", { defaultValue: "Top Wanted" })}: {localizedTopCrop}</AppText>
                    <AppText style={styles.buyersCountText}>{t("analytics.buyersCount", { count: loc.activeBuyers, defaultValue: `${loc.activeBuyers} Buyers` })}</AppText>
                  </View>

                  <TouchableOpacity
                    style={[styles.targetMarketBtn, { borderColor: primaryColor }]}
                    onPress={() =>
                      navigation?.navigate("PostProduct", {
                        prefill: { cropType: loc.topCrop, unit: "q" },
                      })
                    }
                    activeOpacity={0.8}
                  >
                    <AppText style={[styles.targetMarketText, { color: primaryColor }]}>
                      {t("analytics.targetMarket", { defaultValue: "Target This Market" })}
                    </AppText>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {/* 4. Actionable Market Tips */}
          <AppText style={[styles.sectionTitle, { color: textPrimary, marginTop: 24 }]}>
            {t("analytics.marketTips", { defaultValue: "Market Tips" })}
          </AppText>
          <View style={styles.advisoryList}>
            <View style={[styles.advisoryCard, { backgroundColor: primaryContainer }]}>
              <View style={styles.advisoryTop}>
                <Ionicons name="bulb-outline" size={20} color={primaryColor} />
                <AppText style={[styles.advisoryTitle, { color: textPrimary }]}>
                  {t("farmerAnalytics.advisoryOnionTitle", { crop: getLocalizedCropName("Red Onion", currentLang, t), location: getLocalizedLocationName("Adama Town"), defaultValue: `${getLocalizedCropName("Red Onion", currentLang, t)} Price Rise in ${getLocalizedLocationName("Adama Town")}` })}
                </AppText>
              </View>
              <AppText style={[styles.advisoryBody, { color: textSecondary }]}>
                {t("farmerAnalytics.advisoryOnionBody", { crop: getLocalizedCropName("Red Onion", currentLang, t), unit: getLocalizedUnitName("q", currentLang, t), location: getLocalizedLocationName("Adama Town"), defaultValue: `Wholesale ${getLocalizedCropName("Red Onion", currentLang, t)} prices are up +5.8% (ETB 4,500 / ${getLocalizedUnitName("q", currentLang, t)}) in ${getLocalizedLocationName("Adama Town")}. Post your harvest today to secure good prices.` })}
              </AppText>
              <TouchableOpacity
                style={[styles.advisoryActionBtn, { backgroundColor: primaryColor }]}
                onPress={() => navigation?.navigate("PostProduct", { prefill: { cropType: "Red Onion", price: 4500, unit: "q" } })}
                activeOpacity={0.85}
              >
                <AppText style={styles.advisoryActionText}>
                  {t("farmerAnalytics.postCropListing", { crop: getLocalizedCropName("Red Onion", currentLang, t), defaultValue: `Post ${getLocalizedCropName("Red Onion", currentLang, t)} Listing →` })}
                </AppText>
              </TouchableOpacity>
            </View>

            <View style={[styles.advisoryCard, { backgroundColor: "#FEF3C7" }]}>
              <View style={styles.advisoryTop}>
                <Ionicons name="location-outline" size={20} color="#D97706" />
                <AppText style={[styles.advisoryTitle, { color: "#78350F" }]}>
                  {t("farmerAnalytics.advisoryCoffeeTitle", { crop: getLocalizedCropName("Coffee", currentLang, t), location: getLocalizedLocationName("Jimma Town"), defaultValue: `High Demand for ${getLocalizedCropName("Coffee", currentLang, t)} in ${getLocalizedLocationName("Jimma Town")}` })}
                </AppText>
              </View>
              <AppText style={[styles.advisoryBody, { color: "#92400E" }]}>
                {t("farmerAnalytics.advisoryCoffeeBody", { crop: getLocalizedCropName("Coffee", currentLang, t), location: getLocalizedLocationName("Jimma Town"), defaultValue: `185 buyers are searching for ${getLocalizedCropName("Coffee", currentLang, t)} in ${getLocalizedLocationName("Jimma Town")}. List your stock to get instant buyer orders.` })}
              </AppText>
              <TouchableOpacity
                style={[styles.advisoryActionBtn, { backgroundColor: "#D97706" }]}
                onPress={() => navigation?.navigate("PostProduct", { prefill: { cropType: "Coffee", price: 9600, unit: "q" } })}
                activeOpacity={0.85}
              >
                <AppText style={styles.advisoryActionText}>
                  {t("farmerAnalytics.postCropListing", { crop: getLocalizedCropName("Coffee", currentLang, t), defaultValue: `Post ${getLocalizedCropName("Coffee", currentLang, t)} Listing →` })}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 22,
    marginBottom: 10,
  },
  addListingBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  metricCard: {
    width: "48%",
    padding: 14,
    borderRadius: 16,
  },
  metricVal: {
    fontSize: 20,
    fontWeight: "800",
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  pricesCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 6,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  priceLeft: {
    flex: 1,
  },
  cropTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  marketName: {
    fontSize: 11,
    marginTop: 2,
  },
  priceCenter: {
    alignItems: "flex-end",
    marginRight: 12,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "700",
  },
  trendPillRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 2,
  },
  trendText: {
    fontSize: 11,
    fontWeight: "700",
  },
  sellBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  sellBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  locationGrid: {
    gap: 12,
  },
  locationCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  locationTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cityName: {
    fontSize: 15,
    fontWeight: "700",
  },
  demandBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  demandText: {
    fontSize: 10,
    fontWeight: "800",
  },
  progressTrack: {
    height: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 3,
    overflow: "hidden",
    marginVertical: 10,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  locationFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  topCropText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  buyersCountText: {
    fontSize: 12,
    color: "#0F172A",
    fontWeight: "700",
  },
  targetMarketBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  targetMarketText: {
    fontSize: 13,
    fontWeight: "700",
  },
  advisoryList: {
    gap: 12,
  },
  advisoryCard: {
    padding: 16,
    borderRadius: 18,
  },
  advisoryTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  advisoryTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  advisoryBody: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  advisoryActionBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  advisoryActionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
