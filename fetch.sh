#!/usr/bin/env bash

mkdir -p _data
curl -s "https://packagist.org/search.json?tags=amphp" > _data/tagged.json
