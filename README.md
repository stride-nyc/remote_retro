[![CircleCI](https://circleci.com/gh/stride-nyc/remote_retro.svg?style=shield)](https://circleci.com/gh/stride-nyc/remote_retro)
[![Coverage Status](https://coveralls.io/repos/github/stride-nyc/remote_retro/badge.svg)](https://coveralls.io/github/stride-nyc/remote_retro?branch=master)
[![Ebert](https://ebertapp.io/github/stride-nyc/remote_retro.svg)](https://ebertapp.io/github/stride-nyc/remote_retro)

# RemoteRetro

![](https://media.giphy.com/media/xUOwGpGJcTTV3myapq/source.gif)

___




This repository houses the web application code for Remote Retro, an open source professional development project written in Elixir/Phoenix/React and sponsored by [Stride Consulting](http://stridenyc.com).

## Table of Contents
1. [Roadmap to MVP](#roadmap-to-mvp)
1. [Project Management](#project-management)
1. [Dev Environment Setup](#dev-environment-setup)
1. [Tests](#tests)
1. [Code](#code)
1. [Contributing](#contributing)
1. [Code of Conduct](#code-of-conduct)
1. [Acknowledgements](#acknowledgements)
1. [License](#license)

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
    - participants generate and assign action items
1. Action Item Distribution
    - facilitator distributes action items via email to all retro participants

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
nvm install 8.7
```

Ensure the latest node is your default node version in new shells:
```
nvm alias default 8.7
```

Install Global NPM Packages
```
npm install -g yarn phantomjs chromedriver
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

Copy the `dev.secret.exs.example` to `dev.secret.exs` and fill it out with the information Google provides. The final file should look like this:

```
use Mix.Config

config :remote_retro, :google_oauth,
  client_id: "<Client Id>",
  client_secret: "<Client Secret>",
  redirect_uri: "http://localhost:4000/auth/google/callback"

```

__Ensure that the new file is included in your `.gitignore`!__

Finally, [enable](https://console.developers.google.com/apis/api/plus.googleapis.com/overview) the Google+ API for your project.

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

To continually execute the client-side unit tests on file change, run:

```
npm run test:watch
```

## Code

To run the local eslint:

```
mix lint
```

## Contributing
[Contributing Guidelines](CONTRIBUTING.md)

## Code of Conduct
[The Contributor Covenant](CODE_OF_CONDUCT.md)

## Acknowledgements

Many thanks to the project's contributors for devoting their time, energy, and passion, and additional thanks go out to the leadership of [Stride Consulting](http://stridenyc.com) for giving this project the opportunity it needed to bloom.

## License
[MIT](LICENSE)
