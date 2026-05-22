# Multi-Role Backend - Quick Reference

## What Changed?

The backend now supports **multiple roles per user** while keeping the old single-role system working.

## User Model Structure

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  pin: String,

  // Old field (still here, unchanged)
  role: String,               // e.g., "farmer"

  // New fields (multi-role support)
  roles: [{
    type: String,             // e.g., "farmer"
    verified: Boolean,        // Is this role verified?
    subscription: String,     // "free", "premium", etc.
    active: Boolean          // Is this role active?
  }],
  activeRole: String,        // Currently active role (e.g., "farmer")

  profileImage: String,
  isBlocked: Boolean,
  activeDeviceId: String,
  lastLoginAt: Date,
  timestamps
}
```

## Login Response

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Alice Farmer",
      "email": "alice@example.com",
      "phone": "+1234567890",
      "role": "farmer", // ← Old field (still here)
      "roles": [
        // ← New field
        {
          "type": "farmer",
          "verified": true,
          "subscription": "free",
          "active": true
        }
      ],
      "activeRole": "farmer" // ← New field
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Auto-Migration for Legacy Users

**Old users automatically get:**

```javascript
// When first logged in after update:
roles: [{
  type: user.role,      // Their existing role
  verified: true,
  subscription: "free",
  active: true
}],
activeRole: user.role   // Same as their existing role
```

## Using ROLES Constants

```javascript
// Import
import { ROLES } from "../../constants/roles.js";

// Use constants (DON'T hardcode strings)
ROLES.FARMER; // "farmer"
ROLES.BUYER; // "buyer"
ROLES.DRIVER; // "driver"
ROLES.SUPPLIER; // "supplier"
ROLES.ADMIN; // "admin"
```

## What Stayed the Same?

✅ Login validation (email/phone + PIN)
✅ JWT tokens (still use single `role`)
✅ Device management (single-device enforcement)
✅ Mobile app (receives `role` field as before)
✅ Authentication middleware
✅ Authorization checks (still use `role`)

## What's New?

✨ Multiple roles per user
✨ Per-role verification status
✨ Per-role subscription tracking
✨ Active role field
✨ Future role-switching capability

## Testing Your Changes

### Test 1: New User Registration

```bash
POST /api/v1/auth/register
{
  "name": "John Farmer",
  "email": "john@example.com",
  "phone": "1234567890",
  "pin": "1234",
  "role": "farmer"
}

# Response should include:
{
  "role": "farmer",
  "roles": [{
    "type": "farmer",
    "verified": true,
    "subscription": "free",
    "active": true
  }],
  "activeRole": "farmer"
}
```

### Test 2: Login Response

```bash
POST /api/v1/auth/login
{
  "email": "john@example.com",
  "pin": "1234",
  "deviceId": "device-123"
}

# Response should include roles and activeRole
```

### Test 3: Existing User Auto-Migration

1. Register a user with the old backend
2. Update to new backend
3. That user should get `roles` and `activeRole` auto-initialized on first login

## Important Notes

🔴 **DO NOT** modify the `role` field - it's still required
🔴 **DO NOT** change JWT generation - still uses single `role`
🔴 **DO NOT** hardcode role strings - use `ROLES.CONSTANT`

🟢 **DO** use new `roles` field for multi-role logic
🟢 **DO** use new `activeRole` for tracking active role
🟢 **DO** use `ROLES` constants throughout

## Future Phases

Phase 2: Role switching endpoint
Phase 3: Role management (add/remove roles)
Phase 4: Role verification workflows
Phase 5: Per-role subscriptions logic
Phase 6: Advanced role-based access control

All while keeping backward compatibility! ✅
