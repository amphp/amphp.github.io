---
title: Logging in Aerys
description: Aerys is a non-blocking HTTP/1.1 application / websocket / static file server.
title_menu: Logging
layout: default
---

* Table of Contents
{:toc}

Aerys includes a logger that can be used to `STDOUT`. While being in production mode Aerys uses multiple workers, so all log data is sent to the master process and logged to `STDOUT` there.

In order to receive an [`Aerys\Logger`](https://github.com/amphp/aerys/blob/master/lib/Logger.php) instance, you have to implement [`Aerys\Bootable`](https://github.com/amphp/aerys/blob/master/lib/Bootable.php) and add it to a host by calling `$host->use($bootable)`. As soon as the server boots up, `boot` will be called and you'll be able to use the logger.
