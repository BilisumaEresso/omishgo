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
import { useSidebar } from "../../context/SidebarContext";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";
import { ProductCard } from "../../components/common/ProductCard";
import { useSavedStore } from "../../store/saved.store";

// ─── Crop filter values (English, used for data matching) ─────────────────────
const CROP_VALUES = [
  "All",
  "Tomato",
  "Teff",
  "Wheat",
  "Maize",
  "Onion",
  "Cabbage",
  "Potato",
];

// ─── Sort option values (English, used for data matching) ─────────────────────
const SORT_VALUES = ["Default", "Price ↑", "Price ↓"];

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
  const [cropFilter, setCropFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Default");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const { openSidebar } = useSidebar();

  // Saved store
  const savedIds = useSavedStore((s) => s.savedIds);
  const toggleSave = useSavedStore((s) => s.toggleSave);
  const fetchSaved = useSavedStore((s) => s.fetchSaved);
  const savedInitialized = useSavedStore((s) => s.initialized);

  // Translated filter & sort items
  const cropFilterItems = useMemo(
    () => [
      { value: "All", label: t("browse.all") },
      { value: "Tomato", label: t("browse.tomato") },
      { value: "Teff", label: t("browse.teff") },
      { value: "Wheat", label: t("browse.wheat") },
      { value: "Maize", label: t("browse.maize") },
      { value: "Onion", label: t("browse.onion") },
      { value: "Cabbage", label: t("browse.cabbage") },
      { value: "Potato", label: t("browse.potato") },
    ],
    [t],
  );

  const sortItems = useMemo(
    () => [
      { value: "Default", label: t("browse.sortDefault") },
      { value: "Price ↑", label: t("browse.sortPriceAsc") },
      { value: "Price ↓", label: t("browse.sortPriceDesc") },
    ],
    [t],
  );

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
    if (!savedInitialized) fetchSaved();
  }, [fetchProducts]);

  // ── Derived data ─────────────────────────────────────────────────────────
  const filteredBySearch = useMemo(() => {
    if (!search.trim()) return allProducts;
    return allProducts.filter((p) =>
      p.cropType?.toLowerCase().includes(search.trim().toLowerCase()),
    );
  }, [allProducts, search]);

  // Filter by selected crop (cropType match)
  const filteredByCrop = useMemo(() => {
    if (cropFilter === "All") return filteredBySearch;
    return filteredBySearch.filter(
      (p) => p.cropType?.toLowerCase() === cropFilter.toLowerCase(),
    );
  }, [filteredBySearch, cropFilter]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredByCrop];
    if (sortOrder === "Price ↑") return list.sort((a, b) => a.price - b.price);
    if (sortOrder === "Price ↓") return list.sort((a, b) => b.price - a.price);
    return list;
  }, [filteredByCrop, sortOrder]);

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

  const handleView = (product) =>
    navigation.navigate("ListingDetail", { product });

  // Theme colours
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
        title={t("browse.title")}
        showMenu={true}
        showNotification={true}
        notificationCount={0}
        onMenuPress={openSidebar}
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
        {search ? (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={18} color={textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Insights banner */}
      <View style={styles.insightsRow}>
        {[
          { label: t("browse.products"), value: insights.total },
          { label: t("browse.avgPrice"), value: `${insights.avgPrice} ETB` },
          { label: t("browse.farmers"), value: insights.uniqueFarmers },
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

      {/* Filters & Sort combined bar */}
      <View style={styles.filtersBar}>
        <View style={styles.filtersRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
          >
            {cropFilterItems.map((item) => {
              const isActive = cropFilter === item.value;
              return (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => setCropFilter(item.value)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: isActive ? primary : surface,
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
                    {item.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Sort dropdown */}
          <View style={{ position: "relative" }}>
            <TouchableOpacity
              onPress={() => setSortDropdownOpen(!sortDropdownOpen)}
              style={[
                styles.sortButton,
                { backgroundColor: surface, borderColor: border },
              ]}
            >
              <AppText
                style={{ color: textPrimary, fontSize: 13, fontWeight: "600" }}
              >
                {t("browse.sort")}
              </AppText>
            </TouchableOpacity>
            {sortDropdownOpen && (
              <View
                style={[
                  styles.sortDropdown,
                  { backgroundColor: surface, borderColor: border },
                ]}
              >
                {sortItems.map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    onPress={() => {
                      setSortOrder(item.value);
                      setSortDropdownOpen(false);
                    }}
                    style={[
                      styles.sortDropdownItem,
                      { borderBottomColor: border },
                      sortOrder === item.value && {
                        backgroundColor: primary + "10",
                      },
                    ]}
                  >
                    <AppText
                      style={{
                        color: sortOrder === item.value ? primary : textPrimary,
                        fontSize: 13,
                        fontWeight: sortOrder === item.value ? "600" : "400",
                      }}
                    >
                      {item.label}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>

      {error ? (
        <View style={styles.center}>
          <AppText variant="bodyMd" style={{ color: errorColor }}>
            {error}
          </AppText>
          <AppButton
            title={t("browse.retry")}
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
              isSaved={savedIds.has(item._id)}
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
              <Ionicons name="leaf-outline" size={48} color={textSecondary} />
              <AppText
                variant="headingSm"
                style={[styles.centerText, { color: textSecondary }]}
              >
                {search || cropFilter !== "All"
                  ? t("browse.noMatch") || "No listings match your filters"
                  : t("browse.empty") || "No listings available right now"}
              </AppText>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15 },
  insightsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 8,
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
  filtersBar: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 4,
  },
  filtersRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  sortButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  sortDropdown: {
    position: "absolute",
    top: 42,
    right: 0,
    width: 150,
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 100,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sortDropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 8,
  },
  centerText: { textAlign: "center" },
});
