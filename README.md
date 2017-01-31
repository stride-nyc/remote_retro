# RemoteRetro

To start your Phoenix app:

  * Install elixir dependencies with `mix deps.get`
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

To continually execute the backend tests on file change:

```
mix test.watch
```

To continually execute the client-side unit tests, run:

```
mocha --watch
```

## Code

To run the local eslint:

```
mix lint
```
