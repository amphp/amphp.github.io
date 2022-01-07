---
title: Installation
permalink: /installation
layout: docs
---

It may surprise people to learn that the PHP standard library already has everything we need to write event-driven and
non-blocking applications. PHP 8.1 ships with fibers built-in, but users on PHP 8.0 can
install [`ext-fiber`](https://github.com/amphp/ext-fiber) with almost identical behavior.

Our packages can be installed as [Composer](https://getcomposer.org/) dependencies on PHP 8 and later, e.g.

```sh
composer require amphp/amp
```

## Dependencies

Transitive dependencies of our packages are not part of the public API.
If you make use of transitive dependencies, declare them also in the `composer.json` file of your own package.

{:.note}
> [`composer-require-checker`](https://github.com/maglnet/ComposerRequireChecker) helps you finding packages you implicitly rely on.

In addition to fibers, our packages heavily rely on the [Revolt](https://revolt.run) event-loop for scheduling concurrent operations.
If you want to schedule low-level events instead of using higher-level abstractions, such as timers or I/O callbacks, you should declare a
dependency on the Revolt event-loop for your package.

```sh
composer require revolt/event-loop
```

{:.small-hint}
Applications with many concurrent file descriptors require one of the [extensions](https://revolt.run/extensions).

## Hello World

Let's start into the world of concurrent PHP with an example that illustrates important aspects.
We will print a greeting message to our console, but instead of printing the whole message at once, we'll use two coroutines to print the message in chunks with delays. 

```php
<?php // hello-world.php

require __DIR__ . '/vendor/autoload.php';

use Amp\Future;
use function Amp\async;
use function Amp\delay;

$future1 = async(function () {
    echo 'Hello ';

    // delay() is a non-blocking version of PHP's sleep() function,
    // which only pauses the current fiber instead of blocking the whole process.
    delay(2);

    echo 'the future! ';
});

$future2 = async(function () {
    echo 'World ';

    // Let's pause for only 1 instead of 2 seconds here,
    // so our text is printed in the correct order.
    delay(1);

    echo 'from ';
});

// Our functions have been queued, but won't be executed until the event-loop gains control.
echo "Let's start: ";

// Awaiting a future outside a fiber switches to the event loop until the future is complete.
// Once the event loop gains control, it executes our already queued functions we've passed to async()
$future1->await();
$future2->await();

echo PHP_EOL;
```

```plain
Let's start: Hello World from the future!
```

We've seen that we can pause a coroutine for some time, and while we're waiting, another coroutine can run and make use of the CPU.
We have used `Amp\delay` instead of PHP's `sleep` function to avoid blocking the whole process.

But what does blocking the whole process look like?
Try swapping the `delay` calls with `sleep` calls and run the example again, you'll observe different behavior!
This happens, because blocking functions block the whole process instead of letting other coroutines run while waiting.
Blocking functions include `sleep`, `usleep`, `fwrite`, `fread` and most other built-in functions doing I/O.

{:.warning}
> It's important to avoid using blocking functions in concurrent code, such as `sleep`, `usleep`, `fwrite`, `fread` and other built-in functions doing I/O.
> We offer a great variety of non-blocking I/O implementations you can use instead.

Let's dig a bit deeper into the [architecture of concurrent applications](/architecture).