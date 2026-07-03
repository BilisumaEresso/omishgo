// Mobile/src/screens/farmer/FarmerAnalyticsScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "../../components/common/AppText";
import { useTheme } from "../../hooks/useTheme";

const FarmerAnalyticsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const primary = theme.colors.primary || "#2E7D32";
  const primaryContainer = theme.colors.primaryContainer || "#E8F5E9";
  const textPrimary = theme.colors.textPrimary || "#1A2E1A";
  const textSecondary = theme.colors.textSecondary || "#4A6741";
  const textMuted = theme.colors.textMuted || "#8FAF8A";
  const background = theme.colors.background || "#F9FBF9";
  const surface = theme.colors.surface || "#FFFFFF";
  const border = theme.colors.border || "#D0E8CE";
  const successColor = theme.colors.success || "#2E7D32";
  const errorColor = theme.colors.error || "#C62828";
  const warningColor = theme.colors.warning || "#F57F17";

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

  // Market Prices Today (price in ETB/q, trend arrow)
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
      {/* Inline Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: surface,
            borderBottomColor: border,
            paddingTop:
              Platform.OS === "android"
                ? (StatusBar.currentHeight || 24) + 12
                : 54,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={primary} />
        </TouchableOpacity>
        <AppText style={[styles.headerTitle, { color: textPrimary }]}>
          Insights
        </AppText>
        <View style={styles.backButton} /> {/* spacer */}
      </View>

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

        {/* Top Crops by Demand Section */}
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
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      backgroundColor: primary,
                      width: `${crop.percent}%`, // using percentage string for flexibility
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

        {/* Market Prices Today Section */}
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
        <AppText style={styles.footerNote}>
          Prices sourced from local market data
        </AppText>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  scrollContent: {
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
    backgroundColor: "#E0E0E0",
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
    color: "#A0A0A0",
    textAlign: "center",
    marginTop: 8,
  },
});

export default FarmerAnalyticsScreen;
