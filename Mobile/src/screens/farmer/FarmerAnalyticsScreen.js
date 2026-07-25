// src/screens/farmer/FarmerAnalyticsScreen.js
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

export default function FarmerAnalyticsScreen({ navigation }) {
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
    { label: "Active Listings", value: data?.totalProducts ?? 8, icon: "cube-outline" },
    { label: "Total Revenue", value: data?.totalRevenue ? `ETB ${data.totalRevenue}` : "ETB 142.5k", icon: "cash-outline" },
    { label: "Orders Delivered", value: data?.delivered ?? 34, icon: "checkmark-circle-outline" },
    { label: "Pending Orders", value: data?.pending ?? 5, icon: "time-outline" },
  ];

  // Market Prices in Quintal (q)
  const marketPrices = data?.marketPrices || [
    { crop: "Red Onion", price: 4500, unit: "q", trend: "up", change: "+5.8%", market: "Adama Market" },
    { crop: "White Teff", price: 5200, unit: "q", trend: "up", change: "+3.2%", market: "Debre Zeit" },
    { crop: "Fresh Tomato", price: 3800, unit: "q", trend: "down", change: "-2.4%", market: "Ziway" },
    { crop: "Garlic", price: 12000, unit: "q", trend: "up", change: "+8.5%", market: "Bishoftu" },
    { crop: "Wheat", price: 4100, unit: "q", trend: "neutral", change: "0.0%", market: "Arsi" },
    { crop: "Coffee Beans", price: 9600, unit: "q", trend: "up", change: "+4.1%", market: "Harar" },
  ];

  // Regional Buyer Demand Heatmap
  const locationDemand = data?.locationDemand || [
    { city: "Addis Ababa", demandLevel: "high", demandScore: 94, topCrop: "White Teff", activeBuyers: 420 },
    { city: "Adama Hub", demandLevel: "high", demandScore: 88, topCrop: "Red Onion", activeBuyers: 310 },
    { city: "Harar Terminal", demandLevel: "high", demandScore: 82, topCrop: "Coffee Beans", activeBuyers: 185 },
    { city: "Bishoftu", demandLevel: "medium", demandScore: 65, topCrop: "Garlic", activeBuyers: 140 },
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
        title="Market Insights & Sales"
        subtitle="Wholesale market rates per quintal (100 kg)"
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
            Your Store Performance
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
              Market Rates per Quintal
            </AppText>
            <TouchableOpacity
              onPress={() => navigation?.navigate("PostProduct")}
              activeOpacity={0.8}
            >
              <AppText style={[styles.addListingBtnText, { color: primaryColor }]}>
                + Post Listing
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={[styles.pricesCard, { backgroundColor: surfaceColor, borderColor: border }]}>
            {marketPrices.map((item, idx) => {
              const isUp = item.trend === "up";
              const isDown = item.trend === "down";
              return (
                <View
                  key={item.crop}
                  style={[styles.priceRow, idx < marketPrices.length - 1 && { borderBottomWidth: 1, borderBottomColor: border }]}
                >
                  <View style={styles.priceLeft}>
                    <AppText style={[styles.cropTitle, { color: textPrimary }]}>{item.crop}</AppText>
                    <AppText style={[styles.marketName, { color: textMuted }]}>{item.market}</AppText>
                  </View>

                  <View style={styles.priceCenter}>
                    <AppText style={[styles.priceText, { color: textPrimary }]}>
                      ETB {item.price.toLocaleString()} / q
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
                    <AppText style={styles.sellBtnText}>Sell Harvest</AppText>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {/* 3. Regional Buyer Demand */}
          <AppText style={[styles.sectionTitle, { color: textPrimary, marginTop: 24 }]}>
            Buyer Demand by Location
          </AppText>
          <View style={styles.locationGrid}>
            {locationDemand.map((loc) => {
              const badgeColor = getDemandColor(loc.demandLevel);
              return (
                <View key={loc.city} style={[styles.locationCard, { backgroundColor: surfaceColor, borderColor: border }]}>
                  <View style={styles.locationTopRow}>
                    <View style={styles.cityRow}>
                      <Ionicons name="location-outline" size={16} color={primaryColor} />
                      <AppText style={[styles.cityName, { color: textPrimary }]}>{loc.city}</AppText>
                    </View>
                    <View style={[styles.demandBadge, { backgroundColor: badgeColor + "18" }]}>
                      <AppText style={[styles.demandText, { color: badgeColor }]}>
                        {loc.demandLevel.toUpperCase()} DEMAND
                      </AppText>
                    </View>
                  </View>

                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { backgroundColor: badgeColor, width: `${loc.demandScore}%` }]} />
                  </View>

                  <View style={styles.locationFooterRow}>
                    <AppText style={styles.topCropText}>Top Wanted: {loc.topCrop}</AppText>
                    <AppText style={styles.buyersCountText}>{loc.activeBuyers} Buyers</AppText>
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
                      Target This Market
                    </AppText>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {/* 4. Actionable Market Tips */}
          <AppText style={[styles.sectionTitle, { color: textPrimary, marginTop: 24 }]}>
            Market Tips
          </AppText>
          <View style={styles.advisoryList}>
            <View style={[styles.advisoryCard, { backgroundColor: primaryContainer }]}>
              <View style={styles.advisoryTop}>
                <Ionicons name="bulb-outline" size={20} color={primaryColor} />
                <AppText style={[styles.advisoryTitle, { color: textPrimary }]}>
                  Onion Price Rise in Adama
                </AppText>
              </View>
              <AppText style={[styles.advisoryBody, { color: textSecondary }]}>
                Wholesale onion prices are up +5.8% (ETB 4,500 / quintal) in East Shewa. Post your harvest today to secure good prices.
              </AppText>
              <TouchableOpacity
                style={[styles.advisoryActionBtn, { backgroundColor: primaryColor }]}
                onPress={() => navigation?.navigate("PostProduct", { prefill: { cropType: "Red Onion", price: 4500, unit: "q" } })}
                activeOpacity={0.85}
              >
                <AppText style={styles.advisoryActionText}>Post Onion Listing →</AppText>
              </TouchableOpacity>
            </View>

            <View style={[styles.advisoryCard, { backgroundColor: "#FEF3C7" }]}>
              <View style={styles.advisoryTop}>
                <Ionicons name="location-outline" size={20} color="#D97706" />
                <AppText style={[styles.advisoryTitle, { color: "#78350F" }]}>
                  High Demand for Coffee in Harar
                </AppText>
              </View>
              <AppText style={[styles.advisoryBody, { color: "#92400E" }]}>
                185 buyers are searching for Coffee Beans in Harar. List your stock to get instant buyer orders.
              </AppText>
              <TouchableOpacity
                style={[styles.advisoryActionBtn, { backgroundColor: "#D97706" }]}
                onPress={() => navigation?.navigate("PostProduct", { prefill: { cropType: "Coffee Beans", price: 9600, unit: "q" } })}
                activeOpacity={0.85}
              >
                <AppText style={styles.advisoryActionText}>Post Coffee Listing →</AppText>
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
