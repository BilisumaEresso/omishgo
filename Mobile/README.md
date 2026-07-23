# OmishGo Mobile

React Native (Expo) app for Farmers and Buyers. See the repo root `README.md` for the full project overview, setup, and current feature status — this file just covers Mobile-specific structure and commands.

## Running

From the repo root: `npm run mobile` (recommended — see root README). Or directly here:

```bash
cd Mobile
npm install
npm start          # then press a (Android) / i (iOS) / w (web)
```

Requires the backend running and reachable — see `src/config/api.js` for how the base URL is resolved.

## Structure

```
src/
├── navigation/     RootNavigator → AuthNavigator | AppNavigator → FarmerNavigator / BuyerNavigator
├── screens/         auth/  buyer/  farmer/  onboarding/  role/  shared/
├── components/      common/ (AppButton, AppInput, AppText, AppHeader, ...) + role-specific folders
├── services/         API/service layer (auth, upload, drafts, browseCache, ...)
├── store/            Zustand stores (auth.store.js, saved.store.js)
├── locales/           en.json / am.json / om.json + i18n.js — every user-facing string goes through i18n, no hardcoded English
├── constants/         API endpoints, roles, reference data
└── utils/             connectivity, deviceId, misc helpers
```

## Notes for contributors

- **i18n is mandatory, not optional.** Amharic and Afan Oromo are core to the pilot (see root README / MVP doc). New user-facing strings need entries in all three locale files, not just `en.json`.
- **Expo SDK version matters.** This project targets a specific Expo SDK (see `package.json`'s `expo` version). When adding any `expo-*` package, pin it to the version listed for that SDK in `bundledNativeModules.json` inside the installed `expo` package — mismatched versions cause native-module errors in Expo Go that are easy to misdiagnose (see git history for a real example: `expo-image-picker` pinned to a future SDK's version caused `createPermissionHook is undefined`).
- **Auth token storage** goes through `expo-secure-store` (OS keychain/keystore), not plain AsyncStorage — see `services/storage.service.js`.
