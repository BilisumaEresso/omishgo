import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText";
import AppCard from "../common/AppCard";
import { useTheme } from "../../hooks/useTheme";

export default function BuyerWeatherWidget() {
  const { theme } = useTheme();
  return (
    <AppCard style={styles.card}>
      <View style={styles.row}>
        <View style={styles.left}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: theme.colors.primaryLight },
            ]}
          >
            <Ionicons
              name="partly-sunny"
              size={28}
              color={theme.colors.primary}
            />
          </View>
          <View style={{ marginLeft: 12 }}>
            <AppText
              variant="caption"
              style={{ color: theme.colors.textSecondary }}
            >
              Addis Ababa
            </AppText>
            <AppText
              variant="headingMd"
              style={{ color: theme.colors.textPrimary }}
            >
              22°C
            </AppText>
          </View>
        </View>
        <View style={styles.divider} />
        <View>
          <AppText
            variant="caption"
            style={{ color: theme.colors.textSecondary }}
          >
            Market Day
          </AppText>
          <AppText
            variant="headingSm"
            style={{ color: theme.colors.textPrimary }}
          >
            Tuesday
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
