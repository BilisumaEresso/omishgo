// Mobile/src/screens/buyer/BuyerOrdersScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AppText from "../../components/common/AppText";
import DashboardLayout from "../../components/layout/DashBoardLayout";
import OrdersHeroSummaryCard from "../../components/orders/OrdersHeroSummaryCard";
import OrdersMetricsBar from "../../components/orders/OrdersMetricsBar";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";

export default function BuyerOrdersScreen({ navigation, onSwitchTab }) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const primaryColor = theme?.colors?.primary || "#1565C0";
  const surfaceColor = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";

  const fetchOrders = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const res = await api.get(API_ENDPOINTS.orders.list);
      const raw = res.data?.data?.orders || [];

      const normalized = raw.map((o) => ({
        id: o._id,
        cropType: o.cropType || o.productId?.cropType || "Agricultural Produce",
        quantity: o.quantity || 1,
        unit: o.unit || "q",
        totalPrice: o.totalPrice || (o.priceAtOrder || 0) * (o.quantity || 1),
        farmerName: o.farmerId?.name || "Verified Producer",
        farmerPhone: o.farmerId?.phone || null,
        farmerId: o.farmerId?._id || o.farmerId,
        status: o.status || "pending",
        orderedDate: new Date(o.createdAt || Date.now()).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        _raw: o,
      }));

      setOrders(normalized);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  // Calculations
  const activeOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status !== "completed" && o.status !== "delivered" && o.status !== "cancelled").length;
  }, [orders]);

  const totalActiveValue = useMemo(() => {
    return orders
      .filter((o) => o.status !== "completed" && o.status !== "cancelled")
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  }, [orders]);

  const pendingCount = useMemo(() => orders.filter((o) => o.status === "pending").length, [orders]);
  const inTransitCount = useMemo(() => orders.filter((o) => o.status === "in_transit").length, [orders]);
  const completedCount = useMemo(() => orders.filter((o) => o.status === "completed" || o.status === "delivered").length, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return orders;
    return orders.filter((o) => o.status === activeFilter);
  }, [orders, activeFilter]);

  const statusConfig = {
    pending: { label: "Processing", color: "#D97706", bg: "#FEF3C7" },
    confirmed: { label: "Confirmed", color: "#0284C7", bg: "#E0F2FE" },
    in_transit: { label: "In Transit", color: "#7C3AED", bg: "#F3E8FF" },
    delivered: { label: "Delivered", color: "#059669", bg: "#ECFDF5" },
    completed: { label: "Completed", color: "#059669", bg: "#ECFDF5" },
    cancelled: { label: "Cancelled", color: "#DC2626", bg: "#FEF2F2" },
  };

  const filterTabs = [
    { id: "all", label: `All (${orders.length})` },
    { id: "pending", label: `Pending (${pendingCount})` },
    { id: "in_transit", label: `In Transit (${inTransitCount})` },
    { id: "completed", label: `Delivered (${completedCount})` },
  ];

  return (
    <DashboardLayout
      role="buyer"
      title="My Orders & Deliveries"
      showBack={false}
      onRefresh={() => fetchOrders(true)}
      refreshing={refreshing}
      scrollable
      contentPaddingHorizontal={14}
      navigation={navigation}
    >
      {/* 1. Orders Hero Summary Card */}
      <OrdersHeroSummaryCard
        totalValue={totalActiveValue}
        activeCount={activeOrdersCount}
        role="buyer"
        currency="ETB"
      />

      {/* 2. Orders Metrics Bar */}
      <OrdersMetricsBar
        pendingCount={pendingCount}
        inTransitCount={inTransitCount}
        completedCount={completedCount}
      />

      {/* 3. Status Filter Pills */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterTabs.map((tab) => {
            const active = activeFilter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.filterTab,
                  active ? { backgroundColor: primaryColor } : { backgroundColor: "#F1F5F9" },
                ]}
                onPress={() => setActiveFilter(tab.id)}
                activeOpacity={0.8}
              >
                <AppText
                  style={[
                    styles.filterTabText,
                    active ? { color: "#FFFFFF" } : { color: textSecondary },
                  ]}
                >
                  {tab.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 4. Orders List */}
      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      ) : filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={48} color="#94A3B8" />
          <AppText style={styles.emptyTitle}>No Orders Found</AppText>
          <AppText style={styles.emptySub}>
            Explore produce listings in the marketplace to place an order directly with Ethiopian farmers.
          </AppText>
          <TouchableOpacity
            style={[styles.browseBtn, { backgroundColor: primaryColor }]}
            onPress={() => onSwitchTab?.("Marketplace")}
            activeOpacity={0.85}
          >
            <AppText style={styles.browseBtnText}>Browse Marketplace</AppText>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.ordersGrid}>
          {filteredOrders.map((item) => {
            const st = statusConfig[item.status] || { label: item.status, color: "#64748B", bg: "#F1F5F9" };
            const shortId = item.id ? item.id.substring(item.id.length - 6).toUpperCase() : "ORD";

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, { backgroundColor: surfaceColor }]}
                activeOpacity={0.85}
                onPress={() =>
                  navigation?.navigate("OrderDetail", {
                    order: item._raw,
                    role: "buyer",
                  })
                }
              >
                <View style={styles.cardHeaderRow}>
                  <View style={styles.refWrap}>
                    <Ionicons name="receipt" size={16} color={primaryColor} />
                    <AppText style={styles.refText}>#ORD-{shortId}</AppText>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
                    <AppText style={[styles.statusBadgeText, { color: st.color }]}>{st.label}</AppText>
                  </View>
                </View>

                <View style={styles.mainSpecRow}>
                  <View style={{ flex: 1 }}>
                    <AppText style={[styles.cropTitle, { color: textPrimary }]}>{item.cropType}</AppText>
                    <AppText style={styles.volumeText}>
                      Quantity: <AppText style={styles.boldText}>{item.quantity} {item.unit}</AppText>
                    </AppText>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <AppText style={[styles.priceText, { color: primaryColor }]}>
                      ETB {Number(item.totalPrice).toLocaleString()}
                    </AppText>
                    <AppText style={styles.dateText}>{item.orderedDate}</AppText>
                  </View>
                </View>

                <View style={styles.partnerRow}>
                  <View style={styles.avatarBg}>
                    <Ionicons name="person" size={14} color="#1565C0" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <AppText style={styles.partnerLabel}>Farmer Producer</AppText>
                    <AppText style={styles.partnerName}>{item.farmerName}</AppText>
                  </View>
                </View>

                <View style={styles.actionRow}>
                  {item.farmerId && (
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.chatBtn]}
                      onPress={() =>
                        navigation?.navigate("Chat", {
                          userId: item.farmerId,
                          userName: item.farmerName,
                        })
                      }
                      activeOpacity={0.8}
                    >
                      <Ionicons name="chatbubble-ellipses" size={14} color="#1565C0" />
                      <AppText style={styles.chatBtnText}>Message Farmer</AppText>
                    </TouchableOpacity>
                  )}

                  {item.farmerPhone && (
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.callBtn]}
                      onPress={() => Linking.openURL(`tel:${item.farmerPhone}`)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="call" size={14} color="#2563EB" />
                      <AppText style={styles.callBtnText}>Call Farmer</AppText>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={{ height: 80 }} />
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  filterSection: {
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    marginRight: 8,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: "700",
  },
  centerLoading: {
    padding: 40,
    alignItems: "center",
  },
  ordersGrid: {
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  refWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  refText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  mainSpecRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
  },
  cropTitle: {
    fontSize: 15,
    fontWeight: "800",
  },
  volumeText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  boldText: {
    fontWeight: "700",
    color: "#334155",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "900",
  },
  dateText: {
    fontSize: 10.5,
    color: "#94A3B8",
    marginTop: 2,
  },
  partnerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  avatarBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
  },
  partnerLabel: {
    fontSize: 10.5,
    color: "#94A3B8",
    fontWeight: "600",
  },
  partnerName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 12,
  },
  chatBtn: {
    backgroundColor: "#E0F2FE",
  },
  chatBtnText: {
    color: "#1565C0",
    fontSize: 12,
    fontWeight: "800",
  },
  callBtn: {
    backgroundColor: "#EFF6FF",
  },
  callBtnText: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "800",
  },
  emptyContainer: {
    padding: 30,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12.5,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 19,
  },
  browseBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  browseBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});
