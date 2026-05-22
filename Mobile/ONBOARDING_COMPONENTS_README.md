# Onboarding Components Quick Start

Build beautiful multi-step onboarding flows in minutes.

## What You Get

6 reusable, production-ready components:

1. **OnboardingLayout** - Main screen wrapper
2. **ProgressIndicator** - Step dots
3. **OnboardingCard** - Content card
4. **IllustrationContainer** - Image display
5. **OnboardingFooter** - Navigation buttons
6. **SkipButton** - Skip button

Zero business logic. 100% reusable. Fully typed. Role-based theming.

---

## 5-Minute Setup

### 1. Import Components

```jsx
import {
  OnboardingLayout,
  ProgressIndicator,
  OnboardingCard,
  IllustrationContainer,
  OnboardingFooter,
} from "@/components";
```

### 2. Create Your Screen

```jsx
import React, { useState } from "react";
import {
  OnboardingLayout,
  ProgressIndicator,
  OnboardingCard,
  IllustrationContainer,
  OnboardingFooter,
} from "@/components";

export const WelcomeScreen = () => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <OnboardingLayout
      header={
        <ProgressIndicator currentStep={1} totalSteps={5} role="farmer" />
      }
      illustration={
        <IllustrationContainer size="large" role="farmer">
          {/* Your image here */}
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
          currentStep={1}
          totalSteps={5}
          role="farmer"
          onNext={() => setCurrentStep(2)}
        />
      }
    />
  );
};
```

### 3. That's It!

Your onboarding screen is ready. All spacing, colors, and keyboard handling are built-in.

---

## Real Examples

All 5 example screens included in `OnboardingExamples.js`:

```jsx
import {
  WelcomeOnboardingScreen,
  FeaturesOnboardingScreen,
  RoleSelectionOnboardingScreen,
  TermsOnboardingScreen,
  CompleteOnboardingScreen,
  OnboardingExamplesSelector,
} from "@/components";

// Use individual screens or the selector
export default OnboardingExamplesSelector;
```

---

## Common Tasks

### Multi-Step Flow

```jsx
const [step, setStep] = useState(1);

<OnboardingFooter
  currentStep={step}
  totalSteps={5}
  onNext={() => setStep(step + 1)}
  onBack={() => setStep(step - 1)}
  onSkip={() => skipOnboarding()}
/>;
```

### Custom Role Color

```jsx
<ProgressIndicator role="buyer" /> // Purple
<ProgressIndicator role="supplier" /> // Orange
<ProgressIndicator role="driver" /> // Indigo
```

### Last Step

```jsx
<OnboardingFooter
  isLastStep={true}
  nextLabel="Get Started"
  onNext={() => navigation.navigate("Home")}
/>
```

### Disable Next Button

```jsx
<OnboardingFooter nextDisabled={!agreed} onNext={handleAgree} />
```

### Different Sizes

```jsx
<ProgressIndicator size="small" />
<ProgressIndicator size="medium" />
<ProgressIndicator size="large" />
```

---

## Component API

### OnboardingLayout

Main wrapper. Handles keyboard, safe areas, scrolling.

```jsx
<OnboardingLayout
  header={...}       // ProgressIndicator, etc.
  illustration={...} // Your image or IllustrationContainer
  content={...}      // OnboardingCard
  footer={...}       // OnboardingFooter
  scrollable={true}  // Enable scrolling
/>
```

### ProgressIndicator

Show current step with dots.

```jsx
<ProgressIndicator currentStep={2} totalSteps={5} role="farmer" size="medium" />
```

### OnboardingCard

Content card with title, description, bullet points.

```jsx
<OnboardingCard
  title="Easy to Use"
  description="Designed for farmers"
  points={["Feature 1", "Feature 2"]}
  role="farmer"
  icon="📱"
/>
```

### IllustrationContainer

Display images with role-based tinting.

```jsx
<IllustrationContainer
  size="large"
  role="farmer"
  accentColor="bright"
  showOverlay={true}
>
  <Image ... />
</IllustrationContainer>
```

### OnboardingFooter

Navigation buttons and progress.

```jsx
<OnboardingFooter
  currentStep={2}
  totalSteps={5}
  role="farmer"
  onNext={handleNext}
  onBack={handleBack}
  onSkip={handleSkip}
  isLastStep={false}
/>
```

### SkipButton

Standalone skip button.

```jsx
<SkipButton label="Skip" variant="text" role="farmer" onPress={handleSkip} />
```

---

## Theming

### Colors by Role

```javascript
farmer   → Green (#059669)
buyer    → Purple (#7C3AED)
supplier → Orange (#D97706)
driver   → Indigo (#4F46E5)
```

All components automatically use the role color.

### Spacing

```javascript
xs:   4px
sm:   8px
md:   12px
lg:   16px
xl:   24px
xxl:  32px
huge: 40px
```

---

## Advanced Customization

### Custom Styles

All components accept `style` prop:

```jsx
<OnboardingCard title="My Title" style={{ marginHorizontal: 16 }} />
```

### Test IDs

Test all components:

```jsx
<ProgressIndicator testID="step-indicator" />
<OnboardingCard testID="welcome-card" />
<OnboardingFooter testID="nav-footer" />
```

### Ref Forwarding

All components use `React.forwardRef`:

```jsx
const footerRef = useRef();

<OnboardingFooter ref={footerRef} />;
```

---

## Best Practices

✅ **Do:**

- Use `OnboardingLayout` for every screen
- Pass `role` to theme correctly
- Keep illustrations simple (under 200x200)
- Show progress indicator on every screen
- Use `testID` for testing

❌ **Don't:**

- Add business logic to components
- Hard-code colors (use `getRoleColors()`)
- Make illustrations too large (kills performance)
- Skip the footer (breaks navigation)

---

## Troubleshooting

### Buttons don't work

- Check `onPress` callback exists
- Ensure `disabled={false}` (default)

### Layout looks jumpy

- Use `OnboardingLayout` instead of custom layout
- It handles keyboard automatically

### Text is cut off

- Use `OnboardingLayout` with scrollable
- Content will auto-scroll if too long

### Colors look wrong

- Check `role` prop is passed correctly
- Valid roles: 'farmer', 'buyer', 'supplier', 'driver'

---

## Files

- **src/components/OnboardingLayout.js** - Main wrapper
- **src/components/ProgressIndicator.js** - Progress dots
- **src/components/OnboardingCard.js** - Content card
- **src/components/IllustrationContainer.js** - Image display
- **src/components/OnboardingFooter.js** - Navigation
- **src/components/SkipButton.js** - Skip button
- **src/components/OnboardingExamples.js** - 5 real examples
- **ONBOARDING_COMPONENTS_GUIDE.md** - Full API reference

---

## Next Steps

1. ✅ Copy/paste example screen
2. ✅ Customize title, description, points
3. ✅ Add your illustration
4. ✅ Hook up navigation callbacks
5. ✅ Test with your app

---

## See Also

- **AUTH_COMPONENTS_README.md** - Auth components quick start
- **AUTH_COMPONENTS_GUIDE.md** - Full auth API reference
- **ONBOARDING_COMPONENTS_GUIDE.md** - Complete onboarding API
