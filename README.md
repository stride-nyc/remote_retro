# RemoteRetro

[![CircleCI](https://circleci.com/gh/stride-nyc/remote_retro.svg?style=shield)](https://circleci.com/gh/stride-nyc/remote_retro)
[![Coverage Status](https://coveralls.io/repos/github/stride-nyc/remote_retro/badge.svg)](https://coveralls.io/github/stride-nyc/remote_retro?branch=master)

This repository houses the application code for [RemoteRetro.org](http://remoteretro.org), a free web app that allows distributed teams to conduct Agile retrospectives. It is written in Elixir/Phoenix/React/Redux, and is sponsored by [Stride Consulting](https://www.stride.build).

## Table of Contents

1. [Dev Environment Setup](#dev-environment-setup)
1. [Tests](#tests)
1. [Code](#code)
1. [Contributing](#contributing)
1. [Code of Conduct](#code-of-conduct)
1. [Acknowledgements](#acknowledgements)
1. [License](#license)

## Dev Environment Setup

### PostgreSQL

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

- Install Elixir and its dependencies by running `bin/install_elixir_with_dependencies`
- Create the "remote_retro_dev" database and migrate via `mix ecto.create && mix ecto.migrate`
- Create the "remote_retro_test" database and migrate via `MIX_ENV=test mix ecto.create && mix ecto.migrate`

#### Node Dependencies

- Install the project's Node version and Node dependencies by running `bin/install_node_with_dependencies`

#### Google OAuth

Authentication within Remote Retro relies on Google OAuth and the Google+ API. To set this up, navigate to the Google API console and create a new project: <https://console.developers.google.com/apis>

Next, click on "Credentials" in the left sidebar nav. On the right hand side, click on the "Create Credentials" button and select "OAuth client ID".

##### Settings

- Application type: Web application
- Authorized JavaScript origins: `http://localhost:4000`
- Authorized redirect URIs: `http://localhost:4000/auth/google/callback`

Click on the Create button. Using the information Google provides, add the following lines to your profile and source (or open a new terminal).

Copy sample environment file to the environment file ```cp .env-sample .env```.

Set the google oauth values in the environment file to the client ID and client secret.

Source the environment file using ```source .env```.

Finally, [enable](https://console.developers.google.com/apis/api/plus.googleapis.com/overview) the Google+ API for your project.

#### And Voila

Start Phoenix endpoint with `mix`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

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

## Acknowledgements

Many thanks to the project's contributors for devoting their time, energy, and passion, and additional thanks go out to the leadership of [Stride Consulting](https://www.stride.build) for giving this project the opportunity it needed to bloom.

## License

[MIT](LICENSE)
