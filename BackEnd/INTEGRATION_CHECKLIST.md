# Multi-Role Backend Integration Checklist

## Pre-Deployment Verification

### Code Changes ✅

- [x] `src/modules/user/user.model.js` - Added `roles[]` and `activeRole`
- [x] `src/modules/user/user.model.js` - Added pre-save migration hook
- [x] `src/modules/auth/auth.service.js` - Updated registration
- [x] `src/modules/auth/auth.service.js` - Updated login response
- [x] Role constants used throughout (no hardcoded strings)
- [x] ROLES imported from constants/roles.js

### Schema Structure ✅

- [x] `roles` array with proper structure:
  - [x] `type`: String enum using ROLES
  - [x] `verified`: Boolean, default false
  - [x] `subscription`: String, default "free"
  - [x] `active`: Boolean, default true
- [x] `activeRole`: String enum using ROLES, default null
- [x] Both fields use `Object.values(ROLES)` for validation

### Pre-save Hook ✅

- [x] Auto-initializes `roles` if empty and `role` exists
- [x] Sets `verified: true` for migrated users
- [x] Sets `subscription: "free"` for migrated users
- [x] Sets `active: true` for migrated users
- [x] Auto-initializes `activeRole` from `role`

### Registration ✅

- [x] New users get `roles` array initialized
- [x] New users get `activeRole` set
- [x] Registration response includes `roles` and `activeRole`
- [x] Registration response includes `role` (backward compatible)

### Login ✅

- [x] Login response includes `role` (unchanged)
- [x] Login response includes new `roles` array
- [x] Login response includes new `activeRole`
- [x] JWT still generated using single `role` (unchanged)
- [x] Device management unchanged
- [x] PIN validation unchanged

### Backward Compatibility ✅

- [x] `role` field unchanged and required
- [x] JWT tokens unchanged (single role claim)
- [x] Login validation flow unchanged
- [x] Device enforcement unchanged
- [x] Mobile app can ignore new fields and use `role`
- [x] Old users auto-migrate on first save

## Testing Scenarios

### Test 1: New User Registration

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Test Farmer",
  "email": "farmer@test.com",
  "phone": "1234567890",
  "pin": "1234",
  "role": "farmer"
}
```

**Expected Response:**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "...",
    "name": "Test Farmer",
    "email": "farmer@test.com",
    "phone": "1234567890",
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

**Status:** [ ] Not tested [ ] Testing [ ] Passed ✓

---

### Test 2: New User Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "farmer@test.com",
  "pin": "1234",
  "deviceId": "device-123"
}
```

**Expected:**

- User receives `role`, `roles`, and `activeRole` in response
- JWT token still valid (uses single role)
- Mobile app can read `role` field as before

**Status:** [ ] Not tested [ ] Testing [ ] Passed ✓

---

### Test 3: Existing User Migration

1. Take user from old system (has `role` but no `roles`)
2. Attempt login with new backend
3. Verify pre-save hook auto-initializes `roles` and `activeRole`

**Expected:**

- User logs in successfully
- Pre-save hook initializes:
  ```javascript
  roles: [{
    type: user.role,
    verified: true,
    subscription: "free",
    active: true
  }],
  activeRole: user.role
  ```
- Original `role` unchanged
- Login response includes all three fields

**Status:** [ ] Not tested [ ] Testing [ ] Passed ✓

---

### Test 4: Existing User Without Migration

1. Take user from old system who hasn't logged in yet
2. Force a save operation
3. Verify pre-save hook auto-initializes

**Expected:** Same as Test 3

**Status:** [ ] Not tested [ ] Testing [ ] Passed ✓

---

### Test 5: Mobile App Backward Compatibility

1. Run existing mobile app code
2. Parse login response
3. Verify app still gets `role` field
4. Verify app still functions normally

**Expected:**

- Old mobile app ignores new `roles` and `activeRole` fields
- Uses `role` field as before
- All navigation works unchanged
- No errors from unknown fields

**Status:** [ ] Not tested [ ] Testing [ ] Passed ✓

---

### Test 6: Multiple Role Support Setup

1. Manually add second role to existing user document:
   ```javascript
   roles: [
     { type: "farmer", verified: true, subscription: "free", active: true },
     { type: "buyer", verified: false, subscription: "free", active: false },
   ];
   ```
2. Login with that user
3. Verify login response includes all roles

**Expected:**

- Login response includes both roles in array
- `activeRole` still set to first role
- Both roles have their individual metadata

**Status:** [ ] Not tested [ ] Testing [ ] Passed ✓

---

### Test 7: Role Constants Validation

1. Search codebase for hardcoded role strings
2. Verify all use `ROLES.CONSTANT` instead

**Expected:**

- No `"farmer"`, `"buyer"`, `"driver"`, `"supplier"` hardcoded
- All use constants from `src/constants/roles.js`

**Status:** [ ] Not tested [ ] Testing [ ] Passed ✓

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passed (Test 1-7)
- [ ] Code review completed
- [ ] Security review completed (JWT still uses single role)
- [ ] Documentation reviewed
- [ ] Team briefing completed

### During Deployment

- [ ] Backup existing database
- [ ] Deploy new backend code
- [ ] Monitor application logs for errors
- [ ] Test login endpoint with test account
- [ ] Verify new users register with roles

### Post-Deployment

- [ ] Monitor for migration errors
- [ ] Test existing user login
- [ ] Test new user registration
- [ ] Verify mobile app still works
- [ ] Check metrics for any issues
- [ ] Collect feedback from users

### Rollback Plan (if needed)

- [ ] Revert to previous backend version
- [ ] Database not affected (new fields are optional)
- [ ] No data loss (only added new fields)
- [ ] Users can continue using old `role` field

## Success Metrics

- [ ] 0 breaking changes
- [ ] 100% backward compatible
- [ ] 0 failed existing logins
- [ ] New users initialize with roles successfully
- [ ] Mobile app continues working unchanged
- [ ] No performance degradation
- [ ] All tests passing

## Sign-Off

| Role          | Name | Date | Status |
| ------------- | ---- | ---- | ------ |
| Developer     |      |      | [ ]    |
| Code Reviewer |      |      | [ ]    |
| QA Lead       |      |      | [ ]    |
| DevOps        |      |      | [ ]    |
| Product Lead  |      |      | [ ]    |

---

## Notes

- This is a foundation-only implementation
- No user-facing features changed
- All changes are additive (no deletions)
- Existing system continues working unchanged
- Ready for future phases (role switching, verification, etc.)

**PHASE ROLE-1: MULTI-ROLE BACKEND FOUNDATION**
**Status: Ready for Integration Testing**
