import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import AppText from "../common/AppText";
import AppCard from "../common/AppCard";
import { useTheme } from "../../hooks/useTheme";

export default function MarketTrendsList({ trends, onSellPress }) {
  const { theme } = useTheme();
  const textPrimary = theme?.colors?.textPrimary;
  const textSecondary = theme?.colors?.textSecondary;
  const successColor = theme?.colors?.success;
  const errorColor = theme?.colors?.error;
  const primaryColor = theme?.colors?.primary;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <AppText variant="headingSm" style={{ color: textPrimary }}>
          Market Analysis
        </AppText>
        <TouchableOpacity onPress={() => {}}>
          <AppText variant="caption" style={{ color: primaryColor }}>
            View full report →
          </AppText>
        </TouchableOpacity>
      </View>
      {trends.map((trend, idx) => (
        <AppCard key={idx} style={styles.card}>
          <View style={styles.row}>
            <View>
              <AppText
                variant="bodyMd"
                style={{ fontWeight: "bold", color: textPrimary }}
              >
                {trend.crop}
              </AppText>
              <AppText variant="caption" style={{ color: textSecondary }}>
                {trend.region}
              </AppText>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <AppText
                variant="headingSm"
                style={{
                  color: trend.trend === "up" ? successColor : errorColor,
                }}
              >
                {trend.demandChange}
              </AppText>
              <AppText variant="caption" style={{ color: textSecondary }}>
                {trend.price}
              </AppText>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: primaryColor }]}
            onPress={() => onSellPress(trend.crop)}
          >
            <AppText
              variant="caption"
              style={{ color: "#FFF", fontWeight: "bold" }}
            >
              Sell Now
            </AppText>
          </TouchableOpacity>
        </AppCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  card: { marginBottom: 12, padding: 16 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  button: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
});
