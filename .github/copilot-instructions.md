# Copilot Instructions for MYRN

## Build, test, and lint commands

- Install dependencies: `npm ci`
- Start Metro: `npm start`
- Run Android app: `npm run android`
- Run iOS app (simulator): `npm run ios`
- Run iOS app (specific device): `npm run ios:iphone`
- Lint: `npm run lint`
- Run all tests: `npm test`
- Run coverage (used in CI quality gate): `npm run test:coverage`
- Run a single Jest test file: `npx jest __tests__/App.test.tsx`
- Run a single Jest test by name: `npx jest -t "renders correctly"`

## High-level architecture

- This repository is a React Native 0.84 app (`App.tsx`) with TypeScript, plus a local TurboModule package at `modules/battery-level`.
- The app consumes the local package through a file dependency in root `package.json`:
  - `"react-native-battery-level": "file:./modules/battery-level"`
- JS usage flow:
  - `App.tsx` imports `getBatteryLevel` from `react-native-battery-level`
  - `modules/battery-level/src/index.tsx` forwards to `src/NativeBatteryLevel.ts`
  - `NativeBatteryLevel.ts` enforces TurboModule binding with `TurboModuleRegistry.getEnforcing('BatteryLevel')`
- Native implementation split:
  - iOS: `modules/battery-level/ios/BatteryLevel.mm` implements `getBatteryLevel` and returns a percentage (0–100) or rejects with `battery_unavailable`
  - Android: `modules/battery-level/android/src/main/java/com/batterylevel/` contains `BatteryLevelModule.kt` + `BatteryLevelPackage.kt`; module extends generated `com.facebook.fbreact.specs.NativeBatteryLevelSpec`
- Codegen integration:
  - `modules/battery-level/package.json` defines `codegenConfig` (`name: "BatteryLevelSpec"`, `type: "modules"`, `jsSrcsDir: "src"`)
  - Android generated spec path during build: `modules/battery-level/android/build/generated/source/codegen/java/com/facebook/fbreact/specs/NativeBatteryLevelSpec.java`

## Key conventions in this repository

- Keep TurboModule contract and naming aligned across JS and native:
  - Spec name: `BatteryLevel`
  - JS interface method: `getBatteryLevel(): Promise<number>`
  - Native method implementations must match this exact signature/behavior.
- Android TurboModule class wiring is strict:
  - `BatteryLevelModule.kt` must import `com.facebook.fbreact.specs.NativeBatteryLevelSpec`
  - `BatteryLevelPackage.kt` should expose `isTurboModule = true` and use the module class name (`BatteryLevelModule::class.java.name`) in `ReactModuleInfo`.
- Battery level semantics are percentage-based in this repo:
  - Return range is `0..100`
  - Unavailable battery data should reject with code `battery_unavailable` (same behavior on iOS and Android).
- CI expectations:
  - PR workflow (`.github/workflows/pr-quality-gate.yml`) runs `npm run lint` and `npm run test:coverage`, then SonarQube scan.
  - Keep changes compatible with these checks.
- iOS release flow uses Fastlane:
  - `ios/fastlane/Fastfile` lane `beta` reads App Store Connect API key env vars, runs `match`, increments build number using `latest_testflight_build_number`, builds, and uploads to TestFlight.
