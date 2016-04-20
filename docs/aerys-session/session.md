---
title: Aerys\Session class
description: Aerys\Session is a session module to be used with Aerys
title_menu: Session class
layout: docs
---

* Table of Contents
{:toc}

If an [`aerys\session() middleware`](middleware.html) is present, a Session instance can be created via `new Aerys\Session($request)` where `$request` is an instance of [`Aerys\Request`](../aerys/classes/request.html).

A Session typically can exist in three states:

- locked: you hold a lock (= no other request can read from or write to it) on the session and can write to it
- unlocked: you can read from the session, but not write to it
- pending: a lock is waiting to be acquired; all operations (except `unlock()`) will throw an `Aerys\Session\LockException`

## `has(string|int $key): boolean`

Returns a boolean whether the key exists.

## `get(string|int $key)`

Returns the value, defaults to `null`.

## `set(string|int $key, $value)`

Sets a value, only accessible in locked state.

## `open(): Amp\Promise`

Reads a session with a lock. Returns a Promise which resolves to `$this` after the session has been read and the lock acquired.

This function puts the Session in pending state. No operations (except `unlock()`) can be done until the Promise is resolved.

## `read(): Amp\Promise`

Reads a session without any locking. Returns a Promise which resolves to `$this` after the session has been read.

Before the returned Promise is resolved, `has()` and `get()` will operate on old data.

## `save(): Amp\Promise`

Stores and unlocks the session. Session needs to be in locked state for this operation. Returns a Promise which resolves to `$this` after the session has been saved.

This function puts the Session in pending state. No operations can be done until the Promise is resolved.

> **Note**: When writing of the session fails, the old contents are reloaded into the session.

## `unlock(): Amp\Promise`

Discards eventually set data, unlocks the session and rereads the old contents. Returns a Promise which resolves to `$this` after the session has been read.

This function puts the Session in pending state. No operations can be done until the Promise is resolved.

## `regenerate(): Amp\Promise`

Allocates a new session id with current data and removes the old one. Session needs to be in locked state for this operation. Returns a Promise which resolves to `$this` after the session is has been regenerated.

## `destroy(): Amp\Promise`

Removes the session data, discards the current session id and sets state to unlocked. Returns a Promise which resolves to `$this` after the session has been destroyed.

## `setTTL(int $ttl = -1)`

Overrides the configured time to live for this session.