// Mobile/src/screens/farmer/FarmerAnalyticsScreen.js
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import AppSidebar from "../../components/layout/AppSidebar";
import { useTheme } from "../../hooks/useTheme";

const FarmerAnalyticsScreen = ({ navigation, onSwitchTab }) => {
  const { theme } = useTheme();
  const [sidebarVisible, setSidebarVisible] = useState(false);

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
    { label: "Revenue", value: "ETB 24,500" },
    { label: "Sales", value: "18 kg" },
    { label: "Buyers", value: "7" },
  ];

  // Top Crops by Demand (percentage)
  const topCrops = [
    { name: "Teff", percent: 87 },
    { name: "Onion", percent: 74 },
    { name: "Tomato", percent: 68 },
    { name: "Wheat", percent: 55 },
    { name: "Pepper", percent: 41 },
  ];

  // Market Prices Today
  const marketPrices = [
    { name: "Teff", price: "5,200", trend: "up" },
    { name: "Onion", price: "4,500", trend: "up" },
    { name: "Tomato", price: "3,800", trend: "down" },
    { name: "Wheat", price: "4,100", trend: "neutral" },
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
        title="Market Insights"
        showMenu={true}
        showNotification={true}
        notificationCount={0}
        onMenuPress={() => setSidebarVisible(true)}
        onNotificationPress={() => navigation.navigate("Notifications")}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* This Week Section */}
        <AppText style={[styles.sectionTitle, { color: textPrimary }]}>
          This Week
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
          Top Crops by Demand
        </AppText>
        <View style={styles.cropsContainer}>
          {topCrops.map((crop, index) => (
            <View key={index} style={styles.cropRow}>
              <AppText style={[styles.cropName, { color: textPrimary }]}>
                {crop.name}
              </AppText>
              <View style={[styles.barContainer, { backgroundColor: border }]}>
                <View
                  style={[
                    styles.bar,
                    {
                      backgroundColor: primary,
                      width: `${crop.percent}%`,
                    },
                  ]}
                />
              </View>
              <AppText style={[styles.percentText, { color: textPrimary }]}>
                {crop.percent}%
              </AppText>
            </View>
          ))}
        </View>

        {/* Market Prices Today */}
        <AppText
          style={[styles.sectionTitle, { color: textPrimary, marginTop: 24 }]}
        >
          Market Prices Today
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
                <AppText style={[styles.priceCropName, { color: textPrimary }]}>
                  {item.name}
                </AppText>
                <View style={styles.priceRight}>
                  <AppText style={[styles.priceValue, { color: textPrimary }]}>
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
          Prices sourced from local market data
        </AppText>
      </ScrollView>

      <AppSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onItemPress={(item) => {
          setSidebarVisible(false);
          if (item.route === "Conversations")
            navigation.navigate("Conversations");
          else if (item.route === "Chat") navigation.navigate("Chat");
          else if (item.route === "PostProduct")
            navigation.navigate("PostProduct");
          else if (item.route === "Home") onSwitchTab?.("Home");
          else if (onSwitchTab) {
            const TAB_MAP = {
              FarmerProducts: "Products",
              FarmerOrders: "Orders",
              FarmerAnalytics: "Insights",
              Profile: "Profile",
              BuyerMarketplace: "Marketplace",
              BuyerOrders: "Orders",
              BuyerSaved: "Saved",
            };
            if (TAB_MAP[item.route]) onSwitchTab(TAB_MAP[item.route]);
          }
        }}
      />
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
    justifyContent: "space-between",
    marginBottom: 4,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    marginHorizontal: 4,
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
