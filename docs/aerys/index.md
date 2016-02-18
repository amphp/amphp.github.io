---
title: Aerys
description: Aerys is a non-blocking HTTP/1.1 and HTTP/2 application / websocket / static file server.
title_menu: Introduction
layout: default
---

* Table of Contents
{:toc}

`amphp/aerys` is a non-blocking HTTP/1.1 and HTTP/2 application, websocket and static file server written in PHP.

> **Note:** For developing you may want to use the `-d` flag on command line, the productive default may not be very developer friendly.

**Required PHP Version**

- PHP 7

**Optional Extension Backends**

- [ev](https://pecl.php.net/package/ev)
- [libevent](https://pecl.php.net/package/libevent)
- [php-uv](https://github.com/bwoebi/php-uv) (experimental fork)

**Current Stable Version**

Though Aerys has been iterated on for quite a while, there are no official tagged releases (yet). APIs are still subject to small changes and you may run into rogue <s>bugs</s> features. We love PRs, though :-)

**Installation**

```bash
$ composer require amphp/aerys
```

**Blog Posts**

 - [Getting Started with Aerys](http://blog.kelunik.com/2015/10/21/getting-started-with-aerys.html)
 - [Getting Started with Aerys WebSockets](http://blog.kelunik.com/2015/10/20/getting-started-with-aerys-websockets.html)
