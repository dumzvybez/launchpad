---
slug: nodejs-networking-net-dgram-tls
id: nodejs-15
track: nodejs
order: 15
title: Networking — net, dgram, TLS
description: Build raw TCP servers with `net`, send datagrams with `dgram`, secure connections with `tls`, and understand the framing/protocol concerns that http hides.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=w-7RQ46RgxU&t=240s
whyItMatters: Build raw TCP servers with `net`, send datagrams with `dgram`, secure connections with `tls`, and understand the framing/protocol concerns that http hides.
deepDiveResources:
  - label: W3Schools Node.js
    url: https://www.w3schools.com/nodejs/
    kind: course
  - label: Node.js Official Docs
    url: https://nodejs.org/docs/latest/api/
    kind: doc
---

# Networking — net, dgram, TLS

## Networking — net, dgram, TLS

### Why It Matters

Build raw TCP servers with `net`, send datagrams with `dgram`, secure connections with `tls`, and understand the framing/protocol concerns that http hides.

Build raw TCP servers with `net`, send datagrams with `dgram`, secure connections with `tls`, and understand the framing/protocol concerns that http hides.

### Prerequisites

- Stage 1: Getting Started with Node.js.
- Stage 5: The http Module (http is built on net).
- Stage 6: Streams (net sockets are Duplex streams).
- Stage 7: Buffers (binary framing).

### Topics

- `net.createServer` and `net.connect` (TCP)
- Sockets as Duplex streams: 'data', 'end', 'close', 'error'
- `dgram` (UDP) — `createSocket("udp4"/"udp6")`, send/receive
- TLS: `tls.createServer`, `tls.connect`, cert/key options
- SNI (Server Name Indication) for multi-domain TLS
- ALPN (Application-Layer Protocol Negotiation) for HTTP/2 vs HTTP/1.1
- `http2` module — multiplexed streams, server push
- Framing protocols over raw TCP (length-prefixed, newline-delimited)

### Key Concepts

- `net` is raw TCP — you must frame your own messages (length-prefix, newline-delimited, etc.); http does this for you with headers.
- `dgram` is UDP — fire-and-forget, no delivery guarantee, no ordering; great for low-latency telemetry, gaming, DNS.
- TLS adds encryption via a cert/key pair; the HTTPS module is http + tls.
- SNI lets one TLS server serve multiple domains with different certs based on the requested hostname.
- `net.Socket` is a Duplex stream — you can pipe it, async-iterate it, and handle 'error' (or it crashes the process).

```javascript
const net = require("node:net");

const server = net.createServer((socket) => {
  console.log(`client connected: ${socket.remoteAddress}`);
  socket.pipe(socket);                          // echo back
  socket.on("error", (err) => console.error("socket:", err.message));
});

server.listen(5000, () => console.log("TCP echo on :5000"));
```
Caption: TCP echo server

### Common Pitfalls

- Not handling `'error'` on a `net.Socket` — socket errors throw as uncaught exceptions and crash the process; always `socket.on("error", ...)`.
- Assuming TCP preserves message boundaries — TCP is a byte stream; the receiver may get partial messages or messages glued together. Frame your protocol.
- Using UDP for things that need reliability — UDP has no delivery guarantee, no ordering, no congestion control; use TCP or QUIC for reliable transport.
- Using expired or self-signed certs in production — clients will refuse the connection; use Let's Encrypt (via certbot or `acme-client`).
- Forgetting SNI configuration when serving multiple domains — clients get the wrong cert and TLS verification fails; configure `SNICallback` or use a reverse proxy (nginx, Caddy).

### Real-World Applications

- The `ws` (WebSocket) library uses `net`/`tls` for the underlying TCP connection and adds the WebSocket handshake and framing.
- Database drivers (pg, mysql2, redis, mongodb) use `net` to connect to backend servers.
- Gaming backends use `dgram` for low-latency state updates (position, hits) where occasional packet loss is acceptable.
- gRPC uses HTTP/2 (`http2` module) for multiplexed bidirectional streaming.

### Interview Questions

- 1. What's the difference between `net` and `dgram`? — `net` is TCP (reliable, ordered, byte-stream); `dgram` is UDP (fire-and-forget, no delivery guarantee, no ordering, datagrams preserved).
- 2. Why doesn't TCP preserve message boundaries? — TCP is a byte stream, not a message stream; the OS may coalesce or split your writes. You must frame messages yourself (length-prefix, delimiter).
- 3. What is SNI? — Server Name Indication lets the client send the requested hostname in the TLS handshake so the server can pick the right cert — enabling virtual hosting for HTTPS.
- 4. What is ALPN? — Application-Layer Protocol Negotiation; lets the client and server agree on a protocol (HTTP/1.1, HTTP/2, h3) during the TLS handshake.
- 5. Why must you handle `'error'` on a `net.Socket`? — Socket errors emit `'error'`; without a listener, Node throws it as an uncaught exception, crashing the process.

### Mini Project

Build a TCP Chat Server: A multi-user chat over raw TCP where users connect with `nc <host> <port>`, set a nickname, and broadcast messages to all other connected users. Suggested approach:
  - Use `net.createServer` to accept connections
  - Maintain a `Set<socket>` of connected clients
  - On 'data', parse the first line as `/nick <name>` and subsequent lines as messages
  - Broadcast each message to all OTHER sockets (skip the sender) with `socket.write(...)`
  - Handle 'error' and 'close' to remove the socket from the set and broadcast "user left"

### Exercises

1. Build a TCP echo server and test with `nc localhost 5000`.
2. Add length-prefixed framing and verify message boundaries are preserved.
3. Build a UDP time server that replies to any datagram with the current ISO timestamp.
4. Generate a self-signed cert with `openssl` and run a TLS server.
5. Use `net.connect` to write a TCP client that connects to your echo server.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which module provides raw TCP?
9. A) node:tcp
10. B) node:socket
11. C) node:net (*)
12. D) node:http
13. Explanation: `node:net` provides TCP servers (`createServer`) and clients (`connect`); the `http` module is built on top of `net`.
14. Q2: Does TCP preserve message boundaries?
15. A) Yes, always
16. B) Only on localhost
17. C) Only with the `tcp_packet` option
18. D) No — TCP is a byte stream; you must frame messages yourself (*)
19. Explanation: TCP is a byte stream; the OS may coalesce or split writes. Use length-prefixing or delimiters to frame messages.
20. Q3: What does `dgram` provide?
21. A) UDP — fire-and-forget datagrams (*)
22. B) Reliable ordered messaging
23. C) TLS over TCP
24. D) HTTP/2
25. Explanation: `node:dgram` is UDP: no delivery guarantee, no ordering, but datagrams are preserved (each `send` is one datagram on the receiver).
26. Q4: What must you ALWAYS handle on a `net.Socket`?
27. A) 'connect'
28. B) 'error' (*)
29. C) 'data'
30. D) 'drain'
31. Explanation: Socket errors emit `'error'`; without a listener, Node throws it as an uncaught exception and crashes the process.
32. Q5: What does SNI enable?
33. A) Faster TLS handshakes
34. B) Compressing TLS records
35. C) Serving multiple domains with different certs on one IP (*)
36. D) Encrypting UDP
37. Explanation: Server Name Indication lets the client send the requested hostname during the TLS handshake so the server picks the matching cert — virtual hosting for HTTPS.
38. Q6: Which module provides HTTP/2?
39. A) node:h2
40. B) node:net2
41. C) node:http2 is not built-in
42. D) node:http2 (*)
43. Explanation: `node:http2` provides HTTP/2 with multiplexed streams, server push, and header compression (HPACK).
44. Q7: What is a `net.Socket` in stream terms?
45. A) A Duplex stream (both readable and writable) (*)
46. B) A Readable only
47. C) A Writable only
48. D) A Transform stream
49. Explanation: A `net.Socket` is a Duplex stream — you can `socket.write(...)` and listen to `'data'` events, pipe it, async-iterate it.
50. Q8: Which is true about UDP?
51. A) It guarantees delivery
52. B) No delivery guarantee, no ordering, datagrams preserved (*)
53. C) It preserves message order
54. D) It uses TCP underneath
55. Explanation: UDP is fire-and-forget; no guarantee the datagram arrives, no ordering, but each `send` produces one datagram on the receiver.
56. Q9: What is ALPN?
57. A) A TLS cipher
58. B) A TCP option
59. C) Application-Layer Protocol Negotiation (e.g. h2 vs http/1.1 during TLS handshake) (*)
60. D) An HTTP header
61. Explanation: ALPN lets client and server agree on a protocol (HTTP/1.1, HTTP/2, h3) during the TLS handshake, enabling protocol upgrade without extra round-trips.
62. Q10: Which is a common framing scheme for TCP protocols?
63. A) Sending one byte per message
64. B) Just relying on TCP boundaries
65. C) Using UDP instead
66. D) Length-prefixed: 4-byte length header + payload (*)
67. Explanation: Length-prefixed framing (4-byte big-endian length + payload) is a common, simple framing scheme; newline-delimited is another for text protocols.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which module provides raw TCP?
  options:
    - node:tcp
    - node:socket
    - node:net
    - node:http
  correctIndex: 2
  explanation: "`node:net` provides TCP servers (`createServer`) and clients (`connect`); the `http` module is built on top of `net`."
- id: q2
  question: Does TCP preserve message boundaries?
  options:
    - Yes, always
    - Only on localhost
    - Only with the `tcp_packet` option
    - No — TCP is a byte stream; you must frame messages yourself
  correctIndex: 3
  explanation: TCP is a byte stream; the OS may coalesce or split writes. Use length-prefixing or delimiters to frame messages.
- id: q3
  question: What does `dgram` provide?
  options:
    - UDP — fire-and-forget datagrams
    - Reliable ordered messaging
    - TLS over TCP
    - HTTP/2
  correctIndex: 0
  explanation: "`node:dgram` is UDP: no delivery guarantee, no ordering, but datagrams are preserved (each `send` is one datagram on the receiver)."
- id: q4
  question: What must you ALWAYS handle on a `net.Socket`?
  options:
    - "'connect'"
    - "'error'"
    - "'data'"
    - "'drain'"
  correctIndex: 1
  explanation: Socket errors emit `'error'`; without a listener, Node throws it as an uncaught exception and crashes the process.
- id: q5
  question: What does SNI enable?
  options:
    - Faster TLS handshakes
    - Compressing TLS records
    - Serving multiple domains with different certs on one IP
    - Encrypting UDP
  correctIndex: 2
  explanation: Server Name Indication lets the client send the requested hostname during the TLS handshake so the server picks the matching cert — virtual hosting for HTTPS.
- id: q6
  question: Which module provides HTTP/2?
  options:
    - node:h2
    - node:net2
    - node:http2 is not built-in
    - node:http2
    - .
  correctIndex: 3
  explanation: "`node:http2` provides HTTP/2 with multiplexed streams, server push, and header compression (HPACK)."
- id: q7
  question: What is a `net.Socket` in stream terms?
  options:
    - A Duplex stream (both readable and writable)
    - A Readable only
    - A Writable only
    - A Transform stream
  correctIndex: 0
  explanation: A `net.Socket` is a Duplex stream — you can `socket.write(...)` and listen to `'data'` events, pipe it, async-iterate it.
- id: q8
  question: Which is true about UDP?
  options:
    - It guarantees delivery
    - No delivery guarantee, no ordering, datagrams preserved
    - It preserves message order
    - It uses TCP underneath
  correctIndex: 1
  explanation: UDP is fire-and-forget; no guarantee the datagram arrives, no ordering, but each `send` produces one datagram on the receiver.
- id: q9
  question: What is ALPN?
  options:
    - A TLS cipher
    - A TCP option
    - Application-Layer Protocol Negotiation (e.g. h2 vs http/1.1 during TLS handshake)
    - An HTTP header
  correctIndex: 2
  explanation: ALPN lets client and server agree on a protocol (HTTP/1.1, HTTP/2, h3) during the TLS handshake, enabling protocol upgrade without extra round-trips.
- id: q10
  question: Which is a common framing scheme for TCP protocols?
  options:
    - Sending one byte per message
    - Just relying on TCP boundaries
    - Using UDP instead
    - "Length-prefixed: 4-byte length header + payload"
  correctIndex: 3
  explanation: Length-prefixed framing (4-byte big-endian length + payload) is a common, simple framing scheme; newline-delimited is another for text protocols.
```

