# eBooi — Android app (React Native / Expo)

Bangla-first digital ebook store. Same backend and accounts as the website.

## Run it

```bash
cd mobile
pnpm install            # or: npm install
cp .env.example .env    # set EXPO_PUBLIC_API_URL
```

The app uses a native PDF reader (`react-native-pdf`), so it needs a
**development build** — Expo Go works for everything else, but the reader
falls back to "open in another app".

```bash
npx expo run:android    # builds and installs a dev build on an emulator / USB phone
npx expo start --dev-client
```

Type-check: `pnpm typecheck`.

## Backend URL

| Where the app runs | `EXPO_PUBLIC_API_URL` |
| --- | --- |
| Android emulator, backend on your PC | `http://10.0.2.2:5000/api/v1` |
| Real phone, same Wi-Fi | `http://<pc-lan-ip>:5000/api/v1` |
| Production | `https://<your-render-service>.onrender.com/api/v1` |

Plain `http://` only works in debug builds. Release builds need `https://`.

## How it differs from the website

* **Auth:** the website keeps the refresh token in an httpOnly cookie. The app
  sends `x-client: mobile`; the backend then also returns the refresh token in
  the response body and the app keeps it in the Android Keystore
  (`expo-secure-store`).
* **Payment (EPS):** checkout opens EPS in an in-app browser. The orders created
  by the app are marked `source: "mobile"`, so after EPS the backend redirects to
  `ebooi://payment-success|payment-failed|payment-cancel?orderId=…` instead of
  the website. Unfinished payments stay "pending" and can be retried from the
  order screen.
* **Reader:** the purchased PDF is downloaded with the user's token into the app
  cache and shown with `react-native-pdf`.

## Screens

Home · Books (search, category, sort, infinite scroll) · Book details (reviews,
wishlist, preview, buy now) · Cart · Checkout (coupon, EPS) · Orders + invoice ·
Library + reader · Profile (edit, avatar, password) · Theme (light/dark/system +
accent colour) · Login / register / forgot password.

## Release checklist (Play Store, later)

1. Put the production API URL in `.env` / EAS secrets (https only).
2. `app.json`: confirm `android.package` (`bd.ebooi.app`) — it can't change after publishing.
3. `npx eas-cli build -p android --profile production` (creates an `.aab` and the signing key).
4. Play Console: privacy policy URL (`https://ebooi.bd/privacy`), data-safety form, content rating.
5. Google Play policy on digital goods: check whether Play Billing is required for ebook sales before submitting.
