---
title: Logging in Aerys
description: Aerys is a non-blocking HTTP/1.1 and HTTP/2 application / websocket / static file server.
title_menu: Introduction
layout: tutorial
---

Aerys follows the PSR-3 standard for logging.

By default Aerys uses the warning level by default as minimum - in debug mode it uses the debug level. It is possible to specify any default minimum log level via the `--log` command line option. E.g. `--log info`, which will log everything, except debug level logs.

All logging output is sent to the STDOUT of the master process; thus, to log to a file, all needed is piping the output of the master process to the file.

Additionally, use of ANSI colors (for nicer displaying in terminal) can be turned on or off via `--color on` respectively `--color off`.