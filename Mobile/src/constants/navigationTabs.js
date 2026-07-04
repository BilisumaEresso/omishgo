import { ROLES } from "./roles";

export const ROLE_TABS = {
  [ROLES.FARMER]: [
    { label: "Orders",   icon: "receipt-outline",    activeIcon: "receipt",     route: "FarmerOrders" },
    { label: "Products", icon: "leaf-outline",       activeIcon: "leaf",        route: "FarmerProducts" },
    { label: "Home",     icon: "home-outline",       activeIcon: "home",        route: "FarmerHome" },
    { label: "Insights", icon: "stats-chart-outline",activeIcon: "stats-chart", route: "FarmerAnalytics" },
    { label: "Profile",  icon: "person-outline",     activeIcon: "person",      route: "FarmerProfile" },
  ],
  [ROLES.BUYER]: [
    { label: "Orders",      icon: "receipt-outline",    activeIcon: "receipt",    route: "BuyerOrders" },
    { label: "Marketplace", icon: "storefront-outline", activeIcon: "storefront", route: "BuyerMarketplace" },
    { label: "Home",        icon: "home-outline",       activeIcon: "home",       route: "BuyerHome" },
    { label: "Saved",       icon: "bookmark-outline",   activeIcon: "bookmark",   route: "BuyerSaved" },
    { label: "Profile",     icon: "person-outline",     activeIcon: "person",     route: "BuyerProfile" },
  ],
};
