import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import DashboardLayout from "../../components/layout/DashBoardLayout";
import AppSidebar from "../../components/layout/AppSidebar";
import SupplierQuickActions from "../../components/supplier/SupplierQuickActions";
import SalesSummaryWidget from "../../components/supplier/SalesSummaryWidget";
import InventoryLowStockWidget from "../../components/supplier/InventoryLowStockWidget";
import MarketDemandNote from "../../components/supplier/MarketDemandNote";
import RecentSupplierOrders from "../../components/supplier/RecentSupplierOrders";
import { useTheme } from "../../hooks/useTheme";

// ---------- Mock Data (extended) ----------
const mockOrders = [
  {
    id: "ORD-4092",
    buyerName: "Adama Coop Union",
    price: 125000,
    status: "Pending",
    date: "2025-04-18",
    type: "cooperative",
  },
  {
    id: "ORD-4091",
    buyerName: "Bishoftu Agro Dealer",
    price: 47800,
    status: "Processing",
    date: "2025-04-17",
    type: "retailer",
  },
  {
    id: "ORD-4090",
    buyerName: "Debre Zeit Farm Center",
    price: 82900,
    status: "Delivered",
    date: "2025-04-16",
    type: "farmcenter",
  },
];

const mockLowStockAlerts = [
  {
    id: "a1",
    item: "DAP Fertilizer",
    amount: "120 bags left",
    status: "critical",
  },
  { id: "a2", item: "Urea 50kg", amount: "85 bags left", status: "warning" },
];

export default function SupplierDashboardScreen({ navigation }) {
  const { theme } = useTheme();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [salesSum, setSalesSum] = useState(45200);

  const handleAddSale = () => {
    setSalesSum((prev) => prev + 3500);
  };

  const handleSidebarItemPress = (item) => {
    if (item.route === "Logout") {
      navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
    } else if (item.route) {
      navigation.navigate(item.route);
    }
  };

  return (
    <>
      <DashboardLayout
        title="Supplier Dashboard"
        subtitle="Good morning, Bekele Trading"
        role="supplier"
        activeTab="Dashboard"
        onTabPress={(tab) => console.log(tab)}
        scrollable={true}
        showMenu={true}
        onMenuPress={() => setSidebarVisible(true)}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <SupplierQuickActions onAddSale={handleAddSale} />
          <SalesSummaryWidget salesSum={salesSum} onAddSale={handleAddSale} />
          <InventoryLowStockWidget alerts={mockLowStockAlerts} />
          <MarketDemandNote />
          <RecentSupplierOrders orders={mockOrders} />
        </ScrollView>
      </DashboardLayout>

      <AppSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        role="supplier"
        onItemPress={handleSidebarItemPress}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
});
