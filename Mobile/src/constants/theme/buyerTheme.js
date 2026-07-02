import baseTheme from "./baseTheme";

const buyerTheme = {
  ...baseTheme,

  role: "buyer",

  colors: {
    ...baseTheme.colors,
    primary: "#1565C0",
    primaryDark: "#0D47A1",
    primaryLight: "#5E92F3",
    primaryContainer: "#E3F2FD",

    secondary: "#00897B",
    accent: "#26A69A",

    background: "#F5F8FF",
    backgroundSecondary: "#EBF3FF",

    surface: "#FFFFFF",
    surfaceElevated: "#FFFFFF",

    card: "#FFFFFF",

    textPrimary: "#0D1B2A",
    textSecondary: "#4A6080",
    textMuted: "#8FA3BE",
    textInverse: "#FFFFFF",

    border: "#D0DEF5",
    divider: "#E8EFFE",

    success: "#2E7D32",
    warning: "#EF6C00",
    error: "#C62828",
    info: "#1565C0",

    disabled: "#B8CADF",

    inputBackground: "#FFFFFF",
    inputBorder: "#C5D9F5",
    inputFocused: "#1565C0",
    inputError: "#C62828",

    tabActive: "#1565C0",
    tabInactive: "#8FA3BE",
    tabBar: "#FFFFFF",
    notification: "#FF5252",

    overlay: "rgba(0,0,0,0.4)",
    shadow: "#000000",
  },
};

export default buyerTheme;
