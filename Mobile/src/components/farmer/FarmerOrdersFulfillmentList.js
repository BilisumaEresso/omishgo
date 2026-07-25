// src/components/farmer/FarmerOrdersFulfillmentList.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../common/AppText";

export default function FarmerOrdersFulfillmentList({
  orders = [],
  onViewAllOrders,
  onOrderPress,
  onChatBuyer,
}) {
  const statusConfig = {
    pending: { label: "Pending Dispatch", color: "#D97706", bg: "#FEF3C7" },
    confirmed: { label: "Confirmed Order", color: "#2563EB", bg: "#EFF6FF" },
    in_transit: { label: "In Transit", color: "#7C3AED", bg: "#F3E8FF" },
    delivered: { label: "Delivered", color: "#16A34A", bg: "#DCFCE7" },
    completed: { label: "Completed", color: "#16A34A", bg: "#DCFCE7" },
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <AppText style={styles.title}>Buyer Orders & Fulfillment Feed</AppText>
          <AppText style={styles.subtitle}>Direct wholesale purchase requests</AppText>
        </View>

        <TouchableOpacity onPress={onViewAllOrders} activeOpacity={0.8}>
          <AppText style={styles.viewAllText}>View All Orders</AppText>
        </TouchableOpacity>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="basket-outline" size={32} color="#94A3B8" />
          <AppText style={styles.emptyText}>No recent buyer orders yet</AppText>
        </View>
      ) : (
        <View style={styles.list}>
          {orders.slice(0, 4).map((o, idx) => {
            const isLast = idx === Math.min(orders.length, 4) - 1;
            const st = statusConfig[o.status] || { label: o.status, color: "#64748B", bg: "#F1F5F9" };
            const cropName = o.cropType || "Harvest Crop";
            const amount = o.totalPrice ? `ETB ${Number(o.totalPrice).toLocaleString()}` : "Pending Quote";

            return (
              <TouchableOpacity
                key={o.id || o._id || idx}
                style={[styles.row, !isLast && styles.rowBorder]}
                onPress={() => onOrderPress?.(o)}
                activeOpacity={0.8}
              >
                <View style={styles.orderMain}>
                  <View style={styles.topMeta}>
                    <AppText style={styles.cropTitle}>
                      {cropName} <AppText style={styles.volume}>({o.quantity || 1} {o.unit || "q"})</AppText>
                    </AppText>
                    <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
                      <AppText style={[styles.statusBadgeText, { color: st.color }]}>{st.label}</AppText>
                    </View>
                  </View>

                  <AppText style={styles.buyerText}>
                    Buyer: <AppText style={styles.buyerName}>{o.buyerName || "Wholesale Buyer"}</AppText> • {o.date || "Today"}
                  </AppText>

                  <View style={styles.bottomMeta}>
                    <AppText style={styles.totalPrice}>{amount}</AppText>

                    {o.buyerId && (
                      <TouchableOpacity
                        style={styles.chatBtn}
                        onPress={() => onChatBuyer?.(o)}
                        activeOpacity={0.85}
                      >
                        <Ionicons name="chatbubble-ellipses" size={14} color="#15803D" />
                        <AppText style={styles.chatBtnText}>Chat Buyer</AppText>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 1,
  },
  viewAllText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#15803D",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "600",
  },
  list: {
    gap: 10,
  },
  row: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  rowBorder: {},
  orderMain: {
    gap: 4,
  },
  topMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cropTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  volume: {
    fontWeight: "600",
    color: "#475569",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10.5,
    fontWeight: "800",
  },
  buyerText: {
    fontSize: 12,
    color: "#64748B",
  },
  buyerName: {
    fontWeight: "700",
    color: "#334155",
  },
  bottomMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: "900",
    color: "#15803D",
  },
  chatBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  chatBtnText: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#15803D",
  },
});
