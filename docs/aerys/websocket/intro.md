---
title: Aerys
description: Aerys is a non-blocking HTTP/1.1 and HTTP/2 application / websocket / static file server.
title_menu: Introduction to Websockets
layout: default
---

```php
# just a blackhole, no processing yet
(new Aerys\Host)->use(Aerys\websocket(new class extends Aerys\Websocket {
	public function onStart(Websocket\Endpoint $endpoint) { }
	public function onHandshake(Request $request, Response $response) { }
	public function onOpen(int $clientId, $handshakeData) { }
	public function onData(int $clientId, Websocket\Message $msg) { }
	public function onClose(int $clientId, int $code, string $reason) { }
	public function onStop() { }
}));
```

Websockets are real-time full-duplex (two-way) connections between client and server. 

`Aerys\websocket()` is returning a callable handler which can be passed to either `Host::use()` or to the Router by specifing a `->get('/path/to/websocket', Aerys\websocket($handler))` route. It expects an instance of an implementation of `Aerys\Websocket`.
