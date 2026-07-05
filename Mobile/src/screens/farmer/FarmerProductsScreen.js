// Mobile/src/screens/farmer/FarmerProductsScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import AppSidebar from "../../components/layout/AppSidebar";
import { useTheme } from "../../hooks/useTheme";

// --- Mock Data ---
const MOCK_PRODUCTS = [
  {
    id: "1",
    cropType: "Maize",
    quantity: 200,
    unit: "kg",
    price: 800,
    status: "active",
    location: "Kiambu, Central",
    postedDate: "10 Jul 2025",
  },
  {
    id: "2",
    cropType: "Tomatoes",
    quantity: 75,
    unit: "kg",
    price: 600,
    status: "active",
    location: "Nyeri, Central",
    postedDate: "09 Jul 2025",
  },
  {
    id: "3",
    cropType: "Kales",
    quantity: 40,
    unit: "bundles",
    price: 300,
    status: "sold",
    location: "Murang'a, Central",
    postedDate: "05 Jul 2025",
  },
  {
    id: "4",
    cropType: "Beans",
    quantity: 150,
    unit: "kg",
    price: 1200,
    status: "draft",
    location: "Embu, Eastern",
    postedDate: "02 Jul 2025",
  },
  {
    id: "5",
    cropType: "Avocados",
    quantity: 60,
    unit: "pieces",
    price: 1500,
    status: "active",
    location: "Meru, Eastern",
    postedDate: "28 Jun 2025",
  },
];

const FarmerProductsScreen = ({ navigation, onSwitchTab }) => {
  const { theme } = useTheme();
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Extract theme colors
  const primary = theme?.colors?.primary || "#2E7D32";
  const textPrimary = theme?.colors?.textPrimary || "#1A2E1A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6741";
  const textMuted = theme?.colors?.textMuted || "#8FAF8A";
  const background = theme?.colors?.background || "#F9FBF9";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#D0E8CE";
  const success = theme?.colors?.success || "#2E7D32";
  const warning = theme?.colors?.warning || "#F57F17";
  const errorColor = theme?.colors?.error || "#C62828";

  // Counts
  const countActive = products.filter((p) => p.status === "active").length;
  const countSold = products.filter((p) => p.status === "sold").length;
  const countDraft = products.filter((p) => p.status === "draft").length;

  // Status badge colors (theme‑based)
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return { bg: success + "18", text: success };
      case "sold":
        return { bg: textMuted + "18", text: textMuted };
      case "draft":
        return { bg: warning + "18", text: warning };
      default:
        return { bg: border, text: textSecondary };
    }
  };

  const markAsSold = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "sold" } : p)),
    );
  };

  const renderProductCard = ({ item }) => {
    const statusColors = getStatusColor(item.status);
    const isSold = item.status === "sold";

    return (
      <View style={[styles.card, { backgroundColor: surface }]}>
        <View style={styles.cardRow}>
          <AppText style={[styles.cropName, { color: textPrimary }]}>
            {item.cropType}
          </AppText>
          <View style={[styles.badge, { backgroundColor: statusColors.bg }]}>
            <AppText style={[styles.badgeText, { color: statusColors.text }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </AppText>
          </View>
        </View>

        <View style={styles.cardRow}>
          <AppText style={[styles.quantityText, { color: textSecondary }]}>
            {item.quantity} {item.unit}
          </AppText>
          <AppText style={[styles.priceText, { color: primary }]}>
            KSh {item.price.toLocaleString()}
          </AppText>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={textMuted} />
          <AppText style={[styles.locationText, { color: textMuted }]}>
            {item.location}
          </AppText>
        </View>

        {!isSold && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.outlineButton, { borderColor: textSecondary }]}
              onPress={() =>
                navigation?.navigate("EditProduct", { product: item })
              }
            >
              <AppText
                style={[styles.outlineButtonText, { color: textSecondary }]}
              >
                Edit
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.outlineButton, { borderColor: errorColor }]}
              onPress={() => markAsSold(item.id)}
            >
              <AppText
                style={[styles.outlineButtonText, { color: errorColor }]}
              >
                Mark Sold
              </AppText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <AppText style={styles.emptyEmoji}>🌱</AppText>
      <AppText style={[styles.emptyText, { color: textSecondary }]}>
        Post your first product
      </AppText>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: primary }]}
        onPress={() => navigation?.navigate("PostProduct")}
      >
        <AppText style={[styles.addButtonText, { color: surface }]}>
          Post Product
        </AppText>
      </TouchableOpacity>
    </View>
  );

  const countSummary = `${countActive} Active · ${countSold} Sold · ${countDraft} Draft`;

  return (
    <View style={[styles.screen, { backgroundColor: background }]}>
      <AppHeader
        title="My Products"
        showMenu={true}
        showNotification={true}
        notificationCount={0}
        onMenuPress={() => setSidebarVisible(true)}
        onNotificationPress={() => navigation.navigate("Notifications")}
      />

      <View style={styles.summaryContainer}>
        <AppText style={[styles.summaryText, { color: textSecondary }]}>
          {countSummary}
        </AppText>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProductCard}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <AppSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onItemPress={(item) => {
          setSidebarVisible(false);
          if (item.route === "Conversations")
            navigation.navigate("Conversations");
          else if (item.route === "Chat") navigation.navigate("Chat");
          else if (item.route === "PostProduct")
            navigation.navigate("PostProduct");
          else if (item.route === "Home") onSwitchTab?.("Home");
          else if (onSwitchTab) {
            const TAB_MAP = {
              FarmerProducts: "Products",
              FarmerOrders: "Orders",
              FarmerAnalytics: "Insights",
              Profile: "Profile",
              BuyerMarketplace: "Marketplace",
              BuyerOrders: "Orders",
              BuyerSaved: "Saved",
            };
            if (TAB_MAP[item.route]) onSwitchTab(TAB_MAP[item.route]);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  summaryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: "500",
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
    alignItems: "center",
    marginBottom: 6,
  },
  cropName: {
    fontSize: 16,
    fontWeight: "700",
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
  quantityText: {
    fontSize: 14,
    fontWeight: "500",
  },
  priceText: {
    fontSize: 14,
    fontWeight: "700",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    marginLeft: 4,
  },
  actionsRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  outlineButton: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  outlineButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 16,
  },
  addButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
});

export default FarmerProductsScreen;
