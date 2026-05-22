/**
 * Permission Utility
 * Maps roles to permissions and provides helper to check permissions.
 */

import { ROLES } from "../constants/roles.js";

// Role → Permissions map (excluding ADMIN)
const ROLE_PERMISSIONS = {
  [ROLES.FARMER]: [
    "SELL_PRODUCTS",
    "BUY_SUPPLIES",
    "VIEW_MARKETPLACE",
  ],
  [ROLES.BUYER]: [
    "BUY_PRODUCTS",
    "VIEW_FARM_PRODUCTS",
  ],
  [ROLES.SUPPLIER]: [
    "MANAGE_SUPPLIES",
    "VIEW_SUPPLY_MARKET",
    "SELL_TO_FARMERS",
  ],
  [ROLES.DRIVER]: [
    "VIEW_DELIVERIES",
    "ACCEPT_DELIVERY",
    "UPDATE_DELIVERY_STATUS",
  ],
};

/**
 * Check if a user has a given permission.
 *
 * @param {Object} user - User object (from auth middleware). Must contain activeRole.
 * @param {string} permission - Permission string to check.
 * @returns {boolean} True if the user's activeRole grants the permission.
 */
export const hasPermission = (user, permission) => {
  if (!user || !user.activeRole) return false;
  const perms = ROLE_PERMISSIONS[user.activeRole] || [];
  return perms.includes(permission);
};
