// src/screens/farmer/FarmerDashboardScreen.js
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import FarmerActionHub from "../../components/farmer/FarmerActionHub";
import FarmerCropInventoryBreakdown from "../../components/farmer/FarmerCropInventoryBreakdown";
import FarmerHeroHarvestCard from "../../components/farmer/FarmerHeroHarvestCard";
import FarmerMarketOpportunityCard from "../../components/farmer/FarmerMarketOpportunityCard";
import FarmerMarketPriceIndexCard from "../../components/farmer/FarmerMarketPriceIndexCard";
import FarmerOrdersFulfillmentList from "../../components/farmer/FarmerOrdersFulfillmentList";
import FarmerRevenueChartWidget from "../../components/farmer/FarmerRevenueChartWidget";
import FarmerSalesMetrics from "../../components/farmer/FarmerSalesMetrics";
import DashboardLayout from "../../components/layout/DashBoardLayout";
import FloatingActionButton from "../../components/layout/FloatingActionBotton";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useSidebar } from "../../context/SidebarContext";
import draftsService from "../../services/drafts.service";
import { useAuthStore } from "../../store/auth.store";

const mockProductsFallback = [
  { id: "p1", name: "100q White Teff", price: 5200, category: "White Teff", quantity: 100, unit: "q" },
  { id: "p2", name: "50q Red Onion", price: 4500, category: "Red Onion", quantity: 50, unit: "q" },
];

const marketTrends = [
  { crop: "Red Onion", region: "Addis Ababa", price: "4,500 ETB/q", demandChange: "+15%", isUp: true },
  { crop: "White Teff", region: "Regional Hub", price: "5,200 ETB/q", demandChange: "+8%", isUp: true },
  { crop: "Tomato", region: "Adama", price: "3,800 ETB/q", demandChange: "-2%", isUp: false },
];

export default function FarmerDashboardScreen({ navigation, onSwitchTab }) {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const { openSidebar } = useSidebar();

  const [products, setProducts] = useState(mockProductsFallback);
  const [orders, setOrders] = useState([]);
  const [draftCount, setDraftCount] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const biggestMover = useMemo(() => {
    return marketTrends[0];
  }, []);

  const hours = new Date().getHours();
  const greetingText =
    hours < 12
      ? t("farmerDashboard.goodMorning", { defaultValue: "Good Morning" })
      : hours < 17
      ? t("farmerDashboard.goodAfternoon", { defaultValue: "Good Afternoon" })
      : t("farmerDashboard.goodEvening", { defaultValue: "Good Evening" });

  const fetchProducts = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.products.list, {
        params: { farmerId: user?._id || user?.id },
      });
      const raw = res.data?.data?.products || [];
      if (raw.length > 0) {
        setProducts(
          raw.map((p) => ({
            id: p._id,
            name: `${p.quantity}${p.unit || "q"} ${p.cropType || p.category}`,
            price: p.price,
            category: p.cropType || p.category,
            quantity: p.quantity,
            unit: p.unit || "q",
            location: [p.location?.wereda, p.location?.zone, p.location?.region].filter(Boolean).join(", ") || "Ethiopia",
            farmerName: user?.name || "Farmer",
            photos: p.photos || [],
          }))
        );
      }
    } catch (e) {
      console.warn("fetchProducts failed:", e.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.orders.list);
      const raw = res.data?.data?.orders || [];
      setOrders(
        raw.map((o) => ({
          id: o._id,
          cropType: o.productId?.cropType || o.cropType || "Harvest Crop",
          quantity: o.quantity || 0,
          unit: o.unit || "q",
          price: o.priceAtOrder || o.price || 0,
          totalPrice: o.totalPrice || (o.priceAtOrder || 0) * (o.quantity || 1),
          date: new Date(o.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          }),
          status: o.status || "pending",
          buyerName: o.buyerId?.name || "Buyer",
          buyerPhone: o.buyerId?.phone || null,
          buyerId: o.buyerId?._id || o.buyerId,
        }))
      );
    } catch (e) {
      console.warn("fetchOrders failed:", e.message);
    }
  };

  useEffect(() => {
    if (user?.id || user?._id) {
      fetchProducts();
      fetchOrders();
    }
  }, [user?.id, user?._id]);

  useFocusEffect(
    useCallback(() => {
      if (user?.id || user?._id) {
        fetchProducts();
        fetchOrders();
      }
      draftsService.count().then(setDraftCount);
    }, [user?.id, user?._id])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchProducts(), fetchOrders()]);
    setRefreshing(false);
  };

  // Real-time calculations
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status === "completed" || o.status === "delivered" || o.status === "confirmed")
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  }, [orders]);

  const activeInventoryVolume = useMemo(() => {
    return products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
  }, [products]);

  const pendingDispatchesCount = useMemo(() => {
    return orders.filter((o) => o.status !== "completed" && o.status !== "cancelled" && o.status !== "delivered").length;
  }, [orders]);

  const completedOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status === "completed" || o.status === "delivered").length;
  }, [orders]);

  const handleOpportunitySell = () => {
    navigation.navigate("PostProduct", {
      prefill: {
        cropType: biggestMover.crop,
        price: 4500,
        unit: "q",
      },
    });
  };

  const handleListCropAtRate = (item) => {
    const priceNum = item.price ? parseInt(item.price.replace(/[^0-9]/g, ""), 10) : 4500;
    navigation.navigate("PostProduct", {
      prefill: {
        cropType: item.crop,
        price: priceNum,
        unit: "q",
      },
    });
  };

  return (
    <>
      <DashboardLayout
        title={t("farmerDashboard.title", { defaultValue: "Farmer Dashboard" })}
        subtitle={t("farmerDashboard.subtitle", {
          greeting: greetingText,
          name: user?.name || t("farmerDashboard.fallbackName", { defaultValue: "Farmer Producer" }),
          defaultValue: "{{greeting}}, {{name}}!",
        })}
        role="farmer"
        scrollable={true}
        showMenu={true}
        onMenuPress={() => openSidebar(true)}
        showNotification={true}
        notificationCount={0}
        onNotificationPress={() => navigation.navigate("Notifications")}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        notificationMessage={successMsg}
        onDismissNotification={() => setSuccessMsg("")}
        contentPaddingHorizontal={14}
        navigation={navigation}
      >
        {/* 1. Hero Harvest Card */}
        <FarmerHeroHarvestCard
          totalRevenue={totalRevenue}
          activeInventory={activeInventoryVolume}
          currency="ETB"
          onPostHarvest={() => navigation.navigate("PostProduct")}
          onViewOrders={() => onSwitchTab?.("Orders")}
        />

        {/* 2. Sales & Dispatch Metrics (2-Column Cards) */}
        <FarmerSalesMetrics
          pendingOrdersCount={pendingDispatchesCount}
          completedOrdersCount={completedOrdersCount}
          currency="ETB"
          onPendingPress={() => onSwitchTab?.("Orders")}
          onCompletedPress={() => onSwitchTab?.("Orders")}
        />

        {/* 3. Market Opportunity Alert Card */}
        <FarmerMarketOpportunityCard
          cropName={biggestMover.crop}
          demandChange={biggestMover.demandChange}
          targetHub={biggestMover.region}
          suggestedPrice={4500}
          onSellNow={handleOpportunitySell}
        />

        {/* 4. Revenue Trajectory Chart Widget */}
        <FarmerRevenueChartWidget currency="ETB" />

        {/* 5. Crop Stock & Inventory Breakdown */}
        <FarmerCropInventoryBreakdown
          products={products}
          onManageProducts={() => onSwitchTab?.("Products")}
          onProductPress={(p) => navigation.navigate("PostProduct", { prefill: p })}
        />

        {/* ─── BELOW INVENTORY STREAMLINED SECTIONS ─── */}

        {/* 6. Producer Quick Action Hub (Unifies Shortcuts & Drafts) */}
        <FarmerActionHub
          draftCount={draftCount}
          unreadMessages={0}
          onMessagesPress={() => navigation.navigate("Conversations")}
          onAlertsPress={() => navigation.navigate("Notifications")}
          onDraftsPress={() => navigation.navigate("MyDrafts")}
          onAnalyticsPress={() => navigation.navigate("MarketAnalytics")}
        />

        {/* 7. Ethiopian Wholesale Price Index & Demand (Combines Ticker + Market Trends) */}
        <FarmerMarketPriceIndexCard
          trends={marketTrends}
          onSeeAllAnalytics={() => navigation.navigate("MarketAnalytics")}
          onListCropAtRate={handleListCropAtRate}
        />

        {/* 8. Buyer Orders & Fulfillment Feed (Interactive Cards with Chat Buyer button) */}
        <FarmerOrdersFulfillmentList
          orders={orders}
          onViewAllOrders={() => onSwitchTab?.("Orders")}
          onOrderPress={(o) => navigation.navigate("OrderDetail", { order: o, role: "farmer" })}
          onChatBuyer={(o) =>
            navigation.navigate("Chat", {
              userId: o.buyerId,
              userName: o.buyerName,
            })
          }
        />

        <View style={{ height: 80 }} />
      </DashboardLayout>

      {/* Floating Action Button */}
      <FloatingActionButton
        onPress={() =>
          navigation.navigate("PostProduct", {
            prefill: {
              cropType: biggestMover.crop,
              price: 4500,
              unit: "q",
            },
          })
        }
        bottom={28}
      />
    </>
  );
}