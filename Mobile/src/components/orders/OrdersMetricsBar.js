// src/components/orders/OrdersMetricsBar.js
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View } from "react-native";
import AppText from "../common/AppText";

export default function OrdersMetricsBar({
  pendingCount = 0,
  inTransitCount = 0,
  completedCount = 0,
}) {
  const { t } = useTranslation();
  return (
    <View style={styles.metricsRow}>
      <View style={[styles.tile, { backgroundColor: "#FEF3C7", borderColor: "#FDE68A" }]}>
        <View style={styles.header}>
          <Ionicons name="time" size={14} color="#D97706" />
          <AppText style={[styles.val, { color: "#92400E" }]}>{pendingCount}</AppText>
        </View>
        <AppText style={[styles.label, { color: "#B45309" }]}>{t("orders.pending", { defaultValue: "Pending" })}</AppText>
      </View>

      <View style={[styles.tile, { backgroundColor: "#F3E8FF", borderColor: "#DDD6FE" }]}>
        <View style={styles.header}>
          <Ionicons name="bicycle" size={14} color="#7C3AED" />
          <AppText style={[styles.val, { color: "#5B21B6" }]}>{inTransitCount}</AppText>
        </View>
        <AppText style={[styles.label, { color: "#6D28D9" }]}>{t("orders.inTransit", { defaultValue: "In Transit" })}</AppText>
      </View>

      <View style={[styles.tile, { backgroundColor: "#DCFCE7", borderColor: "#BBF7D0" }]}>
        <View style={styles.header}>
          <Ionicons name="checkmark-done" size={14} color="#16A34A" />
          <AppText style={[styles.val, { color: "#14532D" }]}>{completedCount}</AppText>
        </View>
        <AppText style={[styles.label, { color: "#15803D" }]}>{t("orders.delivered", { defaultValue: "Delivered" })}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  metricsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  tile: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  val: {
    fontSize: 18,
    fontWeight: "900",
    marginVertical: 6,
    lineHeight: 24,
    paddingBottom: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
  },
});
