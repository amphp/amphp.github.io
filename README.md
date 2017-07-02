# website-shared

This repository contains shared files for all documentation pages.

## Setup for a new repository

```
git submodule add https://github.com/amphp/website-shared docs/.shared
# copy .gitignore, _config.yml and Gemfile from another repository
# adjust navigation and paths in _config.yml
cd docs
bundle install --path vendor/bundle
bundle exec jekyll serve
```

## Setup for an existing repository

```
cd docs
git submodule init
git submodule update
# Optional: Update shared files
# cd .shared
# git pull
# cd -
bundle install --path vendor/bundle
bundle exec jekyll serve
```
