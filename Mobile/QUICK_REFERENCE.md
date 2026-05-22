# OmishGo Mobile App - Quick Reference

## 🚀 Start App

```bash
cd Mobile
npm install          # First time only
npm start            # Start development server

# Then choose:
# i - iOS Simulator
# a - Android Emulator
# w - Web
```

## ⚙️ Configure API

Edit `.env`:

```
# iOS Simulator / Web
EXPO_PUBLIC_API_URL=http://localhost:5000

# Android Emulator
EXPO_PUBLIC_API_URL=http://10.0.2.2:5000

# Physical Device (replace with your IP)
EXPO_PUBLIC_API_URL=http://192.168.1.100:5000
```

## 📁 File Locations

| File                              | Purpose               |
| --------------------------------- | --------------------- |
| `src/navigation/RootNavigator.js` | Main routing logic    |
| `src/screens/LoginScreen.js`      | Login UI              |
| `src/screens/RegisterScreen.js`   | Registration UI       |
| `src/store/auth.store.js`         | Auth state management |
| `src/services/auth.service.js`    | Auth API calls        |
| `src/constants/api.js`            | API endpoints         |

## 🔐 Auth Flow

```javascript
// 1. Login
const { login } = useAuthStore();
await login("1234567890", "Password123");

// 2. Get user
const { user } = useAuthStore();
console.log(user.name, user.role);

// 3. Logout
const { logout } = useAuthStore();
await logout();
```

## 📱 Available Screens

```
SplashScreen
  ↓
LoginScreen
  ↓ Register
RegisterScreen
  ↓ Create Account
  ↓ Back to Login
LoginScreen
  ↓ Login Success
BuyerHomeScreen / FarmerHomeScreen / DriverHomeScreen
  ↓ Logout
LoginScreen
```

## 🧩 Components

```javascript
import { Button, Input, ErrorMessage, LoadingIndicator } from '../components';

// Button
<Button title="Sign In" onPress={handler} loading={isLoading} />

// Input
<Input
  placeholder="Phone"
  value={phone}
  onChangeText={setPhone}
  error={errors.phone}
  keyboardType="phone-pad"
/>

// Error Message
<ErrorMessage message={error} />

// Loading
<LoadingIndicator size="large" color="#10B981" />
```

## 💾 Storage

```javascript
import storage from "../services/storage.service.js";

// Get
const token = await storage.getToken();
const user = await storage.getUser();

// Set
await storage.setToken(token);
await storage.setUser(user);

// Clear
await storage.clear();
```

## 🔗 API Calls

```javascript
import authService from "../services/auth.service.js";

// Register
const result = await authService.register({
  name: "John",
  phone: "1234567890",
  password: "SecurePass123",
  role: "buyer",
  email: "john@example.com", // optional
});

// Login
const result = await authService.login("1234567890", "SecurePass123");

// Restore Session
const result = await authService.restoreSession();
```

## ✔️ Validation

```javascript
import { validateLoginForm, validateRegisterForm } from "../utils";

// Frontend validation
const { isValid, errors } = validateLoginForm({ phone, password });

// Merge with backend errors
const allErrors = mergeErrors(validationErrors, backendErrors);
```

## 🎨 Colors & Sizes

```javascript
import { COLORS, SIZES } from "../constants";

// Colors
COLORS.primary; // #10B981 (green)
COLORS.danger; // #EF4444 (red)
COLORS.text; // #1F2937 (dark gray)
COLORS.textSecondary; // #6B7280 (light gray)

// Sizes
SIZES.lg; // 16 (padding)
SIZES.md; // 12 (margin)
SIZES.sm; // 8 (gap)
SIZES.fontSize.base; // 16
SIZES.inputHeight; // 48
SIZES.buttonHeight; // 48
SIZES.radius.md; // 8 (border radius)
```

## 🧠 State Management

```javascript
import { useAuthStore } from "../store/auth.store.js";

// Get state
const { user, token, isAuthenticated, isLoading, error } = useAuthStore();

// Call actions
await useAuthStore.getState().login(phone, password);
await useAuthStore.getState().logout();
await useAuthStore.getState().restoreSession();

// Clear error
useAuthStore.getState().clearError();
```

## 🎯 Navigation

```javascript
// In screens, get navigation prop
const MyScreen = ({ navigation }) => {
  // Navigate
  navigation.navigate("Login");
  navigation.navigate("Register");
  navigation.navigate("BuyerHome");

  // Go back
  navigation.goBack();

  // Get route params
  const { id } = route.params;
};
```

## 🐛 Debug

```javascript
// Log store state
console.log(useAuthStore.getState());

// Log storage
const token = await storage.getToken();
console.log("Token:", token);

// Check API response
// Look in Expo debugger console under "Network" tab
```

## 📝 Test Accounts

```
Buyer:
- Phone: 1111111111
- Password: BuyerPass123
- Role: buyer

Farmer:
- Phone: 2222222222
- Password: FarmerPass123
- Role: farmer

Driver:
- Phone: 3333333333
- Password: DriverPass123
- Role: driver
```

## 🐞 Common Issues

| Issue                 | Fix                                             |
| --------------------- | ----------------------------------------------- |
| Can't connect to API  | Check `.env` URL, backend running               |
| Token not saving      | Verify AsyncStorage installed                   |
| Session not restoring | Check token exists, not expired                 |
| Validation error      | Check password has uppercase, lowercase, number |

## 📚 Full Guides

- **Setup**: See `SETUP_GUIDE.md`
- **Development**: See `DEVELOPER_GUIDE.md`
- **Backend API**: See `BackEnd/ARCHITECTURE.md`

## ✅ Pre-Launch Checklist

- [ ] Backend running on correct port
- [ ] `.env` file configured
- [ ] Can register new account
- [ ] Can login with registered account
- [ ] Session persists after app restart
- [ ] Logout clears session
- [ ] Each role shows correct dashboard
- [ ] Error messages display properly
- [ ] Network errors handled gracefully

---

**Ready to go!** 🚀
