const baseTheme = {
  colors: {
    primary: "#4CAF50",
    primaryDark: "#388E3C",
    primaryLight: "#81C784",
    primaryContainer: "#E8F5E9",

    secondary: "#FFC107",

    accent: "#4CAF50",

    background: "#F5F5F5",
    backgroundSecondary: "#EEEEEE",

    surface: "#FFFFFF",
    surfaceElevated: "#FFFFFF",

    card: "#FFFFFF",

    textPrimary: "#212121",
    textSecondary: "#757575",
    textMuted: "#BDBDBD",
    textInverse: "#FFFFFF",

    border: "#E0E0E0",
    divider: "#F0F0F0",

    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
    info: "#2196F3",
    notification: "#FF5252",
    tabBar: "#FFFFFF",
    statusBar: "dark-content",

    disabled: "#CFCFCF",

    inputBackground: "#FFFFFF",
    inputBorder: "#E0E0E0",
    inputFocused: "#4CAF50",
    inputError: "#F44336",

    tabActive: "#4CAF50",
    tabInactive: "#9E9E9E",

    overlay: "rgba(0,0,0,0.3)",
    shadow: "#000",
  },

  typography: {
    fontFamily: "Inter",

    displayLg: {
      fontSize: 32,
      fontWeight: "700",
      lineHeight: 40,
    },

    headingLg: {
      fontSize: 28,
      fontWeight: "700",
      lineHeight: 34,
    },

    headingMd: {
      fontSize: 22,
      fontWeight: "700",
      lineHeight: 30,
    },

    headingSm: {
      fontSize: 18,
      fontWeight: "600",
      lineHeight: 26,
    },

    bodyLg: {
      fontSize: 16,
      fontWeight: "400",
      lineHeight: 24,
    },

    bodyMd: {
      fontSize: 14,
      fontWeight: "400",
      lineHeight: 22,
    },

    bodySm: {
      fontSize: 12,
      fontWeight: "400",
      lineHeight: 18,
    },

    label: {
      fontSize: 14,
      fontWeight: "500",
    },

    caption: {
      fontSize: 12,
      fontWeight: "400",
    },

    button: {
      fontSize: 16,
      fontWeight: "600",
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,

    screenPadding: 16,
    cardGap: 12,
  },

  radius: {
    xs: 6,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    full: 9999,
  },

  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 2,
    },

    md: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 4,
    },

    lg: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.12,
      shadowRadius: 18,
      elevation: 8,
    },
  },
};

export default baseTheme;
