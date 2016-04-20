---
title: Aerys\Session
description: Aerys\Session is a session module to be used with Aerys
title_menu: Introduction
layout: docs
---

`amphp/aerys-session` is a session module to be used in conjunction with [the Aerys webserver](../aerys).

## Required PHP Version

- PHP 7

## Current Stable Version

`Aerys\Session` currently still is quite experimental and may contain bugs. It has a few 0.x tags currently.

## Installation

```bash
$ composer require amphp/aerys-session
```

## Example config file

```php
<?php

$redisURI = "tcp://127.0.0.1:6379";
$redis = new Amp\Redis\Client($redisURI);
$mutex = new Amp\Redis\Mutex($redisURI, []);

(new Aerys\Host)
	->use(Aerys\session(["driver" => new Aerys\Session\Redis($redis, $mutex)]))
	->use(function(Aerys\Request $req, Aerys\Response $res) {
		$session = yield (new Aerys\Session($req))->open();
		$count = $session->get("requestcount") + 1;
		$session->set("requestcount", $count);
		yield $session->save();
	})
;
```