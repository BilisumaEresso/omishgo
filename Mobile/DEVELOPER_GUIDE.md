# OmishGo Mobile App - Developer Guide

## 🎯 Architecture Overview

The app follows a clean, layered architecture for maintainability and scalability:

```
Navigation Layer (React Navigation)
    ↓
Screens (UI Components)
    ↓
Store (Zustand - State Management)
    ↓
Services (API & Storage)
    ↓
Config (Axios, Constants)
    ↓
Backend API
```

## 📐 Design Patterns

### 1. Component Pattern

- **Reusable Components**: Button, Input, ErrorMessage, LoadingIndicator
- **Composable**: Easy to combine and extend
- **No Magic**: Props are explicit

```javascript
<Input
  placeholder="Email"
  value={email}
  onChangeText={setEmail}
  error={errors.email}
  keyboardType="email-address"
/>
```

### 2. Store Pattern (Zustand)

- **Single source of truth**: Auth store holds user, token, auth state
- **Persistence**: Automatically saves to AsyncStorage
- **Reactive**: Components re-render on state changes
- **No boilerplate**: No reducers, just mutations

```javascript
const { user, token, login, logout } = useAuthStore();
```

### 3. Service Pattern

- **Abstraction**: API calls isolated in services
- **Reusability**: Services used by store and components
- **Testable**: Easy to mock services

```javascript
// In auth.service.js
export async function login(phone, password) { ... }

// Used by auth.store.js
const result = await authService.login(phone, password);
```

## 🔄 Data Flow Examples

### Login Flow

```javascript
// 1. User enters data in LoginScreen
handleLogin = async () => {
  // 2. Frontend validation
  const { isValid, errors } = validateLoginForm(formData);

  // 3. Call store method
  const result = await login(phone, password);

  // 4. Store calls authService.login()
  // 5. authService makes API call
  // 6. authService saves token to storage
  // 7. Store updates state
  // 8. Component re-renders with new state
  // 9. Navigation updates based on role
};
```

### Session Restoration

```javascript
// 1. App starts, RootNavigator renders
// 2. useEffect calls restoreSession()
// 3. restoreSession() calls authService.restoreSession()
// 4. authService gets token from storage
// 5. authService calls GET /auth/me with token
// 6. If valid, store updates user and token
// 7. RootNavigator renders appropriate screen
```

## 🧩 Adding New Features

### Add a New Screen

1. **Create screen file**: `src/screens/MyScreen.js`

```javascript
import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import { useAuthStore } from "../store/auth.store.js";

const MyScreen = ({ navigation }) => {
  const { user } = useAuthStore();

  return (
    <SafeAreaView>
      <Text>My Screen</Text>
    </SafeAreaView>
  );
};

export default MyScreen;
```

2. **Add to navigator**: `src/navigation/BuyerNavigator.js`

```javascript
<Stack.Screen name="MyScreen" component={MyScreen} />
```

3. **Navigate to it**:

```javascript
navigation.navigate("MyScreen");
```

### Add a New API Call

1. **Add endpoint to constants**: `src/constants/api.js`

```javascript
export const API_ENDPOINTS = {
  auth: { ... },
  products: {
    list: '/api/v1/products',
    get: '/api/v1/products/:id',
  },
};
```

2. **Create service**: `src/services/product.service.js`

```javascript
import api from "../config/api.js";
import { API_ENDPOINTS } from "../constants/api.js";

export const getProducts = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.products.list);
    return response.data;
  } catch (error) {
    console.error("Get products error:", error);
    throw error;
  }
};
```

3. **Use in store or component**:

```javascript
import { getProducts } from "../services/product.service.js";

const products = await getProducts();
```

### Add a New Reusable Component

1. **Create component**: `src/components/MyComponent.js`

```javascript
import React from "react";
import { View, Text } from "react-native";
import { COLORS, SIZES } from "../constants/index.js";

export const MyComponent = ({ title, onPress }) => {
  return (
    <View style={{ padding: SIZES.lg }}>
      <Text style={{ color: COLORS.text }}>{title}</Text>
    </View>
  );
};
```

2. **Export from index**: `src/components/index.js`

```javascript
export { MyComponent } from "./MyComponent.js";
```

3. **Use in screens**:

```javascript
import { MyComponent } from "../components/index.js";

<MyComponent title="Hello" onPress={handler} />;
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Register with phone-first (no email)
- [ ] Register with email
- [ ] Login succeeds
- [ ] Login fails with wrong password
- [ ] Login fails with invalid phone
- [ ] Session persists after app restart
- [ ] Logout clears session
- [ ] Each role navigates to correct dashboard
- [ ] Network errors show in UI
- [ ] Validation errors show inline

### Testing Different Roles

**Buyer Account:**

```
Phone: 1111111111
Password: BuyerPass123
Role: buyer
```

**Farmer Account:**

```
Phone: 2222222222
Password: FarmerPass123
Role: farmer
```

**Driver Account:**

```
Phone: 3333333333
Password: DriverPass123
Role: driver
```

## 🐛 Debugging Tips

### 1. Console Logging

```javascript
console.log("User:", user);
console.log("Token:", token);
console.log("Auth State:", isAuthenticated);
```

### 2. Network Inspection

```javascript
// In auth.service.js, responses are logged
// Check console for:
// - Request URL and headers
// - Response status and body
// - Errors
```

### 3. Storage Inspection

```javascript
import storage from "../services/storage.service.js";

// Check what's stored
const token = await storage.getToken();
const user = await storage.getUser();
console.log("Stored Token:", token);
console.log("Stored User:", user);
```

### 4. State Inspection

```javascript
import { useAuthStore } from "../store/auth.store.js";

// In component or debugger console
const state = useAuthStore.getState();
console.log("Full Auth State:", state);
```

### 5. React DevTools

Install React Native Debugger (separate app):

- See component tree
- Inspect props and state
- Check re-renders
- Profile performance

## 📋 Code Style Guidelines

### Naming Conventions

- **Components**: PascalCase (`LoginScreen.js`)
- **Functions**: camelCase (`handleLogin`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`)
- **Variables**: camelCase (`formData`)
- **Booleans**: `is` prefix (`isLoading`, `isValid`)

### File Organization

- Keep files small (< 300 lines)
- One component per file
- Group related logic in services
- Extract reusable logic to utils

### Comments

- Explain "why", not "what"
- Use for complex logic
- Remove debug comments
- Keep comments current

Good:

```javascript
// Automatically attach JWT to every request
api.interceptors.request.use(async (config) => { ... })
```

Bad:

```javascript
// Loop through items
items.forEach(item => { ... })
```

### Error Handling

- Catch all errors
- Log for debugging
- Show user-friendly messages
- Never crash silently

```javascript
try {
  const result = await authService.login(phone, password);
  if (!result.success && result.errors) {
    setErrors(mergeErrors(validationErrors, result.errors));
  }
} catch (error) {
  console.error("Login error:", error);
  setError("An unexpected error occurred");
}
```

## 🚀 Performance Optimization

### 1. Memoization

```javascript
import React, { useMemo } from "react";

const MyComponent = ({ data }) => {
  const processedData = useMemo(() => {
    return expensiveOperation(data);
  }, [data]);
};
```

### 2. Lazy Navigation

Navigation screens are loaded on-demand by React Navigation.

### 3. Async Storage Optimization

- Cache frequently accessed data
- Don't store large objects
- Use separate keys for different data types

### 4. Image Optimization

- Compress before upload
- Use appropriate sizes
- Cache images when possible

## 🔒 Security Best Practices

### 1. Token Management

- Always store in AsyncStorage (not state only)
- Automatically attach to requests
- Clear on logout
- Handle expiry gracefully

### 2. Input Validation

- Validate on client
- Always validate on server
- Sanitize user input
- Use Zod for type safety

### 3. Error Messages

- Don't expose sensitive data
- Use generic messages for auth failures
- Log details server-side
- Show actionable errors to users

### 4. Network Security

- Use HTTPS in production
- Validate SSL certificates
- Never hardcode sensitive data
- Use environment variables

## 📚 Dependencies Overview

| Package                     | Purpose             |
| --------------------------- | ------------------- |
| react-native                | Native mobile UI    |
| expo                        | Development tooling |
| @react-navigation           | Navigation routing  |
| zustand                     | State management    |
| axios                       | HTTP client         |
| @react-native-async-storage | Local storage       |
| zod                         | Validation          |
| react-hook-form             | Form handling       |

## 🔧 Troubleshooting Common Issues

### Issue: Token not persisting

**Solution**:

1. Check AsyncStorage is installed
2. Verify storage.setToken() is called
3. Check device has storage space

### Issue: API calls failing

**Solution**:

1. Verify backend is running
2. Check API URL in .env
3. Use network debugger to inspect requests
4. Verify CORS is configured

### Issue: Session not restoring

**Solution**:

1. Check token exists in storage
2. Verify /auth/me endpoint works
3. Check token is not expired
4. Review RootNavigator useEffect

### Issue: Components not updating

**Solution**:

1. Verify store hooks are called
2. Check state changes are immutable
3. Use React DevTools to inspect

## 📖 Reference

### Zustand Hook Pattern

```javascript
import { useAuthStore } from "../store/auth.store.js";

const MyComponent = () => {
  // Hook into store
  const { user, isLoading, login } = useAuthStore();

  // Component automatically re-renders when state changes

  const handleLogin = async () => {
    const result = await login(phone, password);
    // State updates automatically
  };
};
```

### Navigation Pattern

```javascript
// Navigate with params
navigation.navigate("Details", { id: 123 });

// Get params in screen
const MyScreen = ({ route }) => {
  const { id } = route.params;
};

// Go back
navigation.goBack();

// Replace (remove from stack)
navigation.replace("Home");
```

### API Call Pattern

```javascript
// Service
export const getUser = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Store
const result = await getUser(123);
if (result.success) {
  updateState(result.data);
}

// Error handling
catch (error) {
  console.error('Error:', error);
  showError(error.message);
}
```

---

**Ready for development!** Follow these patterns for consistency and scalability.
