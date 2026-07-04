// Mobile/src/screens/buyer/BrowseScreen.js
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Platform,
  ScrollView,
} from "react-native";
import { useTranslation } from "react-i18next";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppText from "../../components/common/AppText";
import AppButton from "../../components/common/AppButton";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORY_FILTERS = ["All", "Grains", "Vegetables", "Fruits"];
const SORT_OPTIONS = ["Default", "Price ↑", "Price ↓"];

// ─── Product Card (improved) ──────────────────────────────────────────────────
const ProductCard = ({ product, onView, theme, isSaved, onToggleSave }) => {
  const farmer = product.farmerId || {};
  const loc = product.location || {};

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme?.colors?.surface || "#fff",
          borderColor: theme?.colors?.border || "#eee",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        },
      ]}
    >
      {/* Top row: crop type + bookmark + price */}
      <View style={styles.cardHeader}>
        <AppText
          variant="headingSm"
          style={{ color: theme?.colors?.textPrimary, flex: 1 }}
        >
          {product.cropType}
        </AppText>
        <TouchableOpacity
          onPress={() => onToggleSave(product._id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ marginRight: 6 }}
        >
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={22}
            color={theme?.colors?.primary || "#2e7d32"}
          />
        </TouchableOpacity>
        <AppText
          variant="headingSm"
          style={[styles.price, { color: theme?.colors?.primary || "#2e7d32" }]}
        >
          {product.price} ETB / {product.unit || "kg"}
        </AppText>
      </View>

      {/* Quantity + category badge */}
      <View style={styles.quantityRow}>
        <AppText
          variant="bodyMd"
          style={{ color: theme?.colors?.textSecondary || "#666" }}
        >
          {product.quantity} {product.unit || "kg"}
        </AppText>
        {product.category ? (
          <View
            style={[
              styles.categoryBadge,
              {
                backgroundColor: theme?.colors?.primaryContainer || "#E8F5E9",
              },
            ]}
          >
            <AppText
              style={{
                color: theme?.colors?.primary || "#2e7d32",
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              {product.category}
            </AppText>
          </View>
        ) : null}
      </View>

      {/* Location */}
      {loc.region || loc.zone ? (
        <AppText
          variant="bodySm"
          style={[
            styles.location,
            { color: theme?.colors?.textSecondary || "#888" },
          ]}
        >
          📍 {[loc.region, loc.zone].filter(Boolean).join(", ")}
        </AppText>
      ) : null}

      {/* Farmer name */}
      {farmer.name ? (
        <AppText
          variant="bodySm"
          style={{
            color: theme?.colors?.textSecondary || "#888",
            marginTop: 2,
          }}
        >
          🌾 {farmer.name}
        </AppText>
      ) : null}

      {/* View button – full width */}
      <AppButton
        title="View"
        variant="outline"
        onPress={() => onView(product)}
        style={styles.viewBtn}
      />
    </View>
  );
};

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
  const [savedIds, setSavedIds] = useState([]); // array of product IDs

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
  // Filter by search text
  const filteredBySearch = useMemo(() => {
    if (!search.trim()) return allProducts;
    return allProducts.filter((p) =>
      p.cropType?.toLowerCase().includes(search.trim().toLowerCase()),
    );
  }, [allProducts, search]);

  // Filter by category
  const filteredByCategory = useMemo(() => {
    if (categoryFilter === "All") return filteredBySearch;
    return filteredBySearch.filter(
      (p) => p.category?.toLowerCase() === categoryFilter.toLowerCase(),
    );
  }, [filteredBySearch, categoryFilter]);

  // Apply sorting
  const sortedProducts = useMemo(() => {
    const list = [...filteredByCategory];
    if (sortOrder === "Price ↑") {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortOrder === "Price ↓") {
      return list.sort((a, b) => b.price - a.price);
    }
    return list; // Default
  }, [filteredByCategory, sortOrder]);

  // Insights calculations (using allProducts, not filtered)
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

  // Save toggle handler
  const toggleSave = (productId) => {
    setSavedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handleView = (product) =>
    navigation.navigate("ListingDetail", { product });

  // ── Render states ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color={theme?.colors?.primary || "#2e7d32"}
          />
          <AppText variant="bodyMd" style={styles.centerText}>
            {t("common.loading") || "Loading..."}
          </AppText>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper padding={false}>
      {/* Updated header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme?.colors?.surface || "#fff",
            borderBottomColor: theme?.colors?.border || "#eee",
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
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme?.colors?.primary || "#2e7d32"}
          />
        </TouchableOpacity>
        <AppText
          variant="headingMd"
          style={{
            flex: 1,
            textAlign: "center",
            color: theme?.colors?.textPrimary,
          }}
        >
          {t("browse.title") || "Browse Products"}
        </AppText>
        <View style={{ width: 40 }} />
      </View>

      {/* Search bar */}
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: theme?.colors?.surface || "#fff",
            borderColor: theme?.colors?.border || "#ddd",
          },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={theme?.colors?.textSecondary || "#999"}
        />
        <TextInput
          style={[
            styles.searchInput,
            { color: theme?.colors?.textPrimary || "#333" },
          ]}
          placeholder={
            t("browse.searchPlaceholder") || "Search by crop type..."
          }
          placeholderTextColor={theme?.colors?.textSecondary || "#999"}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Insights banner */}
      <View style={styles.insightsRow}>
        <View
          style={[
            styles.insightCard,
            {
              backgroundColor: theme?.colors?.primaryContainer || "#E8F5E9",
            },
          ]}
        >
          <AppText
            style={[
              styles.insightValue,
              { color: theme?.colors?.primary || "#2e7d32" },
            ]}
          >
            {insights.total}
          </AppText>
          <AppText
            style={[
              styles.insightLabel,
              { color: theme?.colors?.textSecondary || "#666" },
            ]}
          >
            Products
          </AppText>
        </View>
        <View
          style={[
            styles.insightCard,
            {
              backgroundColor: theme?.colors?.primaryContainer || "#E8F5E9",
            },
          ]}
        >
          <AppText
            style={[
              styles.insightValue,
              { color: theme?.colors?.primary || "#2e7d32" },
            ]}
          >
            {insights.avgPrice} ETB
          </AppText>
          <AppText
            style={[
              styles.insightLabel,
              { color: theme?.colors?.textSecondary || "#666" },
            ]}
          >
            Avg Price
          </AppText>
        </View>
        <View
          style={[
            styles.insightCard,
            {
              backgroundColor: theme?.colors?.primaryContainer || "#E8F5E9",
            },
          ]}
        >
          <AppText
            style={[
              styles.insightValue,
              { color: theme?.colors?.primary || "#2e7d32" },
            ]}
          >
            {insights.uniqueFarmers}
          </AppText>
          <AppText
            style={[
              styles.insightLabel,
              { color: theme?.colors?.textSecondary || "#666" },
            ]}
          >
            Farmers
          </AppText>
        </View>
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
                  backgroundColor: isActive
                    ? theme?.colors?.primary || "#2e7d32"
                    : "transparent",
                  borderColor: isActive
                    ? theme?.colors?.primary || "#2e7d32"
                    : theme?.colors?.border || "#eee",
                },
              ]}
            >
              <AppText
                style={{
                  color: isActive
                    ? "#fff"
                    : theme?.colors?.textSecondary || "#666",
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
        <AppText style={{ color: theme?.colors?.textSecondary, fontSize: 13 }}>
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
                  backgroundColor: isActive
                    ? (theme?.colors?.primary || "#2e7d32") + "18"
                    : "transparent",
                  borderColor: isActive
                    ? theme?.colors?.primary || "#2e7d32"
                    : "transparent",
                },
              ]}
            >
              <AppText
                style={{
                  color: isActive
                    ? theme?.colors?.primary || "#2e7d32"
                    : theme?.colors?.textSecondary,
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
          <AppText
            variant="bodyMd"
            style={{ color: theme?.colors?.error || "red" }}
          >
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
              colors={[theme?.colors?.primary || "#2e7d32"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <AppText style={styles.emptyIcon}>🌾</AppText>
              <AppText variant="headingSm" style={styles.centerText}>
                {search || categoryFilter !== "All"
                  ? t("browse.noMatch") || "No listings match your filters"
                  : t("browse.empty") || "No listings available right now"}
              </AppText>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
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

  // Insights
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

  // Filters
  filterScroll: {
    marginTop: 8,
    paddingLeft: 16,
    marginBottom: 4,
  },
  filterScrollContent: {
    paddingRight: 16,
    alignItems: "center",
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },

  // Sorting
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

  // Product card
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
  location: { marginTop: 4 },
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
  centerText: { textAlign: "center", color: "#666" },
  emptyIcon: { fontSize: 48 },
});
