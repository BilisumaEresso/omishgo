import baseTheme from "./baseTheme";

const driverTheme = {
  ...baseTheme,

  role: "driver",

  colors: {
    ...baseTheme.colors,
    primary: "#7B61FF",
    primaryDark: "#5E35B1",
    primaryLight: "#B39DFF",
    primaryContainer: "#F0EDFF",

    secondary: "#FF3D00",

    accent: "#FF3D00",

    background: "#F9F8FF",
    backgroundSecondary: "#F1EEFF",

    surface: "#FFFFFF",
    surfaceElevated: "#FFFFFF",

    card: "#FFFFFF",

    textPrimary: "#211E34",
    textSecondary: "#67627D",
    textMuted: "#A09BB5",
    textInverse: "#FFFFFF",

    border: "#E0D9FF",
    divider: "#EEE9FF",

    success: "#4CAF50",
    warning: "#FF9800",
    error: "#FF3D00",
    info: "#2E7DFF",

    disabled: "#C9C4DD",

    inputBackground: "#FFFFFF",
    inputBorder: "#DDD5FF",
    inputFocused: "#7B61FF",
    inputError: "#FF3D00",

    tabActive: "#7B61FF",
    tabInactive: "#9189B0",

    overlay: "rgba(0,0,0,0.3)",
    shadow: "#000",
  },
};

export default driverTheme;
