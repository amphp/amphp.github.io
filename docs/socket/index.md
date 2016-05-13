---
title: Sockets in Amp
description: Amp is a non-blocking concurrency framework for PHP applications.
title_menu: Introduction
layout: docs
---

* Table of Contents
{:toc}

## Requirements

 - PHP 5.5+

> **Note for PHP 5.5**: If you are using PHP 5.5, we ship with our own certificate bundle, since PHP 5.5 doesn't use the systems trust store yet. Our default trust store doesn't include any 1024-bit root certificates. Due to a bug in OpenSSL 1.0.1 (and lower), certificates with a root, which is signed by another 1024-bit root, will fail to validate as the signing 1024-bit root is not in the trust store. See also the [release notes for v0.9.6](https://github.com/amphp/socket/releases/tag/v0.9.6).
>
> Linux distributions might have backported alternate trust chains for your OS, e.g. Ubuntu did.

## Installation

```bash
composer require amphp/socket
```

## Reference

### `listen`

```php
function listen(string $address): resource
```

Listen for client connections on the specified server address.

### `connect`

```php
function connect(string $uri, array $options = []): Promise
```

Asynchronously establish a socket connection to the specified URI. If no scheme is specified in the URI parameter, TCP is assumed. Allowed schemes include: `tcp`, `udp`, `unix`, `udg`. A [list of available `$options`](http://php.net/manual/en/context.php) is available in the PHP manual.

### `cryptoConnect`

```php
function cryptoConnect($uri, array $options = []): Promise
```

Asynchronously establish an encrypted TCP connection (non-blocking). A [list of available `$options`](http://php.net/manual/en/context.php) is available in the PHP manual.

### `cryptoEnable`

```php
function cryptoEnable($socket, array $options = []): Promise
```

Enable encryption on an existing socket stream. A [list of available `$options`](http://php.net/manual/en/context.php) is available in the PHP manual.

### `cryptoDisable`

```php
function cryptoDisable($socket)
```

Disable encryption on an existing socket stream.
