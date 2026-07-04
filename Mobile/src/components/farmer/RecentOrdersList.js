import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText";
import AppCard from "../common/AppCard";
import { useTheme } from "../../hooks/useTheme";

function StatusBadge({ status }) {
  let bgColor = "#FFF3E0",
    textColor = "#FF9800";
  if (status === "Completed") {
    bgColor = "#E8F5E9";
    textColor = "#4CAF50";
  } else if (status === "Processing") {
    bgColor = "#E3F2FD";
    textColor = "#2196F3";
  }
  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <AppText
        variant="caption"
        style={{ color: textColor, fontWeight: "600" }}
      >
        {status}
      </AppText>
    </View>
  );
}

export default function RecentOrdersList({ orders }) {
  const { theme } = useTheme();
  const primaryColor = theme?.colors?.primary;
  const textPrimary = theme?.colors?.textPrimary;
  const textSecondary = theme?.colors?.textSecondary;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <AppText variant="headingSm" style={{ color: textPrimary }}>
          Recent Orders
        </AppText>
        <TouchableOpacity onPress={() => {}}>
          <AppText variant="caption" style={{ color: primaryColor }}>
            See all
          </AppText>
        </TouchableOpacity>
      </View>
      {orders.map((order) => (
        <AppCard key={order.id} style={styles.card}>
          <View style={styles.row}>
            <View style={styles.left}>
              <View
                style={[
                  styles.icon,
                  { backgroundColor: theme?.colors?.primaryLight || "#F3E5F5" },
                ]}
              >
                <Ionicons
                  name="bag-handle-outline"
                  size={20}
                  color={primaryColor}
                />
              </View>
              <View>
                <AppText
                  variant="bodyMd"
                  style={{ fontWeight: "bold", color: textPrimary }}
                >
                  {order.item}
                </AppText>
                <AppText variant="caption" style={{ color: textSecondary }}>
                  Order #{order.id} • {order.date}
                </AppText>
              </View>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <AppText
                variant="bodyMd"
                style={{ fontWeight: "bold", color: primaryColor }}
              >
                {order.price.toLocaleString()} ETB
              </AppText>
              <StatusBadge status={order.status} />
            </View>
          </View>
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
  card: { marginBottom: 12, padding: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: { flexDirection: "row", alignItems: "center", gap: 12 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
});
