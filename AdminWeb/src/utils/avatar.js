/**
 * Get display avatar URL for a user
 * @param {Object} user - User object containing avatarUrl, name
 * @param {Object} options - Optional avatar styling options
 * @returns {string} Image source URL
 */
export const getUserAvatarUrl = (user, options = {}) => {
  if (user && user.avatarUrl && typeof user.avatarUrl === "string" && user.avatarUrl.trim() !== "") {
    return user.avatarUrl;
  }

  const name = encodeURIComponent(user?.name || "User");
  const bg = options.bg || "4880FF";
  const color = options.color || "fff";
  const bold = options.bold !== undefined ? options.bold : true;

  return `https://ui-avatars.com/api/?name=${name}&background=${bg}&color=${color}&bold=${bold}`;
};

/**
 * Format full location string (Region / Zone / Wereda / Kebele)
 * @param {Object} location - Location object
 * @returns {string} Formatted location string
 */
export const formatLocation = (location) => {
  if (!location) return "—";
  if (typeof location === "string") return location;
  
  const parts = [
    location.region,
    location.zone,
    location.wereda,
    location.kebele
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" / ") : "—";
};
