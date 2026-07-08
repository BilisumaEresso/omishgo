// Mobile/src/screens/buyer/BrowseScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AppButton from "../../components/common/AppButton";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import AppSidebar from "../../components/layout/AppSidebar";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";
import { ProductCard } from "../../components/common/ProductCard";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORY_FILTERS = ["All", "Grains", "Vegetables", "Fruits"];
const SORT_OPTIONS = ["Default", "Price ↑", "Price ↓"];


// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function BrowseScreen({ navigation, onSwitchTab }) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Data states
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // UI states
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Default");
  const [savedIds, setSavedIds] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Fetch products from API
  const fetchProducts = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const res = await api.get(API_ENDPOINTS.products.list);
      setAllProducts(res.data?.data?.products || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load products",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── Derived data ─────────────────────────────────────────────────────────
  const filteredBySearch = useMemo(() => {
    if (!search.trim()) return allProducts;
    return allProducts.filter((p) =>
      p.cropType?.toLowerCase().includes(search.trim().toLowerCase()),
    );
  }, [allProducts, search]);

  const filteredByCategory = useMemo(() => {
    if (categoryFilter === "All") return filteredBySearch;
    return filteredBySearch.filter(
      (p) => p.category?.toLowerCase() === categoryFilter.toLowerCase(),
    );
  }, [filteredBySearch, categoryFilter]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredByCategory];
    if (sortOrder === "Price ↑") return list.sort((a, b) => a.price - b.price);
    if (sortOrder === "Price ↓") return list.sort((a, b) => b.price - a.price);
    return list;
  }, [filteredByCategory, sortOrder]);

  const insights = useMemo(() => {
    const total = allProducts.length;
    const avgPrice =
      total > 0
        ? Math.round(
            allProducts.reduce((sum, p) => sum + (p.price || 0), 0) / total,
          )
        : 0;
    const uniqueFarmers = new Set(
      allProducts
        .map((p) => p.farmerId?.name || p.farmerId?._id)
        .filter(Boolean),
    ).size;
    return { total, avgPrice, uniqueFarmers };
  }, [allProducts]);

  const toggleSave = (productId) => {
    setSavedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handleView = (product) =>
    navigation.navigate("ListingDetail", { product });

  // Extract theme colors for the screen
  const primary = theme?.colors?.primary || "#1565C0";
  const primaryCont = theme?.colors?.primaryContainer || "#E3F2FD";
  const textPrimary = theme?.colors?.textPrimary || "#0D1B2A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6080";
  const background = theme?.colors?.background || "#F5F8FF";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#D0DEF5";
  const errorColor = theme?.colors?.error || "#C62828";

  // ── Loading state ──
  if (loading) {
    return (
      <View style={[styles.center, { flex: 1, backgroundColor: background }]}>
        <ActivityIndicator size="large" color={primary} />
        <AppText
          variant="bodyMd"
          style={[styles.centerText, { color: textSecondary }]}
        >
          {t("common.loading") || "Loading..."}
        </AppText>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: background }}>
      <AppHeader
        title="Marketplace"
        showMenu={true}
        showNotification={true}
        notificationCount={0}
        onMenuPress={() => setSidebarVisible(true)}
        onNotificationPress={() => navigation.navigate("Notifications")}
      />

      {/* Search bar */}
      <View
        style={[
          styles.searchBar,
          { backgroundColor: surface, borderColor: border },
        ]}
      >
        <Ionicons name="search" size={20} color={textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: textPrimary }]}
          placeholder={
            t("browse.searchPlaceholder") || "Search by crop type..."
          }
          placeholderTextColor={textSecondary}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Insights banner */}
      <View style={styles.insightsRow}>
        {[
          { label: "Products", value: insights.total },
          { label: "Avg Price", value: `${insights.avgPrice} ETB` },
          { label: "Farmers", value: insights.uniqueFarmers },
        ].map((item, index) => (
          <View
            key={index}
            style={[styles.insightCard, { backgroundColor: primaryCont }]}
          >
            <AppText style={[styles.insightValue, { color: primary }]}>
              {item.value}
            </AppText>
            <AppText style={[styles.insightLabel, { color: textSecondary }]}>
              {item.label}
            </AppText>
          </View>
        ))}
      </View>

      {/* Category filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterScrollContent}
      >
        {CATEGORY_FILTERS.map((cat) => {
          const isActive = categoryFilter === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategoryFilter(cat)}
              style={[
                styles.filterTab,
                {
                  backgroundColor: isActive ? primary : "transparent",
                  borderColor: isActive ? primary : border,
                },
              ]}
            >
              <AppText
                style={{
                  color: isActive ? surface : textSecondary,
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                {cat}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sort row */}
      <View style={styles.sortRow}>
        <AppText style={{ color: textSecondary, fontSize: 13 }}>
          Sort by:
        </AppText>
        {SORT_OPTIONS.map((opt) => {
          const isActive = sortOrder === opt;
          return (
            <TouchableOpacity
              key={opt}
              onPress={() => setSortOrder(opt)}
              style={[
                styles.sortPill,
                {
                  backgroundColor: isActive ? primary + "18" : "transparent",
                  borderColor: isActive ? primary : "transparent",
                },
              ]}
            >
              <AppText
                style={{
                  color: isActive ? primary : textSecondary,
                  fontSize: 13,
                  fontWeight: isActive ? "700" : "400",
                }}
              >
                {opt}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {error ? (
        <View style={styles.center}>
          <AppText variant="bodyMd" style={{ color: errorColor }}>
            {error}
          </AppText>
          <AppButton
            title="Retry"
            onPress={() => fetchProducts()}
            style={{ marginTop: 12 }}
          />
        </View>
      ) : (
        <FlatList
          data={sortedProducts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onView={handleView}
              theme={theme}
              isSaved={savedIds.includes(item._id)}
              onToggleSave={toggleSave}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchProducts(true)}
              colors={[primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              {/* Replaced emoji with Ionicons */}
              <Ionicons name="leaf-outline" size={48} color={textSecondary} />
              <AppText
                variant="headingSm"
                style={[styles.centerText, { color: textSecondary }]}
              >
                {search || categoryFilter !== "All"
                  ? t("browse.noMatch") || "No listings match your filters"
                  : t("browse.empty") || "No listings available right now"}
              </AppText>
            </View>
          }
        />
      )}

      <AppSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onItemPress={(item) => {
          setSidebarVisible(false);
          if (item.route === "Conversations")
            navigation.navigate("Conversations");
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
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15 },
  insightsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 4,
    gap: 8,
  },
  insightCard: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  insightValue: { fontSize: 16, fontWeight: "700" },
  insightLabel: { fontSize: 12, marginTop: 2 },
  filterScroll: { marginTop: 8, paddingLeft: 16, marginBottom: 4 },
  filterScrollContent: { paddingRight: 16, alignItems: "center" },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  sortPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    gap: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: { fontWeight: "700" },
  quantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  farmerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  viewBtn: {
    marginTop: 12,
    alignSelf: "stretch",
    borderRadius: 10,
    paddingVertical: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 8,
  },
  centerText: { textAlign: "center" },
});
