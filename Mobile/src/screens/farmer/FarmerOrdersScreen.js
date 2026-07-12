// Mobile/src/screens/farmer/FarmerOrdersScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AppText from "../../components/common/AppText";
import AppButton from "../../components/common/AppButton";
import AppHeader from "../../components/layout/AppHeader";
import { useSidebar } from "../../context/SidebarContext";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";

const FILTER_TABS = ["All", "Pending", "Confirmed", "Delivered", "Cancelled"];

const STATUS_LABEL = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_transit: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const FarmerOrdersScreen = ({ navigation, onSwitchTab }) => {
  const { theme } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const { openSidebar } = useSidebar();

  // Extract theme colors
  const primary = theme?.colors?.primary || "#2E7D32";
  const textPrimary = theme?.colors?.textPrimary || "#1A2E1A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6741";
  const background = theme?.colors?.background || "#F9FBF9";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#D0E8CE";
  const success = theme?.colors?.success || "#2E7D32";
  const warning = theme?.colors?.warning || "#F57F17";
  const info = theme?.colors?.info || "#0277BD";
  const errorColor = theme?.colors?.error || "#C62828";
  const textMuted = theme?.colors?.textMuted || "#8FAF8A";

  const fetchOrders = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const res = await api.get(API_ENDPOINTS.orders.list);
      const raw = res.data?.data?.orders || [];
      const normalized = raw.map((o) => ({
        id: o._id,
        cropType: o.cropType,
        quantity: o.quantity,
        unit: o.unit || "kg",
        price: o.totalPrice,
        buyerName: o.buyerId?.name || "Buyer",
        buyerId: o.buyerId?._id,
        status: STATUS_LABEL[o.status] || o.status,
        rawStatus: o.status,
        date: new Date(o.createdAt).toLocaleDateString("en-GB", {
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
    }, []),
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return { bg: warning + "18", text: warning };
      case "Confirmed":
        return { bg: info + "18", text: info };
      case "In Transit":
        return { bg: primary + "18", text: primary };
      case "Delivered":
        return { bg: success + "18", text: success };
      case "Cancelled":
        return { bg: errorColor + "18", text: errorColor };
      default:
        return { bg: "#F5F5F518", text: "#757575" };
    }
  };

  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter((o) => o.status === activeFilter);

  const renderOrderCard = ({ item }) => {
    const statusColors = getStatusColor(item.status);
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation?.navigate("OrderDetail", { order: item._raw, role: "farmer" })
        }
      >
        <View style={[styles.card, { backgroundColor: surface }]}>
          <View style={styles.cardRow}>
            {/* Crop info */}
            <View style={{ flex: 1 }}>
              <AppText style={[styles.cropName, { color: textPrimary }]}>
                {item.cropType}
              </AppText>
              <AppText style={[styles.subText, { color: textSecondary }]}>
                {item.buyerName} • {item.date}
              </AppText>
            </View>

            {/* Price and badge */}
            <View style={{ alignItems: "flex-end" }}>
              <AppText style={[styles.price, { color: primary }]}>
                {item.price?.toLocaleString()} ETB
              </AppText>
              <View
                style={[styles.badge, { backgroundColor: statusColors.bg }]}
              >
                <AppText
                  style={[styles.badgeText, { color: statusColors.text }]}
                >
                  {item.status}
                </AppText>
              </View>
            </View>
          </View>

          {/* Quantity */}
          <View style={styles.quantityRow}>
            <Ionicons name="cube-outline" size={14} color={textMuted} style={{ marginRight: 4 }} />
            <AppText style={[styles.quantityText, { color: textSecondary }]}>
              {item.quantity} {item.unit}
            </AppText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cube-outline" size={48} color={textSecondary} style={{ marginBottom: 12 }} />
      <AppText style={[styles.emptyText, { color: textSecondary }]}>
        {activeFilter === "All" ? "No orders yet" : `No ${activeFilter.toLowerCase()} orders`}
      </AppText>
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: background }]}>
      <AppHeader
        title="My Orders"
        showMenu={true}
        showNotification={true}
        notificationCount={0}
        onMenuPress={openSidebar}
        onNotificationPress={() => navigation.navigate("Notifications")}
      />

      {/* Filter tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.filterTab,
                  {
                    backgroundColor: isActive ? primary : "transparent",
                    borderColor: isActive ? primary : border,
                  },
                ]}
                onPress={() => setActiveFilter(tab)}
              >
                <AppText
                  style={[
                    styles.filterText,
                    { color: isActive ? surface : textSecondary },
                  ]}
                >
                  {tab}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <AppText style={{ color: errorColor, marginBottom: 12 }}>{error}</AppText>
          <AppButton title="Retry" onPress={() => fetchOrders()} />
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderCard}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchOrders(true)}
              colors={[primary]}
            />
          }
        />
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  filterContainer: { paddingVertical: 12, paddingLeft: 16 },
  filterScroll: { paddingRight: 16 },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterText: { fontSize: 14, fontWeight: "600" },
  listContent: { paddingTop: 8, paddingBottom: 20, flexGrow: 1 },
  card: {
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardRow: { flexDirection: "row", justifyContent: "space-between" },
  cropName: { fontSize: 16, fontWeight: "700" },
  subText: { fontSize: 13, marginTop: 2 },
  price: { fontSize: 15, fontWeight: "700", marginBottom: 4 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-end",
  },
  badgeText: { fontSize: 12, fontWeight: "600" },
  quantityRow: { marginTop: 8, flexDirection: "row", alignItems: "center" },
  quantityText: { fontSize: 13, fontWeight: "500" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,
  },
  emptyText: { fontSize: 16, fontWeight: "500" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },
});

export default FarmerOrdersScreen;
