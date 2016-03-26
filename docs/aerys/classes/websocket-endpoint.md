---
title: Websocket\Endpoint interface in Aerys
description: Aerys is a non-blocking HTTP/1.1 and HTTP/2 application / websocket / static file server.
title_menu: Websocket\Endpoint
layout: docs
---

* Table of Contents
{:toc}

The `Websocket\Endpoint` interface is the door to communicating with the client. `$clientId` is here in every case the client identifier passed in via [`Websocket` interface functions](websocket.html).

## `send(int|null|array $clientId, string $data): Promise`

Sends UTF-8 compatible data to a set of clients. If `$clientId` is null, it sends the data to _every_ client.

The Promise will be fulfilled when the internal buffers aren't too saturated. Yielding these promises is a good way to prevent too much data pending in memory.

## `sendBinary(int|null|array $clientId, string $data): Promise`

Sends raw binary data to a set of clients. If `$clientId` is null, it sends the data to _every_ client.

The Promise will be fulfilled when the internal buffers aren't too saturated.

## `close(int $clientId, int $code = Websocket\Code::NORMAL_CLOSE, string $reason = "")`

Closes the websocket connection to a `$clientId` with a `$code` and a `$reason`.

## `getInfo(int $clientId): array`

This returns an array with the following (self-explaining) keys:

- `bytes_read`
- `bytes_sent`
- `frames_read`
- `frames_sent`
- `messages_read`
- `messages_sent`
- `connected_at`
- `closed_at`
- `last_read_at`
- `last_sent_at`
- `last_data_read_at`
- `last_data_sent_at`

## `getClients(): array<int>`

Gets an array with all the client identifiers.