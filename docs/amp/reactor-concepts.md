---
title: Event Reactor Concepts
layout: default
---

* Table of Contents
{:toc}

## Reactor Implementations

It may surprise people to learn that the PHP standard library already has everything we need to write event-driven and non-blocking applications. We only reach the limits of native PHP's functionality in this area when we ask it to poll thousands of file descriptors for IO activity at the same time. Even in this case, though, the fault is not with PHP but the underlying system `select()` call which is linear in its performance  degradation as load increases.

For performance that scales out to high volume we require more advanced capabilities currently found only in extensions. If you wish to, for example, service 10,000 simultaneous clients in an amp-backed socket server you should use one of the event reactors based on a PHP extension. However, if you're using Amp in a strictly local program for non-blocking concurrency or you don't need to handle more than a few hundred simultaneous clients in a server application the native PHP functionality should be adequate.

Amp currently exposes two separate implementations for its standard `Reactor` interface. Each behaves exactly the same way from an external API perspective. The main differences have to do with underlying performance characteristics. The one capability that the extension-based reactors do offer that's unavailable with the native implementation is the ability to watch for process control signals. The current implementations are listed here:

| Class                 | Extension                                             |
| --------------------- | ----------------------------------------------------- |
| Amp\NativeReactor     | n/a                                                   |
| Amp\EvReactor         | [pecl/ev](https://pecl.php.net/package/ev)            |
| Amp\LibeventReactor   | [pecl/libevent](https://pecl.php.net/package/libevent)|
| Amp\UvReactor         | [php-uv](https://github.com/bwoebi/php-uv)            |


## Reactor == Task Scheduler

The first thing we need to understand to program effectively using an event loop is this:

> *The event reactor is our task scheduler.*

The reactor controls program flow as long as it runs. Once we tell the reactor to run it will
maintain control until the application errors out, has nothing left to do, or is explicitly
stopped. Consider this very simple example:

```php
<?php

function tick() {
    echo "tick\n";
}

echo "-- before run()\n";

Amp\run(function() {
    Amp\repeat("tick", $msInterval = 1000);
    Amp\once("Amp\stop", $msDelay = 5000);
});

echo "-- after run()\n";
```

Upon execution of the above example you should see output like this:

```plain
-- before run()
tick
tick
tick
tick
-- after run()
```

This output demonstrates that what happens inside the event reactor's run loop is like its own separate program. Your script will not continue past the point of `run()` unless there are no more scheduled events or `stop()` is invoked.

While an application can and often does take place entirely inside the confines of the run loop, we can also use the reactor to do things like the following example which imposes a short-lived timeout for interactive console input:

```php
<?php
$myText = null;

Amp\run(function () {
    echo "Please input some text: ";
    stream_set_blocking(STDIN, false);

    // Watch STDIN for input
    Amp\onReadable(STDIN, "onInput");

    // Impose a 5-second timeout if nothing is input
    Amp\once("Amp\stop", $msDelay = 5000);
});

function onInput($watcherId, $stream, $callbackData) {
    global $myText;
    $myText = fgets($stream);
    Amp\cancel($watcherId);
    stream_set_blocking(STDIN, true);
    Amp\stop();
}

var_dump($myText); // whatever you input on the CLI

// Continue doing regular synchronous things here.
```

Obviously we could have simply used `fgets(STDIN)` synchronously in this example. We're just demonstrating that it's possible to move in and out of the event loop to mix synchronous tasks with non-blocking tasks as needed.
