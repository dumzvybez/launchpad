---
slug: swift-capstone-project
id: swift-capstone
track: swift
order: 21
title: "Capstone Project: Habit-formation apps are among the most-downloaded categories on..."
description: |-
  Habit-formation apps are among the most-downloaded categories on the
    App Store, yet most users abandon them within two weeks because they
    lack insight into streaks, don't motivate on hard days, and don't
    work offline. In this capstone you will build HabitFlow, a native
    iOS app (SwiftUI + Swi
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: Swift Official Docs
    url: https://docs.swift.org/swift-book/
    kind: doc
---

# Capstone Project: Habit-formation apps are among the most-downloaded categories on...

## Habit-formation apps are among the most-downloaded categories on...

Problem statement:
Habit-formation apps are among the most-downloaded categories on the
  App Store, yet most users abandon them within two weeks because they
  lack insight into streaks, don't motivate on hard days, and don't
  work offline. In this capstone you will build HabitFlow, a native
  iOS app (SwiftUI + SwiftData + async/await) that lets a user define
  habits, mark them complete each day, visualize streaks with a custom
  heatmap, sync to a server-side Swift backend when online, and
  gracefully degrade to local-only when offline. You will ship to
  TestFlight and demonstrate a tested, signed, CI-built binary. This
  project exercises every layer of modern Swift: value-typed models,
  actor-isolated sync, protocol-oriented networking, generics for the
  chart rendering, error handling, Combine/AsyncStream for live
  updates, SwiftUI for the UI, XCTest + Swift Testing for tests, and
  SPM/Xcode Cloud for CI/CD.

Target users:
• Self-improvement enthusiasts who already use Notion/Apple Notes for
• habits and want a focused, beautiful native alternative.
• Students tracking study habits who need offline-first behavior
• during commutes and unreliable campus Wi-Fi.
• Productivity coaches who want to recommend a tool to clients that
• visualizes streaks and provides gentle nudges without dark patterns.

P0 (Must have) requirements:
• Define, edit, and delete habits with name, color, icon, and
• frequency (daily, weekly on N days).
• Mark a habit complete for today via a single tap; undo within 5s.
• Streak calculation: current streak, longest streak, completion
• rate over the last 30/90/365 days.
• Local-first persistence with SwiftData; works fully offline.
• Background sync to a server-side Swift (Vapor) backend over HTTPS
• when online; conflicts resolved by last-write-wins on the server
• timestamp.
• SwiftUI heatmap (custom `View`) showing the last 52 weeks.
• Tests: >=80% line coverage on the core model + sync layer using
• XCTest and Swift Testing.
• CI on GitHub Actions running tests + SwiftLint on every push.
• Signed TestFlight build artifact uploaded from CI on main.

P1 (Should have) requirements:
• Notifications: a daily reminder at user-chosen time, plus a
• "you'll lose your streak" warning if incomplete by 9pm.
• Widgets (SwiftUI App Intent) for the home screen showing today's
• habits and a tap-to-complete action.
• Live Activity on the lock screen during a focus session.
• iCloud sync via CloudKit as an alternative to the Vapor backend.
• Localization: English, Spanish, Japanese.
• Dark mode and Dynamic Type support verified via snapshot tests.

P2 (Nice to have) requirements:
• Apple Watch companion app showing today's habits with haptic
• completion.
• Import/export to JSON and CSV.
• Sharing a habit with a friend for shared streaks.
• Insights screen powered by a small on-device linear regression
• (which day-of-week you're most consistent).
• AI-generated weekly summary using Apple Foundation Models
• (on-device, iOS 18+).
• Privacy report screen listing what's stored locally vs. server.

Tech stack:
• Swift 5.10 (or 6 in Swift 6 migration mode)
• SwiftUI (iOS 17+) with `@Observable` macro (Observation framework)
• SwiftData for local persistence (replaces Core Data for new apps)
• async/await, `actor`, `TaskGroup`, `AsyncStream`
• Combine (legacy; only where bridging is needed)
• Vapor 4 for the server backend (server-side Swift)
• Fluent (Vapor's ORM) + Postgres for storage
• XCTest + Swift Testing for tests
• swift-snapshot-testing for UI snapshots
• SwiftLint + SwiftFormat for style
• GitHub Actions + fastlane for CI/CD
• Apple Sign-in for authentication (optional P1)
• UserNotifications framework for reminders
• WidgetKit + App Intents for home-screen widgets
• DocC for documentation
• Xcode Cloud as alternative CI

> **Tip:** Testing strategy:
> - Unit: Pure functions in `StreakCalculator` and date utilities —
>     Swift Testing `@Test(arguments:)` covering edge cases (empty,
>     single-day, leap year, DST, time-zone shifts).
>   - Integration: `SyncEngine` + `MockAPIClient` with `XCTestExpectation`
>     or `async throws` — exercises enqueue, flush, retry, and conflict
>     resolution in `actor`-isolated contexts.
>   - UI: SwiftUI snapshot tests with `swift-snapshot-testing` in light/
>     dark mode and multiple Dynamic Type sizes; rerun on every PR.
>   - E2E: `XCUITest` covering: launch, add habit, complete, see in
>     heatmap, edit, delete, offline mode (toggle airplane mode in
>     scheme), come back online, verify sync.
>   - Coverage target: >=80% line coverage on `StreakCalculator`,
>     `SyncEngine`, `HabitStore`, `ConflictResolver`; >=60% overall.
>   - How to run: `xcodebuild test -scheme HabitFlow -destination
>     'platform=iOS Simulator,name=iPhone 15' -enableCodeCoverage YES`;
>     `xcov` or Xcode's Report Navigator for HTML coverage. Server:
>     `cd Server && swift test`.

> **Tip:** Deployment guide:
> - iOS app: TestFlight for beta (signed with App Store distribution
>     certificate + provisioning profile); App Store release after beta
>     review. Bump build number per upload via fastlane.
>   - Vapor backend: Deploy to Fly.io (`fly launch`) or Render. Set
>     env vars: `DATABASE_URL`, `JWT_SECRET`, `PORT=8080`. Attach a
>     1GB persistent Postgres volume. Start command: `vapor run serve
>     --env production --hostname 0.0.0.0 --port 8080`.
>   - Environment variables for app: `API_BASE_URL`,
>     `API_KEY` (only if not using JWT), loaded from `Secrets.xcconfig`
>     (gitignored); CI reads from GitHub Actions secrets.
>   - Build command: `xcodebuild -scheme HabitFlow -configuration
>     Release -archivePath build/HabitFlow.xcarchive archive`.
>   - Start command (server): `vapor run serve --env production`.
>   - Post-deploy verification: `curl https://api.habitflow.example.com/
>     health` returns 200; TestFlight build appears under "Available
>     Builds" in App Store Connect; install on a physical device, mark
>     a habit complete, force-quit, relaunch, verify persistence;
>     toggle airplane mode, mark complete, turn airplane mode off,
>     verify sync within 60s.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Correctness & domain modeling (20 pts) — All P0 features work
>      end-to-end; streak calculations match a hand-verified reference
>      across at least 20 test cases including leap years and time-zone
>      shifts.
>   2. Swift idioms & safety (20 pts) — Value types for models,
>      `actor` isolation for sync, `Sendable` conformance checked,
>      protocol-oriented networking with injectable mock, no
>      `try!`/`as!` in production paths, no force-unwraps; SwiftLint
>      `--strict` passes.
>   3. Concurrency correctness (20 pts) — No blocking calls inside
>      `async` (use `Task.sleep`, not `Thread.sleep`); no actor
>      reentrancy bugs across `await` (read-modify-write batches in
>      single actor methods); structured tasks cancel cleanly;
>      `SyncEngine` shuts down without leaks under cancellation.
>   4. Testing & CI (20 pts) — >=80% coverage on core modules; Swift
>      Testing parameterized tests for `StreakCalculator`; snapshot
>      tests for SwiftUI; CI runs on every PR and main; TestFlight
>      upload succeeds from CI on main; one tap-to-install works.
>   5. Polish & deployment (20 pts) — Dark mode + Dynamic Type verified
>      via snapshots; accessibility labels on every interactive
>      element; signed TestFlight build; backend deployed and serving
>      `health` 200; README with architecture diagram, setup steps,
>      and sync-protocol doc.
> 
> Stretch goals:
>   - Migrate to Swift 6 language mode and resolve all `Sendable`
>     warnings without `nonisolated(unsafe)` escapes.
>   - Add an Apple Watch companion app sharing the model via an SPM
>     package and `App Group` container.
>   - Implement conflict-free replicated data type (CRDT) semantics for
>     habit completions to move beyond last-write-wins.
>   - Add a Swift Charts-powered insights screen with trend lines.
>   - Add CloudKit as a fallback sync path using `NSPersistentCloudKit
>     Container`-equivalent for SwiftData once available.
>   - Generate an OpenAPI spec from the Vapor backend and use
>     `swift-openapi-generator` to produce a type-safe client in the app.
>   - Add an end-to-end performance test in CI measuring time-to-first-
>     habit-complete on a cold launch; gate regression at 800ms.
>   - Build a `#Preview` macro library so designers can preview every
>     screen across multiple locales and color schemes side-by-side.
>   - Add on-device weekly insights via Apple Foundation Models
>     (iOS 18+) summarizing streaks and suggesting optimizations.
>   - Publish the StreakCalculator core as an open-source SPM package
>     with DocC documentation and a Linux CI build.
> 
> 
> ======================================================================
> END OF SWIFT TRACK — 20 STAGES + CAPSTONE
> ======================================================================

> **Tip:** Stretch goals:
> • Migrate to Swift 6 language mode and resolve all `Sendable`
> • warnings without `nonisolated(unsafe)` escapes.
> • Add an Apple Watch companion app sharing the model via an SPM
> • package and `App Group` container.
> • Implement conflict-free replicated data type (CRDT) semantics for
> • habit completions to move beyond last-write-wins.
> • Add a Swift Charts-powered insights screen with trend lines.
> • Add CloudKit as a fallback sync path using `NSPersistentCloudKit
> • Container`-equivalent for SwiftData once available.
> • Generate an OpenAPI spec from the Vapor backend and use
> • `swift-openapi-generator` to produce a type-safe client in the app.
> • Add an end-to-end performance test in CI measuring time-to-first-
> • habit-complete on a cold launch; gate regression at 800ms.
> • Build a `#Preview` macro library so designers can preview every
> • screen across multiple locales and color schemes side-by-side.
> • Add on-device weekly insights via Apple Foundation Models
> • (iOS 18+) summarizing streaks and suggesting optimizations.
> • Publish the StreakCalculator core as an open-source SPM package
> • with DocC documentation and a Linux CI build.
> • ======================================================================
> • END OF SWIFT TRACK — 20 STAGES + CAPSTONE
> • ======================================================================

