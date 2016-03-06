---
title: Introduction to HTTP
description: Aerys is a non-blocking HTTP/1.1 and HTTP/2 application / websocket / static file server.
title_menu: Introduction to HTTP
layout: docs
---

```php
(new Aerys\Host)->use(function(Aerys\Request $req, Aerys\Response $res) {
    $res->end("<h1>Hello, world!</h1>");
});
```

To define a dynamic handler, all that is needed is a callable passed to `Host::use()`, accepting an `Aerys\Request` and an `Aerys\Response` instance as first respectively second parameters.

> **Note**: This handler is used for all URIs of that Host by default, but it can be routed with the [Router](static-routing.md).
