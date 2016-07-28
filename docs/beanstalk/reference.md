---
title: API Reference
layout: docs
---

The client consists mainly of one class: [`Amp\Beanstalk\BeanstalkClient`](https://github.com/amphp/beanstalk/blob/master/src/BeanstalkClient.php).

* Table of Contents
{:toc}

## `__construct`

A new client accepts a single argument for its constructor which is the connect URI.

```php
use Amp\Beanstalk\BeanstalkClient;

$client = new BeanstalkClient("tcp://localhost:11300");
```

If you want to use this client for a separate `tube` as the default one, you can pass the tube name as query string parameter:

```php
use Amp\Beanstalk\BeanstalkClient;

$client = new BeanstalkClient("tcp://localhost:11300?tube=foobar");
```

`timeout` is the second option, which can be passed with the connect URI as query parameter. It must be an integer in milliseconds and it controls the TCP connect timeout.

All available methods are very closely modelled to the [Beanstalk protocol](https://github.com/kr/beanstalkd/blob/master/doc/protocol.txt).

## `put`

Inserts a new job into the client's currently used tube.

**Signature**

```php
function put(string $payload, int $timeout, int $delay, int $priority = 0): Promise
```

| Paramter   | Description |
|------------|-------------|
| `payload`  | A sequence of bytes.
| `timeout`  | Time to run (TTR) -- Number of seconds to allow a worker to run this job.
| `delay`    | Number of seconds to wait before putting the job in the ready queue.
| `priority` | Value between 0 and 2<sup>32</sup>-1. 0 is most urgent.

## `reserve`

Reserves a new job or waits until one is available.

**Signature**

```php
function reserve(int $timeout = null): Promise
```

| Paramter   | Description |
|------------|-------------|
| `timeout`  | A value of `null` indicates no timeout. `0` returns immediately either with a job or a `TimedOutException`. Any other integer value sets the timeout in seconds.

## `delete`

Removes a job from the server entirely.

**Signature**

```php
function delete(int $id): Promise
```

| Paramter   | Description |
|------------|-------------|
| `id`       | ID of the job to delete.

## `release`

Put a reserved job back into the ready queue.

**Signature**

```php
function release(int $id, int $delay = 0, int $priority = 0): Promise
```

| Paramter   | Description |
|------------|-------------|
| `id`       | ID of the job to release.
| `delay`    | New priority of the job, see [`put`](#put).
| `priority` | Number of seconds to wait before putting the job into the ready queue.

## `bury`

Put a job into the "buried" state.

**Signature**

```php
function bury(int $id, int $priority = 0): Promise
```

| Paramter   | Description |
|------------|-------------|
| `id`       | ID of the job to bury.
| `priority` | New priority of the job, see [`put`](#put).

## `touch`

Request more time to work on a job. The worker has now TTR seonds again to finish the job.

**Signature**

```php
function touch(int $id): Promise
```

| Paramter   | Description |
|------------|-------------|
| `id`       | ID of the job.


## `watch`

Adds the named tube to the watch list for the current connection.

**Signature**

```php
function watch(string $tube): Promise
```

| Paramter   | Description |
|------------|-------------|
| `tube`     | Name of the tube, at most 200 bytes long.

## `ignore`

Removes a named tube from the watch list of the current connection.

**Signature**

```php
function ignore(string $tube): Promise
```

| Paramter   | Description |
|------------|-------------|
| `tube`     | Name of the tube, at most 200 bytes long.
