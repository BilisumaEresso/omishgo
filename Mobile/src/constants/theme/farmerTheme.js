import baseTheme from "./baseTheme.js";

const farmerTheme = {
  ...baseTheme,

  role: "farmer",

  colors: {
    ...baseTheme.colors,
    primary: "#4CAF50",
    primaryDark: "#388E3C",
    primaryLight: "#81C784",
    primaryContainer: "#E8F5E9",

    secondary: "#8BC34A",

    accent: "#4CAF50",

    background: "#F1F8F6",
    backgroundSecondary: "#E8F5E9",

    surface: "#FFFFFF",
    surfaceElevated: "#FFFFFF",

    card: "#FFFFFF",

    textPrimary: "#1B5E20",
    textSecondary: "#558B2F",
    textMuted: "#9CCC65",
    textInverse: "#FFFFFF",

    border: "#C8E6C9",
    divider: "#E1F5FE",

    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
    info: "#2196F3",

    disabled: "#A5D6A7",

    inputBackground: "#FFFFFF",
    inputBorder: "#C8E6C9",
    inputFocused: "#4CAF50",
    inputError: "#F44336",

    tabActive: "#4CAF50",
    tabInactive: "#558B2F",

    overlay: "rgba(76, 175, 80, 0.3)",
    shadow: "#000",
  },
};

export default farmerTheme;
