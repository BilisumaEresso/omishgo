# 🎨 OmishGo Mobile - Auth UI Components

Professional, reusable authentication components for low-literacy users. Built with React Native + Expo.

## ✨ Features

- ✅ **Reusable Only** - Zero business logic, pure presentation
- ✅ **Role-Based Colors** - Farmer, buyer, supplier, driver
- ✅ **Low-Literacy Friendly** - Simple, warm, intuitive design
- ✅ **Accessible** - Large touch targets, clear focus states
- ✅ **Tested** - testID support, production-ready
- ✅ **Performance** - Optimized with memoization
- ✅ **Keyboard Aware** - Handles mobile input well
- ✅ **Safe Area** - Works across all devices

## 📦 Components

### Core Components

| Component              | Purpose                             |
| ---------------------- | ----------------------------------- |
| **AuthLayout**         | Main wrapper for auth screens       |
| **LogoCard**           | Display logo with elevation         |
| **PrimaryButton**      | Filled button with loading state    |
| **SecondaryButton**    | Outlined button variant             |
| **AppInput**           | Text input with label, error, icons |
| **RememberMeCheckbox** | Custom checkbox for remember me     |
| **Typography**         | Consistent text styling             |

### Design System

| Export            | Purpose                   |
| ----------------- | ------------------------- |
| **neutralColors** | Gray palette for UI       |
| **roleColors**    | Color mappings per role   |
| **spacing**       | Consistent spacing values |
| **gaps**          | Semantic spacing gaps     |
| **shadows**       | Platform-aware shadows    |

## 🚀 Quick Start

### Import Components

```jsx
import {
  AuthLayout,
  PrimaryButton,
  AppInput,
  Typography,
  neutralColors,
  getRoleColors,
} from "@/components";
```

### Build a Login Screen

```jsx
<AuthLayout
  hero={<LogoCard source={require("./logo.png")} />}
  form={
    <>
      <AppInput label="Email" placeholder="your@email.com" />
      <AppInput label="Password" password />
      <PrimaryButton label="Sign In" onPress={handleLogin} />
    </>
  }
/>
```

## 📚 Documentation

- **[AUTH_COMPONENTS_GUIDE.md](./AUTH_COMPONENTS_GUIDE.md)** - Complete API reference
- **[AuthExamples.js](./src/components/AuthExamples.js)** - Real-world examples
- **[colors.js](./src/constants/colors.js)** - Color system
- **[layout.js](./src/constants/layout.js)** - Spacing & layout tokens

## 🎨 Design System

### Role Colors

```js
farmer:   #059669 (Green)
buyer:    #7C3AED (Purple)
supplier: #D97706 (Orange)
driver:   #4F46E5 (Indigo)
```

### Spacing

```js
xs:  4px
sm:  8px
md:  12px
lg:  16px
xl:  20px
xxl: 24px
```

### Text Variants

- `title` - Large headings (28px)
- `subtitle` - Section heads (20px)
- `body` - Main text (16px)
- `caption` - Helper text (14px)
- `button` - Button text (16px)

## 💡 Common Patterns

### Basic Form

```jsx
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [errors, setErrors] = useState({});

<AuthLayout
  form={
    <>
      <AppInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        icon="mail"
      />
      <AppInput
        label="Password"
        password
        value={password}
        onChangeText={setPassword}
        error={errors.password}
      />
      <PrimaryButton label="Sign In" onPress={handleLogin} />
    </>
  }
/>;
```

### Role Selection

```jsx
const roles = ["farmer", "buyer", "supplier", "driver"];

{
  roles.map((role) => (
    <SecondaryButton
      key={role}
      label={role}
      role={role}
      onPress={() => selectRole(role)}
    />
  ));
}
```

### PIN Entry

```jsx
<AppInput
  label="Enter 4-digit PIN"
  placeholder="0000"
  pin
  maxLength={4}
  keyboardType="number-pad"
/>
```

## 🧪 Testing

All components support `testID`:

```jsx
<PrimaryButton testID="signup-button" />
<AppInput testID="email-input" />

// Access in tests
fireEvent.press(getByTestId('signup-button'));
expect(getByTestId('email-input')).toBeDefined();
```

## 🔄 Migration from Old Components

| Old             | New                                  |
| --------------- | ------------------------------------ |
| `AppButton`     | `PrimaryButton` or `SecondaryButton` |
| `AppInput`      | `AppInput`                           |
| `AppText`       | `Typography`                         |
| `ScreenWrapper` | `AuthLayout`                         |
| `AppCard`       | `LogoCard`                           |

```jsx
// Old
import { AppButton } from "@/components/common";
const MyButton = () => <AppButton label="Click" />;

// New
import { PrimaryButton } from "@/components";
const MyButton = () => <PrimaryButton label="Click" />;
```

## 📂 File Structure

```
src/
├── components/
│   ├── Typography.js           ← Text styling
│   ├── PrimaryButton.js        ← Filled button
│   ├── SecondaryButton.js      ← Outlined button
│   ├── AppInput.js             ← Text input
│   ├── RememberMeCheckbox.js   ← Checkbox
│   ├── LogoCard.js             ← Logo display
│   ├── AuthLayout.js           ← Main layout
│   ├── AuthExamples.js         ← Example screens
│   ├── index.js                ← Exports
│   └── ...other/legacy
├── constants/
│   ├── colors.js               ← Color system
│   └── layout.js               ← Spacing, etc.
└── utils/
    └── styleHelpers.js         ← Style utilities
```

## ⚡ Performance

- **Memoization**: Components use React.forwardRef
- **Minimal re-renders**: Props-driven updates
- **Efficient shadows**: Platform-specific rendering
- **Optimized colors**: Cached calculations
- **Fast touch**: Proper activeOpacity values

## ♿ Accessibility

- ✅ Large touch targets (min 48px height)
- ✅ Clear focus states (role colors)
- ✅ Error visibility (red + text)
- ✅ Helper text for guidance
- ✅ Icons for clarity
- ✅ Simple language

## 🎯 Best Practices

✅ **DO:**

- Use components as building blocks
- Pass `role` prop for colors
- Show errors clearly
- Use helper text
- Keep forms focused
- Test with real users

❌ **DON'T:**

- Add business logic
- Override colors
- Hide errors
- Use complex nesting
- Ignore accessibility
- Hardcode text

## 🛠️ Customization

### Use Role-Based Colors

```jsx
import { getRoleColors } from "@/components";

const farmerColors = getRoleColors("farmer");
// { primary: '#059669', light: '#D1FAE5', lighter: '#ECFDF5' }
```

### Create Custom Button

```jsx
import { PrimaryButton } from "@/components";

export function CustomButton(props) {
  return <PrimaryButton {...props} role="farmer" size="large" />;
}
```

### Extend Input

```jsx
import { AppInput } from "@/components";

export function EmailInput(props) {
  return <AppInput {...props} icon="mail" keyboardType="email-address" />;
}
```

## 🐛 Troubleshooting

### Button not responding

- Check `disabled` prop
- Verify `onPress` is a function
- Check `testID` matches

### Input focus color wrong

- Ensure `role` prop is set
- Check role values: farmer, buyer, supplier, driver

### Keyboard not closing

- Use `AuthLayout` for keyboard awareness
- Test on physical device

## 📖 Examples

See **[AuthExamples.js](./src/components/AuthExamples.js)** for:

- ✅ Login screen
- ✅ Role selection
- ✅ PIN entry
- ✅ Error handling
- ✅ Form validation

## 🚀 Ready to Use

All components are production-ready:

- ✅ No business logic
- ✅ Fully customizable
- ✅ Well documented
- ✅ Performance optimized
- ✅ Accessibility included
- ✅ Test IDs available

## 📝 License

Part of OmishGo - Ethiopian Agriculture Marketplace

---

**Next Steps:**

1. Review [AUTH_COMPONENTS_GUIDE.md](./AUTH_COMPONENTS_GUIDE.md)
2. Explore [AuthExamples.js](./src/components/AuthExamples.js)
3. Build your auth screens using components
4. Connect to backend APIs
5. Test with real users (low digital literacy)

**Questions?** Check the guide or examples - they have everything!
