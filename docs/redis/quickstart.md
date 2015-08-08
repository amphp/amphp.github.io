---
title: Quickstart
layout: default
---

* Table of Contents
{:toc}

---

```php
Amp\run(function () {
    $client = new Amp\Redis\Client("tcp://localhost:6379");
    yield $client->set("foo", "21");
    $result = yield $client->incr("foo", 21);
    var_dump($result); // int(42)
});
```
