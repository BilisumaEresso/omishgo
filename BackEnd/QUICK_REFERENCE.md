# OmishGo Backend - Quick Reference Card

## 🚀 START SERVER

```bash
cd BackEnd
npm install     # First time only
npm start       # Runs on port 5000
```

**Status:** http://localhost:5000/ → "OmishGo is running !!"

---

## 🔐 AUTHENTICATION

### Register (Phone-First)

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Farmer",
    "phone": "1234567890",
    "password": "SecurePass123",
    "role": "farmer"
  }'
```

**Response:** 201 with user data + no password

### Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "1234567890",
    "password": "SecurePass123"
  }'
```

**Response:** 200 with user data + JWT token

### Get Profile (Protected)

```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

**Response:** 200 with user data

---

## 📝 VALIDATION RULES

| Field    | Rules                                  | Required          |
| -------- | -------------------------------------- | ----------------- |
| name     | 2+ chars                               | ✅ Yes            |
| phone    | 10-15 digits                           | ✅ Yes (Register) |
| email    | Valid email                            | ❌ No (Optional)  |
| password | 8+ chars, UPPERCASE, lowercase, number | ✅ Yes            |
| role     | buyer, farmer, driver, admin           | ✅ Yes            |

---

## 🛡️ ERROR RESPONSES

### Validation Error (400)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "phone": "Phone number must be 10-15 digits"
  }
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Not Found (404)

```json
{
  "success": false,
  "message": "User not found"
}
```

### Conflict/Duplicate (409)

```json
{
  "success": false,
  "message": "phone already exists"
}
```

---

## 📂 KEY FILES

| File                                  | Purpose            |
| ------------------------------------- | ------------------ |
| `src/app.js`                          | Express app setup  |
| `src/index.js`                        | Entry point        |
| `src/modules/auth/auth.routes.js`     | Route definitions  |
| `src/modules/auth/auth.controller.js` | Request handlers   |
| `src/modules/auth/auth.service.js`    | Business logic     |
| `src/modules/auth/auth.repository.js` | DB operations      |
| `src/middleware/error.middleware.js`  | Error handling     |
| `src/middleware/auth.middleware.js`   | JWT verification   |
| `src/utils/sendResponse.js`           | Response formatter |

---

## ⚙️ ENVIRONMENT SETUP

### .env File

```
MONGO_STR="mongodb://localhost:27017/OmishGo"
JWT_SECRET=this-is-secret-key-for-jwt
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV="development"
```

### MongoDB Required

```bash
mongod  # Start MongoDB locally
# OR update MONGO_STR to use cloud MongoDB
```

---

## 🧪 TEST ENDPOINTS

### 1. Health Check

```bash
curl http://localhost:5000/
```

### 2. Register + Login + Get Profile

```bash
# 1. Register
TOKEN_RESPONSE=$(curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"1234567890","password":"TestPass123","role":"farmer"}')

# 2. Login
LOGIN=$(curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"1234567890","password":"TestPass123"}')

# Extract token
TOKEN=$(echo $LOGIN | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 3. Get Profile
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🎯 CORE FEATURES

✅ Phone-first authentication
✅ Email optional for registration
✅ Password hashed with bcrypt
✅ JWT token (7-day expiry)
✅ Role-based system (4 roles)
✅ Protected routes with auth middleware
✅ Centralized error handling
✅ Input validation with Zod
✅ CORS enabled
✅ Security headers (Helmet)

---

## 🐛 BUGS FIXED

✅ Route `/me` now has handler (was incomplete)
✅ Auth middleware error handling fixed (removed dead code)
✅ Controller response signature corrected
✅ Email made optional in registration
✅ Removed unused morgan dependency

---

## 📚 FULL DOCUMENTATION

- **System Design:** `ARCHITECTURE.md`
- **Testing Guide:** `API_TEST_GUIDE.md`
- **Status Report:** `STATUS_REPORT.md`
- **Quick Start:** `QUICK_START.md`

---

## 🔗 API ROUTES

| Method | Path                    | Auth | Purpose          |
| ------ | ----------------------- | ---- | ---------------- |
| GET    | `/`                     | ❌   | Health check     |
| POST   | `/api/v1/auth/register` | ❌   | Create account   |
| POST   | `/api/v1/auth/login`    | ❌   | Get JWT token    |
| GET    | `/api/v1/auth/me`       | ✅   | Get user profile |

---

## 🚨 TROUBLESHOOTING

| Problem            | Solution                 |
| ------------------ | ------------------------ |
| Connection refused | Start MongoDB: `mongod`  |
| Port 5000 in use   | Change PORT in .env      |
| Module not found   | Run `npm install`        |
| JWT errors         | Check JWT_SECRET in .env |
| CORS errors        | Check frontend headers   |

---

## 💡 QUICK TIPS

1. **Token expires in 7 days** - Configure via JWT_EXPIRES_IN in .env
2. **Password hashing:** Takes bcrypt 10 rounds (secure but fast)
3. **Phone is primary:** Email is optional, phone is required for registration
4. **JWT payload:** Contains sub (user ID), role, iss (issuer), aud (audience)
5. **Response format:** Always { success, message, data, errors, meta }

---

## 📞 SUPPORT

For detailed issues, see:

1. Check console logs
2. Review ARCHITECTURE.md
3. Check API_TEST_GUIDE.md for examples
4. Verify .env configuration
5. Ensure MongoDB is running

---

**Status:** ✅ PRODUCTION-READY
**Last Updated:** 2026-05-19
**Version:** 1.0.0
