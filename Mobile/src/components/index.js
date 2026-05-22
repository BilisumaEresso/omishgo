/**
 * OmishGo Foundation Components
 *
 * Reusable, presentation-only components for auth & onboarding screens
 *
 * Auth Components:
 * import {
 *   AuthLayout,
 *   PrimaryButton,
 *   AppInput,
 *   Typography,
 * } from '@/components';
 *
 * Onboarding Components:
 * import {
 *   OnboardingLayout,
 *   ProgressIndicator,
 *   OnboardingCard,
 *   OnboardingFooter,
 *   SkipButton,
 * } from '@/components';
 */

// Core Auth Components
export { default as AppInput } from "./AppInput";
export { default as AuthLayout } from "./AuthLayout";
export { default as LogoCard } from "./LogoCard";
export { default as PrimaryButton } from "./PrimaryButton";
export { default as RememberMeCheckbox } from "./RememberMeCheckbox";
export { default as SecondaryButton } from "./SecondaryButton";
export { default as Typography } from "./Typography";

// Onboarding Components
export { default as IllustrationContainer } from "./IllustrationContainer";
export { default as OnboardingCard } from "./OnboardingCard";
export {
  CompleteOnboardingScreen,
  FeaturesOnboardingScreen,
  OnboardingExamplesSelector,
  RoleSelectionOnboardingScreen,
  TermsOnboardingScreen,
  WelcomeOnboardingScreen,
} from "./OnboardingExamples";
export { default as OnboardingFooter } from "./OnboardingFooter";
export { default as OnboardingLayout } from "./OnboardingLayout";
export { default as ProgressIndicator } from "./ProgressIndicator";
export { default as SkipButton } from "./SkipButton";

// Design System
export { getRoleColors, neutralColors, roleColors } from "../constants/colors";

// Layout & Spacing (optional exports)
export {
  borderRadius,
  gaps,
  lineHeights,
  shadows,
  spacing,
  timing,
} from "../constants/layout";

// Style Helpers (for advanced use cases)
export {
  combineStyles,
  getBorderRadius,
  getButtonOpacity,
  getContrastTextColor,
  getDisabledStyle,
  getInputBgColor,
  getInputBorderColor,
  getRoleFocusStyle,
  getShadow,
} from "../utils/styleHelpers";

// Legacy Components - DEPRECATED
// Use auth components above instead
export { default as AppButton } from "./common/AppButton.js";
export { default as AppCard } from "./common/AppCard.js";
export { default as AppText } from "./common/AppText.js";
export { default as ErrorMessage } from "./common/ErrorMessage.js";
export { default as LoadingIndicator } from "./common/LoadingIndicator.js";
export { default as ScreenWrapper } from "./common/ScreenWrapper.js";

// Layout Components
export { default as AuthLayout } from "./layout/AuthLayout.js";

/**
 * MIGRATION GUIDE
 *
 * Old → New
 *
 * AppButton → PrimaryButton (filled) or SecondaryButton (outlined)
 * AppInput → AppInput (improved version, same name)
 * AppText → Typography (with variants)
 * AppCard → LogoCard (for auth, or create domain-specific cards)
 * ScreenWrapper → AuthLayout (for auth screens)
 *
 * See AUTH_COMPONENTS_GUIDE.md for complete documentation
 */
