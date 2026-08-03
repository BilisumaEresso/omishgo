// Mobile/src/components/buyer/BuyerSpendingChartWidget.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { GREGORIAN_MONTHS_SHORT } from "../../utils/ethiopianDate";
import { formatNumber } from "../../utils/formatNumber";
import AppText from "../common/AppText";

export default function BuyerSpendingChartWidget({
  monthlyData = [
    { month: "Jan", monthIdx: 0, amount: 8500 },
    { month: "Feb", monthIdx: 1, amount: 14200 },
    { month: "Mar", monthIdx: 2, amount: 20000 },
    { month: "Apr", monthIdx: 3, amount: 16800 },
  ],
  currency = "ETB",
}) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const { theme } = useTheme();

  const [selectedIdx, setSelectedIdx] = useState(2); // Default to Mar

  const primaryColor = theme?.colors?.primary || "#1565C0";
  const surfaceColor = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";
  const border = theme?.colors?.border || "#E2E8F0";

  const totalSpent = monthlyData.reduce((sum, item) => sum + item.amount, 0);
  const avgMonthly = Math.round(totalSpent / (monthlyData.length || 1));
  const maxVal = Math.max(...monthlyData.map((d) => d.amount), 25000);
  const chartHeight = 120;

  // Category breakdown allocation simulation
  const categoriesSplit = [
    { label: t("analytics.catVegetables", { defaultValue: "Vegetables & Roots" }), percent: 45, color: "#0284C7" },
    { label: t("analytics.catCereals", { defaultValue: "Cereals & Grains" }), percent: 35, color: "#7C3AED" },
    { label: t("analytics.catCashCrops", { defaultValue: "Cash Crops & Pulses" }), percent: 20, color: "#D97706" },
  ];

  return (
    <View style={[styles.card, { backgroundColor: surfaceColor, borderColor: border }]}>
      {/* 1. Header */}
      <View style={styles.header}>
        <View>
          <AppText style={[styles.title, { color: textPrimary }]}>
            {t("buyerDashboard.mySpending", { defaultValue: "My Procurement Spending" })}
          </AppText>
          <AppText style={[styles.subtitle, { color: textSecondary }]}>
            {t("buyerDashboard.last4Months", { defaultValue: "Last 4 Months Breakdown" })}
          </AppText>
        </View>
        <View style={styles.avgBadge}>
          <Ionicons name="wallet-outline" size={13} color={primaryColor} />
          <AppText style={[styles.avgBadgeText, { color: primaryColor }]}>
            Avg: {currency} {formatNumber(avgMonthly)}/mo
          </AppText>
        </View>
      </View>

      {/* 2. Interactive Bar Chart */}
      <View style={styles.chartArea}>
        {/* Y-Axis Guideline Markers */}
        <View style={styles.yAxisLines}>
          <View style={styles.gridRow}>
            <AppText style={styles.yAxisText}>{formatNumber(Math.round(maxVal / 1000))}k</AppText>
            <View style={styles.dashedLine} />
          </View>
          <View style={styles.gridRow}>
            <AppText style={styles.yAxisText}>{formatNumber(Math.round(maxVal / 2000))}k</AppText>
            <View style={styles.dashedLine} />
          </View>
          <View style={styles.gridRow}>
            <AppText style={styles.yAxisText}>0</AppText>
            <View style={styles.solidLine} />
          </View>
        </View>

        {/* Bars */}
        <View style={styles.barsRow}>
          {monthlyData.map((item, idx) => {
            const isSelected = idx === selectedIdx;
            const heightPercent = Math.min(100, Math.max(18, (item.amount / maxVal) * 100));
            const monthLabel =
              GREGORIAN_MONTHS_SHORT[currentLang]?.[item.monthIdx ?? idx] || item.month;

            return (
              <TouchableOpacity
                key={item.month + idx}
                style={styles.barCol}
                onPress={() => setSelectedIdx(idx)}
                activeOpacity={0.85}
              >
                {/* Selected Amount Callout Tooltip */}
                {isSelected && (
                  <View style={styles.tooltipPill}>
                    <AppText style={styles.tooltipText}>
                      {currency} {formatNumber(item.amount)}
                    </AppText>
                    <View style={styles.tooltipArrow} />
                  </View>
                )}

                {/* Vertical Bar Container */}
                <View style={[styles.barContainer, { height: chartHeight }]}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${heightPercent}%`,
                        backgroundColor: isSelected ? primaryColor : primaryColor + "35",
                      },
                    ]}
                  />
                </View>

                {/* Month Label */}
                <AppText
                  style={[
                    styles.monthText,
                    { color: isSelected ? primaryColor : textSecondary, fontWeight: isSelected ? "800" : "500" },
                  ]}
                >
                  {monthLabel}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 3. Category Procurement Allocation Bar */}
      <View style={[styles.splitSection, { borderTopColor: border }]}>
        <View style={styles.splitHeader}>
          <AppText style={[styles.splitTitle, { color: textPrimary }]}>
            {t("buyerDashboard.spendingAllocation", { defaultValue: "Category Allocation" })}
          </AppText>
          <AppText style={[styles.splitTotal, { color: textSecondary }]}>
            {currency} {formatNumber(monthlyData[selectedIdx]?.amount || totalSpent)}
          </AppText>
        </View>

        {/* Multi-color Split Bar */}
        <View style={styles.multiColorTrack}>
          {categoriesSplit.map((cat, idx) => (
            <View
              key={idx}
              style={{
                width: `${cat.percent}%`,
                height: "100%",
                backgroundColor: cat.color,
              }}
            />
          ))}
        </View>

        {/* Legend Row */}
        <View style={styles.legendRow}>
          {categoriesSplit.map((cat, idx) => (
            <View key={idx} style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: cat.color }]} />
              <AppText style={styles.legendText}>
                {cat.label} ({cat.percent}%)
              </AppText>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  avgBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  avgBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  chartArea: {
    position: "relative",
    marginBottom: 14,
  },
  yAxisLines: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 24,
    bottom: 24,
    justifyContent: "space-between",
  },
  gridRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  yAxisText: {
    fontSize: 10,
    color: "#94A3B8",
    width: 24,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 0.5,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
  },
  solidLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  barsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingLeft: 30,
    height: 155,
  },
  barCol: {
    alignItems: "center",
    width: 48,
  },
  tooltipPill: {
    position: "absolute",
    top: -24,
    backgroundColor: "#0F172A",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignItems: "center",
    zIndex: 10,
  },
  tooltipText: {
    color: "#FFFFFF",
    fontSize: 10.5,
    fontWeight: "800",
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#0F172A",
    alignSelf: "center",
  },
  barContainer: {
    width: 22,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 12,
  },
  monthText: {
    fontSize: 12,
    marginTop: 6,
  },
  splitSection: {
    paddingTop: 12,
    borderTopWidth: 1,
  },
  splitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  splitTitle: {
    fontSize: 12.5,
    fontWeight: "700",
  },
  splitTotal: {
    fontSize: 12.5,
    fontWeight: "700",
  },
  multiColorTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    flexDirection: "row",
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
});
