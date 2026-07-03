// src/constants/navigationTabs.js
import { ROLES } from "./roles";

export const ROLE_TABS = {

  [ROLES.FARMER]: [
    { label: "Home",   icon: "home",     route: "FarmerHome" },
    { label: "Orders", icon: "cart",     route: "FarmerOrders" },
    { label: "Products", icon: "leaf",   route: "FarmerProducts" },
    { label: "Insights", icon: "bar-chart", route: "FarmerAnalytics" },
    { label: "Profile", icon: "person",  route: "FarmerProfile" },
  ],
  [ROLES.BUYER]: [
    { label: "Home",      icon: "home",       route: "BuyerHome" },
    { label: "Marketplace", icon: "storefront", route: "BuyerMarketplace" },
    { label: "Orders",    icon: "cart",       route: "BuyerOrders" },
    { label: "Saved",     icon: "bookmark",   route: "BuyerSaved" },
    { label: "Profile",   icon: "person",     route: "BuyerProfile" },
  ],

  // [ROLES.SUPPLIER]: [
  //   { label: "Home", icon: "home", route: "SupplierHome" },
  //   { label: "Inventory", icon: "cube", route: "SupplierInventory" },
  //   { label: "Orders", icon: "cart", route: "SupplierOrders" },
  //   { label: "Reports", icon: "document-text", route: "SupplierReports" },
  //   { label: "Profile", icon: "person", route: "SupplierProfile" },
  // ],
  // [ROLES.DRIVER]: [
  //   { label: "Home", icon: "home", route: "DriverHome" },
  //   { label: "Deliveries", icon: "bicycle", route: "DriverDeliveries" },
  //   { label: "Routes", icon: "map", route: "DriverRoutes" },
  //   { label: "History", icon: "time", route: "DriverHistory" },
  //   { label: "Profile", icon: "person", route: "DriverProfile" },
  // ],
};
