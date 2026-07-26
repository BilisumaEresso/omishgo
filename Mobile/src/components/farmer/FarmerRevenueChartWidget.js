// src/components/farmer/FarmerRevenueChartWidget.js
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View } from "react-native";
import AppText from "../common/AppText";

export default function FarmerRevenueChartWidget({ currency = "ETB" }) {
  const { t } = useTranslation();
  const chartData = [
    { month: "Jan", heightPct: 40, value: "14K" },
    { month: "Feb", heightPct: 65, value: "28K" },
    { month: "Mar", heightPct: 50, value: "22K" },
    { month: "Apr", heightPct: 85, value: "45K" },
    { month: "May", heightPct: 70, value: "34K" },
    { month: "Jun", heightPct: 95, value: "52K" },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <AppText style={styles.title}>{t("farmerDashboard.monthlySalesTrend", { defaultValue: "Monthly Harvest Sales Trend" })}</AppText>
          <AppText style={styles.subtitle}>{t("farmerDashboard.revenueTrajectory", { defaultValue: "Revenue trajectory over past 6 months" })}</AppText>
        </View>

        <View style={styles.trendBadge}>
          <Ionicons name="trending-up" size={14} color="#15803D" />
          <AppText style={styles.trendText}>+24% YoY</AppText>
        </View>
      </View>

      {/* Bar Graph Simulation */}
      <View style={styles.chartContainer}>
        {chartData.map((item, idx) => (
          <View key={item.month} style={styles.barGroup}>
            <AppText style={styles.barVal}>{item.value}</AppText>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    height: `${item.heightPct}%`,
                    backgroundColor: idx === chartData.length - 1 ? "#15803D" : "#86EFAC",
                  },
                ]}
              />
            </View>
            <AppText style={styles.barLabel}>{item.month}</AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#15803D",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 140,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  barGroup: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
  barVal: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 4,
  },
  barTrack: {
    width: 16,
    height: 90,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  barFill: {
    width: "100%",
    borderRadius: 8,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
    marginTop: 6,
  },
});
