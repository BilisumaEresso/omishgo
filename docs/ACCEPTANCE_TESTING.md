# OmishGo — MVP Acceptance Test Walkthrough

This is a practical, step-by-step way to verify the MVP core loop actually works end-to-end, against the codebase as it stands today (after Phases 1–10). It's meant to be run before each pilot session and again right before the pilot itself.

Each step lists the real route/behavior being exercised, so if a step fails you know exactly which file to look at.

## 0. Prerequisites

```bash
npm install                          # repo root — installs everything
cp BackEnd/.env.example BackEnd/.env # fill in MONGO_STR, JWT_SECRET, CLOUDINARY_*
npm run backend:seed                 # creates your Admin account(s) — see SEED_ADMIN_* in .env
npm run dev                          # backend + admin web panel
npm run mobile                       # separate terminal
```

Check the backend actually came up before doing anything else:

```bash
curl http://localhost:5000/health
```

Expect `{"success":true,"status":"ok","db":"connected",...}`. If `db` says `"disconnected"`, stop here and fix `MONGO_STR` first — nothing else will work.

## 1. Registration + Admin approval gate

*Exercises: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `requireVerified` middleware, `PUT /api/v1/admin/users/:id/approve`.*

1. In the app, register a Farmer (name, phone, 4-digit PIN, region/zone/wereda). Register a Buyer the same way.
2. Log in as the Farmer. Try to post a product — **this must be blocked** with "Your account is pending Admin approval" (403). If it isn't blocked, `requireVerified` isn't wired on `POST /api/v1/products` — check `product.routes.js`.
3. Log in as your seeded Admin (via the AdminWeb panel, or directly: `curl -X GET http://localhost:5000/api/v1/admin/users?isVerified=false -H "Authorization: Bearer <admin_token>"`). Approve the Farmer and Buyer.
4. Retry step 2 — it should now succeed.

**Pass condition:** an unapproved account cannot post, order, or message; an approved one can.

## 2. Farmer posts a listing, with a photo

*Exercises: `POST /api/v1/upload/image` (Cloudinary), `POST /api/v1/products`.*

1. As the approved Farmer, start a new listing. Add one photo from the gallery or camera.
2. Watch the photo slot — it should show a brief upload spinner, then settle to a plain thumbnail (uploaded). If it shows a "will upload later" badge instead, the app thinks it's offline — check your connection/Wi-Fi toggle.
3. Fill crop type, quantity, price, description, region/zone/wereda. Submit.
4. Confirm in Mongo (or via `GET /api/v1/products?farmerId=<farmerId>`) that the new product has a `photos` array with a real Cloudinary `res.cloudinary.com` URL, not a local `file://` path.

**Pass condition:** listing appears with a working photo URL, `status: "active"`.

## 3. Buyer finds it and messages the Farmer

*Exercises: `GET /api/v1/products`, `POST /api/v1/messages`, `GET /api/v1/messages/thread/:userId`.*

1. As the Buyer, open Browse. Search/filter by the crop type you just posted. It should appear in 3 taps or fewer (search → filter → tap card), per the MVP's usability target.
2. Open the listing, message the Farmer ("Are these still available?").
3. Switch to the Farmer account — a new-message notification should appear, and the thread should show the message.
4. Farmer replies. Switch back to Buyer — reply should appear.

**Pass condition:** a full two-way message thread completes without either side needing help.

## 4. Buyer places an order — stock actually moves

*Exercises: `POST /api/v1/orders` (atomic stock reservation, Phase 9 fix).*

1. Note the listing's quantity (e.g. 10 kg).
2. As the Buyer, place an order for less than the full quantity (e.g. 4 kg).
3. Check the product again — quantity should now read 6, `status` still `"active"`.
4. Order the remaining 6 kg. Quantity should now read 0, and `status` should have flipped to `"sold"` automatically.
5. Try to place one more order on the same listing — it must be rejected (400, "no longer available" or insufficient stock), never silently accepted.

**Pass condition:** stock decrements on every order, a listing can't be oversold, and a sold-out listing auto-hides from Browse (since Browse only shows `status: "active"`).

## 5. Order lifecycle + stock restoration on cancel

*Exercises: `PATCH /api/v1/orders/:id/status`.*

1. As the Farmer, confirm the order from step 4 (`pending → confirmed`), then cancel it instead of continuing.
2. Check the product: quantity should be restored (back to whatever it was before that order), and `status` should flip back to `"active"` if it had gone to `"sold"`.

**Pass condition:** cancelling an order gives the stock back — it doesn't vanish.

## 6. Offline draft mode (the one that's easy to fake-pass)

*Exercises: `services/drafts.service.js`, `PostProductScreen` offline branch, `MyDraftsScreen` auto-sync.*

1. Turn on Airplane Mode on the test device.
2. As the Farmer, start a new listing, add a photo. The photo slot should show "will upload later" (no error, no spinner stuck forever).
3. Submit. You should see "Save Draft" as the button label (not "Post Listing"), and land back on the dashboard with a message that it was saved as a draft.
4. Confirm a banner appears on the Farmer dashboard: "1 listing(s) saved offline — tap to view and sync."
5. Turn Airplane Mode back off. Open My Drafts (via the banner, or dashboard → My Drafts).
6. Within a few seconds it should auto-sync: the photo uploads, the product gets created via the real API, and the draft disappears from the list.
7. Verify the product actually exists via Browse or `GET /api/v1/products`.

**Pass condition:** nothing is lost when offline, and reconnecting resolves it without the farmer re-typing anything.

## 7. Buyer browse cache (offline read path)

*Exercises: `services/browseCache.service.js`.*

1. As the Buyer, open Browse with a normal connection so it fetches and caches successfully.
2. Turn on Airplane Mode. Force-close and reopen the app, open Browse again.
3. It should show the last-known listings with a small "showing cached results (offline)" banner — not a blank screen or a dead error state.

**Pass condition:** offline Browse shows something useful, matching the MVP doc's "cache last-known listings when offline" requirement.

## 8. Language check (do this in all three languages, not just English)

*Exercises: `en.json` / `am.json` / `om.json`, i18n coverage.*

1. Switch language to Amharic in Settings. Repeat steps 1–4 above.
2. Switch to Afan Oromo. Repeat again.
3. Watch specifically for: any screen showing raw English text where it shouldn't, any string showing a raw `key.likeThis` instead of translated text (a missing i18n key), and correct Ethiopic script rendering (test on a **real device** — emulators can mask font issues, per the MVP doc's own warning).

**Pass condition:** the entire core loop — register, list, browse, message, order — completes in each of the three languages without falling back to English or showing raw keys.

**Reminder:** the Amharic/Afan Oromo strings added during Phases 7–8 (photo upload, offline drafts) are machine-quality, not native-speaker-reviewed. Per the MVP doc's own rule ("do not use machine translation for the final UI strings"), get a native speaker to review every screen — old and new — before real pilot participants touch the APK.

## 9. Rate limiting sanity check

*Exercises: `authLimiter` on `/auth/register` and `/auth/login`.*

```bash
for i in $(seq 1 12); do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:5000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"phone":"0000000000","pin":"0000"}'
done
```

**Pass condition:** the first ~10 requests return 400/401 (bad credentials), and the remaining ones return 429 ("Too many attempts") — confirms brute-force protection is active outside test env.

## 10. Final go/no-go checklist

Map directly to the MVP doc's Section 12 success criteria — check off against real evidence, not assumption:

- [ ] At least 10 farmers can complete registration + Admin approval + first listing without your help
- [ ] At least 4 buyers can find a listing and start a message thread
- [ ] At least one full order (place → confirm → deliver) completes with correct stock movement
- [ ] Average time from registration to first listing is under 10 minutes (time it with a stranger, not yourself)
- [ ] Core loop works in all three languages, verified on a real low-end Android device
- [ ] All core screens load in under 5 seconds on throttled 3G
- [ ] A native speaker has signed off on Amharic and Afan Oromo strings — including the newer photo-upload and offline-draft strings
- [ ] `/health` reports `db: connected` and an uptime monitor is pinging it (see `BackEnd/docs/POST_MVP_BACKLOG.md` / Render free-tier sleep risk)
- [ ] Two Admin accounts exist (`npm run backend:seed` with both `SEED_ADMIN_*` and `SEED_ADMIN2_*` set) — not just one

If 1, 2, and the "core loop works without help" bullet are all true, you have enough evidence to approach accelerator programs per the MVP doc's funding section. If the order/stock bullet is also solid, you have a real transaction story, not just a browsing demo.
