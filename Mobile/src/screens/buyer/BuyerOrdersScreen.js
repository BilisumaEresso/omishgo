// Mobile/src/screens/buyer/BuyerOrdersScreen.js
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
    totalPrice: 1200,
    farmerName: "James Kariuki",
    status: "Active",
    orderedDate: "12 Jul 2025",
  },
  {
    id: "2",
    cropType: "Tomatoes",
    quantity: 30,
    unit: "kg",
    totalPrice: 900,
    farmerName: "Alice Wambui",
    status: "Completed",
    orderedDate: "10 Jul 2025",
  },
  {
    id: "3",
    cropType: "Kales",
    quantity: 20,
    unit: "bundles",
    totalPrice: 400,
    farmerName: "Peter Otieno",
    status: "Active",
    orderedDate: "09 Jul 2025",
  },
  {
    id: "4",
    cropType: "Onions",
    quantity: 40,
    unit: "kg",
    totalPrice: 800,
    farmerName: "Grace Auma",
    status: "Completed",
    orderedDate: "07 Jul 2025",
  },
  {
    id: "5",
    cropType: "Beans",
    quantity: 100,
    unit: "kg",
    totalPrice: 2500,
    farmerName: "David Mwangi",
    status: "Active",
    orderedDate: "05 Jul 2025",
  },
];

const FILTER_TABS = ["All", "Active", "Completed"];

const BuyerOrdersScreen = ({ navigation, onSwitchTab }) => {
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState("All");

  const primary = theme?.colors?.primary || "#1565C0";
  const textPrimary = theme?.colors?.textPrimary || "#0D1B2A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6080";
  const background = theme?.colors?.background || "#F5F8FF";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#D0DEF5";

  // Status badge colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return { bg: "#E3F2FD", text: "#0D47A1" };
      case "Completed":
        return { bg: "#E8F5E9", text: "#1B5E20" };
      default:
        return { bg: "#F5F5F5", text: "#757575" };
    }
  };

  const filteredOrders =
    activeFilter === "All"
      ? MOCK_ORDERS
      : MOCK_ORDERS.filter((o) => o.status === activeFilter);

  const renderOrderCard = ({ item }) => {
    const statusColors = getStatusColor(item.status);
    const isActive = item.status === "Active";

    return (
      <View style={[styles.card, { backgroundColor: surface }]}>
        <View style={styles.cardRow}>
          {/* Crop info */}
          <View style={{ flex: 1 }}>
            <AppText style={[styles.cropName, { color: textPrimary }]}>
              {item.cropType}{" "}
              <AppText
                style={{
                  fontWeight: "400",
                  fontSize: 14,
                  color: textSecondary,
                }}
              >
                ({item.quantity} {item.unit})
              </AppText>
            </AppText>
            <AppText style={[styles.subText, { color: textSecondary }]}>
              {item.farmerName} • {item.orderedDate}
            </AppText>
          </View>

          {/* Price and badge */}
          <View style={{ alignItems: "flex-end" }}>
            <AppText style={[styles.price, { color: primary }]}>
              KSh {item.totalPrice.toLocaleString()}
            </AppText>
            <View style={[styles.badge, { backgroundColor: statusColors.bg }]}>
              <AppText style={[styles.badgeText, { color: statusColors.text }]}>
                {item.status}
              </AppText>
            </View>
          </View>
        </View>

        {/* Message button for active orders */}
        {isActive && (
          <TouchableOpacity
            style={[styles.messageButton, { borderColor: primary }]}
            onPress={() =>
              navigation?.navigate("Chat", {
                userId: "mock",
                userName: item.farmerName,
              })
            }
            activeOpacity={0.7}
          >
            <Ionicons
              name="chatbubble-outline"
              size={14}
              color={primary}
              style={{ marginRight: 6 }}
            />
            <AppText style={[styles.messageButtonText, { color: primary }]}>
              Message Farmer
            </AppText>
          </TouchableOpacity>
        )}
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
    marginTop: 4,
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
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  messageButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  messageButtonText: {
    fontSize: 13,
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
  },
});

export default BuyerOrdersScreen;
