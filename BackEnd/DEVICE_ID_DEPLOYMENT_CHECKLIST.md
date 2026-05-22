# Device ID Improvement - Deployment Checklist

## Pre-Deployment Verification

### Code Review

- [ ] Review `src/utils/device.service.js`
  - [ ] `isDevMode()` correctly checks NODE_ENV
  - [ ] `validateDeviceForLogin()` handles both dev and prod
  - [ ] Error handling never crashes login
  - [ ] Logging only active in development

- [ ] Review `src/modules/auth/auth.service.js` changes
  - [ ] Device service imported correctly
  - [ ] `validateDeviceForLogin()` called before token generation
  - [ ] Device updated after successful login
  - [ ] Error responses include device move hints

- [ ] Environment variables
  - [ ] `.env` has `NODE_ENV` set appropriately
  - [ ] Development team knows about NODE_ENV settings

### Documentation Review

- [ ] DEVICE_ID_IMPROVEMENT.md accurate and complete
- [ ] DEVICE_ID_MOBILE_GUIDE.md sent to mobile team
- [ ] Examples are clear and runnable
- [ ] Testing procedures documented

## Local Development Testing

### Test with NODE_ENV=development

- [ ] Start backend: `NODE_ENV=development npm start`
- [ ] Test login from Device 1
  - [ ] Login succeeds ✓
  - [ ] User data returned ✓
  - [ ] Device ID saved ✓

- [ ] Test login from Device 2 (simulated by changing deviceId)
  - [ ] Login succeeds ✓ (development bypass!)
  - [ ] Old device session still valid (if desired)
  - [ ] Device ID updated ✓

- [ ] Check logs
  - [ ] Device service logs appear (dev mode logging active)
  - [ ] No errors in console
  - [ ] Logs are readable (truncated device IDs)

### Test with NODE_ENV=production

- [ ] Start backend: `NODE_ENV=production npm start`
- [ ] Test login from Device 1
  - [ ] Login succeeds ✓
  - [ ] Device ID validated ✓
  - [ ] User.activeDeviceId set ✓

- [ ] Test login from Device 2 (different deviceId)
  - [ ] Login fails ✓
  - [ ] Error code: `DEVICE_ALREADY_ACTIVE` ✓
  - [ ] Response includes `requiresAction: "MOVE_DEVICE"` ✓

- [ ] Device move flow (if implemented)
  - [ ] OTP sent to user ✓
  - [ ] User enters OTP ✓
  - [ ] Device updated ✓
  - [ ] Next login from Device 2 succeeds ✓

- [ ] Verify no verbose logs (production security)
  - [ ] No device service debug logs
  - [ ] Errors logged at appropriate level
  - [ ] No sensitive data in logs

## Staging Deployment

### Pre-Staging

- [ ] Code merged to staging branch
- [ ] All tests passing locally
- [ ] Code review approved

### Staging Environment

- [ ] Deploy code to staging
  - [ ] `src/utils/device.service.js` deployed
  - [ ] `src/modules/auth/auth.service.js` deployed
  - [ ] Other related files deployed

- [ ] Set `.env` for staging
  - [ ] `NODE_ENV=production` (test strict mode)
  - [ ] Other vars configured

### Staging Testing

- [ ] Full regression test
  - [ ] Existing users can still login
  - [ ] PIN authentication works
  - [ ] JWT tokens valid
  - [ ] Mobile app compatible

- [ ] Device ID testing
  - [ ] Single device login works
  - [ ] Device move prompt appears
  - [ ] Device move flow (if available)
  - [ ] Error messages clear

- [ ] Performance
  - [ ] Login speed unchanged
  - [ ] No extra database queries
  - [ ] Device validation fast (<100ms)

- [ ] Monitor logs
  - [ ] No unexpected errors
  - [ ] Device errors properly tracked
  - [ ] No security leaks

- [ ] Mobile team testing (if available)
  - [ ] Test with Expo Go
  - [ ] Test stable device ID strategy
  - [ ] Test fallback logic
  - [ ] Test from multiple devices

### Staging Bug Fixes

- [ ] Any issues found? Fix and redeploy
- [ ] Re-test after fixes
- [ ] Verify no regressions

## Production Deployment

### Final Checklist

- [ ] All staging tests passed
- [ ] Code review approved
- [ ] Documentation updated
- [ ] Mobile team notified
- [ ] Support team briefed (device move flow)

### Deployment Steps

- [ ] Deploy code
  - [ ] Backup database (just in case)
  - [ ] Deploy `device.service.js`
  - [ ] Deploy updated `auth.service.js`
  - [ ] Other related changes

- [ ] Set `.env` for production
  - [ ] `NODE_ENV=production` (IMPORTANT!)
  - [ ] All other vars configured
  - [ ] No debug/dev settings

- [ ] Verify deployment
  - [ ] API endpoints responding
  - [ ] Device service active
  - [ ] Auth service working
  - [ ] Logs normal

### Post-Deployment Monitoring

First 24 Hours:

- [ ] Monitor auth error rates
  - [ ] DEVICE_ALREADY_ACTIVE errors tracked
  - [ ] Other device errors tracked
  - [ ] Rate normal/expected

- [ ] Monitor user feedback
  - [ ] No complaints about login
  - [ ] Device move flow working
  - [ ] User education (if needed)

- [ ] Check logs
  - [ ] No verbose logs (production security)
  - [ ] Errors only on device mismatch
  - [ ] Performance metrics normal

### Rollback Plan

If issues found:

- [ ] Identify the issue
- [ ] Stop deployment
- [ ] Rollback to previous version
  - [ ] Revert code
  - [ ] Restore `.env` to previous
  - [ ] Verify users can login again

- [ ] Post-mortem
  - [ ] What went wrong?
  - [ ] How to prevent next time?
  - [ ] Fix and retry

## Post-Deployment Documentation

### Mobile Team Notification

- [ ] Send DEVICE_ID_MOBILE_GUIDE.md
- [ ] Explain new device ID strategy
- [ ] Show priority-based fallback
- [ ] Request stable device ID implementation
- [ ] Timeline for mobile update

### Support Team Training

- [ ] Explain device lock in production
- [ ] Show device move flow
- [ ] When to suggest device move
- [ ] How to debug device issues
- [ ] Document common scenarios

### Customer Communication (if needed)

- [ ] Device security improved ✓
- [ ] No changes for existing users ✓
- [ ] Device move available if needed ✓
- [ ] Expo Go testing smoother ✓

## Metrics & Success

### Success Indicators

- [ ] Login success rate maintained (>99%)
- [ ] Device mismatch errors tracked and managed
- [ ] Device move flow completion rate tracked
- [ ] Performance metrics stable
- [ ] No security incidents

### Monitoring Dashboard

- [ ] Track device validation failures
- [ ] Track device move requests
- [ ] Track error codes and types
- [ ] Monitor by environment

## Rollout Timeline

Recommended Approach:

1. **Day 1-2**: Local development testing
   - Verify dev bypass works smoothly
   - Test production strict mode
   - Fix any bugs

2. **Day 3-5**: Staging testing
   - Full regression testing
   - Device flow testing
   - Performance verification
   - Mobile team testing (if available)

3. **Day 6-7**: Production deployment
   - Deploy during low-traffic time
   - Monitor for 24 hours
   - Collect feedback

4. **Week 2**: Optimization
   - Tune error messages
   - Refine device move flow
   - Update documentation based on feedback

## Sign-Off

- [ ] Backend Lead: **\*\***\_\_\_**\*\*** Date: \_\_\_
- [ ] DevOps Lead: **\*\***\_\_\_**\*\*** Date: \_\_\_
- [ ] Mobile Lead: **\*\***\_\_\_**\*\*** Date: \_\_\_
- [ ] Product Manager: **\*\***\_\_\_**\*\*** Date: \_\_\_

## Notes

```
Add notes about specific deployment details:
- Specific NODE_ENV values to use
- Deployment time window
- Rollback procedure
- Emergency contacts
- Known issues or gotchas
```

---

**Document Version**: 1.0
**Last Updated**: [Today's Date]
**Status**: Ready for Deployment ✅
