// Mobile/src/screens/buyer/BuyerSavedScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import AppSidebar from "../../components/layout/AppSidebar";
import { useTheme } from "../../hooks/useTheme";

// --- Mock Data ---
const MOCK_SAVED = [
  {
    id: "1",
    cropType: "Maize",
    price: 800,
    quantity: 50,
    unit: "kg",
    farmerName: "James Kariuki",
    location: "Kiambu, Central",
  },
  {
    id: "2",
    cropType: "Tomatoes",
    price: 600,
    quantity: 30,
    unit: "kg",
    farmerName: "Alice Wambui",
    location: "Nyeri, Central",
  },
  {
    id: "3",
    cropType: "Beans",
    price: 1200,
    quantity: 100,
    unit: "kg",
    farmerName: "Peter Otieno",
    location: "Kisumu, Western",
  },
  {
    id: "4",
    cropType: "Onions",
    price: 500,
    quantity: 40,
    unit: "kg",
    farmerName: "Grace Auma",
    location: "Bungoma, Western",
  },
];

const BuyerSavedScreen = ({ navigation, onSwitchTab }) => {
  const { theme } = useTheme();
  const [savedProducts, setSavedProducts] = useState(MOCK_SAVED);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const primary = theme?.colors?.primary || "#1565C0";
  const textPrimary = theme?.colors?.textPrimary || "#0D1B2A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6080";
  const textMuted = theme?.colors?.textMuted || "#8FA3BE";
  const background = theme?.colors?.background || "#F5F8FF";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#D0DEF5";

  const removeSaved = (id) => {
    setSavedProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const renderSavedCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: surface }]}
      activeOpacity={0.7}
      onPress={() => navigation?.navigate("ListingDetail", { product: item })}
    >
      <View style={styles.cardTopRow}>
        <AppText style={[styles.cropName, { color: textPrimary }]}>
          {item.cropType}
        </AppText>
        <TouchableOpacity
          onPress={() => removeSaved(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="bookmark" size={22} color={primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardMiddleRow}>
        <AppText style={[styles.price, { color: primary }]}>
          KSh {item.price.toLocaleString()}
        </AppText>
        <AppText style={[styles.quantity, { color: textSecondary }]}>
          {item.quantity} {item.unit}
        </AppText>
      </View>

      <View style={styles.cardBottomRow}>
        <Ionicons
          name="person-outline"
          size={14}
          color={textMuted}
          style={{ marginRight: 4 }}
        />
        <AppText style={[styles.farmerText, { color: textSecondary }]}>
          {item.farmerName}
        </AppText>
        <View style={styles.locationWrap}>
          <Ionicons
            name="location-outline"
            size={14}
            color={textMuted}
            style={{ marginRight: 2 }}
          />
          <AppText style={[styles.locationText, { color: textMuted }]}>
            {item.location}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      {/* Replaced emoji with Ionicons */}
      <Ionicons
        name="bookmark-outline"
        size={48}
        color={textMuted}
        style={{ marginBottom: 12 }}
      />
      <AppText style={[styles.emptyTitle, { color: textPrimary }]}>
        No saved listings
      </AppText>
      <AppText style={[styles.emptySubtitle, { color: textSecondary }]}>
        Browse the marketplace to save listings
      </AppText>
      <TouchableOpacity
        style={[styles.browseButton, { backgroundColor: primary }]}
        onPress={() => onSwitchTab?.("Marketplace")}
      >
        <AppText style={styles.browseButtonText}>Go to Marketplace</AppText>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: background }]}>
      <AppHeader
        title="Saved Listings"
        showMenu={true}
        showNotification={true}
        notificationCount={0}
        onMenuPress={() => setSidebarVisible(true)}
        onNotificationPress={() => navigation.navigate("Notifications")}
      />

      <FlatList
        data={savedProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderSavedCard}
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
            const MAP = {
              BuyerMarketplace: "Marketplace",
              BuyerOrders: "Orders",
              BuyerSaved: "Saved",
              Profile: "Profile",
            };
            if (MAP[item.route]) onSwitchTab(MAP[item.route]);
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
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
    paddingTop: 8,
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
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cropName: {
    fontSize: 16,
    fontWeight: "700",
  },
  cardMiddleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
  },
  quantity: {
    fontSize: 14,
  },
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  farmerText: {
    fontSize: 13,
    marginRight: 12,
  },
  locationWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 13,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  browseButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  browseButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});

export default BuyerSavedScreen;
