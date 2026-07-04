// Mobile/src/screens/farmer/FarmerProductsScreen.js
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "../../components/common/AppText";
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

  const primary = theme?.colors?.primary || "#2E7D32";
  const textPrimary = theme?.colors?.textPrimary || "#1A2E1A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6741";
  const textMuted = theme?.colors?.textMuted || "#8FAF8A";
  const background = theme?.colors?.background || "#F9FBF9";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#D0E8CE";
  const errorColor = theme?.colors?.error || "#C62828";

  // Compute counts from current products state
  const countActive = products.filter((p) => p.status === "active").length;
  const countSold = products.filter((p) => p.status === "sold").length;
  const countDraft = products.filter((p) => p.status === "draft").length;

  // Status badge colors
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return { bg: "#E8F5E9", text: "#2E7D32" };
      case "sold":
        return { bg: "#F5F5F5", text: "#757575" };
      case "draft":
        return { bg: "#FFF8E1", text: "#F57F17" };
      default:
        return { bg: "#F5F5F5", text: "#757575" };
    }
  };

  // Mark product as sold (local state update)
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
        {/* Top row: crop name + status pill */}
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

        {/* Second row: quantity + price */}
        <View style={styles.cardRow}>
          <AppText style={[styles.quantityText, { color: textSecondary }]}>
            {item.quantity} {item.unit}
          </AppText>
          <AppText style={[styles.priceText, { color: primary }]}>
            KSh {item.price.toLocaleString()}
          </AppText>
        </View>

        {/* Location row */}
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={textMuted} />
          <AppText style={[styles.locationText, { color: textMuted }]}>
            {item.location}
          </AppText>
        </View>

        {/* Action buttons (not for sold products) */}
        {!isSold && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.outlineButton, { borderColor: textSecondary }]}
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
        <AppText style={styles.addButtonText}>Post Product</AppText>
      </TouchableOpacity>
    </View>
  );

  // Count summary string
  const countSummary = `${countActive} Active · ${countSold} Sold · ${countDraft} Draft`;

  return (
    <View style={[styles.screen, { backgroundColor: background }]}>
      {/* Inline Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: surface,
            borderBottomColor: border,
            paddingTop:
              Platform.OS === "android"
                ? (StatusBar.currentHeight || 24) + 12
                : 54,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            if (navigation?.canGoBack()) {
              navigation.goBack();
            } else if (onSwitchTab) {
              onSwitchTab("Home");
            }
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={primary} />
        </TouchableOpacity>

        <AppText style={[styles.headerTitle, { color: textPrimary }]}>
          My Products
        </AppText>

        <TouchableOpacity
          onPress={() => navigation?.navigate("PostProduct")}
          style={[styles.addCircle, { backgroundColor: primary }]}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Count summary */}
      <View style={styles.summaryContainer}>
        <AppText style={[styles.summaryText, { color: textSecondary }]}>
          {countSummary}
        </AppText>
      </View>

      {/* Products list */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProductCard}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },
  addCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
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
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});

export default FarmerProductsScreen;
