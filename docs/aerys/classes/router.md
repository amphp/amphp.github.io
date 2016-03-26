---
title: Router in Aerys
description: Aerys is a non-blocking HTTP/1.1 and HTTP/2 application / websocket / static file server.
title_menu: Router
layout: docs
---

The `Router` class is typically instantiated via the `router()` function.

## `use(callable|\Aerys\Middleware|\Aerys\Bootable): self`

Installs an action global to the router.

## `prefix(string): self`

Prefixes every route (and even global actions) with a given prefix.

## `route(string $method, string $uri, callable|\Aerys\Middleware|\Aerys\Bootable ...$actions): self`

Installs a route to be matched on a given `$method` and `$uri` combination.

In case of match, the route middlewares will be installed (including global `use()`'d middlewares) in _the order they were defined_. Similar for the chain of application callables.

## `$method(string $uri, callable|\Aerys\Middleware|\Aerys\Bootable ...$actions): self` (aka `__call`)

Forwards the call to `route($method, $uri, $actions)`. (E.g. `get("/", $action)` is equivalent to `route("GET", "/", $action)`.)