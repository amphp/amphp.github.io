This repository contains shared files for all documentation pages as well as the main website.

## Setup for a new repository

```bash
git submodule add https://github.com/amphp/amphp.github.io docs/.shared
# copy .gitignore, _config.yml and Gemfile from another repository
# adjust navigation and paths in _config.yml
cd docs
bundle install --path vendor/bundle
bundle exec jekyll serve
```

## Setup for an existing repository

```bash
cd docs
git submodule init
git submodule update
bundle install --path vendor/bundle
bundle exec jekyll serve
```
