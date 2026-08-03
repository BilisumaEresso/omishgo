// Mobile/src/components/buyer/PriceTrendWidget.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { getLocalizedCropName } from "../../constants/crops";
import { cleanCityName, getLocalizedMarket } from "../../constants/markets";
import { getLocalizedUnitName } from "../../constants/units";
import { useTheme } from "../../hooks/useTheme";
import { DAYS_SHORT } from "../../utils/ethiopianDate";
import { formatNumber } from "../../utils/formatNumber";
import AppText from "../common/AppText";

const COMMODITY_TRENDS = [
  {
    id: "onion",
    crop: "Red Onion",
    variety: "Bombay Red",
    price: 4500,
    unit: "q",
    change: "+5.8%",
    isPositive: true,
    recommendation: "rising", // 'buy_now' | 'rising' | 'stable'
    marketId: "adama_grain",
    city: "Adama",
    insight: "Wholesale onion prices are up +5.8% in Adama due to high demand in central markets.",
    low7d: 3800,
    high7d: 4600,
    data: [
      { dayIdx: 1, value: 3800 },
      { dayIdx: 2, value: 4100 },
      { dayIdx: 3, value: 4000 },
      { dayIdx: 4, value: 4300 },
      { dayIdx: 5, value: 4500, isToday: true },
    ],
  },
  {
    id: "teff",
    crop: "Teff",
    variety: "Quncho",
    price: 5200,
    unit: "q",
    change: "+3.2%",
    isPositive: true,
    recommendation: "stable",
    marketId: "bishoftu_market",
    city: "Bishoftu",
    insight: "Teff prices remain steady with good grain supply from East Shewa depots.",
    low7d: 4900,
    high7d: 5350,
    data: [
      { dayIdx: 1, value: 4900 },
      { dayIdx: 2, value: 5000 },
      { dayIdx: 3, value: 5100 },
      { dayIdx: 4, value: 5150 },
      { dayIdx: 5, value: 5200, isToday: true },
    ],
  },
  {
    id: "tomato",
    crop: "Tomato",
    variety: "Gelila",
    price: 3800,
    unit: "q",
    change: "-2.4%",
    isPositive: false,
    recommendation: "buy_now",
    marketId: "meki_produce",
    city: "Meki",
    insight: "Fresh harvest arrivals in Meki have lowered tomato rates. Great time for bulk buying!",
    low7d: 3500,
    high7d: 4200,
    data: [
      { dayIdx: 1, value: 4200 },
      { dayIdx: 2, value: 4000 },
      { dayIdx: 3, value: 3900 },
      { dayIdx: 4, value: 3850 },
      { dayIdx: 5, value: 3800, isToday: true },
    ],
  },
  {
    id: "garlic",
    crop: "Garlic",
    variety: null,
    price: 12000,
    unit: "q",
    change: "+8.5%",
    isPositive: true,
    recommendation: "rising",
    marketId: "bishoftu_market",
    city: "Bishoftu",
    insight: "Strong demand from wholesale processors is driving garlic rates up in Bishoftu.",
    low7d: 10500,
    high7d: 12400,
    data: [
      { dayIdx: 1, value: 10500 },
      { dayIdx: 2, value: 11000 },
      { dayIdx: 3, value: 11400 },
      { dayIdx: 4, value: 11800 },
      { dayIdx: 5, value: 12000, isToday: true },
    ],
  },
];

export default function PriceTrendWidget({ onPressAnalytics }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const code = currentLang.startsWith("am") ? "am" : currentLang.startsWith("om") ? "om" : "en";
  const { theme } = useTheme();

  const [selectedCropId, setSelectedCropId] = useState("onion");
  const [selectedPointIdx, setSelectedPointIdx] = useState(4); // Default to Today

  const activeCommodity = useMemo(
    () => COMMODITY_TRENDS.find((c) => c.id === selectedCropId) || COMMODITY_TRENDS[0],
    [selectedCropId],
  );

  const primaryColor = theme?.colors?.primary || "#1565C0";
  const surfaceColor = theme?.colors?.surface || "#FFFFFF";
  const textColor = theme?.colors?.textPrimary || "#0F172A";
  const textMuted = theme?.colors?.textSecondary || "#64748B";
  const border = theme?.colors?.border || "#E2E8F0";
  const successColor = "#10B981";
  const dangerColor = "#EF4444";

  const priceAnim = useRef(new Animated.Value(0)).current;
  const [displayPrice, setDisplayPrice] = useState("0");

  const maxValue = useMemo(() => {
    const max = Math.max(...activeCommodity.data.map((d) => d.value));
    return max > 0 ? max : 1;
  }, [activeCommodity]);

  const marketInfo = getLocalizedMarket(
    activeCommodity.marketId || activeCommodity.city,
    currentLang,
  );
  const localizedCrop = getLocalizedCropName(activeCommodity.crop, currentLang, t);
  const localizedUnit = getLocalizedUnitName(activeCommodity.unit, currentLang, t);

  useEffect(() => {
    priceAnim.setValue(activeCommodity.price * 0.75);
    Animated.timing(priceAnim, {
      toValue: activeCommodity.price,
      duration: 450,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start();

    const listener = priceAnim.addListener(({ value }) => {
      setDisplayPrice(formatNumber(Math.round(value)));
    });

    return () => {
      priceAnim.removeListener(listener);
    };
  }, [selectedCropId, activeCommodity, priceAnim]);

  const getSignalBadge = (rec) => {
    if (rec === "buy_now") {
      return {
        label: t("analytics.buyNowSignal", { defaultValue: "🟢 Good Time to Buy" }),
        bg: "#DCFCE7",
        color: "#15803D",
      };
    }
    if (rec === "rising") {
      return {
        label: t("analytics.risingSignal", { defaultValue: "🔴 Price Rising" }),
        bg: "#FEF2F2",
        color: "#DC2626",
      };
    }
    return {
      label: t("analytics.stableSignal", { defaultValue: "🔵 Stable Market" }),
      bg: "#EFF6FF",
      color: "#1D4ED8",
    };
  };

  const signal = getSignalBadge(activeCommodity.recommendation);

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.card, { backgroundColor: surfaceColor, borderColor: border }]}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <AppText style={[styles.title, { color: textColor }]}>
              {t("buyerDashboard.priceTrends", { defaultValue: "Wholesale Price Trends" })}
            </AppText>

            <View style={styles.cityMarketRow}>
              <View style={styles.cityPill}>
                <Ionicons name="location" size={11} color={primaryColor} />
                <AppText style={styles.cityPillText}>{marketInfo.city}</AppText>
              </View>
              <AppText style={[styles.subtitle, { color: textMuted }]}>
                {marketInfo.name}
              </AppText>
            </View>
          </View>

          {/* Actionable Signal Badge */}
          <View style={[styles.signalBadge, { backgroundColor: signal.bg }]}>
            <AppText style={[styles.signalText, { color: signal.color }]}>
              {signal.label}
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
                  isSelected
                    ? { backgroundColor: primaryColor, borderColor: primaryColor }
                    : { backgroundColor: surfaceColor, borderColor: border },
                ]}
                onPress={() => {
                  setSelectedCropId(item.id);
                  setSelectedPointIdx(4);
                }}
                activeOpacity={0.8}
              >
                <AppText
                  style={[
                    styles.cropPillText,
                    isSelected ? styles.selectedCropPillText : { color: textMuted },
                  ]}
                >
                  {getLocalizedCropName(item.crop, currentLang, t)}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Current Rate & Change Badge */}
        <View style={styles.priceRow}>
          <View style={styles.priceLeft}>
            <AppText style={[styles.priceNumber, { color: textColor }]}>
              ETB {displayPrice}
            </AppText>
            <AppText style={styles.unitText}>/ {localizedUnit}</AppText>
          </View>

          <View
            style={[
              styles.changePill,
              {
                backgroundColor: activeCommodity.isPositive
                  ? "#DCFCE7"
                  : "#FEF2F2",
              },
            ]}
          >
            <Ionicons
              name={activeCommodity.isPositive ? "trending-up" : "trending-down"}
              size={13}
              color={activeCommodity.isPositive ? "#15803D" : dangerColor}
            />
            <AppText
              style={[
                styles.changeText,
                { color: activeCommodity.isPositive ? "#15803D" : dangerColor },
              ]}
            >
              {activeCommodity.change} (7d)
            </AppText>
          </View>
        </View>

        {/* 7-Day Range Track */}
        <View style={styles.rangeRow}>
          <AppText style={styles.rangeText}>
            {t("analytics.rangeMin", { defaultValue: "7d Low" })}: ETB {formatNumber(activeCommodity.low7d)}
          </AppText>
          <AppText style={styles.rangeText}>
            {t("analytics.rangeMax", { defaultValue: "7d High" })}: ETB {formatNumber(activeCommodity.high7d)}
          </AppText>
        </View>

        {/* Localized 5-Day Bar Chart */}
        <View style={styles.chartContainer}>
          {activeCommodity.data.map((point, idx) => {
            const heightPercent = Math.min(100, Math.max(22, (point.value / maxValue) * 100));
            const isSelectedPoint = idx === selectedPointIdx;
            const dayLabel = point.isToday
              ? code === "am"
                ? "ዛሬ"
                : code === "om"
                ? "Har'a"
                : "Today"
              : DAYS_SHORT[code]?.[point.dayIdx] || "Day";

            return (
              <TouchableOpacity
                key={idx}
                style={styles.barCol}
                onPress={() => setSelectedPointIdx(idx)}
                activeOpacity={0.85}
              >
                {/* Active Tooltip Callout */}
                {isSelectedPoint && (
                  <View style={styles.barTooltipPill}>
                    <AppText style={styles.barTooltipText}>
                      ETB {formatNumber(point.value)}
                    </AppText>
                  </View>
                )}

                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${heightPercent}%`,
                        backgroundColor: isSelectedPoint ? primaryColor : primaryColor + "35",
                      },
                    ]}
                  />
                </View>
                <AppText
                  style={[
                    styles.axisLabel,
                    isSelectedPoint && { color: primaryColor, fontWeight: "800" },
                  ]}
                >
                  {dayLabel}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Insight Advisory Banner */}
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
                {t("buyerDashboard.fullMarketAnalysis", {
                  defaultValue: "Full Market Analytics →",
                })}
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
  },
  cityMarketRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 3,
  },
  cityPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cityPillText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 11.5,
  },
  signalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  signalText: {
    fontSize: 11,
    fontWeight: "800",
  },
  cropScroll: {
    marginBottom: 12,
  },
  cropContent: {
    gap: 8,
  },
  cropPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
  },
  cropPillText: {
    fontSize: 12,
    fontWeight: "600",
  },
  selectedCropPillText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  priceLeft: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  priceNumber: {
    fontSize: 22,
    fontWeight: "800",
  },
  unitText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  changePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  changeText: {
    fontSize: 11.5,
    fontWeight: "800",
  },
  rangeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  rangeText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 120,
    marginBottom: 14,
    backgroundColor: "#F8FAFC",
    paddingVertical: 10,
    borderRadius: 14,
  },
  barCol: {
    alignItems: "center",
    width: 44,
  },
  barTooltipPill: {
    position: "absolute",
    top: -18,
    backgroundColor: "#0F172A",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 10,
  },
  barTooltipText: {
    color: "#FFFFFF",
    fontSize: 9.5,
    fontWeight: "800",
  },
  barTrack: {
    height: 70,
    width: 14,
    backgroundColor: "#E2E8F0",
    borderRadius: 8,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 8,
  },
  axisLabel: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 6,
  },
  footer: {
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  insightText: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 17,
  },
  analyticsBtn: {
    alignSelf: "flex-start",
  },
  analyticsBtnText: {
    fontSize: 12.5,
    fontWeight: "700",
  },
});
