# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

RemoteRetro.org is a realtime web app for distributed teams to run Agile retrospectives. Backend is **Elixir/Phoenix** (Ecto, Phoenix Channels); frontend is **React 16 + Redux 3**, communicating with the backend over a Phoenix Channel (not typical HTTP/JSON API calls for realtime state).

## Commands

### Development

```bash
mix phx.server          # start Phoenix server (port 4000)
npm run watch           # Webpack dev server with hot reload (run alongside phx.server)
mix                     # preflight checks + phx.server
```

### Testing

```bash
mix test                              # backend unit tests (excludes e2e)
mix test path/to/test_file.exs        # single backend test file
mix test path/to/test_file.exs:42     # single test at line number
mix test.watch                        # backend tests in watch mode
mix e2e                               # end-to-end feature tests (Wallaby/ChromeDriver required)
yarn test                             # frontend unit tests (Mocha/Chai/Sinon/Enzyme)
yarn test:watch                       # frontend tests in watch mode
```

### Linting

```bash
mix lint                # ESLint with auto-fix (Elixir uses Freedom Formatter)
```

### Database

```bash
mix ecto.create && mix ecto.migrate                          # dev DB setup
MIX_ENV=test mix ecto.create && mix ecto.migrate             # test DB setup
```

## Style basics

- Elixir: formatted per `.formatter.exs` (120 char line length, `import_deps: [:phoenix]`).
- JS/JSX: eslint per `.eslintrc.js` (airbnb + react) — 2-space indent, **no semicolons**, double quotes, `arrow-parens: as-needed`.

## Path-specific conventions

Per-file-type conventions (backend, frontend, tests) live in `.claude/rules/` and load automatically when a matching file is touched.

## Architecture

RemoteRetro is a real-time collaborative retrospective tool. The stack is Elixir/Phoenix (backend) + React/Redux (frontend) communicating over Phoenix Channels (WebSockets).

### Backend (`lib/`)

- `lib/remote_retro/` -- repo, mailer/emails, and shared constants (`retro_formats.ex`)
- `lib/remote_retro_web/models/` -- core domain models (Retro, Idea, User, Vote, Group, Participation) as Ecto schemas
- `lib/remote_retro_web/channels/` -- the primary integration point (`RetroChannel` plus per-concern handler modules)
- `lib/remote_retro_web/controllers/` -- HTTP layer: auth (Google OAuth), retro CRUD, static pages
- `lib/remote_retro_web/plugs/` -- authentication and authorization middleware
- `lib/remote_retro_web/services/` -- business logic (user management, retro management, schema presentation)
- `lib/tasks/` -- Mix tasks for linting, preflight checks, and e2e test orchestration

The retro lifecycle is driven by state transitions on the `Retro` schema (e.g., `idea-generation` -> `grouping` -> `voting` -> `action-items` -> `done`). Stage transitions broadcast to all channel subscribers.

### Frontend (`web/static/js/`)

- `app.js` -- entry point; sets up Redux store, Phoenix socket connection, and mounts React root
- `services/retro_channel.js` -- Phoenix channel wrapper; pushes events and dispatches Redux actions from broadcasts
- `redux/` -- centralized state: ideas, votes, groups, users, presences, retro metadata
- `components/` -- 40+ React components organized around retro stages (IdeationInterface, GroupingInterface, VotingInterface, ActionItemsInterface, etc.) plus shared UI primitives
- Drag-and-drop uses `react-dnd` with a multi-backend (mouse + touch)

### Data Flow

```
User action -> React component -> RetroChannel.push()
                                       |
                              Phoenix Channel handler
                                       |
                              DB write + broadcast
                                       |
               All connected clients receive broadcast -> Redux dispatch -> re-render
```

### Testing Layers

- **Backend unit tests** (`test/` excluding `test/features/`): ExUnit, no browser, fast
- **End-to-end tests** (`test/features/`): Wallaby + ChromeDriver, full browser, tag `feature_test`
- **Frontend unit tests** (`test/` at project root via yarn): Mocha + Chai + Enzyme, tests components and Redux reducers in isolation

### Key Configuration

- `config/config.exs` -- base config (database, endpoints, email via Bamboo/SendGrid)
- `config/dev.exs` / `config/test.exs` / `config/prod.exs` -- environment overrides
- `webpack.config.js` / `webpack.config.test.js` / `webpack.config.production.js` -- separate Webpack configs per environment
- Deployment: Gigalixir; CI via CircleCI runs unit + e2e tests and deploys every merge to master to staging (`remote-retro-staging`). Production deploys are triggered by pushing a date-based tag (`vYYYY-MM-DD`) via `bin/deploy-production`, which CircleCI's `release` workflow picks up
