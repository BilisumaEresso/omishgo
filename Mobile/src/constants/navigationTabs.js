import { ROLES } from "./roles";

export const ROLE_TABS = {
  [ROLES.FARMER]: [
    {
      key: "orders",
      label: "Orders",
      icon: "receipt-outline",
      activeIcon: "receipt",
      route: "FarmerOrders",
    },
    {
      key: "products",
      label: "Products",
      icon: "leaf-outline",
      activeIcon: "leaf",
      route: "FarmerProducts",
    },
    {
      key: "home",
      label: "Home",
      icon: "home-outline",
      activeIcon: "home",
      route: "FarmerHome",
    },
    {
      key: "analytics",
      label: "Insights",
      icon: "stats-chart-outline",
      activeIcon: "stats-chart",
      route: "FarmerAnalytics",
    },
    {
      key: "profile",
      label: "Profile",
      icon: "person-outline",
      activeIcon: "person",
      route: "FarmerProfile",
    },
  ],
  [ROLES.BUYER]: [
    {
      key: "orders",
      label: "Orders",
      icon: "receipt-outline",
      activeIcon: "receipt",
      route: "BuyerOrders",
    },
    {
      key: "marketplace",
      label: "Marketplace",
      icon: "storefront-outline",
      activeIcon: "storefront",
      route: "BuyerMarketplace",
    },
    {
      key: "home",
      label: "Home",
      icon: "home-outline",
      activeIcon: "home",
      route: "BuyerHome",
    },
    {
      key: "saved",
      label: "Saved",
      icon: "bookmark-outline",
      activeIcon: "bookmark",
      route: "BuyerSaved",
    },
    {
      key: "profile",
      label: "Profile",
      icon: "person-outline",
      activeIcon: "person",
      route: "BuyerProfile",
    },
  ],
};

export const getLocalizedTabs = (role, t) => {
  const tabs = ROLE_TABS[role] || ROLE_TABS[ROLES.BUYER];
  if (!t) return tabs;

  return tabs.map((tab) => ({
    ...tab,
    label: t(`tabs.${tab.key}`, { defaultValue: tab.label }),
  }));
};

