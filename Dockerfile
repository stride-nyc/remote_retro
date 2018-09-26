FROM ubuntu:16.04

# Prevent dialog during apt install
ENV DEBIAN_FRONTEND noninteractive

ENV NVM_VERSION v0.33.1

ENV NODE_VERSION 8.7

ENV ASDF_VERSION v0.5.1

RUN apt-get update \
    && apt-get install -y \
        locales \
        curl    \
        wget    \
        gzip    \
        bzip2   \
        unzip   \
        build-essential \
        autoconf \
        libncurses5-dev \
        libssl-dev \
        sudo \
        git  \
        inotify-tools \
    && apt-get clean \
    && rm -fr /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Set the locale
RUN sed -i -e 's/# \(en_US\.UTF-8 .*\)/\1/' /etc/locale.gen \
    && locale-gen
ENV LANG en_US.UTF-8  
ENV LANGUAGE en_US:en  
ENV LC_ALL en_US.UTF-8

ENV USER retro
ENV HOME /home/${USER}

# Add user as non-root user
RUN useradd -ms /bin/bash ${USER}

# Set sudoer for user
RUN echo "${USER} ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

# Switch to user from now
USER ${USER}

COPY .tool-versions /app/
RUN sudo chown -R ${USER}:${USER} /app

WORKDIR /app

# https://github.com/stride-nyc/remote_retro#elixirphoenix-dependencies
# Install the asdf version manager
RUN git clone https://github.com/asdf-vm/asdf.git ${HOME}/.asdf --branch ${ASDF_VERSION}

RUN chmod +x ${HOME}/.asdf/asdf.sh

ENV PATH="${PATH}:${HOME}/.asdf/shims:${HOME}/.asdf/bin"

# Install Erlang, Elixir
RUN /bin/bash -c "asdf plugin-add erlang https://github.com/HashNuke/asdf-erlang.git;" \
    && /bin/bash -c "asdf install erlang $(awk '/erlang/ { print $2 }' .tool-versions)"

RUN /bin/bash -c "asdf plugin-add elixir https://github.com/HashNuke/asdf-elixir.git;" \
    && /bin/bash -c "asdf install elixir $(awk '/elixir/ { print $2 }' .tool-versions)"

# https://github.com/trilogy-group/remote_retro#node-dependencies
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/$NVM_VERSION/install.sh | bash

# needed by nvm install
ENV NVM_DIR ${HOME}/.nvm

RUN . ${NVM_DIR}/nvm.sh &&\
    nvm install ${NODE_VERSION} &&\
    npm install -g yarn phantomjs chromedriver &&\
    yarn

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-${DOCKERIZE_VERSION}.tar.gz \
    && sudo tar -C /usr/local/bin -xzf dockerize-linux-amd64-${DOCKERIZE_VERSION}.tar.gz \
    && rm dockerize-linux-amd64-${DOCKERIZE_VERSION}.tar.gz

EXPOSE 4000 5001

VOLUME [ "/app" ]

CMD [ "tail", "-f", "/dev/null" ]
