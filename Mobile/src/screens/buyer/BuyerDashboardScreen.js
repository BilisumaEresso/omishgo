import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DashboardLayout from "../../components/layout/DashBoardLayout";
import AppSidebar from "../../components/layout/AppSidebar";
import BuyerWeatherWidget from "../../components/buyer/BuyerWeatherWidget";
import BuyerQuickActions from "../../components/buyer/BuyerQuickActions";
import CategoryFilters from "../../components/buyer/CategoryFilters";
import PriceTrendWidget from "../../components/buyer/PriceTrendWidget";
import FeaturedProductsList from "../../components/buyer/FeaturedProductsList";
import NearbyFarmersList from "../../components/buyer/NearbyFarmersList";
import RecentActivityList from "../../components/buyer/RecentActivityList";
import { useTheme } from "../../hooks/useTheme";

// ---------- Mock Data (extended) ----------
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

export default function BuyerDashboardScreen({ navigation }) {
  const { theme } = useTheme();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);
  const [orderedNotice, setOrderedNotice] = useState(null);

  const handlePlaceOrder = (product) => {
    setCartCount((prev) => prev + 1);
    setOrderedNotice(`Placed order for ${product.name}!`);
    setTimeout(() => setOrderedNotice(null), 3000);
  };

  const handleSidebarItemPress = (item) => {
    if (item.route === "Logout") {
      navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
    } else if (item.route) {
      navigation.navigate(item.route);
    }
  };

  // Filter products based on search & category
  const filteredProducts = mockProducts.filter((p) => {
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
        subtitle="Salam, Hana!"
        role="buyer"
        activeTab="Marketplace"
        onTabPress={(tab) => console.log(tab)}
        scrollable={true}
        showMenu={true}
        onMenuPress={() => setSidebarVisible(true)}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <BuyerWeatherWidget />
          <BuyerQuickActions
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onFilterPress={() => {}}
          />
          {orderedNotice && (
            <View
              style={[styles.notice, { backgroundColor: theme.colors.success }]}
            >
              <Ionicons name="checkmark-circle" size={18} color="#FFF" />
              <BuyerText
                variant="caption"
                style={{ color: "#FFF", marginLeft: 8 }}
              >
                {orderedNotice}
              </BuyerText>
            </View>
          )}
          <CategoryFilters
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <PriceTrendWidget />
          <FeaturedProductsList
            products={filteredProducts}
            onOrder={handlePlaceOrder}
          />
          <NearbyFarmersList farmers={mockFarmers} />
          <RecentActivityList activities={mockActivities} />
        </ScrollView>
      </DashboardLayout>

      {cartCount > 0 && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate("BuyerOrders")}
        >
          <Ionicons name="cart" size={24} color="#FFF" />
          <View style={styles.cartBadge}>
            <BuyerText
              variant="caption"
              style={{ color: "#FFF", fontWeight: "bold" }}
            >
              {cartCount}
            </BuyerText>
          </View>
        </TouchableOpacity>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  fab: {
    position: "absolute",
    bottom: 80,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  cartBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#BA1A1A",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
