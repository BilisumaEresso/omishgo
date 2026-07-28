// Mobile/src/screens/buyer/BrowseScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import BuyerFilterModal from "../../components/buyer/BuyerFilterModal";
import FloatingSearchBar from "../../components/buyer/FloatingSearchBar";
import PostBulkRequestModal from "../../components/buyer/PostBulkRequestModal";
import AppText from "../../components/common/AppText";
import { ProductCard } from "../../components/common/ProductCard";
import DashboardLayout from "../../components/layout/DashBoardLayout";
import BuyerProcurementMetrics from "../../components/buyer/BuyerProcurementMetrics";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useSidebar } from "../../context/SidebarContext";
import { useTheme } from "../../hooks/useTheme";
import browseCacheService from "../../services/browseCache.service";
import { useSavedStore } from "../../store/saved.store";
import { CROP_TYPES, getLocalizedCropName } from "../../constants/crops";
import { useAuthStore } from "../../store/auth.store";

const CATEGORIES = ["All", ...CROP_TYPES];

export default function BrowseScreen({ navigation, onSwitchTab }) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { openSidebar } = useSidebar();
  const { user, language } = useAuthStore();

  // Data states
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [isFromCache, setIsFromCache] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [sortBy, setSortBy] = useState("newest");

  // Modals
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Saved store
  const savedIds = useSavedStore((s) => s.savedIds);
  const toggleSave = useSavedStore((s) => s.toggleSave);
  const fetchSaved = useSavedStore((s) => s.fetchSaved);
  const savedInitialized = useSavedStore((s) => s.initialized);

  const fetchProducts = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const res = await api.get(API_ENDPOINTS.products.list);
      const products = res.data?.data?.products || [];
      setAllProducts(products);
      setIsFromCache(false);
      browseCacheService.set(products);
    } catch (err) {
      const cached = await browseCacheService.get();
      if (cached?.products?.length) {
        setAllProducts(cached.products);
        setIsFromCache(true);
        setError("");
      } else {
        setError(
          err?.response?.data?.message || err.message || t("browse.errorLoadProducts", { defaultValue: "Failed to load products" })
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    if (!savedInitialized) fetchSaved();
  }, [fetchProducts]);

  // Derived filtered products
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const crop = (p.cropType || p.name || "").toLowerCase();
        const farmer = (p.farmerId?.name || "").toLowerCase();
        const region = (p.location?.region || "").toLowerCase();
        const zone = (p.location?.zone || "").toLowerCase();
        const wereda = (p.location?.wereda || "").toLowerCase();
        if (!crop.includes(q) && !farmer.includes(q) && !region.includes(q) && !zone.includes(q) && !wereda.includes(q)) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== "All") {
        const crop = (p.cropType || p.name || "").toLowerCase();
        if (!crop.includes(selectedCategory.toLowerCase())) {
          return false;
        }
      }

      // 3. Region Filter
      if (selectedRegion !== "All Regions") {
        const r = (p.location?.region || p.location?.zone || "").toLowerCase();
        if (!r.includes(selectedRegion.toLowerCase())) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price_desc") return (b.price || 0) - (a.price || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [allProducts, searchQuery, selectedCategory, selectedRegion, sortBy]);

  // Marketplace metrics calculations
  const insights = useMemo(() => {
    const total = allProducts.length;
    const avgPrice =
      total > 0
        ? Math.round(allProducts.reduce((sum, p) => sum + (p.price || 0), 0) / total)
        : 4500;
    const uniqueFarmers = new Set(
      allProducts.map((p) => p.farmerId?.name || p.farmerId?._id).filter(Boolean)
    ).size;
    return { total, avgPrice, uniqueFarmers: uniqueFarmers || 12 };
  }, [allProducts]);

  const handleViewProduct = (product) => {
    navigation.navigate("ListingDetail", { product });
  };

  const hasActiveFilters = selectedCategory !== "All" || selectedRegion !== "All Regions" || sortBy !== "newest";

  const primaryColor = theme?.colors?.primary || "#1565C0";
  const surfaceColor = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";

  // Fixed floating search header component underneath AppHeader
  const fixedSearchHeader = (
    <FloatingSearchBar
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onFilterPress={() => setIsFilterModalOpen(true)}
      products={allProducts}
      onSelectProduct={handleViewProduct}
      hasActiveFilters={hasActiveFilters}
    />
  );

  return (
    <>
      <DashboardLayout
        role="buyer"
        title={t("browse.title", { defaultValue: "Marketplace Produce" })}
        showBack={false}
        fixedHeader={fixedSearchHeader}
        onRefresh={() => fetchProducts(true)}
        refreshing={refreshing}
      >
        {/* Offline Banner if cache is active */}
        {isFromCache && (
          <View style={styles.offlineBanner}>
            <Ionicons name="cloud-offline-outline" size={16} color="#B45309" />
            <AppText style={styles.offlineText}>
              {t("browse.offlineBanner", { defaultValue: "Offline Mode — Displaying cached marketplace listings" })}
            </AppText>
          </View>
        )}

        {/* 1. Dashboard Procurement & Market Overview Component */}
        <BuyerProcurementMetrics
          totalSpend={insights.avgPrice}
          activeOrdersCount={insights.total || 24}
          uniqueFarmersCount={insights.uniqueFarmers || 12}
          currency="ETB/q"
        />

        {/* 2. Crop Category Filter Pills Carousel */}
        <View style={styles.categorySection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {CATEGORIES.map((cat) => {
              const active = cat === selectedCategory;
              const displayCat = getLocalizedCropName(cat, i18n.language || "en", t);
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    active && { backgroundColor: primaryColor, borderColor: primaryColor },
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.8}
                >
                  <AppText style={[styles.categoryChipText, active && styles.activeCategoryText]}>
                    {displayCat}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 3. Section Header & Results Count */}
        <View style={styles.sectionHeader}>
          <AppText style={styles.sectionTitle}>
            {selectedCategory === "All"
              ? t("browse.allListings", { defaultValue: "Wholesale Crop Listings" })
              : t("browse.cropListingsHeader", {
                  crop: getLocalizedCropName(selectedCategory, i18n.language || "en", t),
                  defaultValue: "{{crop}} Listings",
                })}
          </AppText>
          <AppText style={styles.resultsCount}>
            {filteredProducts.length} {t("browse.available", { defaultValue: "Available" })}
          </AppText>
        </View>

        {/* 4. Products List Grid */}
        {loading ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator size="large" color={primaryColor} />
            <AppText style={{ marginTop: 8, color: textSecondary }}>{t("browse.loadingListings", { defaultValue: "Loading crop listings..." })}</AppText>
          </View>
        ) : filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="leaf-outline" size={48} color="#94A3B8" />
            <AppText style={styles.emptyTitle}>{t("buyerDashboard.noProduceMatch", { defaultValue: "No Produce Matches Your Filter" })}</AppText>
            <AppText style={styles.emptySub}>
              {t("buyerDashboard.clearFilterHint", { defaultValue: "Try clearing filters or post a custom bulk sourcing request to notify local farmers." })}
            </AppText>
            <TouchableOpacity
              style={[styles.resetBtn, { backgroundColor: primaryColor }]}
              onPress={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedRegion("All Regions");
              }}
            >
              <AppText style={styles.resetBtnText}>{t("buyerDashboard.resetFilters", { defaultValue: "Reset All Filters" })}</AppText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                theme={theme}
                isSaved={savedIds.has(product._id || product.id)}
                onToggleSave={toggleSave}
                onView={handleViewProduct}
              />
            ))}
          </View>
        )}

        {/* 5. Custom Wholesale Sourcing Banner */}
        <View style={[styles.customSourcingCard, { backgroundColor: primaryColor + "0D", borderColor: primaryColor + "30" }]}>
          <View style={[styles.customSourcingIconWrap, { backgroundColor: primaryColor + "1A" }]}>
            <Ionicons name="bulb-outline" size={20} color={primaryColor} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={[styles.customSourcingTitle, { color: textPrimary }]}>
              {t("buyerDashboard.needCustomVolume", { defaultValue: "Need a Custom Crop Volume?" })}
            </AppText>
            <AppText style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
              {t("buyerDashboard.postCustomDesc", { defaultValue: "Broadcast a custom sourcing request directly to regional farmers in chat." })}
            </AppText>
          </View>
          <TouchableOpacity
            style={[styles.customSourcingBtn, { backgroundColor: primaryColor }]}
            onPress={() => setIsBulkModalOpen(true)}
            activeOpacity={0.85}
          >
            <AppText style={styles.customSourcingBtnText}>{t("buyerDashboard.requestQuote", { defaultValue: "Request Quote" })}</AppText>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacer */}
        <View style={{ height: 80 }} />
      </DashboardLayout>

      {/* Filter Modal */}
      <BuyerFilterModal
        visible={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
        sortBy={sortBy}
        onSelectSortBy={setSortBy}
        onReset={() => {
          setSelectedCategory("All");
          setSelectedRegion("All Regions");
          setSortBy("newest");
        }}
      />

      {/* Bulk Sourcing Request Modal */}
      <PostBulkRequestModal
        visible={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        initialCrop={selectedCategory !== "All" ? selectedCategory : "Red Onion"}
        onSuccess={() => fetchProducts(true)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  offlineBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF3C7",
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
  },
  offlineText: {
    color: "#B45309",
    fontSize: 12,
    fontWeight: "600",
  },
  summaryRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryScroll: {
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  activeCategoryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  productsGrid: {
    gap: 12,
  },
  centerLoading: {
    padding: 40,
    alignItems: "center",
  },
  emptyContainer: {
    padding: 30,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  resetBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  resetBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  customSourcingCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 16,
    gap: 12,
  },
  customSourcingIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  customSourcingTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  customSourcingBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  customSourcingBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
