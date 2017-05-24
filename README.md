[![CircleCI](https://circleci.com/gh/stride-nyc/remote_retro.svg?style=shield)](https://circleci.com/gh/stride-nyc/remote_retro)
[![Coverage Status](https://coveralls.io/repos/github/stride-nyc/remote_retro/badge.svg?branch=master)](https://coveralls.io/github/stride-nyc/remote_retro?branch=master)
[![Ebert](https://ebertapp.io/github/stride-nyc/remote_retro.svg)](https://ebertapp.io/github/stride-nyc/remote_retro)

# RemoteRetro

This repository houses the web application code for Remote Retro, an open source professional development project written in Elixir/Phoenix and sponsored by [Stride Consulting](http://stridenyc.com).

## Roadmap to MVP

The MVP aims to provide a collaborative, real-time, facilitator-driven retrospective through the following stages:

1. [The Retrospective Prime Directive](http://www.retrospectives.com/pages/retroPrimeDirective.html)
    - frame the retro as a safe, collaborative space
1. Idea Generation
    - invite ideas (happy, sad, confused) from participants
1. Mute Mapping
    - participants group ideas into categories without speaking
1. Labeling + Voting
    - participants vote on categories for discussion and root-cause analysis
1. Action Item Generation
    - Identify and assign action items
1. Action Item Distribution
    - Distribute action items via email
    
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
  - Compile the project and custom mix tasks via `mix compile`
  - Create the "remote_retro_dev" database and migrate via `mix ecto.create && mix ecto.migrate`
    -  __Note:__ if the prior two commands are throwing errors, ensure that Postgres is setup properly on your machine:
     1. Login to the default database `psql -h localhost`
     2. Verify that username "postgres" exists with `SELECT usename from pg_user;`
     3. If not found, then run `CREATE USER postgres WITH SUPERUSER;`

#### Node Dependencies

Install nvm (node version manager):

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
```
__Note:__ additional nvm installation notes found at [the nvm repo](https://github.com/creationix/nvm#install-script).

Install the latest node via nvm:
```
nvm install 7.5
```

Ensure the latest node is your default node version in new shells:
```
nvm alias default 7.5
```

Install Global NPM Packages
```
npm install -g yarn phantomjs mocha
```

Install Local NPM Packages via Yarn
```
yarn
```

#### Google OAuth

Authentication within Remote Retro relies on Google OAuth and the Google+ API.  To set this up, navigate to the Google API console and create a new project: https://console.developers.google.com/apis

Next, click on "Credentials" in the left sidebar nav. On the right hand side, click on the "Create Credentials" button and select "OAuth client ID".

**Settings**
- Application type: Web application
- Authorized JavaScript origins: `http://localhost:4000`
- Authorized redirect URIs: `http://localhost:4000/auth/google/callback`

Click on the Create button. Using the information Google provides, add the following lines to your profile and source (or open a new terminal).
```
export REMOTE_RETRO_GOOGLE_OAUTH_CLIENT_ID="<Client Id>"
export REMOTE_RETRO_GOOGLE_OAUTH_CLIENT_SECRET="<Client secret>"
export REMOTE_RETRO_GOOGLE_OAUTH_REDIRECT_URI="http://localhost:4000/auth/google/callback"
```

Finally, enable the Google+ API for your project.

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
