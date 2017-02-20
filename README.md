[![CircleCI](https://circleci.com/gh/vanderhoop/remote_retro.svg?style=svg)](https://circleci.com/gh/vanderhoop/remote_retro)

# RemoteRetro

This repository houses the web application code for Remote Retro, an open source professional development project written in Elixir/Phoenix and sponsored by [Stride Consulting](http://stridenyc.com).

## Project Management

To see the project's current feature pipeline, simply install the wonderful [ZenHub](http://zenhub.io) Chrome Extension.

  - visit [ZenHub.io](http://zenhub.io), install the ZenHub Chrome Extension, and authorize when prompted
    - __Note:__ this installation assumes you visit zenhub.io using Chrome
  - once the extension is installed, you should be able to visit the boards by typing 'b', or, if clicking is more your speed, simply click the "Boards" tab on the repo's homepage

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

Note: if the prior two commands are throwing errors, ensure that Postgres is setup properly:
 1. Login to the default database `psql -h localhost`
 2. Check that there is a postgres usename by entering `SELECT usename from pg_user;`
 3. If there is not, enter `CREATE USER postgres WITH SUPERUSER;`

#### Node Dependencies

Install Global NPM Packages

 ```
 npm install -g yarn webpack phantomjs mocha
 ```
 
Install Local NPM Packages via Yarn

```
yarn
```

#### And Voila!

Start Phoenix endpoint with `mix`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

## Tests

To continually execute the backend unit tests on file change:

```
mix test.watch
```

To execute the end-to-end tests:

```
mix e2e
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
  
## Acknowledgements

Many thanks to the project's contributors for devoting their time, energy, and passion, and additional thanks go out to the leadership of [Stride Consulting](http://stridenyc.com) for giving this project the opportunity it needed to bloom. 
