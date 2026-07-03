// src/screens/farmer/FarmerDashboardScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import AgriPriceChangeWidget from "../../components/common/AgriPriceChangeWidget";
import AppButton from "../../components/common/AppButton";
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

// ---------- helper hook: animated number ----------
const useAnimatedNumber = (target, duration = 800) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    }).start();
  }, [target]);
  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, target],
  });
};

// ---------- main screen ----------
export default function FarmerDashboardScreen({ navigation, route }) {
  const { theme } = useTheme();
  const user = useAuthStore((state) => state.user);
  const primaryColor = theme.colors.primary || "#4CAF50";
  const textPrimary = theme.colors.textPrimary || "#333";
  const textSecondary = theme.colors.textSecondary || "#666";
  const cardBg = theme.colors.card || "#fff";

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

  // Success message from route params
  useEffect(() => {
    if (route?.params?.successMessage) {
      setSuccessMsg(route.params.successMessage);
      const timer = setTimeout(() => setSuccessMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [route?.params?.successMessage]);

  const fetchProducts = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.products.list);
      // Filter products on the client side to show only those belonging to the logged-in farmer
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

  // Pull‑to‑refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const safeNavigate = (screenName, params = {}) => {
    try {
      navigation.navigate(screenName, params);
    } catch (err) {
      console.warn(`Screen "${screenName}" not yet built.`);
    }
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

  // Order actions
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
    if (item.route === "Logout") {
      navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
    } else if (item.route) {
      navigation.navigate(item.route);
    }
  };

  return (
    <>
      <DashboardLayout
        title="Farmer Dashboard"
        subtitle={`${greeting}, ${user?.name || ""}!`}
        role="farmer"
        activeTab="Home"
        onTabPress={(tab) => console.log(tab)}
        scrollable={true}
        showMenu={true}
        onMenuPress={() => setSidebarVisible(true)}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        notificationMessage={successMsg}
        onDismissNotification={() => setSuccessMsg("")}
        contentPaddingHorizontal={12} // tight, space‑efficient padding
      >
        {/* ---- Summary KPIs ---- */}
        <View style={styles.summaryRow}>
          <SummaryCard
            icon="cart-outline"
            label="Today's Sales"
            value={todaySales}
            color="#FF9800"
            onPress={() => safeNavigate("FarmerOrders")}
          />
          <SummaryCard
            icon="time-outline"
            label="Active Orders"
            value={activeOrders}
            color="#2196F3"
            onPress={() => safeNavigate("FarmerOrders")}
          />
          <SummaryCard
            icon="wallet-outline"
            label="Revenue"
            value={revenue}
            prefix="ETB "
            color="#4CAF50"
            onPress={() => safeNavigate("FarmerFinance")}
          />
        </View>

        {/* ---- Agri Price Change (tappable) ---- */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            safeNavigate("MarketDetails", { crop: biggestMover.crop })
          }
        >
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
          onOrdersPress={() => safeNavigate("FarmerOrders")}
          onTrainingPress={() => safeNavigate("FarmerTraining")}
        />

        {/* Messages shortcut */}
        <AppButton
          title="🔔 Messages"
          variant="outline"
          fullWidth
          onPress={() => navigation.navigate("Conversations")}
          style={{ marginTop: 16, marginBottom: 16 }}
        />

        {/* ---- Market Trends with "See All" ---- */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Market Trends
          </Text>
          <TouchableOpacity onPress={() => safeNavigate("MarketTrendsFull")}>
            <Text style={[styles.seeAll, { color: primaryColor }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        <MarketTrendsList
          trends={marketTrends}
          onSellPress={(crop) => console.log("Sell", crop)}
        />

        {/* ---- Recent Orders with inline actions ---- */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Recent Orders
          </Text>
          <TouchableOpacity onPress={() => safeNavigate("FarmerOrders")}>
            <Text style={[styles.seeAll, { color: primaryColor }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        {orders.slice(0, 3).map((order) => (
          <View
            key={order.id}
            style={[styles.orderCard, { backgroundColor: cardBg }]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.orderItem, { color: textPrimary }]}>
                {order.item}
              </Text>
              <Text style={{ color: textSecondary, fontSize: 12 }}>
                {order.buyer} • {order.date}
              </Text>
              <View style={styles.orderStatusRow}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        order.status === "Completed"
                          ? "#4CAF50"
                          : order.status === "Processing"
                            ? "#FF9800"
                            : "#2196F3",
                    },
                  ]}
                />
                <Text style={{ fontSize: 12, color: textSecondary }}>
                  {order.status}
                </Text>
              </View>
            </View>
            <View style={styles.orderActions}>
              {order.status !== "Completed" && (
                <TouchableOpacity
                  style={[
                    styles.orderActionBtn,
                    { backgroundColor: "#4CAF50" },
                  ]}
                  onPress={() => markOrderCompleted(order.id)}
                >
                  <Ionicons name="checkmark" size={18} color="#fff" />
                </TouchableOpacity>
              )}
              {order.status !== "Pending Pickup" && (
                <TouchableOpacity
                  style={[
                    styles.orderActionBtn,
                    { backgroundColor: "#2196F3" },
                  ]}
                  onPress={() => markOrderPendingPickup(order.id)}
                >
                  <Ionicons name="bicycle" size={18} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {/* Bottom spacer to prevent FAB overlap */}
        <View style={{ height: 80 }} />
      </DashboardLayout>

      {/* ---- Floating Action Button ---- */}
      <FloatingActionButton
        onPress={() => navigation.navigate("PostProduct")}
        bottom={150} // lifts it above the bottom tab bar
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
    gap: 12, // ← this is the breathing room you need
    marginBottom: 16,
    marginTop: 8,
  },
  summaryCard: {
    width: (SCREEN_WIDTH - 24 - CARD_GAP * 2) / 3, // 12px padding each side + 12px gap
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
  },
  summaryIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  summaryPrefix: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  summarySuffix: {
    fontSize: 12,
    color: "#888",
    marginLeft: 2,
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
  fab: {
    position: "absolute",
    right: 20,
    bottom: 90, // above bottom tab bar
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
