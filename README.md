# RemoteRetro

To start your Phoenix app:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  * Install the yarn package manager for sane node package management `npm install yarn`
  * Node Global Installs
    - PhantomJS for headless browser testing: `yarn global add phantomjs`
    - Mocha for JS unit test executable: `yarn global add mocha`
  * Install local node dependencies with `yarn`
  * Start Phoenix endpoint with `mix`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

#### Tests

Backend Unit Tests + Wallaby Feature Specs

```
mix test
```

Client-side Unit Tests

```
mocha
```
