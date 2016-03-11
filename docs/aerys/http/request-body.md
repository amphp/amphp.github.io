---
title: Parsing Request Bodies in Aerys
description: Aerys is a non-blocking HTTP/1.1 and HTTP/2 application / websocket / static file server.
title_menu: Parsing Bodies
layout: docs
---

```php
(new Aerys\Host)->use(function(Aerys\Request $req, Aerys\Response $res) {
	$body = yield Aerys\parseBody($req);
	$webserver = $body->get("webserver");

	if ($webserver === null) {
		$res->end('<form action="" method="post">Which one is the best webserver? <input type="text" name="webserver" /> <input type="submit" value="check" /></form>');
	} elseif (strtolower($webserver) == "aerys") {
		$res->end("Correct! Aerys is definitely the ultimate best webserver!");
	} else {
		$res->end("$webserver?? What's that? There is only Aerys!");
	}
});
```

`yield Aerys\parseBody($request)` returns a [`ParsedBody`](../classes/parsedbody.md) instance exposing a `get($name)` and a `getArray($name)`. `get()` always returns a string (first parameter) or null if the parameter was not defined. `getArray()` returns all the parameters with the same name in an array.

To get all the passed parameter names, use the `getNames()` method on the `ParsedBody` instance.

There are also methods for handling uploads, you can check them out at [the guide for uploading](../http-advanced/upload.md).
