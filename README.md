# OmishGo

A mobile-first marketplace connecting Ethiopian farmers directly with product buyers, cutting out middlemen. Built for a structured summer pilot in the Meki / Rift Valley area, with the Farmers' Union acting as platform Admin.

This README reflects the actual current state of the codebase. If you're looking for the full product vision (all future roles/versions) or the pilot research plan, those live outside this repo as separate planning documents — this file only describes what's actually built here.

## Roles in this build

Three roles are implemented: **Farmer**, **Buyer**, **Admin**. (Supplier and Driver roles are designed in the wider product plan but deliberately out of scope for this MVP — see `BackEnd/docs/POST_MVP_BACKLOG.md`.)

- **Farmer** — registers, posts product listings (with photos), messages buyers, manages orders.
- **Buyer** — browses/searches listings, messages farmers, places orders.
- **Admin** (Farmers' Union) — approves new user accounts before they can post or message.

## Core loop

Farmer registers → Admin approves → Farmer posts a listing → Buyer finds it and messages the farmer → an order is placed and tracked through delivery.

## Tech stack

| Layer | Technology |
|---|---|
| Mobile app | React Native (Expo), Farmer/Buyer/Admin flows |
| Admin web panel | React + Vite (`AdminWeb/`) |
| Backend API | Node.js + Express, REST, `/api/v1/*` |
| Database | MongoDB (Atlas) |
| Auth | JWT + bcrypt, phone + 4-digit PIN |
| Photo storage | Cloudinary |
| i18n | English, Amharic (አማርኛ), Afan Oromo — mandatory, not optional |

## Repo layout

```
omishgo/
├── BackEnd/     Node/Express API
├── Mobile/      React Native (Expo) app
├── AdminWeb/    React admin panel
└── package.json Root convenience scripts (see below)
```

## Getting started

From the repo root:

```bash
npm install          # installs concurrently/rimraf here, then BackEnd + Mobile + AdminWeb via postinstall
```

Then, in `BackEnd/.env` (copy from `BackEnd/.env.example` and fill in real values — MongoDB URI, JWT secret, Cloudinary credentials):

```bash
cp BackEnd/.env.example BackEnd/.env
```

Day to day, from the repo root (no `cd`-ing into subfolders needed):

```bash
npm run dev            # backend + admin web panel together
npm run mobile          # Expo — run in its own terminal (needs its own interactive QR-code UI)
```

Other useful scripts:

```bash
npm run backend:prod    # plain node, no dev file-watcher
npm run backend:test    # backend Jest suite
npm run backend:seed    # seed Admin account(s) — see below
npm run web:build       # build the admin panel
npm run clean           # wipe all node_modules
```

See `package.json` for the full list. These are convenience wrappers (`--prefix`), not npm workspaces — each app still has its own `package.json`/lockfile and can be installed/run independently if you prefer working directly inside `BackEnd/`, `Mobile/`, or `AdminWeb/`.

### Seeding an Admin account

The pilot needs at least one working Admin (the Farmers' Union rep) able to approve new users. Set `SEED_ADMIN_PHONE` / `SEED_ADMIN_PIN` (and optionally a backup `SEED_ADMIN2_*`) in `BackEnd/.env`, then:

```bash
npm run backend:seed
```

Safe to re-run — it skips any phone number that already exists rather than erroring or duplicating.

## Testing

```bash
npm run backend:test
```

Requires a real MongoDB instance reachable at `MONGO_URI` (defaults to `mongodb://127.0.0.1:27017/omishgo_test`) — the suite is written with `mongoose` + `supertest` against a live database, not an in-memory mock.

## Where things stand

Registration/login (PIN-based, rate-limited), the Admin approval gate, product listings with photo upload, buyer browse with offline caching, in-app messaging, order placement with real stock tracking, and offline draft mode for farmers with spotty connectivity are all implemented. Full acceptance-test steps for verifying the MVP end-to-end are in `docs/ACCEPTANCE_TESTING.md`.

Deferred features (Supplier role, Driver/logistics role, payments, ratings) and why they're deferred are documented in `BackEnd/docs/POST_MVP_BACKLOG.md`.
