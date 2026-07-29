// Mobile/src/constants/statuses.js
import i18n from "../locales/i18n";

/**
 * Order Status Definitions & Badges
 */
export const ORDER_STATUSES = {
  pending: {
    key: "pending",
    color: "#D97706",
    bg: "#FEF3C7",
  },
  confirmed: {
    key: "confirmed",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  in_transit: {
    key: "in_transit",
    color: "#7C3AED",
    bg: "#F3E8FF",
  },
  delivered: {
    key: "delivered",
    color: "#16A34A",
    bg: "#DCFCE7",
  },
  completed: {
    key: "completed",
    color: "#16A34A",
    bg: "#DCFCE7",
  },
  cancelled: {
    key: "cancelled",
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
    color: "#15803D",
    bg: "#DCFCE7",
  },
  sold: {
    key: "sold",
    color: "#DC2626",
    bg: "#FEF2F2",
  },
  draft: {
    key: "draft",
    color: "#D97706",
    bg: "#FEF3C7",
  },
};

/**
 * Get localized order status config object using unified locale bundles
 */
export const getOrderStatusConfig = (statusKey, lang = "en", t = null) => {
  const normalized = (statusKey || "pending").toLowerCase();
  const config = ORDER_STATUSES[normalized] || ORDER_STATUSES.pending;
  const translatedLabel = t
    ? t(`statuses.${normalized}`, { defaultValue: normalized })
    : i18n.t(`statuses.${normalized}`, { lng: lang, defaultValue: normalized });

  return {
    ...config,
    displayLabel: translatedLabel,
  };
};

/**
 * Get localized listing status config object using unified locale bundles
 */
export const getListingStatusConfig = (statusKey, lang = "en", t = null) => {
  const normalized = (statusKey || "active").toLowerCase();
  const config = LISTING_STATUSES[normalized] || LISTING_STATUSES.active;
  const translatedLabel = t
    ? t(`statuses.${normalized}`, { defaultValue: normalized })
    : i18n.t(`statuses.${normalized}`, { lng: lang, defaultValue: normalized });

  return {
    ...config,
    displayLabel: translatedLabel,
  };
};
