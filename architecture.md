---
title: Architecture
description: Learn how manage multiple coroutines, coordinate between them, and how to cancel pending operations.
image: undraw/undraw_city_life.svg
permalink: /architecture
layout: docs
---

Concurrent PHP applications use multiple coroutines. They're cooperatively scheduled by the [event-loop](https://revolt.run) and baked by fibers.
It's important to understand that only one coroutine is running at any given time, all other coroutines are suspended in the meantime.
Coroutines don't run in parallel, they run concurrently. Any blocking function blocks the entire process instead of suspending a single coroutine, so you'll want to avoid them, see [Hello World](/installation#hello-world).

{:.todo}
> Add diagram with different fibers.

## Top-Level Await

```php
Amp\Future::await();
```

## Running to Completion

```php
Revolt\EventLoop::run();
```