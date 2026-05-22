# OmishGo Onboarding Components Guide

Complete API reference for reusable onboarding UI components.

## Overview

5 reusable, presentation-only components for building multi-step onboarding flows in OmishGo.

### Components

1. **OnboardingLayout** - Main wrapper for all onboarding screens
2. **ProgressIndicator** - Step progress dots
3. **OnboardingCard** - Content card with title, description, points
4. **IllustrationContainer** - Display illustrations with overlays
5. **OnboardingFooter** - Navigation buttons and step counter
6. **SkipButton** - Skip/dismiss button (bonus)

---

## 1. OnboardingLayout

**Purpose:** Main layout wrapper for onboarding screens. Handles safe areas, keyboard awareness, scrolling.

### Props

| Prop             | Type      | Default | Description                                         |
| ---------------- | --------- | ------- | --------------------------------------------------- |
| `header`         | ReactNode | -       | Top section (progress indicator, skip button, etc.) |
| `illustration`   | ReactNode | -       | Main visual (typically IllustrationContainer)       |
| `content`        | ReactNode | -       | Main content (typically OnboardingCard)             |
| `footer`         | ReactNode | -       | Bottom section (typically OnboardingFooter)         |
| `scrollable`     | Boolean   | `true`  | Enable scrolling for long content                   |
| `containerStyle` | StyleProp | -       | Custom container styles                             |
| `headerStyle`    | StyleProp | -       | Custom header styles                                |
| `contentStyle`   | StyleProp | -       | Custom content styles                               |
| `footerStyle`    | StyleProp | -       | Custom footer styles                                |
| `testID`         | String    | -       | Test identifier                                     |

### Example

```jsx
import {
  OnboardingLayout,
  ProgressIndicator,
  OnboardingCard,
  OnboardingFooter,
  IllustrationContainer,
} from "@/components";

export const MyOnboardingScreen = () => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <OnboardingLayout
      testID="onboarding-welcome"
      header={
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={5}
          role="farmer"
        />
      }
      illustration={
        <IllustrationContainer size="large" role="farmer">
          {/* Your illustration here */}
        </IllustrationContainer>
      }
      content={
        <OnboardingCard
          title="Welcome to OmishGo"
          description="The farmer-first marketplace"
          role="farmer"
        />
      }
      footer={
        <OnboardingFooter
          currentStep={currentStep}
          totalSteps={5}
          onNext={() => setCurrentStep(currentStep + 1)}
          role="farmer"
        />
      }
    />
  );
};
```

---

## 2. ProgressIndicator

**Purpose:** Show current step with visual dots and role-based coloring.

### Props

| Prop          | Type      | Default    | Description                          |
| ------------- | --------- | ---------- | ------------------------------------ |
| `currentStep` | Number    | `1`        | Current step (1-based)               |
| `totalSteps`  | Number    | `5`        | Total steps in flow                  |
| `role`        | String    | `'farmer'` | Role for color theming               |
| `size`        | String    | `'medium'` | `'small'` \| `'medium'` \| `'large'` |
| `style`       | StyleProp | -          | Custom styles                        |
| `testID`      | String    | -          | Test identifier                      |

### Dot States

- **Completed:** Green (#10b981)
- **Current:** Role-based color (green/purple/orange/indigo)
- **Pending:** Light gray

### Example

```jsx
import { ProgressIndicator } from "@/components";

<ProgressIndicator currentStep={2} totalSteps={5} role="farmer" size="small" />;
```

---

## 3. OnboardingCard

**Purpose:** Content card with title, description, and feature points.

### Props

| Prop          | Type          | Default    | Description                                |
| ------------- | ------------- | ---------- | ------------------------------------------ |
| `title`       | String        | -          | Card title                                 |
| `description` | String        | -          | Card description (optional)                |
| `points`      | Array<String> | `[]`       | Bullet point list                          |
| `role`        | String        | `'farmer'` | Role for color theming                     |
| `accentColor` | String        | `'bright'` | `'bright'` \| `'light'` - accent bar color |
| `icon`        | String        | -          | Emoji or icon (optional)                   |
| `style`       | StyleProp     | -          | Custom styles                              |
| `testID`      | String        | -          | Test identifier                            |

### Example

```jsx
import { OnboardingCard } from "@/components";

<OnboardingCard
  title="Easy to Use"
  description="Designed for low digital literacy"
  points={[
    "Works offline on slow networks",
    "Simple Amharic support",
    "No confusing tech jargon",
  ]}
  role="farmer"
  accentColor="bright"
  icon="📱"
/>;
```

---

## 4. IllustrationContainer

**Purpose:** Display illustrations with role-based tints and overlays.

### Props

| Prop             | Type      | Default    | Description                                             |
| ---------------- | --------- | ---------- | ------------------------------------------------------- |
| `children`       | ReactNode | -          | The illustration (Image, View, etc.)                    |
| `role`           | String    | `'farmer'` | Role for color theming                                  |
| `size`           | String    | `'medium'` | `'small'` \| `'medium'` \| `'large'`                    |
| `accentColor`    | String    | `'bright'` | Background tint: `'bright'` \| `'light'` \| `'success'` |
| `showOverlay`    | Boolean   | `true`     | Show semi-transparent overlay                           |
| `overlayOpacity` | Number    | `0.6`      | Overlay opacity (0-1)                                   |
| `style`          | StyleProp | -          | Custom styles                                           |
| `testID`         | String    | -          | Test identifier                                         |

### Example

```jsx
import { IllustrationContainer } from "@/components";

<IllustrationContainer
  size="large"
  role="farmer"
  accentColor="bright"
  showOverlay={false}
>
  <Image
    source={require("../assets/farmer-illustration.png")}
    style={{ width: 200, height: 200 }}
  />
</IllustrationContainer>;
```

---

## 5. OnboardingFooter

**Purpose:** Navigation buttons and step counter for onboarding flow.

### Props

| Prop              | Type      | Default    | Description                              |
| ----------------- | --------- | ---------- | ---------------------------------------- |
| `onNext`          | Function  | -          | Callback for next button                 |
| `onBack`          | Function  | -          | Callback for back button                 |
| `onSkip`          | Function  | -          | Callback for skip action                 |
| `nextLabel`       | String    | `'Next'`   | Label for next button                    |
| `backLabel`       | String    | `'Back'`   | Label for back button                    |
| `skipLabel`       | String    | `'Skip'`   | Label for skip text                      |
| `currentStep`     | Number    | `1`        | Current step (1-based)                   |
| `totalSteps`      | Number    | `5`        | Total steps in flow                      |
| `isLastStep`      | Boolean   | `false`    | If true, next button shows "Get Started" |
| `role`            | String    | `'farmer'` | Role for color theming                   |
| `showStepCounter` | Boolean   | `true`     | Show "Step X of Y"                       |
| `showSkip`        | Boolean   | `true`     | Show skip option                         |
| `nextLoading`     | Boolean   | `false`    | Loading state for next button            |
| `backLoading`     | Boolean   | `false`    | Loading state for back button            |
| `nextDisabled`    | Boolean   | `false`    | Disable next button                      |
| `backDisabled`    | Boolean   | `false`    | Disable back button                      |
| `containerStyle`  | StyleProp | -          | Custom container styles                  |
| `testID`          | String    | -          | Test identifier                          |

### Behavior

- **Back button:** Only shows if `currentStep > 1`
- **Skip option:** Only shows if `currentStep < totalSteps`
- **Next button:** Automatically shows "Get Started" when `isLastStep={true}`

### Example

```jsx
import { OnboardingFooter } from "@/components";

<OnboardingFooter
  currentStep={2}
  totalSteps={5}
  role="farmer"
  onNext={() => setCurrentStep(3)}
  onBack={() => setCurrentStep(1)}
  onSkip={() => skipOnboarding()}
  showSkip={true}
/>;
```

---

## 6. SkipButton

**Purpose:** Standalone skip/dismiss button with customizable styling.

### Props

| Prop       | Type      | Default    | Description                          |
| ---------- | --------- | ---------- | ------------------------------------ |
| `onPress`  | Function  | -          | Button press callback                |
| `label`    | String    | `'Skip'`   | Button label                         |
| `variant`  | String    | `'text'`   | `'text'` \| `'background'`           |
| `size`     | String    | `'medium'` | `'small'` \| `'medium'` \| `'large'` |
| `role`     | String    | `'farmer'` | Role for color theming               |
| `disabled` | Boolean   | `false`    | Disable button                       |
| `style`    | StyleProp | -          | Custom styles                        |
| `testID`   | String    | -          | Test identifier                      |

### Example

```jsx
import { SkipButton } from "@/components";

<SkipButton
  label="Skip"
  variant="text"
  size="medium"
  role="farmer"
  onPress={() => skipOnboarding()}
/>;
```

---

## Complete Onboarding Flow Example

```jsx
import React, { useState } from "react";
import {
  OnboardingLayout,
  ProgressIndicator,
  OnboardingCard,
  IllustrationContainer,
  OnboardingFooter,
} from "@/components";

export const FullOnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const role = "farmer";

  const screens = [
    {
      title: "Welcome",
      description: "Welcome to OmishGo",
      illustration: "🌾",
    },
    {
      title: "Easy to Use",
      description: "Designed for farmers",
      points: ["Works offline", "Simple interface"],
      illustration: "📱",
    },
    {
      title: "Let's Get Started",
      description: "You're ready",
      illustration: "✓",
    },
  ];

  const screen = screens[currentStep - 1];

  return (
    <OnboardingLayout
      header={
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={screens.length}
          role={role}
        />
      }
      illustration={
        <IllustrationContainer size="large" role={role}>
          <View
            style={{
              width: 150,
              height: 150,
              backgroundColor: "rgba(0,0,0,0.05)",
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="title">{screen.illustration}</Typography>
          </View>
        </IllustrationContainer>
      }
      content={
        <OnboardingCard
          title={screen.title}
          description={screen.description}
          points={screen.points || []}
          role={role}
        />
      }
      footer={
        <OnboardingFooter
          currentStep={currentStep}
          totalSteps={screens.length}
          isLastStep={currentStep === screens.length}
          role={role}
          onNext={() => {
            if (currentStep < screens.length) {
              setCurrentStep(currentStep + 1);
            } else {
              // Navigate to home or next screen
            }
          }}
          onBack={() => setCurrentStep(currentStep - 1)}
          onSkip={() => {
            // Skip and navigate home
          }}
        />
      }
    />
  );
};
```

---

## Design System Integration

### Role-Based Colors

All components support role-based theming:

```javascript
// farmer → Green (#059669)
// buyer → Purple (#7C3AED)
// supplier → Orange (#D97706)
// driver → Indigo (#4F46E5)

import { getRoleColors } from "@/components";

const colors = getRoleColors("farmer");
// {
//   primary: '#059669',      // Main role color
//   light: '#d1fae5',        // Light background
//   lighter: '#ecfdf5',      // Very light background
// }
```

### Spacing & Layout

```javascript
import { spacing, gaps } from "@/components";

// spacing: xs(4px), sm(8px), md(12px), lg(16px), xl(24px), xxl(32px), huge(40px)
// gaps: inputLabel(8px), formField(16px), formGroup(20px), heroSection(32px)
```

---

## Styling & Customization

All components use `React.forwardRef` and `StyleSheet.create` for performance.

### Custom Styling

```jsx
import { OnboardingCard } from "@/components";

<OnboardingCard
  title="My Title"
  role="farmer"
  style={{
    marginHorizontal: 8,
    marginTop: 16,
  }}
/>;
```

### Theming

Pass `role` prop to any component to change accent colors:

```jsx
<ProgressIndicator currentStep={1} totalSteps={5} role="buyer" />
// → Progress dots will be purple instead of green
```

---

## Testing

All components support `testID` for testing:

```jsx
import { render } from "@testing-library/react-native";
import { ProgressIndicator } from "@/components";

const { getByTestId } = render(
  <ProgressIndicator currentStep={1} totalSteps={5} testID="progress-dots" />,
);

expect(getByTestId("progress-dots")).toBeTruthy();
```

---

## Platform-Specific Notes

### iOS

- Shadows use `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`
- Keyboard handling uses `behavior="padding"`

### Android

- Shadows use `elevation`
- Keyboard handling uses `behavior="height"`
- ScrollView performance optimized with `removeClippedSubviews`

---

## Common Patterns

### Multi-Step Onboarding

```jsx
const [currentStep, setCurrentStep] = useState(1);

<OnboardingFooter
  currentStep={currentStep}
  totalSteps={5}
  onNext={() => setCurrentStep((prev) => prev + 1)}
  onBack={() => setCurrentStep((prev) => prev - 1)}
/>;
```

### Skip Onboarding

```jsx
<OnboardingFooter
  onSkip={() =>
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    })
  }
/>
```

### Last Step Action

```jsx
<OnboardingFooter
  isLastStep={true}
  nextLabel="Get Started"
  onNext={() => startApp()}
/>
```

### Conditional Content

```jsx
const showSkip = currentStep < totalSteps;
const showBack = currentStep > 1;

<OnboardingFooter showSkip={showSkip} onBack={showBack ? onBack : undefined} />;
```

---

## Troubleshooting

### Progress dots not showing

- Ensure `currentStep` and `totalSteps` are numbers
- Ensure `totalSteps >= currentStep`

### Buttons not responding

- Check `disabled={false}` (default)
- Ensure `onPress` callback is defined

### Layout jumping on keyboard

- Use `OnboardingLayout` (handles keyboard automatically)
- Or use `KeyboardAvoidingView` + `SafeAreaView` manually

### Illustration aspect ratio incorrect

- Wrap image in `View` with explicit dimensions
- Or use `Image` with `resizeMode="contain"`

---

## Related Components

See **AUTH_COMPONENTS_GUIDE.md** for:

- **PrimaryButton** - Main action buttons
- **SecondaryButton** - Secondary actions
- **Typography** - Text variants
- **AuthLayout** - Authentication screens

---

## Version

v1.0 - Initial release with 5 core onboarding components + bonus SkipButton

See **ONBOARDING_COMPONENTS_README.md** for quick start.
