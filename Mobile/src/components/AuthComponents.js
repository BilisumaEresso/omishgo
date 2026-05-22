/**
 * OmishGo Auth Foundation Components
 *
 * Reusable, presentation-only components for auth screens
 *
 * Components:
 * - AuthLayout: Main layout wrapper for auth screens
 * - LogoCard: Card component with logo display
 * - PrimaryButton: Filled button with role-based colors
 * - SecondaryButton: Outlined button with role-based colors
 * - AppInput: Text input with error states, icons, password toggle
 * - RememberMeCheckbox: Custom checkbox component
 * - Typography: Text component with consistent styling
 *
 * Design System:
 * - neutralColors: Neutral palette for UI
 * - roleColors: Role-based accent colors (farmer, buyer, supplier, driver)
 * - getRoleColors(role): Get colors for specific role
 */

// Core components
export { default as AppInput } from "./AppInput";
export { default as AuthLayout } from "./AuthLayout";
export { default as LogoCard } from "./LogoCard";
export { default as PrimaryButton } from "./PrimaryButton";
export { default as RememberMeCheckbox } from "./RememberMeCheckbox";
export { default as SecondaryButton } from "./SecondaryButton";
export { default as Typography } from "./Typography";

// Design system
export { getRoleColors, neutralColors, roleColors } from "../constants/colors";

/**
 * USAGE EXAMPLES
 *
 * Basic Auth Layout:
 *
 * <AuthLayout
 *   hero={<LogoCard source={require(...)} />}
 *   form={
 *     <>
 *       <AppInput label="Email" placeholder="your@email.com" />
 *       <PrimaryButton label="Login" onPress={handleLogin} />
 *     </>
 *   }
 *   footer={<Typography variant="caption">Terms & Conditions</Typography>}
 * />
 *
 * Role-based Button:
 *
 * <PrimaryButton
 *   label="Sign Up"
 *   role="farmer"
 *   size="large"
 *   loading={isLoading}
 *   disabled={!isValid}
 *   onPress={handleSignUp}
 * />
 *
 * Input with Error:
 *
 * <AppInput
 *   label="Password"
 *   password
 *   value={password}
 *   onChangeText={setPassword}
 *   error={passwordError}
 *   helperText="Min 8 characters"
 * />
 *
 * Remember Me Checkbox:
 *
 * <RememberMeCheckbox
 *   checked={rememberMe}
 *   onPress={() => setRememberMe(!rememberMe)}
 *   label="Remember me for next time"
 *   role="farmer"
 * />
 */
