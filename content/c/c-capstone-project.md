---
slug: c-capstone-project
id: c-capstone
track: c
order: 21
title: "Capstone Project: Modern backends need a fast, embeddable key-value store..."
description: |-
  Modern backends need a fast, embeddable key-value store that doesn't
    require a separate database server. MiniKV is a multi-threaded,
    persistent in-memory key-value store inspired by Redis's protocol and
    Memcached's eviction policy. It exposes a TCP line protocol (SET key
    value, GET key, DEL 
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: C Official Docs
    url: https://en.cppreference.com/w/c
    kind: doc
---

# Capstone Project: Modern backends need a fast, embeddable key-value store...

## Modern backends need a fast, embeddable key-value store...

Problem statement:
Modern backends need a fast, embeddable key-value store that doesn't
  require a separate database server. MiniKV is a multi-threaded,
  persistent in-memory key-value store inspired by Redis's protocol and
  Memcached's eviction policy. It exposes a TCP line protocol (SET key
  value, GET key, DEL key, KEYS prefix, STATS), stores entries in a
  hash table with separate chaining, snapshots the entire dataset to
  disk on a configurable interval and on shutdown, and replays a
  write-ahead log (WAL) on startup to recover committed writes. The
  server runs a fixed-size worker thread pool that pulls connections
  from a queue protected by a mutex and condition variable. The
  project exercises every concept from the 20-stage track: pointers,
  dynamic memory, structs, function pointers, file I/O, errno-based
  error handling, multi-file projects with opaque types, the standard
  library, advanced pointer patterns (T** for table resizing),
  pthreads, C11 atomics and _Static_assert, and a hardened Makefile
  with ASan/UBSan/valgrind clean.

Target users:
• A backend developer who needs an embedded cache for a side project
• and wants to read a real C codebase end-to-end.
• A systems engineer evaluating MiniKV as a learning artifact before
• contributing to Redis or Memcached.
• A teaching assistant demonstrating a complete C project: design,
• code, tests, CI, hardening, and documentation.
• A reviewer auditing the codebase for memory safety, thread safety,
• and API ergonomics.

P0 (Must have) requirements:
• Hash table with separate chaining (linked-list buckets) and
• automatic resize when load factor exceeds 0.75.
• String key/value storage with SET/GET/DEL/KEYS/STATS commands.
• TCP server on a configurable port using POSIX sockets
• (socket, bind, listen, accept).
• Worker thread pool with a connection queue protected by a mutex
• and a "not_empty" condition variable.
• Per-table read-write lock (pthread_rwlock_t) for command
• isolation; writes serialized, reads concurrent.
• Write-ahead log (WAL): every SET/DEL appends a line to minikv.wal
• with fsync; on startup, replay the WAL to rebuild state.
• Snapshot to minikv.snap on shutdown and on a configurable
• interval (default 60s) using a background thread.
• Opaque types in the public header (hash_table.h) — clients use
• only HashTable*.
• errno-based error handling with perror; every fopen/socket/malloc
• failure is propagated via a -1 return code with cleanup via goto.
• Multi-file project: hash_table.c/.h, server.c/.h, wal.c/.h,
• protocol.c/.h, threadpool.c/.h, main.c — compiled via Makefile.
• Makefile with debug, release, sanitize, and test targets; -Wall
• Wextra -Werror -pedantic; -fstack-protector-strong and
• D_FORTIFY_SOURCE=2 in release.

P1 (Should have) requirements:
• Expiration: SET key value EX seconds; a background thread sweeps
• expired keys every second.
• STATS command returning uptime, key_count, total_ops, hit_rate.
• Per-thread stats counters using C11 _Atomic uint64_t.
• Valgrind-clean under --leak-check=full --show-leak-kinds=all
• (zero definitely-lost, zero indirectly-lost).
• ASan-clean under -fsanitize=address,undefined with the server
• handling 10,000 SET/GET cycles without errors.
• A test runner (test_runner.c) that boots the server on a random
• port, sends commands via a socket, and asserts responses.
• _Static_assert invariants: sizeof(HashTable) == expected,
• offsetof(Bucket, head) == 0, sizeof(WalEntry) is a multiple of 8.

P2 (Nice to have) requirements:
• LRU eviction when memory exceeds a configurable limit (default
• 256 MB) using a doubly linked list + hash table.
• Pipelining: handle multiple commands per TCP read.
• WATCH/MULTI/EXEC-style optimistic transactions.
• A simple RESP (REdis Serialization Protocol) parser for wire
• compatibility with redis-cli.
• Snapshots compressed with zlib.
• Prometheus /metrics endpoint on a separate port.

```text
minikv/
├── .github/
│   └── workflows/
│       └── ci.yml                  # build + ASan/UBSan/valgrind
├── include/
│   ├── hash_table.h                # opaque HashTable type
│   ├── protocol.h                  # command enum + parse/print
│   ├── server.h                    # server_run, server_stop
│   ├── threadpool.h                # pool_submit, pool_destroy
│   ├── wal.h                       # wal_append, wal_replay
│   └── minikv.h                    # public umbrella header
├── src/
│   ├── hash_table.c                # table + buckets + resize
│   ├── protocol.c                  # line-protocol parser
│   ├── server.c                    # accept loop, connection queue
│   ├── threadpool.c                # worker threads + condvar
│   ├── wal.c                       # WAL append + replay + fsync
│   ├── snapshot.c                  # periodic snapshot thread
│   ├── stats.c                     # _Atomic counters
│   └── main.c                      # arg parsing, wiring
├── tests/
│   ├── test_hash_table.c
│   ├── test_protocol.c
│   ├── test_wal.c
│   └── test_integration.c          # boots server, sends SET/GET
├── scripts/
│   └── stress.py                   # 100k SET/GET via socket
├── Makefile
├── README.md
└── DESIGN.md
```
Caption: Suggested file structure

Tech stack:
• C11 (gcc >= 11 or clang >= 14); -std=c11 -pedantic.
• POSIX sockets (<sys/socket.h>, <netinet/in.h>, <arpa/inet.h>).
• pthreads (<pthread.h>) for the worker pool and rwlock.
• C11 <stdatomic.h> for stats counters.
• <stdint.h> for fixed-width on-disk formats.
• <errno.h> + perror/strerror_r for error reporting.
• gcc/clang with -Wall -Wextra -Werror -pedantic; -O2 release,
• O0 -g debug, -O1 -fsanitize=address,undefined sanitize.
• valgrind --leak-check=full for release verification.
• clang-tidy for static analysis (modernize-*, bugprone-*).
• Make for the build; CI via GitHub Actions on Linux.
• Python (stress.py) for end-to-end load testing.

> **Tip:** Testing strategy:
> - Unit tests for hash_table (set/get/del, resize at load factor
>     0.75, free of all entries) — target 100% line coverage on
>     hash_table.c.
>   - Unit tests for protocol (parse all 5 commands + error cases; format
>     +OK, -ERR, and bulk-string responses).
>   - Unit tests for wal (append + replay round-trip; truncated-record
>     recovery; large keys up to 64KB).
>   - Integration tests that boot the server on a random port and
>     exercise SET/GET/DEL/KEYS/STATS via a real socket — 50 assertions
>     across happy path and error cases.
>   - Stress test: scripts/stress.py opens 16 connections, sends 100k
>     SET/GET pairs, and asserts hit_rate > 0.99 and no errors.
>   - Coverage target: >=85% lines on src/, measured by gcov + lcov;
>     enforce in CI with `gcov` + a custom script that fails on <85%.
>   - Memory safety: valgrind --leak-check=full --show-leak-kinds=all
>     exits 0 on the test runner; ASan/UBSan build passes the stress
>     test; TSan build passes the integration test (no data races).

> **Tip:** Deployment guide:
> - Build the release binary: `make release` (produces build/minikv).
>   - Run on a Linux server (Ubuntu 22.04+ or Debian 12+): `./minikv
>     --port 6380 --data-dir /var/lib/minikv --snapshot-interval 60`.
>   - Run as a non-root user with a systemd unit:
>     [Service] ExecStart=/usr/local/bin/minikv --port 6380
>     --data-dir /var/lib/minikv ; User=minikv ; Group=minikv ;
>     Restart=on-failure ; LimitNOFILE=65536.
>   - Environment variables: MINIKV_PORT (default 6380), MINIKV_DATA_DIR
>     (default ./data), MINIKV_SNAPSHOT_INTERVAL (default 60),
>     MINIKV_MAX_MEM_MB (default 256, P2 only).
>   - Post-deploy verification: `redis-cli -p 6380 PING` (returns +OK
>     if you implemented PING in P2; otherwise use `nc localhost 6380`
>     and type `STATS`); `ss -tlnp | grep 6380` (listening);
>     `journalctl -u minikv -f` (no errors after stress.py runs).
>   - Backup: cron a daily `cp /var/lib/minikv/minikv.snap
>     /backup/minikv-$(date +%F).snap` and retain 7 days.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Correctness (20 pts) — All P0 commands work end-to-end;
>      SET/GET/DEL/KEYS/STATS return correct results under 4-thread
>      load; WAL recovery replays committed writes after a kill -9.
>   2. Memory safety (20 pts) — Zero "definitely lost" under valgrind
>      --leak-check=full; zero ASan/UBSan errors under the stress test;
>      zero TSan data races under the integration test.
>   3. Architecture (20 pts) — Clean module boundaries (hash_table,
>      protocol, server, threadpool, wal, snapshot, stats, main);
>      opaque types in headers; function-pointer dispatch for commands;
>      error propagation via -1 + errno + goto cleanup; no global state
>      except stats atomics.
>   4. Concurrency (20 pts) — Per-table rwlock for read concurrency;
>      worker pool with bounded queue + condvar; C11 atomics for stats;
>      no deadlocks under stress; documented lock contract.
>   5. Tooling and CI (20 pts) — Makefile with debug/release/sanitize/
>      test targets; hardened release flags; GitHub Actions with four
>      parallel jobs (build, sanitize, valgrind, clang-tidy); test
>      coverage >=85% on src/; README and DESIGN documentation.
> 
> Stretch goals:
>   - Implement LRU eviction with a doubly linked list + hash table
>     (Stage 17 pattern) when memory exceeds MINIKV_MAX_MEM_MB.
>   - Add a pipelined protocol parser handling multiple commands per
>     TCP read for 2-3x throughput.
>   - Implement WATCH/MULTI/EXEC optimistic transactions: clients
>     WATCH a key; if it changes before EXEC, the transaction aborts.
>   - Implement a RESP-compatible parser so redis-cli can talk to
>     MiniKV out of the box.
>   - Compress snapshots with zlib (-3 level) and add a CRC32 checksum
>     per snapshot file; refuse to load a corrupted snapshot.
>   - Add a /metrics endpoint on a second port returning Prometheus-
>     formatted counters (minikv_sets_total, minikv_gets_total, etc.).
>   - Port the worker pool to C11 <threads.h> + <stdatomic.h> instead
>     of pthreads; benchmark the difference.
>   - Implement a sharded hash table (N tables, each with its own lock)
>     to scale writes across CPU cores; benchmark with 16 threads.
>   - Add TLS support via OpenSSL for encrypted client connections.
>   - Write a libuv-based async I/O variant and benchmark throughput
>     vs the pthread pool version.

> **Tip:** Stretch goals:
> • Implement LRU eviction with a doubly linked list + hash table
> • (Stage 17 pattern) when memory exceeds MINIKV_MAX_MEM_MB.
> • Add a pipelined protocol parser handling multiple commands per
> • TCP read for 2-3x throughput.
> • Implement WATCH/MULTI/EXEC optimistic transactions: clients
> • WATCH a key; if it changes before EXEC, the transaction aborts.
> • Implement a RESP-compatible parser so redis-cli can talk to
> • MiniKV out of the box.
> • Compress snapshots with zlib (-3 level) and add a CRC32 checksum
> • per snapshot file; refuse to load a corrupted snapshot.
> • Add a /metrics endpoint on a second port returning Prometheus-
> • formatted counters (minikv_sets_total, minikv_gets_total, etc.).
> • Port the worker pool to C11 <threads.h> + <stdatomic.h> instead
> • of pthreads; benchmark the difference.
> • Implement a sharded hash table (N tables, each with its own lock)
> • to scale writes across CPU cores; benchmark with 16 threads.
> • Add TLS support via OpenSSL for encrypted client connections.
> • Write a libuv-based async I/O variant and benchmark throughput
> • vs the pthread pool version.

