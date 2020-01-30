[![CircleCI](https://circleci.com/gh/stride-nyc/remote_retro.svg?style=shield)](https://circleci.com/gh/stride-nyc/remote_retro)
[![Coverage Status](https://coveralls.io/repos/github/stride-nyc/remote_retro/badge.svg)](https://coveralls.io/github/stride-nyc/remote_retro?branch=master)

# RemoteRetro

This repository houses the application code for [RemoteRetro](http://remoteretro.org), a web app that allows distributed teams to conduct effective Agile retrospectives. It is written in Elixir/Phoenix/React/Redux, and is sponsored by [Stride Consulting](http://stridenyc.com).

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

  # (follow directions supplied by brew output upon successful installation)

createdb

# depending on how you installed postgres, this user may already exist
createuser -s postgres

# make sure you can log in to default database
psql -h localhost
```

#### Elixir/Phoenix Dependencies
  - [Install the asdf version manager](https://asdf-vm.com/#/core-manage-asdf-vm)
  - Install Erlang, Elixir, and their dependencies by running `bin/install_erlang_and_elixir_with_dependencies`
  - Compile the project and custom mix tasks via `mix compile`
  - Create the "remote_retro_dev" database and migrate via `mix ecto.create && mix ecto.migrate`
  - Create the "remote_retro_test" database and migrate via `MIX_ENV=test mix ecto.create && mix ecto.migrate`

#### Node Dependencies
  - [Ensure you have the asdf version manager installed](https://asdf-vm.com/#/core-manage-asdf-vm)
  - Install the `asdf-nodejs` plugin per the instructions at https://github.com/asdf-vm/asdf-nodejs
  - Install the project's Node version and Node dependencies by running `bin/install_node_with_dependencies`

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

Finally, [enable](https://console.developers.google.com/apis/api/plus.googleapis.com/overview) the Google+ API for your project.

#### And Voila!

Start Phoenix endpoint with `mix`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

## Tests

To continually execute the backend unit tests on file change:

```
mix test.watch
```

To execute the backend unit tests manually:

```
mix test
```

To execute the end-to-end tests:

```
mix e2e
```

To continually execute the client-side unit tests on file change:

```
yarn test:watch
```

To execute the client-side unit tests manually:

```
yarn test
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
