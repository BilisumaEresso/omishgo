// Mobile/src/screens/farmer/FarmerOrdersScreen.js
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "../../components/common/AppText";
import { useTheme } from "../../hooks/useTheme";

// --- Mock Data ---
const MOCK_ORDERS = [
  {
    id: "1",
    cropType: "Maize",
    quantity: 50,
    unit: "kg",
    price: 1200,
    buyerName: "Emily Wanjiku",
    status: "Pending",
    date: "12 Jul 2025",
  },
  {
    id: "2",
    cropType: "Tomatoes",
    quantity: 30,
    unit: "kg",
    price: 900,
    buyerName: "John Mwangi",
    status: "Confirmed",
    date: "11 Jul 2025",
  },
  {
    id: "3",
    cropType: "Kales",
    quantity: 20,
    unit: "bundles",
    price: 400,
    buyerName: "Sarah Auma",
    status: "Completed",
    date: "10 Jul 2025",
  },
  {
    id: "4",
    cropType: "Beans",
    quantity: 100,
    unit: "kg",
    price: 2500,
    buyerName: "Peter Otieno",
    status: "Pending",
    date: "09 Jul 2025",
  },
  {
    id: "5",
    cropType: "Onions",
    quantity: 40,
    unit: "kg",
    price: 800,
    buyerName: "Grace Ndung'u",
    status: "Cancelled",
    date: "08 Jul 2025",
  },
  {
    id: "6",
    cropType: "Potatoes",
    quantity: 75,
    unit: "kg",
    price: 1500,
    buyerName: "David Kioko",
    status: "Confirmed",
    date: "07 Jul 2025",
  },
];

// Filter tabs
const FILTER_TABS = ["All", "Pending", "Confirmed", "Completed"];

const FarmerOrdersScreen = ({ navigation, onSwitchTab }) => {
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState("All");

  const primary = theme?.colors?.primary || "#2E7D32";
  const textPrimary = theme?.colors?.textPrimary || "#1A2E1A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6741";
  const background = theme?.colors?.background || "#F9FBF9";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#D0E8CE";

  // Status badge colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return { bg: "#FFF3E0", text: "#E65100" }; // amber
      case "Confirmed":
        return { bg: "#E3F2FD", text: "#0D47A1" }; // blue
      case "Completed":
        return { bg: "#E8F5E9", text: "#1B5E20" }; // green
      case "Cancelled":
        return { bg: "#FFEBEE", text: "#B71C1C" }; // red
      default:
        return { bg: "#F5F5F5", text: "#757575" };
    }
  };

  // Filter orders
  const filteredOrders =
    activeFilter === "All"
      ? MOCK_ORDERS
      : MOCK_ORDERS.filter((o) => o.status === activeFilter);

  const renderOrderCard = ({ item }) => {
    const statusColors = getStatusColor(item.status);
    return (
      <View style={[styles.card, { backgroundColor: surface }]}>
        <View style={styles.cardRow}>
          {/* Crop info */}
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <AppText style={{ fontSize: 20, marginRight: 6 }}>🌾</AppText>
              <AppText style={[styles.cropName, { color: textPrimary }]}>
                {item.cropType}
              </AppText>
            </View>
            <AppText style={[styles.subText, { color: textSecondary }]}>
              {item.buyerName} • {item.date}
            </AppText>
          </View>

          {/* Price and badge */}
          <View style={{ alignItems: "flex-end" }}>
            <AppText style={[styles.price, { color: primary }]}>
              KSh {item.price.toLocaleString()}
            </AppText>
            <View style={[styles.badge, { backgroundColor: statusColors.bg }]}>
              <AppText style={[styles.badgeText, { color: statusColors.text }]}>
                {item.status}
              </AppText>
            </View>
          </View>
        </View>

        {/* Quantity */}
        <View style={styles.quantityRow}>
          <AppText style={[styles.quantityText, { color: textSecondary }]}>
            {item.quantity} {item.unit}
          </AppText>
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <AppText style={styles.emptyEmoji}>📦</AppText>
      <AppText style={[styles.emptyText, { color: textSecondary }]}>
        No orders yet
      </AppText>
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: background }]}>
      {/* Inline header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: surface,
            borderBottomColor: border,
            paddingTop:
              Platform.OS === "android"
                ? (StatusBar.currentHeight || 24) + 12
                : 54, // safe for iOS notch; can use SafeAreaView but prompt didn't mention
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
          My Orders
        </AppText>
        <View style={styles.backButton} />
      </View>

      {/* Filter tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.filterTab,
                  {
                    backgroundColor: isActive ? primary : "transparent",
                    borderColor: isActive ? primary : border,
                  },
                ]}
                onPress={() => setActiveFilter(tab)}
              >
                <AppText
                  style={[
                    styles.filterText,
                    {
                      color: isActive ? "#FFFFFF" : textSecondary,
                    },
                  ]}
                >
                  {tab}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Orders list */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderCard}
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
  },
  filterContainer: {
    paddingVertical: 12,
    paddingLeft: 16,
  },
  filterScroll: {
    paddingRight: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
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
  },
  cropName: {
    fontSize: 16,
    fontWeight: "700",
  },
  subText: {
    fontSize: 13,
    marginTop: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-end",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  quantityRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 13,
    fontWeight: "500",
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
  },
});

export default FarmerOrdersScreen;
