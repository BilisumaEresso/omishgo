# OmishGo Auth Components Guide

## Overview

Complete set of reusable, presentation-only components for authentication flows.

**Key Principles:**

- ✅ Reusable, no business logic
- ✅ Prop-driven customization
- ✅ Role-based accent colors
- ✅ Accessible and responsive
- ✅ Low-literacy user friendly
- ✅ Soft rounded, warm design

---

## Components

### 1. AuthLayout

Main layout wrapper for auth screens. Handles safe area, keyboard awareness, and scrolling.

**Props:**

- `hero` (ReactNode) - Top section (e.g., logo)
- `form` (ReactNode) - Form section
- `footer` (ReactNode) - Bottom section
- `scrollable` (boolean) - Enable scrolling (default: true)
- `style` (object) - Custom wrapper styles

**Example:**

```jsx
<AuthLayout
  hero={<LogoCard source={require("./logo.png")} />}
  form={
    <>
      <AppInput label="Email" placeholder="your@email.com" />
      <PrimaryButton label="Continue" onPress={handleNext} />
    </>
  }
  footer={
    <Typography variant="caption">
      By continuing, you agree to our Terms
    </Typography>
  }
/>
```

---

### 2. LogoCard

Card component for displaying logo/image with subtle elevation.

**Props:**

- `source` (ImageSource) - Image to display
- `size` (string) - 'small' | 'medium' | 'large'
- `style` (object) - Custom card styles
- `imageStyle` (object) - Custom image styles

**Example:**

```jsx
<LogoCard source={require("./omishgo-logo.png")} size="large" />
```

---

### 3. PrimaryButton

Filled button with role-based color, loading state, and disabled state.

**Props:**

- `label` (string) - Button text ⚠️ Required
- `onPress` (function) - Button press handler
- `loading` (boolean) - Show loading spinner (default: false)
- `disabled` (boolean) - Disable button (default: false)
- `size` (string) - 'small' | 'medium' | 'large'
- `role` (string) - 'farmer' | 'buyer' | 'supplier' | 'driver'
- `style` (object) - Custom button styles
- `textStyle` (object) - Custom text styles

**Example:**

```jsx
<PrimaryButton
  label="Sign Up as Farmer"
  role="farmer"
  size="large"
  loading={isLoading}
  onPress={handleSignUp}
/>
```

**Color Mapping:**

- `farmer` → Green (#059669)
- `buyer` → Purple (#7C3AED)
- `supplier` → Orange (#D97706)
- `driver` → Indigo (#4F46E5)

---

### 4. SecondaryButton

Outlined button variant with same customization as PrimaryButton.

**Props:**

- Same as PrimaryButton

**Example:**

```jsx
<SecondaryButton label="Cancel" role="farmer" onPress={handleCancel} />
```

---

### 5. AppInput

Text input with label, error state, icons, and password toggle.

**Props:**

- `label` (string) - Input label
- `placeholder` (string) - Placeholder text
- `value` (string) - Current value
- `onChangeText` (function) - Change handler
- `error` (string) - Error message (shows error state if present)
- `helperText` (string) - Helper text below input
- `icon` (string) - Ionicons icon name (prefix)
- `iconColor` (string) - Icon color
- `onIconPress` (function) - Icon press handler
- `password` (boolean) - Enable password mode with toggle
- `pin` (boolean) - Enable PIN mode (numeric, spaced)
- `role` (string) - Role for focus color
- `editable` (boolean) - Enable/disable input
- `style` (object) - Custom input styles
- `containerStyle` (object) - Custom container styles

**Example - Email:**

```jsx
<AppInput
  label="Email Address"
  placeholder="your@email.com"
  value={email}
  onChangeText={setEmail}
  icon="mail"
  error={emailError}
  helperText="We'll send you a verification code"
/>
```

**Example - Password:**

```jsx
<AppInput
  label="Password"
  placeholder="Enter your password"
  value={password}
  onChangeText={setPassword}
  password
  error={passwordError}
  helperText="Min 8 characters, 1 number, 1 special char"
/>
```

**Example - PIN:**

```jsx
<AppInput
  label="Enter PIN"
  placeholder="0000"
  value={pin}
  onChangeText={setPin}
  pin
  maxLength={4}
/>
```

---

### 6. RememberMeCheckbox

Custom checkbox component for remember-me functionality.

**Props:**

- `checked` (boolean) - Checkbox state
- `onPress` (function) - Toggle handler
- `label` (string) - Checkbox label
- `role` (string) - Role for accent color
- `style` (object) - Custom styles

**Example:**

```jsx
<RememberMeCheckbox
  checked={rememberMe}
  onPress={() => setRememberMe(!rememberMe)}
  label="Remember me for next time"
  role="farmer"
/>
```

---

### 7. Typography

Text component with consistent styling variants.

**Props:**

- `variant` (string) - 'title' | 'subtitle' | 'body' | 'caption' | 'button' | 'error'
- `bold` (boolean) - Bold variant (for body/caption)
- `color` (string) - Text color override
- `style` (object) - Custom styles
- `children` (string) - Text content

**Variants:**

- `title` - 28px, 700, tight spacing (headings)
- `subtitle` - 20px, 600 (section heads)
- `body` - 16px, 400 (default text)
- `bodyBold` - 16px, 600 (emphasized text)
- `caption` - 14px, 400 (helper text)
- `captionBold` - 14px, 600 (emphasized helper)
- `button` - 16px, 600 (button text)
- `error` - 14px, 400, red (error messages)

**Example:**

```jsx
<Typography variant="title">Welcome to OmishGo</Typography>
<Typography variant="body">Sign up to start buying and selling</Typography>
<Typography variant="caption" bold>Required field</Typography>
<Typography variant="error">Invalid email address</Typography>
```

---

## Design System

### Colors

**Neutral Palette:**

```js
{
  backgroundLight: '#FAFAFA',
  cardBg: '#FFFFFF',
  textDark: '#1A1A1A',
  textMedium: '#4A4A4A',
  textLight: '#7A7A7A',
  borderSubtle: '#E5E5E5',
  error: '#EF4444',
  success: '#10B981',
}
```

**Role Colors:**

```js
{
  farmer: { primary: '#059669', light: '#D1FAE5', lighter: '#ECFDF5' },
  buyer: { primary: '#7C3AED', light: '#EDE9FE', lighter: '#F5F3FF' },
  supplier: { primary: '#D97706', light: '#FED7AA', lighter: '#FFFBEB' },
  driver: { primary: '#4F46E5', light: '#E0E7FF', lighter: '#F0F4FF' },
}
```

**Usage:**

```js
import { getRoleColors, neutralColors } from "@/constants/colors";

const farmerColors = getRoleColors("farmer");
// { primary: '#059669', light: '#D1FAE5', lighter: '#ECFDF5' }

const buttonBgColor = getRoleColors("buyer").primary; // '#7C3AED'
```

### Spacing

```js
import { spacing, gaps } from "@/constants/layout";

spacing.xs = 4; // Extra small
spacing.sm = 8; // Small
spacing.md = 12; // Medium
spacing.lg = 16; // Large
spacing.xl = 20; // Extra large
spacing.xxl = 24; // 2XL
spacing.xxxl = 32; // 3XL
```

### Layout Utilities

```js
import { gaps, borderRadius, shadows } from '@/constants/layout';

gaps.inputLabel = 8         // Gap between label and input
gaps.formField = 16         // Gap between form fields
gaps.formGroup = 20         // Gap between form groups
gaps.heroSection = 32       // Gap before form

borderRadius.md = 10        // Inputs, buttons
borderRadius.lg = 12        // Cards
borderRadius.xl = 16        // Logo card

shadows.md = {...}          // Card elevation
```

---

## Complete Example: Login Screen

```jsx
import React, { useState } from "react";
import {
  AuthLayout,
  LogoCard,
  AppInput,
  PrimaryButton,
  SecondaryButton,
  RememberMeCheckbox,
  Typography,
  neutralColors,
  getRoleColors,
} from "@/components";

export function LoginScreen({ userRole = "farmer" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const roleColors = getRoleColors(userRole);

  const handleLogin = async () => {
    // Validate and login...
    setLoading(true);
    try {
      // Call API
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    // Navigate to signup
  };

  return (
    <AuthLayout
      hero={<LogoCard source={require("./logo.png")} size="large" />}
      form={
        <>
          <Typography variant="title">Welcome Back</Typography>
          <Typography
            variant="body"
            color={neutralColors.textLight}
            style={{ marginBottom: 24 }}
          >
            Sign in to your {userRole} account
          </Typography>

          <AppInput
            label="Email Address"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            icon="mail"
            role={userRole}
          />

          <AppInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            password
            error={errors.password}
            role={userRole}
          />

          <RememberMeCheckbox
            checked={rememberMe}
            onPress={() => setRememberMe(!rememberMe)}
            label="Remember me"
            role={userRole}
          />

          <PrimaryButton
            label="Sign In"
            onPress={handleLogin}
            loading={loading}
            disabled={!email || !password}
            size="large"
            role={userRole}
            style={{ marginTop: 16 }}
          />
        </>
      }
      footer={
        <>
          <Typography variant="caption">
            Don't have an account?{" "}
            <Typography
              variant="caption"
              bold
              color={roleColors.primary}
              onPress={handleSignUp}
            >
              Sign Up
            </Typography>
          </Typography>
        </>
      }
    />
  );
}

export default LoginScreen;
```

---

## Testing Components

All components support `testID` prop for testing:

```jsx
<PrimaryButton
  label="Sign Up"
  testID="signup-button"
  onPress={handleSignUp}
/>

<AppInput
  label="Email"
  testID="email-input"
  value={email}
  onChangeText={setEmail}
/>
```

Test selectors:

- `signup-button` - Main button
- `email-input-error` - Error text
- `email-input-loader` - Loading spinner

---

## Accessibility

- ✅ Large touch targets (min 48px)
- ✅ Clear focus states (role-based colors)
- ✅ Error visibility (red borders + text)
- ✅ Helper text for guidance
- ✅ Icons for visual clarity
- ✅ Simple, warm typography

---

## Performance

- ✅ React.forwardRef for optimization
- ✅ Memoized color calculations
- ✅ Minimal re-renders
- ✅ Efficient shadow rendering
- ✅ Platform-specific optimizations

---

## Do's and Don'ts

✅ **DO:**

- Use components as building blocks
- Pass role prop for accent colors
- Use TypeScript for prop validation
- Test with low-literacy users
- Keep forms simple and focused

❌ **DON'T:**

- Add business logic to components
- Override colors from props
- Use hardcoded strings
- Create complex nested structures
- Ignore error states

---

## Migration from Old Components

Old components are in `common/` directory:

- `AppButton` → Use `PrimaryButton` or `SecondaryButton`
- `AppInput` → Use `AppInput` (same name, improved)
- `AppText` → Use `Typography`
- `AppCard` → Use `LogoCard` for auth, or create specific cards

Import from:

```js
import { PrimaryButton, AppInput, Typography } from "@/components";
```

Not from:

```js
import { AppButton } from "@/components/common"; // Old
```

---

## File Structure

```
src/
├── components/
│   ├── Typography.js
│   ├── PrimaryButton.js
│   ├── SecondaryButton.js
│   ├── AppInput.js
│   ├── RememberMeCheckbox.js
│   ├── LogoCard.js
│   ├── AuthLayout.js
│   ├── AuthComponents.js (docs)
│   └── index.js (exports)
├── constants/
│   ├── colors.js (color system)
│   └── layout.js (spacing, radius, etc.)
└── utils/
    └── styleHelpers.js (style utilities)
```

---

## Next Steps

1. ✅ Components created and tested
2. ⏳ Implement auth screens using components
3. ⏳ Add role-based navigation
4. ⏳ Connect to backend APIs
5. ⏳ Add animations and transitions
