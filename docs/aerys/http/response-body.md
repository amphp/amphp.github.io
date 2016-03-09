---
title: Parsing Request Bodies in Aerys
description: Aerys is a non-blocking HTTP/1.1 and HTTP/2 application / websocket / static file server.
title_menu: Parsing Bodies
layout: docs
---

```php
(new Aerys\Host)->use(function(Aerys\Request $req, Aerys\Response $res) {
	$body = yield Aerys\parseBody($req);
	$webserver = $body->getString("webserver");

	if (!isset($webserver)) {
		$res->end('<form action="" method="post">Which one is the best webserver? <input type="text" name="webserver" /> <input type="submit" value="check" /></form>');
	} elseif (strtolower($webserver) == "aerys") {
		$res->end("Correct! Aerys is definitely the ultimate best webserver!");
	} else {
		$res->end("$webserver?? What's that? There is only Aerys!");
	}
});
```

`Aerys\parseBody($request)` returns a [`ParsedBody`](../classes/parsedbody.md) instance exposing a `getString($name)` and a `getArray($name)`. `getString()` always returns a string or null if the parameter was an array or not defined. Analog for `getArray()`.

To get all the passed parameter names, use the `getNames()` method on the `ParsedBody` instance.

There are also methods for handling uploads, you can check them out at [the guide for uploading](../http-advanced/upload.md).
