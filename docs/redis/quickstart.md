---
title: Quickstart
layout: docs
---

For normal communication with the Redis server, there's the `Amp\Redis\Client` class. It expects a connection URI as single parameter.

```php
$client = new Amp\Redis\Client("tcp://localhost:6379");
```

## Configuration

Sometimes you need additional parameters like a password for authentication or a custom connect timeout setting. You can pass these options as query string parameters, just like you do on the web for HTTP requests:

```php
$client = new Amp\Redis\Client("tcp://localhost:6379?password=secret&timeout=3000");
```

### Available Options

| Option     | Description | Default |
|------------|-------------|---------|
| `password` | Password for authentication | no password |
| `timeout`  | Connect timeout in milliseconds | `1000` ms
| `database` | Database to use, usually `0`-`16` are available | `0` |

> **Note**: Before `v0.2.3` there was a second optional array parameter, having the option as key and the value as value. This has been deprecated in `v0.2.4` and will be removed in `v0.3.0`.

## Connection

If the connection is lost due to a network error, Redis being restarted or inactivity, the client automatically reconnects once a new command is executed.

## Example

```php
Amp\run(function () {
    $client = new Amp\Redis\Client("tcp://localhost:6379");

    // First command, connects before the command is executed.
    // It returns an Amp\Promise which we can wait on using `yield`.
    yield $client->set("foo", "21");

    // Increments the value and gets the result. Again, we wait for the
    // returned Amp\Promise using `yield`. We're PHP 5.6 compatible here,
    // with PHP 7 you can drop the parenthesis around `yield`.
    $result = (yield $client->incr("foo", 21));
    var_dump($result); // prints int(42)
});
```
