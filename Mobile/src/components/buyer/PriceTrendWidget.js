import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../common/AppText";
import AppCard from "../common/AppCard";
import { useTheme } from "../../hooks/useTheme";

export default function PriceTrendWidget() {
  const { theme } = useTheme();
  return (
    <AppCard style={styles.card}>
      <View style={styles.row}>
        <View>
          <AppText
            variant="caption"
            style={{ color: theme.colors.textSecondary }}
          >
            Teff Price Trend
          </AppText>
          <AppText variant="headingLg" style={{ color: theme.colors.primary }}>
            3,450 ETB
          </AppText>
          <View
            style={[
              styles.badge,
              { backgroundColor: theme.colors.success + "20" },
            ]}
          >
            <AppText variant="caption" style={{ color: theme.colors.success }}>
              +4.2% up
            </AppText>
          </View>
          <AppText
            variant="caption"
            style={{ color: theme.colors.textSecondary, marginTop: 8 }}
          >
            Rising demand in central Ethiopia.
          </AppText>
        </View>
        <View style={styles.barChart}>
          <View
            style={[
              styles.bar,
              { height: 32, backgroundColor: theme.colors.primary + "30" },
            ]}
          />
          <View
            style={[
              styles.bar,
              { height: 44, backgroundColor: theme.colors.primary + "40" },
            ]}
          />
          <View
            style={[
              styles.bar,
              { height: 56, backgroundColor: theme.colors.primary + "60" },
            ]}
          />
          <View
            style={[
              styles.bar,
              { height: 68, backgroundColor: theme.colors.primary + "80" },
            ]}
          />
          <View
            style={[
              styles.bar,
              { height: 80, backgroundColor: theme.colors.primary },
            ]}
          />
        </View>
      </View>
    </AppCard>
  );
}
const styles = StyleSheet.create({
  card: { marginBottom: 16, padding: 16 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  barChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    height: 80,
  },
  bar: { width: 8, borderRadius: 4 },
});
