---
title: Using the Aerys\Logger
description: Aerys is a non-blocking HTTP/1.1 and HTTP/2 application / websocket / static file server.
title_menu: Usage
layout: tutorial
---

```php
(new Aerys\Host)->use(new class implements Bootable {
	private $logger;

	function boot(Aerys\Server $server, Aerys\Logger $logger) {
		$this->logger = $logger;
	}

	function __invoke(Aerys\Request $req, Aerys\Response $res) {
		$this->logger->debug("Request received!");
	}
});
```

The `Aerys\Bootable` interface provides a `boot(Aerys\Server $server, Aerys\Logger $logger)` function, which is called with the `Aerys\Server` and especially the `Aerys\Logger` instance before the `Aerys\Server` is actually started. [`STARTING` state]

The passed `Aerys\Logger` instance can then be stored in e.g. an object property for later use. As it is implementing `Psr\Log\LoggerInterface`, it provides methods from `debug()` to `emergency()`.

The signature of these functions is `(string $message, array $context = [])` with `$context` array possibly containing an entry `"time" => $unixTimestamp` [If this one is not present, current time is assumed].