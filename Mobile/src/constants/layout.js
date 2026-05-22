/**
 * OmishGo Layout & Spacing System
 *
 * Consistent spacing utilities for auth components
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

/**
 * Common spacing combinations
 */
export const gaps = {
  // Input gaps
  inputLabel: spacing.sm,
  inputError: spacing.sm,
  inputHelper: spacing.sm,

  // Form gaps
  formField: spacing.lg,
  formGroup: spacing.xl,

  // Button gaps
  buttonGap: spacing.md,

  // Card gaps
  cardPadding: spacing.xl,

  // Section gaps
  heroSection: spacing.xxxl,
  footerSection: spacing.xl,
};

/**
 * Border radius presets
 */
export const borderRadius = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
  full: 999,
};

/**
 * Shadow presets
 */
export const shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};

/**
 * Typography line heights
 */
export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
};

/**
 * Animation timings
 */
export const timing = {
  fast: 100,
  normal: 200,
  slow: 300,
  slower: 500,
};
