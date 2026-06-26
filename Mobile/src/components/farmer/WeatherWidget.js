import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText";
import AppCard from "../common/AppCard";
import { useTheme } from "../../hooks/useTheme";

export default function WeatherWidget() {
  const { theme } = useTheme();
  const primaryColor = theme.colors.primary;
  const textPrimary = theme.colors.textPrimary;
  const textSecondary = theme.colors.textSecondary;

  return (
    <AppCard style={styles.card}>
      <View style={styles.row}>
        <View style={styles.left}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: theme.colors.primaryLight || "#E8F5E9" },
            ]}
          >
            <Ionicons name="cloudy-outline" size={28} color={primaryColor} />
          </View>
          <View style={{ marginLeft: 12 }}>
            <AppText variant="caption" style={{ color: textSecondary }}>
              Adama, Oromia
            </AppText>
            <AppText variant="headingMd" style={{ color: textPrimary }}>
              24°C
            </AppText>
          </View>
        </View>
        <View style={styles.divider} />
        <View>
          <AppText variant="caption" style={{ color: textSecondary }}>
            Humidity
          </AppText>
          <AppText variant="headingSm" style={{ color: textPrimary }}>
            65%
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
