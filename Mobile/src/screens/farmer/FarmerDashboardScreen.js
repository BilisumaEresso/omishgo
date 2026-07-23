// src/screens/farmer/FarmerDashboardScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import AgriPriceChangeWidget from "../../components/common/AgriPriceChangeWidget";
import AppText from "../../components/common/AppText";
import MarketTrendsList from "../../components/farmer/MarketTrendsList";
import QuickActionsGrid from "../../components/farmer/QuickActionsGrid";
import DashboardLayout from "../../components/layout/DashBoardLayout";
import FloatingActionButton from "../../components/layout/FloatingActionBotton";
import SummaryCard from "../../components/SummaryCard";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useSidebar } from "../../context/SidebarContext";
import draftsService from "../../services/drafts.service";
const {
  width: SCREEN_WIDTH
} = Dimensions.get("window");
const CARD_GAP = 12;

// ---------- mock data ----------
const mockProducts = [
  // ... (unchanged)
];
const recentRatings = [
  /* ... unchanged ... */
];
const marketTrends = [{
  crop: "Tomato",
  demandChange: "+15%",
  region: "Addis Ababa",
  price: "3,800 ETB",
  trend: "up"
}, {
  crop: "White Teff",
  demandChange: "-2%",
  region: "Regional Hub",
  price: "5,200 ETB",
  trend: "down"
}, {
  crop: "Red Onion",
  demandChange: "+8%",
  region: "Adama",
  price: "4,500 ETB",
  trend: "up"
}];

// ---------- main screen ----------
export default function FarmerDashboardScreen({
  navigation,
  onSwitchTab
}) {
  const {
    t
  } = useTranslation();
  const {
    theme
  } = useTheme();
  const user = useAuthStore(state => state.user);
  const {
    openSidebar
  } = useSidebar();

  // Theme colors (unchanged)
  const primary = theme?.colors?.primary || "#2E7D32";
  const primaryCont = theme?.colors?.primaryContainer || "#E8F5E9";
  const textPrimary = theme?.colors?.textPrimary || "#1A2E1A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6741";
  const textMuted = theme?.colors?.textMuted || "#8FAF8A";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const background = theme?.colors?.background || "#F9FBF9";
  const success = theme?.colors?.success || "#2E7D32";
  const warning = theme?.colors?.warning || "#F57F17";
  const info = theme?.colors?.info || "#0277BD";
  const error = theme?.colors?.error || "#C62828";
  const [products, setProducts] = useState(mockProducts);
  const [orders, setOrders] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [draftCount, setDraftCount] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [orderError, setOrderError] = useState("");

  // Biggest price mover
  const biggestMover = marketTrends.reduce((prev, curr) => {
    const prevVal = parseFloat(prev.demandChange);
    const currVal = parseFloat(curr.demandChange);
    return Math.abs(currVal) > Math.abs(prevVal) ? curr : prev;
  });
  const trendingPrice = biggestMover.price ? parseInt(biggestMover.price.replace(/[^0-9]/g, ""), 10) : null;
  const hours = new Date().getHours();
  const greetingText = hours < 12 ? t("farmerDashboard.goodMorning") : hours < 17 ? t("farmerDashboard.goodAfternoon") : t("farmerDashboard.goodEvening");

  // Data fetching (unchanged)
  const fetchProducts = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.products.list, {
        params: {
          farmerId: user?._id || user?.id
        }
      });
      const raw = res.data?.data?.products || [];
      if (raw.length > 0) {
        setProducts(raw.map(p => ({
          id: p._id,
          name: `${p.quantity}${p.unit || "kg"} ${p.cropType}`,
          price: p.price,
          category: p.cropType,
          unit: p.unit || "kg",
          location: `${p.location?.region || ""}, Ethiopia`,
          farmerName: user?.name || "Farmer",
          image: p.photos?.[0] || "https://images.unsplash.com/photo-1618512496248-a07fe83766a4?w=600"
        })));
      }
    } catch (e) {
      console.warn("fetchProducts failed:", e.message);
      // keep mockProducts as fallback — already set as default state
    }
  };
  const fetchOrders = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.orders.list);
      const raw = res.data?.data?.orders || [];
      setOrders(raw.map(o => ({
        id: o._id,
        item: `${o.quantity}${o.unit || "kg"} ${o.productId?.cropType || "Product"}`,
        type: o.productId?.cropType || "—",
        price: o.priceAtOrder,
        totalPrice: o.totalPrice,
        date: new Date(o.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric"
        }),
        status: o.status === "in_transit" ? "In Transit" : o.status.charAt(0).toUpperCase() + o.status.slice(1),
        buyer: o.buyerId?.name || "Buyer",
        buyerId: o.buyerId?._id,
        cropType: o.productId?.cropType || "Product",
        buyerName: o.buyerId?.name || "Buyer"
      })));
    } catch (e) {
      console.warn("fetchOrders failed:", e.message);
    }
  };
  useEffect(() => {
    if (user?.id) {
      fetchProducts();
      fetchOrders();
    }
  }, [user?.id]);
  useFocusEffect(useCallback(() => {
    if (user?.id) {
      fetchProducts();
      fetchOrders();
    }
    draftsService.count().then(setDraftCount);
  }, [user?.id]));
  const todaySales = orders.filter(o => new Date(o.date) >= new Date(Date.now() - 86400000)).length;
  const activeOrders = orders.filter(o => o.status !== "Completed" && o.status !== "cancelled").length;
  const revenue = orders.filter(o => o.status === "Completed" || o.status === "Delivered").reduce((sum, o) => sum + (o.totalPrice || o.price || 0), 0);
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchProducts(), fetchOrders()]);
    setRefreshing(false);
  };

  // ---------- missing functions (unchanged) ----------
  const markOrderCompleted = orderId => {
    /* ... unchanged ... */
  };
  const markOrderPendingPickup = orderId => {
    /* ... unchanged ... */
  };
  const handleSidebarItemPress = item => {
    /* ... unchanged ... */
  };

  // Status label mapping for translation
  const statusLabelMap = {
    Pending: "farmerDashboard.statusPending",
    Confirmed: "farmerDashboard.statusConfirmed",
    "In Transit": "farmerDashboard.statusInTransit",
    Delivered: "farmerDashboard.statusDelivered",
    Completed: "farmerDashboard.statusCompleted",
    Cancelled: "farmerDashboard.statusCancelled"
  };
  return <>
      <DashboardLayout title={t("farmerDashboard.title")} subtitle={t("farmerDashboard.subtitle", {
      greeting: greetingText,
      name: user?.name || t("farmerDashboard.fallbackName")
    })} role="farmer" scrollable={true} showMenu={true} onMenuPress={() => openSidebar(true)} showNotification={true} notificationCount={0} onNotificationPress={() => navigation.navigate("Notifications")} refreshing={refreshing} onRefresh={handleRefresh} notificationMessage={successMsg} onDismissNotification={() => setSuccessMsg("")} contentPaddingHorizontal={12} navigation={navigation}>
        {/* ---- Summary KPIs ---- */}
        <View style={styles.summaryRow}>
          <SummaryCard icon="cart-outline" label={t("farmerDashboard.todaySales")} value={todaySales} color={warning} onPress={() => onSwitchTab?.("Orders")} />
          <SummaryCard icon="time-outline" label={t("farmerDashboard.activeOrders")} value={activeOrders} color={info} onPress={() => onSwitchTab?.("Orders")} />
          <SummaryCard icon="wallet-outline" label={t("farmerDashboard.revenue")} value={revenue} color={success} onPress={() => {}} />
        </View>

        {/* ---- Agri Price Change ---- */}
        <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
          <AgriPriceChangeWidget productName={biggestMover.crop} currentPrice={`${biggestMover.price}/q`} changePercent={parseFloat(biggestMover.demandChange)} changeLabel={t("farmerDashboard.demandChange")} />
        </TouchableOpacity>

        {/* ---- Quick Actions ---- */}
        <QuickActionsGrid productCount={products.length} onAddPress={() => navigation.navigate("PostProduct")} onOrdersPress={() => onSwitchTab?.("Orders")} onProductsPress={() => onSwitchTab?.("Products")} onTrainingPress={() => {}} />

        {draftCount > 0 && (
          <TouchableOpacity
            onPress={() => navigation.navigate("MyDrafts")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginTop: 10,
              padding: 12,
              borderRadius: 12,
              backgroundColor: (warning || "#F57F17") + "20",
            }}
          >
            <Ionicons name="cloud-offline-outline" size={18} color={warning} />
            <AppText style={{ flex: 1, color: warning, fontSize: 13 }}>
              {t("farmerDashboard.draftsBannerMessage", { count: draftCount })}
            </AppText>
            <Ionicons name="chevron-forward" size={16} color={warning} />
          </TouchableOpacity>
        )}

        {/* ---- Shortcut row ---- */}
        <View style={styles.shortcutRow}>
          {[{
          icon: "chatbubbles-outline",
          label: t("farmerDashboard.messages"),
          onPress: () => navigation.navigate("Conversations")
        }, {
          icon: "notifications-outline",
          label: t("farmerDashboard.alerts"),
          onPress: () => navigation.navigate("Notifications")
        }, {
          icon: "leaf-outline",
          label: t("farmerDashboard.myCrops"),
          onPress: () => onSwitchTab?.("Products")
        }].map(s => <TouchableOpacity key={s.label} style={[styles.shortcut, {
          backgroundColor: primaryCont
        }]} onPress={s.onPress} activeOpacity={0.7}>
              <View style={[styles.shortcutIcon, {
            backgroundColor: primary
          }]}>
                <Ionicons name={s.icon} size={20} color="#fff" />
              </View>
              <AppText style={{
            fontSize: 11,
            color: textPrimary,
            fontWeight: "600",
            marginTop: 6,
            textAlign: "center"
          }}>
                {s.label}
              </AppText>
            </TouchableOpacity>)}
        </View>

        {/* ---- Market Trends ---- */}
        <View style={styles.sectionHeader}>
          <AppText style={[styles.sectionTitle, {
          color: textPrimary
        }]}>
            {t("farmerDashboard.marketTrends")}
          </AppText>
          <TouchableOpacity onPress={() => {}}>
            <AppText style={[styles.seeAll, {
            color: primary
          }]}>
              {t("farmerDashboard.seeAll")}
            </AppText>
          </TouchableOpacity>
        </View>
        {/* UPDATED: onSellPress now navigates to PostProduct with prefill */}
        <MarketTrendsList trends={marketTrends} onSellPress={trendItem => {
        const priceNum = trendItem.price ? parseInt(trendItem.price.replace(/[^0-9]/g, ""), 10) : null;
        navigation.navigate("PostProduct", {
          prefill: {
            cropType: trendItem.crop,
            price: priceNum,
            unit: "kg" // you can adjust default unit
          }
        });
      }} />

        {/* ---- Recent Orders ---- */}
        <View style={styles.sectionHeader}>
          <AppText style={[styles.sectionTitle, {
          color: textPrimary
        }]}>
            {t("farmerDashboard.recentOrders")}
          </AppText>
          <TouchableOpacity onPress={() => onSwitchTab?.("Orders")}>
            <AppText style={[styles.seeAll, {
            color: primary
          }]}>
              {t("farmerDashboard.viewAll")}
            </AppText>
          </TouchableOpacity>
        </View>
        {orders.slice(0, 3).map(order => <TouchableOpacity key={order.id} onPress={() => navigation.navigate("OrderDetail", {
        order,
        role: "farmer"
      })} activeOpacity={0.8}>
            <View style={[styles.orderCard, {
          backgroundColor: surface
        }]}>
              <View style={{
            flex: 1
          }}>
                <AppText style={[styles.orderItem, {
              color: textPrimary
            }]}>
                  {order.cropType}
                </AppText>
                <AppText style={{
              color: textSecondary,
              fontSize: 12
            }}>
                  {order.buyerName} • {order.date}
                </AppText>
                <View style={styles.orderStatusRow}>
                  <View style={[styles.statusDot, {
                backgroundColor: order.status === "delivered" ? success : order.status === "confirmed" ? warning : order.status === "pending" ? info : textMuted
              }]} />
                  <AppText style={{
                fontSize: 12,
                color: textSecondary
              }}>
                    {t(statusLabelMap[order.status] || order.status)}
                  </AppText>
                </View>
              </View>

            </View>
          </TouchableOpacity>)}

        <View style={{
        height: 80
      }} />
      </DashboardLayout>

      {/* ---- FAB (prefill with biggest mover) ---- */}
      <FloatingActionButton onPress={() => navigation.navigate("PostProduct", {
      prefill: {
        cropType: biggestMover.crop,
        price: trendingPrice
      }
    })} bottom={28} />
    </>;
}
const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
    marginTop: 8
  },
  shortcutRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
    marginTop: 8
  },
  shortcut: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 16
  },
  shortcutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700"
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600"
  },
  orderCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2
    }
  },
  orderItem: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4
  },
  orderStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  orderActions: {
    flexDirection: "row",
    gap: 8
  },
  orderActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center"
  }
});