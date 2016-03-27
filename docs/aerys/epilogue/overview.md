---
title: What's left of possibilites in Aerys
description: Aerys is a non-blocking HTTP/1.1 and HTTP/2 application / websocket / static file server.
title_menu: Everything else
layout: tutorial
---

That's it - nearly.

Aerys has a powerful responder callable mechanism, coupled to Middlewares with routing based upon Promises and non-blocking I/O. Beyond that ...

It has HTTP/1 and HTTP/2 drivers. It provides a possibility to define a custom driver, see the [`HttpDriver` class docs](../classes/httpdriver.html).

Furthermore, it is possible to control (in non-debug mode) the Server (externally or within Aerys) via the [`CommandClient` class](../classes/commandclient.html).

When the server is then (or somehow else) started up or shut down, it is possible to be notified of these events via the [`ServerObserver` class](../classes/serverobserver.html).