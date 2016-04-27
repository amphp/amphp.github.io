---
title: Aerys\session()
description: Aerys\Session is a session module to be used with Aerys.
title_menu: Middleware
layout: docs
---

Each endpoint wishing to use the session API, **must** use the  `Aerys\session(Aerys\Session\Driver $driver, $options = [])` middleware.

There are currently two drivers:

- `Aerys\Session\Redis` - Default Redis driver
- `Aerys\Session\RedisPublish` - Extended Redis driver additionally broadcasting session updates via `sess:regenerate` and `sess:update` keys

Available `$options` are:

- `name` - Name of the session cookie (Default: `"session"`)
- `ttl` - Lifetime of a session cookie; set to -1 to have the browser expire it (Default: `-1`)
- `maxlife` - Only relevant if `ttl` set to `-1`; lifetime of the cookie before it gets invalidated in storage (Default: `3600`)
- `path` - Cookie path (Default: `"/"`)
- `cookie_flags` - Additional cookie flags as per [RFC 6265](https://tools.ietf.org/html/rfc6265#section-5.2.1), see also [Aerys\Response::setCookie()](../aerys/classes/response.html). (Default: `["httpOnly", "secure"]` - `"secure"` flag only set on encrypted connections)

To `use()` the middleware, pass the return value of `Aerys\session` to [`Host::use()`](../aerys/classes/host.html), [`Router::use()`](../aerys/classes/router.html) or as further argument to a route.

## Examples

`$driver` is an instance of `Aerys\Session\Driver` and `$handler` a custom responder callable:

- `(new Aerys\Host)->use(Aerys\session($driver))->use($handler)`
- `Aerys\router()->use(Aerys\session($driver))->get("/route", $handler)`
- `Aerys\router()->get("/route", Aerys\session($driver), $handler)`.
