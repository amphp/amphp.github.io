---
title: Aerys
description: Aerys is a non-blocking HTTP/1.1 and HTTP/2 application / websocket / static file server.
title_menu: Websocket handshake handling
layout: default
---

```php
# This example is printing to stdout. Do that only for testing purposes!

class MyWs implements Aerys\Websocket {
	private $clients = [];
	public function onStart(Aerys\Websocket\Endpoint $endpoint) { /* $endpoint is for sending */ }
	public function onHandshake(Aerys\Request $req, Aerys\Response $res) {
		if (($request->getQueryVars()["password"] ?? "") == "reallyverysecure") {
			return $request;
		} else {
			# if status set to anything else than 101, Websocket connection will not be established
			$res->setStatus(403);
			$res->end("Nope. Valid password required.");
		}
	}
	public function onOpen(int $clientId, $request) {
		$this->clients[$clientId] = $request->getConnectionInfo();
		print "Successful Handshake for user with client id $clientId from {$this->clients[$clientId]['client_addr']}\n";
	}
	public function onData(int $clientId, Aerys\Websocket\Message $msg) {
		print "User with client id $clientId from {$this->clients[$clientId]['client_addr']} sent: " . (yield $msg) . "\n";
	}
	public function onClose(int $clientId, int $code, string $reason) {
		unset($this->clients[$clientId]);
		print "User with client id $clientId closed connection with code $code\n";
	}
	public function onStop() { /* when server stops, not important for now */ }
}

$router = Aerys\router()
	->get('/ws', Aerys\websocket(new MyWs))
	->get('/', function (Aerys\Request $req, Aerys\Response $res) {
		$res->end(<<<'HTML'
<script type="text/javascript">
	ws = new WebSocket("ws://localhost/ws?password=reallyverysecure");
	ws.onopen = function() {
		document.writeln("opened<br />"); /* crappy console.log alternative for example purposes */
		ws.send("ping");
	};
	ws.onerror = ws.onmessage = ws.onclose = function(e) {
		document.writeln(e);
	};
</script>
HTML
);
	})
;

(new Aerys\Host)->use($router);
```

`onHandshake($req, $res)` is like a normal request handler, it is the time to determine whether a request shall be successful or not. (E.g. validating a session cookie, a password, ...)

Setting the status (via `Aerys\Response::setStatus()`) to another value than 101 prevents establishing the websocket connection and sends a normal HTTP reply back.

The return value of the `onHandshake()` call is passed as second argument to `onOpen()` in order to allow passing authentication information and assigning it to a $clientId, as there is no clientId yet before the connection has been established.
