---
title: Setting Aerys options
description: Aerys is a non-blocking HTTP/1.1 and HTTP/2 application / websocket / static file server.
title_menu: Setting
layout: tutorial
---

```php
const AERYS_OPTIONS = [
	"sendServerToken" => true,
];
```

The most common way to define options is via an `AERYS_OPTIONS` constant inside the configuration file.

For external code, there is the possibility inside a `Bootable` to fetch the `Server` object during the `boot` function and call `$server->setOption($name, $value)`.

Additionally, there are several ways to get an options value:
- `$client->options->option_name` (for `Middleware`s via `InternalRequest->client` property)
- `Request::getOption("option_name")` (for Response handlers)
- `Server::getOption("option_name")` (for `Bootable`s)