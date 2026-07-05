// Mobile/src/screens/buyer/BuyerOrdersScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import AppSidebar from "../../components/layout/AppSidebar";
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
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Extract theme colors with fallbacks
  const primary = theme?.colors?.primary || "#1565C0";
  const textPrimary = theme?.colors?.textPrimary || "#0D1B2A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6080";
  const background = theme?.colors?.background || "#F5F8FF";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#D0DEF5";
  const success = theme?.colors?.success || "#2E7D32";
  const info = theme?.colors?.info || "#1565C0";
  const textMuted = theme?.colors?.textMuted || "#8FA3BE";

  // Status badge colors - using theme with transparency
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return { bg: info + "18", text: info };
      case "Completed":
        return { bg: success + "18", text: success };
      default:
        return { bg: textMuted + "18", text: textMuted };
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
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation?.navigate("OrderDetail", { order: item, role: "buyer" })
        }
      >
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
              <View
                style={[styles.badge, { backgroundColor: statusColors.bg }]}
              >
                <AppText
                  style={[styles.badgeText, { color: statusColors.text }]}
                >
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
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      {/* Replaced emoji with Ionicons */}
      <Ionicons
        name="cube-outline"
        size={48}
        color={textSecondary}
        style={{ marginBottom: 12 }}
      />
      <AppText style={[styles.emptyText, { color: textSecondary }]}>
        No orders yet
      </AppText>
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: background }]}>
      <AppHeader
        title="My Orders"
        showMenu={true}
        showNotification={true}
        notificationCount={0}
        onMenuPress={() => setSidebarVisible(true)}
        onNotificationPress={() => navigation.navigate("Notifications")}
      />

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
                      color: isActive ? surface : textSecondary,
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
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default BuyerOrdersScreen;
