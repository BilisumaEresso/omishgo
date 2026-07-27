import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import BuyerCategorySpendingList from "../../components/buyer/BuyerCategorySpendingList";
import BuyerFilterModal from "../../components/buyer/BuyerFilterModal";
import PostBulkRequestModal from "../../components/buyer/PostBulkRequestModal";
import BuyerHeroBudgetCard from "../../components/buyer/BuyerHeroBudgetCard";
import BuyerProcurementMetrics from "../../components/buyer/BuyerProcurementMetrics";
import BuyerSourcingGoalCard from "../../components/buyer/BuyerSourcingGoalCard";
import BuyerSpendingChartWidget from "../../components/buyer/BuyerSpendingChartWidget";
import CategoryFilters from "../../components/buyer/CategoryFilters";
import FeaturedProductsList from "../../components/buyer/FeaturedProductsList";
import FloatingSearchBar from "../../components/buyer/FloatingSearchBar";
import NearbyFarmersList from "../../components/buyer/NearbyFarmersList";
import PriceTrendWidget from "../../components/buyer/PriceTrendWidget";
import RecentActivityList from "../../components/buyer/RecentActivityList";
import AppText from "../../components/common/AppText";
import DashboardLayout from "../../components/layout/DashBoardLayout";
import FloatingActionButton from "../../components/layout/FloatingActionBotton";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useSidebar } from "../../context/SidebarContext";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "react-i18next";
import { CROP_TYPES, getLocalizedCropName } from "../../constants/crops";
import { useAuthStore } from "../../store/auth.store";

const CATEGORIES = ["All", "Vegetables", ...CROP_TYPES];

export default function BuyerDashboardScreen({ navigation, onSwitchTab }) {
  const { theme } = useTheme();
  const user = useAuthStore((state) => state.user);
  const { t } = useTranslation();
  const { openSidebar } = useSidebar();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [sortBy, setSortBy] = useState("newest");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const [cartCount, setCartCount] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [products, setProducts] = useState([]);
  const [saved, setSaved] = useState([]);
  const [orders, setOrders] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const primaryColor = theme?.colors?.primary || "#1565C0";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";

  // Fetch real data on mount
  const loadDashboardData = async () => {
    try {
      // 1. Fetch products
      const prodRes = await api.get(API_ENDPOINTS.products.list);
      const fetchedProds = prodRes.data?.data?.products || [];
      const formattedProds = fetchedProds.map((p) => ({
        _id: p._id,
        cropType: p.cropType || p.category || "Produce",
        quantity: p.quantity ?? 0,
        unit: p.unit || "kg",
        price: p.price,
        category: p.cropType || p.category,
        farmerId: p.farmerId || { _id: p.farmerId, name: "Farmer" },
        location: p.location || {},
        photos: p.photos || [],
        status: p.status || "active",
        createdAt: p.createdAt,
        description: p.description,
      }));
      setProducts(formattedProds);

      // Derive nearby farmers from real products
      const farmerMap = {};
      formattedProds.forEach((p) => {
        const f = p.farmerId || {};
        const fid = f._id || f;
        if (fid && !farmerMap[fid]) {
          farmerMap[fid] = {
            _id: fid,
            name: f.name || p.farmerName || "Farmer",
            avatar: f.avatar || null,
            distance: p.distance || "3.2 km",
            location: p.location || {},
            rating: f.rating || "4.8",
          };
        }
      });
      setFarmers(Object.values(farmerMap).slice(0, 5));

      // 2. Fetch real orders
      const orderRes = await api.get(API_ENDPOINTS.orders.list);
      const fetchedOrders = orderRes.data?.data?.orders || [];
      setOrders(fetchedOrders);

      // 3. Fetch real saved items
      const savedRes = await api.get(API_ENDPOINTS.saved.list);
      const fetchedSaved = savedRes.data?.data?.products || [];
      setSaved(fetchedSaved);

      // 4. Fetch real activities
      const actRes = await api.get(API_ENDPOINTS.users.activities);
      const fetchedActs = actRes.data?.data?.activities || [];
      setActivities(
        fetchedActs.map((a) => ({
          id: a.id || a._id,
          type: a.type,
          title: a.title,
          description: a.description,
          time: a.time,
          order: a._raw || a.order || null,
          farmerId: a.farmerId || null,
        }))
      );
    } catch (err) {
      console.warn("Buyer Dashboard data fetch error:", err.message);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Calculations derived strictly from real API data
  const totalSpend = useMemo(() => {
    return orders.reduce(
      (sum, o) => sum + (Number(o.totalPrice || o.price) || 0),
      0
    );
  }, [orders]);

  const activeOrdersCount = useMemo(() => {
    return orders.filter(
      (o) => o.status !== "delivered" && o.status !== "cancelled"
    ).length;
  }, [orders]);

  // Derived category breakdown from real orders/products
  const categoryBreakdown = useMemo(() => {
    if (orders.length === 0) {
      return [
        {
          id: "c1",
          category: "Vegetables & Greens",
          icon: "leaf",
          bgColor: "#E0F2FE",
          iconColor: "#0284C7",
          amount: Math.round(totalSpend * 0.45) || 0,
          date: "This Month",
          method: "Mobile Money",
        },
        {
          id: "c2",
          category: "Teff & Grains",
          icon: "nutrition",
          bgColor: "#EDE9FE",
          iconColor: "#7C3AED",
          amount: Math.round(totalSpend * 0.35) || 0,
          date: "This Month",
          method: "Bank Transfer",
        },
        {
          id: "c3",
          category: "Pulses & Oilseeds",
          icon: "cube",
          bgColor: "#FEF3C7",
          iconColor: "#D97706",
          amount: Math.round(totalSpend * 0.2) || 0,
          date: "This Month",
          method: "CBE Birr",
        },
      ];
    }
    const catMap = {};
    orders.forEach((o) => {
      const cat = o.cropType || o.category || "General Produce";
      catMap[cat] = (catMap[cat] || 0) + (Number(o.totalPrice || o.price) || 0);
    });
    const colorPairs = [
      { bgColor: "#E0F2FE", iconColor: "#0284C7", icon: "leaf" },
      { bgColor: "#EDE9FE", iconColor: "#7C3AED", icon: "nutrition" },
      { bgColor: "#FEF3C7", iconColor: "#D97706", icon: "cube" },
    ];
    return Object.entries(catMap).map(([category, amount], idx) => {
      const pair = colorPairs[idx % colorPairs.length];
      return {
        id: category,
        category,
        amount,
        date: "Recent",
        method: "Verified Order",
        ...pair,
      };
    });
  }, [orders, totalSpend]);

  const hasActiveFilters =
    selectedCategory !== "All" ||
    selectedRegion !== "All Regions" ||
    sortBy !== "newest";

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSelectedRegion("All Regions");
    setSortBy("newest");
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = q
        ? (p.cropType || "").toLowerCase().includes(q) ||
          (p.farmerId?.name || "").toLowerCase().includes(q) ||
          (p.location?.region || "").toLowerCase().includes(q) ||
          (p.location?.zone || "").toLowerCase().includes(q) ||
          (p.location?.wereda || "").toLowerCase().includes(q)
        : true;
      const matchesCat =
        selectedCategory === "All" ||
        p.category === selectedCategory ||
        p.cropType === selectedCategory;
      const matchesRegion =
        selectedRegion === "All Regions" ||
        (p.location?.region || "")
          .toLowerCase()
          .includes(selectedRegion.toLowerCase());
      return matchesSearch && matchesCat && matchesRegion;
    });

    if (sortBy === "price_asc") {
      result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price_desc") {
      result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else {
      result = [...result].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    }
    return result;
  }, [products, searchQuery, selectedCategory, selectedRegion, sortBy]);

  const handleViewProduct = (product) => {
    navigation?.navigate("ListingDetail", { product });
  };

  const handleFarmerPress = (farmer) => {
    const farmerId = farmer._id || farmer.id || null;
    if (farmerId) navigation?.navigate("FarmerProfile", { farmerId });
  };

  const handleActivityPress = (activity) => {
    if (activity.type === "order") {
      const order = activity.order || activity._raw || null;
      if (order) navigation?.navigate("OrderDetail", { order, role: "buyer" });
      return;
    }
    const fid = activity.farmerId?._id || activity.farmerId;
    if (fid) navigation?.navigate("FarmerProfile", { farmerId: fid });
  };

  return (
    <>
      <DashboardLayout
        title={t("buyerDashboard.title", { defaultValue: "Dashboard" })}
        subtitle={t("buyerDashboard.welcomeMessage", {
          name: user?.name || t("buyerDashboard.fallbackName", { defaultValue: "Buyer" }),
          defaultValue: "Welcome, {{name}}!",
        })}
        role="buyer"
        scrollable={true}
        showMenu={true}
        onMenuPress={openSidebar}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        notificationMessage={successMsg}
        onDismissNotification={() => setSuccessMsg("")}
        contentPaddingHorizontal={14}
        navigation={navigation}
        fixedHeader={
          <FloatingSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onFilterPress={() => setIsFilterModalOpen(true)}
            products={products}
            onSelectProduct={handleViewProduct}
            hasActiveFilters={hasActiveFilters}
          />
        }
      >
        {/* 1. Hero Card (Matching Image 1 Top Card) */}
        <BuyerHeroBudgetCard
          totalSpend={totalSpend}
          monthlyBudget={50000}
          currency="ETB"
          onSeeDetails={() => onSwitchTab?.("Orders")}
        />

        {/* 2. Procurement Summary 2-Column Metrics (Matching Image 1 "Cash" Cards) */}
        <BuyerProcurementMetrics
          totalSpend={totalSpend}
          activeOrdersCount={activeOrdersCount}
          currency="ETB"
          onActiveOrdersPress={() => onSwitchTab?.("Orders")}
          onPurchasesPress={() => onSwitchTab?.("Orders")}
        />

        {/* 3. Post Bulk Sourcing Banner (Matching Image 1 Middle Card) */}
        <BuyerSourcingGoalCard
          onPress={() => onSwitchTab?.("Marketplace")}
        />

        {/* 4. Spending Chart Analytics (Matching Image 2 Top Area Chart) */}
        <BuyerSpendingChartWidget currency="ETB" />

        {/* 5. Category Procurement Breakdown (Matching Image 2 Bottom List) */}
        <BuyerCategorySpendingList
          categories={categoryBreakdown}
          currency="ETB"
          onCategoryPress={() => onSwitchTab?.("Marketplace")}
        />
        <PriceTrendWidget onPressAnalytics={() => navigation?.navigate("MarketAnalytics")} />

        {/* Featured Products */}
        <View style={styles.sectionHeader}>
          <AppText style={{ fontWeight: "700", color: textPrimary, fontSize: 17 }}>
            {t("buyerDashboard.featuredProducts", "Featured Produce")}
          </AppText>
          <AppText
            style={{ color: primaryColor, fontWeight: "600" }}
            onPress={() => onSwitchTab?.("Marketplace")}
          >
            {t("buyerDashboard.seeAll", "See All")}
          </AppText>
        </View>
        <FeaturedProductsList
          products={filteredProducts}
          onView={handleViewProduct}
        />

        {/* Nearby Farmers */}
        {farmers.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <AppText style={{ fontWeight: "700", color: textPrimary, fontSize: 17 }}>
                {t("buyerDashboard.nearbyFarmers", "Nearby Farmers")}
              </AppText>
              <AppText
                style={{ color: primaryColor, fontWeight: "600" }}
                onPress={() => onSwitchTab?.("Marketplace")}
              >
                {t("buyerDashboard.seeAll", "See All")}
              </AppText>
            </View>
            <NearbyFarmersList
              farmers={farmers}
              onFarmerPress={handleFarmerPress}
            />
          </>
        )}

        {/* Recent Activity */}
        {activities.length > 0 && (
          <RecentActivityList
            activities={activities}
            onActivityPress={handleActivityPress}
          />
        )}

        {/* Custom Wholesale Sourcing Request Card */}
        <View style={[styles.customSourcingCard, { backgroundColor: primaryColor + "0D", borderColor: primaryColor + "30" }]}>
          <View style={[styles.customSourcingIconWrap, { backgroundColor: primaryColor + "1A" }]}>
            <Ionicons name="bulb-outline" size={20} color={primaryColor} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={[styles.customSourcingTitle, { color: textPrimary }]}>
              {t("buyerDashboard.needCustomVolume", { defaultValue: "Need a Custom Crop Volume?" })}
            </AppText>
            <AppText style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
              {t("buyerDashboard.postCustomDesc", { defaultValue: "Post a custom sourcing request to receive direct quotes from verified local producers." })}
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

      {/* Bulk Sourcing Request Modal */}
      <PostBulkRequestModal
        visible={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSuccess={() => loadDashboardData()}
      />

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
        onReset={handleResetFilters}
      />

      {/* Floating Action Button */}
      {cartCount > 0 && (
        <FloatingActionButton
          onPress={() => onSwitchTab?.("Orders")}
          icon="cart"
          bottom={90}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 22,
    marginBottom: 12,
  },
  customSourcingCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 12,
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