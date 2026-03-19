# RemoteRetro

[![CircleCI](https://circleci.com/gh/stride-nyc/remote_retro.svg?style=shield)](https://circleci.com/gh/stride-nyc/remote_retro)
[![Coverage Status](https://coveralls.io/repos/github/stride-nyc/remote_retro/badge.svg)](https://coveralls.io/github/stride-nyc/remote_retro?branch=master)

This repository houses the application code for [RemoteRetro.org](http://remoteretro.org), a free web app that allows distributed teams to conduct Agile retrospectives. It is written in Elixir/Phoenix/React/Redux, and is sponsored by [Stride Consulting](https://www.stride.build).

!!! Important: For development, use the development branch. If you are testing a change and want to deploy to staging, push a commit to staging.

## Current problem(s) with remote retro

Right now the highest priority fix is to get production deployments working again. After that, the priority should be to setup a staging environment to test changes before they are deployed to prod.

Currently the produciton CICD pipeline is broken, and there is a chance to accomplish two priorities at the same time by fixing the staging CICD pipeline and hopefully that'll fix the production CICD pipeline.

Note that the staging environment in Gigalixir cannot be accessed via url, it redirects to bitsaber.io. No one knows why that domain is not longer working and you cannot access the staging environment directly by visiting remote-retro-staging.gigalixirdns.com.

### Possible Causes

When a change is pushed to master, the CICD process breaks for different reasons for when we push a change to the staging pipeline.

Any commits pushed from the master branch will deploy a "staging" job. Here is the second latest run on circleCI broke because of an unknown command called info. I removed the info line in the "./compile" fild and now it breaks because 'the server doesn't have a resource type "pods"'. Why does that error show up is a good question because there's no mention of the word pods in this codebase.

Any commits pushed from the staging branch will deploy a "deploy-staging" job. That job does not complete because when that CICD job is triggered, it pushes to Gigalixier's git repo, which triggers a pre-commit hook, which builds the repo's dockerfile. The dockerfile builds locally but in circleCI's CICD pipeline it says 404 cannot find yarn.

Note that I removed an elixir dependancy named brotli, the intent was to fix the staging pipeline first, and then reintroduce that dependancy after both the staging and production CICD pipeline is fixed.

## Running Remote Retro

### Running with devContainers

DevContainers is a way to quickly setup Remote Retro to run on your machine for development. The main difference betwen this and running with docker is that devContainers are used for development and Docker is meant to run in production.

If you are using VS Code:

First, create a .env file with `cp .env-sample .env`. Note that you'll want to do this before you run the devContainer

Follow the steps in the [Setup Google Cloud](#setup-google-cloud) section below.

Then reopen VS Code and you should see a pop-up to prompt you to "reopen the project in a dev container". You can also use ctrl + shift + p and search for "reopen the project in a dev container".

Lastly, you'll just need to run the app in the terminal. Skip to [And Voila](#and-voila)
to run the app and visit the Dev url.

### Running with Docker

First, create a .env file with `cp .env-sample .env`.

Follow the steps in the [Setup Google Cloud](#setup-google-cloud) section below.

_Note: When running the project using docker, remember to use `docker-compose exec <command>` to run commands._

- Start: `docker-compose up -d`
- Stop: `docker-compose down`

While Docker compose is running, you can open the app at <http://localhost:4000>.

_Note: If running into issues running the app using Docker, ensure the `hostname` in `config/dev.exs` is `db`_

### Running locally

First, create a .env file with `cp .env-sample .env`.

Follow the steps in the [Setup Google Cloud](#setup-google-cloud) section below.

#### PostgreSQL

- Install [Homebrew](http://brew.sh/)
  - **Note:** You'll be prompted to install the command-line developer tools. Do it.
- Install PostgreSQL via Homebrew:

```bash
brew install postgresql
  # (follow directions supplied by brew output upon successful installation)
createdb
# depending on how you installed postgres, this user may already exist
createuser -s postgres
# make sure you can log in to default database
psql -h localhost
```

#### Elixir/Phoenix Dependencies

- Install erlang - `brew install erlang`
- Install elixir 1.16
  - Install kiex (elixir version manager) - `curl -sSL https://raw.githubusercontent.com/taylor/kiex/master/install | bash -s`
  - Install elixir 1.16 - `kiex install 1.16.0`
  - Setup your shell to use elixir 1.16 - `kiex use 1.16.0-27`
    - Or instead use `kiex default 1.16.0-27`
- Install openssl (version 1.1) using brew `brew install openssl@1.1`
- Add the exilir package manager using mix `mix local.hex`
- Add erlang compilation tools using mix `mix local.rebar`
- Get dependencies - `mix deps.get`
- Create the "remote_retro_dev" database and migrate
  ```
  mix ecto.create
  mix ecto.migrate
  ```
- Create the "remote_retro_test" database and migrate
  ```
  MIX_ENV=test mix ecto.create
  MIX_ENV=test mix ecto.migrate
  ```

_Note: If running into issues running the app locally, ensure the `hostname` in `config/dev.exs` is `localhost`_

#### Node Dependencies

- Install nvm using brew `brew install nvm`
- Install and use node (version 24.14.0) using nvm `nvm install 24.14.0 && nvm use 24.14.0`
- Enable corepack to get yarn - `corepack enable`
- Install dependencies - `yarn install`

#### And Voila

Start Phoenix endpoint with `mix`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

## Setup Google Cloud

Authentication within Remote Retro relies on Google OAuth and the Google+ API.
You will need to follow these instructions to run Remote Retro on your machine.

### Setup OAuth Credentials

- Open [Google API Console](https://console.developers.google.com/apis)
- Create a project
- Click "Credentials" in the left sidebar nav
- Click on the "Create Credentials" button and select "OAuth client ID".
- Fill the form:
  - Application type: Web application
  - Authorized JavaScript origins: `http://localhost:4000`
  - Authorized redirect URIs: `http://localhost:4000/auth/google/callback`
- Click the "Create" button
- Copy the "Client ID" and "Client secret" into the .env file

Source the environment file using `source .env`.

Finally, [enable](https://console.developers.google.com/apis/api/plus.googleapis.com/overview) the Google+ API for your project.

## Tests

To continually execute the backend unit tests on file change:

```bash
mix test.watch
```

To execute the backend unit tests manually:

```bash
mix test
```

To execute the end-to-end tests:

```bash
mix e2e
```

To continually execute the client-side unit tests on file change:

```bash
yarn test:watch
```

To execute the client-side unit tests manually:

```bash
yarn test
```

## Code

To run the local eslint:

```bash
mix lint
```

## Contributing

[Contributing Guidelines](CONTRIBUTING.md)

## Code of Conduct

[The Contributor Covenant](CODE_OF_CONDUCT.md)

## Common Issues

**Running into issues creating and migrating the databases**
Check the `hostname` in `config/dev.exs`. If running locally, you will want to ensure it is set to `localhost`. If running with Docker, you will want it to be set to `db`.

## Acknowledgements

Many thanks to the project's contributors for devoting their time, energy, and passion, and additional thanks go out to the leadership of [Stride Consulting](https://www.stride.build) for giving this project the opportunity it needed to bloom.

## License

[MIT](LICENSE)
