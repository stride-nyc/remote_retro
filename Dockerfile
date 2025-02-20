FROM elixir:1.16.0

COPY ./dockerfile-script.sh ./dockerfile-script.sh

RUN bash ./dockerfile-script.sh && rm ./dockerfile-script.sh

CMD ["tail", "-f", "/dev/null"]
