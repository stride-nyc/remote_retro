# Dockerized nvm development environment
#
# This Dockerfile is for building nvm development environment only,
# not for any distribution/production usage.
#
# Please note that it'll use about 1.2 GB disk space and about 15 minutes to
# build this image, it depends on your hardware.

# Use Ubuntu Trusty Tahr as base image as we're using on Travis CI
# I also tested with Ubuntu 16.04, should be good with it!
FROM ubuntu:16.04
# LABEL maintainer="Peter Dave Hello <hsu@peterdavehello.org>"
# LABEL name="nvm-dev-env"
# LABEL version="latest"

# Set the SHELL to bash with pipefail option
# SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Prevent dialog during apt install
ENV DEBIAN_FRONTEND noninteractive


ENV NVM_VERSION v0.33.1

ENV NODE_VERSION 8.7

# ShellCheck version
# ENV SHELLCHECK_VERSION=0.5.0

# Pick a Ubuntu apt mirror site for better speed
# ref: https://launchpad.net/ubuntu/+archivemirrors
# ENV UBUNTU_APT_SITE ubuntu.cs.utah.edu

# Disable src package source
# RUN sed -i 's/^deb-src\ /\#deb-src\ /g' /etc/apt/sources.list

# Replace origin apt package site with the mirror site
# RUN sed -E -i "s/([a-z]+.)?archive.ubuntu.com/$UBUNTU_APT_SITE/g" /etc/apt/sources.list
# RUN sed -i "s/security.ubuntu.com/$UBUNTU_APT_SITE/g" /etc/apt/sources.list

# Install apt packages
# RUN apt-get update         && \
#     apt-get upgrade -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold"  && \
#     apt-get install -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold"     \
#         coreutils             \
#         util-linux            \
#         bsdutils              \
#         file                  \
#         openssl               \
#         ca-certificates       \
#         ssh                   \
#         wget                  \
#         patch                 \
#         sudo                  \
#         htop                  \
#         dstat                 \
#         vim                   \
#         tmux                  \
#         curl                  \
#         git                   \
#         jq                    \
#         realpath              \
#         zsh                   \
#         ksh                   \
#         gcc-4.8               \
#         g++-4.8               \
#         xz-utils              \
#         build-essential       \
#         locales               \
#         bash-completion       && \
#     apt-get clean

# ShellCheck with Ubuntu 14.04 container workaround
# RUN wget https://storage.googleapis.com/shellcheck/shellcheck-v$SHELLCHECK_VERSION.linux.x86_64.tar.xz -O- | \
#     tar xJvf - shellcheck-v$SHELLCHECK_VERSION/shellcheck          && \
#     mv shellcheck-v$SHELLCHECK_VERSION/shellcheck /bin             && \
#     rmdir shellcheck-v$SHELLCHECK_VERSION                          && \
#     touch /tmp/libc.so.6                                           && \
#     echo "alias shellcheck='LD_LIBRARY_PATH=/tmp /bin/shellcheck'" >> /etc/bash.bashrc
# RUN LD_LIBRARY_PATH=/tmp shellcheck -V

RUN apt-get update &&\
    apt-get install -y \
    locales \
    curl    \
    bzip2   \
    unzip   \
    build-essential \
    autoconf \
    libncurses5-dev \
    libssl-dev \
    git     &&\
    apt-get clean

# Set locale
RUN locale-gen en_US.UTF-8

# Print tool versions
# RUN bash --version | head -n 1
# RUN zsh --version
# RUN ksh --version || true
# RUN dpkg -s dash | grep ^Version | awk '{print $2}'
# RUN git --version
# RUN curl --version
# RUN wget --version

# https://github.com/stride-nyc/remote_retro#elixirphoenix-dependencies
# Install the asdf version manager
RUN git clone https://github.com/asdf-vm/asdf.git /asdf --branch v0.5.1

# RUN $HOME/.asdf/asdf.sh && 

RUN chmod +x /asdf/asdf.sh

# Add user "nvm" as non-root user
RUN useradd -ms /bin/bash nvm

# Copy and set permission for nvm directory
COPY . /app/
# RUN chown nvm:nvm -R "home/nvm/.nvm"

# Set sudoer for "nvm"
RUN echo 'nvm ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers

RUN echo -e '\n. /asdf/asdf.sh' >> ~/.bashrc
RUN echo -e '\n. /asdf/completions/asdf.bash' >> ~/.bashrc

RUN /bin/bash -c "source ~/.bashrc"

ENV PATH="${PATH}:/asdf/shims:/asdf/bin"

RUN chown -R nvm:nvm /asdf

WORKDIR /app

# Switch to user "nvm" from now
USER nvm

# Install Erlang, Elixir, and their dependencies by running bin/install_erlang_and_elixir_with_dependencies
# RUN $HOME/.asdf/asdf.sh && bin/install_erlang_and_elixir_with_dependencies
# RUN /bin/bash -c "${PATH}:/asdf/shims:/asdf/bin" && /bin/bash -c "bin/install_erlang_and_elixir_with_dependencies"
RUN bin/install_erlang_and_elixir_with_dependencies

# Compile the project and custom mix tasks via mix compile
RUN /asdf/asdf.sh && mix compile

# TODO: Create the "remote_retro_dev" database and migrate via mix ecto.create && mix ecto.migrate

# RUN echo $NVM_VERSION
# RUN echo https://raw.githubusercontent.com/creationix/nvm/$NVM_VERSION/install.sh

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/$NVM_VERSION/install.sh | bash

#needed by nvm install
ENV NVM_DIR /home/nvm/.nvm

RUN . ~/.nvm/nvm.sh &&\
    nvm install ${NODE_VERSION} &&\
    nvm alias default ${NODE_VERSION} &&\
    npm install -g yarn phantomjs chromedriver &&\
    yarn
# # nvm
RUN echo 'export NVM_DIR="$HOME/.nvm"'                                       >> "$HOME/.bashrc"
RUN echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm' >> "$HOME/.bashrc"
RUN echo '[ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion" # This loads nvm bash_completion' >> "$HOME/.bashrc"

# RUN source $HOME/.bashrc
# RUN nvm install ${NODE_VERSION} &&\
#     nvm alias default ${NODE_VERSION}
# RUN npm install -g yarn phantomjs chromedriver &&\
#     yarn
# # nodejs and tools
# RUN bash -c 'source $HOME/.nvm/nvm.sh   && \
#     nvm install node                    && \
#     npm install -g doctoc urchin eclint dockerfile_lint && \
#     npm install --prefix "$HOME/.nvm/"'

# Set WORKDIR to nvm directory
#  WORKDIR /home/nvm/.nvm

# ENTRYPOINT ["/bin/bash"]
