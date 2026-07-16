import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import AppText from "../common/AppText";
import AppCard from "../common/AppCard";
import { useTheme } from "../../hooks/useTheme";

export default function PriceTrendWidget() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const primary = theme?.colors?.primary || "#2E7D32";
  const surface = theme?.colors?.surface || "#FFF";
  const textPrimary = theme?.colors?.textPrimary || "#1A2E1A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6741";
  const success = theme?.colors?.success || "#2E7D32";

  const weekDays = [
    t("priceTrendWidget.dayMon"),
    t("priceTrendWidget.dayTue"),
    t("priceTrendWidget.dayWed"),
    t("priceTrendWidget.dayThu"),
    t("priceTrendWidget.dayToday"),
  ];

  return (
    <AppCard
      style={[styles.card, { backgroundColor: surface, shadowColor: primary }]}
    >
      {/* Header row with icon and product name */}
      <View style={styles.headerRow}>
        <View style={[styles.iconCircle, { backgroundColor: primary + "15" }]}>
          <Ionicons name="trending-up" size={18} color={primary} />
        </View>
        <AppText
          variant="headingSm"
          style={[styles.productName, { color: textPrimary }]}
        >
          {t("priceTrendWidget.productName")}
        </AppText>
        <View style={[styles.changeBadge, { backgroundColor: success + "20" }]}>
          <Ionicons
            name="arrow-up"
            size={12}
            color={success}
            style={{ marginRight: 2 }}
          />
          <AppText
            variant="caption"
            style={{ color: success, fontWeight: "700" }}
          >
            {t("priceTrendWidget.changePercent", { percent: "+4.2" })}
          </AppText>
        </View>
      </View>

      {/* Price – large and bold */}
      <AppText style={[styles.price, { color: primary }]}>
        {t("priceTrendWidget.priceETB", { price: "3450" })}
      </AppText>

      {/* Subtitle / description */}
      <AppText
        variant="caption"
        style={{ color: textSecondary, marginBottom: 12 }}
      >
        {t("priceTrendWidget.subtitle")}
      </AppText>

      {/* Bar chart – more visible */}
      <View style={styles.barChartContainer}>
        <View style={styles.barChart}>
          {[32, 44, 56, 68, 80].map((height, index) => (
            <View
              key={index}
              style={[
                styles.bar,
                {
                  height,
                  backgroundColor:
                    index === 4 ? primary : primary + `${(index + 1) * 20}`,
                },
              ]}
            />
          ))}
        </View>
        {/* Optional axis labels */}
        <View style={styles.axisLabels}>
          {weekDays.map((label, idx) => (
            <AppText
              key={idx}
              variant="caption"
              style={{
                color: idx === 4 ? primary : textSecondary,
                fontWeight: idx === 4 ? "600" : "400",
              }}
            >
              {label}
            </AppText>
          ))}
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  productName: {
    fontWeight: "700",
    flex: 1,
  },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  price: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 4,
  },
  barChartContainer: {
    marginTop: 8,
  },
  barChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 80,
    marginBottom: 4,
  },
  bar: {
    width: 12,
    borderRadius: 6,
  },
  axisLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
});
