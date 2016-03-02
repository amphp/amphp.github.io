#!/usr/bin/env bash

# Jekyll 3.0 doesn't support escaped slashes…
curl -s "https://packagist.org/search.json?tags=amphp" | sed 's/\\\//\//g' > _data/tagged.json
