import baseTheme from "./baseTheme";

const buyerTheme = {
  ...baseTheme,

  role: "buyer",

  colors: {
    primary: "#2E7DFF",
    primaryDark: "#1565C0",
    primaryLight: "#7FB3FF",
    primaryContainer: "#E6F0FF",

    secondary: "#4CAF50",

    accent: "#4CAF50",

    background: "#F8FAFF",
    backgroundSecondary: "#EDF4FF",

    surface: "#FFFFFF",
    surfaceElevated: "#FFFFFF",

    card: "#FFFFFF",

    textPrimary: "#1C2430",
    textSecondary: "#627086",
    textMuted: "#A0AEC0",
    textInverse: "#FFFFFF",

    border: "#DCE8FF",
    divider: "#EAF1FF",

    success: "#4CAF50",
    warning: "#FF9800",
    error: "#E53935",
    info: "#2E7DFF",

    disabled: "#C4D1E5",

    inputBackground: "#FFFFFF",
    inputBorder: "#D9E6FF",
    inputFocused: "#2E7DFF",
    inputError: "#E53935",

    tabActive: "#2E7DFF",
    tabInactive: "#8DA0BC",

    overlay: "rgba(0,0,0,0.3)",
    shadow: "#000",
  },
};

export default buyerTheme;
