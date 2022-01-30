---
title: Architecture
description: Learn how to manage multiple coroutines, coordinate between them, and how to cancel pending operations.
image: undraw/undraw_city_life.svg
permalink: /architecture
layout: docs
---

Concurrent PHP applications use multiple independent call stacks called coroutines. They're cooperatively scheduled by the [event-loop](https://revolt.run) and based on fibers in PHP.
It's important to understand that only one coroutine is running at any given time, all other coroutines are suspended in the meantime.
Coroutines don't run in parallel, they run concurrently. Any blocking function blocks the entire process instead of suspending a single coroutine, so you'll want to avoid them.
If you haven't read the installation guide, have a look at the [Hello World example](/installation#hello-world) that demonstrates the effect of blocking functions.

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