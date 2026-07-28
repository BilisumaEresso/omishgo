import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "../common/AppText";
import { useTheme } from "../../hooks/useTheme";

const COMMODITY_TRENDS = [
  {
    id: "onion",
    crop: "Red Onion",
    price: 4500,
    unit: "q",
    change: "+5.8%",
    isPositive: true,
    market: "Adama Market Hub",
    insight: "Onion prices are up +5.8% this week due to high demand in central regional markets.",
    data: [
      { label: "Mon", value: 3800 },
      { label: "Tue", value: 4100 },
      { label: "Wed", value: 4000 },
      { label: "Thu", value: 4300 },
      { label: "Today", value: 4500 },
    ],
  },
  {
    id: "teff",
    crop: "White Teff",
    price: 5200,
    unit: "q",
    change: "+3.2%",
    isPositive: true,
    market: "Debre Zeit Grain Hub",
    insight: "Teff prices remain steady with good grain supply from East Shewa.",
    data: [
      { label: "Mon", value: 4900 },
      { label: "Tue", value: 5000 },
      { label: "Wed", value: 5100 },
      { label: "Thu", value: 5150 },
      { label: "Today", value: 5200 },
    ],
  },
  {
    id: "tomato",
    crop: "Fresh Tomato",
    price: 3800,
    unit: "q",
    change: "-2.4%",
    isPositive: false,
    market: "Ziway Terminal",
    insight: "Recent harvest arrivals in Ziway have slightly lowered tomato prices.",
    data: [
      { label: "Mon", value: 4200 },
      { label: "Tue", value: 4000 },
      { label: "Wed", value: 3900 },
      { label: "Thu", value: 3850 },
      { label: "Today", value: 3800 },
    ],
  },
  {
    id: "garlic",
    crop: "Garlic",
    price: 12000,
    unit: "q",
    change: "+8.5%",
    isPositive: true,
    market: "Bishoftu Market",
    insight: "Strong demand from food processors is driving garlic prices higher.",
    data: [
      { label: "Mon", value: 10500 },
      { label: "Tue", value: 11000 },
      { label: "Wed", value: 11400 },
      { label: "Thu", value: 11800 },
      { label: "Today", value: 12000 },
    ],
  },
];

export default function PriceTrendWidget({ onPressAnalytics }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [selectedCropId, setSelectedCropId] = useState("onion");

  const activeCommodity = useMemo(
    () => COMMODITY_TRENDS.find((c) => c.id === selectedCropId) || COMMODITY_TRENDS[0],
    [selectedCropId]
  );

  const primaryColor = theme?.colors?.primary || "#1565C0";
  const surfaceColor = theme?.colors?.surface || "#FFFFFF";
  const textColor = theme?.colors?.textPrimary || "#0F172A";
  const textMuted = theme?.colors?.textSecondary || "#64748B";
  const successColor = "#10B981";
  const dangerColor = "#EF4444";

  const priceAnim = useRef(new Animated.Value(0)).current;
  const [displayPrice, setDisplayPrice] = useState("0");

  const maxValue = useMemo(() => {
    const max = Math.max(...activeCommodity.data.map((d) => d.value));
    return max > 0 ? max : 1;
  }, [activeCommodity]);

  useEffect(() => {
    priceAnim.setValue(activeCommodity.price * 0.75);
    Animated.timing(priceAnim, {
      toValue: activeCommodity.price,
      duration: 500,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start();

    const listener = priceAnim.addListener(({ value }) => {
      setDisplayPrice(Math.round(value).toLocaleString());
    });

    return () => {
      priceAnim.removeListener(listener);
    };
  }, [selectedCropId, activeCommodity, priceAnim]);

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.card, { backgroundColor: surfaceColor }]}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <AppText style={[styles.title, { color: textColor }]}>
              {t("buyerDashboard.priceTrends", { defaultValue: "Price Trends" })}
            </AppText>
            <AppText style={[styles.subtitle, { color: textMuted }]}>{activeCommodity.market}</AppText>
          </View>

          <View
            style={[
              styles.changeBadge,
              {
                backgroundColor: activeCommodity.isPositive
                  ? "rgba(16, 185, 129, 0.1)"
                  : "rgba(239, 68, 68, 0.1)",
              },
            ]}
          >
            <Ionicons
              name={activeCommodity.isPositive ? "trending-up" : "trending-down"}
              size={14}
              color={activeCommodity.isPositive ? successColor : dangerColor}
            />
            <AppText
              style={[
                styles.changeText,
                { color: activeCommodity.isPositive ? successColor : dangerColor },
              ]}
            >
              {activeCommodity.change} (7d)
            </AppText>
          </View>
        </View>

        {/* Commodity Selector Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cropScroll}
          contentContainerStyle={styles.cropContent}
        >
          {COMMODITY_TRENDS.map((item) => {
            const isSelected = item.id === selectedCropId;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.cropPill,
                  isSelected && { backgroundColor: primaryColor, borderColor: primaryColor },
                ]}
                onPress={() => setSelectedCropId(item.id)}
                activeOpacity={0.8}
              >
                <AppText
                  style={[
                    styles.cropPillText,
                    isSelected && styles.selectedCropPillText,
                  ]}
                >
                  {getLocalizedCropName(item.crop, i18n.language || "en", t)}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Price Display */}
        <View style={styles.priceRow}>
          <AppText style={styles.priceNumber}>ETB {displayPrice}</AppText>
          <AppText style={styles.unitText}>/ {t("common.unitQuintal", { defaultValue: "quintal (100 kg)" })}</AppText>
        </View>

        {/* Simple Bar Chart */}
        <View style={styles.chartContainer}>
          {activeCommodity.data.map((point) => {
            const heightPercent = Math.min(100, Math.max(20, (point.value / maxValue) * 100));
            const isToday = point.label === "Today";

            return (
              <View key={point.label} style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${heightPercent}%`,
                        backgroundColor: isToday ? primaryColor : primaryColor + "40",
                      },
                    ]}
                  />
                </View>
                <AppText
                  style={[
                    styles.axisLabel,
                    isToday && { color: primaryColor, fontWeight: "700" },
                  ]}
                >
                  {point.label === "Today" ? t("priceTrends.today", { defaultValue: "Today" }) : point.label}
                </AppText>
              </View>
            );
          })}
        </View>

        {/* Simple Insight & Analytics Footer */}
        <View style={styles.footer}>
          <AppText style={styles.insightText} numberOfLines={2}>
            💡 {activeCommodity.insight}
          </AppText>

          {onPressAnalytics && (
            <TouchableOpacity
              style={styles.analyticsBtn}
              onPress={onPressAnalytics}
              activeOpacity={0.8}
            >
              <AppText style={[styles.analyticsBtnText, { color: primaryColor }]}>
                {t("buyerDashboard.viewFullAnalysis", { defaultValue: "View Full Market Analysis" })}
              </AppText>
              <Ionicons name="arrow-forward" size={14} color={primaryColor} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
    marginBottom: 20,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  cropScroll: {
    marginBottom: 14,
  },
  cropContent: {
    gap: 8,
  },
  cropPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cropPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  selectedCropPillText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 14,
  },
  priceNumber: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  unitText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
    marginLeft: 4,
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 90,
    marginBottom: 14,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
  barTrack: {
    width: 20,
    height: 70,
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 10,
  },
  axisLabel: {
    marginTop: 6,
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 12,
    gap: 10,
  },
  insightText: {
    fontSize: 12,
    color: "#334155",
    lineHeight: 17,
  },
  analyticsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 2,
  },
  analyticsBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
