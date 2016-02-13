---
title: Aerys
description: Aerys is a non-blocking HTTP/1.1 and HTTP/2 application / websocket / static file server.
title_menu: Introduction
layout: default
---

**A first config file**

```php
<?php

(new Aerys\Host)->use(root("/var/www/public_html"));
```

That's all needed to serve files from a static root. Put an index.html there and try opening `http://localhost/` in the browser.

The Host instance is at the root of each virtual host served by Aerys. By default it serves your content over port 80 on localhost. To configure an alternative binding, have a look [here](host_binding.md).

The `root()` function is returning a handler for static file serving and is expected a document root path to serve files from.
