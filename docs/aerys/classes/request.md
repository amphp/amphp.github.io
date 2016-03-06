---
title: Request interface in Aerys
description: Aerys is a non-blocking HTTP/1.1 and HTTP/2 application / websocket / static file server.
title_menu: Request
layout: docs
---

* Table of Contents
{:toc}

The `Request` class generally finds its only use in responder callables (or [`Websocket::onOpen()`](websocket.html#onopen)). [`Middleware`s](middleware.html) do never see the `Request`; the `Request` class is supposed to be a simple request API reading from and manipulating [`InternalRequest`](internalrequest.html) under the hood.

## `getMethod(): string`

Returns the used method, e.g. `"GET"`.

## `getUri(): string`

Returns the requested URI, e.g. `"/"`.

## `getProtocolVersion(): string`

Currently it will return one of the three supported versions: `"1.0"`, `"1.1"` or `"2.0"`.

## `getHeaderArray(string): array<string>`

Gets an array with headers. HTTP allows for multiple headers with the same name, so this returns an array. Usually only a single header is needed and expected, in this case there is `getHeader()`.

## `getHeader(string): string | null`

Gets the first value of all the headers with that name

## `getAllHeaders(): array<array<string>>`

Returns all the headers in an associative map with the keys being normalized header names in lowercase.

## `getBody(): Body`

Returns a representation of the request body. The [`Body`](body-message.html) can be `yield`ed to get the actual string.

There also exists a [`parseBody()`](parsedbody.html) function for processing of a typical HTTP form data.

## `getQueryVars(): array`

Get a `parse_str()` decoded query string as array.

## `getCookie(string): string | null`

Gets a cookie value by name.

## `getConnectionInfo(): array`

Returns various information about the request, a map of the array is:

```php
["client_port"  => int,
 "client_addr"  => string,
 "server_port"  => int,
 "server_addr"  => string,
 "is_encrypted" => bool,
 "crypto_info"  => array, # Like returned via stream_get_meta_data($socket)["crypto"]
]
```

## `getLocalVar(string)` / `setLocalVar(string, $value)`

These methods are only important when using [`Middleware`s](middleware.html). They manipulate the [`InternalRequest->locals`](internalrequest.html#locals) array.
