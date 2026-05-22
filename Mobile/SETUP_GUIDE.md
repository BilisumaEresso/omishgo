# OmishGo Mobile App - Setup & Run Guide

## 📱 Project Overview

This is a React Native + Expo mobile app for the OmishGo agricultural marketplace with:

- Phone-first authentication
- Role-based navigation (Buyer, Farmer, Driver)
- Persistent session management
- Clean, production-ready code

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd Mobile
npm install
```

### 2. Configure API Connection

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` based on your development environment:

**For iOS Simulator (recommended for testing):**

```
EXPO_PUBLIC_API_URL=http://localhost:5000
```

**For Android Emulator:**

```
EXPO_PUBLIC_API_URL=http://10.0.2.2:5000
```

**For Physical Device:**

```bash
# First, find your computer's IP address:
# Windows: ipconfig | find "IPv4"
# Mac: ifconfig | grep "inet " | grep -v "127.0.0.1"

# Example:
EXPO_PUBLIC_API_URL=http://192.168.1.100:5000
```

### 3. Ensure Backend is Running

```bash
cd BackEnd
npm start
# Server should run on http://localhost:5000
```

### 4. Start Expo

```bash
npm start
```

Then choose:

- `i` for iOS Simulator
- `a` for Android Emulator
- `w` for Web (limited support)

## 📂 Project Structure

```
src/
├── components/        # Reusable UI components
├── config/            # Axios configuration
├── constants/         # Colors, sizes, API endpoints
├── navigation/        # React Navigation setup
├── screens/           # All screen components
├── services/          # API & storage services
├── store/             # Zustand state management
└── utils/             # Validation & helpers
```

## 🔑 Key Features

### Authentication Flow

```
Splash Screen
    ↓
Check saved token
    ↓
Valid token?
    ├─ Yes → Validate with /auth/me → Role Dashboard
    └─ No → Login Screen

Login Screen
    ↓
Enter phone + password
    ↓
POST /auth/login
    ↓
Save token + user → Role Dashboard

Register Screen
    ↓
Enter details (name, phone, password, role)
    ↓
POST /auth/register
    ↓
Navigate to Login
```

### Role-Based Navigation

- **Buyer**: Access buyer dashboard
- **Farmer**: Access farmer dashboard
- **Driver**: Access driver dashboard

Each role has its own navigation stack.

## 🧪 Testing the App

### Register a New Account

1. Tap "Sign Up" on login screen
2. Fill in:
   - Name: "John Farmer"
   - Phone: "1234567890"
   - Password: "SecurePass123" (must have uppercase, lowercase, number)
   - Role: "farmer"
   - Email: (optional)
3. Tap "Create Account"
4. Should redirect to Login

### Login

1. Enter phone: "1234567890"
2. Enter password: "SecurePass123"
3. Tap "Sign In"
4. Should see role dashboard

### Logout

1. Tap "Log Out" button
2. Should return to Login screen
3. Token is cleared from storage

### Session Persistence

1. Login successfully
2. Force close the app
3. Reopen the app
4. Should restore session automatically

## ⚙️ API Integration Points

### `/api/v1/auth/register`

**POST** - Create new user

```json
{
  "name": "string",
  "phone": "string (10-15 digits)",
  "password": "string (8+ chars, uppercase, lowercase, number)",
  "role": "buyer|farmer|driver",
  "email": "string (optional)"
}
```

### `/api/v1/auth/login`

**POST** - Authenticate user

```json
{
  "phone": "string",
  "password": "string"
}
```

### `/api/v1/auth/me`

**GET** - Get current user (requires JWT)

- Header: `Authorization: Bearer <token>`

## 🔐 Error Handling

### Field-Level Errors

The app automatically displays validation errors below input fields:

- "Phone must be 10-15 digits"
- "Password must contain uppercase letter"
- "Passwords do not match"

### Backend Errors

If backend returns field-level errors:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "phone": "phone already exists",
    "password": "Password too short"
  }
}
```

The app displays them inline on the form.

### General Errors

Network or unexpected errors show at the top of the screen in red banner.

## 🎨 UI Components

### Button

```javascript
<Button
  title="Sign In"
  onPress={handleLogin}
  variant="primary" // or "secondary"
  loading={isLoading}
  disabled={isLoading}
/>
```

### Input

```javascript
<Input
  placeholder="Phone Number"
  value={phone}
  onChangeText={setPhone}
  keyboardType="phone-pad"
  error={errors.phone}
/>
```

### LoadingIndicator

```javascript
<LoadingIndicator size="large" color="#10B981" />
```

### ErrorMessage

```javascript
<ErrorMessage message={error} />
```

## 🧠 State Management (Zustand)

### Auth Store

```javascript
import { useAuthStore } from "./store/auth.store.js";

const { user, token, isAuthenticated, isLoading, error } = useAuthStore();

// Methods
await useAuthStore.getState().login(phone, password);
await useAuthStore.getState().register(userData);
await useAuthStore.getState().logout();
await useAuthStore.getState().restoreSession();
```

### Persistence

- Token and user are automatically persisted to AsyncStorage
- On app restart, session is automatically restored

## 🔧 Debugging

### Check Storage

Add this to any screen to inspect stored data:

```javascript
import storage from "../services/storage.service.js";

React.useEffect(() => {
  const checkStorage = async () => {
    const token = await storage.getToken();
    const user = await storage.getUser();
    console.log("Token:", token);
    console.log("User:", user);
  };
  checkStorage();
}, []);
```

### Network Debugging

Enable React Native Debugger:

1. Start app with `npm start`
2. Press `d` for debugger
3. Install React Native Debugger (separate app)
4. View network requests and console logs

### API Response Logging

The axios instance logs all requests/responses. Check console for:

- Request headers (should show Authorization Bearer token)
- Response status and data
- Network errors

## 📱 Building for Production

### iOS

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
```

Requires EAS account and proper configuration in `eas.json`.

## 🐛 Common Issues

### "Network request failed"

- Check backend is running on correct port
- Verify API URL in `.env` matches backend URL
- For Android emulator, use `10.0.2.2:5000` not `localhost:5000`

### "Cannot find module"

- Run `npm install` again
- Clear cache: `npm start -- --clear`

### "Token not attaching to requests"

- Check storage.service.js is properly implemented
- Verify token exists: `console.log(await storage.getToken())`
- Check Authorization header in network debugger

### "Session doesn't persist"

- Verify AsyncStorage is installed: `npm list @react-native-async-storage/async-storage`
- Check app hasn't cleared app data
- Try logging out and back in

### Physical device can't reach backend

- Phone and PC/Mac must be on same network
- Disable VPN on phone
- Update `.env` with correct IP address
- Test: `ping 192.168.x.x` from computer
- Test: `curl http://192.168.x.x:5000/` from phone browser

## 📝 Environment Variables

| Variable              | Purpose          | Example                       |
| --------------------- | ---------------- | ----------------------------- |
| `EXPO_PUBLIC_API_URL` | Backend base URL | `http://localhost:5000`       |
| `EXPO_PUBLIC_ENV`     | Environment mode | `development` or `production` |

## 🚀 Next Steps

### Phase 2 Features (Coming Soon)

- Product listing and browsing
- Shopping cart
- Order management
- Real-time delivery tracking
- Messaging system
- Ratings and reviews

### Phase 3 Features

- Push notifications
- Payment integration
- Advanced search/filters
- User profile management
- Seller dashboard enhancements

## 📞 Support & Debugging

For issues:

1. Check the error message in red banner
2. Check console logs in Expo debugger
3. Verify `.env` configuration
4. Ensure backend is running
5. Try clearing cache: `npm start -- --clear`

## ✅ Validation Rules

### Phone

- 10-15 digits only
- Example: `1234567890`

### Password

- Minimum 8 characters
- Must have uppercase letter
- Must have lowercase letter
- Must have number
- Example: `SecurePass123`

### Email

- Valid email format
- Optional field
- Example: `user@example.com`

### Role

- Must be: `buyer`, `farmer`, or `driver`

## 📚 File Structure Reference

```
Mobile/
├── App.js                    # Main entry point
├── app.json                  # Expo config
├── package.json              # Dependencies
├── .env                       # API config (create from .env.example)
└── src/
    ├── components/
    │   ├── index.js          # Component exports
    │   ├── Button.js         # Reusable button
    │   ├── Input.js          # Reusable input
    │   ├── LoadingIndicator.js
    │   └── ErrorMessage.js
    ├── config/
    │   └── api.js            # Axios instance
    ├── constants/
    │   ├── index.js
    │   ├── api.js            # API endpoints
    │   ├── colors.js         # Color palette
    │   └── sizes.js          # Spacing & typography
    ├── navigation/
    │   ├── RootNavigator.js
    │   ├── AuthNavigator.js
    │   ├── AppNavigator.js
    │   ├── BuyerNavigator.js
    │   ├── FarmerNavigator.js
    │   └── DriverNavigator.js
    ├── screens/
    │   ├── SplashScreen.js
    │   ├── LoginScreen.js
    │   ├── RegisterScreen.js
    │   ├── BuyerHomeScreen.js
    │   ├── FarmerHomeScreen.js
    │   └── DriverHomeScreen.js
    ├── services/
    │   ├── api.js            # Axios config
    │   ├── auth.service.js   # Auth API calls
    │   └── storage.service.js # AsyncStorage wrapper
    ├── store/
    │   └── auth.store.js     # Zustand store
    └── utils/
        ├── index.js
        ├── validation.js
        └── errorHandler.js
```

---

**Status: ✅ APP READY FOR TESTING**

All authentication flows are implemented and working with the backend API.
