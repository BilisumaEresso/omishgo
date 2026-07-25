// Mobile/src/screens/buyer/BuyerOrdersScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "../../components/common/AppText";
import DashboardLayout from "../../components/layout/DashBoardLayout";
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
  const [activeFilter, setActiveFilter] = useState("All");

  const filterTabs = ["All", "Pending", "Confirmed", "In Transit", "Delivered", "Cancelled"];

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
        cropType: o.cropType || "Agricultural Produce",
        quantity: o.quantity || 1,
        unit: o.unit || "q",
        totalPrice: o.totalPrice || 0,
        farmerName: o.farmerId?.name || "Verified Producer",
        farmerId: o.farmerId?._id,
        status: (o.status || "pending").replace("_", " "),
        rawStatus: o.status || "pending",
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

  const getStatusStyle = (rawStatus) => {
    switch (rawStatus) {
      case "pending":
        return { bg: "#FEF3C7", text: "#B45309" };
      case "confirmed":
        return { bg: "#E0F2FE", text: "#0284C7" };
      case "in_transit":
        return { bg: "#EFF6FF", text: "#1D4ED8" };
      case "delivered":
      case "completed":
        return { bg: "#ECFDF5", text: "#059669" };
      case "cancelled":
        return { bg: "#FEF2F2", text: "#DC2626" };
      default:
        return { bg: "#F1F5F9", text: "#64748B" };
    }
  };

  const filteredOrders = useMemo(() => {
    if (activeFilter === "All") return orders;
    return orders.filter((o) => o.status.toLowerCase() === activeFilter.toLowerCase());
  }, [orders, activeFilter]);

  return (
    <DashboardLayout
      role="buyer"
      title="My Orders & Deliveries"
      showBack={false}
      onRefresh={() => fetchOrders(true)}
      refreshing={refreshing}
    >
      {/* Category Tabs */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterTabs.map((tab) => {
            const active = activeFilter === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.filterTab,
                  active && { backgroundColor: primaryColor, borderColor: primaryColor },
                ]}
                onPress={() => setActiveFilter(tab)}
                activeOpacity={0.8}
              >
                <AppText style={[styles.filterTabText, active && styles.activeFilterText]}>
                  {tab}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Orders List */}
      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={primaryColor} />
          <AppText style={{ marginTop: 8, color: textSecondary }}>Loading your orders...</AppText>
        </View>
      ) : filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={48} color="#94A3B8" />
          <AppText style={styles.emptyTitle}>No Orders Found</AppText>
          <AppText style={styles.emptySub}>
            You have no {activeFilter !== "All" ? activeFilter.toLowerCase() : ""} orders yet. Explore produce listings in the marketplace to place an order.
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
            const statusStyle = getStatusStyle(item.rawStatus);
            const isActive = item.rawStatus === "pending" || item.rawStatus === "confirmed" || item.rawStatus === "in_transit";

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
                <View style={styles.cardHeader}>
                  <View style={styles.cropTitleWrap}>
                    <AppText style={[styles.cropTitle, { color: textPrimary }]}>
                      {item.cropType}
                    </AppText>
                    <AppText style={styles.farmerSub}>
                      {item.farmerName} • {item.orderedDate}
                    </AppText>
                  </View>

                  <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                    <AppText style={[styles.statusText, { color: statusStyle.text }]}>
                      {item.status.toUpperCase()}
                    </AppText>
                  </View>
                </View>

                <View style={styles.priceRow}>
                  <View>
                    <AppText style={styles.metaLabel}>Order Volume</AppText>
                    <AppText style={styles.metaValue}>
                      {item.quantity} {item.unit}
                    </AppText>
                  </View>

                  <View style={{ alignItems: "flex-end" }}>
                    <AppText style={styles.metaLabel}>Total Price</AppText>
                    <AppText style={[styles.priceValue, { color: primaryColor }]}>
                      ETB {Number(item.totalPrice).toLocaleString()}
                    </AppText>
                  </View>
                </View>

                {isActive && (
                  <View style={styles.cardFooter}>
                    <TouchableOpacity
                      style={[styles.chatBtn, { borderColor: primaryColor }]}
                      onPress={() =>
                        navigation?.navigate("Chat", {
                          userId: item.farmerId,
                          userName: item.farmerName,
                        })
                      }
                      activeOpacity={0.8}
                    >
                      <Ionicons name="chatbubble-ellipses-outline" size={15} color={primaryColor} />
                      <AppText style={[styles.chatBtnText, { color: primaryColor }]}>
                        Message Farmer Producer
                      </AppText>
                    </TouchableOpacity>
                  </View>
                )}
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
  filterScroll: {
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  activeFilterText: {
    color: "#FFFFFF",
    fontWeight: "700",
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cropTitleWrap: {
    flex: 1,
    marginRight: 8,
  },
  cropTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  farmerSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "800",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 14,
  },
  metaLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  metaValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 2,
  },
  priceValue: {
    fontSize: 17,
    fontWeight: "800",
    marginTop: 2,
  },
  cardFooter: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  chatBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  chatBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
  centerLoading: {
    padding: 40,
    alignItems: "center",
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
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  browseBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  browseBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
