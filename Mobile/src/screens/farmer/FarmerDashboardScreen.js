// src/screens/farmer/FarmerDashboardScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import AgriPriceChangeWidget from "../../components/common/AgriPriceChangeWidget";
import AppText from "../../components/common/AppText";
import AddProductModal from "../../components/farmer/AddProductModal";
import MarketTrendsList from "../../components/farmer/MarketTrendsList";
import QuickActionsGrid from "../../components/farmer/QuickActionsGrid";
import AppSidebar from "../../components/layout/AppSidebar";
import DashboardLayout from "../../components/layout/DashBoardLayout";
import FloatingActionButton from "../../components/layout/FloatingActionBotton";
import SummaryCard from "../../components/SummaryCard";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_GAP = 12;

// ---------- mock data (unchanged) ----------
const mockProducts = [
  {
    id: "p1",
    name: "50kg Red Onion",
    price: 4500,
    category: "Onion",
    unit: "bag (50kg)",
    location: "Adama, Ethiopia",
    farmerName: "Farmer Bekele",
    farmerAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83766a4?w=600",
  },
  {
    id: "p2",
    name: "100kg White Teff",
    price: 5200,
    category: "Teff",
    unit: "100kg",
    location: "Debre Zeit, Ethiopia",
    farmerName: "Farmer Bekele",
    farmerAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600",
  },
  {
    id: "p3",
    name: "50kg Tomato",
    price: 3800,
    category: "Tomato",
    unit: "bag (50kg)",
    location: "Ziway, Ethiopia",
    farmerName: "Farmer Bekele",
    farmerAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600",
  },
];

const mockOrders = [
  {
    id: "ORD-8492",
    item: "50kg Red Onion",
    type: "Onion",
    price: 4500,
    date: "2025-04-15",
    status: "Pending Pickup",
    buyer: "Hana Alene",
  },
  {
    id: "ORD-8488",
    item: "100kg White Teff",
    type: "Teff",
    price: 5200,
    date: "2025-04-14",
    status: "Completed",
    buyer: "Mulugeta Desta",
  },
  {
    id: "ORD-8501",
    item: "50kg Tomato",
    type: "Tomato",
    price: 3800,
    date: "2025-04-16",
    status: "Processing",
    buyer: "Selam Tesfaye",
  },
];

const marketTrends = [
  {
    crop: "Tomato",
    demandChange: "+15%",
    region: "Addis Ababa",
    price: "3,800 ETB",
    trend: "up",
  },
  {
    crop: "White Teff",
    demandChange: "-2%",
    region: "Regional Hub",
    price: "5,200 ETB",
    trend: "down",
  },
  {
    crop: "Red Onion",
    demandChange: "+8%",
    region: "Adama",
    price: "4,500 ETB",
    trend: "up",
  },
];

// ---------- main screen ----------
export default function FarmerDashboardScreen({ navigation, onSwitchTab }) {
  const { theme } = useTheme();
  const user = useAuthStore((state) => state.user);

  // Extract all theme colors with fallbacks
  const primary = theme?.colors?.primary || "#2E7D32";
  const primaryLight = theme?.colors?.primaryLight || "#66BB6A";
  const primaryCont = theme?.colors?.primaryContainer || "#E8F5E9";
  const secondary = theme?.colors?.secondary || "#F57F17";
  const textPrimary = theme?.colors?.textPrimary || "#1A2E1A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6741";
  const textMuted = theme?.colors?.textMuted || "#8FAF8A";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const background = theme?.colors?.background || "#F9FBF9";
  const border = theme?.colors?.border || "#D0E8CE";
  const success = theme?.colors?.success || "#2E7D32";
  const warning = theme?.colors?.warning || "#F57F17";
  const info = theme?.colors?.info || "#0277BD";
  const error = theme?.colors?.error || "#C62828";

  const [products, setProducts] = useState(mockProducts);
  const [orders, setOrders] = useState(mockOrders);
  const [modalVisible, setModalVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Dynamic biggest price mover
  const biggestMover = marketTrends.reduce((prev, curr) => {
    const prevVal = parseFloat(prev.demandChange);
    const currVal = parseFloat(curr.demandChange);
    return Math.abs(currVal) > Math.abs(prevVal) ? curr : prev;
  });

  // Fake KPIs (replace with real data later)
  const todaySales = 12;
  const activeOrders = orders.filter((o) => o.status !== "Completed").length;
  const revenue = 47800; // ETB

  // Time‑based greeting
  const hours = new Date().getHours();
  const greeting =
    hours < 12
      ? "Good morning"
      : hours < 17
        ? "Good afternoon"
        : "Good evening";

  const fetchProducts = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.products.list);
      const farmerProducts = (res.data?.data?.products || []).filter(
        (p) => (p.farmerId?._id || p.farmerId) === user?.id,
      );
      setProducts(farmerProducts);
    } catch (e) {
      console.warn("Failed to load farmer products:", e.message);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchProducts();
    }
  }, [user?.id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const handleAddProduct = (newProduct) => {
    const product = {
      id: Date.now().toString(),
      name: `50kg ${newProduct.name}`,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      unit: newProduct.unit,
      location: "Adama, Ethiopia",
      farmerName: "Farmer Bekele",
      farmerAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      image:
        newProduct.category === "Tomato"
          ? "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600"
          : newProduct.category === "Teff"
            ? "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600"
            : "https://images.unsplash.com/photo-1618512496248-a07fe83766a4?w=600",
    };
    setProducts([product, ...products]);
  };

  const markOrderCompleted = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Completed" } : o)),
    );
  };

  const markOrderPendingPickup = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "Pending Pickup" } : o,
      ),
    );
  };

  const handleSidebarItemPress = (item) => {
    setSidebarVisible(false);
    if (item.route === "Logout") return;
    const TAB_MAP = {
      FarmerProducts: "Products",
      FarmerOrders: "Orders",
      FarmerAnalytics: "Insights",
      Profile: "Profile",
      Home: "Home",
    };
    const STACK_ROUTES = ["PostProduct", "Conversations", "Chat", "Help"];
    if (item.route === "Home") {
      onSwitchTab?.("Home");
    } else if (TAB_MAP[item.route]) {
      onSwitchTab?.(TAB_MAP[item.route]);
    } else if (STACK_ROUTES.includes(item.route)) {
      navigation.navigate(item.route);
    }
  };

  return (
    <>
      <DashboardLayout
        title="Farmer Dashboard"
        subtitle={`${greeting}, ${user?.name || "Farmer"}!`}
        role="farmer"
        scrollable={true}
        showMenu={true}
        onMenuPress={() => setSidebarVisible(true)}
        showNotification={true}
        notificationCount={0}
        onNotificationPress={() => navigation.navigate("Notifications")}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        notificationMessage={successMsg}
        onDismissNotification={() => setSuccessMsg("")}
        contentPaddingHorizontal={12}
      >
        {/* ---- Summary KPIs ---- */}
        <View style={styles.summaryRow}>
          <SummaryCard
            icon="cart-outline"
            label="Today's Sales"
            value={todaySales}
            color={warning}
            onPress={() => onSwitchTab?.("Orders")}
          />
          <SummaryCard
            icon="time-outline"
            label="Active Orders"
            value={activeOrders}
            color={info}
            onPress={() => onSwitchTab?.("Orders")}
          />
          <SummaryCard
            icon="wallet-outline"
            label="Revenue"
            value={revenue}
            prefix="ETB "
            color={success}
            onPress={() => {}}
          />
        </View>

        {/* ---- Agri Price Change ---- */}
        <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
          <AgriPriceChangeWidget
            productName={biggestMover.crop}
            currentPrice={`${biggestMover.price}/q`}
            changePercent={parseFloat(biggestMover.demandChange)}
            changeLabel="Demand Change"
          />
        </TouchableOpacity>

        {/* ---- Quick Actions ---- */}
        <QuickActionsGrid
          productCount={products.length}
          onAddPress={() => navigation.navigate("PostProduct")}
          onOrdersPress={() => onSwitchTab?.("Orders")}
          onProductsPress={() => onSwitchTab?.("Products")}
          onTrainingPress={() => {}}
        />

        {/* ---- Shortcut row (replaces Messages AppButton) ---- */}
        <View style={styles.shortcutRow}>
          {[
            {
              icon: "chatbubbles-outline",
              label: "Messages",
              onPress: () => navigation.navigate("Conversations"),
            },
            {
              icon: "notifications-outline",
              label: "Alerts",
              onPress: () => navigation.navigate("Notifications"),
            },
            {
              icon: "leaf-outline",
              label: "My Crops",
              onPress: () => onSwitchTab?.("Products"),
            },
          ].map((s) => (
            <TouchableOpacity
              key={s.label}
              style={[styles.shortcut, { backgroundColor: primaryCont }]}
              onPress={s.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.shortcutIcon, { backgroundColor: primary }]}>
                <Ionicons name={s.icon} size={20} color="#fff" />
              </View>
              <AppText
                style={{
                  fontSize: 11,
                  color: textPrimary,
                  fontWeight: "600",
                  marginTop: 6,
                  textAlign: "center",
                }}
              >
                {s.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        {/* ---- Market Trends ---- */}
        <View style={styles.sectionHeader}>
          <AppText style={[styles.sectionTitle, { color: textPrimary }]}>
            Market Trends
          </AppText>
          <TouchableOpacity onPress={() => {}}>
            <AppText style={[styles.seeAll, { color: primary }]}>
              See All
            </AppText>
          </TouchableOpacity>
        </View>
        <MarketTrendsList
          trends={marketTrends}
          onSellPress={(crop) => console.log("Sell", crop)}
        />

        {/* ---- Recent Orders ---- */}
        <View style={styles.sectionHeader}>
          <AppText style={[styles.sectionTitle, { color: textPrimary }]}>
            Recent Orders
          </AppText>
          <TouchableOpacity onPress={() => onSwitchTab?.("Orders")}>
            <AppText style={[styles.seeAll, { color: primary }]}>
              View All
            </AppText>
          </TouchableOpacity>
        </View>
        {orders.slice(0, 3).map((order) => (
          <TouchableOpacity
            key={order.id}
            onPress={() =>
              navigation.navigate("OrderDetail", { order, role: "farmer" })
            }
            activeOpacity={0.8}
          >
            <View style={[styles.orderCard, { backgroundColor: surface }]}>
              <View style={{ flex: 1 }}>
                <AppText style={[styles.orderItem, { color: textPrimary }]}>
                  {order.item}
                </AppText>
                <AppText style={{ color: textSecondary, fontSize: 12 }}>
                  {order.buyer} • {order.date}
                </AppText>
                <View style={styles.orderStatusRow}>
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor:
                          order.status === "Completed"
                            ? success
                            : order.status === "Processing"
                              ? warning
                              : order.status === "Pending Pickup"
                                ? info
                                : textMuted,
                      },
                    ]}
                  />
                  <AppText style={{ fontSize: 12, color: textSecondary }}>
                    {order.status}
                  </AppText>
                </View>
              </View>
              <View style={styles.orderActions}>
                {order.status !== "Completed" && (
                  <TouchableOpacity
                    style={[
                      styles.orderActionBtn,
                      { backgroundColor: success },
                    ]}
                    onPress={() => markOrderCompleted(order.id)}
                  >
                    <Ionicons name="checkmark" size={18} color="#fff" />
                  </TouchableOpacity>
                )}
                {order.status !== "Pending Pickup" && (
                  <TouchableOpacity
                    style={[styles.orderActionBtn, { backgroundColor: info }]}
                    onPress={() => markOrderPendingPickup(order.id)}
                  >
                    <Ionicons name="bicycle" size={18} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Bottom spacer */}
        <View style={{ height: 80 }} />
      </DashboardLayout>

      {/* ---- Floating Action Button ---- */}
      <FloatingActionButton
        onPress={() => navigation.navigate("PostProduct")}
        bottom={28}
      />

      {/* ---- Sidebar & Modal ---- */}
      <AppSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        role="farmer"
        onItemPress={handleSidebarItemPress}
      />

      <AddProductModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddProduct}
      />
    </>
  );
}

// ---------- styles ----------
const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
    marginTop: 8,
  },
  shortcutRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
    marginTop: 8,
  },
  shortcut: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 16,
  },
  shortcutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
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
    shadowOffset: { width: 0, height: 2 },
  },
  orderItem: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  orderStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  orderActions: {
    flexDirection: "row",
    gap: 8,
  },
  orderActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
