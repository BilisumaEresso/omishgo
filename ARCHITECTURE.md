# 📐 OmishGo - Complete System Architecture

## 🎯 System Overview

OmishGo is a mobile-first agricultural/logistics marketplace MVP with:

- **Backend**: Node.js + Express + MongoDB (Authentication & APIs)
- **Mobile**: React Native + Expo (Buyer, Farmer, Driver apps)
- **Admin**: React.js (Web-only, separate from mobile)

```
                    ┌─────────────────────┐
                    │   Backend API       │
                    │  Node.js/Express    │
                    │    MongoDB          │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
         ┌──────▼─────┐  ┌─────▼────┐  ┌─────▼────┐
         │   Mobile   │  │   Admin   │  │   API    │
         │ React Nav  │  │  React    │  │ Clients  │
         │   Zustand  │  │           │  │          │
         └────────────┘  └───────────┘  └──────────┘
```

## 🏗️ Backend Architecture

### Directory Structure

```
BackEnd/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT verification
│   │   ├── error.middleware.js   # Centralized error handling
│   │   ├── notFound.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── modules/
│   │   └── auth/
│   │       ├── auth.routes.js    # Endpoints
│   │       ├── auth.controller.js # Request handlers
│   │       ├── auth.service.js   # Business logic
│   │       ├── auth.validation.js# Input validation
│   │       ├── auth.model.js     # MongoDB schema
│   │       └── auth.repository.js# DB operations
│   │
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── asyncHandler.js
│   │   ├── sendResponse.js
│   │   ├── formatZodErrors.js
│   │   └── generateToken.js
│   │
│   ├── app.js                    # Express app setup
│   └── server.js                 # Server startup
│
├── .env                          # Environment variables
├── package.json
└── ARCHITECTURE.md
```

### 4-Layer Architecture

```
Request
   │
   ▼
Routes (auth.routes.js)
   │ ├─ Register validation
   │ ├─ Login validation
   │ ├─ Auth middleware (JWT)
   │
   ▼
Controller (auth.controller.js)
   │ ├─ Receives request + validation
   │ ├─ Calls service
   │ ├─ Formats response
   │
   ▼
Service (auth.service.js)
   │ ├─ Business logic
   │ ├─ Password hashing
   │ ├─ Token generation
   │ ├─ Calls repository
   │
   ▼
Repository (auth.repository.js)
   │ ├─ Find user
   │ ├─ Create user
   │ ├─ Update user
   │
   ▼
Model (MongoDB)
   │ ├─ User schema
   │ ├─ Validation
   │
   ▼
Response
```

### Authentication Flow

```
┌─ Register ──────────────────────────────┐
│                                          │
│ 1. POST /api/v1/auth/register            │
│    {name, phone, password, role, email}  │
│ 2. Validate format & business rules      │
│ 3. Hash password with bcrypt             │
│ 4. Create user in MongoDB                │
│ 5. Generate JWT token                    │
│ 6. Return user + token                   │
│                                          │
└──────────────────────────────────────────┘

┌─ Login ──────────────────────────────────┐
│                                          │
│ 1. POST /api/v1/auth/login               │
│    {phone, password}                     │
│ 2. Find user by phone                    │
│ 3. Compare password with bcrypt          │
│ 4. Generate JWT token                    │
│ 5. Return user + token                   │
│                                          │
└──────────────────────────────────────────┘

┌─ Protected Route ────────────────────────┐
│                                          │
│ 1. GET /api/v1/auth/me                   │
│    Headers: {Authorization: Bearer JWT}  │
│ 2. Verify JWT signature                  │
│ 3. Extract user ID from JWT              │
│ 4. Fetch user from DB                    │
│ 5. Return user object                    │
│                                          │
└──────────────────────────────────────────┘
```

### Error Handling

```
Error Occurs
   │
   ▼
Error Middleware
   │
   ├─ Is it ApiError?
   │  └─ Use custom status + message
   │
   ├─ Is it Zod validation error?
   │  └─ Format field-level errors
   │
   ├─ Is it MongoDB error?
   │  └─ Return "Database error"
   │
   └─ Default: 500 Internal Server Error
   │
   ▼
JSON Response to Client
{
  "success": false,
  "message": "...",
  "errors": { field: "message" }
}
```

## 📱 Mobile Architecture

### Directory Structure

```
Mobile/
├── src/
│   ├── assets/                  # Images, fonts
│   │
│   ├── components/              # Reusable UI
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── LoadingIndicator.js
│   │   ├── ErrorMessage.js
│   │   └── index.js
│   │
│   ├── config/
│   │   └── api.js               # Axios instance
│   │
│   ├── constants/
│   │   ├── colors.js
│   │   ├── sizes.js
│   │   ├── api.js
│   │   └── index.js
│   │
│   ├── navigation/
│   │   ├── RootNavigator.js     # Main router
│   │   ├── AuthNavigator.js     # Login/Register
│   │   ├── AppNavigator.js      # Role-based
│   │   ├── BuyerNavigator.js
│   │   ├── FarmerNavigator.js
│   │   └── DriverNavigator.js
│   │
│   ├── screens/
│   │   ├── SplashScreen.js
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── BuyerHomeScreen.js
│   │   ├── FarmerHomeScreen.js
│   │   └── DriverHomeScreen.js
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.service.js
│   │   └── storage.service.js
│   │
│   ├── store/
│   │   └── auth.store.js        # Zustand
│   │
│   └── utils/
│       ├── validation.js
│       ├── errorHandler.js
│       └── index.js
│
├── App.js                       # Entry point
├── package.json
└── .env.example
```

### 3-Layer Mobile Architecture

```
UI Layer
   │
   ├─ Screens (LoginScreen, RegisterScreen, etc)
   │  │
   │  └─ Components (Button, Input, etc)
   │
   ▼
State Layer
   │
   └─ Zustand Store (auth.store.js)
      │ ├─ user
      │ ├─ token
      │ ├─ isAuthenticated
      │ ├─ isLoading
      │ └─ Methods: login, register, logout, restoreSession
      │
      ▼
Service Layer
   │
   ├─ AuthService (API calls)
   │ ├─ register()
   │ ├─ login()
   │ └─ restoreSession()
   │
   ├─ StorageService (AsyncStorage)
   │ ├─ getToken()
   │ ├─ setToken()
   │ └─ clear()
   │
   └─ Api (Axios config)
      ├─ Base URL
      ├─ Request interceptor (add token)
      └─ Response interceptor (handle errors)
      │
      ▼
API Layer
   │
   └─ Backend (Node.js)
```

### Data Flow

**Login Flow**:

```
LoginScreen
   │
   ├─ User enters phone + password
   │
   ├─ Frontend validation (Zod)
   │
   └─ onPress "Sign In"
      │
      ▼ useAuthStore.getState().login(phone, password)
      │
      ▼ auth.service.login(phone, password)
      │
      ▼ POST /auth/login {phone, password}
      │
      ├─ Backend validates
      ├─ Backend hashes password
      ├─ Backend generates JWT
      │
      ▼ Returns {user, token}
      │
      ├─ storage.setToken(token)
      ├─ storage.setUser(user)
      ├─ Store updates state
      │
      ▼ Component re-renders
      │
      └─ Navigate to role dashboard
```

**Session Restoration Flow**:

```
App Launches
   │
   ▼ RootNavigator.useEffect
   │
   ├─ isLoading = true
   ├─ Show LoadingIndicator
   │
   ▼ restoreSession()
   │
   ├─ storage.getToken()
   │
   ├─ If token exists:
   │  │
   │  ├─ GET /auth/me {Authorization: Bearer token}
   │  │
   │  ├─ If valid:
   │  │  ├─ storage.setUser(user)
   │  │  ├─ Store.setAuthenticated(true)
   │  │  ├─ Navigate to role dashboard
   │  │
   │  └─ If invalid:
   │     ├─ storage.clear()
   │     ├─ Store.setAuthenticated(false)
   │     └─ Navigate to Login
   │
   └─ If no token:
      ├─ Store.setAuthenticated(false)
      └─ Navigate to Login
```

### Navigation Stack

```
RootNavigator
   │
   ├─ If isLoading
   │  └─ SplashScreen
   │
   ├─ If !isAuthenticated
   │  │
   │  └─ AuthNavigator
   │     ├─ LoginScreen
   │     └─ RegisterScreen
   │
   └─ If isAuthenticated
      │
      └─ AppNavigator
         │
         ├─ If role === "buyer"
         │  └─ BuyerNavigator
         │     └─ BuyerHomeScreen
         │
         ├─ If role === "farmer"
         │  └─ FarmerNavigator
         │     └─ FarmerHomeScreen
         │
         └─ If role === "driver"
            └─ DriverNavigator
               └─ DriverHomeScreen
```

## 🔌 API Integration

### Endpoints Used

| Method | Endpoint              | Auth | Purpose          |
| ------ | --------------------- | ---- | ---------------- |
| POST   | /api/v1/auth/register | ❌   | Create account   |
| POST   | /api/v1/auth/login    | ❌   | Login            |
| GET    | /api/v1/auth/me       | ✅   | Get current user |

### Request/Response Format

**Request**:

```json
{
  "method": "POST",
  "url": "http://localhost:5000/api/v1/auth/login",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer JWT_TOKEN" // Only for protected routes
  },
  "body": {
    "phone": "1234567890",
    "password": "Password123"
  }
}
```

**Success Response**:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "phone": "1234567890",
      "email": "john@example.com",
      "role": "buyer",
      "createdAt": "2025-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response**:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "phone": "Phone must be 10-15 digits",
    "password": "Password must be at least 8 characters"
  },
  "data": null
}
```

## 🧩 State Management

### Zustand Store Structure

```javascript
auth.store.js
├── State
│   ├── user: null
│   ├── token: null
│   ├── isAuthenticated: false
│   ├── isLoading: false
│   └── error: null
│
└── Methods
    ├── register(name, phone, password, role, email)
    ├── login(phone, password)
    ├── logout()
    ├── restoreSession()
    ├── setUser(user)
    ├── setToken(token)
    ├── setError(error)
    └── clearError()

Persistence
├── AsyncStorage key: "authStore"
├── Automatic save on state change
└── Automatic restore on app launch
```

## 🔐 Security Architecture

### Authentication Flow

```
Client                          Backend
   │                               │
   ├─ POST /auth/login ───────────▶│
   │                               │
   │◀───────── JWT Token ──────────┤
   │                               │
   ├─ GET /auth/me ────────────────▶│
   │ Authorization: Bearer JWT      │
   │                               │
   │◀────── User Object ───────────┤
   │                               │
```

### Token Strategy

- **Type**: JWT (JSON Web Token)
- **Algorithm**: HS256
- **Payload**:
  ```json
  {
    "sub": "user_id",
    "iat": 1234567890,
    "exp": 1234651290
  }
  ```
- **Storage**: AsyncStorage (secure for MVP)
- **Expiry**: 24 hours
- **Refresh**: Not implemented (Phase 2)

### Password Security

- **Hashing**: Bcrypt (rounds: 10)
- **Validation**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - No special characters required (simple MVP)

## 🔄 Data Synchronization

### Automatic Token Injection

```javascript
// In config/api.js
axiosInstance.interceptors.request.use(async (config) => {
  const token = await storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Error Handling

```javascript
// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      store.logout(); // Clear auth
      navigation.navigate("Login");
    }
    return Promise.reject(error);
  },
);
```

## 📊 Data Models

### User Model (MongoDB)

```javascript
{
  _id: ObjectId,
  name: String (required),
  phone: String (required, unique, 10-15 digits),
  email: String (optional, unique if provided),
  password: String (hashed, required),
  role: String (enum: ["buyer", "farmer", "driver", "admin"]),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### JWT Token

```javascript
{
  header: {
    alg: "HS256",
    typ: "JWT"
  },
  payload: {
    sub: "user_id",        // User ID
    iat: 1234567890,       // Issued at
    exp: 1234651290        // Expires at
  },
  signature: "HMACSHA256(...)"
}
```

## 🧪 Validation Layers

### Frontend Validation (Zod)

```javascript
// Login Schema
loginSchema = {
  phone: string().regex(/^\d{10,15}$/),
  password: string().min(8),
};

// Register Schema
registerSchema = {
  name: string().min(2).max(50),
  phone: string().regex(/^\d{10,15}$/),
  password: string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
  email: string().email().optional(),
  role: enum(["buyer", "farmer", "driver"]),
};
```

### Backend Validation (Zod)

```javascript
// Same schemas repeated on backend
// Validates:
// - Format correctness
// - Business rules
// - Database constraints
// Returns field-level errors
```

### Error Merging

```javascript
// Frontend validation errors
{ phone: "Invalid format", password: "Too short" }

// Backend validation errors
{ email: "Already exists" }

// Merged for display
{
  phone: "Invalid format",
  password: "Too short",
  email: "Already exists"
}
```

## 🚀 Scalability Considerations

### Current (MVP)

- Single backend server
- Single MongoDB instance
- Stateless API design (ready to scale)
- JWT tokens (no session storage needed)

### Phase 2-3

- API gateway / load balancing
- Database replication
- Caching layer (Redis)
- Message queue (RabbitMQ)
- Microservices (if needed)

### Architecture Decisions for Scaling

✅ **Good for scaling**:

- Clean separation of concerns
- Stateless API
- No hardcoded dependencies
- Environment configuration
- Modular structure

❌ **To avoid**:

- Direct database access in controllers
- Session-based auth
- Hardcoded strings
- Monolithic services

## 📈 Performance Optimization

### Mobile

- Lazy loading navigation
- Memoized components
- Optimized re-renders
- AsyncStorage caching
- Image optimization (future)

### Backend

- Database indexing on phone (unique)
- JWT token validation caching
- Request/response compression
- Database connection pooling

## 🔍 Monitoring & Debugging

### Backend Logging

- Request/response logging
- Error stack traces
- Auth failures
- Database operations

### Mobile Debugging

- Console logs
- Network inspector (Expo)
- State inspection (React DevTools)
- Component profiler

## 📋 Deployment Checklist

### Backend

- [ ] Environment variables configured
- [ ] MongoDB connection verified
- [ ] CORS configured
- [ ] Error handling tested
- [ ] Auth flow end-to-end tested
- [ ] Database backups configured
- [ ] Logging setup
- [ ] API documentation deployed

### Mobile

- [ ] API URL configured
- [ ] Build for iOS
- [ ] Build for Android
- [ ] TestFlight/Google Play internal testing
- [ ] User acceptance testing
- [ ] App store submission
- [ ] Release notes prepared

## 🎯 Next Steps

### Phase 2 (Products & Orders)

1. Product model and CRUD operations
2. Product listing endpoint
3. Product detail screen
4. Shopping features (if applicable)

### Phase 3 (Advanced Features)

1. Payment integration
2. Notifications
3. Messaging/Chat
4. Advanced search/filters
5. Analytics

### Phase 4 (Optimization)

1. Performance tuning
2. Offline support
3. Advanced caching
4. Scalability improvements

---

## 📚 Documentation Files

| Document             | Purpose                            |
| -------------------- | ---------------------------------- |
| `README.md`          | Overview and quick start           |
| `SETUP_GUIDE.md`     | Installation and configuration     |
| `DEVELOPER_GUIDE.md` | Architecture patterns and examples |
| `QUICK_REFERENCE.md` | Common tasks and snippets          |
| `ARCHITECTURE.md`    | This file - complete system design |

## ✅ Project Status

✅ **Backend**: Production-ready authentication system
✅ **Mobile**: Complete MVP authentication flow
⏳ **Admin**: Planned for Phase 2
🔄 **Testing**: Ready for QA
🚀 **Deployment**: Ready to production

---

_Last Updated: 2025-05-19_
_System Version: 1.0.0_
