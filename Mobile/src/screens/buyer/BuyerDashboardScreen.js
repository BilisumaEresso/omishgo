// src/screens/buyer/BuyerDashboardScreen.js
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import BuyerQuickActions from "../../components/buyer/BuyerQuickActions";
import CategoryFilters from "../../components/buyer/CategoryFilters";
import FeaturedProductsList from "../../components/buyer/FeaturedProductsList";
import NearbyFarmersList from "../../components/buyer/NearbyFarmersList";
import PriceTrendWidget from "../../components/buyer/PriceTrendWidget";
import RecentActivityList from "../../components/buyer/RecentActivityList";
import AgriPriceChangeWidget from "../../components/common/AgriPriceChangeWidget";
import AppText from "../../components/common/AppText";
import DashboardLayout from "../../components/layout/DashBoardLayout";
import FloatingActionButton from "../../components/layout/FloatingActionBotton";
import SummaryCard from "../../components/SummaryCard";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useSidebar } from "../../context/SidebarContext"; // reuse the existing component
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_GAP = 12;

// Mock data (shape matches ProductCard / backend)
const mockProducts = [
  {
    _id: "p1",
    cropType: "Red Onion",
    quantity: 50,
    unit: "kg",
    price: 4500,
    category: "Onion",
    farmerId: { _id: "f1", name: "Farmer Bekele" },
    location: { region: "Adama" },
    photos: [
      "https://images.unsplash.com/photo-1618512496248-a07fe83766a4?w=600",
    ],
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "p2",
    cropType: "White Teff",
    quantity: 100,
    unit: "kg",
    price: 5200,
    category: "Teff",
    farmerId: { _id: "f2", name: "Farmer Alemitu" },
    location: { region: "Debre Zeit" },
    photos: [
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600",
    ],
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "p3",
    cropType: "Tomato",
    quantity: 50,
    unit: "kg",
    price: 3800,
    category: "Tomato",
    farmerId: { _id: "f3", name: "Farmer Tadese" },
    location: { region: "Ziway" },
    photos: [
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600",
    ],
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "p4",
    cropType: "Garlic",
    quantity: 5,
    unit: "kg",
    price: 1200,
    category: "Garlic",
    farmerId: { _id: "f4", name: "Farmer Genet" },
    location: { region: "Bishoftu" },
    photos: [
      "https://images.unsplash.com/photo-1618512496248-a07fe83766a4?w=600",
    ],
    status: "active",
    createdAt: new Date().toISOString(),
  },
];

const mockFarmers = [
  {
    _id: "f1",
    name: "Farmer Bekele",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    distance: "2.3 km",
    rating: "4.8",
    location: { region: "Adama" },
  },
  {
    _id: "f2",
    name: "Farmer Alemitu",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    distance: "5.1 km",
    rating: "4.9",
    location: { region: "Debre Zeit" },
  },
];

const mockActivities = [
  {
    id: "a1",
    type: "order",
    title: "Order ORD-8492",
    description: "50kg Red Onion placed successfully.",
    time: "2 hours ago",
    order: { _id: "ord1", cropType: "Red Onion", quantity: 50 },
  },
  {
    id: "a2",
    type: "message",
    title: "Farmer Bekele replied",
    description: "Your order will be ready tomorrow.",
    time: "5 hours ago",
    farmerId: "f1",
  },
];

const categories = ["All", "Tomato", "Teff", "Onion", "Garlic"];

export default function BuyerDashboardScreen({ navigation, onSwitchTab }) {
  const { theme } = useTheme();
  const user = useAuthStore((state) => state.user);

  const { openSidebar } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [products, setProducts] = useState(mockProducts);
  const [farmers, setFarmers] = useState(mockFarmers);
  const [activities, setActivities] = useState(mockActivities);
  const [refreshing, setRefreshing] = useState(false);

  // KPI data
  const activeOrders = 2;
  const savedItems = 5;

  const primaryColor = theme?.colors?.primary || "#2E7DFF";
  const textPrimary = theme?.colors?.textPrimary || "#1C2430";

  useEffect(() => {
    const fetchRealProducts = async () => {
      try {
        const res = await api.get(API_ENDPOINTS.products.list);
        const fetched = res.data?.data?.products || [];
        if (fetched.length > 0) {
          const formatted = fetched.map((p) => ({
            _id: p._id,
            cropType: p.cropType || p.category || "Produce",
            quantity: p.quantity ?? 0,
            unit: p.unit || "kg",
            price: p.price,
            category: p.cropType || p.category,
            farmerId: p.farmerId || { _id: p.farmerId, name: "Farmer" },
            location: p.location || {},
            photos: p.photos || [],
            status: p.status || "active",
            createdAt: p.createdAt,
            description: p.description,
          }));
          setProducts(formatted);
          // Derive nearby farmers from products (unique by id)
          const byId = {};
          formatted.forEach((p) => {
            const f = p.farmerId || {};
            const fid = f._id || f;
            if (!fid) return;
            if (!byId[fid]) {
              byId[fid] = {
                _id: fid,
                name: f.name || p.farmerName || "Farmer",
                avatar: f.avatar || null,
                distance: p.distance || "",
                location: p.location || {},
                rating: f.rating || "",
              };
            }
          });
          setFarmers(Object.values(byId).slice(0, 4));
        }
      } catch (err) {
        console.warn("Using mock products:", err.message);
      }
    };
    fetchRealProducts();

    // Fetch recent activities for the current user
    const fetchActivities = async () => {
      try {
        const res = await api.get(API_ENDPOINTS.users.activities);
        const fetched = res.data?.data?.activities || [];
        // Normalize to frontend shape: ensure `order` field exists when type === 'order'
        const normalized = fetched.map((a) => ({
          id: a.id || a._id,
          type: a.type,
          title: a.title,
          description: a.description,
          time: a.time,
          order: a._raw || a.order || null,
          farmerId: a.farmerId || null,
        }));
        setActivities(normalized);
      } catch (err) {
        console.warn("Failed to load activities:", err.message);
      }
    };
    fetchActivities();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handlePlaceOrder = (product) => {
    setCartCount((prev) => prev + 1);
    setSuccessMsg(`Added ${product.cropType || product.name} to your cart!`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleViewProduct = (product) => {
    navigation?.navigate("ListingDetail", { product });
  };

  const handleFarmerPress = (farmer) => {
    const farmerId = farmer._id || farmer.id || farmer.farmerId || null;
    if (farmerId) navigation?.navigate("FarmerProfile", { farmerId });
  };

  const handleActivityPress = (activity) => {
    if (activity.type === "order") {
      const order = activity.order || activity._raw || null;
      if (order) navigation?.navigate("OrderDetail", { order, role: "buyer" });
      return;
    }
    // message or other types may reference a farmer id
    const fid =
      activity.farmerId || activity.farmerId?._id || activity.farmerId;
    if (fid) navigation?.navigate("FarmerProfile", { farmerId: fid });
  };

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = q
      ? (p.cropType || "").toLowerCase().includes(q) ||
        (p.farmerId?.name || "").toLowerCase().includes(q)
      : true;
    const matchesCat =
      selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <>
      <DashboardLayout
        title="Buyer Dashboard"
        subtitle={`Welcome, ${user?.name || ""}!`}
        role="buyer"
        scrollable={true}
        showMenu={true}
        onMenuPress={openSidebar}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        notificationMessage={successMsg}
        onDismissNotification={() => setSuccessMsg("")}
        contentPaddingHorizontal={12}
      >
        {/* KPI Cards */}
        <View style={styles.summaryRow}>
          <SummaryCard
            icon="cart-outline"
            label="Active Orders"
            value={activeOrders}
            color="#FF9800"
            onPress={() => onSwitchTab?.("Orders")}
          />
          <SummaryCard
            icon="bookmark-outline"
            label="Saved Items"
            value={savedItems}
            color="#4CAF50"
            onPress={() => onSwitchTab?.("Saved")}
          />
          <SummaryCard
            icon="storefront-outline"
            label="Products"
            value={products.length}
            color="#2196F3"
            onPress={() => onSwitchTab?.("Marketplace")}
          />
        </View>
        <BuyerQuickActions
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterPress={() => {}}
        />

        <CategoryFilters
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <PriceTrendWidget />

        {/* Featured Products */}
        <View style={styles.sectionHeader}>
          <AppText style={{ fontWeight: "700", color: textPrimary }}>
            Featured Products
          </AppText>
          <TouchableOpacity onPress={() => onSwitchTab?.("Marketplace")}>
            <AppText style={{ color: primaryColor, fontWeight: "600" }}>
              See All
            </AppText>
          </TouchableOpacity>
        </View>
        <FeaturedProductsList
          products={filteredProducts}
          onView={handleViewProduct}
        />

        {/* Nearby Farmers */}
        <View style={styles.sectionHeader}>
          <AppText style={{ fontWeight: "700", color: textPrimary }}>
            Nearby Farmers
          </AppText>
          <TouchableOpacity onPress={() => onSwitchTab?.("Farmers")}>
            <AppText style={{ color: primaryColor, fontWeight: "600" }}>
              See All
            </AppText>
          </TouchableOpacity>
        </View>
        <NearbyFarmersList
          farmers={farmers}
          onFarmerPress={handleFarmerPress}
        />

        {/* Recent Activity */}
        <RecentActivityList
          activities={activities}
          onActivityPress={handleActivityPress}
        />

        {/* Bottom spacer so FAB doesn't hide content */}
        <View style={{ height: 80 }} />
      </DashboardLayout>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <FloatingActionButton
          onPress={() => onSwitchTab?.("Orders")}
          icon="cart"
          bottom={90}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: "row",
    gap: CARD_GAP,
    marginBottom: 16,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 12,
  },
});
