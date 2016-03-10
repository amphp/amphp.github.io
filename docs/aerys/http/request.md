---
title: Request Basics in Aerys
description: Aerys is a non-blocking HTTP/1.1 and HTTP/2 application / websocket / static file server.
title_menu: Request Basics
layout: docs
---

```php
(new Aerys\Host)->use(function(Aerys\Request $req, Aerys\Response $res) {
	# if the header not passed, null is returned
	$user_agent = $res->getHeader("User-Agent") ?? "";

	# Get a query string parameter
	$action = $res->getVar("action") ?? "default";

	$res->send("Action: <i>$action</i> requested by User-Agent<br><pre>$user_agent</pre>");
});
```

Try accessing `http://localhost/?action=beautiful` in the browser.

`Aerys\Request::getVar(string $parameter)` returns a string if the query string parameter was passed (if multiple ones with the same name exist, the first one), else null.

`Aerys\Request::getHeader(string $name)` returns a headers value.

There is additional information available about the request, check out the [`Request` docs](../classes/request.md) for it.
