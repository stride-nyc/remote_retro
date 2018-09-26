# RemoteRetro on Docker

Development environment is also available on Docker. This setup is a Docker Compose environment, a container with all the dependencies, and a db backend, all ready to start development.

## Dev Environment Setup

### Install Docker and Docker Compose
You will need Docker and Docker Compose to kickstart development environment.

Check installation instructions for
- Docker: https://docs.docker.com/install/
- Docker Compose: https://docs.docker.com/compose/install/

### Google OAuth

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

## Managing development environment

Development environment is started and stopped via `docker-compose` commands.

#### Starting dev environment

```sh
cd <project_root_dir>
docker-compose pull
docker-compose up -d
```

__NOTE:__ here we use `docker-compose pull` to be able to use the image already pushed to docker.hub registry, otherwise `docker-compose up` will build the image locally before running the environment.

#### Stopping dev environment

```sh
cd <project_root_dir>
docker-compose down
```

#### Updating dev environment

Docker images used by the dev environment already includes Erlang, and Elixir versions defined in `.tool-versions` file, and `nvm v0.33.1`, `node 8.7`. If you have updates in `.tool-versions` file for Erlang/Elixir versions, or need to update `nvm`/`node` versions, you can use `docker-compose build` command for this.

for `.tool-versions` updates, running `docker-compose build` is enough. It will fetch new versions from file and build the images properly.

for `nvm`/`node` updates, ENV variables in Dockerfile, NVM_VERSION and NODE_VERSION respectively, should be updated before running `docker-compose build` command.

i.e. building the image, after updating `.tools-versions` and/or Dockerfile ENV variables for NVM_VERSION and/or NODE_VERSION,

```sh
cd <project_root_dir>
docker-compose build
```

If you want your new image to be shared with everyone else, then you can use `docker-compose push` command to push it to docker.hub.

```sh
cd <project_root_dir>
docker-compose push
```

__NOTE:__ to be able to push the image, first you need to login to docker.hub with your own credentials via `docker login` command, and update `image: ` entry for `dev` service in `docker-compose.yaml` file with your own namespace and image name, such as <your_docker_hub_id>/remote_retro_dev.

## Connect to Docker container and start development

```sh
docker-compose exec dev /bin/bash
```

#### Elixir/Phoenix Dependencies
  - [x] asdf version manager (already installed)
  - [x] Erlang, Elixir (already installed)
  - [ ] Install Erlang, Elixir dependencies by running `bin/install_erlang_and_elixir_with_dependencies`
  - [ ] Compile the project and custom mix tasks via `mix compile`
  - [ ] Create the "remote_retro_dev" database and migrate via `mix ecto.create && mix ecto.migrate`

#### Node Dependencies
- [x] nvm (node version manager) (already installed)
- [x] node (already installed)
- [x] yarn phantomjs chromedriver (already installed)
- [ ] Install Local NPM Packages via Yarn
```
yarn
```

#### And Voila!

Start Phoenix endpoint with `mix`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

## Tests

```sh
docker-compose exec dev /bin/bash
```

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

```sh
docker-compose exec dev /bin/bash
```

To run the local eslint:

```
mix lint
```
