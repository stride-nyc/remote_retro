#!/bin/sh
set -e  # Exit on error

# install netcat
apt-get update && apt-get install -y netcat inotify-tools

# install openssl 1.1
cd /usr/local/bin
wget https://www.openssl.org/source/openssl-1.1.1n.tar.gz
tar -xvzf openssl-1.1.1n.tar.gz
cd openssl-1.1.1n
./config
make
make install

# install nvm and npm (and make available)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# install project version of node (24.14.0) and use it
nvm install 24.14.0 && nvm use 24.14.0

# install yarn
npm install -g yarn

# install dependencies
yarn install
