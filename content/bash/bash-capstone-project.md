---
slug: bash-capstone-project
id: bash-capstone
track: bash
order: 21
title: "Capstone Project: deployctl"
description: |-
  Build "deployctl" — a production-grade Bash CLI that deploys static
    websites to AWS S3 + CloudFront with atomic uploads, automatic cache
    invalidation, health checks, one-command rollback, and Slack
    notifications. The tool must be installable via `brew install` or a
    curl-piped installer, supp
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: Bash / Shell Official Docs
    url: https://www.gnu.org/software/bash/manual/
    kind: doc
---

# Capstone Project: deployctl

## deployctl

Problem statement:
Build "deployctl" — a production-grade Bash CLI that deploys static
  websites to AWS S3 + CloudFront with atomic uploads, automatic cache
  invalidation, health checks, one-command rollback, and Slack
  notifications. The tool must be installable via `brew install` or a
  curl-piped installer, support multiple projects via per-project config
  files (~/.deployctl/projects/<name>.conf), run idempotently (safe to
  re-run on failure), and ship with bats-core tests, ShellCheck-clean
  code, shfmt formatting, a man page, and bash/zsh completion. This
  capstone exercises every concept from the 20-stage track: argument
  parsing (getopts + manual long options), subcommand dispatch,
  associative arrays for project config, set -euo pipefail strict mode,
  trap-based cleanup, signal forwarding to AWS CLI child processes,
  sed/awk for log post-processing, find for asset enumeration,
  flock for preventing concurrent deploys, and a multi-file lib/
  structure that mirrors how real-world CLIs (hub, docker-entrypoint,
  Google Cloud SDK) are organized.

Target users:
• Frontend teams that ship static sites (Next.js export, Astro, Hugo) and want one-command deploys without learning the full AWS CLI.
• Indie hackers and small startups that need a free, scriptable alternative to Vercel/Netlify for S3-hosted sites.
• DevOps engineers who want an auditable, version-controlled deploy pipeline they can read end-to-end in Bash (no opaque binaries).

P0 (Must have) requirements:
• `deployctl init <project>` creates ~/.deployctl/projects/<project>.conf with aws_s3_bucket, cloudfront_distribution_id, build_cmd, and slack_webhook fields
• `deployctl build <project>` runs the build_cmd and verifies the output dir has an index.html
• `deployctl deploy <project> [--tag TAG]` syncs build output to S3 with --delete, computes a content hash, and stores it as the "current" version
• `deployctl invalidate <project>` creates a CloudFront invalidation for /* and waits for completion (or 60s timeout)
• `deployctl rollback <project>` reverts to the previous stored version (re-syncs the prior hash's files from S3 versioning or local cache)
• `deployctl status <project>` prints current version, last deploy time, and last 5 deploys
• `deployctl list` lists all configured projects
• Atomic deploys: build to a temp dir, sync atomically, never leave the site half-updated
• `set -euo pipefail` strict mode throughout; trap EXIT/INT/TERM for cleanup
• flock-based concurrency lock per project (no overlapping deploys)
• Exit codes: 0 success, 1 runtime error, 2 usage error
• ShellCheck-clean (no warnings except justified per-line suppressions)
• bats-core test suite with >=15 tests covering init, build, deploy, status, rollback, and error paths
• curl-pipe installer: `curl -fsSL https://example.com/install.sh | bash`

P1 (Should have) requirements:
• Slack notifications on deploy success AND failure (with project name, version, git SHA, and a diff link)
• `deployctl diff <project>` shows files changed since last deploy (uses aws s3 sync --dryrun)
• Per-environment support: --env staging|prod reads from different config sections
• Config validation: `deployctl check <project>` validates that all required fields are set and the S3 bucket is reachable
• `--dry-run` flag on deploy that prints what would happen without touching S3
• Structured logging to ~/.deployctl/logs/<project>.log with timestamps and levels
• `deployctl version` and `--version` flag
• bash and zsh completion scripts in completions/

P2 (Nice to have) requirements:
• Multi-region S3 replication awareness (deploy to primary, await replica sync)
• Automatic rollback if post-deploy health check fails (curl a known URL, expect 200)
• `deployctl history <project> --json` for machine-readable history
• Plugin system: drop a script in ~/.deployctl/plugins/ and it runs pre/post deploy hooks
• Homebrew tap formula for `brew install deployctl`
• Docker image: `docker run --rm -v ~/.aws:/root/.aws deployctl deploy myblog`
• Colorized terminal output (with NO_COLOR env var support)
• Progress bar for large uploads using `pv` or a custom counter
• Web dashboard: `deployctl dashboard` opens a local web UI showing all projects and recent deploys

```text
deployctl/
    deployctl                          # main executable (shebang + dispatch)
    README.md
    LICENSE
    CHANGELOG.md
    install.sh                         # curl-pipe installer
    Dockerfile
    completions/
        deployctl.bash
        deployctl.zsh
    man/
        deployctl.1                    # man page (groff)
    lib/
        common.sh                      # logging, helpers, defaults, trap setup
        config.sh                      # config file parser + validation
        aws_helpers.sh                 # s3 sync, cloudfront invalidation wrappers
        slack.sh                       # slack notification helper
        versions.sh                    # version history (read/write ~/.deployctl/versions/)
        init.sh                        # init_cmd
        build.sh                       # build_cmd
        deploy.sh                      # deploy_cmd (the big one)
        invalidate.sh                  # invalidate_cmd
        rollback.sh                    # rollback_cmd
        status.sh                      # status_cmd
        diff.sh                        # diff_cmd
        check.sh                       # check_cmd
        list.sh                        # list_cmd
    tests/
        test_helper.bash               # sourced by all test files (fixtures, mocks)
        test_init.bats
        test_build.bats
        test_deploy.bats
        test_status.bats
        test_rollback.bats
        test_config.bats
        test_common.bats
    .github/
        workflows/
            ci.yml                     # shellcheck + shfmt + bats + release
    .editorconfig                      # shfmt config
    .shellcheckrc                      # shellcheck config
```
Caption: Suggested file structure

Tech stack:
• Bash 4.4+ (4.0 minimum for associative arrays; 4.4+ for ${arr[-1]})
• AWS CLI v2 (s3 sync, cloudfront create-invalidation, s3api list-object-versions)
• jq 1.6+ (parsing AWS CLI JSON output)
• curl (Slack webhooks, health checks)
• flock (concurrency; part of util-linux on every Linux, ships with macOS)
• mktemp, find, xargs, sed, awk, grep (POSIX tools)
• bats-core 1.10+ (testing framework)
• bats-support + bats-assert (helper libraries)
• ShellCheck 0.9+ (static analysis; enforced in CI)
• shfmt 3.7+ (auto-formatter; -i 4 -ci -bn -w)
• GitHub Actions (CI: lint + test + build release tarball)
• Homebrew tap (optional distribution channel)
• Docker (optional containerized execution)

> **Tip:** Testing strategy:
> - Unit tests with bats-core for pure functions: config parsing,
>     version record/last/list, log formatting, hash computation. Use
>     bats-support and bats-assert for clean assertion messages. Mock
>     `aws`, `jq`, and `curl` by placing fake scripts in a tmpdir
>     prepended to PATH; each fake records its args to a file for
>     assertion.
>   - Integration tests with real (mocked-S3) backends: stand up
>     localstack in Docker, point AWS_ENDPOINT_URL at it, run a full
>     deploy -> invalidate -> rollback cycle. Verify the S3 bucket ends
>     in the expected state and CloudFront got an invalidation call.
>   - End-to-end smoke test in CI: install via install.sh in a fresh
>     container, run `deployctl init test && deployctl deploy test
>     --dry-run`, verify exit 0 and expected log output.
>   - >=80% line coverage on lib/ (target 95%+ on common.sh and
>     config.sh). Use bats-core's `--tap` output piped through a
>     coverage tool like kcov (`kcov --include-path=lib /tmp/cov
>     bats tests/`).
>   - Run tests with: `bats tests/` (fast unit tests); `bats tests/
>     --filter integration` for slow integration tests; CI runs the
>     fast suite on every push and the full suite (with localstack) on
>     PRs to main.

> **Tip:** Deployment guide:
> - Distribute via three channels: (1) Homebrew tap — `brew tap
>     example/deployctl && brew install deployctl`. (2) curl-pipe —
>     `curl -fsSL https://deployctl.dev/install.sh | bash` (pins to
>     latest release; verify SHA256). (3) From source — `git clone &&
>     cd deployctl && ./install.sh` (for development).
>   - Environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
>     AWS_REGION (or AWS_PROFILE) — required for any s3/cloudfront
>     operation. SLACK_WEBHOOK_URL — optional, for notifications.
>     DEPLOYCTL_HOME — overrides ~/.deployctl (useful for tests).
>     DEPLOYCTL_LOG_LEVEL — DEBUG/INFO/WARN/ERROR (default INFO).
>     NO_COLOR — set to any value to disable colored output.
>   - Build command (CI release): `tar -czf deployctl-$VER-$OS-$ARCH
>     .tar.gz deployctl lib/ completions/ man/ install.sh README.md`;
>     `sha256sum *.tar.gz > checksums.txt`; attach both to the GitHub
>     Release.
>   - Start command (post-install): user runs `deployctl init myblog`,
>     edits ~/.deployctl/projects/myblog.conf to fill in AWS details,
>     then `deployctl deploy myblog`. No daemon; deployctl is a CLI
>     invoked manually or from CI.
>   - Post-deploy verification: `deployctl status myblog` shows the
>     new version; `curl -sI https://myblog.example.com | head -1`
>     returns 200; CloudFront invalidation completes (visible in AWS
>     console or `deployctl status`); Slack #deploys channel shows the
>     success message with git SHA and a link to the diff.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Functionality (20 pts) — All P0 subcommands work end-to-end; deploy -> invalidate -> status -> rollback cycle succeeds against a test S3+CloudFront setup; exit codes follow convention (0/1/2); dry-run doesn't modify state; flock prevents concurrent deploys.
>   2. Code quality (20 pts) — Multi-file lib/ structure; `set -euo pipefail` in every file; no ShellCheck warnings (justified per-line suppressions allowed); shfmt -d clean; functions documented with one-line comments; no eval on user input; consistent logging via log_info/log_error to stderr.
>   3. Testing (20 pts) — >=15 bats-core tests passing; unit tests for config, versions, common helpers; integration test with mocked AWS CLI; CI runs the suite on every push; coverage >=80% on lib/common.sh and lib/config.sh.
>   4. Distribution (20 pts) — curl-pipe installer works in a fresh container; Homebrew formula (or tap) installs cleanly; man page renders; bash AND zsh completion work; release tarball attached to GitHub Release with SHA256 checksums; README has 3 install methods and a quick start.
>   5. Documentation (20 pts) — README has a 30-second pitch, install, quick start, full subcommand reference, config format, troubleshooting, and contributing; CHANGELOG follows Keep a Changelog; code has top-of-file comments in each lib/*.sh; example config in install output; man page covers all subcommands.
> 
> Stretch goals:
>   - Add a `deployctl dashboard` command that opens a local web UI (served via Python http.server or a tiny Go binary) showing all projects and recent deploys.
>   - Add automatic rollback on health-check failure: deploy_cmd runs a post-deploy curl check; if it fails 5x in a row, automatically run rollback_cmd and notify Slack.
>   - Add multi-region S3 replication awareness: deploy to the primary region, then poll the secondary region's bucket until the new objects appear (eventual consistency).
>   - Add a plugin system: any executable in ~/.deployctl/plugins/pre-deploy/ runs before s3_sync_up; post-deploy/ runs after; plugins receive project + tag + sha as args.
>   - Add `deployctl diff <project>` that uses `aws s3 sync --dryrun` to show what would change, with red/green coloring for added/removed files.
>   - Add Docker support: `docker run --rm -v ~/.aws:/root/.aws -v ~/.deployctl:/root/.deployctl deployctl deploy myblog`.
>   - Add OpenTelemetry-style tracing: write a span per subcommand to stderr as JSON, with parent span IDs for nested operations.
>   - Add `deployctl history <project> --json` for machine-readable history (used by external dashboards).
>   - Add Homebrew tap automation via GitHub Actions (`brew tap-new` + formula PR on release).
>   - Add a `--parallel N` flag for s3 sync to upload N files at once (using xargs -P or `aws s3 sync --max-concurrent-requests`).

> **Tip:** Stretch goals:
> • Add a `deployctl dashboard` command that opens a local web UI (served via Python http.server or a tiny Go binary) showing all projects and recent deploys.
> • Add automatic rollback on health-check failure: deploy_cmd runs a post-deploy curl check; if it fails 5x in a row, automatically run rollback_cmd and notify Slack.
> • Add multi-region S3 replication awareness: deploy to the primary region, then poll the secondary region's bucket until the new objects appear (eventual consistency).
> • Add a plugin system: any executable in ~/.deployctl/plugins/pre-deploy/ runs before s3_sync_up; post-deploy/ runs after; plugins receive project + tag + sha as args.
> • Add `deployctl diff <project>` that uses `aws s3 sync --dryrun` to show what would change, with red/green coloring for added/removed files.
> • Add Docker support: `docker run --rm -v ~/.aws:/root/.aws -v ~/.deployctl:/root/.deployctl deployctl deploy myblog`.
> • Add OpenTelemetry-style tracing: write a span per subcommand to stderr as JSON, with parent span IDs for nested operations.
> • Add `deployctl history <project> --json` for machine-readable history (used by external dashboards).
> • Add Homebrew tap automation via GitHub Actions (`brew tap-new` + formula PR on release).
> • Add a `--parallel N` flag for s3 sync to upload N files at once (using xargs -P or `aws s3 sync --max-concurrent-requests`).

