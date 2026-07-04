// Mobile/src/screens/buyer/BuyerSavedScreen.js
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
      <AppText style={styles.emptyEmoji}>🔖</AppText>
      <AppText style={[styles.emptyTitle, { color: textPrimary }]}>
        No saved listings
      </AppText>
      <AppText style={[styles.emptySubtitle, { color: textSecondary }]}>
        Browse the marketplace to save listings
      </AppText>
      <TouchableOpacity
        style={[styles.browseButton, { backgroundColor: primary }]}
        onPress={() => navigation?.goBack()}
      >
        <AppText style={styles.browseButtonText}>Go to Marketplace</AppText>
      </TouchableOpacity>
    </View>
  );

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
          Saved Listings
        </AppText>
        <View style={styles.backButton} />
      </View>

      <FlatList
        data={savedProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderSavedCard}
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
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
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
