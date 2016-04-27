---
title: Aerys\Session
description: Aerys\Session is a session module to be used with Aerys.
title_menu: Introduction
layout: docs
---

`amphp/aerys-session` is a session module to be used in conjunction with [the Aerys webserver](../aerys).

## Required PHP Version

- PHP 7

## Current Stable Version

`Aerys\Session` is currently still experimental and may contain bugs. It has a few 0.x tags and follows semantic versioning for `0.x.y`, that means `x` is a major version and every `y` is a minor / bugfix version as long as there's no `1.0.0`.

## Installation

```bash
composer require amphp/aerys-session
```

## Example config file

```php
<?php

$redisUri = "tcp://127.0.0.1:6379";
$redis = new Amp\Redis\Client($redisUri);
$mutex = new Amp\Redis\Mutex($redisUri, []);

(new Aerys\Host)
	->use(Aerys\session(new Aerys\Session\Redis($redis, $mutex)))
	->use(function(Aerys\Request $req, Aerys\Response $res) {
		$session = yield (new Aerys\Session($req))->open();
		$count = $session->get("requestcount") + 1;
		$session->set("requestcount", $count);
		yield $session->save();
	});
```
