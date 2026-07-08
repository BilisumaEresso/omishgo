// src/screens/buyer/BuyerDashboardScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import BuyerQuickActions from "../../components/buyer/BuyerQuickActions";
import CategoryFilters from "../../components/buyer/CategoryFilters";
import FeaturedProductsList from "../../components/buyer/FeaturedProductsList";
import NearbyFarmersList from "../../components/buyer/NearbyFarmersList";
import PriceTrendWidget from "../../components/buyer/PriceTrendWidget";
import RecentActivityList from "../../components/buyer/RecentActivityList";
import AgriPriceChangeWidget from "../../components/common/AgriPriceChangeWidget";
import AppText from "../../components/common/AppText";
import AppSidebar from "../../components/layout/AppSidebar";
import DashboardLayout from "../../components/layout/DashBoardLayout";
import FloatingActionButton from "../../components/layout/FloatingActionBotton";
import SummaryCard from "../../components/SummaryCard";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

// Mock data (unchanged)
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

  // Extract all theme colors with fallbacks (standardised)
  const primary = theme?.colors?.primary || "#1565C0";
  const primaryLight = theme?.colors?.primaryLight || "#5E92F3";
  const primaryDark = theme?.colors?.primaryDark || "#0D47A1";
  const primaryCont = theme?.colors?.primaryContainer || "#E3F2FD";
  const secondary = theme?.colors?.secondary || "#00897B";
  const textPrimary = theme?.colors?.textPrimary || "#0D1B2A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6080";
  const textMuted = theme?.colors?.textMuted || "#8FA3BE";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const background = theme?.colors?.background || "#F5F8FF";
  const border = theme?.colors?.border || "#D0DEF5";
  const success = theme?.colors?.success || "#2E7D32";
  const warning = theme?.colors?.warning || "#EF6C00";
  const info = theme?.colors?.info || "#1565C0";
  const error = theme?.colors?.error || "#C62828";

  // State (unchanged)
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [products, setProducts] = useState(mockProducts);
  const [refreshing, setRefreshing] = useState(false);

  // KPI data (static)
  const activeOrders = 2;
  const savedItems = 5;

  // Fetch real products on mount
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

  // Real refresh handler (Fix 8)
  const handleRefresh = async () => {
    setRefreshing(true);
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
      console.warn("Refresh failed, keeping current data:", err.message);
    }
    setRefreshing(false);
  };

  const handlePlaceOrder = (product) => {
    setCartCount((prev) => prev + 1);
    setSuccessMsg(`Added ${product.name} to your cart!`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleSidebarItemPress = (item) => {
    setSidebarVisible(false);
    if (item.route === "Logout") return;
    const TAB_MAP = {
      BuyerMarketplace: "Marketplace",
      BuyerOrders: "Orders",
      BuyerSaved: "Saved",
      Profile: "Profile",
      Home: "Home",
    };
    const STACK_ROUTES = ["Conversations", "Chat", "ListingDetail", "Help"];
    if (item.route === "Home") {
      onSwitchTab?.("Home");
    } else if (TAB_MAP[item.route]) {
      onSwitchTab?.(TAB_MAP[item.route]);
    } else if (STACK_ROUTES.includes(item.route)) {
      navigation.navigate(item.route);
    }
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
        subtitle={`Welcome, ${user?.name || "Buyer"}!`}
        role="buyer"
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
        {/* KPI Cards (Fix 2) */}
        <View style={styles.summaryRow}>
          <SummaryCard
            icon="cart-outline"
            label="Active Orders"
            value={activeOrders}
            color={warning}
            onPress={() => onSwitchTab?.("Orders")}
          />
          <SummaryCard
            icon="bookmark-outline"
            label="Saved Items"
            value={savedItems}
            color={secondary}
            onPress={() => onSwitchTab?.("Saved")}
          />
          <SummaryCard
            icon="storefront-outline"
            label="Products"
            value={products.length}
            color={primary}
            onPress={() => onSwitchTab?.("Marketplace")}
          />
        </View>

        {/* Shortcut Row (Fix 4) */}
        <View style={styles.shortcutRow}>
          {[
            {
              icon: "storefront-outline",
              label: "Browse",
              onPress: () => onSwitchTab?.("Marketplace"),
            },
            {
              icon: "chatbubbles-outline",
              label: "Messages",
              onPress: () => navigation.navigate("Conversations"),
            },
            {
              icon: "bookmark-outline",
              label: "Saved",
              onPress: () => onSwitchTab?.("Saved"),
            },
            {
              icon: "notifications-outline",
              label: "Alerts",
              onPress: () => navigation.navigate("Notifications"),
            },
          ].map((s) => (
            <TouchableOpacity
              key={s.label}
              style={[styles.shortcut, { backgroundColor: primaryCont }]}
              onPress={s.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.shortcutIcon, { backgroundColor: primary }]}>
                <Ionicons name={s.icon} size={18} color="#fff" />
              </View>
              <AppText
                style={{
                  fontSize: 10,
                  color: textPrimary,
                  fontWeight: "600",
                  marginTop: 5,
                  textAlign: "center",
                }}
              >
                {s.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Agri Price Change (Fix 3) */}
        <AgriPriceChangeWidget
          productName="Teff"
          currentPrice="3,450 ETB/q"
          changePercent={4.2}
          changeLabel="Market Price Today"
        />

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

        {/* Featured Products Section (Fix 5) */}
        <View style={styles.sectionHeader}>
          <AppText
            style={{ fontSize: 16, fontWeight: "700", color: textPrimary }}
          >
            Featured Products
          </AppText>
          <TouchableOpacity onPress={() => onSwitchTab?.("Marketplace")}>
            <AppText
              style={{ color: primary, fontWeight: "600", fontSize: 14 }}
            >
              See All
            </AppText>
          </TouchableOpacity>
        </View>
        <FeaturedProductsList
          products={filteredProducts}
          onOrder={handlePlaceOrder}
        />

        {/* Nearby Farmers Section (Fix 6) */}
        <View style={styles.sectionHeader}>
          <AppText
            style={{ fontSize: 16, fontWeight: "700", color: textPrimary }}
          >
            Nearby Farmers
          </AppText>
          <TouchableOpacity onPress={() => onSwitchTab?.("Marketplace")}>
            <AppText
              style={{ color: primary, fontWeight: "600", fontSize: 14 }}
            >
              Browse All
            </AppText>
          </TouchableOpacity>
        </View>
        <NearbyFarmersList farmers={mockFarmers} />

        {/* Recent Activity Section (Fix 7) */}
        <View style={styles.sectionHeader}>
          <AppText
            style={{ fontSize: 16, fontWeight: "700", color: textPrimary }}
          >
            Recent Activity
          </AppText>
        </View>
        <RecentActivityList
          activities={mockActivities}
          onActivityPress={(activity) => {
            if (activity.type === "order") onSwitchTab?.("Orders");
            else if (activity.type === "message")
              navigation.navigate("Conversations");
          }}
        />

        <View style={{ height: 80 }} />
      </DashboardLayout>

      {/* Floating Cart Button (Fix 9) */}
      {cartCount > 0 && (
        <FloatingActionButton
          onPress={() => onSwitchTab?.("Orders")}
          icon="cart"
          bottom={28}
        />
      )}

      <AppSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        role="buyer"
        onItemPress={handleSidebarItemPress}
      />
    </>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
    marginTop: 8,
  },
  shortcutRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
    marginTop: 8,
  },
  shortcut: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 14,
  },
  shortcutIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
});
