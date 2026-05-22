import baseTheme from "./baseTheme";

const supplierTheme = {
  ...baseTheme,

  role: "supplier",

  colors: {
    primary: "#FF9800",
    primaryDark: "#EF6C00",
    primaryLight: "#FFB74D",
    primaryContainer: "#FFF3E0",

    secondary: "#263238",

    accent: "#263238",

    background: "#FFFBF5",
    backgroundSecondary: "#FFF7EB",

    surface: "#FFFFFF",
    surfaceElevated: "#FFFFFF",

    card: "#FFFFFF",

    textPrimary: "#20252A",
    textSecondary: "#5F6770",
    textMuted: "#8A949C",
    textInverse: "#FFFFFF",

    border: "#FFE2B5",
    divider: "#FFF0D6",

    success: "#4CAF50",
    warning: "#FF9800",
    error: "#E53935",
    info: "#2E7DFF",

    disabled: "#D8D0C6",

    inputBackground: "#FFFFFF",
    inputBorder: "#FFE0B2",
    inputFocused: "#FF9800",
    inputError: "#E53935",

    tabActive: "#FF9800",
    tabInactive: "#8F7C66",

    overlay: "rgba(0,0,0,0.3)",
    shadow: "#000",
  },
};

export default supplierTheme;
