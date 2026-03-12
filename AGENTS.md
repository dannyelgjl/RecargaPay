# AGENTS

## Runtime
- Use Node `22.11.0` (`.nvmrc` is the source of truth).
- Use Yarn 1.x.

## Repository Map
- `src/components`
  reusable presentational UI. Each component should keep rendering in `Component.tsx`, visual definitions in `styles.ts`, and contracts in `types.ts`.
- `src/screens`
  route-level UI. Screens should keep rendering in `Screen.tsx` or `index.tsx`, local contracts in `types.ts`, local screen orchestration in `useContainer.ts`, and visuals in `styles.ts`.
- `src/store`
  global Redux state, slices, selectors, and typed hooks. This is the only place for shared app state.
- `src/services`
  side effects and infrastructure access, including auth, secure storage, wallet fetching, cache, device language, and background sync helpers.
- `src/feature/analytics`
  provider-agnostic tracking abstraction. Feature code should call `analytics.track(...)` instead of talking directly to third-party SDKs.
- `src/i18n`
  app translations and locale resolution. UI text should come from here instead of hardcoded strings whenever practical.
- `src/config`
  environment-aware app configuration such as API base URL.
- `src/routes`
  root navigation flow and screen registration.
- `src/styles`
  theme tokens and shared visual configuration.
- `src/utils`
  pure helpers and small shared utilities with no business ownership.
- `android/app/src/main/java/com/recargapay`
  Android application shell plus native modules/packages.
- `ios/recargaPay`
  iOS application shell plus native modules.
- repository root
  `db.json` and `routes.json` define the mock API assets; `README.md` and the ADR document runtime and architecture decisions.

## Architecture Rules
- Keep a single Redux store in `src/store/store.ts`.
- Use the repository-root mock server assets (`db.json`, `routes.json`) and keep the runtime API on port `3000`.
- Secure data must go through `SecureStorageModule` with the JS fallback only for OTA/backward compatibility.
- Device language must come from native platform access without third-party libraries.
- Keep business logic out of screen/component render files whenever it starts coordinating navigation, async flows, or Redux dispatches.
- Prefer this separation:
  - `components`: presentational and reusable
  - `screens`: route composition
  - `useContainer`: screen orchestration
  - `services`: IO and platform access
  - `store`: global state transitions

## Current Application Architecture
- Navigation is gated by auth state in `src/routes/index.tsx`:
  - no PIN -> `CreatePin` then `ConfirmPin`
  - PIN exists but session locked -> `Unlock`
  - unlocked session -> `Wallet` and `TransactionDetail`
- Redux is split into three domains:
  - `auth`: PIN bootstrap, unlock state, failed attempts, relock timing
  - `wallet`: balance, transactions, transaction details, cache hydration, refresh state
  - `connectivity`: request-driven online/offline state and last successful sync
- Wallet data flow is offline-first:
  - hydrate latest snapshot from local cache
  - fetch fresh data from the mock API
  - persist refreshed snapshot
  - keep cached data available when sync fails
- Native capabilities are always accessed through JS wrappers:
  - `src/services/device/deviceLanguage.ts`
  - `src/services/secure/secureStorage.ts`
  This preserves OTA safety when a JS bundle runs on an older binary without the expected native module.

## Folder-Level Conventions
- `styles.ts` should export named styled-components only.
- Render files should import styles as `import * as S from './styles'`.
- `types.ts` should contain local props/contracts only, not business logic.
- `mock.ts` inside screens is only for static keypad/layout data local to that screen flow.
- Avoid duplicating domain types; if a type already belongs to `store` or `services`, reuse it instead of redefining it locally.

## Native Module Boundaries
- Android device language lives under `android/app/src/main/java/com/recargapay/device`.
- Android secure storage lives under `android/app/src/main/java/com/recargapay/secure`.
- iOS device language lives in `ios/recargaPay/DeviceLanguageModule.*`.
- iOS secure storage lives in `ios/recargaPay/SecureStorageModule.*`.
- JS code must never assume these native modules always exist; guarded access is mandatory because of OTA/backward compatibility requirements.

## Delivery Rules
- Update `README.md` and the ADR whenever architecture or workflow changes.
- Preserve offline-first behaviour: cached wallet snapshot first, background sync second.
- Do not log sensitive financial payloads.
- Keep `AGENTS.md` aligned with the real folder structure and implementation patterns so it remains a truthful workflow artifact.
