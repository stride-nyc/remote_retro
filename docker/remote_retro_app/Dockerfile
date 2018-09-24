FROM ubuntu:16.04

# Prevent dialog during apt install
ENV DEBIAN_FRONTEND noninteractive

ENV NVM_VERSION v0.33.1

ENV NODE_VERSION 8.7

ENV ERLANG_VERSION 20.3.8.3

ENV ELIXIR_VERSION 1.5.3

RUN apt-get update &&\
    apt-get install -y \
    locales \
    curl    \
    gzip    \
    bzip2   \
    unzip   \
    build-essential \
    autoconf \
    libncurses5-dev \
    libssl-dev \
    sudo \
    git     &&\
    apt-get clean

# Set the locale
RUN sed -i -e 's/# \(en_US\.UTF-8 .*\)/\1/' /etc/locale.gen && \
    locale-gen
ENV LANG en_US.UTF-8  
ENV LANGUAGE en_US:en  
ENV LC_ALL en_US.UTF-8

### # # Set locale
RUN cat /etc/default/locale

# Add user "nvm" as non-root user
RUN useradd -ms /bin/bash nvm

# Set sudoer for "nvm"
RUN echo 'nvm ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers

# Switch to user "nvm" from now
USER nvm

# https://github.com/stride-nyc/remote_retro#elixirphoenix-dependencies
# Install the asdf version manager
RUN git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.5.1

# RUN $HOME/.asdf/asdf.sh && 

RUN chmod +x ~/.asdf/asdf.sh


# RUN chown nvm:nvm -R "home/nvm/.nvm"

RUN echo -e '\n. ~/.asdf/asdf.sh' >> ~/.bashrc
RUN echo -e '\n. ~/.asdf/completions/asdf.bash' >> ~/.bashrc

RUN /bin/bash -c "source ~/.bashrc"

ENV PATH="${PATH}:~/.asdf/shims:~/.asdf/bin"

### # Switch to user "nvm" from now
### USER nvm

# RUN /bin/bash -c "asdf plugin-add erlang https://github.com/HashNuke/asdf-erlang.git;"
RUN /bin/bash -c "asdf plugin-add erlang https://github.com/HashNuke/asdf-erlang.git;" &&\
    /bin/bash -c "asdf install erlang $ERLANG_VERSION"
    # /bin/bash -c "asdf install erlang $(awk '/erlang/ { print $2 }' .tool-versions)"


RUN /bin/bash -c "asdf plugin-add elixir https://github.com/HashNuke/asdf-elixir.git;" &&\
    /bin/bash -c "asdf install elixir $ELIXIR_VERSION"
    # /bin/bash -c "asdf install elixir $(awk '/elixir/ { print $2 }' .tool-versions)"

# Copy and set permission for /app directory
COPY . /app/

RUN sudo chown -R nvm:nvm /app

WORKDIR /app

ENV PATH="${PATH}:/home/nvm/.asdf/shims:/home/nvm/.asdf/bin"

RUN /bin/bash -c "mix local.hex --force"

 # printGreenLine "Ensuring Erlang's 'rebar3' compilation tool is available and up to date";
RUN /bin/bash -c "mix local.rebar --force"

 # printGreenLine "Cleaning dependencies, fetching fresh dependencies, and compiling for Elixir $elixir_version...";
RUN /bin/bash -c "mix deps.clean --all"
RUN /bin/bash -c "mix deps.get"
RUN /bin/bash -c "mix deps.compile"
# RUN /bin/bash -c "erlang_version=$(awk '/erlang/ { print $2 }' .tool-versions) && asdf install erlang ${erlang_version}"
# >>>> RUN /bin/bash -c "erlang_version=$(awk '/erlang/ { print $2 }' .tool-versions)"
# >>>> RUN /bin/bash -c "asdf install erlang ${erlang_version}"
####### Install Erlang, Elixir, and their dependencies by running bin/install_erlang_and_elixir_with_dependencies
####### RUN $HOME/.asdf/asdf.sh && bin/install_erlang_and_elixir_with_dependencies
# RUN bin/install_erlang_and_elixir_with_dependencies

# Compile the project and custom mix tasks via mix compile
RUN /bin/bash -c "mix compile"
### 
### # TODO: Create the "remote_retro_dev" database and migrate via mix ecto.create && mix ecto.migrate
### 
### # RUN echo $NVM_VERSION
### # RUN echo https://raw.githubusercontent.com/creationix/nvm/$NVM_VERSION/install.sh
### 
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
