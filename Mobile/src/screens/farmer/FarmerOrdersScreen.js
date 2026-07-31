// Mobile/src/screens/farmer/FarmerOrdersScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Image,
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
import { useSidebar } from "../../context/SidebarContext";
import { useTheme } from "../../hooks/useTheme";
import { getOrderStatusConfig } from "../../constants/statuses";
import { getLocalizedCropName, getLocalizedCropDisplayName, getCropFallbackImage } from "../../constants/crops";
import { getLocalizedUnitName } from "../../constants/units";
import { formatNumber } from "../../utils/formatNumber";

export default function FarmerOrdersScreen({ navigation, onSwitchTab }) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { openSidebar } = useSidebar();

  const primary = theme?.colors?.primary || "#15803D";
  const surface = theme?.colors?.surface || "#FFFFFF";
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
        cropType: o.cropType || o.productId?.cropType || t("farmerOrders.defaultCropType", { defaultValue: "Harvest Crop" }),
        quantity: o.quantity || 0,
        unit: o.unit || "q",
        price: o.totalPrice || (o.priceAtOrder || 0) * (o.quantity || 1),
        unitPrice: o.priceAtOrder || o.price || 0,
        buyerName: o.buyerId?.name || t("orders.wholesaleBuyer", { defaultValue: "Wholesale Buyer" }),
        buyerPhone: o.buyerId?.phone || null,
        buyerId: o.buyerId?._id || o.buyerId,
        status: o.status || "pending",
        date: new Date(o.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        _raw: o,
      }));
      setOrders(normalized);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || t("farmerOrders.errorLoadOrders", { defaultValue: "Failed to load harvest orders" }));
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
      .reduce((sum, o) => sum + (o.price || 0), 0);
  }, [orders]);

  const pendingCount = useMemo(() => orders.filter((o) => o.status === "pending").length, [orders]);
  const inTransitCount = useMemo(() => orders.filter((o) => o.status === "in_transit").length, [orders]);
  const completedCount = useMemo(() => orders.filter((o) => o.status === "completed" || o.status === "delivered").length, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return orders;
    return orders.filter((o) => o.status === activeFilter);
  }, [orders, activeFilter]);

  const currentLang = i18n.language || "en";

  const renderStatusBadge = (statusKey) => {
    const config = getOrderStatusConfig(statusKey, currentLang);
    return (
      <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
        <AppText style={[styles.statusBadgeText, { color: config.color }]}>
          {config.displayLabel}
        </AppText>
      </View>
    );
  };

  const renderOrderCard = ({ item }) => {
    const shortId = item.id ? item.id.substring(item.id.length - 6).toUpperCase() : "ORD";

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.card, { backgroundColor: surface }]}
        onPress={() => navigation?.navigate("OrderDetail", { order: item._raw, role: "farmer" })}
      >
        {/* Header Row: Ref ID + Status */}
        <View style={styles.cardHeaderRow}>
          <View style={styles.refWrap}>
            <Ionicons name="receipt" size={16} color={primary} />
            <AppText style={styles.refText}>#ORD-{shortId}</AppText>
          </View>
          {renderStatusBadge(item.status)}
        </View>

        {/* Main Crop Specs & Price */}
        <View style={styles.mainSpecRow}>
          {(() => {
            const rawPhotoUrl = item._raw?.productId?.photos?.[0];
            const photoUrl = rawPhotoUrl || getCropFallbackImage(item.cropType);
            return (
              <Image source={{ uri: photoUrl }} style={styles.orderThumbImage} resizeMode="cover" />
            );
          })()}
          <View style={{ flex: 1 }}>
            <AppText style={[styles.cropTitle, { color: textPrimary }]}>
              {getLocalizedCropName(item.cropType, currentLang, t)}
            </AppText>
            <AppText style={styles.volumeText}>
              {t("orders.quantityLabel", { defaultValue: "Quantity:" })} <AppText style={styles.boldText}>{item.quantity} {getLocalizedUnitName(item.unit, currentLang, t)}</AppText>
            </AppText>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <AppText style={[styles.priceText, { color: primary }]}>
              ETB {formatNumber(item.price)}
            </AppText>
            <AppText style={styles.dateText}>{item.date}</AppText>
          </View>
        </View>

        {/* Partner Info Row */}
        <View style={styles.partnerRow}>
          <View style={styles.avatarBg}>
            <Ionicons name="person" size={14} color="#15803D" />
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={styles.buyerLabel}>{t("orders.wholesaleBuyer", { defaultValue: "Wholesale Buyer" })}</AppText>
            <AppText style={styles.buyerName}>{item.buyerName}</AppText>
          </View>
        </View>

        {/* Action Buttons Row */}
        <View style={styles.actionRow}>
          {item.buyerId && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.chatBtn]}
              onPress={() => navigation?.navigate("Chat", { userId: item.buyerId, userName: item.buyerName })}
              activeOpacity={0.8}
            >
              <Ionicons name="chatbubble-ellipses" size={14} color="#15803D" />
              <AppText style={styles.chatBtnText}>{t("orders.messageBuyer", { defaultValue: "Message Buyer" })}</AppText>
            </TouchableOpacity>
          )}

          {item.buyerPhone && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.callBtn]}
              onPress={() => Linking.openURL(`tel:${item.buyerPhone}`)}
              activeOpacity={0.8}
            >
              <Ionicons name="call" size={14} color="#2563EB" />
              <AppText style={styles.callBtnText}>{t("orders.callBuyer", { defaultValue: "Call Buyer" })}</AppText>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const filterTabs = [
    { id: "all", label: t("farmerOrders.filterAllCount", { count: orders.length, defaultValue: "All ({{count}})" }) },
    { id: "pending", label: t("farmerOrders.filterPendingCount", { count: pendingCount, defaultValue: "Pending ({{count}})" }) },
    { id: "in_transit", label: t("farmerOrders.filterInTransitCount", { count: inTransitCount, defaultValue: "In Transit ({{count}})" }) },
    { id: "completed", label: t("farmerOrders.filterDeliveredCount", { count: completedCount, defaultValue: "Delivered ({{count}})" }) },
  ];

  return (
    <DashboardLayout
      title={t("farmerOrders.title", { defaultValue: "Harvest Sales Orders" })}
      subtitle={t("orders.trackFulfillment", { defaultValue: "Track buyer purchase orders & fulfillment" })}
      role="farmer"
      showMenu
      onMenuPress={openSidebar}
      showNotification
      notificationCount={0}
      onNotificationPress={() => navigation.navigate("Notifications")}
      refreshing={refreshing}
      onRefresh={() => fetchOrders(true)}
      scrollable
      contentPaddingHorizontal={14}
      navigation={navigation}
    >
      {/* 1. Orders Hero Summary Card */}
      <OrdersHeroSummaryCard
        totalValue={totalActiveValue}
        activeCount={activeOrdersCount}
        role="farmer"
        currency="ETB"
      />

      {/* 2. Orders Metrics Bar */}
      <OrdersMetricsBar
        pendingCount={pendingCount}
        inTransitCount={inTransitCount}
        completedCount={completedCount}
      />

      {/* 3. Status Filter Pills */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.filterPill,
                  isActive ? { backgroundColor: primary } : { backgroundColor: "#F1F5F9" },
                ]}
                onPress={() => setActiveFilter(tab.id)}
                activeOpacity={0.8}
              >
                <AppText
                  style={[
                    styles.filterPillText,
                    isActive ? { color: "#FFFFFF" } : { color: textSecondary },
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
          <ActivityIndicator size="large" color={primary} />
        </View>
      ) : filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={44} color="#94A3B8" />
          <AppText style={styles.emptyTitle}>{t("orders.noSalesOrdersFound", { defaultValue: "No Sales Orders Found" })}</AppText>
          <AppText style={styles.emptySub}>
            {t("orders.emptyFarmerSub", { defaultValue: "New buyer purchase requests will appear here for confirm and dispatch." })}
          </AppText>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderCard}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={{ height: 80 }} />
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    marginRight: 8,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: "700",
  },
  centerLoading: {
    paddingVertical: 40,
    alignItems: "center",
  },
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
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
    gap: 10,
  },
  orderThumbImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
  },
  orderThumbFallback: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },
  buyerLabel: {
    fontSize: 10.5,
    color: "#94A3B8",
    fontWeight: "600",
  },
  buyerName: {
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
    backgroundColor: "#DCFCE7",
  },
  chatBtnText: {
    color: "#15803D",
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
    alignItems: "center",
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  emptySub: {
    fontSize: 12.5,
    color: "#64748B",
    textAlign: "center",
  },
});
