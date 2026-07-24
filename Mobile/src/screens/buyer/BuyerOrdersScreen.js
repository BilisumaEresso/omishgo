// Mobile/src/screens/buyer/BuyerOrdersScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useMemo, useState } from "react";
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
import { useTranslation } from "react-i18next";
import AppText from "../../components/common/AppText";
import AppButton from "../../components/common/AppButton";
import AppHeader from "../../components/layout/AppHeader";
import { useSidebar } from "../../context/SidebarContext";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";

const BuyerOrdersScreen = ({ navigation, onSwitchTab }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState(t("buyerOrders.filterAll"));
  const { openSidebar } = useSidebar();

  // Translated filter tabs
  const filterTabs = useMemo(
    () => [
      t("buyerOrders.filterAll"),
      t("buyerOrders.filterPending"),
      t("buyerOrders.filterConfirmed"),
      t("buyerOrders.filterDelivered"),
      t("buyerOrders.filterCancelled"),
    ],
    [t],
  );

  // Translated status labels
  const statusLabel = useMemo(
    () => ({
      pending: t("buyerOrders.statusPending"),
      confirmed: t("buyerOrders.statusConfirmed"),
      in_transit: t("buyerOrders.statusInTransit"),
      delivered: t("buyerOrders.statusDelivered"),
      cancelled: t("buyerOrders.statusCancelled"),
    }),
    [t],
  );

  // Extract theme colors with fallbacks
  const primary = theme?.colors?.primary || "#1565C0";
  const textPrimary = theme?.colors?.textPrimary || "#0D1B2A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6080";
  const background = theme?.colors?.background || "#F5F8FF";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#D0DEF5";
  const success = theme?.colors?.success || "#2E7D32";
  const info = theme?.colors?.info || "#1565C0";
  const warning = theme?.colors?.warning || "#EF6C00";
  const errorColor = theme?.colors?.error || "#C62828";
  const textMuted = theme?.colors?.textMuted || "#8FA3BE";

  const fetchOrders = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const res = await api.get(API_ENDPOINTS.orders.list);
      const raw = res.data?.data?.orders || [];
      // Normalize for display
      const normalized = raw.map((o) => ({
        id: o._id,
        cropType: o.cropType,
        quantity: o.quantity,
        unit: o.unit || t("buyerOrders.unitKg"),
        totalPrice: o.totalPrice,
        farmerName: o.farmerId?.name || t("buyerOrders.unknownFarmer"),
        farmerId: o.farmerId?._id,
        status: statusLabel[o.status] || o.status,
        rawStatus: o.status,
        orderedDate: new Date(o.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        _raw: o,
      }));
      setOrders(normalized);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          t("buyerOrders.errorLoadOrders"),
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, []),
  );

  // Status badge colors
  const getStatusColor = (status) => {
    switch (status) {
      case t("buyerOrders.statusPending"):
        return { bg: warning + "18", text: warning };
      case t("buyerOrders.statusConfirmed"):
        return { bg: info + "18", text: info };
      case t("buyerOrders.statusInTransit"):
        return { bg: primary + "18", text: primary };
      case t("buyerOrders.statusDelivered"):
        return { bg: success + "18", text: success };
      case t("buyerOrders.statusCancelled"):
        return { bg: errorColor + "18", text: errorColor };
      default:
        return { bg: textMuted + "18", text: textMuted };
    }
  };

  const filteredOrders =
    activeFilter === t("buyerOrders.filterAll")
      ? orders
      : orders.filter((o) => o.status === activeFilter);

  const renderOrderCard = ({ item }) => {
    const statusColors = getStatusColor(item.status);
    const isActive =
      item.rawStatus === "pending" ||
      item.rawStatus === "confirmed" ||
      item.rawStatus === "in_transit";

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation?.navigate("OrderDetail", {
            order: item._raw,
            role: "buyer",
          })
        }
      >
        <View style={[styles.card, { backgroundColor: surface }]}>
          <View style={styles.cardRow}>
            {/* Crop info */}
            <View style={{ flex: 1 }}>
              <AppText style={[styles.cropName, { color: textPrimary }]}>
                {item.cropType}{" "}
                <AppText
                  style={{
                    fontWeight: "400",
                    fontSize: 14,
                    color: textSecondary,
                  }}
                >
                  ({item.quantity} {item.unit})
                </AppText>
              </AppText>
              <AppText style={[styles.subText, { color: textSecondary }]}>
                {item.farmerName} • {item.orderedDate}
              </AppText>
            </View>

            {/* Price and badge */}
            <View style={{ alignItems: "flex-end" }}>
              <AppText style={[styles.price, { color: primary }]}>
                {item.totalPrice?.toLocaleString()}
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

          {/* Message button for active orders */}
          {isActive && (
            <TouchableOpacity
              style={[styles.messageButton, { borderColor: primary }]}
              onPress={() =>
                navigation?.navigate("Chat", {
                  userId: item.farmerId,
                  userName: item.farmerName,
                })
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name="chatbubble-outline"
                size={14}
                color={primary}
                style={{ marginRight: 6 }}
              />
              <AppText style={[styles.messageButtonText, { color: primary }]}>
                {t("buyerOrders.messageFarmer")}
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="cube-outline"
        size={48}
        color={textSecondary}
        style={{ marginBottom: 12 }}
      />
      <AppText style={[styles.emptyText, { color: textSecondary }]}>
        {activeFilter === t("buyerOrders.filterAll")
          ? t("buyerOrders.emptyNoOrders")
          : t("buyerOrders.emptyNoFilterOrders", {
              filter: activeFilter.toLowerCase(),
            })}
      </AppText>
      {activeFilter === t("buyerOrders.filterAll") && (
        <TouchableOpacity
          onPress={() => onSwitchTab?.("Marketplace")}
          style={[styles.browseBtn, { backgroundColor: primary }]}
        >
          <AppText style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
            {t("buyerOrders.browseMarketplace")}
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: background }]}>
      <AppHeader
        title={t("buyerOrders.title")}
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
          {filterTabs.map((tab) => {
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
                    {
                      color: isActive ? surface : textSecondary,
                    },
                  ]}
                >
                  {tab}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Loading state */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <AppText style={{ color: errorColor, marginBottom: 12 }}>
            {error}
          </AppText>
          <AppButton
            title={t("buyerOrders.retry")}
            onPress={() => fetchOrders()}
          />
        </View>
      ) : (
        /* Orders list */
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
  screen: {
    flex: 1,
  },
  filterContainer: {
    paddingVertical: 12,
    paddingLeft: 16,
  },
  filterScroll: {
    paddingRight: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 20,
    flexGrow: 1,
  },
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
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cropName: {
    fontSize: 16,
    fontWeight: "700",
  },
  subText: {
    fontSize: 13,
    marginTop: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  messageButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  messageButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  browseBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 4,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
});

export default BuyerOrdersScreen;
