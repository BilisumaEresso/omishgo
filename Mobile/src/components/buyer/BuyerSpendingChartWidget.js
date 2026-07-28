import { useTranslation } from "react-i18next";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../common/AppText";
import { formatNumber } from "../../utils/formatNumber";

export default function BuyerSpendingChartWidget({
  monthlyData = [
    { month: "Jan", amount: 8500 },
    { month: "Feb", amount: 14200 },
    { month: "Mar", amount: 20000 },
    { month: "Apr", amount: 16800 },
  ],
  currency = "ETB",
}) {
  const { t } = useTranslation();
  const [selectedIdx, setSelectedIdx] = useState(2); // Default to Mar

  const maxVal = Math.max(...monthlyData.map((d) => d.amount), 50000);
  const chartHeight = 120;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <AppText style={styles.title}>
          {t("buyerDashboard.mySpending", { defaultValue: "My Spending" })}
        </AppText>
        <AppText style={styles.timeframe}>
          {t("buyerDashboard.last4Months", { defaultValue: "Last 4 Months" })}
        </AppText>
      </View>

      <View style={styles.chartContainer}>
        {/* Y-Axis Guidelines */}
        <View style={styles.yAxisLines}>
          <View style={styles.gridLineRow}>
            <AppText style={styles.yAxisLabel}>50k</AppText>
            <View style={styles.dashedLine} />
          </View>
          <View style={styles.gridLineRow}>
            <AppText style={styles.yAxisLabel}>20k</AppText>
            <View style={styles.dashedLine} />
          </View>
          <View style={styles.gridLineRow}>
            <AppText style={styles.yAxisLabel}>10k</AppText>
            <View style={styles.dashedLine} />
          </View>
          <View style={styles.gridLineRow}>
            <AppText style={styles.yAxisLabel}>0</AppText>
            <View style={styles.solidLine} />
          </View>
        </View>

        {/* Data Bars & Nodes */}
        <View style={styles.barsContainer}>
          {monthlyData.map((item, idx) => {
            const isSelected = idx === selectedIdx;
            const heightPercent = Math.min(100, Math.max(15, (item.amount / maxVal) * 100));

            return (
              <TouchableOpacity
                key={item.month}
                style={styles.col}
                onPress={() => setSelectedIdx(idx)}
                activeOpacity={0.8}
              >
                {/* Active Tooltip callout */}
                {isSelected && (
                  <View style={styles.tooltipCallout}>
                    <AppText style={styles.tooltipText}>
                      {currency} {formatNumber(item.amount)}
                    </AppText>
                    <View style={styles.tooltipArrow} />
                  </View>
                )}

                {/* Vertical Highlight Pill */}
                <View
                  style={[
                    styles.barTrack,
                    { height: chartHeight },
                    isSelected && styles.selectedTrack,
                  ]}
                >
                  <View
                    style={[
                      styles.barFill,
                      { height: `${heightPercent}%` },
                      isSelected ? styles.selectedBarFill : styles.normalBarFill,
                    ]}
                  />
                  {/* Node Dot */}
                  <View
                    style={[
                      styles.nodeDot,
                      { bottom: `${heightPercent}%` },
                      isSelected && styles.selectedNodeDot,
                    ]}
                  />
                </View>

                {/* X-Axis Label */}
                <AppText
                  style={[
                    styles.xAxisLabel,
                    isSelected && styles.selectedXAxisLabel,
                  ]}
                >
                  {item.month}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  timeframe: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  chartContainer: {
    height: 180,
    position: "relative",
    justifyContent: "flex-end",
  },
  yAxisLines: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 10,
    bottom: 30,
    justifyContent: "space-between",
  },
  gridLineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  yAxisLabel: {
    width: 30,
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "right",
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
    backgroundColor: "#CBD5E1",
  },
  barsContainer: {
    flexDirection: "row",
    paddingLeft: 40,
    paddingRight: 10,
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 150,
  },
  col: {
    alignItems: "center",
    position: "relative",
    flex: 1,
  },
  tooltipCallout: {
    position: "absolute",
    top: -34,
    backgroundColor: "#1E1B4B",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    zIndex: 10,
    alignItems: "center",
  },
  tooltipText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderStyle: "solid",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#1E1B4B",
    bottom: -5,
    position: "absolute",
  },
  barTrack: {
    width: 44,
    borderRadius: 14,
    justifyContent: "flex-end",
    overflow: "hidden",
    position: "relative",
  },
  selectedTrack: {
    backgroundColor: "rgba(244, 63, 94, 0.12)", // Pink highlight matching Image 2
  },
  barFill: {
    width: "100%",
    borderRadius: 14,
  },
  normalBarFill: {
    backgroundColor: "rgba(56, 189, 248, 0.25)",
  },
  selectedBarFill: {
    backgroundColor: "rgba(56, 189, 248, 0.6)",
  },
  nodeDot: {
    position: "absolute",
    left: "50%",
    marginLeft: -6,
    marginBottom: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "#38BDF8",
    zIndex: 5,
  },
  selectedNodeDot: {
    borderColor: "#1E1B4B",
    width: 14,
    height: 14,
    borderRadius: 7,
    marginLeft: -7,
    marginBottom: -7,
  },
  xAxisLabel: {
    marginTop: 8,
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  selectedXAxisLabel: {
    color: "#0F172A",
    fontWeight: "700",
  },
});
