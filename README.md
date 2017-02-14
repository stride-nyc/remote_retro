[![CircleCI](https://circleci.com/gh/vanderhoop/remote_retro.svg?style=svg)](https://circleci.com/gh/vanderhoop/remote_retro)

# RemoteRetro

## Dev Environment Setup

#### PostgreSQL

- Install [Homebrew](http://brew.sh/)
  - __Note:__ You'll be prompted to install the command-line developer tools. Do it.
- Install PostgreSQL via Homebrew:

```
brew install postgresql

# start postgresql at login
ln -sfv /usr/local/opt/postgresql/*.plist ~/Library/LaunchAgents
# load postgresql now
launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist

initdb /usr/local/var/postgres -E utf8
createdb

# make sure you can log in to default database
psql -h localhost
```

#### Elixir/Phoenix Dependencies
  - [Install Elixir](http://elixir-lang.org/install.html)
  - Install the Phoenix application's dependencies via `mix deps.get`
  - Create and migrate your database with `mix ecto.create && mix ecto.migrate`

#### Node Dependencies
  - Install the yarn package manager for sane node package management `npm install -g yarn`
  - Global installs
    - Webpack for futuristic asset management: `yarn global add webpack`
    - PhantomJS for headless browser testing: `yarn global add phantomjs`
    - Mocha for JS unit test executable: `yarn global add mocha`
  - Local
    - `yarn`

#### And Voila!

Start Phoenix endpoint with `mix`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

## Tests

To continually execute the backend tests on file change:

```
mix test.watch
```

To continually execute the client-side unit tests, run:

```
mocha --watch
```

## Code

To run the local eslint:

```
mix lint
```

## Project Management

Initially, we will be using ZenHub as our project management tool

- Installation
  - visit [ZenHub.io](http://zenhub.io), install the ZenHub Chrome Extension, and authorize when prompted
    - __Note:__ this installation assumes you visit zenhub.io using Chrome
  - once the extension is installed, you should be able to visit the boards by typing 'b', or, if clicking is more your speed, simply click the "Boards" tab on the repo's homepage (it should be fourth from the left)
