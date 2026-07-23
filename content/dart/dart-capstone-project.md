---
slug: dart-capstone-project
id: dart-capstone
track: dart
order: 21
title: "Capstone Project: Mobile-first habit-tracking apps are everywhere, but most are..."
description: |-
  Mobile-first habit-tracking apps are everywhere, but most are siloed: the
    mobile client talks to a closed backend, no shared model layer exists
    between client and server, and offline-first sync is an afterthought.
    This capstone builds "Cadence", a habit-tracking app where the same Dart
    model
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: Dart Official Docs
    url: https://dart.dev/guides
    kind: doc
---

# Capstone Project: Mobile-first habit-tracking apps are everywhere, but most are...

## Mobile-first habit-tracking apps are everywhere, but most are...

Problem statement:
Mobile-first habit-tracking apps are everywhere, but most are siloed: the
  mobile client talks to a closed backend, no shared model layer exists
  between client and server, and offline-first sync is an afterthought.
  This capstone builds "Cadence", a habit-tracking app where the same Dart
  model code powers a Flutter mobile client and a Dart Frog REST backend,
  with offline-first sync, end-to-end tests, and a published shared
  package on pub.dev. By the end you'll have a portfolio-grade full-stack
  Dart project that demonstrates the entire 20-stage track.

Target users:
• Individual users who want to track daily habits (water, exercise,
• reading) with streaks and reminders.
• Power users who want offline-first access on a phone with intermittent
• connectivity.
• Open-source contributors who want to extend the model layer via the
• shared `cadence_models` package.
• Mobile developers who want a reference Flutter + Dart Frog codebase.

P0 (Must have) requirements:
• Flutter app with three screens: Today (list of habits + checkoff),
• Stats (weekly streaks chart), and Settings (theme, account).
• Dart Frog backend with `/habits`, `/habits/[id]`, `/checkins` routes
• and a JSON file-backed repository.
• Shared `cadence_models` package with `Habit`, `Checkin`, `User` as
• json_serializable classes used by BOTH client and server.
• Offline-first: writes go to local SQLite cache first, then sync to
• the backend; reads come from local cache.
• Bearer token auth (a simple shared-secret for the capstone).
• Unit tests for the model layer, widget tests for each screen, and
• integration tests for the sync flow.
• CI workflow on GitHub Actions running `flutter test`, `dart test`,
• and `dart analyze` on every push.
• README with setup, screenshots, and architecture diagram.

P1 (Should have) requirements:
• Streaks computation algorithm with unit tests.
• Light/dark theme toggle persisted via SharedPreferences.
• Error handling: AppException hierarchy (Stage 13) mapped to UI
• snackbars.
• Daily reminder via flutter_local_notifications.
• Pull-to-refresh on the Today screen.

P2 (Nice to have) requirements:
• Multi-device sync via Server-Sent Events from Dart Frog.
• Web build of the Flutter app via `flutter build web`.
• Background isolate for stats computation via `Isolate.run`.
• A pub.dev-published `cadence_models` package (Stage 20 mini project).
• Animated streak chart via fl_chart.

Tech stack:
• Dart 3.x (sound null safety, sealed classes, records, patterns)
• Flutter 3.x (Material 3, theming, navigation)
• Dart Frog (backend, file-based routing, middleware)
• json_serializable + build_runner (typed JSON for shared models)
• drift or sqflite (local SQLite cache on the client)
• http (REST client)
• flutter_local_notifications (daily reminders)
• shared_preferences (theme persistence)
• provider or riverpod (state management on the client)
• test, flutter_test, mocktail, integration_test (testing)
• GitHub Actions (CI), Docker (backend deploy), very_good_analysis (lints)

> **Tip:** Testing strategy:
> - Unit tests (dart test): one file per source file in `cadence_models`
>     and `backend/lib`; aim for ≥85% line coverage on the model and
>     repository layers. Use `mocktail` for repository dependencies.
>   - Widget tests (flutter_test): one `*_test.dart` per screen under
>     `app/test/widget/`; pump each screen with a mocked store and verify
>     key UI elements render and react to taps.
>   - Integration tests (integration_test): a single `app_test.dart` that
>     exercises the user flow end-to-end on an emulator.
>   - Backend integration tests: spin up the Dart Frog server on a random
>     port in `setUp` and exercise real HTTP calls; tear down in
>     `tearDown`.
>   - Coverage: `flutter test --coverage` then upload `lcov.info` to
>     Codecov; fail CI if model layer coverage drops below 85%.

> **Tip:** Deployment guide:
> - Backend: deploy to Fly.io (`fly launch` + `fly deploy`) or Google
>     Cloud Run (`gcloud run deploy --source .`). Set env vars
>     `BEARER_TOKEN` (random 32-byte secret), `PORT=8080`, and
>     `STORAGE_PATH=/data/cadence.json` (a mounted volume).
>   - Mobile: build APK with `flutter build appbundle --release` for Play
>     Store; build IPA with `flutter build ipa --release` for App Store
>     (requires paid Apple Developer account). Sign with `fastlane match`
>     in CI.
>   - Web (P2): `flutter build web --wasm` produces a `build/web/` folder;
>     host on Firebase Hosting (`firebase deploy --only hosting`).
>   - Shared package: tag the repo `cadence_models-v0.1.0`; the CI workflow
>     publishes to pub.dev using `PUB_CREDENTIALS` secret.
>   - Post-deploy verification: curl `https://api.cadence.example/health`
>     returns 200; launch the app and confirm it syncs; check Firebase
>     Crashlytics for any uncaught errors in the first hour.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Architecture & Code Sharing (20 pts) — Shared `cadence_models` is
>      used by both client and server without duplication; layers (data,
>      state, UI) are cleanly separated.
>   2. Correctness & Null Safety (20 pts) — App and backend handle all
>      user flows correctly; no `!` abuse; all null paths handled
>      explicitly; no runtime `NullCheckError` in tests.
>   3. Async & Concurrency (20 pts) — Sync engine uses Future.wait for
>      parallel work; isolates used for CPU-bound stats; no async-gap bugs;
>      streams are properly canceled in dispose.
>   4. Testing & CI (20 pts) — ≥85% line coverage on models/repository;
>      widget tests for every screen; one passing integration test; CI
>      green on main with all three test suites running.
>   5. Polish & Shipping (20 pts) — README with screenshots, architecture
>      diagram, and setup instructions; CHANGELOG present; backend
>      deployed and reachable; mobile bundle builds cleanly; shared
>      package published on pub.dev with 130/130 pub points.
> 
> Stretch goals:
>   - Multi-device sync via Server-Sent Events from Dart Frog to the
>     Flutter app, with conflict resolution (last-write-wins or CRDT).
>   - Custom streak algorithm that handles time zones correctly using
>     `package:timezone`.
>   - Web build of the Flutter app compiled to Wasm, with feature
>     detection and a JS fallback for older browsers.
>   - Background isolate that pre-computes tomorrow's stats overnight
>     via `workmanager` so the Stats screen opens instantly.
>   - A `cadence_cli` Dart executable that exports user data to CSV/JSON
>     for portability.
>   - End-to-end test on BrowserStack or Firebase Test Lab covering 5+
>     Android device profiles.
>   - Internationalization via `flutter_localizations` with at least 2
>     languages (English + one more).
>   - Publish `cadence_models` to pub.dev with verified-publisher status
>     and 130/130 pub points.
>   - Add a `cadence_admin` Dart Frog admin route protected by an admin
>     token for managing users.
>   - Convert the storage layer to Postgres (via `package:postgres`) with
>     Drift on the client unchanged.

> **Tip:** Stretch goals:
> • Multi-device sync via Server-Sent Events from Dart Frog to the
> • Flutter app, with conflict resolution (last-write-wins or CRDT).
> • Custom streak algorithm that handles time zones correctly using
> • `package:timezone`.
> • Web build of the Flutter app compiled to Wasm, with feature
> • detection and a JS fallback for older browsers.
> • Background isolate that pre-computes tomorrow's stats overnight
> • via `workmanager` so the Stats screen opens instantly.
> • A `cadence_cli` Dart executable that exports user data to CSV/JSON
> • for portability.
> • End-to-end test on BrowserStack or Firebase Test Lab covering 5+
> • Android device profiles.
> • Internationalization via `flutter_localizations` with at least 2
> • languages (English + one more).
> • Publish `cadence_models` to pub.dev with verified-publisher status
> • and 130/130 pub points.
> • Add a `cadence_admin` Dart Frog admin route protected by an admin
> • token for managing users.
> • Convert the storage layer to Postgres (via `package:postgres`) with
> • Drift on the client unchanged.

