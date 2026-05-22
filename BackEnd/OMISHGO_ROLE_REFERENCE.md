# OmishGo Multi-Role System - Quick Reference

## Simplified Role Model

### User Roles (4 Types)

1. **FARMER** - Core role, default for all new users
2. **BUYER** - Purchases from farmers
3. **SUPPLIER** - Sells supplies to farmers
4. **DRIVER** - Delivery/logistics

### Admin Role

- **ADMIN** - Internal only, hard-blocked from user selection
- Cannot be assigned to regular users
- Backend use only

---

## Role Structure (Simplified)

```javascript
roles: [
  {
    type: String, // Role: "farmer", "buyer", "supplier", "driver"
    status: "active", // Status: "active", "pending", "blocked"
    subscriptionTier: "free", // Tier: "free", "premium", etc.
  },
];

activeRole: String; // Current active role
role: String; // Backward compatibility (kept)
```

---

## Registration (Farmer-First)

### Request

```json
POST /api/v1/auth/register
{
  "name": "John Farmer",
  "email": "john@example.com",
  "phone": "1234567890",
  "pin": "1234"
}
```

**Note:** No role in request - defaults to FARMER

### Response

```json
{
  "id": "...",
  "name": "John Farmer",
  "role": "farmer",
  "roles": [
    {
      "type": "farmer",
      "status": "active",
      "subscriptionTier": "free"
    }
  ],
  "activeRole": "farmer"
}
```

---

## Login Response

```json
{
  "user": {
    "id": "...",
    "name": "John Farmer",
    "role": "farmer",
    "roles": [
      {
        "type": "farmer",
        "status": "active",
        "subscriptionTier": "free"
      }
    ],
    "activeRole": "farmer"
  },
  "token": "...",
  "refreshToken": "..."
}
```

---

## User Examples

### Simple Farmer

```javascript
{
  role: "farmer",
  roles: [{
    type: "farmer",
    status: "active",
    subscriptionTier: "free"
  }],
  activeRole: "farmer"
}
```

### Farmer + Supplier (Multiple Roles)

```javascript
{
  role: "farmer",
  roles: [
    {
      type: "farmer",
      status: "active",
      subscriptionTier: "free"
    },
    {
      type: "supplier",
      status: "active",
      subscriptionTier: "free"
    }
  ],
  activeRole: "farmer"
}
```

### Role Pending Verification

```javascript
{
  role: "farmer",
  roles: [
    {
      type: "farmer",
      status: "active",
      subscriptionTier: "free"
    },
    {
      type: "buyer",
      status: "pending",     // ← Waiting approval
      subscriptionTier: "free"
    }
  ],
  activeRole: "farmer"
}
```

### Role Blocked

```javascript
{
  role: "farmer",
  roles: [
    {
      type: "farmer",
      status: "active",
      subscriptionTier: "free"
    },
    {
      type: "driver",
      status: "blocked",     // ← Blocked/suspended
      subscriptionTier: "free"
    }
  ],
  activeRole: "farmer"
}
```

---

## Role Constants

```javascript
import { ROLES } from "../../constants/roles.js";

// Available roles
ROLES.FARMER; // "farmer"
ROLES.BUYER; // "buyer"
ROLES.DRIVER; // "driver"
ROLES.SUPPLIER; // "supplier"
ROLES.ADMIN; // "admin" (backend only)
```

**Always use constants - never hardcode!**

---

## Key Features

### ✅ Farmer-First

- All users start as FARMER
- Simple onboarding for low digital literacy

### ✅ Multi-Role Support

- Users can have multiple roles
- Each role independent with own status

### ✅ Role Status Tracking

- **active** - Role is active and usable
- **pending** - Awaiting verification
- **blocked** - Temporarily disabled

### ✅ Subscription Per Role

- Each role can have different subscription tier
- Flexible monetization

### ✅ Admin Protected

- Admin role hard-blocked from users
- Can only be set internally

### ✅ Backward Compatible

- Old `role` field still present
- Mobile app unaffected
- No authentication changes

---

## Migration (Automatic)

### Old User (Before Refactor)

```javascript
{
  role: "farmer",
  roles: []  // Empty
}
```

### Same User (After First Save)

```javascript
{
  role: "farmer",
  roles: [{
    type: "farmer",
    status: "active",
    subscriptionTier: "free"
  }],
  activeRole: "farmer"
}
```

**Automatic on first save - no user action needed!**

---

## Do's and Don'ts

### ✅ DO

- Use `ROLES.FARMER` constant
- Check `roles[].status` for permissions
- Use `activeRole` to determine current role
- Use `subscriptionTier` for feature access
- Support multiple roles per user

### ❌ DON'T

- Hardcode "farmer", "buyer", etc.
- Assign admin role to users
- Use old `verified` boolean (removed)
- Use old `active` boolean (use status instead)
- Use old `subscription` field (use subscriptionTier)

---

## Useful Code Patterns

### Check if User is Farmer

```javascript
const isFarmer = user.roles.some(
  (r) => r.type === ROLES.FARMER && r.status === "active",
);
```

### Get User's Active Roles

```javascript
const activeRoles = user.roles.filter((r) => r.status === "active");
```

### Check Role Subscription

```javascript
const farmerRole = user.roles.find((r) => r.type === ROLES.FARMER);
const tier = farmerRole?.subscriptionTier;
```

### Switch Active Role

```javascript
// Future feature - Phase 2
user.activeRole = ROLES.BUYER;
await user.save();
```

---

## API Compatibility

### Mobile App

- Still receives `role` field ✅
- Can ignore new `roles`, `activeRole` ✅
- Works unchanged ✅

### New Integrations

- Can use `roles` array ✅
- Can check status per role ✅
- Can access subscriptionTier ✅

### Admin Dashboard (Future)

- Will use `roles` array ✅
- Will show all roles ✅
- Will manage status ✅

---

## Status Transitions

### Normal User Journey

```
New User → FARMER (active) → Add more roles → Switch active role
```

### Verification Flow (Phase 2)

```
Apply for role → PENDING → Admin reviews → Verify → ACTIVE
```

### Blocking

```
Active role → Violation → BLOCKED → Admin review → ACTIVE
```

---

## Success Checklist

- ✅ Roles simplified to 3 fields
- ✅ Admin role hard-blocked
- ✅ New users default to FARMER
- ✅ Multiple roles supported
- ✅ Backward compatible
- ✅ No auth changes
- ✅ Migration automatic
- ✅ Role constants used throughout

---

**OmishGo Multi-Role System v1.0**
**Status: PRODUCTION READY** ✅
