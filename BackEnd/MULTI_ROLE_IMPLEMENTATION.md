# Multi-Role Backend Implementation

## Summary

Successfully upgraded the backend authentication system from **single-role to multi-role architecture** while maintaining complete backward compatibility.

## Changes Implemented

### 1. User Model Enhancement (`src/modules/user/user.model.js`)

#### New Fields Added:

```javascript
roles: [
  {
    type: String, // enum: ROLES
    verified: Boolean, // default: false
    subscription: String, // default: "free"
    active: Boolean, // default: true
  },
];

activeRole: String; // enum: ROLES, default: null
```

#### Pre-save Hook Enhancement:

- Auto-initializes `roles` array from existing `role` field if empty
- Sets `activeRole` from `role` if not already set
- Ensures backward compatibility for legacy users

**Example Migration:**

```javascript
// Old user (before multi-role):
{
  _id: "user123",
  name: "John Farmer",
  phone: "1234567890",
  role: "farmer",
  roles: [],
  activeRole: null
}

// After first save:
{
  _id: "user123",
  name: "John Farmer",
  phone: "1234567890",
  role: "farmer",           // Unchanged
  roles: [
    {
      type: "farmer",
      verified: true,
      subscription: "free",
      active: true
    }
  ],
  activeRole: "farmer"
}
```

### 2. Registration Updated (`src/modules/auth/auth.service.js`)

**New users now initialize with:**

- `role`: Set to registration role
- `roles`: Array with single role entry (type, verified=true, subscription="free", active=true)
- `activeRole`: Set to registration role

**Registration Response includes:**

```javascript
{
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,              // Backward compatible
  roles: user.roles,            // New multi-role data
  activeRole: user.activeRole   // New active role
}
```

### 3. Login Updated (`src/modules/auth/auth.service.js`)

**Login Response Structure:**

```javascript
{
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,              // Still present for mobile app
    roles: user.roles,            // New multi-role array
    activeRole: user.activeRole   // Current active role
  },
  token: "JWT token",
  refreshToken: "refresh token"
}
```

**Important:**

- Old mobile app still receives `role` field unchanged
- New fields (`roles`, `activeRole`) are included alongside
- JWT structure unchanged (uses `role` for token generation)
- Authentication flow completely unchanged

## Backward Compatibility Guarantees

✅ **Existing `role` field**: Unchanged, still required, still used for JWT generation
✅ **JWT tokens**: Unchanged structure, still uses single `role` claim
✅ **Login validation**: No changes to email/phone/PIN validation
✅ **Device management**: Single-device enforcement unchanged
✅ **Mobile app**: Receives `role` field as before, plus new fields
✅ **Existing users**: Auto-initialized on first access via pre-save hook

## API Response Examples

### Registration Response (New User)

```json
{
  "statusCode": 201,
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Alice Farmer",
    "email": "alice@example.com",
    "phone": "+1234567890",
    "role": "farmer",
    "roles": [
      {
        "type": "farmer",
        "verified": true,
        "subscription": "free",
        "active": true
      }
    ],
    "activeRole": "farmer"
  }
}
```

### Login Response (Backward Compatible)

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
      "role": "farmer",
      "roles": [
        {
          "type": "farmer",
          "verified": true,
          "subscription": "free",
          "active": true
        }
      ],
      "activeRole": "farmer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Migration Path for Existing Users

### Automatic Migration on First Login

1. User with existing `role` but empty `roles` attempts login
2. Pre-save hook detects: `role` exists AND `roles` is empty
3. Automatically initializes:
   ```javascript
   roles = [
     {
       type: user.role,
       verified: true,
       subscription: "free",
       active: true,
     },
   ];
   activeRole = user.role;
   ```
4. User saved with both fields
5. Login response includes new `roles` and `activeRole` fields

### No Data Loss

- Original `role` field preserved
- All existing permissions intact
- Existing JWT tokens still valid
- No re-authentication required

## Role Constants Usage

All role references use constants from `src/constants/roles.js`:

```javascript
export const ROLES = {
  BUYER: "buyer",
  FARMER: "farmer",
  DRIVER: "driver",
  ADMIN: "admin",
  SUPPLIER: "supplier",
};
```

Schema validates against `Object.values(ROLES)` to prevent typos.

## Future Capabilities Enabled

This foundation now supports:

1. **Multiple roles per user**: Each user can have multiple roles with individual metadata
2. **Role verification workflows**: Track which roles are verified/unverified
3. **Per-role subscriptions**: Different subscription levels per role
4. **Active role switching**: Users can switch between their active roles
5. **Role deactivation**: Soft-disable roles without deletion

## Implementation Details

### Files Modified

- `src/modules/user/user.model.js` - Added `roles` array and `activeRole` field with pre-save hook
- `src/modules/auth/auth.service.js` - Updated registration and login to initialize and return multi-role data

### Files NOT Modified (Backward Compatible)

- `src/modules/auth/auth.controller.js` - Still works as-is
- `src/utils/generateToken.js` - Still uses single `role` for JWT
- `src/middleware/auth.js` - Still validates single role
- `src/constants/roles.js` - Already using ROLES constants

### Role Constants Used

- All references use `ROLES.FARMER`, `ROLES.BUYER`, `ROLES.DRIVER`, `ROLES.SUPPLIER`, `ROLES.ADMIN`
- No hardcoded role strings
- Enum validation on both `role` and `activeRole` fields

## Verification Checklist

- ✅ `roles` array exists with full metadata structure
- ✅ `activeRole` field added and initialized
- ✅ Old `role` field unchanged and still required
- ✅ Backward compatibility maintained
- ✅ Auto-migration for legacy users implemented
- ✅ Login returns both old and new fields
- ✅ New users initialize with roles
- ✅ Role constants used throughout
- ✅ No JWT structure changes
- ✅ No auth flow changes
- ✅ Pre-save hook handles migration

## Next Steps

Future phases can now:

1. Add role switching endpoint (change `activeRole`)
2. Add role management endpoints (add/remove roles)
3. Implement role verification workflow
4. Add per-role subscription logic
5. Implement role-based access control (RBAC) for new endpoints

All while maintaining complete backward compatibility with existing mobile app.
