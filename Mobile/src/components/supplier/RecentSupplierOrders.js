import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText";
import AppCard from "../common/AppCard";
import { useTheme } from "../../hooks/useTheme";

const getStatusColor = (status, theme) => {
  switch (status) {
    case "Pending":
      return { bg: theme.colors.border, text: theme.colors.textSecondary };
    case "Processing":
      return { bg: theme.colors.warning + "20", text: theme.colors.warning };
    case "Delivered":
      return { bg: theme.colors.success + "20", text: theme.colors.success };
    default:
      return { bg: theme.colors.border, text: theme.colors.textSecondary };
  }
};

export default function RecentSupplierOrders({ orders }) {
  const { theme } = useTheme();
  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <AppText
          variant="headingSm"
          style={{ color: theme.colors.textPrimary }}
        >
          Recent Orders
        </AppText>
        <TouchableOpacity>
          <AppText variant="caption" style={{ color: theme.colors.primary }}>
            View All →
          </AppText>
        </TouchableOpacity>
      </View>
      {orders.map((order) => {
        const statusStyle = getStatusColor(order.status, theme);
        let iconName = "person-outline";
        if (order.type === "retailer") iconName = "storefront-outline";
        if (order.type === "farmcenter") iconName = "business-outline";
        return (
          <View key={order.id} style={styles.orderRow}>
            <View style={styles.orderLeft}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: theme.colors.primaryLight },
                ]}
              >
                <Ionicons
                  name={iconName}
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View>
                <AppText
                  variant="bodyMd"
                  style={{
                    fontWeight: "bold",
                    color: theme.colors.textPrimary,
                  }}
                >
                  {order.buyerName}
                </AppText>
                <AppText
                  variant="caption"
                  style={{ color: theme.colors.textSecondary }}
                >
                  Ord #{order.id} • {order.price.toLocaleString()} ETB
                </AppText>
              </View>
            </View>
            <View
              style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}
            >
              <AppText
                variant="caption"
                style={{ color: statusStyle.text, fontWeight: "bold" }}
              >
                {order.status}
              </AppText>
            </View>
          </View>
        );
      })}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  orderLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
});
