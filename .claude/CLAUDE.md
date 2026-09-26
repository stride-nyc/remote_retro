# RemoteRetro

RemoteRetro.org is a realtime web app for distributed teams to run Agile retrospectives. Backend is **Elixir/Phoenix** (Ecto, Phoenix Channels); frontend is **React 16 + Redux 3**, communicating with the backend over a Phoenix Channel (not typical HTTP/JSON API calls for realtime state).

## Commands

- `mix test` — backend unit tests (ExUnit; excludes feature tests)
- `mix test.watch` — backend unit tests on file change
- `mix e2e` — Wallaby end-to-end/browser tests
- `yarn test` — frontend unit tests (Mocha/Chai/Sinon/Enzyme)
- `yarn test:watch` — frontend unit tests on file change
- `mix lint` — eslint over the JS/JSX source

## Style basics

- Elixir: formatted per `.formatter.exs` (120 char line length, `import_deps: [:phoenix]`).
- JS/JSX: eslint per `.eslintrc.js` (airbnb + react) — 2-space indent, **no semicolons**, double quotes, `arrow-parens: as-needed`.

## Path-specific conventions

More specific conventions for particular classes of files live under `.claude/rules/` and load automatically when Claude touches a matching file:

- `.claude/rules/backend/` — Phoenix controllers, Ecto models, services, channels, plugs, views
- `.claude/rules/frontend/` — React components, Redux modules, frontend services
- `.claude/rules/tests/` — ExUnit unit tests, Wallaby feature tests, and the three flavors of frontend test (components/redux/services)
