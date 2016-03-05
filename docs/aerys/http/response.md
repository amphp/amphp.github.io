---
title: Response Basics
description: Aerys is a non-blocking HTTP/1.1 and HTTP/2 application / websocket / static file server.
title_menu: Response Basics
layout: default
---

```php
(new Aerys\Host)->use(function(Aerys\Request $req, Aerys\Response $res) {
    # This is the default status and does not need to be set explicitly
    # $res->setStatus(200);

    $res->setHeader("X-LIFE", "Very nice!");
    $res->end("With a bit text");
});
```

`Aerys\Response::setStatus($status)` sets the response status. The `$status` must be between 100 and 599.

`Aerys\Response::setHeader($header, $value)` sets a custom header, but be aware about header injections. Do not accept `\n` characters here if there will ever be user input!

`Aerys\Response::end($data = "")` terminates a response and sends the passed data. For more fine grained sending, have a look at [the guide about streaming](../http-advanced/streaming.md).

For a full explanation of all available methods check out the [`Response` class docs](../classes/response.md).
