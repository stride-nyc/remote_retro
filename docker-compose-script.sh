#!/bin/sh
set -e  # Exit on error

# add the elixir package manager

mix local.hex --force

# add erlang's compilation tool

mix local.rebar --force

# clean and compile dependencies/project
rm -rf _build/
mix deps.clean --all
mix deps.get
mix deps.compile
mix compile

# install project version of node (18.19.0) and use it

nvm install 18.19.0 && nvm use 18.19.0

# install yarn

npm install -g yarn

# install dependencies

yarn install

# wait for db to be available before continuing

echo "Waiting for database..."
while ! nc -z db 5432; do sleep 1; done

# run migrations
mix ecto.create && mix ecto.migrate
MIX_ENV=test mix ecto.create && mix ecto.migrate

# run project
mix
