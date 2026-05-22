# OmishGo Backend - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Install Dependencies

```bash
cd BackEnd
npm install
```

### 2. Start MongoDB

```bash
# Local MongoDB
mongod

# Or update .env to use cloud MongoDB
```

### 3. Run Server

```bash
npm start
```

**Server should start at:** `http://localhost:5000`

---

## ✅ Quick Test

### Health Check

```bash
curl http://localhost:5000/
# Response: "OmishGo is running !!"
```

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

### Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "1234567890",
    "password": "SecurePass123"
  }'
```

Copy the `token` from response.

### Get User Profile (Protected)

```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📋 API Endpoints

| Method | Endpoint                | Description       | Auth   |
| ------ | ----------------------- | ----------------- | ------ |
| POST   | `/api/v1/auth/register` | Register new user | ❌ No  |
| POST   | `/api/v1/auth/login`    | Login user        | ❌ No  |
| GET    | `/api/v1/auth/me`       | Get user profile  | ✅ Yes |

---

## 🔑 Auth Features

### Register Requires

- `name` (2+ characters)
- `phone` (10-15 digits) - **PRIMARY**
- `password` (8+ chars, uppercase, lowercase, number)
- `role` (buyer, farmer, driver, admin)
- `email` (optional)

### Login Accepts

- `phone` OR `email` (at least one required)
- `password`

---

## 🛠️ Environment Variables (.env)

```
MONGO_STR="mongodb://localhost:27017/OmishGo"
JWT_SECRET=this-is-secret-key-for-jwt
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV="development"
```

---

## 📚 Full Documentation

- **Architecture Details:** See `ARCHITECTURE.md`
- **Complete Testing Guide:** See `API_TEST_GUIDE.md`

---

## 🚨 Common Issues

| Issue              | Fix                       |
| ------------------ | ------------------------- |
| Connection refused | Ensure MongoDB is running |
| Module not found   | Run `npm install`         |
| Port 5000 in use   | Change PORT in .env       |
| Token errors       | Check JWT_SECRET in .env  |

---

## ✨ What's Fixed

✅ Auth routes working
✅ Email optional
✅ JWT authentication
✅ Error handling
✅ Validation middleware
✅ Protected routes
✅ Clean code

---

**Status: Ready for MVP Development** 🚀
