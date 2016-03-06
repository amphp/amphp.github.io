---
title: Running Aerys in Production
description: Aerys is a non-blocking HTTP/1.1 and HTTP/2 application / websocket / static file server.
title_menu: Running in production
layout: docs
---

## General

- Set your `ulimit -n` (maximum open file descriptors) high enough to manage all your connections. Recommended is at least `Options->maxConnections + 100`. [100 is an arbitrary number usually big enough for all the persisting file descriptors. If not enough, add more.]
- Ratelimit the number of connections from a single IP (at least if you have no clever load-balancer) via for example iptables, to avoid too many connections being dropped off. Be aware that websocket and HTTP/2 connections are persistent. It's recommended to carefully balance the maximum connections per IP (proxys!) and the maxConnections option. It just is a simple layer of security against trivial DoS attacks, but won't help against DDoS, which will be able to just hold all the connections open.
- In case you are using a properly configured load-balancer in front of Aerys servers, you should set the number of connections near to the maximum the host system can handle.
- Aerys has a file server, which isn't too bad (use libuv if you use it!), but for heavy loads, a CDN is recommended.

## Options

Defaults are chosen in a moderate way between security and performance on a typical machine.

- `maxConnections` is important to prevent the server from going out of memory in combination with maximum body and header size and (for HTTP/2) `maxConcurrentStreams` option.
- `maxBodySize` is recommended to be set to the lowest necessary for your application. If it is too high, people may fill your memory with useless data.
- `maxHeaderSize` should never need to be touched except if you have 50 KB of cookies ...
- `softStreamCap` is a limit where `Response::stream()` returns an unresolved Promise until buffer is empty enough again. If you do not have much memory, consider lowering it, if you have enough, possibly set it a bit higher. It is not recommended to have it higher than available memory divided by `maxConnections` and `maxStreams` and 2 (example: for 8 GB memory, 256 KB buffer is fine).
- `maxConcurrentStreams` is the maximum of concurrent HTTP/2 streams on a single connection. Do not set it too high (but neither too low to not limit concurrency) to avoid trivial attacks.
