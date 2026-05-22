/**
 * Access utility based on role subscription and permissions.
 * Determines whether a user can access a given permission.
 */

import { ROLES } from "../constants/roles.js";
import { hasPermission } from "./permissions.js";

// Free roles that never expire
const FREE_ROLES = [ROLES.FARMER, ROLES.BUYER];

/**
 * Check if a user has access to a permission, taking into account subscription status.
 *
 * @param {Object} user - User object (should contain activeRole and roles array).
 * @param {string} permission - Permission string to check.
 * @returns {boolean} True if allowed, false otherwise.
 */
export const hasAccess = (user, permission) => {
  if (!user || !user.activeRole) return false;
  const role = user.activeRole;

  // Free roles always have access if permission matches their allowed set.
  if (FREE_ROLES.includes(role)) {
    return hasPermission(user, permission);
  }

  // Find the role entry in user's roles array
  const roleEntry = (user.roles || []).find((r) => r.type === role);
  if (!roleEntry) return false;

  const { subscription } = roleEntry;
  if (!subscription) return false;

  const now = new Date();
  const isActive = subscription.isActive && subscription.expiresAt && new Date(subscription.expiresAt) > now;
  if (!isActive) return false;

  // Subscription is active, now check permission.
  return hasPermission(user, permission);
};
