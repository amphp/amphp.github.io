---
title: Aerys\Session
description: Aerys\Session is a session module to be used with Aerys.
title_menu: Session class
layout: docs
---

* Table of Contents
{:toc}

If an [`Aerys\session()` middleware](middleware.html) is present, a `Session` instance can be created using `new Aerys\Session($request)` where `$request` is an instance of [`Aerys\Request`](../aerys/classes/request.html).

A `Session` can be in one of three states at any time:
- `unlocked` - as long as the session isn't locked, it's in read-only mode
- `locked` - exclusively locked (no other request can lock it) and writeable; always up-to-date, because data is read after the lock is acquired
- `pending` - a lock is waiting to be acquired or to be released; all operations (except `unlock()`) will throw an `Aerys\Session\LockException`

## `has(string $key): boolean`

Returns a boolean whether the key exists.

## `get(string $key): mixed`

Returns the value, defaults to `null`.

## `set(string $key, $value): void`

Sets a value, only invokeable in locked state.

## `open(): Amp\Promise`

Reads a session with a lock. Returns a promise which resolves to `$this` after the session has been read and the lock acquired.

This function puts the session in pending state. No operations (except `unlock()`) can be done until the promise is resolved.

## `read(): Amp\Promise`

Reads a session without any locking. Returns a promise which resolves to `$this` after the session has been read.

Before the returned promise is resolved, `has()` and `get()` will operate on old data.

## `save(): Amp\Promise`

Stores and unlocks the session. Session needs to be in locked state for this operation. Returns a promise which resolves to `$this` after the session has been saved.

This function puts the session in pending state. No operations can be done until the promise is resolved.

> **Note**: When writing of the session fails, the old contents are reloaded into the session.

## `unlock(): Amp\Promise`

Discards eventually set data, unlocks the session and rereads the old contents. Returns a Promise which resolves to `$this` after the session has been read.

This function puts the session in pending state. No operations can be done until the promise is resolved.

## `regenerate(): Amp\Promise`

Allocates a new session ID with the current data and removes the old one. Session needs to be in locked state for this operation. Returns a promise which resolves to `$this` after the session ID is has been regenerated.

## `destroy(): Amp\Promise`

Removes the session data, discards the current session ID and sets state to unlocked. Returns a promise which resolves to `$this` after the session has been destroyed.

## `setTTL(int $ttl = -1)`

Overrides the configured time to live for this session.
