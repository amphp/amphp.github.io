# amphp.org

## Setting up your local Jekyll environment

Follow the instructions on [help.github.com](https://help.github.com/articles/using-jekyll-with-pages/). If the third step fails, try installing `ruby-dev`.

```bash
$ sudo apt-get install ruby-dev
```

## Quickstart

```bash
$ sudo gem install bundler
```

```bash
$ git clone git@github.com:amphp/amphp.github.io amphp/docs
$ cd amphp/docs
$ bundle install
$ bundle exec jekyll serve
```

### Alternatively using Docker

> **NOTE:** Don't commit your work while Docker runs, otherwise `Gemfile` will be renamed to `Gemfile.docker`!

```bash
docker run --name=jekyll -v=$(pwd):/srv/jekyll -ti -p 127.0.0.1:4000:4000 jekyll/jekyll:pages
```

Next time you can just use `docker start jekyll` / `docker stop jekyll` to start /stop it again.
