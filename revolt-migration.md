---
title: Upgrade Guide
description: Learn how to migrate your existing application from generator-based coroutines to fiber-based coroutines.
image: undraw/undraw_upgrade.svg
permalink: /revolt-migration
layout: docs
---
We've brought fibers into PHP 8.1, and it's time to make use of them. Amp has always been focused on synchronous feeling APIs, and fibers allow leveling-up that approach, removing all the boilerplate. 

Fibers are independent call stacks that can be cooperatively scheduled by the event loop. While generator-based coroutines need promises at every function boundary, fiber-based coroutines don't have any need like that.
They also work fine with built-in functions like `array_map`.

{:.note}
> You can read the full [Fiber RFC on wiki.php.net](https://wiki.php.net/rfc/fibers) if you're interested in the low-level details.  

{:.todo}
> We're currently in the process of releasing beta versions based on [Revolt](https://revolt.run).
> This guide is a work-in-progress.

## Event Loop

We're now using [Revolt](https://revolt.run) instead of shipping an event loop implementation with `amphp/amp`. You'll feel quite familiar with the API, as it didn't change much, except for time units being seconds instead of milliseconds.

[`Suspension`](https://revolt.run/fibers) is a new low-level API in Revolt to automatically suspend a fiber and run the event loop if needed. There's mostly no need to call `Amp\Loop::run()` anymore.

You can replace `Amp\Loop` with `Revolt\EventLoop`.

## Coroutines

Most migration work will be removing the `Amp\call` boilerplate and removing all `yield` expressions.

```php
function fetchIssues(string $url): Promise
{
    return call(function () use ($url) {
        $response = yield fetch($url);
        $body = yield $response->getBody()->buffer();
        
        return json_decode($body, true);
    });
}
```

```php
function fetchIssues(string $url): array
{
    $response = fetch($url);
    $body = $response->getBody()->buffer();
    
    return json_decode($body, true);
}
```

## Promises

`Amp\Promise` has been replaced with `Amp\Future`. They're quite similar, but `Amp\Future` provides an `await()` method that can be used anywhere to await an asynchronous result, instead of having to use `yield` and a `Generator`.

`Amp\Future` will be used a lot less often than `Amp\Promise`, as it's no longer necessary to have an `Amp\Promise` on every function boundary. `Amp\call` has been removed, as it's no longer needed.

## Deferred

`Amp\Deferred` has been renamed to `Amp\DeferredFuture`.

## Cancellations

`Amp\CancellationToken` has been renamed to `Amp\Cancellation`.