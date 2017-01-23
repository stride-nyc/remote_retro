# RemoteRetro

To start your Phoenix app:

  * Install elixir dependencies with `mix deps.get`
  * Compile the project and custom mix tasks via `mix compile`
  * Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  * Install the yarn package manager for sane node package management `npm install yarn`
  * Node Dependencies
    - Global
      - PhantomJS for headless browser testing: `yarn global add phantomjs`
      - Mocha for JS unit test executable: `yarn global add mocha`
    - Local
      - `yarn`
  * Start Phoenix endpoint with `mix`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

## Tests

To execute the backend unit tests + Wallaby feature specs, run:

```
mix test
```

To execute the client-side unit tests, run:

```
mocha
```
