// Mobile/src/screens/farmer/FarmerProductsScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import FloatingActionButton from "../../components/layout/FloatingActionBotton";
import { useSidebar } from "../../context/SidebarContext";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

const FarmerProductsScreen = ({ navigation, onSwitchTab }) => {
  const { theme } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { openSidebar } = useSidebar();
  const [updatingProductId, setUpdatingProductId] = useState(null);
  const user = useAuthStore((s) => s.user);

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

  // Fetch farmer's products
  const fetchMyProducts = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const res = await api.get(API_ENDPOINTS.products.list, {
        params: { farmerId: user?._id || user?.id },
      });
      const raw = res.data?.data?.products || [];
      const normalized = raw.map((p) => {
        let locString = "Ethiopia";
        if (p.location) {
          locString = [p.location.region, p.location.zone, p.location.kebele]
            .filter(Boolean)
            .join(", ");
        }

        return {
          id: p._id,
          cropType: p.cropType,
          quantity: p.quantity,
          unit: p.unit || "kg",
          price: p.price,
          location: locString,
          status: p.status,
          photos: p.photos || [],
          description: p.description || "",
          postedDate: new Date(p.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          _raw: p,
        };
      });
      setProducts(normalized);
    } catch (err) {
      console.warn("FarmerProducts fetch error:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchMyProducts(true);
    });
    return unsubscribe;
  }, [navigation]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMyProducts(true);
  };

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

  const markAsSold = async (id) => {
    setUpdatingProductId(id);
    try {
      await api.put(API_ENDPOINTS.products.update(id), { status: "sold" });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "sold" } : p)),
      );
    } catch (err) {
      Alert.alert(
        "Unable to mark sold",
        err?.response?.data?.message || "Could not update product status.",
      );
    } finally {
      setUpdatingProductId(null);
    }
  };

  const renderProductCard = ({ item }) => {
    const statusColors = getStatusColor(item.status);
    const isSold = item.status === "sold";
    const formattedPrice = item.price
      ? `ETB ${Number(item.price).toLocaleString()}`
      : "ETB -";
    const postedLabel = item.postedDate ? `Posted ${item.postedDate}` : "";

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.card, { backgroundColor: surface }]}
        onPress={() =>
          navigation?.navigate("EditProduct", { product: item._raw })
        }
      >
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

        <View style={[styles.cardRow, { marginBottom: 4 }]}>
          <AppText style={[styles.quantityText, { color: textSecondary }]}>
            {item.quantity} {item.unit}
          </AppText>
          <AppText style={[styles.priceText, { color: primary }]}>
            {formattedPrice}
          </AppText>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={textMuted} />
          <AppText style={[styles.locationText, { color: textMuted }]}>
            {item.location}
          </AppText>
        </View>

        {postedLabel ? (
          <View style={[styles.locationRow, { marginTop: 4 }]}>
            <AppText style={[styles.postedText, { color: textMuted }]}>
              {postedLabel}
            </AppText>
          </View>
        ) : null}

        {!isSold && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.outlineButton, { borderColor: textSecondary }]}
              onPress={() =>
                navigation?.navigate("EditProduct", { product: item._raw })
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
              disabled={updatingProductId === item.id}
            >
              <AppText
                style={[styles.outlineButtonText, { color: errorColor }]}
              >
                {updatingProductId === item.id ? "Updating..." : "Mark Sold"}
              </AppText>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
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
        onMenuPress={openSidebar}
        onNotificationPress={() => navigation.navigate("Notifications")}
      />

      <View style={styles.summaryContainer}>
        <AppText style={[styles.summaryText, { color: textSecondary }]}>
          {countSummary}
        </AppText>
      </View>

      {loading && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 60,
          }}
        >
          <ActivityIndicator size="large" color={primary} />
        </View>
      )}

      {!loading && products.length === 0 && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 60,
          }}
        >
          <AppText
            style={{ color: textMuted, fontSize: 16, textAlign: "center" }}
          >
            You have no active listings.{"\n"}Tap + to post your first product.
          </AppText>
        </View>
      )}

      {!loading && products.length > 0 && (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProductCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[primary]}
            />
          }
        />
      )}

      <FloatingActionButton
        icon="add"
        onPress={() => navigation?.navigate("PostProduct")}
        bottom={24}
        right={24}
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
