import baseTheme from "./baseTheme.js";

const farmerTheme = {
  ...baseTheme,

  role: "farmer",

  colors: {
    ...baseTheme.colors,
    primary: "#2E7D32",
    primaryDark: "#1B5E20",
    primaryLight: "#66BB6A",
    primaryContainer: "#E8F5E9",

    secondary: "#F57F17",
    accent: "#FF8F00",

    background: "#F9FBF9",
    backgroundSecondary: "#EEF5EE",

    surface: "#FFFFFF",
    surfaceElevated: "#FFFFFF",

    card: "#FFFFFF",

    textPrimary: "#1A2E1A",
    textSecondary: "#4A6741",
    textMuted: "#8FAF8A",
    textInverse: "#FFFFFF",

    border: "#D0E8CE",
    divider: "#E8F3E7",

    success: "#2E7D32",
    warning: "#F57F17",
    error: "#C62828",
    info: "#0277BD",

    disabled: "#B0CDB0",

    inputBackground: "#FFFFFF",
    inputBorder: "#C8E6C9",
    inputFocused: "#2E7D32",
    inputError: "#C62828",

    tabActive: "#2E7D32",
    tabInactive: "#90A4AE",
    tabBar: "#FFFFFF",
    notification: "#FF5252",

    overlay: "rgba(0,0,0,0.4)",
    shadow: "#000000",
  },
};

export default farmerTheme;
