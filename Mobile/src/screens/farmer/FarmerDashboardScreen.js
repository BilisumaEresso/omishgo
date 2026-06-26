import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import DashboardLayout from "../../components/layout/DashBoardLayout";
import AppSidebar from "../../components/layout/AppSidebar";
import WeatherWidget from "../../components/farmer/WeatherWidget";
import QuickActionsGrid from "../../components/farmer/QuickActionsGrid";
import MarketTrendsList from "../../components/farmer/MarketTrendsList";
import RecentOrdersList from "../../components/farmer/RecentOrdersList";
import AddProductModal from "../../components/farmer/AddProductModal";
import AppButton from "../../components/common/AppButton";
import { useTheme } from "../../hooks/useTheme";

// Mock data (can be moved to a separate file)
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

export default function FarmerDashboardScreen({ navigation, route }) {
  const { theme } = useTheme();
  const [products, setProducts] = useState(mockProducts);
  const [orders] = useState(mockOrders);
  const [modalVisible, setModalVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Show a brief success banner when returning from PostProductScreen
  useEffect(() => {
    if (route?.params?.successMessage) {
      setSuccessMsg(route.params.successMessage);
      const timer = setTimeout(() => setSuccessMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [route?.params?.successMessage]);

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

  const handleSidebarItemPress = (item) => {
    if (item.route === "Logout") {
      // Navigate to login/welcome screen
      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      });
    } else if (item.route) {
      navigation.navigate(item.route);
    }
  };

  return (
    <>
      <DashboardLayout
        title="Farmer Dashboard"
        subtitle="Welcome back, Bekele!"
        role="farmer"
        activeTab="Home"
        onTabPress={(tab) => console.log(tab)}
        scrollable={true}
        showMenu={true}
        onMenuPress={() => setSidebarVisible(true)}
      >
        {successMsg ? (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>✓ {successMsg}</Text>
          </View>
        ) : null}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <WeatherWidget />
          <QuickActionsGrid
            productCount={products.length}
            onAddPress={() => navigation.navigate("PostProduct")}
            onOrdersPress={() => navigation.navigate("FarmerOrders")}
            onTrainingPress={() => navigation.navigate("FarmerTraining")}
          />

          {/* Messages shortcut */}
          <AppButton
            title="💬  Messages"
            variant="outline"
            fullWidth
            onPress={() => navigation.navigate("Conversations")}
            style={{ marginBottom: 16 }}
          />
          <MarketTrendsList
            trends={marketTrends}
            onSellPress={(crop) => console.log("Sell", crop)}
          />
          <RecentOrdersList orders={orders.slice(0, 3)} />
        </ScrollView>
        <AddProductModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={handleAddProduct}
        />
      </DashboardLayout>

      <AppSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        role="farmer"
        onItemPress={handleSidebarItemPress}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  successBanner: {
    backgroundColor: "#2e7d32",
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  successText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
