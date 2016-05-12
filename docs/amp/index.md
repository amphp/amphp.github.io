---
title: Getting Started with Amp
description: Amp is a non-blocking concurrency framework for PHP applications.
title_menu: Installation
layout: docs
---

First step when getting started with `amphp/amp` is installing it. `amphp/amp` doesn't require any extensions for its core functionality. You can just add it as a dependency to your `composer.json` file or run `composer require amphp/amp`.

```json
{
    "require": {
        "amphp/amp": "^1"
    }
}
```

## Minimum PHP Version

`amphp/amp` requires PHP 5.5+, other packages might require 5.6+ or 7.0+.

## Optional Extension Backends

Extension backends are optional, but may lead to better performance with a lot of concurrent socket connections.

- [ev](https://pecl.php.net/package/ev)
- [libevent](https://pecl.php.net/package/libevent)
- [php-uv](https://github.com/bwoebi/php-uv) (experimental fork, requires PHP 7)

## Versioning

`amphp/amp` follows the [semver](http://semver.org/) semantic versioning specification like all other `amphp` packages.

## Blog Posts

In addition to this documentation, you might find the following blog posts interesting:

 - [Getting Started with Amp](http://blog.kelunik.com/2015/09/20/getting-started-with-amp.html)

<div class="tutorial-next">
    Continue with <a href="./reactor-concepts.html">Reactor Concepts</a>.
</div>
