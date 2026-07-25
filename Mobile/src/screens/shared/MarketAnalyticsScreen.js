// src/screens/shared/MarketAnalyticsScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
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
import { useSidebar } from "../../context/SidebarContext";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

const COMMODITIES = [
  { id: "onion", crop: "Red Onion", price: "4,500", unit: "q", change: "+5.8%", isPositive: true, low7d: "3,700", high7d: "4,800", volume: "4,850 q" },
  { id: "teff", crop: "White Teff", price: "5,200", unit: "q", change: "+3.2%", isPositive: true, low7d: "4,900", high7d: "5,350", volume: "8,200 q" },
  { id: "tomato", crop: "Tomato", price: "3,800", unit: "q", change: "-2.4%", isPositive: false, low7d: "3,650", high7d: "4,200", volume: "3,400 q" },
  { id: "garlic", crop: "Garlic", price: "12,000", unit: "q", change: "+8.5%", isPositive: true, low7d: "10,200", high7d: "12,400", volume: "1,820 q" },
];

export default function MarketAnalyticsScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { user, role: authRole } = useAuthStore();
  const { openSidebar } = useSidebar();
  const [selectedId, setSelectedId] = useState("onion");

  const activeRole = authRole || user?.role || "buyer";
  const isFarmer = activeRole === "farmer";

  const primaryColor = theme?.colors?.primary || (isFarmer ? "#2E7D32" : "#1565C0");
  const primaryDark = theme?.colors?.primaryDark || (isFarmer ? "#1B5E20" : "#0D47A1");
  const backgroundColor = theme?.colors?.background || "#F8FAFC";
  const textColor = theme?.colors?.textPrimary || "#0F172A";

  const activeCommodity = COMMODITIES.find((c) => c.id === selectedId) || COMMODITIES[0];

  const handlePrimaryAction = () => {
    if (isFarmer) {
      navigation?.navigate("PostProduct", {
        prefill: {
          cropType: activeCommodity.crop,
          price: parseInt(activeCommodity.price.replace(/[^0-9]/g, ""), 10),
          unit: "kg",
        },
      });
    } else {
      navigation?.navigate("BuyerTabs", { screen: "Marketplace" });
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor }]}>
      <AppHeader
        title="Market Analytics"
        subtitle="National Wholesale Indices & Rates"
        showBack={true}
        onBackPress={() => navigation?.goBack()}
        showMenu={true}
        onMenuPress={openSidebar}
        showNotification={true}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Commodity Switcher Pills */}
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
                  {c.crop}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 1. Hero Commodity Card */}
        <MarketAnalyticsHero
          commodity={activeCommodity}
          primaryColor={primaryColor}
          primaryDark={primaryDark}
        />

        {/* 2. Intelligence Advisory Card */}
        <DemandForecastCard role={activeRole} primaryColor={primaryColor} />

        {/* 3. Price Trend Chart Widget */}
        <PriceTrendWidget />

        {/* 4. Regional Price Comparison */}
        <RegionalPriceComparison primaryColor={primaryColor} />

        {/* Role Action CTA Button */}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: primaryColor }]}
          onPress={handlePrimaryAction}
          activeOpacity={0.88}
        >
          <Ionicons
            name={isFarmer ? "add-circle" : "cart"}
            size={20}
            color="#FFFFFF"
            style={{ marginRight: 8 }}
          />
          <AppText style={styles.actionBtnText}>
            {isFarmer
              ? `List ${activeCommodity.crop} at ETB ${activeCommodity.price}/q`
              : `Browse ${activeCommodity.crop} Sellers`}
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
  actionBtn: {
    height: 52,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    marginBottom: 20,
  },
  actionBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
