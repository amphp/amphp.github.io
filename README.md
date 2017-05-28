# website-shared

This repository contains shared files for all documentation pages.

## Setup

```
git submodule add https://github.com/amphp/amp docs/.shared
# copy .gitignore, _config.yml and Gemfile from another repository
# adjust navigation and paths in _config.yml
cd docs
bundle install --path vendor/bundle
bundle exec jekyll serve
```
