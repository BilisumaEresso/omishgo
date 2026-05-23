import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText";
import AppCard from "../common/AppCard";
import { useTheme } from "../../hooks/useTheme";

export default function InventoryLowStockWidget({ alerts }) {
  const { theme } = useTheme();
  return (
    <View style={styles.row}>
      {/* Inventory Summary */}
      <View
        style={[
          styles.halfCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <AppText
            variant="bodyMd"
            style={{ fontWeight: "bold", color: theme.colors.textPrimary }}
          >
            Inventory
          </AppText>
          <View
            style={[
              styles.iconBg,
              { backgroundColor: theme.colors.primaryLight },
            ]}
          >
            <Ionicons
              name="cube-outline"
              size={18}
              color={theme.colors.primary}
            />
          </View>
        </View>
        <View style={styles.statsRow}>
          <View>
            <AppText
              variant="headingLg"
              style={{ color: theme.colors.textPrimary }}
            >
              124
            </AppText>
            <AppText
              variant="caption"
              style={{ color: theme.colors.textSecondary }}
            >
              Total Items
            </AppText>
          </View>
          <View>
            <AppText
              variant="headingLg"
              style={{ color: theme.colors.primary }}
            >
              89
            </AppText>
            <AppText
              variant="caption"
              style={{ color: theme.colors.textSecondary }}
            >
              Active
            </AppText>
          </View>
        </View>
      </View>

      {/* Low Stock Alerts */}
      <View
        style={[
          styles.halfCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.error + "40",
            borderWidth: 1,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <AppText
            variant="bodyMd"
            style={{ fontWeight: "bold", color: theme.colors.error }}
          >
            Low Stock
          </AppText>
          <View
            style={[
              styles.iconBg,
              { backgroundColor: theme.colors.error + "10" },
            ]}
          >
            <Ionicons
              name="alert-circle-outline"
              size={18}
              color={theme.colors.error}
            />
          </View>
        </View>
        {alerts.map((alert) => (
          <View key={alert.id} style={styles.alertRow}>
            <AppText
              variant="caption"
              style={{ flex: 1, color: theme.colors.textPrimary }}
            >
              {alert.item}
            </AppText>
            <View
              style={[
                styles.alertBadge,
                {
                  backgroundColor:
                    alert.status === "critical"
                      ? theme.colors.error + "20"
                      : theme.colors.warning + "20",
                },
              ]}
            >
              <AppText
                variant="caption"
                style={{
                  color:
                    alert.status === "critical"
                      ? theme.colors.error
                      : theme.colors.warning,
                  fontWeight: "bold",
                }}
              >
                {alert.amount}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12, marginBottom: 16 },
  halfCard: { flex: 1, padding: 12, borderRadius: 20, borderWidth: 1 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  iconBg: { padding: 6, borderRadius: 12 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  alertRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  alertBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
});
