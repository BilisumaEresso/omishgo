import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText";
import AppCard from "../common/AppCard";
import { useTheme } from "../../hooks/useTheme";

export default function AgriPriceChangeWidget({
  productName = "Teff",
  currentPrice = "5,200 ETB/q",
  changePercent = 12.5,
  changeLabel = "Today's Change",
}) {
  const { theme } = useTheme();
  const textPrimary = theme.colors.textPrimary;
  const textSecondary = theme.colors.textSecondary;

  const isPositive = changePercent > 0;
  const changeColor = isPositive ? "#4CAF50" : "#F44336";
  const bgColor = isPositive ? "#E8F5E9" : "#FFEBEE";
  const iconName = isPositive ? "trending-up" : "trending-down";

  return (
    <AppCard style={styles.card}>
      <View style={styles.row}>
        <View style={styles.left}>
          <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
            <Ionicons name={iconName} size={28} color={changeColor} />
          </View>
          <View style={{ marginLeft: 12 }}>
            <AppText variant="caption" style={{ color: textSecondary }}>
              {productName}
            </AppText>
            <AppText variant="headingMd" style={{ color: textPrimary }}>
              {currentPrice}
            </AppText>
          </View>
        </View>

        <View style={styles.divider} />

        <View>
          <AppText variant="caption" style={{ color: textSecondary }}>
            {changeLabel}
          </AppText>
          <AppText variant="headingSm" style={{ color: changeColor, fontWeight: "bold" }}>
            {isPositive ? `+${changePercent}%` : `${changePercent}%`}
          </AppText>
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16, padding: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 16,
  },
});
