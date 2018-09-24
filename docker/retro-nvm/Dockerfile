# Dockerized nvm development environment
FROM retro-elixir-phoenix
# LABEL maintainer="Peter Dave Hello <hsu@peterdavehello.org>"
# LABEL name="nvm-dev-env"
# LABEL version="latest"

# Set the SHELL to bash with pipefail option
# SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Prevent dialog during apt install
ENV DEBIAN_FRONTEND noninteractive


ENV NVM_VERSION v0.33.1

ENV NODE_VERSION 8.7

ENV ERLANG_VERSION 20.3.8.3

ENV ELIXIR_VERSION 1.5.3
# Switch to user "nvm" from now
USER nvm

# Copy and set permission for /app directory
COPY . /app/

RUN sudo chown -R nvm:nvm /app

WORKDIR /app

ENV PATH="${PATH}:/home/nvm/.asdf/shims:/home/nvm/.asdf/bin"


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
### # # nvm
### RUN echo 'export NVM_DIR="$HOME/.nvm"'                                       >> "$HOME/.bashrc"
### RUN echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm' >> "$HOME/.bashrc"
### RUN echo '[ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion" # This loads nvm bash_completion' >> "$HOME/.bashrc"
### 
### # RUN source $HOME/.bashrc
### # RUN nvm install ${NODE_VERSION} &&\
### #     nvm alias default ${NODE_VERSION}
### # RUN npm install -g yarn phantomjs chromedriver &&\
### #     yarn
### # # nodejs and tools
### # RUN bash -c 'source $HOME/.nvm/nvm.sh   && \
### #     nvm install node                    && \
### #     npm install -g doctoc urchin eclint dockerfile_lint && \
### #     npm install --prefix "$HOME/.nvm/"'
### 
### # Set WORKDIR to nvm directory
### #  WORKDIR /home/nvm/.nvm
### 
### # ENTRYPOINT ["/bin/bash"]
### 