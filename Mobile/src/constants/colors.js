

export const neutralColors = {
  // Backgrounds
  backgroundLight: "#FAFAFA",
  backgroundLighter: "#FFFFFF",

  // Cards & Surfaces
  cardBg: "#FFFFFF",
  surfaceLight: "#F5F5F5",

  // Text
  textDark: "#1A1A1A",
  textMedium: "#4A4A4A",
  textLight: "#7A7A7A",
  textPlaceholder: "#B0B0B0",

  // Borders & Dividers
  borderSubtle: "#E5E5E5",
  borderLight: "#EBEBEB",

  // Status
  error: "#EF4444",
  errorLight: "#FEE2E2",
  success: "#10B981",
  successLight: "#DCFCE7",
  warning: "#F59E0B",
  warningLight: "#FEF3C7",
  disabled: "#D1D5DB",
};


export const roleColors = {
  farmer: {
    primary: "#059669", // Green
    light: "#D1FAE5",
    lighter: "#ECFDF5",
  },
  buyer: {
    primary: "#7C3AED", // Purple
    light: "#EDE9FE",
    lighter: "#F5F3FF",
  },
  supplier: {
    primary: "#D97706", // Orange/Gold
    light: "#FED7AA",
    lighter: "#FFFBEB",
  },
  driver: {
    primary: "#4F46E5", // Indigo
    light: "#E0E7FF",
    lighter: "#F0F4FF",
  },
};


export const getRoleColors = (role = "farmer") => {
  return roleColors[role] || roleColors.farmer;
};
