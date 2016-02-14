---
title: Aerys
description: Aerys is a non-blocking HTTP/1.1 and HTTP/2 application / websocket / static file server.
title_menu: Request basics
layout: default
---

```
(new Aerys\Host)->use(function(Aerys\Request $req, Aerys\Response $res) {
	# if the header not passed, null is returned
	$user_agent = $res->getHeader("User-Agent") ?? "";

	# Get a query string parameter
	$action = $res->getQueryVars()["action"] ?? "default";

	$res->send("Action: <i>$action</i> requested by User-Agent<br><pre>$user_agent</pre>");
});
```

Try accessing `http://localhost/?action=beautiful` in the browser.

`Aerys\Request::getQueryVars()` returns an array of all the query string parameters (as parsed by [`parse_str()`](http://php.net/parse_str)), being (nearly) equivalent to `$_GET`.

`Aerys\Request::getHeader(string $name)` returns a headers value.

There are a few more information available about the request, check out the [`Request` docs`](../classes/request.md) for these.
