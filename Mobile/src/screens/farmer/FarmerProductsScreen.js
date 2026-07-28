// Mobile/src/screens/farmer/FarmerProductsScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "../../components/common/AppText";
import FarmerProductsHeroCard from "../../components/farmer/FarmerProductsHeroCard";
import FarmerProductsMetricsBar from "../../components/farmer/FarmerProductsMetricsBar";
import DashboardLayout from "../../components/layout/DashBoardLayout";
import FloatingActionButton from "../../components/layout/FloatingActionBotton";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useSidebar } from "../../context/SidebarContext";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

const FarmerProductsScreen = ({ navigation, onSwitchTab }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const { openSidebar } = useSidebar();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingProductId, setUpdatingProductId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const primary = theme?.colors?.primary || "#15803D";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";
  const success = "#16A34A";
  const warning = "#D97706";
  const errorColor = "#DC2626";

  const fetchMyProducts = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const res = await api.get(API_ENDPOINTS.products.list, {
        params: { farmerId: user?._id || user?.id },
      });
      const raw = res.data?.data?.products || [];
      const normalized = raw.map((p) => {
        let locString = t("common.unknownLocation", { defaultValue: "Location Not Provided" });
        if (p.location) {
          locString = [p.location.wereda, p.location.zone, p.location.region]
            .filter(Boolean)
            .join(", ") || t("common.unknownLocation", { defaultValue: "Location Not Provided" });
        }

        return {
          id: p._id,
          cropType: p.cropType || p.category || t("farmerProducts.defaultCropType", { defaultValue: "Harvest Crop" }),
          quantity: p.quantity ?? 0,
          unit: p.unit || "q",
          price: p.price ?? 0,
          location: locString,
          status: p.status || "active",
          photos: p.photos || [],
          description: p.description || "",
          postedDate: new Date(p.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
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

  // Calculations
  const countActive = useMemo(() => products.filter((p) => p.status === "active").length, [products]);
  const countSold = useMemo(() => products.filter((p) => p.status === "sold").length, [products]);
  const countDraft = useMemo(() => products.filter((p) => p.status === "draft").length, [products]);

  const totalVolume = useMemo(() => {
    return products
      .filter((p) => p.status === "active")
      .reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
  }, [products]);

  const totalValuation = useMemo(() => {
    return products
      .filter((p) => p.status === "active")
      .reduce((sum, p) => sum + (Number(p.price) || 0) * (Number(p.quantity) || 1), 0);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedFilter === "active") return products.filter((p) => p.status === "active");
    if (selectedFilter === "sold") return products.filter((p) => p.status === "sold");
    if (selectedFilter === "draft") return products.filter((p) => p.status === "draft");
    return products;
  }, [products, selectedFilter]);

  const markAsSold = async (id) => {
    setUpdatingProductId(id);
    try {
      await api.put(API_ENDPOINTS.products.update(id), { status: "sold" });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "sold" } : p))
      );
    } catch (err) {
      Alert.alert(
        t("farmerProducts.unableToMarkSoldTitle", { defaultValue: "Status Update Failed" }),
        err?.response?.data?.message || t("farmerProducts.unableToMarkSoldMessage", { defaultValue: "Unable to mark crop as sold out." })
      );
    } finally {
      setUpdatingProductId(null);
    }
  };

  const renderProductCard = ({ item }) => {
    const isSold = item.status === "sold";
    const statusBg = item.status === "active" ? "#DCFCE7" : item.status === "sold" ? "#F1F5F9" : "#FEF3C7";
    const statusTextColor = item.status === "active" ? "#16A34A" : item.status === "sold" ? "#64748B" : "#D97706";
    const statusLabel = item.status === "active"
      ? t("farmerProducts.statusActive", { defaultValue: "Active Stock" })
      : item.status === "sold"
      ? t("farmerProducts.statusSold", { defaultValue: "Sold Out" })
      : t("farmerProducts.statusDraft", { defaultValue: "Draft" });

    const stockTotalVal = (Number(item.price) || 0) * (Number(item.quantity) || 1);

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.card, { backgroundColor: surface }]}
        onPress={() => navigation?.navigate("EditProduct", { product: item._raw })}
      >
        <View style={styles.cardHeaderRow}>
          <View style={styles.cropTitleWrap}>
            <View style={styles.cropIconBg}>
              <Ionicons name="leaf" size={18} color="#15803D" />
            </View>
            <View>
              <AppText style={[styles.cropName, { color: textPrimary }]}>{item.cropType}</AppText>
              <AppText style={styles.dateText}>
                {t("farmerProducts.postedLabel", { date: item.postedDate, defaultValue: "Posted {{date}}" })}
              </AppText>
            </View>
          </View>

          <View style={[styles.badge, { backgroundColor: statusBg }]}>
            <AppText style={[styles.badgeText, { color: statusTextColor }]}>{statusLabel}</AppText>
          </View>
        </View>

        <View style={styles.specGrid}>
          <View style={styles.specItem}>
            <AppText style={styles.specLabel}>{t("postProduct.stockQuantity", { defaultValue: "Available Volume" })}</AppText>
            <AppText style={styles.specVal}>{item.quantity} {item.unit}</AppText>
          </View>
          <View style={styles.specItem}>
            <AppText style={styles.specLabel}>{t("listingDetail.unitRate", { defaultValue: "Unit Price" })}</AppText>
            <AppText style={styles.specVal}>ETB {Number(item.price).toLocaleString()}/{item.unit}</AppText>
          </View>
          <View style={styles.specItem}>
            <AppText style={styles.specLabel}>{t("listingDetail.batchValue", { defaultValue: "Batch Value" })}</AppText>
            <AppText style={[styles.specVal, { color: primary }]}>ETB {stockTotalVal.toLocaleString()}</AppText>
          </View>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location" size={14} color="#64748B" />
          <AppText style={styles.locationText}>{item.location}</AppText>
        </View>

        {!isSold && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.editBtn]}
              onPress={() => navigation?.navigate("EditProduct", { product: item._raw })}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={14} color="#15803D" />
              <AppText style={styles.editBtnText}>{t("common.edit", { defaultValue: "Edit Listing" })}</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.soldBtn]}
              onPress={() => markAsSold(item.id)}
              disabled={updatingProductId === item.id}
              activeOpacity={0.8}
            >
              {updatingProductId === item.id ? (
                <ActivityIndicator size="small" color="#DC2626" />
              ) : (
                <>
                  <Ionicons name="checkmark-done" size={14} color="#DC2626" />
                  <AppText style={styles.soldBtnText}>{t("farmerProducts.markSoldOut", "Mark Sold Out")}</AppText>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconBg}>
        <Ionicons name="leaf-outline" size={48} color={primary} />
      </View>
      <AppText style={[styles.emptyTitle, { color: textPrimary }]}>{t("farmerProducts.noCropsTitle", "No Harvest Crops Listed")}</AppText>
      <AppText style={styles.emptySub}>
        {t("farmerProducts.noCropsSub", "Post your agricultural produce so wholesale buyers across Ethiopia can discover and order your harvest.")}
      </AppText>
      <TouchableOpacity
        style={[styles.postFirstBtn, { backgroundColor: primary }]}
        onPress={() => navigation?.navigate("PostProduct")}
        activeOpacity={0.85}
      >
        <AppText style={styles.postFirstBtnText}>{t("farmerProducts.postFirstHarvest", "+ Post Your First Harvest")}</AppText>
      </TouchableOpacity>
    </View>
  );

  const filterTabs = [
    { id: "all", label: t("farmerProducts.filterAll", { count: products.length, defaultValue: "All ({{count}})" }) },
    { id: "active", label: t("farmerProducts.filterActive", { count: countActive, defaultValue: "Active ({{count}})" }) },
    { id: "sold", label: t("farmerProducts.filterSold", { count: countSold, defaultValue: "Sold ({{count}})" }) },
    { id: "draft", label: t("farmerProducts.filterDraft", { count: countDraft, defaultValue: "Drafts ({{count}})" }) },
  ];

  return (
    <DashboardLayout
      title={t("farmerProducts.title", { defaultValue: "My Crop Stock" })}
      subtitle={t("farmerProducts.subtitle", { defaultValue: "Manage harvest inventory & wholesale listings" })}
      role="farmer"
      showMenu
      onMenuPress={openSidebar}
      showNotification
      notificationCount={0}
      onNotificationPress={() => navigation.navigate("Notifications")}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      scrollable
      contentPaddingHorizontal={14}
      navigation={navigation}
    >
      {/* 1. Hero Inventory Card */}
      <FarmerProductsHeroCard
        totalVolume={totalVolume}
        totalValuation={totalValuation}
        currency="ETB"
        onPostHarvest={() => navigation.navigate("PostProduct")}
      />

      {/* 2. Metrics Bar */}
      <FarmerProductsMetricsBar
        activeListingsCount={countActive}
        soldOutCount={countSold}
        currency="ETB"
        onActivePress={() => setSelectedFilter("active")}
        onSoldPress={() => setSelectedFilter("sold")}
      />

      {/* 3. Category Filter Pills */}
      <View style={styles.filterRow}>
        {filterTabs.map((tab) => {
          const isActive = selectedFilter === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.filterPill,
                isActive ? { backgroundColor: primary } : { backgroundColor: "#F1F5F9" },
              ]}
              onPress={() => setSelectedFilter(tab.id)}
              activeOpacity={0.8}
            >
              <AppText
                style={[
                  styles.filterPillText,
                  isActive ? { color: "#FFFFFF" } : { color: textSecondary },
                ]}
              >
                {tab.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 4. Product Cards List */}
      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      ) : filteredProducts.length === 0 ? (
        renderEmpty()
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProductCard}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={{ height: 80 }} />

      <FloatingActionButton
        icon="add"
        onPress={() => navigation?.navigate("PostProduct")}
        bottom={24}
        right={24}
      />
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: "700",
  },
  centerLoading: {
    paddingVertical: 40,
    alignItems: "center",
  },
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  cropTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cropIconBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },
  cropName: {
    fontSize: 16,
    fontWeight: "800",
  },
  dateText: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11.5,
    fontWeight: "800",
  },
  specGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  specItem: {
    gap: 2,
  },
  specLabel: {
    fontSize: 10.5,
    color: "#64748B",
    fontWeight: "600",
  },
  specVal: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 14,
  },
  locationText: {
    fontSize: 12,
    color: "#64748B",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 12,
  },
  editBtn: {
    backgroundColor: "#DCFCE7",
  },
  editBtnText: {
    color: "#15803D",
    fontSize: 12,
    fontWeight: "800",
  },
  soldBtn: {
    backgroundColor: "#FEF2F2",
  },
  soldBtnText: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "800",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 36,
    paddingHorizontal: 20,
    gap: 12,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
  },
  emptySub: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 19,
  },
  postFirstBtn: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 14,
    marginTop: 6,
  },
  postFirstBtnText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "800",
  },
});

export default FarmerProductsScreen;
