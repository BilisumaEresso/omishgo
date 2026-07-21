# POST MVP BACKLOG

- The roles/subscription module (path: src/modules/roles/) — status: built but not wired to the User schema (references user.activeRole and user.roles which don't exist on User model). To re-enable: add activeRole and roles[] fields to the User schema, then re-mount the router in app.js.
- The device-lock module (path: src/utils/device.service.js) — status: built but never called from auth.service.js login flow. To re-enable: call validateDeviceForLogin() and updateUserDevice() inside loginUser() in src/modules/auth/auth.service.js.
- Both are deferred until after the MVP pilot per the MVP doc's scope section.
