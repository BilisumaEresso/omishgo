import { ROLES } from "../constants/roles.js";

const TAB_ROUTE_MAP = {
  [ROLES.FARMER]: {
    Home: "Home",
    FarmerProducts: "Products",
    FarmerOrders: "Orders",
    FarmerAnalytics: "Insights",
    Profile: "Profile",
  },
  [ROLES.BUYER]: {
    Home: "Home",
    BuyerMarketplace: "Marketplace",
    BuyerOrders: "Orders",
    BuyerSaved: "Saved",
    Profile: "Profile",
  },
};

const STACK_ROUTES = new Set([
  "Conversations",
  "Chat",
  "PostProduct",
  "Help",
  "Notifications",
  "ListingDetail",
  "Settings",
]);

export function navigateFromSidebar({ item, navigation, onSwitchTab, role }) {
  if (!item?.route || item.route === "Logout") return;

  const tabMap = TAB_ROUTE_MAP[role] || {};
  const tabTarget = tabMap[item.route];

  if (tabTarget && onSwitchTab) {
    onSwitchTab(tabTarget);
    return;
  }

  if (STACK_ROUTES.has(item.route) && navigation?.navigate) {
    navigation.navigate(item.route);
  }
}
