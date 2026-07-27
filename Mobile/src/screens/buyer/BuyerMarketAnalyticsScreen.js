import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import DemandForecastCard from "../../components/shared/analytics/DemandForecastCard";
import MarketAnalyticsHero from "../../components/shared/analytics/MarketAnalyticsHero";
import RegionalPriceComparison from "../../components/shared/analytics/RegionalPriceComparison";
import PriceTrendWidget from "../../components/buyer/PriceTrendWidget";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import { useTheme } from "../../hooks/useTheme";
import { getLocalizedCropName } from "../../constants/crops";

const COMMODITIES = [
  { id: "onion", crop: "Red Onion", price: "4,500", unit: "q", change: "+5.8%", isPositive: true, low7d: "3,700", high7d: "4,800", volume: "485 q" },
  { id: "teff", crop: "White Teff", price: "5,200", unit: "q", change: "+3.2%", isPositive: true, low7d: "4,900", high7d: "5,350", volume: "820 q" },
  { id: "tomato", crop: "Tomato", price: "3,800", unit: "q", change: "-2.4%", isPositive: false, low7d: "3,650", high7d: "4,200", volume: "340 q" },
  { id: "garlic", crop: "Garlic", price: "12,000", unit: "q", change: "+8.5%", isPositive: true, low7d: "10,200", high7d: "12,400", volume: "182 q" },
];

export default function BuyerMarketAnalyticsScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [selectedId, setSelectedId] = useState("onion");
  const [priceAlertActive, setPriceAlertActive] = useState(false);

  const primaryColor = theme?.colors?.primary || "#1565C0";
  const primaryDark = theme?.colors?.primaryDark || "#0D47A1";
  const backgroundColor = theme?.colors?.background || "#F8FAFC";
  const surfaceColor = theme?.colors?.surface || "#FFFFFF";

  const activeCommodity = COMMODITIES.find((c) => c.id === selectedId) || COMMODITIES[0];

  const handleBrowseSellers = () => {
    navigation?.navigate("BuyerTabs", { screen: "Marketplace" });
  };

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
                  {getLocalizedCropName(c.crop, i18n.language || "en", t)}
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
        />

        {/* Price Alert Action Strip */}
        <View style={[styles.alertCard, { backgroundColor: surfaceColor }]}>
          <View style={styles.alertLeft}>
            <Ionicons
              name={priceAlertActive ? "notifications" : "notifications-outline"}
              size={20}
              color={primaryColor}
            />
            <View style={styles.alertTextWrap}>
              <AppText style={styles.alertTitle}>
                {priceAlertActive ? t("analytics.alertEnabled", { defaultValue: "Price Alert Enabled" }) : t("analytics.trackCropRates", { crop: activeCommodity.crop, defaultValue: `Track ${activeCommodity.crop} Prices` })}
              </AppText>
              <AppText style={styles.alertSubtitle}>
                {priceAlertActive
                  ? t("analytics.alertingDesc", { price: activeCommodity.price, defaultValue: `Alerting when price drops below ETB ${activeCommodity.price}/q` })
                  : t("analytics.getNotifiedDrop", { defaultValue: "Get notified when market prices drop" })}
              </AppText>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.alertToggleBtn,
              priceAlertActive ? { backgroundColor: "#10B981" } : { backgroundColor: primaryColor },
            ]}
            onPress={() => setPriceAlertActive(!priceAlertActive)}
            activeOpacity={0.85}
          >
            <AppText style={styles.alertToggleText}>
              {priceAlertActive ? t("analytics.activeTag", { defaultValue: "Active" }) : t("analytics.setAlertBtn", { defaultValue: "+ Set Alert" })}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* 2. Sourcing Advisory Tip */}
        <DemandForecastCard role="buyer" primaryColor={primaryColor} />

        {/* 3. Price Trend Chart Widget */}
        <PriceTrendWidget />

        {/* 4. Regional Price Comparison Table */}
        <RegionalPriceComparison primaryColor={primaryColor} />

        {/* Primary Buyer Action CTA */}
        <TouchableOpacity
          style={[styles.primaryCta, { backgroundColor: primaryColor }]}
          onPress={handleBrowseSellers}
          activeOpacity={0.88}
        >
          <Ionicons name="cart-outline" size={20} color="#FFFFFF" />
          <AppText style={styles.primaryCtaText}>
            {t("analytics.browseSellers", { crop: activeCommodity.crop, defaultValue: `Browse ${activeCommodity.crop} Sellers` })}
          </AppText>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
    marginBottom: 16,
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
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  alertSubtitle: {
    fontSize: 12,
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
    fontSize: 13,
    fontWeight: "700",
  },
  primaryCta: {
    height: 52,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  primaryCtaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
