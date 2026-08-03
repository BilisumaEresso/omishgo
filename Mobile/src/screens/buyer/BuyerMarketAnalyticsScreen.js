// Mobile/src/screens/buyer/BuyerMarketAnalyticsScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import PriceTrendWidget from "../../components/buyer/PriceTrendWidget";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import DemandForecastCard from "../../components/shared/analytics/DemandForecastCard";
import MarketAnalyticsHero from "../../components/shared/analytics/MarketAnalyticsHero";
import RegionalPriceComparison from "../../components/shared/analytics/RegionalPriceComparison";
import { getLocalizedCropName } from "../../constants/crops";
import { cleanCityName, getLocalizedMarket } from "../../constants/markets";
import { getLocalizedUnitName } from "../../constants/units";
import { useTheme } from "../../hooks/useTheme";
import { formatNumber } from "../../utils/formatNumber";

const COMMODITIES = [
  {
    id: "onion",
    crop: "Red Onion",
    variety: "Bombay Red",
    price: "4,500",
    rawPrice: 4500,
    unit: "q",
    change: "+5.8%",
    isPositive: true,
    low7d: "3,700",
    high7d: "4,800",
    volume: "4,850 q",
    hubsCount: 12,
    hubs: [
      { city: "Meki", marketId: "meki_produce", region: "Oromia", price: "4,100", rawPrice: 4100, unit: "q", supply: "high", distance: "90 km" },
      { city: "Adama", marketId: "adama_grain", region: "Oromia", price: "4,250", rawPrice: 4250, unit: "q", supply: "high", distance: "95 km" },
      { city: "Bishoftu", marketId: "bishoftu_market", region: "Oromia", price: "4,400", rawPrice: 4400, unit: "q", supply: "normal", distance: "45 km" },
      { city: "Shashemene", marketId: "shashemene_hub", region: "Oromia", price: "4,350", rawPrice: 4350, unit: "q", supply: "high", distance: "240 km" },
      { city: "Addis Ababa", marketId: "addis_merkato", region: "Capital", price: "4,600", rawPrice: 4600, unit: "q", supply: "normal", distance: "Capital Center" },
    ],
  },
  {
    id: "teff",
    crop: "Teff",
    variety: "Quncho",
    price: "5,200",
    rawPrice: 5200,
    unit: "q",
    change: "+3.2%",
    isPositive: true,
    low7d: "4,900",
    high7d: "5,350",
    volume: "8,200 q",
    hubsCount: 15,
    hubs: [
      { city: "Bishoftu", marketId: "bishoftu_market", region: "Oromia", price: "4,950", rawPrice: 4950, unit: "q", supply: "high", distance: "45 km" },
      { city: "Asella", marketId: "asella_terminal", region: "Oromia", price: "5,050", rawPrice: 5050, unit: "q", supply: "normal", distance: "175 km" },
      { city: "Adama", marketId: "adama_grain", region: "Oromia", price: "5,100", rawPrice: 5100, unit: "q", supply: "high", distance: "95 km" },
      { city: "Addis Ababa", marketId: "addis_merkato", region: "Capital", price: "5,300", rawPrice: 5300, unit: "q", supply: "normal", distance: "Capital Center" },
    ],
  },
  {
    id: "tomato",
    crop: "Tomato",
    variety: "Gelila",
    price: "3,800",
    rawPrice: 3800,
    unit: "q",
    change: "-2.4%",
    isPositive: false,
    low7d: "3,500",
    high7d: "4,200",
    volume: "3,400 q",
    hubsCount: 10,
    hubs: [
      { city: "Meki", marketId: "meki_produce", region: "Oromia", price: "3,500", rawPrice: 3500, unit: "q", supply: "high", distance: "90 km" },
      { city: "Ziway", marketId: "ziway_hub", region: "Oromia", price: "3,650", rawPrice: 3650, unit: "q", supply: "high", distance: "160 km" },
      { city: "Adama", marketId: "adama_grain", region: "Oromia", price: "3,750", rawPrice: 3750, unit: "q", supply: "normal", distance: "95 km" },
      { city: "Addis Ababa", marketId: "addis_merkato", region: "Capital", price: "3,950", rawPrice: 3950, unit: "q", supply: "normal", distance: "Capital Center" },
    ],
  },
  {
    id: "garlic",
    crop: "Garlic",
    variety: "Bishoftu Netch",
    price: "12,000",
    rawPrice: 12000,
    unit: "q",
    change: "+8.5%",
    isPositive: true,
    low7d: "10,200",
    high7d: "12,400",
    volume: "1,820 q",
    hubsCount: 8,
    hubs: [
      { city: "Bishoftu", marketId: "bishoftu_market", region: "Oromia", price: "11,400", rawPrice: 11400, unit: "q", supply: "high", distance: "45 km" },
      { city: "Adama", marketId: "adama_grain", region: "Oromia", price: "11,800", rawPrice: 11800, unit: "q", supply: "normal", distance: "95 km" },
      { city: "Addis Ababa", marketId: "addis_merkato", region: "Capital", price: "12,200", rawPrice: 12200, unit: "q", supply: "scarcity", distance: "Capital Center" },
    ],
  },
  {
    id: "wheat",
    crop: "Wheat",
    variety: "Kakaba",
    price: "4,100",
    rawPrice: 4100,
    unit: "q",
    change: "0.0%",
    isPositive: true,
    low7d: "3,900",
    high7d: "4,300",
    volume: "6,100 q",
    hubsCount: 14,
    hubs: [
      { city: "Asella", marketId: "asella_terminal", region: "Oromia", price: "3,900", rawPrice: 3900, unit: "q", supply: "high", distance: "175 km" },
      { city: "Adama", marketId: "adama_grain", region: "Oromia", price: "4,050", rawPrice: 4050, unit: "q", supply: "high", distance: "95 km" },
      { city: "Addis Ababa", marketId: "addis_merkato", region: "Capital", price: "4,200", rawPrice: 4200, unit: "q", supply: "normal", distance: "Capital Center" },
    ],
  },
  {
    id: "coffee",
    crop: "Coffee",
    variety: "Yirgacheffe",
    price: "9,600",
    rawPrice: 9600,
    unit: "q",
    change: "+4.1%",
    isPositive: true,
    low7d: "9,100",
    high7d: "10,200",
    volume: "2,450 q",
    hubsCount: 9,
    hubs: [
      { city: "Jimma", marketId: "jimma_coffee", region: "Oromia", price: "9,100", rawPrice: 9100, unit: "q", supply: "high", distance: "350 km" },
      { city: "Dilla", marketId: "dilla_hub", region: "SNNPR", price: "9,300", rawPrice: 9300, unit: "q", supply: "high", distance: "360 km" },
      { city: "Addis Ababa", marketId: "addis_merkato", region: "Capital", price: "9,750", rawPrice: 9750, unit: "q", supply: "normal", distance: "Capital Center" },
    ],
  },
];

export default function BuyerMarketAnalyticsScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const { theme } = useTheme();
  const [selectedId, setSelectedId] = useState("onion");
  const [priceAlertActive, setPriceAlertActive] = useState(false);

  const primaryColor = theme?.colors?.primary || "#1565C0";
  const primaryDark = theme?.colors?.primaryDark || "#0D47A1";
  const backgroundColor = theme?.colors?.background || "#F8FAFC";
  const surfaceColor = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";
  const border = theme?.colors?.border || "#E2E8F0";

  const activeCommodity = COMMODITIES.find((c) => c.id === selectedId) || COMMODITIES[0];
  const lowestHub = activeCommodity.hubs
    ? activeCommodity.hubs.reduce((min, h) => (h.rawPrice < min.rawPrice ? h : min), activeCommodity.hubs[0])
    : null;

  const handleBrowseSellers = () => {
    navigation?.navigate("BuyerTabs", {
      screen: "Marketplace",
      params: { crop: activeCommodity.crop },
    });
  };

  const handlePostRequest = () => {
    navigation?.navigate("BuyerTabs", { screen: "BuyerDashboard" });
  };

  const handleToggleAlert = () => {
    const nextState = !priceAlertActive;
    setPriceAlertActive(nextState);
    const cropName = getLocalizedCropName(activeCommodity.crop, currentLang, t);

    Alert.alert(
      nextState
        ? t("analytics.alertActive", { defaultValue: "Price Alert Activated! 🔔" })
        : t("analytics.alertDisabledTitle", { defaultValue: "Alert Disabled" }),
      nextState
        ? t("analytics.alertActiveMsg", {
            crop: cropName,
            price: activeCommodity.price,
            defaultValue: `You will be notified when ${cropName} prices drop below ETB ${activeCommodity.price}/q.`,
          })
        : t("analytics.alertDisabledMsg", {
            crop: cropName,
            defaultValue: `Price tracking alert for ${cropName} has been turned off.`,
          }),
    );
  };

  // Buyer KPI metrics
  const buyerKpiMetrics = [
    {
      label: t("analytics.kpiVolume", { defaultValue: "Procured Volume" }),
      value: "450 q",
      icon: "cube-outline",
      accent: "#2563EB",
      bg: "#EFF6FF",
    },
    {
      label: t("analytics.kpiSavings", { defaultValue: "Direct Savings" }),
      value: "ETB 38.5k",
      icon: "wallet-outline",
      accent: "#15803D",
      bg: "#DCFCE7",
    },
    {
      label: t("analytics.kpiRfqs", { defaultValue: "Active RFQs" }),
      value: "3 Open",
      icon: "document-text-outline",
      accent: "#D97706",
      bg: "#FEF3C7",
    },
    {
      label: t("analytics.kpiTracked", { defaultValue: "Tracked Crops" }),
      value: `${COMMODITIES.length} Items`,
      icon: "stats-chart-outline",
      accent: "#7C3AED",
      bg: "#F3E8FF",
    },
  ];

  return (
    <View style={[styles.screen, { backgroundColor }]}>
      {/* Sub-Screen Header: Back button enabled, NO Hamburger menu */}
      <AppHeader
        title={t("analytics.title", { defaultValue: "Market Prices & Trends" })}
        subtitle={t("analytics.subtitle", { defaultValue: "Wholesale market rates per quintal (100 kg)" })}
        showBack={true}
        onBackPress={() => navigation?.goBack()}
        showMenu={false}
        showNotification={true}
        onNotificationPress={() => navigation?.navigate("Notifications")}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Crop Selector Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.pillScroll}
          contentContainerStyle={styles.pillContent}
        >
          {COMMODITIES.map((c) => {
            const active = c.id === selectedId;
            return (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.pill,
                  active && { backgroundColor: primaryColor, borderColor: primaryColor },
                ]}
                onPress={() => setSelectedId(c.id)}
                activeOpacity={0.8}
              >
                <AppText style={[styles.pillText, active && styles.activePillText]}>
                  {getLocalizedCropName(c.crop, currentLang, t)}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 1. Hero Wholesale Price Card */}
        <MarketAnalyticsHero
          commodity={activeCommodity}
          primaryColor={primaryColor}
          primaryDark={primaryDark}
          isFarmer={false}
        />

        {/* 2. Buyer Procurement KPI Bar */}
        <View style={styles.kpiGrid}>
          {buyerKpiMetrics.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.kpiCard,
                { backgroundColor: item.bg, borderColor: item.accent + "25" },
              ]}
            >
              <Ionicons name={item.icon} size={18} color={item.accent} style={{ marginBottom: 4 }} />
              <AppText style={[styles.kpiVal, { color: item.accent }]}>{item.value}</AppText>
              <AppText style={[styles.kpiLabel, { color: textSecondary }]}>{item.label}</AppText>
            </View>
          ))}
        </View>

        {/* 3. Price Drop Alert Action Strip */}
        <View style={[styles.alertCard, { backgroundColor: surfaceColor, borderColor: border }]}>
          <View style={styles.alertLeft}>
            <Ionicons
              name={priceAlertActive ? "notifications" : "notifications-outline"}
              size={20}
              color={primaryColor}
            />
            <View style={styles.alertTextWrap}>
              <AppText style={[styles.alertTitle, { color: textPrimary }]}>
                {priceAlertActive
                  ? t("analytics.alertEnabled", { defaultValue: "Price Alert Enabled" })
                  : t("analytics.trackCropRates", {
                      crop: getLocalizedCropName(activeCommodity.crop, currentLang, t),
                      defaultValue: `Track ${getLocalizedCropName(activeCommodity.crop, currentLang, t)} Prices`,
                    })}
              </AppText>
              <AppText style={styles.alertSubtitle}>
                {priceAlertActive
                  ? t("analytics.alertingDesc", {
                      price: activeCommodity.price,
                      defaultValue: `Alerting when price drops below ETB ${activeCommodity.price}/q`,
                    })
                  : t("analytics.getNotifiedDrop", { defaultValue: "Get notified when wholesale market prices drop" })}
              </AppText>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.alertToggleBtn,
              priceAlertActive ? { backgroundColor: "#10B981" } : { backgroundColor: primaryColor },
            ]}
            onPress={handleToggleAlert}
            activeOpacity={0.85}
          >
            <AppText style={styles.alertToggleText}>
              {priceAlertActive
                ? t("analytics.activeTag", { defaultValue: "Active" })
                : t("analytics.setAlertBtn", { defaultValue: "+ Set Alert" })}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* 4. Sourcing Advisory Tip */}
        <DemandForecastCard role="buyer" primaryColor={primaryColor} />

        {/* 5. Price Trend Chart Widget */}
        <PriceTrendWidget />

        {/* 6. Regional Price Comparison Table (with clean city names from markets.js) */}
        <RegionalPriceComparison
          hubs={activeCommodity.hubs}
          primaryColor={primaryColor}
          isFarmer={false}
        />

        {/* 7. Primary Buyer Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={[styles.primaryCta, { backgroundColor: primaryColor, flex: 1 }]}
            onPress={handleBrowseSellers}
            activeOpacity={0.88}
          >
            <Ionicons name="cart-outline" size={18} color="#FFFFFF" />
            <AppText style={styles.primaryCtaText}>
              {t("analytics.browseSellers", {
                crop: getLocalizedCropName(activeCommodity.crop, currentLang, t),
                defaultValue: `Browse ${getLocalizedCropName(activeCommodity.crop, currentLang, t)} Sellers`,
              })}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryCta, { borderColor: primaryColor }]}
            onPress={handlePostRequest}
            activeOpacity={0.85}
          >
            <Ionicons name="add-circle-outline" size={18} color={primaryColor} />
            <AppText style={[styles.secondaryCtaText, { color: primaryColor }]}>
              {t("buyerDashboard.requestProduce", { defaultValue: "Post Bulk Request" })}
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 30,
  },
  pillScroll: {
    marginBottom: 14,
  },
  pillContent: {
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  activePillText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
    marginBottom: 16,
  },
  kpiCard: {
    width: "48%",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
  },
  kpiVal: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 2,
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 16,
  },
  alertLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  alertTextWrap: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 13.5,
    fontWeight: "700",
  },
  alertSubtitle: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 2,
  },
  alertToggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  alertToggleText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "700",
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  primaryCta: {
    height: 48,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  primaryCtaText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  secondaryCta: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    gap: 6,
  },
  secondaryCtaText: {
    fontSize: 13.5,
    fontWeight: "700",
  },
});
