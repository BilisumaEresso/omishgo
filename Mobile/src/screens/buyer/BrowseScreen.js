// Mobile/src/screens/buyer/BrowseScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View, FlatList, StyleSheet, ActivityIndicator,
  TextInput, TouchableOpacity, RefreshControl,
} from "react-native";
import { useTranslation } from "react-i18next";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppText from "../../components/common/AppText";
import AppButton from "../../components/common/AppButton";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ product, onView, theme }) => {
  const farmer = product.farmerId || {};
  const loc    = product.location  || {};

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface || "#fff", borderColor: theme.colors.border || "#eee" }]}>
      {/* Top row: crop type + price */}
      <View style={styles.cardHeader}>
        <AppText variant="headingSm" style={{ color: theme.colors.textPrimary }}>{product.cropType}</AppText>
        <AppText variant="headingSm" style={[styles.price, { color: theme.colors.primary || "#2e7d32" }]}>
          {product.price} ETB
        </AppText>
      </View>

      {/* Quantity + unit */}
      <AppText variant="bodyMd" style={{ color: theme.colors.textSecondary || "#666" }}>
        {product.quantity} {product.unit || "kg"}
      </AppText>

      {/* Location */}
      {(loc.region || loc.zone) ? (
        <AppText variant="bodySm" style={[styles.location, { color: theme.colors.textSecondary || "#888" }]}>
          📍 {[loc.region, loc.zone].filter(Boolean).join(", ")}
        </AppText>
      ) : null}

      {/* Farmer name */}
      {farmer.name ? (
        <AppText variant="bodySm" style={{ color: theme.colors.textSecondary || "#888", marginTop: 2 }}>
          🌾 {farmer.name}
        </AppText>
      ) : null}

      {/* View button */}
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
export default function BrowseScreen({ navigation }) {
  const { t }      = useTranslation();
  const { theme }  = useTheme();

  const [allProducts, setAllProducts]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [error, setError]               = useState("");
  const [search, setSearch]             = useState("");

  const fetchProducts = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const res = await api.get(API_ENDPOINTS.products.list);
      setAllProducts(res.data?.data?.products || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load products");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Client-side filter by crop type
  const filtered = search.trim()
    ? allProducts.filter(p =>
        p.cropType?.toLowerCase().includes(search.trim().toLowerCase())
      )
    : allProducts;

  const handleView = (product) => navigation.navigate("ListingDetail", { product });

  // ── Render states ──
  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary || "#2e7d32"} />
          <AppText variant="bodyMd" style={styles.centerText}>
            {t("common.loading") || "Loading..."}
          </AppText>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper padding={false}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface || "#fff", borderBottomColor: theme.colors.border || "#eee" }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <AppText variant="headingMd">←</AppText>
        </TouchableOpacity>
        <AppText variant="headingMd" style={{ flex: 1 }}>
          {t("browse.title") || "Browse Products"}
        </AppText>
      </View>

      {/* Search bar */}
      <View style={[styles.searchBar, { backgroundColor: theme.colors.surface || "#fff", borderColor: theme.colors.border || "#ddd" }]}>
        <AppText style={styles.searchIcon}>🔍</AppText>
        <TextInput
          style={[styles.searchInput, { color: theme.colors.textPrimary || "#333" }]}
          placeholder={t("browse.searchPlaceholder") || "Search by crop type..."}
          placeholderTextColor={theme.colors.textSecondary || "#999"}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {error ? (
        <View style={styles.center}>
          <AppText variant="bodyMd" style={{ color: theme.colors.error || "red" }}>{error}</AppText>
          <AppButton title="Retry" onPress={() => fetchProducts()} style={{ marginTop: 12 }} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ProductCard product={item} onView={handleView} theme={theme} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchProducts(true)}
              colors={[theme.colors.primary || "#2e7d32"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <AppText style={styles.emptyIcon}>🌾</AppText>
              <AppText variant="headingSm" style={styles.centerText}>
                {search ? (t("browse.noMatch") || "No listings match your search") : (t("browse.empty") || "No listings available right now")}
              </AppText>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 8,
  },
  backBtn: { padding: 4 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15 },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    gap: 4,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  price: { fontWeight: "700" },
  location: { marginTop: 4 },
  viewBtn: { marginTop: 12, alignSelf: "flex-end" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32, gap: 8 },
  centerText: { textAlign: "center", color: "#666" },
  emptyIcon: { fontSize: 48 },
});
