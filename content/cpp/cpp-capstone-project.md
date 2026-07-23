---
slug: cpp-capstone-project
id: cpp-capstone
track: cpp
order: 21
title: "Capstone Project: Modern backend services need a fast, durable key-value..."
description: |-
  Modern backend services need a fast, durable key-value store that
    handles concurrent reads and writes, persists data to disk, and
    recovers cleanly after a crash. Existing solutions (Redis, LevelDB,
    RocksDB) are production-grade but opaque; building one teaches the
    core trade-offs of memory m
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: C++ Official Docs
    url: https://en.cppreference.com/w/
    kind: doc
---

# Capstone Project: Modern backend services need a fast, durable key-value...

## Modern backend services need a fast, durable key-value...

Problem statement:
Modern backend services need a fast, durable key-value store that
  handles concurrent reads and writes, persists data to disk, and
  recovers cleanly after a crash. Existing solutions (Redis, LevelDB,
  RocksDB) are production-grade but opaque; building one teaches the
  core trade-offs of memory management, concurrency, I/O, and crash
  safety that every C++ systems engineer must understand. In this
  capstone you will build "TinyKV" — a multi-threaded, persistent
  key-value store with an embedded HTTP API and a small CLI client.
  The project exercises every prior stage: templates, smart pointers,
  move semantics, RAII, exception safety, std::thread + atomics, file
  I/O, modern C++ (concepts, ranges, std::expected), CMake + vcpkg
  build, GoogleTest suites, sanitizers in CI, and an HTTP server built
  on a thread pool. By the end you will have a service you can run,
  benchmark, crash-test, and deploy.

Target users:
• Backend engineers learning C++ systems programming
• Game developers needing a fast local cache (e.g., player state)
• Embedded engineers exploring persistent storage on small devices
• Interview candidates preparing for systems-programming roles
• Open-source maintainers evaluating a minimal LevelDB-style store

P0 (Must have) requirements:
• GET / SET / DELETE / EXISTS operations on string keys
• TTL support (EXPIRE, PERSIST) with lazy + active expiration
• Multi-threaded request handling with std::thread + a thread pool
• Persistence via Write-Ahead Log (WAL) with fsync on flush
• Crash recovery: replay the WAL on startup
• Memtable (std::map) + periodic flush to an SSTable file
• HTTP API on a configurable port (using Boost.Beast or cpp-httplib)
• CLI client that exercises every endpoint
• Thread-safe (TSan-clean) with no data races
• Memory-safe (ASan-clean) with no leaks or use-after-free
• GoogleTest unit tests with at least 80% line coverage on core
• CMake build with vcpkg manifest mode
• CI workflow (GitHub Actions) running tests + sanitizers

P1 (Should have) requirements:
• Range queries (SCAN cursor-based iteration)
• Atomic operations (INCR, DECR, APPEND)
• Compression of SSTable files (zstd)
• Bloom filter for negative-lookup avoidance on SSTables
• Configurable compaction (merge SSTables)
• Prometheus metrics endpoint
• Structured logging via spdlog
• Property-based tests for the WAL recovery invariant

P2 (Nice to have) requirements:
• Lua scripting (via sol2) for atomic multi-op transactions
• Replication (single-leader, async)
• TLS for the HTTP API
• Docker image with a multi-stage build
• Helgrind / ThreadSanitizer-clean under high concurrency
• SIMD-accelerated key comparison
• Cross-platform (Linux, macOS, Windows) with CI matrix

Tech stack:
• C++20 (concepts, ranges, std::span, std::expected backport)
• CMake 3.22+ with CMakePresets.json
• vcpkg manifest mode for dependencies
• Boost.Beast (HTTP server) or cpp-httplib
• GoogleTest for unit tests
• Google Benchmark for performance tests
• RapidCheck for property-based tests
• libFuzzer for fuzz testing
• spdlog for structured logging
• fmt for fast formatting
• zstd (optional, P1) for SSTable compression
• clang-tidy + cppcheck for static analysis
• ASan + UBSan + TSan in CI
• GitHub Actions for CI

> **Tip:** Testing strategy:
> - Unit tests: GoogleTest per module (Memtable, SSTable, WAL,
>     BloomFilter, ThreadPool, Store, TtlManager). Each public method
>     gets at least 3 cases including edge cases (empty key, max-size
>     value, concurrent access).
>   - Property tests: RapidCheck verifying (1) WAL replay yields the
>     same state as the original; (2) memtable flush preserves all
>     entries; (3) concurrent ops commute when keys are disjoint.
>   - Fuzz tests: libFuzzer harness on the WAL recovery code; integrate
>     with OSS-Fuzz if you publish the project.
>   - Integration tests: end-to-end tests that start the server, issue
>     HTTP requests, kill the server, restart, and verify state
>     survived (the critical crash-recovery test).
>   - Concurrency tests: stress workload with 8 threads × 100k ops
>     under TSan; property test for state equivalence with a serial
>     reference.
>   - Coverage target: >= 80% line coverage on src/ and include/.
>     Run with `cmake --preset coverage && cmake --build --preset coverage
>     && ctest && gcovr --exclude-unreachable-branches --print-summary`.
>   - Sanitizer runs: separate CI jobs for ASan+UBSan and TSan; fail
>     the build on any diagnostic.

> **Tip:** Deployment guide:
> - Where to deploy: any Linux x86-64 VM (AWS EC2 t3.small, DigitalOcean
>     droplet, etc.) or a Docker container. The binary is statically
>     linked against the C++ runtime where possible.
>   - Environment variables: TINYKV_PORT (default 8080), TINYKV_DATA_DIR
>     (default /var/lib/tinykv), TINYKV_MEMTABLE_SIZE (default 4194304),
>     TINYKV_LOG_LEVEL (default info), TINYKV_THREAD_COUNT (default
>     hardware_concurrency).
>   - Build command: `cmake --preset release && cmake --build --preset
>     release --target tinykv_server`. For Docker: `docker build -t
>     tinykv .`
>   - Start command: `./tinykv_server --port $TINYKV_PORT --data
>     $TINYKV_DATA_DIR`. With Docker: `docker run -d --name tinykv -p
>     8080:8080 -v /var/lib/tinykv:/data tinykv`.
>   - Post-deploy verification: (1) `curl -X POST localhost:8080/key
>     -d '{"value":"hello"}'` returns 200; (2) `curl localhost:8080/key`
>     returns "hello"; (3) kill the server with `kill -9`, restart, and
>     verify the value persisted; (4) run the CLI benchmark `./tinykv_cli
>     --benchmark --requests 10000` and verify p99 latency < 10ms; (5)
>     inspect logs at /var/log/tinykv.log for errors.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Correctness (20 pts) — All P0 operations behave per spec; WAL
>      recovery is correct under crashes; concurrent operations are
>      race-free under TSan.
>   2. Memory & Resource Safety (20 pts) — No leaks, use-after-free, or
>      UB under ASan+UBSan; RAII used throughout; smart pointers in all
>      ownership transfers; no raw new/delete in user code.
>   3. Concurrency (20 pts) — Multi-threaded request handling, no
>      deadlocks, scoped_lock for multi-mutex acquisition, no false
>      sharing on hot paths, graceful shutdown.
>   4. Engineering Quality (20 pts) — Modern CMake (target-based,
>      PUBLIC/PRIVATE correct), vcpkg manifest, >= 80% test coverage,
>      clang-tidy clean, CI passes on gcc + clang, documentation
>      complete.
>   5. Performance & Stretch (20 pts) — p99 latency < 10ms under 10k
>      concurrent requests, throughput >= 50k ops/sec on a single core,
>      plus any P1/P2 features (compression, bloom filter, range
>      queries, replication).
> 
> Stretch goals:
>   - Implement snapshot-based backup (fork the SSTables atomically)
>   - Add a Lua scripting endpoint (sol2) for atomic multi-op transactions
>   - Implement single-leader async replication with a binary protocol
>   - Add TLS termination via OpenSSL
>   - Build a RocksDB-style LSM-tree compaction strategy
>   - Implement a skiplist as an alternative memtable (with benchmarks)
>   - Add SIMD-accelerated key comparison (SSE4.2 memcmp)
>   - Build a web UI dashboard for metrics and key browsing
>   - Add a Redis-compatible protocol mode (RESP2) for drop-in client support
>   - Implement MVCC for snapshot isolation across reads
>   - Add an end-to-end chaos test that kills the server randomly during
>     a workload and verifies no data loss across 1000 crash cycles

> **Tip:** Stretch goals:
> • Implement snapshot-based backup (fork the SSTables atomically)
> • Add a Lua scripting endpoint (sol2) for atomic multi-op transactions
> • Implement single-leader async replication with a binary protocol
> • Add TLS termination via OpenSSL
> • Build a RocksDB-style LSM-tree compaction strategy
> • Implement a skiplist as an alternative memtable (with benchmarks)
> • Add SIMD-accelerated key comparison (SSE4.2 memcmp)
> • Build a web UI dashboard for metrics and key browsing
> • Add a Redis-compatible protocol mode (RESP2) for drop-in client support
> • Implement MVCC for snapshot isolation across reads
> • Add an end-to-end chaos test that kills the server randomly during
> • a workload and verifies no data loss across 1000 crash cycles

