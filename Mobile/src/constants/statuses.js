// Mobile/src/constants/statuses.js

/**
 * Order Status Definitions & Localized Badges
 */
export const ORDER_STATUSES = {
  pending: {
    key: "pending",
    label: { en: "Pending Dispatch", am: "በመጠበቅ ላይ", om: "Ergaa Eeggataa" },
    color: "#D97706",
    bg: "#FEF3C7",
  },
  confirmed: {
    key: "confirmed",
    label: { en: "Confirmed Order", am: "የተረጋገጠ ትእዛዝ", om: "Ajaja Mirkanaa'e" },
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  in_transit: {
    key: "in_transit",
    label: { en: "In Transit", am: "በመንገድ ላይ", om: "Karaatti Jira" },
    color: "#7C3AED",
    bg: "#F3E8FF",
  },
  delivered: {
    key: "delivered",
    label: { en: "Delivered", am: "ደረሰ", om: "Gahaa Raawwate" },
    color: "#16A34A",
    bg: "#DCFCE7",
  },
  completed: {
    key: "completed",
    label: { en: "Completed", am: "ተጠናቋል", om: "Xumuramaa" },
    color: "#16A34A",
    bg: "#DCFCE7",
  },
  cancelled: {
    key: "cancelled",
    label: { en: "Cancelled", am: "ተሰርዟል", om: "Haqamaa" },
    color: "#DC2626",
    bg: "#FEF2F2",
  },
};

/**
 * Listing Availability Status Definitions
 */
export const LISTING_STATUSES = {
  active: {
    key: "active",
    label: { en: "Active Stock", am: "በገበያ ላይ", om: "Gabaa Irra Jira" },
    color: "#15803D",
    bg: "#DCFCE7",
  },
  sold: {
    key: "sold",
    label: { en: "Sold Out", am: "ተሸጦ አልቋል", om: "Dhumateera" },
    color: "#DC2626",
    bg: "#FEF2F2",
  },
  draft: {
    key: "draft",
    label: { en: "Offline Draft", am: "ረቂቅ", om: "Waraqaa Gabaabaa" },
    color: "#D97706",
    bg: "#FEF3C7",
  },
};

/**
 * Get localized order status config object
 */
export const getOrderStatusConfig = (statusKey, lang = "en", t = null) => {
  const normalized = (statusKey || "pending").toLowerCase();
  const config = ORDER_STATUSES[normalized] || ORDER_STATUSES.pending;
  const translatedLabel = t ? t(`buyerOrders.status${normalized.charAt(0).toUpperCase() + normalized.slice(1)}`, { defaultValue: config.label[lang] || config.label.en || statusKey }) : (config.label[lang] || config.label.en || statusKey);

  return {
    ...config,
    displayLabel: translatedLabel,
  };
};

/**
 * Get localized listing status config object
 */
export const getListingStatusConfig = (statusKey, lang = "en", t = null) => {
  const normalized = (statusKey || "active").toLowerCase();
  const config = LISTING_STATUSES[normalized] || LISTING_STATUSES.active;
  const translatedLabel = t ? t(`farmerProducts.status${normalized.charAt(0).toUpperCase() + normalized.slice(1)}`, { defaultValue: config.label[lang] || config.label.en || statusKey }) : (config.label[lang] || config.label.en || statusKey);

  return {
    ...config,
    displayLabel: translatedLabel,
  };
};

