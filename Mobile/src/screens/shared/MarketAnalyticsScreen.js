// src/screens/shared/MarketAnalyticsScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import PriceTrendWidget from "../../components/buyer/PriceTrendWidget";
import AppText from "../../components/common/AppText";
import DashboardLayout from "../../components/layout/DashBoardLayout";
import DemandForecastCard from "../../components/shared/analytics/DemandForecastCard";
import MarketAnalyticsHero from "../../components/shared/analytics/MarketAnalyticsHero";
import RegionalPriceComparison from "../../components/shared/analytics/RegionalPriceComparison";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

const COMMODITIES = [
  { id: "onion", crop: "Red Onion", price: "4,500", unit: "q", change: "+5.8%", isPositive: true, low7d: "3,700", high7d: "4,800", volume: "4,850 q", hubsCount: 12 },
  { id: "teff", crop: "White Teff", price: "5,200", unit: "q", change: "+3.2%", isPositive: true, low7d: "4,900", high7d: "5,350", volume: "8,200 q", hubsCount: 15 },
  { id: "tomato", crop: "Tomato", price: "3,800", unit: "q", change: "-2.4%", isPositive: false, low7d: "3,650", high7d: "4,200", volume: "3,400 q", hubsCount: 10 },
  { id: "garlic", crop: "Garlic", price: "12,000", unit: "q", change: "+8.5%", isPositive: true, low7d: "10,200", high7d: "12,400", volume: "1,820 q", hubsCount: 8 },
  { id: "wheat", crop: "Wheat", price: "4,100", unit: "q", change: "+1.5%", isPositive: true, low7d: "3,900", high7d: "4,250", volume: "6,100 q", hubsCount: 14 },
];

export default function MarketAnalyticsScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { user, role: authRole } = useAuthStore();
  const [selectedId, setSelectedId] = useState("onion");
  const [priceAlertActive, setPriceAlertActive] = useState(false);

  const activeRole = authRole || user?.role || "buyer";
  const isFarmer = activeRole === "farmer";

  const primaryColor = isFarmer ? "#15803D" : "#1565C0";
  const activeCommodity = COMMODITIES.find((c) => c.id === selectedId) || COMMODITIES[0];

  const handlePrimaryAction = () => {
    if (isFarmer) {
      navigation?.navigate("PostProduct", {
        prefill: {
          cropType: activeCommodity.crop,
          price: parseInt(activeCommodity.price.replace(/[^0-9]/g, ""), 10),
          unit: "quintal",
        },
      });
    } else {
      navigation?.navigate("BuyerTabs", { screen: "Marketplace" });
    }
  };

  return (
    <DashboardLayout
      role={activeRole}
      title="National Market Analytics"
      subtitle="Ethiopian Wholesale Commodity Indices & Hub Rates"
      showBack
      onBackPress={() => navigation?.goBack()}
      scrollable
      contentPaddingHorizontal={14}
      navigation={navigation}
    >
      {/* Commodity Selector Pills */}
      <View style={styles.pillContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {COMMODITIES.map((c) => {
            const active = c.id === selectedId;
            return (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.pill,
                  active ? { backgroundColor: primaryColor } : { backgroundColor: "#FFFFFF" },
                ]}
                onPress={() => setSelectedId(c.id)}
                activeOpacity={0.8}
              >
                <AppText style={[styles.pillText, active && { color: "#FFFFFF" }]}>
                  {c.crop}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 1. National Hero Index Card */}
      <MarketAnalyticsHero
        commodity={activeCommodity}
        primaryColor={primaryColor}
        isFarmer={isFarmer}
      />

      {/* Price Alert Action Bar */}
      <View style={styles.alertCard}>
        <View style={styles.alertLeft}>
          <Ionicons
            name={priceAlertActive ? "notifications" : "notifications-outline"}
            size={20}
            color={primaryColor}
          />
          <View style={{ flex: 1 }}>
            <AppText style={styles.alertTitle}>
              {priceAlertActive ? "Price Alert Active" : `Track ${activeCommodity.crop} Rates`}
            </AppText>
            <AppText style={styles.alertSub}>
              {priceAlertActive
                ? `Alerting when price drops below ETB ${activeCommodity.price}/q`
                : `Get notified when market prices drop`}
            </AppText>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.alertToggleBtn,
            priceAlertActive ? { backgroundColor: "#16A34A" } : { backgroundColor: primaryColor },
          ]}
          onPress={() => setPriceAlertActive(!priceAlertActive)}
          activeOpacity={0.85}
        >
          <AppText style={styles.alertToggleText}>
            {priceAlertActive ? "Active" : "+ Set Alert"}
          </AppText>
        </TouchableOpacity>
      </View>

      {/* 2. Market Intelligence Advisory Tip */}
      <DemandForecastCard role={activeRole} primaryColor={primaryColor} cropName={activeCommodity.crop} />

      {/* 3. 30-Day Historical Price Trajectory */}
      <PriceTrendWidget />

      {/* 4. Regional Wholesale Price Comparison Matrix */}
      <RegionalPriceComparison primaryColor={primaryColor} isFarmer={isFarmer} />

      {/* 5. Role Primary Action Button */}
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
            ? `List ${activeCommodity.crop} at Market Rate (ETB ${activeCommodity.price}/q)`
            : `Browse Verified ${activeCommodity.crop} Sellers`}
        </AppText>
      </TouchableOpacity>

      <View style={{ height: 60 }} />
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  pillContainer: {
    marginBottom: 14,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginRight: 8,
  },
  pillText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#475569",
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
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
  alertTitle: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#0F172A",
  },
  alertSub: {
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
    fontSize: 12,
    fontWeight: "800",
  },
  actionBtn: {
    height: 52,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  actionBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
