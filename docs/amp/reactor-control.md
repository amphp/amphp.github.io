---
title: Controlling the Reactor
layout: default
---

* Table of Contents
{:toc}

## `run()`

The primary way an application interacts with the event reactor is to schedule events for execution
and then simply let the program run. Once `Reactor::run()` is invoked the event loop will run
indefinitely until there are no watchable timer events, IO streams or signals remaining to watch.
Long-running programs generally execute entirely inside the confines of a single `Reactor::run()`
call.


## `tick()`

The event loop tick is the basic unit of flow control in a non-blocking application. This method
will execute a single iteration of the event loop before returning. `Reactor::tick()` may be used
inside a custom `while` loop to implement "wait" functionality in concurrency primitives such as
futures and promises.


## `stop()`

The event reactor loop can be stopped at any time while running. When `Reactor::stop()` is invoked
the reactor loop will return control to the userland script at the end of the current iteration
of the event loop. This method may be used to yield control from the reactor even if events or
watchable IO streams are still pending.



## Timer Watchers

Amp exposes several ways to schedule timer watchers. Let's look at some details for each function ...

### `immediately()`

 - Schedule a callback to execute in the next iteration of the event loop
 - This method guarantees a clean call stack to avoid starvation of other events in the
   current iteration of the loop. An "immediately" callback is *always* executed in the next
   tick of the event loop.
 - After an "immediately" timer watcher executes it is automatically garbage collected by
   the reactor so there is no need for applications to manually cancel the associated watcher ID.
 - Like all watchers, "immediately" timers may be disabled and reenabled. If you disable this
   watcher between the time you schedule it and the time that it actually runs the reactor *will
   not* be able to garbage collect it until it executes. Therefore you must manually cancel an
   immediately watcher yourself if it never actually executes to free any associated resources.

**Example**

```php
<?php // using immediately()

Amp\run(function () {
	echo "line 1\n";
	Amp\immediately(function () {
		echo "line 3\n";
	});
	echo "line 2\n";
});
```

**Callback Signature**

`function (string $watcherId, mixed $cbData = null)`

**Applicable Options**

| Key                   | Type   |                                     |
| --------------------- | ------ | ----------------------------------- |
| `"enable"`            | bool   | All watchers are enabled by default. Passing the `"enable"` option with a falsy value will create the watcher in a disabled state. |
| `"keep_alive"`        | bool   | If no other watchers remain registered should this watcher prevent the event reactor's `run()` loop from exiting (default: true)?
| `"cb_data"`           | mixed  | Optional user data to pass as the final parameter when invoking the watcher callback. If this option is unspecified a callback receives `null` as its final argument.


### `once()`

 - Schedule a callback to execute after a delay of *n* milliseconds
 - A "once" watcher is also automatically garbage collected by the reactor after execution and
   applications should not manually cancel it unless they wish to discard the watcher entirely
   prior to execution.
 - A "once" watcher that is disabled has its delay time reset so that the original delay time
   starts again from zero once reenabled.
 - Like "immediately" watchers, a timer scheduled for one-time execution must be manually
   cancelled to free resources if it never runs due to being disabled by the application after
   creation.

**Example**

```php
<?php // using once()

Amp\run(function () {
	// event loop will stop in three seconds
	Amp\once("\Amp\stop", $msDelay = 3000);
});
```

**Callback Signature**

`function (string $watcherId, mixed $cbData = null)`

**Applicable Options**

| Key                   | Type   |                                     |
| --------------------- | ------ | ----------------------------------- |
| `"enable"`            | bool   | All watchers are enabled by default. Passing the `"enable"` option with a falsy value will create the watcher in a disabled state. |
| `"keep_alive"`        | bool   | If no other watchers remain registered should this watcher prevent the event reactor's `run()` loop from exiting (default: true)?
| `"cb_data"`           | mixed  | Optional user data to pass as the final parameter when invoking the watcher callback. If this option is unspecified a callback receives `null` as its final argument.

### `repeat()`

 - Schedule a callback to repeatedly execute every *n* millisconds.
 - Like all other watchers, "repeat" timers may be disabled/reenabled at any time.
 - Unlike `once()` and `immediately()` watchers, `repeat()` timers must be explicitly cancelled to free
   associated resources. Failure to free "repeat" watchers via `cancel()` once their purpose is fulfilled
   will result in memory leaks in your application. It is not enough to simply disable repeat watchers as their data is only freed upon cancellation.

```php
<?php // using repeat()

Amp\run(function () {
	Amp\repeat(function ($watcherId) {
		static $i = 0;
		if ($i++ < 3) {
			echo "tick\n";
		} else {
			Amp\cancel($watcherId);
		}
	}, $msInterval = 100);
});
```

**Callback Signature**

`function (string $watcherId, mixed $cbData = null)`

**Applicable Options**

| Key                   | Type   |                                     |
| --------------------- | ------ | ----------------------------------- |
| `"enable"`            | bool   | All watchers are enabled by default. Passing the `"enable"` option with a falsy value will create the watcher in a disabled state. |
| `"keep_alive"`        | bool   | If no other watchers remain registered should this watcher prevent the event reactor's `run()` loop from exiting (default: true)?
| `"cb_data"`           | mixed  | Optional user data to pass as the final parameter when invoking the watcher callback. If this option is unspecified a callback receives `null` as its final argument.
| `"ms_delay"`          | int    | Used with `repeat()` watchers to specify a different millisecond timeout for the initial callback invocation. If not specified, repeating timer watchers wait until the `$msInterval` expires before their initial invocation.



## Stream IO Watchers

Stream watchers are how we know when we can read and write to sockets and other streams. These
events are how we're able to actually *create* things like http servers and asynchronous
database libraries using the event reactor. As such, stream IO watchers form the backbone of any useful
non-blocking amp application.

There are two types of IO watchers:

 - Readability watchers
 - Writability watchers

### `onReadable()`

Watchers registered via `Reactor::onReadable()` trigger their callbacks in the following situations:

 - When data is available to read on the stream under observation
 - When the stream is at EOF (for sockets, this means the connection is broken)

A common usage pattern for reacting to readable data looks something like this example:

```php
<?php
define("IO_GRANULARITY", 32768);

function isStreamDead($socket) {
    return !is_resource($socket) || @feof($socket);
}

Amp\onReadable($socket, function($watcherId, $socket) {
    $socketId = (int) $socket;
    $newData = @fread($socket, IO_GRANULARITY);
    if ($newData != "") {
        // There was actually data and not an EOF notification. Let's consume it!
        parseIncrementalData($socketId, $newData);
    } elseif (isStreamDead($socket)) {
        Amp\cancel($watcherId);
    }
});
```

In the above example we've done a few very simple things:

 - Register a readability watcher for a socket that will trigger our callback when there is
   data available to read.

 - When we read data from the stream in our triggered callback we pass that to a stateful parser
   that does something domain-specific when certain conditions are met.

 - If the `fread()` call indicates that the socket connection is dead we clean up any resources
   we've allocated for the storage of this stream. This process should always include calling
   `Amp\cancel()` on any reactor watchers we registered in relation to the stream.

### `onWritable()`

 - Streams are essentially *"always"* writable. The only time they aren't is when their
   respective write buffers are full.

A common usage pattern for reacting to writability involves initializing a writability watcher without enabling it when a client first connects to a server. Once incomplete writes occur we're then able to "unpause" the write watcher using `Amp\enable()` until data is fully sent without having to create and cancel new watcher resources on the same stream multiple times.


## Pausing, Resuming and Cancelling Watchers

All watchers, regardless of type, can be temporarily disabled and enabled in addition to being
cleared via `Amp\cancel()`. This allows for advanced capabilities such as disabling the acceptance of new socket clients in server applications when simultaneity limits are reached. In general, the performance characteristics of watcher reuse via pause/resume are favorable by comparison to repeatedly cancelling and re-registering watchers.

### `disable()`

A simple disable example:

```php
<?php

// Register a watcher we'll disable
$watcherIdToDisable = Amp\once(function() {
    echo "I'll never execute in one second because: disable()\n";
}, $msDelay = 1000);

// Register a watcher to perform the disable() operation
Amp\once(function() use ($watcherIdToDisable) {
    echo "Disabling WatcherId: ", $watcherIdToDisable, "\n";
    Amp\disable($watcherIdToDisable);
}, $msDelay = 500);

Amp\run();
```

After our second watcher callback executes the reactor loop exits because there are no longer any enabled watchers registered to process.

### `enable()`

`enable()` is the diametric analog of the `disable()` example demonstrated above:

```php
<?php

// Register a watcher
$myWatcherId = Amp\repeat(function() {
    echo "tick\n";
}, $msDelay = 1000);

// Disable the watcher
Amp\disable($myWatcherId);

// Remember, nothing happens until the reactor runs, so it doesn't matter that we
// previously created and disabled $myWatcherId
Amp\run(function() use ($myWatcherId) {
    // Immediately enable the watcher when the reactor starts
    Amp\enable($myWatcherId);
    // Now that it's enabled we'll see tick output in our console every 1000ms.
});
```

For a slightly more complex use case, let's look at a common scenario where a server might create a write watcher that is initially disabled but subsequently enabled as necessary:

```php
<?php

class Server {
    private $clients = [];

    public function startServer() {
        // ... server bind and accept logic would exist here
        Amp\run();
    }

    private function onNewClient($sock) {
        $socketId = (int) $sock;
        $client = new ClientStruct;
        $client->socket = $sock;
        $readWatcher = Amp\onReadable($sock, function() use ($client) {
            $this->onReadable($client);
        });
        $writeWatcher = Amp\onReadable($sock, function() use ($client) {
            $this->doWrite($client);
        }, $enableNow = false); // <-- let's initialize the watcher as "disabled"

        $client->readWatcher = $readWatcher;
        $client->writeWatcher = $writeWatcher;

        $this->clients[$socketId] = $client;
    }

    // ... other class implementation details here ...

    private function writeToClient($client, $data) {
        $client->writeBuffer .= $data;
        $this->doWrite($client);
    }

    private function doWrite(ClientStruct $client) {
        $bytesToWrite = strlen($client->writeBuffer);
        $bytesWritten = @fwrite($client->socket, $client->writeBuffer);

        if ($bytesToWrite === $bytesWritten) {
            Amp\disable($client->writeWatcher);
        } elseif ($bytesWritten >= 0) {
            $client->writeBuffer = substr($client->writeBuffer, $bytesWritten);
            Amp\enable($client->writeWatcher);
        } elseif ($this->isSocketDead($client->socket)) {
            $this->unloadClient($client);
        }
    }

    // ... other class implementation details here ...
}
```

### `cancel()`

It's important to *always* cancel persistent watchers once you're finished with them or you'll create memory leaks in your application. This functionality works in exactly the same way as  the above enable/disable examples:

```php
<?php
Amp\run(function() {
    $myWatcherId = Amp\repeat(function() {
        echo "tick\n";
    }, $msInterval = 1000);

    // Cancel $myWatcherId in five seconds and exit the reactor loop
    Amp\once(function() use ($myWatcherId) {
        Amp\cancel($myWatcherId);
    }, $msDelay = 5000);
});
```

## Process Signal Watchers

The `Amp\SignalReactor` extends the base reactor interface to expose an API for handling process
control signals in your application like any other event. Simply use a compatible event reactor
implementation (`UvReactor` or `LibeventReactor`, preferably the former) and interact with its
`SignalReactor::onSignal()` method. Consider:

```php
<?php

reactor(new Amp\UvReactor)->run(function() {
    // Let's tick off output once per second so we can see activity.
    Amp\repeat(function() {
            echo "tick: ", date('c'), "\n";
    }, $msInterval = 1000);

    // What to do when a SIGINT signal is received
    $watcherId = Amp\onSignal(UV::SIGINT, function() {
        echo "Caught SIGINT! exiting ...\n";
        exit;
    });
});
```

As should be clear from the above example, signal watchers may be enabled, disabled and cancelled like any other event.

## Reactor Addenda

### Optional Watcher Settings

| Option              | Description                                       |
| ------------------- | --------------------------------------------------|
| `"enable"`          | All watchers are enabled by default. Passing the `"enable"` option with a falsy value will create a watcher in a disabled state. |
| `"ms_delay"`        | Used with `repeat()` watchers to specify a different millisecond timeout for the initial callback invocation. If not specified, repeating timer watchers wait until the `$msInterval` expires before their initial invocation. |
| `"callback_data"`   | Optional user data to pass as the final parameter when invoking the watcher callback. If this option is unspecified a callback receives `null` as its final argument. |

### Watcher Callback Parameters

Watcher callbacks are invoked using the following standardized parameter order:

| Watcher Type            | Callback Signature                                    |
| ----------------------- | ------------------------------------------------------|
| `immediately()`         | `function(string $watcherId, $callbackData)`          |
| `once()`                | `function(string $watcherId, $callbackData)`          |
| `repeat()`              | `function(string $watcherId, $callbackData)`          |
| `onReadable()`          | `function(string $watcherId, $stream, $callbackData)` |
| `onWritable()`          | `function(string $watcherId, $stream, $callbackData)` |
| `onSignal()`            | `function(string $watcherId, $signo, $callbackData)`  |


### Watcher Cancellation Safety

It is always safe to cancel a watcher from within its own callback. For example:

```php
<?php
$increment = 0;
Amp\repeat(function($watcherId) use (&$increment) {
    echo "tick\n";
    if (++$increment >= 3) {
        Amp\cancel($watcherId); // <-- cancel myself!
    }
}, $msDelay = 50);
```

### An Important Note on Writability

Because streams are essentially *"always"* writable you should only enable writability watchers
while you have data to send. If you leave these watchers enabled when your application doesn't have
anything to write the watcher will trigger endlessly until disabled or cancelled. This will max out
your CPU. If you're seeing inexplicably high CPU usage in your application it's a good bet you've
got a writability watcher that you failed to disable or cancel after you were finished with it.

A standard pattern in this area is to initialize writability watchers in a disabled state before subsequently enabling them at a later time as shown here:

```php
<?php

$options = ["enable" => false];
$watcherId = Amp\onWritable(STDOUT, function(){}, $options);
// ...
Amp\enable($watcherId);
// ...
Amp\disable($watcherId);
```


### Process Signal Number Availability

Using the `SignalReactor` interface is relatively straightforward with the php-uv extension because
it exposes `UV::SIG*` constants for watchable signals. Applications using the `LibeventReactor` to
will need to manually specify the appropriate integer signal numbers when registering signal watchers.


[libevent]: http://pecl.php.net/package/libevent "libevent"
[win-libevent]: http://windows.php.net/downloads/pecl/releases/ "Windows libevent DLLs"


### Timer Drift

@TODO Discuss how repeating timer watchers are rescheduled from `$timestampAtTickStart + $watcherMsInterval` and are not subject to drift but *may* stack up if executing very slow tasks with insufficiently low intervals in-between invocations.

### Avoiding Memory Leaks

@TODO Discuss cancelling persistent watchers (i.e. repeat/onReadable/onWritable)
