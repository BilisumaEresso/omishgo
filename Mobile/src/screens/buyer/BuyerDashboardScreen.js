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

// Mock data
const mockProducts = [
  {
    id: "p1",
    name: "50kg Red Onion",
    price: 4500,
    category: "Onion",
    farmerName: "Farmer Bekele",
    farmerAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    location: "Adama",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83766a4?w=600",
    isPremium: true,
  },
  {
    id: "p2",
    name: "100kg White Teff",
    price: 5200,
    category: "Teff",
    farmerName: "Farmer Alemitu",
    farmerAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    location: "Debre Zeit",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600",
    isPremium: false,
  },
  {
    id: "p3",
    name: "50kg Tomato",
    price: 3800,
    category: "Tomato",
    farmerName: "Farmer Tadese",
    farmerAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    location: "Ziway",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600",
    isPremium: true,
  },
  {
    id: "p4",
    name: "Garlic (5kg)",
    price: 1200,
    category: "Garlic",
    farmerName: "Farmer Genet",
    farmerAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    location: "Bishoftu",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83766a4?w=600",
    isPremium: false,
  },
];

const mockFarmers = [
  {
    id: "f1",
    name: "Farmer Bekele",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    distance: "2.3 km",
    rating: "4.8",
  },
  {
    id: "f2",
    name: "Farmer Alemitu",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    distance: "5.1 km",
    rating: "4.9",
  },
];

const mockActivities = [
  {
    id: "a1",
    type: "order",
    title: "Order ORD-8492",
    description: "50kg Red Onion placed successfully.",
    time: "2 hours ago",
  },
  {
    id: "a2",
    type: "message",
    title: "Farmer Bekele replied",
    description: "Your order will be ready tomorrow.",
    time: "5 hours ago",
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
            id: p._id,
            name: `${p.quantity}${p.unit || "kg"} ${p.cropType}`,
            price: p.price,
            category: p.cropType,
            farmerName: p.farmerId?.name || "Farmer",
            farmerAvatar:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            location: p.location?.region || "Ethiopia",
            image:
              p.photos?.[0] ||
              "https://images.unsplash.com/photo-1618512496248-a07fe83766a4?w=600",
            isPremium: false,
          }));
          setProducts(formatted);
        }
      } catch (err) {
        console.warn("Using mock products:", err.message);
      }
    };
    fetchRealProducts();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handlePlaceOrder = (product) => {
    setCartCount((prev) => prev + 1);
    setSuccessMsg(`Added ${product.name} to your cart!`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.farmerName.toLowerCase().includes(searchQuery.toLowerCase());
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

        <AgriPriceChangeWidget />

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
          <TouchableOpacity onPress={() => onSwitchTab?.("Marketplace")}>
            <AppText style={{ color: primaryColor, fontWeight: "600" }}>
              See All
            </AppText>
          </TouchableOpacity>
        </View>
        <FeaturedProductsList
          products={filteredProducts}
          onOrder={handlePlaceOrder}
        />
        <NearbyFarmersList farmers={mockFarmers} />

        {/* Recent Activity */}
        <RecentActivityList activities={mockActivities} />

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
