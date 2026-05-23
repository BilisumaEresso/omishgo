import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText";
import { useTheme } from "../../hooks/useTheme";

export default function DriverStatsCards({ earnings, tasksCount }) {
  const { theme } = useTheme();
  return (
    <View style={styles.row}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.iconTop}>
          <Ionicons
            name="clipboard-outline"
            size={20}
            color={theme.colors.primary}
          />
        </View>
        <AppText
          variant="headingLg"
          style={{ color: theme.colors.textPrimary }}
        >
          {tasksCount}
        </AppText>
        <AppText
          variant="caption"
          style={{ color: theme.colors.textSecondary }}
        >
          Active Tasks
        </AppText>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primaryDark,
          },
        ]}
      >
        <View style={styles.iconTop}>
          <Ionicons name="cash-outline" size={20} color="#FFF" />
        </View>
        <AppText variant="headingLg" style={{ color: "#FFF" }}>
          {earnings} ETB
        </AppText>
        <AppText variant="caption" style={{ color: "#FFF", opacity: 0.9 }}>
          Today's Earnings
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  iconTop: {
    marginBottom: 12,
  },
});
