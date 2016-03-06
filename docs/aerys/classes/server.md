---
title: Server in Aerys
description: Aerys is a non-blocking HTTP/1.1 and HTTP/2 application / websocket / static file server.
title_menu: Server
layout: docs
---

* Table of Contents
{:toc}

The `Server` instance controls the whole listening and dispatches the parsed requests.

## `attach(ServerObserver)`

Enables a [`ServerObserver`](serverobserver.html) instance to be notified of the updates.

## `detach(ServerObserver)`

Disables notifications for the passed [`ServerObserver`](serverobserver.html) instance.

## `state()`

Gets the current server state, which is one of the following class constants:

* `Server::STARTED`
* `Server::STARTING`
* `Server::STOPPING`
* `Server::STOPPED`

## `getOption(string)`

Gets an [`option`](options.html).

## `setOption(string, $value)`

Sets an [`option`](options.html).

## `stop(): Promise`

Initiate shutdown sequence. The returned `Promise` will resolve when the server has successfully been stopped.
